import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.database import engine, Base
from routers import projects, sprints, tasks, users

app_id = os.getenv("APP_ID", "")
preview_domain = os.getenv("PREVIEW_DOMAIN", "")
preview_scheme = "https" if os.getenv("PREVIEW_USE_HTTPS", "false").lower() == "true" else "http"

if app_id and preview_domain:
    azure_preview_url = f"{preview_scheme}://app-{app_id}.{preview_domain}"
    allowed_origins = [
        azure_preview_url,
        "http://frontend:4000",
        "http://localhost:4000",
        "http://localhost:3000"
    ]
else:
    allowed_origins = [
        "http://localhost:4000",
        "http://frontend:4000",
        "http://localhost:3000",
        "http://frontend:3000"
    ]

app = FastAPI(title="DevTaskBoard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(projects.router, prefix="/api", tags=["projects"])
app.include_router(sprints.router, prefix="/api", tags=["sprints"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])
app.include_router(users.router, prefix="/api", tags=["users"])

@app.get("/")
def read_root():
    return {"message": "DevTaskBoard API is running"}

@app.on_event("startup")
async def startup_event():
    from models.database import SessionLocal
    from models.project import Project
    from models.sprint import Sprint
    from models.task import Task
    from models.user import User
    from datetime import datetime, timedelta
    
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            users = [
                User(username="john_doe", email="john@example.com", full_name="John Doe", avatar_url="https://i.pravatar.cc/150?img=1"),
                User(username="jane_smith", email="jane@example.com", full_name="Jane Smith", avatar_url="https://i.pravatar.cc/150?img=2"),
                User(username="bob_wilson", email="bob@example.com", full_name="Bob Wilson", avatar_url="https://i.pravatar.cc/150?img=3"),
            ]
            db.add_all(users)
            db.commit()
            
            project = Project(name="DevTaskBoard", key="DTB", description="Task management system for development teams")
            db.add(project)
            db.commit()
            
            sprint = Sprint(
                project_id=project.id,
                name="Sprint 1",
                goal="Build core features",
                start_date=datetime.now(),
                end_date=datetime.now() + timedelta(days=14),
                status="active"
            )
            db.add(sprint)
            db.commit()
            
            tasks = [
                Task(project_id=project.id, sprint_id=sprint.id, title="Setup project infrastructure", description="Initialize project with FastAPI and Next.js", task_type="task", status="done", priority="high", story_points=5, assigned_to=1, created_by=1),
                Task(project_id=project.id, sprint_id=sprint.id, title="Create database models", description="Define SQLAlchemy models for all entities", task_type="task", status="done", priority="high", story_points=3, assigned_to=1, created_by=1),
                Task(project_id=project.id, sprint_id=sprint.id, title="Build Kanban board", description="Implement drag-and-drop task board", task_type="story", status="in_progress", priority="high", story_points=8, assigned_to=2, created_by=1),
                Task(project_id=project.id, sprint_id=sprint.id, title="Add task filtering", description="Allow users to filter tasks by status and assignee", task_type="story", status="todo", priority="medium", story_points=5, assigned_to=2, created_by=1),
                Task(project_id=project.id, sprint_id=sprint.id, title="Fix bug in task assignment", description="Tasks not updating when assigned to users", task_type="bug", status="in_review", priority="high", story_points=2, assigned_to=3, created_by=2),
                Task(project_id=project.id, title="Design sprint planning view", description="Create UI mockups for sprint planning", task_type="story", status="todo", priority="medium", story_points=5, created_by=1),
                Task(project_id=project.id, title="Implement user authentication", description="Add JWT-based authentication", task_type="story", status="todo", priority="high", story_points=8, created_by=1),
            ]
            db.add_all(tasks)
            db.commit()
    finally:
        db.close()