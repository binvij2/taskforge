from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True