from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.v1.endpoints import aqi, ai, community, auth

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Injects essential defensive security headers on all responses."""
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

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

# Attach Security Headers
app.add_middleware(SecurityHeadersMiddleware)

# Enable CORS for Web and Mobile platforms
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
