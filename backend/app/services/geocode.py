# app/services/geocode.py
import os
import httpx
from dotenv import load_dotenv

# Load env variables
load_dotenv()

MAPBOX_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places"


def get_mapbox_key() -> str | None:
    """Get Mapbox API key at runtime to ensure .env is loaded"""
    return os.getenv("GEOCODER_API_KEY")


async def geocode_address(address: str) -> tuple[float, float] | None:
    if not address:
        return None

    if os.getenv("GEOCODER_PROVIDER") == "mapbox":
        return await geocode_mapbox(address)
    return None


async def geocode_mapbox(address: str) -> tuple[float, float] | None:
    mapbox_key = get_mapbox_key()
    if not mapbox_key:
        print("WARNING: GEOCODER_API_KEY not set")
        return None
    
    async with httpx.AsyncClient() as client:
        url = f"{MAPBOX_URL}/{address}.json"
        params = {"access_token": mapbox_key, "limit": 1}
        resp = await client.get(url, params=params)
        data = resp.json()
        if data["features"]:
            lng, lat = data["features"][0]["center"]
            return (lng, lat)
        return None
