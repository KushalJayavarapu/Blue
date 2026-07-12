"""One-shot import of the hackathon demo dataset from /data/*.csv into Postgres.

Run after `alembic upgrade head`:
    python -m app.seed_data
"""
import csv
import uuid
from datetime import datetime, date
from pathlib import Path

from app.database import SessionLocal
from app.models import (
    Department, Employee, Category, Badge, Reward, Challenge,
    CSRActivity, EmployeeParticipation, CarbonTransaction, EnvironmentalGoal,
    Audit, ComplianceIssue, Notification,
)
from app.models.master import ActiveStatus, EmployeeRole
from app.models.gamification import ChallengeStatus, ChallengeDifficulty
from app.models.social import ParticipationStatus, CSRActivityStatus
from app.models.governance import AuditStatus, ComplianceIssueStatus, ComplianceIssueSeverity
from app.models.environmental import TransactionSourceType

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"

ROLE_MAP = {
    "Admin": EmployeeRole.MANAGER,
    "ESG Manager": EmployeeRole.MANAGER,
    "Manager": EmployeeRole.MANAGER,
    "Employee": EmployeeRole.EMPLOYEE,
}
AUDIT_STATUS_MAP = {
    "Scheduled": AuditStatus.SCHEDULED,
    "Under Review": AuditStatus.IN_PROGRESS,
    "Completed": AuditStatus.COMPLETED,
}
CHALLENGE_STATUS_MAP = {
    "Draft": ChallengeStatus.UPCOMING,
    "Active": ChallengeStatus.ACTIVE,
    "Completed": ChallengeStatus.COMPLETED,
}
CSR_STATUS_MAP = {
    "Upcoming": CSRActivityStatus.UPCOMING,
    "Ongoing": CSRActivityStatus.ONGOING,
    "Completed": CSRActivityStatus.COMPLETED,
}
PARTICIPATION_STATUS_MAP = {
    "Approved": ParticipationStatus.APPROVED,
    "Pending": ParticipationStatus.PENDING,
    "Rejected": ParticipationStatus.REJECTED,
}


def rows(filename):
    with open(DATA_DIR / filename, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def parse_date(value):
    return datetime.strptime(value, "%Y-%m-%d").date() if value else None


def parse_bool(value):
    return str(value).strip().lower() == "true"


def seed():
    db = SessionLocal()
    try:
        dept_by_name = {}
        for r in rows("departments.csv"):
            dept = Department(
                name=r["name"],
                code=r["code"],
                status=ActiveStatus.ACTIVE if r["status"] == "Active" else ActiveStatus.INACTIVE,
            )
            db.add(dept)
            dept_by_name[r["name"]] = dept
        db.flush()

        employee_by_user_id = {}
        for r in rows("users.csv"):
            emp = Employee(
                name=r["name"],
                email=r["email"],
                department_id=dept_by_name[r["department"]].id if r["department"] in dept_by_name else None,
                role=ROLE_MAP.get(r["role"], EmployeeRole.EMPLOYEE),
            )
            db.add(emp)
            employee_by_user_id[r["user_id"]] = emp
        db.flush()

        for dept in dept_by_name.values():
            dept.employee_count = sum(
                1 for e in employee_by_user_id.values() if e.department_id == dept.id
            )

        badge_by_id = {}
        for r in rows("badges.csv"):
            badge = Badge(name=r["badge"])
            db.add(badge)
            badge_by_id[r["badge_id"]] = badge

        reward_by_id = {}
        for r in rows("rewards.csv"):
            reward = Reward(name=r["reward"], points_cost=int(r["points"]), stock_quantity=50)
            db.add(reward)
            reward_by_id[r["reward_id"]] = reward

        challenge_by_id = {}
        for r in rows("challenges.csv"):
            challenge = Challenge(
                name=r["title"],
                xp_reward=int(r["xp"]),
                difficulty=ChallengeDifficulty[r["difficulty"].upper()],
                status=CHALLENGE_STATUS_MAP[r["status"]],
            )
            db.add(challenge)
            challenge_by_id[r["challenge_id"]] = challenge
        db.flush()

        category_by_name = {}

        def get_category(name):
            if name not in category_by_name:
                cat = Category(name=name, code=name.upper().replace(" ", "_"))
                db.add(cat)
                db.flush()
                category_by_name[name] = cat
            return category_by_name[name]

        activity_by_id = {}
        for r in rows("csr_activities.csv"):
            activity = CSRActivity(
                name=r["title"],
                category=r["category"],
                department_id=dept_by_name[r["department"]].id if r["department"] in dept_by_name else None,
                location=r["location"],
                event_date=datetime.combine(parse_date(r["date"]), datetime.min.time()) if r["date"] else None,
                capacity=int(r["capacity"]) if r["capacity"] else None,
                participant_count=int(r["participants"]) if r["participants"] else 0,
                points_value=int(r["points"]) if r["points"] else 0,
                status=CSR_STATUS_MAP.get(r["status"], CSRActivityStatus.UPCOMING),
            )
            db.add(activity)
            activity_by_id[r["activity_id"]] = activity
        db.flush()

        for r in rows("carbon_transactions.csv"):
            dept = dept_by_name.get(r["department"])
            db.add(CarbonTransaction(
                department_id=dept.id if dept else None,
                category_id=get_category(r["source"]).id,
                source_type=TransactionSourceType.MANUAL,
                source_reference=r["source"],
                quantity=float(r["co2_kg"]),
                carbon_amount=float(r["co2_kg"]),
                created_at=datetime.combine(parse_date(r["date"]), datetime.min.time()) if r["date"] else None,
            ))

        for r in rows("environmental_goals.csv"):
            dept = dept_by_name.get(r["department"])
            db.add(EnvironmentalGoal(
                department_id=dept.id if dept else None,
                name=r["goal_name"],
                target_value=float(r["target_reduction_percent"]),
                current_value=float(r["progress_percent"]),
                deadline=parse_date(r["deadline"]),
            ))

        for r in rows("employee_participation.csv"):
            emp = employee_by_user_id.get(r["user_id"])
            activity = activity_by_id.get(r["activity_id"])
            if not emp or not activity:
                continue
            db.add(EmployeeParticipation(
                employee_id=emp.id,
                csr_activity_id=activity.id,
                status=PARTICIPATION_STATUS_MAP.get(r["approval_status"], ParticipationStatus.PENDING),
                points_earned=int(r["points_earned"]) if r["points_earned"] else None,
                decided_at=datetime.combine(parse_date(r["completion_date"]), datetime.min.time()) if r["completion_date"] else None,
            ))

        for r in rows("audits.csv"):
            dept = dept_by_name.get(r["department"])
            db.add(Audit(
                title=r["title"],
                department_id=dept.id if dept else None,
                status=AUDIT_STATUS_MAP.get(r["status"], AuditStatus.SCHEDULED),
            ))

        for r in rows("compliance_issues.csv"):
            dept = dept_by_name.get(r["department"])
            db.add(ComplianceIssue(
                title=r["title"],
                department_id=dept.id if dept else None,
                severity=ComplianceIssueSeverity[r["severity"].upper()],
                status=ComplianceIssueStatus[r["status"].upper()],
            ))

        for r in rows("notifications.csv"):
            emp = employee_by_user_id.get(r["user_id"])
            if not emp:
                continue
            db.add(Notification(
                employee_id=emp.id,
                message=r["message"],
                is_read=parse_bool(r["read"]),
            ))

        db.commit()
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
