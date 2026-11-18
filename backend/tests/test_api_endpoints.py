import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

@pytest.mark.asyncio
async def test_aqi_cities():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/aqi/cities")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    assert any(c["id"] == "delhi" for c in data)

@pytest.mark.asyncio
async def test_geocode():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/aqi/geocode?q=Delhi")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "lat" in data[0]
    assert "lon" in data[0]

@pytest.mark.asyncio
async def test_transport_advisor():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/ai/transport", json={"distance_km": 15.0})
    assert response.status_code == 200
    data = response.json()
    assert "modes" in data
    assert len(data["modes"]) == 4

@pytest.mark.asyncio
async def test_routine_planner():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/ai/routine", json={"city": "Delhi", "aqi": 340, "language": "en"})
    assert response.status_code == 200
    data = response.json()
    assert "optimal_routine" in data
