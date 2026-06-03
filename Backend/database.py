import os
from datetime import datetime
from uuid import uuid4
from typing import Dict, List, Optional

from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "")
MONGO_DB = os.getenv("MONGO_DB", "ecotrack")

use_mongo = False
client = None
users_collection = None
activities_collection = None

if MONGO_URI and "<username>" not in MONGO_URI:
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.server_info()  # Validate connection
        db = client[MONGO_DB]
        users_collection = db["users"]
        activities_collection = db["activities"]
        users_collection.create_index("email", unique=True)
        activities_collection.create_index("user_email")
        use_mongo = True
        print("✅ Connected to MongoDB Atlas")
    except Exception as e:
        print(f"⚠️  MongoDB connection failed: {e}. Using in-memory storage.")
        use_mongo = False
else:
    print("⚠️  MONGO_URI not set. Using in-memory storage (data resets on restart).")

if not use_mongo:
    _users: Dict[str, Dict] = {}
    _activities: List[Dict] = []


def get_user_by_email(email: str) -> Optional[Dict]:
    if use_mongo:
        return users_collection.find_one({"email": email}, {"_id": 0})
    return _users.get(email)


def create_user(email: str, password_hash: str) -> Dict:
    user = {
        "id": str(uuid4()),
        "email": email,
        "password_hash": password_hash,
        "created_at": datetime.utcnow().isoformat(),
    }
    if use_mongo:
        users_collection.insert_one(user)
        return users_collection.find_one({"email": email}, {"_id": 0})
    _users[email] = user
    return user


def create_activity(
    user_email: str,
    activity_type: str,
    transport: str,
    distance: float,
    food: str,
    electricity: float,
    carbon: Dict[str, float],
) -> Dict:
    activity = {
        "id": str(uuid4()),
        "user_email": user_email,
        "activity_type": activity_type,
        "transport": transport,
        "distance": distance,
        "food": food,
        "electricity": electricity,
        "carbon": carbon,
        "created_at": datetime.utcnow().isoformat(),
    }
    if use_mongo:
        activities_collection.insert_one(activity)
        return activities_collection.find_one({"id": activity["id"]}, {"_id": 0})
    _activities.append(activity)
    return activity


def get_activities_by_user(user_email: str) -> List[Dict]:
    if use_mongo:
        return list(
            activities_collection.find({"user_email": user_email}, {"_id": 0}).sort("created_at", 1)
        )
    return [a for a in _activities if a["user_email"] == user_email]


def get_activity_summary(user_email: str) -> Dict[str, float]:
    activities = get_activities_by_user(user_email)
    total = sum(a["carbon"]["total"] for a in activities)
    return {
        "total_activities": len(activities),
        "total_carbon": round(total, 2),
        "average_carbon": round(total / len(activities), 2) if activities else 0.0,
    }
