from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from models.database import get_db
from models.sprint import Sprint
from schemas.sprint import SprintCreate, SprintUpdate, SprintResponse

router = APIRouter()

@router.get("/sprints", response_model=List[SprintResponse])
def get_sprints(project_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Sprint)
    if project_id:
        query = query.filter(Sprint.project_id == project_id)
    sprints = query.all()
    return sprints

@router.get("/sprints/{sprint_id}", response_model=SprintResponse)
def get_sprint(sprint_id: int, db: Session = Depends(get_db)):
    sprint = db.query(Sprint).filter(Sprint.id == sprint_id).first()
    if not sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")
    return sprint

@router.post("/sprints", response_model=SprintResponse)
def create_sprint(sprint: SprintCreate, db: Session = Depends(get_db)):
    db_sprint = Sprint(**sprint.dict())
    db.add(db_sprint)
    db.commit()
    db.refresh(db_sprint)
    return db_sprint

@router.put("/sprints/{sprint_id}", response_model=SprintResponse)
def update_sprint(sprint_id: int, sprint: SprintUpdate, db: Session = Depends(get_db)):
    db_sprint = db.query(Sprint).filter(Sprint.id == sprint_id).first()
    if not db_sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")
    
    for key, value in sprint.dict(exclude_unset=True).items():
        setattr(db_sprint, key, value)
    
    db.commit()
    db.refresh(db_sprint)
    return db_sprint

@router.post("/sprints/{sprint_id}/start", response_model=SprintResponse)
def start_sprint(sprint_id: int, db: Session = Depends(get_db)):
    sprint = db.query(Sprint).filter(Sprint.id == sprint_id).first()
    if not sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")
    
    sprint.status = "active"
    db.commit()
    db.refresh(sprint)
    return sprint

@router.post("/sprints/{sprint_id}/complete", response_model=SprintResponse)
def complete_sprint(sprint_id: int, db: Session = Depends(get_db)):
    sprint = db.query(Sprint).filter(Sprint.id == sprint_id).first()
    if not sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")
    
    sprint.status = "completed"
    db.commit()
    db.refresh(sprint)
    return sprint