from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TaskBase(BaseModel):
    project_id: int
    sprint_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    task_type: str
    status: str = "todo"
    priority: str = "medium"
    story_points: Optional[int] = None
    assigned_to: Optional[int] = None
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    created_by: int

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    task_type: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    story_points: Optional[int] = None
    assigned_to: Optional[int] = None
    sprint_id: Optional[int] = None
    due_date: Optional[datetime] = None

class TaskMove(BaseModel):
    status: Optional[str] = None
    sprint_id: Optional[int] = None

class TaskAssign(BaseModel):
    user_id: int

class TaskResponse(TaskBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True