import re
from fastapi import APIRouter, Depends, Path, HTTPException, status
from datetime import datetime, timezone
from typing import List
from app.core.auth import get_current_user, AuthenticatedUser
from app.models.schemas import CommunityReportCreate

router = APIRouter()

COMMUNITY_REPORTS = [
    {
        "id": "rep_101",
        "user_name": "Aarav Sharma",
        "incident_type": "GARBAGE_BURNING",
        "description": "Open plastic and fallen leaf burning near community park perimeter.",
        "landmark": "Near Anand Vihar Bus Terminal",
        "latitude": 28.6508,
        "longitude": 77.3152,
        "upvotes": 14,
        "status": "VERIFIED",
        "created_at": "2026-11-17T15:20:00Z"
    },
    {
        "id": "rep_102",
        "user_name": "Priya Nair",
        "incident_type": "DUST_CONSTRUCTION",
        "description": "Uncovered demolition site generating massive particulate dust plumes.",
        "landmark": "Ring Road Crossing, New Delhi",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "upvotes": 9,
        "status": "REPORTED",
        "created_at": "2026-11-17T16:05:00Z"
    }
]

@router.get("/reports")
async def list_reports():
    """Returns verified and reported community air pollution incidents."""
    return COMMUNITY_REPORTS

@router.post("/reports")
async def create_report(
    report: CommunityReportCreate,
    user: AuthenticatedUser = Depends(get_current_user)
):
    """Submits a new citizen incident report with input sanitization."""
    new_rep = {
        "id": f"rep_{len(COMMUNITY_REPORTS) + 101}",
        "user_name": user.name or "Concerned Citizen",
        "incident_type": report.incident_type,
        "description": report.description,
        "landmark": report.landmark,
        "latitude": report.latitude,
        "longitude": report.longitude,
        "upvotes": 1,
        "status": "REPORTED",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    COMMUNITY_REPORTS.insert(0, new_rep)
    return {"message": "Report logged successfully", "report": new_rep}

@router.post("/reports/{report_id}/upvote")
async def upvote_report(
    report_id: str = Path(..., pattern=r"^rep_[0-9]+$", description="Valid report ID format")
):
    """Upvote/verify an incident report."""
    for rep in COMMUNITY_REPORTS:
        if rep["id"] == report_id:
            rep["upvotes"] += 1
            if rep["upvotes"] >= 5:
                rep["status"] = "VERIFIED"
            return {"message": "Report verified", "upvotes": rep["upvotes"]}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
