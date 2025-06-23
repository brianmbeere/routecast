from app.services.geocode import geocode_address
from app.models.route import OptimizedStop, RouteRequest, RouteResponse

import random

async def optimize_route_real(request: RouteRequest) -> RouteResponse:
    stops: list[OptimizedStop] = []
    total_eta = 0
    total_distance = 0.0

    # Geocode pickup
    pickup_coords = await geocode_address(request.pickup)
    if not pickup_coords:
        raise ValueError("Failed to geocode pickup location")

    stops.append(
        OptimizedStop(
            address=request.pickup,
            location=pickup_coords,
            eta_minutes=0,
            distance_miles=0.0,
        )
    )

    # Geocode delivery stops
    for stop in request.stops:
        coords = await geocode_address(stop.address)
        if not coords:
            continue

        eta = random.randint(10, 40)
        dist = round(random.uniform(5, 30), 2)

        stops.append(
            OptimizedStop(
                address=stop.address,
                location=coords,
                eta_minutes=eta,
                distance_miles=dist,
            )
        )
        total_eta += eta
        total_distance += dist

    return RouteResponse(
        stops=stops,
        total_eta=total_eta,
        total_distance_miles=round(total_distance, 2),
        map_url=None,
    )
