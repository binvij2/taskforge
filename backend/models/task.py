from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from models.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    sprint_id = Column(Integer, ForeignKey("sprints.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    task_type = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="todo")
    priority = Column(String(50), nullable=False, default="medium")
    story_points = Column(Integer, nullable=True)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    due_date = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="tasks")
    sprint = relationship("Sprint", back_populates="tasks")
    assignee = relationship("User", foreign_keys=[assigned_to], back_populates="assigned_tasks")
    creator = relationship("User", foreign_keys=[created_by], back_populates="created_tasks")
    comments = relationship("Comment", back_populates="task", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="task", cascade="all, delete-orphan")