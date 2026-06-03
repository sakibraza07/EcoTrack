from fastapi import APIRouter, Depends

from database import get_activity_summary, get_activities_by_user
from models.activity import SummaryResponse
from routes.auth import get_current_user
from services.recommendation_engine import get_recommendations

router = APIRouter()


@router.get("/summary")
def dashboard_summary(current_user=Depends(get_current_user)):
    activities = get_activities_by_user(current_user["email"])
    summary = get_activity_summary(current_user["email"])
    latest = activities[-1]["carbon"] if activities else {"transport": 0.0, "food": 0.0, "electricity": 0.0}
    return {
        "summary": summary,
        "recommendations": get_recommendations(latest),
        "recent_activities": activities,
    }
