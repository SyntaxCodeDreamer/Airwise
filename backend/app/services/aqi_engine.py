"""
Central Pollution Control Board (CPCB) - Indian National Air Quality Index (NAQI) Standard Engine.
Accurately computes sub-indices and overall AQI following the Ministry of Environment, Forest and Climate Change (MoEFCC) guidelines.
"""
from typing import Dict, Optional, Tuple, List
from pydantic import BaseModel, Field

class PollutantBreakpoint(BaseModel):
    c_low: float
    c_high: float
    i_low: float
    i_high: float

# Official CPCB Breakpoints: (B_lo, B_hi, I_lo, I_hi)
# Values: PM2.5 (ug/m3, 24h), PM10 (ug/m3, 24h), NO2 (ug/m3, 24h), SO2 (ug/m3, 24h), CO (mg/m3, 8h), O3 (ug/m3, 8h)
BREAKPOINTS: Dict[str, List[Tuple[float, float, float, float]]] = {
    "pm25": [
        (0, 30, 0, 50),
        (31, 60, 51, 100),
        (61, 90, 101, 200),
        (91, 120, 201, 300),
        (121, 250, 301, 400),
        (251, 500, 401, 500)
    ],
    "pm10": [
        (0, 50, 0, 50),
        (51, 100, 51, 100),
        (101, 250, 101, 200),
        (251, 350, 201, 300),
        (351, 430, 301, 400),
        (431, 600, 401, 500)
    ],
    "no2": [
        (0, 40, 0, 50),
        (41, 80, 51, 100),
        (81, 180, 101, 200),
        (181, 280, 201, 300),
        (281, 400, 301, 400),
        (401, 800, 401, 500)
    ],
    "so2": [
        (0, 40, 0, 50),
        (41, 80, 51, 100),
        (81, 380, 101, 200),
        (381, 800, 201, 300),
        (801, 1600, 301, 400),
        (1601, 2000, 401, 500)
    ],
    "co": [
        (0.0, 1.0, 0, 50),
        (1.1, 2.0, 51, 100),
        (2.1, 10.0, 101, 200),
        (10.1, 17.0, 201, 300),
        (17.1, 34.0, 301, 400),
        (34.1, 50.0, 401, 500)
    ],
    "o3": [
        (0, 50, 0, 50),
        (51, 100, 51, 100),
        (101, 168, 101, 200),
        (169, 208, 201, 300),
        (209, 748, 301, 400),
        (749, 1000, 401, 500)
    ]
}

CATEGORIES = [
    (0, 50, "Good", "#00B050", "Minimal impact on health"),
    (51, 100, "Satisfactory", "#92D050", "Minor breathing discomfort to sensitive people"),
    (101, 200, "Moderate", "#FFFF00", "Breathing discomfort to people with lung, asthma and heart diseases"),
    (201, 300, "Poor", "#FF9900", "Breathing discomfort to most people on prolonged exposure"),
    (301, 400, "Very Poor", "#FF0000", "Respiratory illness on prolonged exposure"),
    (401, 1000, "Severe", "#C00000", "Affects healthy people and seriously impacts those with existing diseases")
]

def calculate_sub_index(pollutant: str, concentration: float) -> Optional[float]:
    """Calculates the Indian NAQI sub-index for a single pollutant using linear interpolation."""
    p_key = pollutant.lower().replace(".", "").replace("-", "")
    if p_key not in BREAKPOINTS or concentration is None or concentration < 0:
        return None
    
    table = BREAKPOINTS[p_key]
    
    # Cap if concentration exceeds highest breakpoint
    max_c_high = table[-1][1]
    if concentration > max_c_high:
        return 500.0

    for b_lo, b_hi, i_lo, i_hi in table:
        if b_lo <= concentration <= b_hi:
            sub_index = ((i_hi - i_lo) / (b_hi - b_lo)) * (concentration - b_lo) + i_lo
            return round(sub_index, 1)
            
    return None

def get_aqi_category_info(aqi_val: float) -> Dict[str, str]:
    """Returns Category, Color Hex, and Health Impact for a calculated AQI."""
    for low, high, cat, color, desc in CATEGORIES:
        if low <= aqi_val <= high:
            return {
                "category": cat,
                "color": color,
                "health_impact": desc
            }
    if aqi_val > 500:
        return {
            "category": "Severe+",
            "color": "#800000",
            "health_impact": "Emergency health advisory: severe toxic exposure for entire population."
        }
    return {
        "category": "Unknown",
        "color": "#808080",
        "health_impact": "Insufficient data"
    }

def calculate_naqi(pollutant_data: Dict[str, float]) -> Dict:
    """
    Computes overall CPCB NAQI.
    CPCB Rule: Requires at least 3 criteria pollutants, at least one of which MUST be PM2.5 or PM10.
    """
    sub_indices: Dict[str, Dict] = {}
    
    units = {
        "pm25": "µg/m³",
        "pm10": "µg/m³",
        "no2": "µg/m³",
        "so2": "µg/m³",
        "co": "mg/m³",
        "o3": "µg/m³"
    }
    
    for pol, conc in pollutant_data.items():
        if conc is not None:
            sub = calculate_sub_index(pol, float(conc))
            if sub is not None:
                sub_indices[pol.lower().replace(".", "")] = {
                    "concentration": conc,
                    "unit": units.get(pol.lower().replace(".", ""), "µg/m³"),
                    "sub_index": sub
                }

    has_pm = "pm25" in sub_indices or "pm10" in sub_indices
    is_valid_cpcb = len(sub_indices) >= 3 and has_pm
    
    if not sub_indices:
        return {
            "aqi": 0,
            "category": "Insufficient Data",
            "color": "#808080",
            "primary_pollutant": "None",
            "sub_indices": {},
            "is_official_cpcb_compliant": False
        }

    # Primary pollutant is the one with highest sub-index
    primary_pol = max(sub_indices.items(), key=lambda item: item[1]["sub_index"])
    overall_aqi = round(primary_pol[1]["sub_index"])
    cat_info = get_aqi_category_info(overall_aqi)

    return {
        "aqi": overall_aqi,
        "category": cat_info["category"],
        "color": cat_info["color"],
        "health_impact": cat_info["health_impact"],
        "primary_pollutant": primary_pol[0].upper(),
        "sub_indices": sub_indices,
        "is_official_cpcb_compliant": is_valid_cpcb,
        "standard": "Indian National Air Quality Index (NAQI - CPCB)"
    }

