from datetime import datetime
from pydantic import BaseModel, Field
from typing import Dict


class ActivityCreate(BaseModel):
    activity_type: str = Field(..., example="weekly check-in")
    transport: str = Field(..., example="car")
    distance: float = Field(..., ge=0, example=10)
    food: str = Field(..., example="mixed")
    electricity: float = Field(..., ge=0, example=12)


class ActivityOut(BaseModel):
    id: str
    user_email: str
    activity_type: str
    transport: str
    distance: float
    food: str
    electricity: float
    carbon: Dict[str, float]
    created_at: datetime


class SummaryResponse(BaseModel):
    total_activities: int
    total_carbon: float
    average_carbon: float
