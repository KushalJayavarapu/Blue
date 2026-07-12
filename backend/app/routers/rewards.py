from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.master import Reward

router = APIRouter(prefix="/rewards", tags=["rewards"])


def to_public(r: Reward) -> dict:
    return {
        "id": r.id,
        "name": r.name,
        "desc": r.description,
        "points": r.points_cost,
        "category": r.category,
        "emoji": r.emoji,
    }


@router.get("")
def list_rewards(db: Session = Depends(get_db)):
    return [to_public(r) for r in db.query(Reward).all()]
