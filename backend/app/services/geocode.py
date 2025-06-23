# app/services/geocode.py
import os
import httpx

MAPBOX_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places"

MAPBOX_KEY = os.getenv("GEOCODER_API_KEY")

async def geocode_address(address: str) -> tuple[float, float] | None:
    if not address:
        return None

    if os.getenv("GEOCODER_PROVIDER") == "mapbox":
        return await geocode_mapbox(address)

async def geocode_mapbox(address: str) -> tuple[float, float] | None:
    async with httpx.AsyncClient() as client:
        url = f"{MAPBOX_URL}/{address}.json"
        params = {"access_token": MAPBOX_KEY, "limit": 1}
        resp = await client.get(url, params=params)
        data = resp.json()
        if data["features"]:
            lng, lat = data["features"][0]["center"]
            return (lng, lat)
        return None
