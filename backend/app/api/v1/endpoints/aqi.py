from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List
from app.services.external_aqi import ExternalAQIService
from app.services.aqi_engine import calculate_naqi

router = APIRouter()

@router.get("/current")
async def get_current_aqi(
    lat: float = Query(28.6508, description="Latitude (default Delhi Anand Vihar)"),
    lon: float = Query(77.3152, description="Longitude")
):
    """
    Returns live AQI, pollutant breakdown, and 24h trends computed using Indian National AQI (NAQI) rules.
    """
    result = await ExternalAQIService.fetch_open_meteo_aqi(lat, lon)
    return result

@router.get("/cities")
async def list_cities():
    """Returns top Indian metropolitan monitoring zones."""
    return ExternalAQIService.get_known_cities()

@router.get("/search")
async def search_stations(q: str = Query(..., min_length=2)):
    """Search monitoring locations by city or station name."""
    cities = ExternalAQIService.get_known_cities()
    filtered = [c for c in cities if q.lower() in c["name"].lower() or q.lower() in c["id"].lower() or q.lower() in c["state"].lower()]
    return filtered

@router.get("/geocode")
async def geocode_location(q: str = Query(..., min_length=2, description="Location search query")):
    """
    Geocodes text address/city/area to latitude and longitude coordinates.
    """
    results = await ExternalAQIService.geocode_address(q)
    return results
