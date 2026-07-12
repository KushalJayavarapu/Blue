import csv
import io
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.environmental import EnvironmentalGoal
from app.routers._crud import create_obj, delete_obj, get_or_404, update_obj

router = APIRouter(prefix="/goals", tags=["goals"])


class GoalCreate(BaseModel):
    name: str
    dept: str
    target: float
    current: float = 0
    deadline: Optional[date] = None


class GoalUpdate(BaseModel):
    name: Optional[str] = None
    dept: Optional[str] = None
    target: Optional[float] = None
    current: Optional[float] = None
    deadline: Optional[date] = None


def _computed_status(g: EnvironmentalGoal) -> str:
    # ponytail: naive heuristic (no historical trend data yet); upgrade to a
    # trend-based projection if goal tracking needs to be more accurate
    if g.current_value is not None and g.target_value and g.current_value >= g.target_value:
        return "completed"
    if g.deadline and g.deadline < date.today():
        return "overdue"
    if g.deadline and (g.deadline - date.today()).days <= 30:
        return "at-risk"
    return "on-track"


def to_public(g: EnvironmentalGoal) -> dict:
    return {
        "id": g.id,
        "name": g.name,
        "dept": g.department_id,
        "target": float(g.target_value) if g.target_value is not None else None,
        "current": float(g.current_value) if g.current_value is not None else None,
        "deadline": g.deadline.isoformat() if g.deadline else None,
        "status": _computed_status(g),
    }


@router.get("")
def list_goals(db: Session = Depends(get_db)):
    return [to_public(g) for g in db.query(EnvironmentalGoal).all()]


@router.get("/export")
def export_goals(db: Session = Depends(get_db)):
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=["id", "name", "dept", "target", "current", "deadline", "status"])
    writer.writeheader()
    for g in db.query(EnvironmentalGoal).all():
        writer.writerow(to_public(g))
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=goals.csv"},
    )


@router.post("", status_code=201)
def create_goal(body: GoalCreate, db: Session = Depends(get_db)):
    g = create_obj(
        db,
        EnvironmentalGoal,
        name=body.name,
        department_id=body.dept,
        target_value=body.target,
        current_value=body.current,
        deadline=body.deadline,
    )
    return to_public(g)


@router.patch("/{id}")
def update_goal(id: str, body: GoalUpdate, db: Session = Depends(get_db)):
    g = get_or_404(db, EnvironmentalGoal, id)
    g = update_obj(
        db,
        g,
        name=body.name,
        department_id=body.dept,
        target_value=body.target,
        current_value=body.current,
        deadline=body.deadline,
    )
    return to_public(g)


@router.delete("/{id}", status_code=204)
def delete_goal(id: str, db: Session = Depends(get_db)):
    g = get_or_404(db, EnvironmentalGoal, id)
    delete_obj(db, g)
