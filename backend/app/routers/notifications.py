from fastapi import APIRouter, Depends
from sqlalchemy import update
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.notification import Notification
from app.routers._crud import get_or_404

router = APIRouter(prefix="/notifications", tags=["notifications"])


def to_public(n: Notification) -> dict:
    return {
        "id": n.id,
        "title": n.title or n.message,
        "desc": n.message,
        "createdAt": n.created_at.isoformat() if n.created_at else None,
        "read": n.is_read,
        "page": n.page,
    }


@router.get("")
def list_notifications(db: Session = Depends(get_db)):
    # ponytail: no auth yet, so this returns every notification rather than
    # scoping to a session's employee; narrow once /auth/me exists
    rows = db.query(Notification).order_by(Notification.created_at.desc()).all()
    return [to_public(n) for n in rows]


@router.patch("/read-all")
def mark_all_read(db: Session = Depends(get_db)):
    db.execute(update(Notification).values(is_read=True))
    db.commit()
    return {"success": True}


@router.patch("/{id}/read")
def mark_read(id: str, db: Session = Depends(get_db)):
    n = get_or_404(db, Notification, id)
    n.is_read = True
    db.commit()
    db.refresh(n)
    return to_public(n)
