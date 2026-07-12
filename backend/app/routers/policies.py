from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.governance import ESGPolicy, PolicyAcknowledgement
from app.models.master import Employee
from app.routers._crud import create_obj, delete_obj, get_or_404, update_obj

router = APIRouter(prefix="/policies", tags=["policies"])


class PolicyCreate(BaseModel):
    name: str
    category: Optional[str] = None
    required: bool = True


class PolicyUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    required: Optional[bool] = None


def to_public(p: ESGPolicy, db: Session) -> dict:
    ack_count = db.query(func.count(PolicyAcknowledgement.id)).filter(
        PolicyAcknowledgement.policy_id == p.id
    ).scalar()
    total_count = db.query(func.count(Employee.id)).scalar()
    return {
        "id": p.id,
        "name": p.title,
        "category": p.category,
        "updatedAt": p.updated_at.isoformat() if p.updated_at else None,
        "required": p.requires_acknowledgement,
        "ackRate": round(ack_count / total_count, 4) if total_count else 0,
        "ackCount": ack_count,
        "totalCount": total_count,
    }


@router.get("")
def list_policies(db: Session = Depends(get_db)):
    return [to_public(p, db) for p in db.query(ESGPolicy).all()]


@router.post("", status_code=201)
def create_policy(body: PolicyCreate, db: Session = Depends(get_db)):
    p = create_obj(db, ESGPolicy, title=body.name, category=body.category, requires_acknowledgement=body.required)
    return to_public(p, db)


@router.patch("/{id}")
def update_policy(id: str, body: PolicyUpdate, db: Session = Depends(get_db)):
    p = get_or_404(db, ESGPolicy, id)
    p = update_obj(db, p, title=body.name, category=body.category, requires_acknowledgement=body.required)
    return to_public(p, db)


@router.delete("/{id}", status_code=204)
def delete_policy(id: str, db: Session = Depends(get_db)):
    p = get_or_404(db, ESGPolicy, id)
    delete_obj(db, p)
