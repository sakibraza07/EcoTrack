from fastapi import APIRouter, Depends

from database import create_activity, get_activities_by_user
from models.activity import ActivityCreate, ActivityOut
from routes.auth import get_current_user
from services.carbon_calculator import calculate_carbon

router = APIRouter()


@router.post("/", response_model=ActivityOut)
def add_activity(activity: ActivityCreate, current_user=Depends(get_current_user)):
    carbon = calculate_carbon(
        activity.transport,
        activity.distance,
        activity.food,
        activity.electricity,
    )
    created = create_activity(
        user_email=current_user["email"],
        activity_type=activity.activity_type,
        transport=activity.transport,
        distance=activity.distance,
        food=activity.food,
        electricity=activity.electricity,
        carbon=carbon,
    )
    return created


@router.get("/", response_model=list[ActivityOut])
def list_activities(current_user=Depends(get_current_user)):
    return get_activities_by_user(current_user["email"])
