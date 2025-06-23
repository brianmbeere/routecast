from app.models.route import RouteRequest, RouteResponse, OptimizedStop
import random

def optimize_route_mock(request: RouteRequest) -> RouteResponse:
    stops: list[OptimizedStop] = []
    total_eta = 0
    total_distance = 0.0

    # --- Add pickup location as stop 0 ---
    lat = -1.28 + random.uniform(-0.05, 0.05)
    lng = 36.82 + random.uniform(-0.05, 0.05)

    stops.append(
        OptimizedStop(
            address=request.pickup,
            location=(lng, lat),
            eta_minutes=0,              # Pickup point, so no ETA
            distance_miles=0.0          # No distance yet
        )
    )

    # --- Add delivery stops ---
    for stop in request.stops:
        segment_eta = random.randint(10, 45)
        segment_distance = round(random.uniform(5, 25), 2)
        lat = -1.28 + random.uniform(-0.05, 0.05)
        lng = 36.82 + random.uniform(-0.05, 0.05)

        stops.append(
            OptimizedStop(
                address=stop.address,
                location=(lng, lat),
                eta_minutes=segment_eta,
                distance_miles=segment_distance,
            )
        )
        total_eta += segment_eta
        total_distance += segment_distance

    return RouteResponse(
        stops=stops,
        total_eta=total_eta,
        total_distance_miles=round(total_distance, 2),
        map_url=None
    )
