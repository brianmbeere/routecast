from pydantic import BaseModel
from typing import List, Dict

class Stop(BaseModel):
    address: str

class RouteRequest(BaseModel):
    pickup: str
    stops: List[Stop]

class OptimizedStop(BaseModel):
    address: str
    location: tuple[float, float]  # [lng, lat]
    eta_minutes: int
    distance_miles: float

class RouteResponse(BaseModel):
    stops: list[OptimizedStop]
    total_eta: int
    total_distance_miles: float
    map_url: str | None = None

