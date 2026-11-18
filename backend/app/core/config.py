import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AirWise AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # MongoDB
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "airwise_ai")
    
    # Gemini AI
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Firebase
    FIREBASE_CREDENTIALS_JSON: str = os.getenv("FIREBASE_CREDENTIALS_JSON", "")
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "airwise-ai-hackathon")
    
    # Open-Meteo Air Quality URL
    OPEN_METEO_AQI_URL: str = "https://air-quality-api.open-meteo.com/v1/air-quality"
    OPENAQ_BASE_URL: str = "https://api.openaq.org/v2"

    # In-memory TTL cache duration for external environmental requests (seconds)
    AQI_CACHE_TTL_SECONDS: int = 300

    # Pydantic v2 ConfigDict
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
