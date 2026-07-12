from datetime import date, datetime

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.dashboard import DepartmentScore
from app.models.environmental import CarbonTransaction, EnvironmentalGoal
from app.models.governance import ComplianceIssue
from app.models.master import Department
from app.models.social import EmployeeParticipation

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def _latest_scores(db: Session):
    """One row per department: its most recent DepartmentScore by period."""
    latest_period = (
        db.query(
            DepartmentScore.department_id,
            func.max(DepartmentScore.period).label("period"),
        )
        .group_by(DepartmentScore.department_id)
        .subquery()
    )
    return (
        db.query(DepartmentScore)
        .join(
            latest_period,
            (DepartmentScore.department_id == latest_period.c.department_id)
            & (DepartmentScore.period == latest_period.c.period),
        )
        .all()
    )


@router.get("/kpis")
def kpis(db: Session = Depends(get_db)):
    scores = _latest_scores(db)
    n = len(scores) or 1
    env = sum(float(s.environmental_score or 0) for s in scores) / n
    social = sum(float(s.social_score or 0) for s in scores) / n
    gov = sum(float(s.governance_score or 0) for s in scores) / n
    overall = sum(float(s.overall_score or 0) for s in scores) / n
    # ponytail: no prior-period snapshot wired up yet, so "prev" == current;
    # swap in a real previous-period lookup once trend data matters
    return [
        {"label": "Environmental", "value": round(env, 1), "prev": round(env, 1)},
        {"label": "Social", "value": round(social, 1), "prev": round(social, 1)},
        {"label": "Governance", "value": round(gov, 1), "prev": round(gov, 1)},
        {"label": "Overall", "value": round(overall, 1), "prev": round(overall, 1)},
    ]


@router.get("/carbon-trend")
def carbon_trend(db: Session = Depends(get_db)):
    rows = (
        db.query(
            func.to_char(CarbonTransaction.created_at, "YYYY-MM").label("month"),
            func.sum(CarbonTransaction.carbon_amount).label("value"),
        )
        .group_by("month")
        .order_by("month")
        .all()
    )
    return [{"month": r.month, "value": float(r.value)} for r in rows]


@router.get("/department-ranking")
def department_ranking(db: Session = Depends(get_db)):
    scores = _latest_scores(db)
    dept_names = {d.id: d.name for d in db.query(Department).all()}
    ranked = sorted(scores, key=lambda s: float(s.overall_score or 0), reverse=True)
    return [
        {
            "rank": i + 1,
            "dept": dept_names.get(s.department_id, s.department_id),
            "env": float(s.environmental_score or 0),
            "social": float(s.social_score or 0),
            "gov": float(s.governance_score or 0),
            "overall": float(s.overall_score or 0),
        }
        for i, s in enumerate(ranked)
    ]


def _urgency(d: date) -> str:
    days = (d - date.today()).days
    if days < 7:
        return "high"
    if days < 30:
        return "medium"
    return "low"


@router.get("/deadlines")
def deadlines(db: Session = Depends(get_db)):
    items = []
    for g in db.query(EnvironmentalGoal).filter(EnvironmentalGoal.deadline.isnot(None)).all():
        items.append({"label": g.name, "date": g.deadline.isoformat(), "urgency": _urgency(g.deadline), "page": "/environmental"})
    for c in db.query(ComplianceIssue).filter(ComplianceIssue.due_date.isnot(None), ComplianceIssue.status == "OPEN").all():
        items.append({"label": c.title, "date": c.due_date.isoformat(), "urgency": _urgency(c.due_date), "page": "/governance"})
    items.sort(key=lambda i: i["date"])
    return items[:10]


@router.get("/activity-feed")
def activity_feed(db: Session = Depends(get_db)):
    items = []
    for p in (
        db.query(EmployeeParticipation)
        .order_by(EmployeeParticipation.submitted_at.desc())
        .limit(10)
        .all()
    ):
        items.append({"text": f"Participation {p.status.value.lower()} for activity", "time": p.submitted_at.isoformat(), "page": "/social"})
    for t in (
        db.query(CarbonTransaction)
        .order_by(CarbonTransaction.created_at.desc())
        .limit(10)
        .all()
    ):
        items.append({"text": f"Carbon transaction logged: {float(t.carbon_amount):.1f} kg CO2e", "time": t.created_at.isoformat(), "page": "/environmental"})
    items.sort(key=lambda i: i["time"], reverse=True)
    return items[:15]
