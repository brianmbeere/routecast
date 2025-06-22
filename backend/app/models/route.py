from pydantic import BaseModel
from typing import List, Dict

class RouteRequest(BaseModel):
    start: str
    end: str
    stops: List[str] = []
    constraints: Dict = {}