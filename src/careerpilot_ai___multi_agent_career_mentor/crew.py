import os
from dotenv import load_dotenv
from crewai import LLM
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

load_dotenv()


def is_real_api_key(value: str | None) -> bool:
    if not value:
        return False
    cleaned = value.strip()
    return bool(cleaned) and cleaned.lower() not in {"your_openai_api_key_here", "your_gemini_api_key_here", "changeme", "replace_me"}


def get_llm() -> LLM:
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if is_real_api_key(openai_api_key):
        return LLM(
            model="openai/gpt-4o-mini",
            api_key=openai_api_key,
        )

    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if is_real_api_key(gemini_api_key):
        return LLM(
            model="gemini/gemini-2.5-flash",
            api_key=gemini_api_key,
        )

    return LLM(model="openai/gpt-4o-mini")


llm = get_llm()


@CrewBase
class CareerpilotAiMultiAgentCareerMentorCrew:
    """CareerpilotAiMultiAgentCareerMentor crew"""

    
    @agent
    def resume_analysis_expert(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["resume_analysis_expert"],
            
            
            tools=[],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=llm,
            
        )
        
    
    @agent
    def skill_gap_analyst(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["skill_gap_analyst"],
            
            
            tools=[],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
           max_execution_time=None,
           llm=llm,
        
            
        )
        
    
    @agent
    def interview_question_specialist(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["interview_question_specialist"],
            
            
            tools=[],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=llm,

            
        )
        
    
    @agent
    def resume_improvement_specialist(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["resume_improvement_specialist"],
            
            
            tools=[],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=llm,

            
        )
        
    
    @agent
    def learning_roadmap_planner(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["learning_roadmap_planner"],
            
            
            tools=[],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=llm,

            
        )
        
    
    @agent
    def job_match_evaluator(self) -> Agent:
        
        
        return Agent(
            config=self.agents_config["job_match_evaluator"],
            
            
            tools=[],
            
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            
            
            max_execution_time=None,
            llm=llm,

            
        )
        
    

    
    @task
    def resume_analysis(self) -> Task:
        return Task(
            config=self.tasks_config["resume_analysis"],
            markdown=False,
            
            
        )
    
    @task
    def job_match_evaluation(self) -> Task:
        return Task(
            config=self.tasks_config["job_match_evaluation"],
            markdown=False,
            
            
        )
    
    @task
    def skill_gap_analysis(self) -> Task:
        return Task(
            config=self.tasks_config["skill_gap_analysis"],
            markdown=False,
            
            
        )
    
    @task
    def interview_questions_generation(self) -> Task:
        return Task(
            config=self.tasks_config["interview_questions_generation"],
            markdown=False,
            
            
        )
    
    @task
    def resume_enhancement(self) -> Task:
        return Task(
            config=self.tasks_config["resume_enhancement"],
            markdown=False,
            
            
        )
    
    @task
    def learning_roadmap_creation(self) -> Task:
        return Task(
            config=self.tasks_config["learning_roadmap_creation"],
            markdown=False,
            
            
        )
    

    @crew
    def crew(self) -> Crew:
        """Creates the CareerpilotAiMultiAgentCareerMentor crew"""

        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,  # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,

            chat_llm=llm
        )


