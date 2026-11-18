from fastapi import APIRouter, Depends, Query, Path
from typing import Optional, List
from app.services.external_aqi import ExternalAQIService
from app.services.aqi_engine import calculate_naqi

router = APIRouter()

@router.get("/current")
async def get_current_aqi(
    lat: float = Query(28.6508, ge=-90.0, le=90.0, description="Latitude between -90 and 90"),
    lon: float = Query(77.3152, ge=-180.0, le=180.0, description="Longitude between -180 and 180")
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
async def search_stations(q: str = Query(..., min_length=2, max_length=100)):
    """Search monitoring locations by city or station name."""
    clean_q = q.strip().lower()
    cities = ExternalAQIService.get_known_cities()
    filtered = [
        c for c in cities 
        if clean_q in c["name"].lower() or clean_q in c["id"].lower() or clean_q in c["state"].lower()
    ]
    return filtered

@router.get("/geocode")
async def geocode_location(q: str = Query(..., min_length=2, max_length=150, description="Location search query")):
    """
    Geocodes text address/city/area to latitude and longitude coordinates.
    """
    clean_q = q.strip()
    results = await ExternalAQIService.geocode_address(clean_q)
    return results

@router.get("/reverse-geocode")
async def reverse_geocode_location(
    lat: float = Query(..., ge=-90.0, le=90.0, description="Latitude"),
    lon: float = Query(..., ge=-180.0, le=180.0, description="Longitude")
):
    """
    Reverse geocodes GPS coordinates into human-readable city, state, or locality name.
    """
    return await ExternalAQIService.reverse_geocode(lat, lon)
