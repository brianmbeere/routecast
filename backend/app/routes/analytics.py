from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List
from datetime import datetime, timedelta
from app.db.database import get_db
from app.models.produce import ProduceRequest, ProduceInventory, DeliveryRoute, DeliveryStop
from app.models.user import User
from app.schemas.produce import DemandAnalytics, SellerPerformanceAnalytics
from app.utils.auth_dependency import verify_firebase_token

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/demand", response_model=List[DemandAnalytics])
async def get_demand_analytics(
    days: int = Query(30, description="Number of days to analyze"),
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """Get produce demand trends and analytics"""
    user = db.query(User).filter(User.firebase_uid == firebase_user["uid"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    start_date = datetime.now() - timedelta(days=days)
    
    # Aggregate demand data by produce type
    demand_data = db.query(
        ProduceRequest.produce_type,
        func.count(ProduceRequest.id).label('total_requests'),
        func.avg(ProduceRequest.quantity_needed).label('average_quantity'),
        func.avg(ProduceRequest.max_price_per_unit).label('average_price')
    ).filter(
        ProduceRequest.created_at >= start_date
    ).group_by(ProduceRequest.produce_type).all()

    # Calculate trends (simplified - would need more complex analysis in production)
    analytics = []
    for item in demand_data:
        # Compare with previous period to determine trend
        prev_period_start = start_date - timedelta(days=days)
        prev_requests = db.query(func.count(ProduceRequest.id)).filter(
            and_(
                ProduceRequest.produce_type == item.produce_type,
                ProduceRequest.created_at >= prev_period_start,
                ProduceRequest.created_at < start_date
            )
        ).scalar() or 0
        
        current_requests = item.total_requests
        trend = "stable"
        if current_requests > prev_requests * 1.1:
            trend = "increasing"
        elif current_requests < prev_requests * 0.9:
            trend = "decreasing"

        analytics.append(DemandAnalytics(
            produce_type=item.produce_type,
            total_requests=item.total_requests,
            average_quantity=float(item.average_quantity or 0),
            average_price=float(item.average_price or 0),
            trend_direction=trend
        ))

    return analytics

@router.get("/routes/efficiency")
async def get_route_efficiency_metrics(
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """Get route efficiency metrics"""
    user = db.query(User).filter(User.firebase_uid == firebase_user["uid"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get route statistics
    route_stats = db.query(
        func.count(DeliveryRoute.id).label('total_routes'),
        func.avg(DeliveryRoute.total_distance_miles).label('avg_distance'),
        func.avg(DeliveryRoute.estimated_duration_minutes).label('avg_duration'),
        func.sum(DeliveryRoute.total_distance_miles).label('total_distance')
    ).filter(DeliveryRoute.seller_id == user.id).first()

    # Get completion rate
    completed_routes = db.query(func.count(DeliveryRoute.id)).filter(
        DeliveryRoute.seller_id == user.id,
        DeliveryRoute.status == "completed"
    ).scalar() or 0

    total_routes = route_stats.total_routes or 0
    completion_rate = (completed_routes / total_routes * 100) if total_routes > 0 else 0

    return {
        "total_routes": total_routes,
        "completed_routes": completed_routes,
        "completion_rate": round(completion_rate, 2),
        "average_distance_miles": round(float(route_stats.avg_distance or 0), 2),
        "average_duration_minutes": round(float(route_stats.avg_duration or 0), 2),
        "total_distance_miles": round(float(route_stats.total_distance or 0), 2)
    }

@router.get("/seller/performance", response_model=SellerPerformanceAnalytics)
async def get_seller_performance(
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """Get seller performance analytics"""
    seller = db.query(User).filter(User.firebase_uid == firebase_user["uid"]).first()
    if not seller:
        raise HTTPException(status_code=404, detail="User not found")

    if seller.role != "farmer":
        raise HTTPException(status_code=403, detail="Only farmers can view performance analytics")

    # Get this month's data
    start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Count completed deliveries
    completed_deliveries = db.query(func.count(DeliveryRoute.id)).filter(
        DeliveryRoute.seller_id == seller.id,
        DeliveryRoute.status == "completed",
        DeliveryRoute.created_at >= start_of_month
    ).scalar() or 0

    # Calculate on-time delivery rate (simplified)
    on_time_deliveries = db.query(func.count(DeliveryStop.id)).join(DeliveryRoute).filter(
        DeliveryRoute.seller_id == seller.id,
        DeliveryStop.status == "delivered",
        DeliveryRoute.created_at >= start_of_month
    ).scalar() or 0

    total_deliveries = db.query(func.count(DeliveryStop.id)).join(DeliveryRoute).filter(
        DeliveryRoute.seller_id == seller.id,
        DeliveryRoute.created_at >= start_of_month
    ).scalar() or 0

    on_time_rate = (on_time_deliveries / total_deliveries * 100) if total_deliveries > 0 else 0

    # Calculate revenue (simplified - would need actual pricing data)
    fulfilled_requests = db.query(ProduceRequest).filter(
        ProduceRequest.assigned_seller_id == seller.id,
        ProduceRequest.status == "completed",
        ProduceRequest.created_at >= start_of_month
    ).all()

    revenue = sum([
        (req.quantity_needed * (req.max_price_per_unit or 0)) 
        for req in fulfilled_requests
    ])

    return SellerPerformanceAnalytics(
        seller_id=seller.id,
        total_deliveries=completed_deliveries,
        on_time_rate=round(on_time_rate, 2),
        average_rating=4.5,  # Placeholder - would implement rating system
        revenue_this_month=round(revenue, 2)
    )

@router.get("/market/insights")
async def get_market_insights(
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """Get market insights and pricing trends"""
    user = db.query(User).filter(User.firebase_uid == firebase_user["uid"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get top requested produce types
    top_produce = db.query(
        ProduceRequest.produce_type,
        func.count(ProduceRequest.id).label('request_count'),
        func.avg(ProduceRequest.max_price_per_unit).label('avg_price')
    ).group_by(
        ProduceRequest.produce_type
    ).order_by(
        func.count(ProduceRequest.id).desc()
    ).limit(10).all()

    # Get supply vs demand by produce type
    supply_demand = []
    for produce in top_produce:
        supply_count = db.query(func.count(ProduceInventory.id)).filter(
            ProduceInventory.produce_type == produce.produce_type,
            ProduceInventory.is_available == True
        ).scalar() or 0

        supply_demand.append({
            "produce_type": produce.produce_type,
            "demand_requests": produce.request_count,
            "supply_listings": supply_count,
            "average_requested_price": round(float(produce.avg_price or 0), 2),
            "supply_demand_ratio": round(supply_count / produce.request_count, 2) if produce.request_count > 0 else 0
        })

    return {
        "top_requested_produce": supply_demand,
        "market_trends": {
            "high_demand_low_supply": [p for p in supply_demand if p["supply_demand_ratio"] < 0.5],
            "oversupplied": [p for p in supply_demand if p["supply_demand_ratio"] > 2.0]
        },
        "total_active_requests": db.query(func.count(ProduceRequest.id)).filter(
            ProduceRequest.status == "pending"
        ).scalar() or 0,
        "total_available_inventory": db.query(func.count(ProduceInventory.id)).filter(
            ProduceInventory.is_available == True
        ).scalar() or 0
    }
