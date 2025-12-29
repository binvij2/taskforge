from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from models.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    assigned_tasks = relationship("Task", foreign_keys="Task.assigned_to", back_populates="assignee")
    created_tasks = relationship("Task", foreign_keys="Task.created_by", back_populates="creator")
    comments = relationship("Comment", back_populates="user")
    activity_logs = relationship("ActivityLog", back_populates="user")