from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Header
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.produce import ProduceRequest
from app.models.user import User
from app.schemas.produce import MenurithmWebhookRequest, MenurithmWebhookUpdate
from app.services.menurithm_api import menurithm_client
from datetime import datetime
import logging
import hmac
import hashlib
import os

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])
logger = logging.getLogger(__name__)

def verify_menurithm_signature(payload: bytes, signature: str) -> bool:
    """Verify Menurithm webhook signature"""
    webhook_secret = os.getenv("MENURITHM_WEBHOOK_SECRET")
    if not webhook_secret:
        logger.warning("MENURITHM_WEBHOOK_SECRET not configured")
        return True  # Allow in development
    
    expected_signature = hmac.new(
        webhook_secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(f"sha256={expected_signature}", signature)

@router.post("/menurithm/request")
async def receive_menurithm_request(
    webhook_data: MenurithmWebhookRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    x_menurithm_signature: str = Header(None)
):
    """Receive new produce request from Menurithm"""
    try:
        # Verify webhook signature (if configured)
        if x_menurithm_signature and os.getenv("MENURITHM_WEBHOOK_SECRET"):
            # Note: In production, you'd want to verify against raw request body
            # This is a simplified version
            if not verify_menurithm_signature(
                webhook_data.model_dump_json().encode(), 
                x_menurithm_signature
            ):
                raise HTTPException(status_code=401, detail="Invalid webhook signature")
        
        logger.info(f"Received Menurithm webhook for request: {webhook_data.request_id}")
        
        # Parse delivery window (assuming format like "Today, 10am-12pm")
        delivery_window_start, delivery_window_end = parse_delivery_window(webhook_data.delivery_window)
        
        # Create produce request
        new_request = ProduceRequest(
            restaurant_id=None,  # Will be linked when restaurant registers
            restaurant_name=webhook_data.restaurant_name,
            produce_type=webhook_data.produce_type,
            quantity_needed=parse_quantity(webhook_data.quantity),
            unit="kg",  # Default unit, could be parsed from quantity string
            delivery_address=webhook_data.delivery_address,
            delivery_window_start=delivery_window_start,
            delivery_window_end=delivery_window_end,
            special_requirements=webhook_data.special_requirements,
            menurithm_request_id=webhook_data.request_id,
            status="pending"
        )
        
        db.add(new_request)
        db.commit()
        db.refresh(new_request)
        
        # Add background task to notify relevant farmers
        background_tasks.add_task(notify_farmers_of_new_request, new_request.id, db)
        
        logger.info(f"Created new request from Menurithm: {webhook_data.request_id}")
        
        return {
            "status": "success",
            "message": "Request received and processed",
            "internal_id": new_request.id
        }
        
    except Exception as e:
        logger.error(f"Error processing Menurithm request: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error processing request: {str(e)}")

@router.post("/menurithm/update")
async def receive_menurithm_update(
    webhook_data: MenurithmWebhookUpdate,
    db: Session = Depends(get_db)
):
    """Receive updates to existing requests from Menurithm"""
    try:
        request = db.query(ProduceRequest).filter(
            ProduceRequest.menurithm_request_id == webhook_data.request_id
        ).first()
        
        if not request:
            raise HTTPException(status_code=404, detail="Request not found")
        
        # Update request status and any other fields
        request.status = webhook_data.status
        
        # Apply any additional updates from the webhook
        for field, value in webhook_data.updates.items():
            if hasattr(request, field):
                setattr(request, field, value)
        
        db.commit()
        
        logger.info(f"Updated request from Menurithm: {webhook_data.request_id}")
        
        return {
            "status": "success",
            "message": "Request updated successfully"
        }
        
    except Exception as e:
        logger.error(f"Error updating Menurithm request: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error updating request: {str(e)}")

@router.get("/menurithm/status")
async def check_integration_status():
    """Check Menurithm integration health"""
    return {
        "status": "healthy",
        "integration": "menurithm",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0"
    }

def parse_delivery_window(delivery_window: str) -> tuple[datetime, datetime]:
    """Parse delivery window string into start and end datetimes"""
    # Simple parser for formats like "Today, 10am-12pm" or "Tomorrow, 9am-11am"
    # In production, this would be more robust
    
    import re
    from datetime import datetime, timedelta
    
    # Extract day and time range
    day_match = re.search(r'(Today|Tomorrow)', delivery_window)
    time_match = re.search(r'(\d+)(am|pm)-(\d+)(am|pm)', delivery_window)
    
    if not day_match or not time_match:
        # Default to next 2 hours if parsing fails
        start = datetime.now()
        end = start + timedelta(hours=2)
        return start, end
    
    # Calculate base date
    base_date = datetime.now().date()
    if day_match.group(1) == "Tomorrow":
        base_date += timedelta(days=1)
    
    # Parse start time
    start_hour = int(time_match.group(1))
    if time_match.group(2) == "pm" and start_hour != 12:
        start_hour += 12
    elif time_match.group(2) == "am" and start_hour == 12:
        start_hour = 0
    
    # Parse end time
    end_hour = int(time_match.group(3))
    if time_match.group(4) == "pm" and end_hour != 12:
        end_hour += 12
    elif time_match.group(4) == "am" and end_hour == 12:
        end_hour = 0
    
    start_datetime = datetime.combine(base_date, datetime.min.time().replace(hour=start_hour))
    end_datetime = datetime.combine(base_date, datetime.min.time().replace(hour=end_hour))
    
    return start_datetime, end_datetime

def parse_quantity(quantity_str: str) -> float:
    """Parse quantity string like '20kg' into numeric value"""
    import re
    
    # Extract numeric part
    match = re.search(r'(\d+(?:\.\d+)?)', quantity_str)
    if match:
        return float(match.group(1))
    return 0.0

async def notify_farmers_of_new_request(request_id: int, db: Session):
    """Background task to notify farmers of new produce request"""
    # This would implement notification logic (email, push notifications, etc.)
    # For now, just log the event
    logger.info(f"Would notify farmers of new request: {request_id}")
    pass
