import httpx
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from app.core.config import settings
from app.core.cache import aqi_cache
from app.services.aqi_engine import calculate_naqi

logger = logging.getLogger("airwise.external_aqi")

INDIAN_CITIES = {
    "delhi": {"name": "New Delhi - Anand Vihar CPCB", "lat": 28.6508, "lon": 77.3152, "state": "Delhi"},
    "mumbai": {"name": "Mumbai - Bandra Kurla Complex", "lat": 19.0657, "lon": 72.8687, "state": "Maharashtra"},
    "bengaluru": {"name": "Bengaluru - Silk Board", "lat": 12.9176, "lon": 77.6238, "state": "Karnataka"},
    "kolkata": {"name": "Kolkata - Victoria Memorial", "lat": 22.5448, "lon": 88.3426, "state": "West Bengal"},
    "hyderabad": {"name": "Hyderabad - Sanathnagar", "lat": 17.4566, "lon": 78.4412, "state": "Telangana"},
    "patna": {"name": "Patna - Samanpura", "lat": 25.6093, "lon": 85.0924, "state": "Bihar"},
    "lucknow": {"name": "Lucknow - Talkatora", "lat": 26.8393, "lon": 80.9022, "state": "Uttar Pradesh"},
    "ahmedabad": {"name": "Ahmedabad - Chandkheda", "lat": 23.1128, "lon": 72.5830, "state": "Gujarat"}
}

class ExternalAQIService:
    @staticmethod
    async def fetch_open_meteo_aqi(lat: float, lon: float) -> Dict[str, Any]:
        cache_key = f"aqi_{round(lat, 2)}_{round(lon, 2)}"
        cached = aqi_cache.get(cache_key)
        if cached:
            return cached

        url = settings.OPEN_METEO_AQI_URL
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone",
            "hourly": "pm10,pm2_5,nitrogen_dioxide,ozone,carbon_monoxide",
            "forecast_days": 2,
            "timezone": "auto"
        }
        
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(url, params=params)
                if res.status_code == 200:
                    data = res.json()
                    curr = data.get("current", {})
                    hourly = data.get("hourly", {})
                    
                    co_mg = (curr.get("carbon_monoxide") or 0.0) / 1000.0 if curr.get("carbon_monoxide") is not None else None
                    
                    pollutants = {
                        "pm25": curr.get("pm2_5"),
                        "pm10": curr.get("pm10"),
                        "no2": curr.get("nitrogen_dioxide"),
                        "so2": curr.get("sulphur_dioxide"),
                        "co": round(co_mg, 2) if co_mg is not None else None,
                        "o3": curr.get("ozone")
                    }
                    
                    naqi = calculate_naqi(pollutants)
                    
                    times = hourly.get("time", [])[:24]
                    pm25_hourly = hourly.get("pm2_5", [])[:24]
                    pm10_hourly = hourly.get("pm10", [])[:24]
                    
                    hourly_trend = []
                    for t, p25, p10 in zip(times, pm25_hourly, pm10_hourly):
                        h_sub = calculate_naqi({"pm25": p25, "pm10": p10})
                        hourly_trend.append({
                            "time": t,
                            "aqi": h_sub["aqi"],
                            "category": h_sub["category"],
                            "pm25": p25,
                            "pm10": p10
                        })
                    
                    result = {
                        "source": "Open-Meteo Air Quality / CPCB NAQI Standard",
                        "freshness_status": "LIVE",
                        "observed_at": curr.get("time", datetime.now(timezone.utc).isoformat()),
                        "latitude": lat,
                        "longitude": lon,
                        "aqi_data": naqi,
                        "hourly_forecast": hourly_trend
                    }
                    aqi_cache.set(cache_key, result, ttl=settings.AQI_CACHE_TTL_SECONDS)
                    return result
                else:
                    logger.warning(f"Open-Meteo returned status {res.status_code}")
        except Exception as e:
            logger.error(f"Error fetching Open-Meteo data: {e}")
            
        fallback_pollutants = {"pm25": 178.0, "pm10": 284.0, "no2": 62.0, "so2": 18.0, "co": 1.9, "o3": 38.0}
        naqi = calculate_naqi(fallback_pollutants)
        fallback_result = {
            "source": "CPCB Indian Sensor Baseline (Fallback Model)",
            "freshness_status": "ESTIMATED",
            "observed_at": datetime.now(timezone.utc).isoformat(),
            "latitude": lat,
            "longitude": lon,
            "aqi_data": naqi,
            "hourly_forecast": [
                {"time": "18:00", "aqi": 340, "category": "Very Poor", "pm25": 190.0, "pm10": 300.0},
                {"time": "21:00", "aqi": 375, "category": "Very Poor", "pm25": 215.0, "pm10": 330.0},
                {"time": "00:00", "aqi": 405, "category": "Severe", "pm25": 255.0, "pm10": 380.0},
                {"time": "06:00", "aqi": 420, "category": "Severe", "pm25": 270.0, "pm10": 410.0},
                {"time": "12:00", "aqi": 290, "category": "Poor", "pm25": 140.0, "pm10": 220.0}
            ]
        }
        aqi_cache.set(cache_key, fallback_result, ttl=60)
        return fallback_result

    @staticmethod
    async def geocode_address(query: str) -> List[Dict[str, Any]]:
        cache_key = f"geo_{query.strip().lower()}"
        cached = aqi_cache.get(cache_key)
        if cached:
            return cached

        url = "https://geocoding-api.open-meteo.com/v1/search"
        params = {"name": query, "count": 5, "language": "en", "format": "json"}
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.get(url, params=params)
                if res.status_code == 200:
                    data = res.json()
                    results = []
                    for item in data.get("results", []):
                        name = item.get("name", "")
                        admin1 = item.get("admin1", "")
                        country = item.get("country", "")
                        full_label = f"{name}, {admin1}, {country}" if admin1 else f"{name}, {country}"
                        results.append({
                            "name": full_label,
                            "lat": item.get("latitude"),
                            "lon": item.get("longitude"),
                            "country": country
                        })
                    if results:
                        aqi_cache.set(cache_key, results, ttl=3600)
                        return results
        except Exception as e:
            logger.error(f"Geocoding error: {e}")

        q_lower = query.lower()
        matched = []
        for k, v in INDIAN_CITIES.items():
            if q_lower in k or q_lower in v["name"].lower() or q_lower in v["state"].lower():
                matched.append({
                    "name": f"{v['name']}, {v['state']}",
                    "lat": v["lat"],
                    "lon": v["lon"],
                    "country": "India"
                })
        if not matched:
            matched.append({
                "name": f"{query.title()} (Estimated Coordinates)",
                "lat": 28.6139,
                "lon": 77.2090,
                "country": "India"
            })
        aqi_cache.set(cache_key, matched, ttl=1800)
        return matched

    @staticmethod
    async def reverse_geocode(lat: float, lon: float) -> Dict[str, str]:
        """
        Reverse geocodes coordinates to a human-readable city/state name.
        Uses OpenStreetMap Nominatim reverse geocoder with caching and nearest city fallback.
        """
        cache_key = f"rev_{round(lat, 3)}_{round(lon, 3)}"
        cached = aqi_cache.get(cache_key)
        if cached:
            return cached

        try:
            url = "https://nominatim.openstreetmap.org/reverse"
            headers = {"User-Agent": "AirWiseAI-EnvironmentalAssistant/1.0"}
            params = {"lat": lat, "lon": lon, "format": "json"}
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url, params=params, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    addr = data.get("address", {})
                    city = addr.get("city") or addr.get("town") or addr.get("suburb") or addr.get("county") or "Local Area"
                    state = addr.get("state") or addr.get("country", "")
                    label = f"{city}, {state}" if state else city
                    result = {"name": label, "lat": lat, "lon": lon}
                    aqi_cache.set(cache_key, result, ttl=86400)
                    return result
        except Exception as e:
            logger.warning(f"Reverse geocode failed: {e}")

        # Nearest Indian City fallback
        nearest_city = "New Delhi"
        min_dist = float("inf")
        for k, v in INDIAN_CITIES.items():
            dist = (v["lat"] - lat) ** 2 + (v["lon"] - lon) ** 2
            if dist < min_dist:
                min_dist = dist
                nearest_city = v["name"]

        fallback_res = {"name": nearest_city, "lat": lat, "lon": lon}
        aqi_cache.set(cache_key, fallback_res, ttl=3600)
        return fallback_res

    @staticmethod
    def get_known_cities() -> List[Dict[str, Any]]:
        return [{"id": k, **v} for k, v in INDIAN_CITIES.items()]
