from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from models.database import get_db
from models.task import Task
from models.activity_log import ActivityLog
from schemas.task import TaskCreate, TaskUpdate, TaskMove, TaskAssign, TaskResponse
from schemas.comment import CommentCreate, CommentResponse
from schemas.activity_log import ActivityLogResponse
from models.comment import Comment

router = APIRouter()

@router.get("/tasks", response_model=List[TaskResponse])
def get_tasks(
    project_id: Optional[int] = Query(None),
    sprint_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    assigned_to: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Task)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    if sprint_id:
        query = query.filter(Task.sprint_id == sprint_id)
    if status:
        query = query.filter(Task.status == status)
    if assigned_to:
        query = query.filter(Task.assigned_to == assigned_to)
    
    tasks = query.all()
    return tasks

@router.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    activity = ActivityLog(
        task_id=db_task.id,
        user_id=task.created_by,
        action="created"
    )
    db.add(activity)
    db.commit()
    
    return db_task

@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    for key, value in task.dict(exclude_unset=True).items():
        old_value = getattr(db_task, key)
        if old_value != value:
            activity = ActivityLog(
                task_id=task_id,
                user_id=db_task.created_by,
                action="updated",
                field_changed=key,
                old_value=str(old_value) if old_value else None,
                new_value=str(value) if value else None
            )
            db.add(activity)
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"success": True}

@router.put("/tasks/{task_id}/move", response_model=TaskResponse)
def move_task(task_id: int, move: TaskMove, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if move.status:
        old_status = task.status
        task.status = move.status
        activity = ActivityLog(
            task_id=task_id,
            user_id=task.created_by,
            action="moved",
            field_changed="status",
            old_value=old_status,
            new_value=move.status
        )
        db.add(activity)
    
    if move.sprint_id is not None:
        old_sprint = task.sprint_id
        task.sprint_id = move.sprint_id
        activity = ActivityLog(
            task_id=task_id,
            user_id=task.created_by,
            action="moved",
            field_changed="sprint_id",
            old_value=str(old_sprint) if old_sprint else None,
            new_value=str(move.sprint_id) if move.sprint_id else None
        )
        db.add(activity)
    
    db.commit()
    db.refresh(task)
    return task

@router.put("/tasks/{task_id}/assign", response_model=TaskResponse)
def assign_task(task_id: int, assign: TaskAssign, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    old_assignee = task.assigned_to
    task.assigned_to = assign.user_id
    
    activity = ActivityLog(
        task_id=task_id,
        user_id=task.created_by,
        action="assigned",
        field_changed="assigned_to",
        old_value=str(old_assignee) if old_assignee else None,
        new_value=str(assign.user_id)
    )
    db.add(activity)
    
    db.commit()
    db.refresh(task)
    return task

@router.get("/tasks/{task_id}/comments", response_model=List[CommentResponse])
def get_task_comments(task_id: int, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.task_id == task_id).all()
    return comments

@router.post("/tasks/{task_id}/comments", response_model=CommentResponse)
def add_task_comment(task_id: int, comment: CommentCreate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_comment = Comment(**comment.dict())
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    
    activity = ActivityLog(
        task_id=task_id,
        user_id=comment.user_id,
        action="commented"
    )
    db.add(activity)
    db.commit()
    
    return db_comment

@router.get("/tasks/{task_id}/activity", response_model=List[ActivityLogResponse])
def get_task_activity(task_id: int, db: Session = Depends(get_db)):
    activity = db.query(ActivityLog).filter(ActivityLog.task_id == task_id).all()
    return activity