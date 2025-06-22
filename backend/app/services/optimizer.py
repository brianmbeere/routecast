from app.models.route import RouteRequest

def optimize_route_mock(request: RouteRequest):
    route = [request.start] + request.stops + [request.end]
    return {"optimized_route": route, "constraints": request.constraints}
