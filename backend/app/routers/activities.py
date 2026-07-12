from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.social import CSRActivity

router = APIRouter(prefix="/activities", tags=["activities"])


def to_public(a: CSRActivity) -> dict:
    return {
        "id": a.id,
        "title": a.name,
        "desc": a.description,
        "participantsCount": a.participant_count,
        "points": a.points_value,
        "category": a.category,
        "emoji": a.emoji,
    }


@router.get("")
def list_activities(db: Session = Depends(get_db)):
    return [to_public(a) for a in db.query(CSRActivity).all()]
