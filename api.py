import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "src"))
from fastapi import FastAPI
from pydantic import BaseModel

from careerpilot_ai___multi_agent_career_mentor.crew import (
    CareerpilotAiMultiAgentCareerMentorCrew,
)

app = FastAPI()


class CareerRequest(BaseModel):
    company: str
    target_role: str
    resume_text: str


@app.get("/")
def home():
    return {"message": "CareerPilot Backend Running"}


@app.post("/ask")
def ask(request: CareerRequest):
    try:
        inputs = {
            "company": request.company,
            "target_role": request.target_role,
            "resume_text": request.resume_text,
        }

        result = (
            CareerpilotAiMultiAgentCareerMentorCrew()
            .crew()
            .kickoff(inputs=inputs)
        )

        return {
            "status": "success",
            "response": str(result)
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }