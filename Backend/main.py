from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.activity import router as activity_router
from routes.auth import router as auth_router
from routes.dashboard import router as dashboard_router

app = FastAPI(title="EcoTrack Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(activity_router, prefix="/activities", tags=["activities"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])


@app.get("/")
def root():
    return {"message": "EcoTrack backend is running"}
