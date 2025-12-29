from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from models.database import get_db
from models.project import Project
from schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/projects", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return projects

@router.get("/projects/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/projects", response_model=ProjectResponse)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    try:
        logger.info(f"Creating project with data: {project.dict()}")
        
        # Check if project key already exists
        existing_project = db.query(Project).filter(Project.key == project.key.upper()).first()
        if existing_project:
            logger.error(f"Project key {project.key} already exists")
            raise HTTPException(status_code=400, detail=f"Project key '{project.key.upper()}' already exists")
        
        db_project = Project(**project.dict())
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        
        logger.info(f"Project created successfully with id: {db_project.id}")
        return db_project
        
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Database integrity error: {str(e)}")
        raise HTTPException(status_code=400, detail="Project key must be unique")
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating project: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")

@router.put("/projects/{project_id}", response_model=ProjectResponse)
def update_project(project_id: int, project: ProjectUpdate, db: Session = Depends(get_db)):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    for key, value in project.dict(exclude_unset=True).items():
        setattr(db_project, key, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(db_project)
    db.commit()
    return {"success": True}