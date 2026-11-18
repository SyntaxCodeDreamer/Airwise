import os
import json
import logging
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger("airwise.gemini")

class GeminiAIService:
    @staticmethod
    async def generate_explanation(
        aqi: int,
        category: str,
        primary_pollutant: str,
        language: str = "en",
        family_profile: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Uses Google Gemini to explain air quality in simple, reassuring, and actionable terms.
        Provides a fallback if no API key is set.
        """
        prompt = f"""
        Act as an environmental health specialist for AirWise AI.
        Analyze this current air quality report:
        - AQI: {aqi}
        - Category: {category}
        - Primary Pollutant: {primary_pollutant}
        - Target Language: {language}
        - Vulnerable Family Context: {json.dumps(family_profile or {})}

        Return a valid JSON object ONLY with the following schema:
        {{
            "simple_summary": "string (clear, concise explanation)",
            "health_risk_level": "string",
            "immediate_actions": ["action 1", "action 2", "action 3"],
            "vulnerable_guidance": "string specific to elderly/children/respiratory patients",
            "indoor_tips": ["tip 1", "tip 2"],
            "outdoor_activity_verdict": "string (Safe / Limit Exposure / Avoid Outdoor Activity)"
        }}
        """

        if settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                model = genai.GenerativeModel("gemini-1.5-flash")
                response = model.generate_content(prompt)
                cleaned = response.text.strip().replace("```json", "").replace("```", "")
                return json.loads(cleaned)
            except Exception as e:
                logger.warning(f"Gemini API call failed: {e}. Using expert-crafted fallback.")

        # High-quality contextual fallback
        is_hindi = language.lower() in ["hi", "hindi"]
        if aqi > 300:
            if is_hindi:
                return {
                    "simple_summary": f"आज वायु गुणवत्ता 'गंभीर' श्रेणी में है (AQI {aqi})। मुख्य प्रदूषक {primary_pollutant} फेफड़ों और रक्तप्रवाह में गहराई तक प्रवेश कर सकता है।",
                    "health_risk_level": "अत्यधिक जोखिम (High Risk)",
                    "immediate_actions": [
                        "घर से बाहर निकलते समय N95 या N99 मास्क पहनें।",
                        "घर की सभी खिड़कियां बंद रखें और धूल से बचें।",
                        "सुबह और शाम की सैर को पूरी तरह स्थगित करें।"
                    ],
                    "vulnerable_guidance": "बच्चों, बुजुर्गों और अस्थमा रोगियों को घर के अंदर ही रहना चाहिए। इनहेलर पास रखें।",
                    "indoor_tips": ["गीले कपड़े से पोछा लगाएं", "एयर प्यूरीफायर को हाई मोड पर रखें", "अगरबत्ती या धुआं न करें"],
                    "outdoor_activity_verdict": "Avoid Outdoor Activity (बाहरी गतिविधियों से बचें)"
                }
            return {
                "simple_summary": f"Air quality is currently in the '{category}' zone with AQI of {aqi}. High concentrations of {primary_pollutant} pose immediate respiratory stress.",
                "health_risk_level": "High Vulnerability",
                "immediate_actions": [
                    "Wear a certified N95/N99 respirator mask outdoors.",
                    "Keep indoor living spaces sealed against ambient smog infiltration.",
                    "Postpone strenuous outdoor exercise until midday dispersion improves."
                ],
                "vulnerable_guidance": "High alert for elders and children. Keep quick-relief bronchodilators accessible.",
                "indoor_tips": ["Wet-mop floors instead of dry sweeping", "Run HEPA air filtration if available", "Avoid combustion indoors"],
                "outdoor_activity_verdict": "Avoid Outdoor Activity"
            }
        else:
            return {
                "simple_summary": f"Current air quality is {category} with AQI {aqi}. Fine particles ({primary_pollutant}) are within manageable levels for most individuals.",
                "health_risk_level": "Moderate",
                "immediate_actions": [
                    "Normal outdoor routine permitted for healthy adults.",
                    "Sensitive individuals should monitor evening smog buildup."
                ],
                "vulnerable_guidance": "Elderly and children can engage in outdoor activities during afternoon hours.",
                "indoor_tips": ["Ventilate home between 12:00 PM and 3:00 PM", "Keep indoor plants watered"],
                "outdoor_activity_verdict": "Safe with Precautions"
            }

    @staticmethod
    async def plan_daily_routine(aqi: int, city: str, language: str = "en") -> Dict[str, Any]:
        """
        Generates a low-emission, minimum-exposure daily schedule.
        """
        return {
            "city": city,
            "current_aqi": aqi,
            "optimal_routine": [
                {
                    "time_slot": "06:00 AM - 08:30 AM",
                    "smog_profile": "Peak Inversion (High Pollution)",
                    "recommendation": "Stay Indoors. Exercise or yoga inside home with sealed windows."
                },
                {
                    "time_slot": "12:00 PM - 03:30 PM",
                    "smog_profile": "Solar Dispersal Window (Lowest Daily AQI)",
                    "recommendation": "Safest window for errands, grocery shopping, and home ventilation."
                },
                {
                    "time_slot": "06:00 PM - 10:00 PM",
                    "smog_profile": "Vehicular Peak & Temperature Drop",
                    "recommendation": "Use Metro/public transport with N95 mask. Keep indoor purifier active."
                }
            ],
            "co2_reduction_tip": "Choosing Metro/electric bus today over personal car saves approx 2.6 kg of CO2 and reduces local PM2.5 emissions."
        }

    @staticmethod
    async def transport_comparison(distance_km: float = 12.0) -> Dict[str, Any]:
        """
        Calculates CO2 emissions, PM exposure index, and health impact across commute modes.
        """
        # Baseline emissions factors: Petrol Car (~170g CO2/km), Metro (~22g CO2/km), Bus (~40g CO2/km), Cycling (0g)
        car_co2 = round(distance_km * 0.170, 2)
        metro_co2 = round(distance_km * 0.022, 2)
        bus_co2 = round(distance_km * 0.040, 2)
        
        return {
            "distance_km": distance_km,
            "modes": [
                {
                    "mode": "Delhi Metro / Rapid Rail",
                    "co2_emitted_kg": metro_co2,
                    "co2_saved_vs_car_kg": round(car_co2 - metro_co2, 2),
                    "smog_exposure_risk": "Low (Air Filtered Carriages)",
                    "recommendation_score": 95
                },
                {
                    "mode": "Electric / CNG Bus",
                    "co2_emitted_kg": bus_co2,
                    "co2_saved_vs_car_kg": round(car_co2 - bus_co2, 2),
                    "smog_exposure_risk": "Moderate",
                    "recommendation_score": 80
                },
                {
                    "mode": "Personal Petrol Car",
                    "co2_emitted_kg": car_co2,
                    "co2_saved_vs_car_kg": 0.0,
                    "smog_exposure_risk": "Moderate (Depends on cabin filter)",
                    "recommendation_score": 40
                },
                {
                    "mode": "Bicycle / Walking",
                    "co2_emitted_kg": 0.0,
                    "co2_saved_vs_car_kg": car_co2,
                    "smog_exposure_risk": "High during winter smog spikes (Hyperventilation risk)",
                    "recommendation_score": 50
                }
            ],
            "best_sustainable_option": "Delhi Metro / Rapid Rail"
        }

