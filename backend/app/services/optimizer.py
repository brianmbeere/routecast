# app/services/optimizer.py
import random
from app.models.route import RouteRequest, RouteResponse, OptimizedStop

def optimize_route_mock(request: RouteRequest) -> RouteResponse:
    # Mocked ETA and distance data (random but realistic)
    stops = []
    total_eta = 0
    total_distance = 0.0

    # Combine pickup and delivery stops
    addresses = [request.pickup] + [stop.address for stop in request.stops]

    for i in range(1, len(addresses)):
        segment_eta = random.randint(10, 45)  # minutes
        segment_distance = round(random.uniform(5, 30), 2)  # miles

        stops.append(
            OptimizedStop(
                address=addresses[i],
                eta_minutes=segment_eta,
                distance_miles=segment_distance,
            )
        )

        total_eta += segment_eta
        total_distance += segment_distance

    # Optionally, build a fake map URL or embed string
    map_url = f"https://maps.example.com/route?from={request.pickup}&to={','.join([s.address for s in request.stops])}"

    return RouteResponse(
        stops=stops,
        total_eta=total_eta,
        total_distance_miles=round(total_distance, 2),
        map_url=map_url,
    )
