from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.gamification import EmployeeBadge
from app.models.master import Badge

router = APIRouter(prefix="/badges", tags=["badges"])


def to_public(b: Badge, db: Session) -> dict:
    earned_count = db.query(func.count(EmployeeBadge.id)).filter(EmployeeBadge.badge_id == b.id).scalar()
    return {
        "id": b.id,
        "name": b.name,
        "desc": b.description,
        "emoji": b.icon,
        "rarity": b.rarity,
        "earnedCount": earned_count,
    }


@router.get("")
def list_badges(db: Session = Depends(get_db)):
    return [to_public(b, db) for b in db.query(Badge).all()]
