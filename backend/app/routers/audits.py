from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.governance import Audit, AuditStatus
from app.routers._crud import create_obj, get_or_404, update_obj

router = APIRouter(prefix="/audits", tags=["audits"])


class AuditCreate(BaseModel):
    auditName: str
    dept: Optional[str] = None
    auditor: Optional[str] = None
    date: Optional[date] = None


class AuditUpdate(BaseModel):
    findings: Optional[str] = None
    status: Optional[AuditStatus] = None


def to_public(a: Audit) -> dict:
    return {
        "id": a.id,
        "auditName": a.title,
        "dept": a.department_id,
        "auditor": a.auditor_name,
        "date": a.audit_date.isoformat() if a.audit_date else None,
        "findings": a.findings_summary,
        "status": a.status.value,
    }


@router.get("")
def list_audits(db: Session = Depends(get_db)):
    return [to_public(a) for a in db.query(Audit).all()]


@router.post("", status_code=201)
def create_audit(body: AuditCreate, db: Session = Depends(get_db)):
    a = create_obj(
        db,
        Audit,
        title=body.auditName,
        department_id=body.dept,
        auditor_name=body.auditor,
        audit_date=body.date,
    )
    return to_public(a)


@router.patch("/{id}")
def update_audit(id: str, body: AuditUpdate, db: Session = Depends(get_db)):
    a = get_or_404(db, Audit, id)
    a = update_obj(db, a, findings_summary=body.findings, status=body.status)
    return to_public(a)
