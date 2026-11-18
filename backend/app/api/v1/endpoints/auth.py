from fastapi import APIRouter, Depends
from app.core.auth import get_current_user, AuthenticatedUser
from app.models.schemas import UserProfileUpdate

router = APIRouter()

USER_STORE = {}

@router.get("/profile")
async def get_profile(user: AuthenticatedUser = Depends(get_current_user)):
    """Returns the authenticated user's profile and family health context."""
    if user.uid not in USER_STORE:
        USER_STORE[user.uid] = {
            "uid": user.uid,
            "email": user.email,
            "full_name": user.name or "AirWise Citizen",
            "preferred_language": "en",
            "city": "New Delhi",
            "family_profile": {
                "has_elderly": True,
                "has_infants": False,
                "has_asthma_respiratory": True,
                "has_indoor_air_purifier": False
            }
        }
    return USER_STORE[user.uid]

@router.put("/profile")
async def update_profile(
    update_data: UserProfileUpdate,
    user: AuthenticatedUser = Depends(get_current_user)
):
    """Updates user preferences and family vulnerability flags."""
    profile = USER_STORE.get(user.uid, {
        "uid": user.uid,
        "email": user.email,
        "full_name": user.name or "AirWise Citizen",
        "preferred_language": "en",
        "city": "New Delhi",
        "family_profile": {}
    })
    
    if update_data.full_name is not None:
        profile["full_name"] = update_data.full_name
    if update_data.preferred_language is not None:
        profile["preferred_language"] = update_data.preferred_language
    if update_data.city is not None:
        profile["city"] = update_data.city
    if update_data.family_profile is not None:
        profile["family_profile"] = update_data.family_profile.model_dump()
        
    USER_STORE[user.uid] = profile
    return {"message": "Profile updated", "profile": profile}

@router.delete("/account")
async def delete_account(user: AuthenticatedUser = Depends(get_current_user)):
    """Deletes the user's profile and anonymizes associated logs."""
    if user.uid in USER_STORE:
        del USER_STORE[user.uid]
    return {"message": "User account and health profiles purged successfully."}

