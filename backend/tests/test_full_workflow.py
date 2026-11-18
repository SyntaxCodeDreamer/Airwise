import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_auth_profile_and_security():
    """Verify profile retrieval and updates with input validation."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Default profile fetch
        res = await ac.get("/api/v1/auth/profile")
        assert res.status_code == 200
        data = res.json()
        assert "uid" in data
        assert "family_profile" in data

        # Profile update
        update_payload = {
            "full_name": "Test Citizen",
            "preferred_language": "hi",
            "city": "Mumbai",
            "family_profile": {
                "has_elderly": True,
                "has_infants": True,
                "has_asthma_respiratory": False,
                "has_indoor_air_purifier": True
            }
        }
        update_res = await ac.put("/api/v1/auth/profile", json=update_payload)
        assert update_res.status_code == 200
        updated_data = update_res.json()["profile"]
        assert updated_data["full_name"] == "Test Citizen"
        assert updated_data["city"] == "Mumbai"
        assert updated_data["family_profile"]["has_infants"] is True

@pytest.mark.asyncio
async def test_community_incident_lifecycle():
    """Verify reporting, validation, and upvoting."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # List initial reports
        list_res = await ac.get("/api/v1/community/reports")
        assert list_res.status_code == 200
        initial_reports = list_res.json()
        assert len(initial_reports) >= 2

        # Create new report
        new_report = {
            "incident_type": "GARBAGE_BURNING",
            "description": "Open fire near metro pillar 45",
            "landmark": "Near Anand Vihar",
            "latitude": 28.6508,
            "longitude": 77.3152
        }
        create_res = await ac.post("/api/v1/community/reports", json=new_report)
        assert create_res.status_code == 200
        created_item = create_res.json()["report"]
        assert created_item["incident_type"] == "GARBAGE_BURNING"
        report_id = created_item["id"]

        # Upvote report
        upvote_res = await ac.post(f"/api/v1/community/reports/{report_id}/upvote")
        assert upvote_res.status_code == 200
        assert upvote_res.json()["upvotes"] == 2

@pytest.mark.asyncio
async def test_ai_explanation_safety_and_fallback():
    """Verify Gemini AI explanation handles extreme input ranges safely."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Severe AQI
        severe_req = {
            "aqi": 460,
            "category": "Severe",
            "primary_pollutant": "PM2.5",
            "language": "hi",
            "family_profile": {
                "has_elderly": True,
                "has_infants": False,
                "has_asthma_respiratory": True,
                "has_indoor_air_purifier": False
            }
        }
        severe_res = await ac.post("/api/v1/ai/explain", json=severe_req)
        assert severe_res.status_code == 200
        severe_data = severe_res.json()
        assert "simple_summary" in severe_data
        assert "immediate_actions" in severe_data
        assert len(severe_data["immediate_actions"]) > 0

        # Good AQI
        good_req = {
            "aqi": 35,
            "category": "Good",
            "primary_pollutant": "PM2.5",
            "language": "en"
        }
        good_res = await ac.post("/api/v1/ai/explain", json=good_req)
        assert good_res.status_code == 200
        good_data = good_res.json()
        assert "Safe" in good_data["outdoor_activity_verdict"] or "Normal" in good_data["outdoor_activity_verdict"] or "Precautions" in good_data["outdoor_activity_verdict"]

@pytest.mark.asyncio
async def test_input_validation_errors():
    """Verify invalid payloads are rejected with HTTP 422."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Missing required description in community report
        bad_report = {"incident_type": "GARBAGE_BURNING"}
        res = await ac.post("/api/v1/community/reports", json=bad_report)
        assert res.status_code == 422
