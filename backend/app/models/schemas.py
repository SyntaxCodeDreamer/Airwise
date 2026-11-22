import re
import html
from typing import Optional, List, Dict
from pydantic import BaseModel, Field, field_validator

def sanitize_text(text: Optional[str]) -> Optional[str]:
    """Sanitizes text by stripping whitespace, escaping HTML entities and removing control characters."""
    if text is None:
        return None
    # Strip dangerous control characters and normalize
    cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text.strip())
    # Escape HTML to prevent stored XSS
    return html.escape(cleaned)

class FamilyHealthProfile(BaseModel):
    has_elderly: bool = False
    has_infants: bool = False
    has_pregnant_member: bool = False
    has_asthma_respiratory: bool = False
    has_indoor_air_purifier: bool = False
    family_members_count: int = Field(3, ge=1, le=20)
    commute_mode: str = Field("Metro / Public Transit", max_length=50) # Metro, Car, Two-Wheeler, Bus, Walking
    indoor_pollution_sources: List[str] = Field(default_factory=list) # Incense, Mosquito Coils, Unvented Gas, Scented Candles

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=100)
    preferred_language: Optional[str] = Field("en", max_length=10)
    city: Optional[str] = Field("New Delhi", max_length=100)
    family_profile: Optional[FamilyHealthProfile] = None

    @field_validator("full_name", "city")
    @classmethod
    def sanitize_strings(cls, v: Optional[str]) -> Optional[str]:
        return sanitize_text(v)

class AIExplanationRequest(BaseModel):
    aqi: int = Field(..., ge=0, le=1000, description="AQI value between 0 and 1000")
    category: str = Field(..., max_length=50)
    primary_pollutant: str = Field("PM2.5", max_length=30)
    language: str = Field("en", max_length=10)
    family_profile: Optional[FamilyHealthProfile] = None

    @field_validator("category", "primary_pollutant", "language")
    @classmethod
    def sanitize_req_strings(cls, v: str) -> str:
        return sanitize_text(v) or v

class RoutineRequest(BaseModel):
    city: str = Field("New Delhi", max_length=100)
    aqi: int = Field(350, ge=0, le=1000)
    language: str = Field("en", max_length=10)

    @field_validator("city", "language")
    @classmethod
    def sanitize_routine_strings(cls, v: str) -> str:
        return sanitize_text(v) or v

class TransportRequest(BaseModel):
    distance_km: float = Field(12.0, ge=0.5, le=500.0, description="Commute distance in kilometers")

class CommunityReportCreate(BaseModel):
    incident_type: str = Field(..., pattern=r"^(GARBAGE_BURNING|STUBBLE_BURNING|INDUSTRIAL_SMOKE|VEHICULAR_SMARL|DUST_CONSTRUCTION)$")
    description: str = Field(..., min_length=5, max_length=1000)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    landmark: Optional[str] = Field("Local Street", max_length=200)

    @field_validator("description", "landmark")
    @classmethod
    def sanitize_report_strings(cls, v: Optional[str]) -> Optional[str]:
        return sanitize_text(v)
