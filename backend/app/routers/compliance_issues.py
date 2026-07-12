from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.governance import ComplianceIssue, ComplianceIssueStatus
from app.routers._crud import get_or_404, update_obj

router = APIRouter(prefix="/compliance-issues", tags=["compliance-issues"])


class ComplianceIssueUpdate(BaseModel):
    status: Optional[ComplianceIssueStatus] = None
    owner: Optional[str] = None


def to_public(c: ComplianceIssue) -> dict:
    return {
        "id": c.id,
        "issue": c.title,
        "severity": c.severity.value,
        "owner": c.owner_id,
        "dueDate": c.due_date.isoformat() if c.due_date else None,
        "status": c.status.value,
    }


@router.get("")
def list_compliance_issues(db: Session = Depends(get_db)):
    return [to_public(c) for c in db.query(ComplianceIssue).all()]


@router.patch("/{id}")
def update_compliance_issue(id: str, body: ComplianceIssueUpdate, db: Session = Depends(get_db)):
    c = get_or_404(db, ComplianceIssue, id)
    c = update_obj(db, c, status=body.status, owner_id=body.owner)
    return to_public(c)
