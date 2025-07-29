from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.produce import DeliveryRoute, DeliveryStop, ProduceRequest
from app.models.user import User
from app.schemas.produce import (
    DeliveryRouteCreate, 
    DeliveryRouteResponse,
    DeliveryStopResponse
)
from app.utils.auth_dependency import verify_firebase_token
from app.services.route_optimizer import optimize_route_from_requests

router = APIRouter(prefix="/api/routes", tags=["routes"])

@router.post("/from-requests", response_model=DeliveryRouteResponse)
async def create_route_from_requests(
    route_data: DeliveryRouteCreate,
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """Generate route from selected produce requests"""
    seller = db.query(User).filter(User.firebase_uid == firebase_user["uid"]).first()
    if not seller:
        raise HTTPException(status_code=404, detail="User not found")
    
    if seller.role != "farmer":
        raise HTTPException(status_code=403, detail="Only farmers can create delivery routes")

    # Verify all requests are assigned to this seller
    requests = db.query(ProduceRequest).filter(
        ProduceRequest.id.in_(route_data.request_ids),
        ProduceRequest.assigned_seller_id == seller.id
    ).all()
    
    if len(requests) != len(route_data.request_ids):
        raise HTTPException(status_code=400, detail="Some requests are not assigned to you")

    # Create delivery route
    new_route = DeliveryRoute(
        seller_id=seller.id,
        route_name=route_data.route_name,
        pickup_location=route_data.pickup_location,
        pickup_latitude=route_data.pickup_latitude,
        pickup_longitude=route_data.pickup_longitude,
        delivery_date=route_data.delivery_date
    )
    db.add(new_route)
    db.commit()
    db.refresh(new_route)

    # Create delivery stops and optimize route
    await create_optimized_stops(new_route, requests, db)

    return new_route

async def create_optimized_stops(route: DeliveryRoute, requests: List[ProduceRequest], db: Session):
    """Create and optimize delivery stops for a route"""
    # Use the existing route optimizer
    from app.models.route import RouteRequest, Stop
    
    stops_data = [Stop(address=req.delivery_address) for req in requests]
    route_request = RouteRequest(pickup=route.pickup_location, stops=stops_data)
    
    # Get optimized route
    optimized = await optimize_route_from_requests(route_request)
    
    # Create delivery stops in optimized order
    for i, optimized_stop in enumerate(optimized.stops):
        # Find matching request by address
        matching_request = next(
            (req for req in requests if req.delivery_address == optimized_stop.address),
            None
        )
        
        if matching_request:
            stop = DeliveryStop(
                route_id=route.id,
                request_id=matching_request.id,
                stop_order=i + 1,
                address=optimized_stop.address,
                latitude=optimized_stop.location[1],
                longitude=optimized_stop.location[0],
                estimated_arrival=None  # Could calculate based on route timing
            )
            db.add(stop)
    
    # Update route with optimization results
    route.total_distance_miles = optimized.total_distance_miles
    route.estimated_duration_minutes = optimized.total_eta
    
    db.commit()

@router.get("/active", response_model=List[DeliveryRouteResponse])
async def get_active_routes(
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """Get active delivery routes for seller"""
    seller = db.query(User).filter(User.firebase_uid == firebase_user["uid"]).first()
    if not seller:
        raise HTTPException(status_code=404, detail="User not found")

    routes = db.query(DeliveryRoute).filter(
        DeliveryRoute.seller_id == seller.id,
        DeliveryRoute.status.in_(["planned", "active"])
    ).all()
    
    return routes

@router.post("/{route_id}/optimize")
async def re_optimize_route(
    route_id: int,
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """Re-optimize existing route"""
    seller = db.query(User).filter(User.firebase_uid == firebase_user["uid"]).first()
    if not seller:
        raise HTTPException(status_code=404, detail="User not found")

    route = db.query(DeliveryRoute).filter(
        DeliveryRoute.id == route_id,
        DeliveryRoute.seller_id == seller.id
    ).first()
    
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    # Get current stops and requests
    stops = db.query(DeliveryStop).filter(DeliveryStop.route_id == route_id).all()
    request_ids = [stop.request_id for stop in stops]
    requests = db.query(ProduceRequest).filter(ProduceRequest.id.in_(request_ids)).all()

    # Delete old stops
    for stop in stops:
        db.delete(stop)
    
    # Re-create optimized stops
    await create_optimized_stops(route, requests, db)
    
    return {"message": "Route re-optimized successfully"}

@router.put("/{route_id}/status")
async def update_route_status(
    route_id: int,
    status: str,
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """Update delivery route status"""
    seller = db.query(User).filter(User.firebase_uid == firebase_user["uid"]).first()
    if not seller:
        raise HTTPException(status_code=404, detail="User not found")

    route = db.query(DeliveryRoute).filter(
        DeliveryRoute.id == route_id,
        DeliveryRoute.seller_id == seller.id
    ).first()
    
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    if status not in ["planned", "active", "completed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    route.status = status
    db.commit()
    
    return {"message": f"Route status updated to {status}"}

@router.get("/{route_id}/stops", response_model=List[DeliveryStopResponse])
async def get_route_stops(
    route_id: int,
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """Get stops for a specific route"""
    seller = db.query(User).filter(User.firebase_uid == firebase_user["uid"]).first()
    if not seller:
        raise HTTPException(status_code=404, detail="User not found")

    route = db.query(DeliveryRoute).filter(
        DeliveryRoute.id == route_id,
        DeliveryRoute.seller_id == seller.id
    ).first()
    
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    stops = db.query(DeliveryStop).filter(
        DeliveryStop.route_id == route_id
    ).order_by(DeliveryStop.stop_order).all()
    
    return stops
