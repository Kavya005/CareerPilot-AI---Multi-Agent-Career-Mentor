import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "src"))
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://0.0.0.0:5173"],
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


@app.get("/")
def home():
    return {"message": "CareerPilot Backend Running", "database": "ready"}


@app.get("/health")
def health():
    return {"status": "ok"}


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