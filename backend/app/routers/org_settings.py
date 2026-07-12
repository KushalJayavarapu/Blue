from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.master import OrgSettings

router = APIRouter(prefix="/org-settings", tags=["org-settings"])


class OrgSettingsUpdate(BaseModel):
    autoEmission: Optional[bool] = None
    requireEvidence: Optional[bool] = None
    autoAwardBadges: Optional[bool] = None
    emailCompliance: Optional[bool] = None


def _get_singleton(db: Session) -> OrgSettings:
    s = db.query(OrgSettings).first()
    if s is None:
        s = OrgSettings()
        db.add(s)
        db.commit()
        db.refresh(s)
    return s


def to_public(s: OrgSettings) -> dict:
    return {
        "autoEmission": s.auto_emission,
        "requireEvidence": s.require_evidence,
        "autoAwardBadges": s.auto_award_badges,
        "emailCompliance": s.email_compliance,
    }


@router.patch("")
def update_org_settings(body: OrgSettingsUpdate, db: Session = Depends(get_db)):
    s = _get_singleton(db)
    if body.autoEmission is not None:
        s.auto_emission = body.autoEmission
    if body.requireEvidence is not None:
        s.require_evidence = body.requireEvidence
    if body.autoAwardBadges is not None:
        s.auto_award_badges = body.autoAwardBadges
    if body.emailCompliance is not None:
        s.email_compliance = body.emailCompliance
    db.commit()
    db.refresh(s)
    return to_public(s)
