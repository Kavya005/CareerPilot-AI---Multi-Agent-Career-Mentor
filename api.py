import os
import sys
from pathlib import Path

sys.path.append(os.path.join(os.path.dirname(__file__), "src"))
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.orm import Session

from careerpilot_ai___multi_agent_career_mentor.crew import (
    CareerpilotAiMultiAgentCareerMentorCrew,
)
from careerpilot_ai___multi_agent_career_mentor.database import init_db, session_local
from careerpilot_ai___multi_agent_career_mentor.models import AnalysisRequest


def build_fallback_response(request: "CareerRequest") -> dict:
    return {
        "status": "success",
        "response": f"CrewAI analysis is temporarily unavailable. Gemini quota may be exhausted. Please try again later.\nCompany: {request.company}\nRole: {request.target_role}\nResume length: {len(request.resume_text)} characters",
        "request_id": None,
        "fallback": True,
    }

app = FastAPI(title="CareerPilot API")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://0.0.0.0:5173",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.onrender\.com$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


init_db()


class CareerRequest(BaseModel):
    company: str
    target_role: str
    resume_text: str


def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()


@app.get("/api")
def home():
    return {"message": "CareerPilot Backend Running", "database": "ready"}


@app.get("/health")
def health():
    return {"status": "ok"}


frontend_dist = Path(__file__).parent / "frontend" / "dist"
if frontend_dist.exists():
    assets_dir = frontend_dist / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/", include_in_schema=False)
    async def serve_frontend_root():
        return FileResponse(frontend_dist / "index.html")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_frontend_fallback(full_path: str):
        candidate = frontend_dist / full_path
        if candidate.exists() and candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(frontend_dist / "index.html")


@app.post("/ask")
def ask(request: CareerRequest, db: Session = Depends(get_db)):
    try:
        db_record = AnalysisRequest(
            company=request.company,
            target_role=request.target_role,
            status="processing",
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)

        inputs = {
            "company": request.company,
            "target_role": request.target_role,
            "resume_text": request.resume_text,
        }

        try:
            result = (
                CareerpilotAiMultiAgentCareerMentorCrew()
                .crew()
                .kickoff(inputs=inputs)
            )
            db_record.response = str(result)
            db_record.status = "completed"
            db.commit()
            return {
                "status": "success",
                "response": str(result),
                "request_id": db_record.id,
                "fallback": False,
            }
        except Exception as crew_error:
            db_record.response = str(crew_error)
            db_record.status = "fallback"
            db.commit()
            return build_fallback_response(request) | {"request_id": db_record.id}

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }