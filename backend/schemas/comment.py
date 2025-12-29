from pydantic import BaseModel
from datetime import datetime

class CommentBase(BaseModel):
    task_id: int
    user_id: int
    content: str

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True