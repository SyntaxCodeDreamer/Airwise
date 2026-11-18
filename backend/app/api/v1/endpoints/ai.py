from fastapi import APIRouter
from app.models.schemas import AIExplanationRequest, RoutineRequest, TransportRequest
from app.services.gemini_service import GeminiAIService

router = APIRouter()

@router.post("/explain")
async def explain_air_quality(req: AIExplanationRequest):
    """
    Generates structured AI explanation, vulnerable group warnings, and indoor recommendations.
    """
    fam_dict = req.family_profile.model_dump() if req.family_profile else None
    result = await GeminiAIService.generate_explanation(
        aqi=req.aqi,
        category=req.category,
        primary_pollutant=req.primary_pollutant,
        language=req.language,
        family_profile=fam_dict
    )
    return result

@router.post("/routine")
async def get_daily_routine(req: RoutineRequest):
    """
    Suggests low-emission and minimum-exposure daily routine slots.
    """
    return await GeminiAIService.plan_daily_routine(req.aqi, req.city, req.language)

@router.post("/transport")
async def compare_transport(req: TransportRequest):
    """
    Calculates carbon avoidance and exposure reduction across commute options.
    """
    return await GeminiAIService.transport_comparison(req.distance_km)

