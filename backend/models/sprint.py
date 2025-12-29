from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from models.database import Base

class Sprint(Base):
    __tablename__ = "sprints"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    name = Column(String(255), nullable=False)
    goal = Column(Text, nullable=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    status = Column(String(50), nullable=False, default="planned")
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="sprints")
    tasks = relationship("Task", back_populates="sprint")