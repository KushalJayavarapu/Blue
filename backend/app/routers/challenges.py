from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.gamification import Challenge, ChallengeDifficulty, ChallengeParticipation, ChallengeStatus
from app.routers._crud import create_obj, get_or_404, update_obj

router = APIRouter(prefix="/challenges", tags=["challenges"])

# spec uses title-case difficulty ("Easy") and lowercase kanban columns ("draft");
# the model enums are upper-case, so map at the boundary rather than changing either.
_DIFFICULTIES = {d.value.lower(): d for d in ChallengeDifficulty}


class ChallengeCreate(BaseModel):
    name: str
    xp: int = 0
    difficulty: Optional[str] = None
    deadline: Optional[datetime] = None


class ChallengeUpdate(BaseModel):
    col: Optional[str] = None
    name: Optional[str] = None
    xp: Optional[int] = None
    difficulty: Optional[str] = None
    deadline: Optional[datetime] = None


def to_public(c: Challenge, db: Session) -> dict:
    participants = db.query(func.count(ChallengeParticipation.id)).filter(
        ChallengeParticipation.challenge_id == c.id
    ).scalar()
    return {
        "id": c.id,
        "name": c.name,
        "xp": c.xp_reward,
        "difficulty": c.difficulty.value.capitalize() if c.difficulty else None,
        "deadline": c.end_date.isoformat() if c.end_date else None,
        "col": c.status.lower(),
        "participantsCount": participants,
    }


@router.get("")
def list_challenges(db: Session = Depends(get_db)):
    return [to_public(c, db) for c in db.query(Challenge).all()]


@router.post("", status_code=201)
def create_challenge(body: ChallengeCreate, db: Session = Depends(get_db)):
    c = create_obj(
        db,
        Challenge,
        name=body.name,
        xp_reward=body.xp,
        difficulty=_DIFFICULTIES.get(body.difficulty.lower()) if body.difficulty else None,
        end_date=body.deadline,
        status=ChallengeStatus.DRAFT.value,
    )
    return to_public(c, db)


@router.patch("/{id}")
def update_challenge(id: str, body: ChallengeUpdate, db: Session = Depends(get_db)):
    c = get_or_404(db, Challenge, id)
    c = update_obj(
        db,
        c,
        name=body.name,
        xp_reward=body.xp,
        difficulty=_DIFFICULTIES.get(body.difficulty.lower()) if body.difficulty else None,
        end_date=body.deadline,
        status=body.col.upper() if body.col else None,
    )
    return to_public(c, db)
