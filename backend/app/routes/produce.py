from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.produce import ProduceInventory
from app.models.user import User
from app.schemas.produce import (
    ProduceInventoryCreate, 
    ProduceInventoryUpdate, 
    ProduceInventoryResponse
)
from app.utils.auth_dependency import verify_firebase_token
from app.services.menurithm_api import menurithm_client

router = APIRouter(prefix="/api/produce", tags=["produce"])

@router.post("/inventory", response_model=ProduceInventoryResponse)
async def create_produce_inventory(
    inventory: ProduceInventoryCreate,
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """Add new produce items to seller's inventory"""
    # Get seller from firebase_uid
    seller = db.query(User).filter(User.firebase_uid == firebase_user["uid"]).first()
    if not seller:
        raise HTTPException(status_code=404, detail="User not found")
    
    if seller.role != "farmer":
        raise HTTPException(status_code=403, detail="Only farmers can add produce inventory")

    new_inventory = ProduceInventory(
        seller_id=seller.id,
        **inventory.model_dump()
    )
    db.add(new_inventory)
    db.commit()
    db.refresh(new_inventory)
    return new_inventory

@router.get("/inventory", response_model=List[ProduceInventoryResponse])
async def get_seller_inventory(
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """Get seller's produce inventory"""
    seller = db.query(User).filter(User.firebase_uid == firebase_user["uid"]).first()
    if not seller:
        raise HTTPException(status_code=404, detail="User not found")

    inventory = db.query(ProduceInventory).filter(
        ProduceInventory.seller_id == seller.id
    ).all()
    return inventory

@router.put("/inventory/{inventory_id}", response_model=ProduceInventoryResponse)
async def update_produce_inventory(
    inventory_id: int,
    updates: ProduceInventoryUpdate,
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """Update produce inventory item"""
    seller = db.query(User).filter(User.firebase_uid == firebase_user["uid"]).first()
    if not seller:
        raise HTTPException(status_code=404, detail="User not found")

    inventory = db.query(ProduceInventory).filter(
        ProduceInventory.id == inventory_id,
        ProduceInventory.seller_id == seller.id
    ).first()
    
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    # Update only provided fields
    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(inventory, field, value)

    db.commit()
    db.refresh(inventory)
    return inventory

@router.delete("/inventory/{inventory_id}")
async def delete_produce_inventory(
    inventory_id: int,
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """Remove produce inventory item"""
    seller = db.query(User).filter(User.firebase_uid == firebase_user["uid"]).first()
    if not seller:
        raise HTTPException(status_code=404, detail="User not found")

    inventory = db.query(ProduceInventory).filter(
        ProduceInventory.id == inventory_id,
        ProduceInventory.seller_id == seller.id
    ).first()
    
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    db.delete(inventory)
    db.commit()
    return {"message": "Inventory item deleted successfully"}

@router.get("/available", response_model=List[ProduceInventoryResponse])
async def get_available_produce(
    produce_type: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    organic_only: bool = Query(False),
    max_price: Optional[float] = Query(None),
    skip: int = Query(0),
    limit: int = Query(50),
    db: Session = Depends(get_db)
):
    """Get all available produce (public endpoint)"""
    query = db.query(ProduceInventory).filter(
        ProduceInventory.is_available == True,
        ProduceInventory.quantity_available > 0
    )

    if produce_type:
        query = query.filter(ProduceInventory.produce_type.ilike(f"%{produce_type}%"))
    
    if location:
        query = query.filter(ProduceInventory.location.ilike(f"%{location}%"))
    
    if organic_only:
        query = query.filter(ProduceInventory.organic == True)
    
    if max_price:
        query = query.filter(ProduceInventory.price_per_unit <= max_price)

    return query.offset(skip).limit(limit).all()

@router.get("/search", response_model=List[ProduceInventoryResponse])
async def search_produce(
    q: str = Query(..., description="Search query"),
    db: Session = Depends(get_db)
):
    """Search produce by type, variety, or description"""
    query = db.query(ProduceInventory).filter(
        ProduceInventory.is_available == True,
        ProduceInventory.quantity_available > 0
    ).filter(
        ProduceInventory.produce_type.ilike(f"%{q}%") |
        ProduceInventory.variety.ilike(f"%{q}%") |
        ProduceInventory.description.ilike(f"%{q}%")
    )
    
    return query.all()

@router.get("/seller/{seller_id}", response_model=List[ProduceInventoryResponse])
async def get_seller_produce(
    seller_id: int,
    db: Session = Depends(get_db)
):
    """Get specific seller's available produce"""
    seller = db.query(User).filter(User.id == seller_id).first()
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")

    inventory = db.query(ProduceInventory).filter(
        ProduceInventory.seller_id == seller_id,
        ProduceInventory.is_available == True,
        ProduceInventory.quantity_available > 0
    ).all()
    
    return inventory

# Menurithm Integration Endpoints

@router.post("/menurithm/register-supplier")
async def register_with_menurithm(
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """Register current user as a supplier with Menurithm"""
    seller = db.query(User).filter(User.firebase_uid == firebase_user["uid"]).first()
    if not seller:
        raise HTTPException(status_code=404, detail="User not found")
    
    if seller.role != "farmer":
        raise HTTPException(status_code=403, detail="Only farmers can register as suppliers")

    try:
        supplier_data = {
            "name": seller.full_name,
            "email": seller.email,
            "phone": getattr(seller, 'phone', ''),
            "address": seller.organization,  # Using organization as address for now
            "latitude": None,  # Could be added to user model later
            "longitude": None,
            "categories": ["fresh_produce"],
            "delivery_radius": 50
        }
        
        result = await menurithm_client.register_supplier(supplier_data)
        
        # Store Menurithm supplier ID in user record if we add that field
        # seller.menurithm_supplier_id = result.get("supplier_id")
        # db.commit()
        
        return {
            "message": "Successfully registered with Menurithm",
            "supplier_data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to register with Menurithm: {str(e)}")

@router.post("/menurithm/sync-inventory")
async def sync_inventory_with_menurithm(
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """Sync current inventory with Menurithm"""
    seller = db.query(User).filter(User.firebase_uid == firebase_user["uid"]).first()
    if not seller:
        raise HTTPException(status_code=404, detail="User not found")
    
    if seller.role != "farmer":
        raise HTTPException(status_code=403, detail="Only farmers can sync inventory")

    # Get seller's inventory
    inventory = db.query(ProduceInventory).filter(
        ProduceInventory.seller_id == seller.id,
        ProduceInventory.is_available == True
    ).all()

    if not inventory:
        return {"message": "No inventory to sync", "synced_items": 0}

    try:
        # Convert inventory to Menurithm format
        inventory_items = []
        for item in inventory:
            inventory_items.append({
                "id": item.id,
                "produce_type": item.produce_type,
                "variety": item.variety,
                "quantity_available": item.quantity_available,
                "unit": item.unit,
                "price_per_unit": item.price_per_unit,
                "organic": item.organic,
                "harvest_date": item.harvest_date.isoformat() if item.harvest_date else None,
                "expiry_date": item.expiry_date.isoformat() if item.expiry_date else None,
                "description": item.description,
                "is_available": item.is_available
            })
        
        # Use seller's email as supplier_id for now (could be improved with actual supplier_id)
        supplier_id = seller.email
        result = await menurithm_client.update_inventory(supplier_id, inventory_items)
        
        return {
            "message": "Inventory successfully synced with Menurithm",
            "synced_items": len(inventory_items),
            "menurithm_response": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to sync with Menurithm: {str(e)}")

@router.get("/menurithm/requests")
async def get_menurithm_requests(
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """Get produce requests from Menurithm for this supplier"""
    seller = db.query(User).filter(User.firebase_uid == firebase_user["uid"]).first()
    if not seller:
        raise HTTPException(status_code=404, detail="User not found")
    
    if seller.role != "farmer":
        raise HTTPException(status_code=403, detail="Only farmers can view Menurithm requests")

    try:
        supplier_id = seller.email  # Using email as supplier_id
        requests = await menurithm_client.get_produce_requests(supplier_id)
        
        return {
            "menurithm_requests": requests,
            "count": len(requests)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Menurithm requests: {str(e)}")
