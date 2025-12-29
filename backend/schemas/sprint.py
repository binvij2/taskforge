from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SprintBase(BaseModel):
    project_id: int
    name: str
    goal: Optional[str] = None
    start_date: datetime
    end_date: datetime
    status: str = "planned"

class SprintCreate(SprintBase):
    pass

class SprintUpdate(BaseModel):
    name: Optional[str] = None
    goal: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None

class SprintResponse(SprintBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True