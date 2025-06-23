from fastapi import APIRouter
from app.models.route import RouteRequest, RouteResponse
from app.services.optimizer import optimize_route_mock


router = APIRouter()

@router.post("/api/route")
def api_route(request: RouteRequest):
    return optimize_route_mock(request)

@router.post("/api/optimize-route", response_model=RouteResponse)
def optimize_route(request: RouteRequest):
    return optimize_route_mock(request)

@router.get("/api/example")
def api_example():
    return {
        "start": "Nairobi",
        "end": "Mombasa",
        "stops": ["Machakos", "Voi", "Mariakani"],
        "constraints": {}
    }



