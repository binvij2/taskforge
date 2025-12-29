from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ActivityLogBase(BaseModel):
    task_id: int
    user_id: int
    action: str
    field_changed: Optional[str] = None
    old_value: Optional[str] = None
    new_value: Optional[str] = None

class ActivityLogResponse(ActivityLogBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True