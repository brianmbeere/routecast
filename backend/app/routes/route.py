from fastapi import APIRouter
from app.models.route import RouteRequest, RouteResponse
from app.services.optimizer import optimize_route_real


router = APIRouter()

@router.post("/api/route")
async def api_route(request: RouteRequest):
    return await optimize_route_real(request)

@router.post("/api/optimize-route", response_model=RouteResponse)
async def optimize_route(request: RouteRequest):
    return await optimize_route_real(request)

@router.get("/api/example")
def api_example():
    return {
        "start": "Nairobi",
        "end": "Mombasa",
        "stops": ["Machakos", "Voi", "Mariakani"],
        "constraints": {}
    }



