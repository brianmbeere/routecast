from fastapi import APIRouter
from app.models.route import RouteRequest
from app.services.optimizer import optimize_route_mock

router = APIRouter()

@router.post("/route")
def api_route(request: RouteRequest):
    return optimize_route_mock(request)

@router.post("/optimize-route")
def optimize_route(request: RouteRequest):
    return optimize_route_mock(request)

@router.get("/example")
def api_example():
    return {
        "start": "Nairobi",
        "end": "Mombasa",
        "stops": ["Machakos", "Voi", "Mariakani"],
        "constraints": {}
    }
