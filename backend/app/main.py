from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.v1.endpoints import aqi, ai, community, auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AirWise AI — Real-time CPCB AQI monitoring, GenAI guidance, and sustainable transport advisory",
    lifespan=lifespan
)

# Enable CORS for Web and Mobile platforms
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(aqi.router, prefix=f"{settings.API_V1_STR}/aqi", tags=["Air Quality (CPCB NAQI)"])
app.include_router(ai.router, prefix=f"{settings.API_V1_STR}/ai", tags=["Generative AI (Gemini)"])
app.include_router(community.router, prefix=f"{settings.API_V1_STR}/community", tags=["Community Action"])
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["User & Family Profile"])

@app.get("/")
def root():
    return {
        "app": "AirWise AI API",
        "tagline": "Breathe Smarter. Live Healthier. Build a Cleaner Future.",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "standard": "Indian National AQI (NAQI CPCB)"}

