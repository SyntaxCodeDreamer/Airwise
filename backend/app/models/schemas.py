from typing import Optional, List, Dict
from pydantic import BaseModel, Field

class FamilyHealthProfile(BaseModel):
    has_elderly: bool = False
    has_infants: bool = False
    has_asthma_respiratory: bool = False
    has_indoor_air_purifier: bool = False

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    preferred_language: Optional[str] = "en"
    city: Optional[str] = "New Delhi"
    family_profile: Optional[FamilyHealthProfile] = None

class AIExplanationRequest(BaseModel):
    aqi: int
    category: str
    primary_pollutant: str = "PM2.5"
    language: str = "en"
    family_profile: Optional[FamilyHealthProfile] = None

class RoutineRequest(BaseModel):
    city: str = "New Delhi"
    aqi: int = 350
    language: str = "en"

class TransportRequest(BaseModel):
    distance_km: float = 12.0

class CommunityReportCreate(BaseModel):
    incident_type: str = Field(..., description="GARBAGE_BURNING, STUBBLE_BURNING, INDUSTRIAL_SMOKE, VEHICULAR_SMARL, DUST_CONSTRUCTION")
    description: str
    latitude: float
    longitude: float
    landmark: Optional[str] = "Local Street"

