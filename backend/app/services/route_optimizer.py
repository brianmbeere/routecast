from app.models.route import RouteRequest, RouteResponse
from app.services.geocode import geocode_address
from app.services.optimizer import optimize_route_real

async def optimize_route_from_requests(route_request: RouteRequest) -> RouteResponse:
    """
    Enhanced route optimization that works with produce requests
    Uses the existing optimizer but with additional context
    """
    return await optimize_route_real(route_request)
