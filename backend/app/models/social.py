import enum
from datetime import datetime

from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Enum, DateTime

from app.database import Base
from app.models.base import UUIDPKMixin


class ParticipationStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class CSRActivityStatus(str, enum.Enum):
    UPCOMING = "UPCOMING"
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"


class CSRActivity(UUIDPKMixin, Base):
    __tablename__ = "csr_activities"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, nullable=True)
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)
    location = Column(String, nullable=True)
    event_date = Column(DateTime, nullable=True)
    capacity = Column(Integer, nullable=True)
    emoji = Column(String, nullable=True)
    participant_count = Column(Integer, default=0)
    points_value = Column(Integer, default=0)
    requires_evidence = Column(Boolean, default=True)
    status = Column(Enum(CSRActivityStatus), default=CSRActivityStatus.UPCOMING)
    created_at = Column(DateTime, default=datetime.utcnow)


class EmployeeParticipation(UUIDPKMixin, Base):
    """Evidence Requirement rule: status can't move to APPROVED unless
    evidence_file_path is set, when EVIDENCE_REQUIRED is on."""

    __tablename__ = "employee_participations"

    employee_id = Column(String, ForeignKey("employees.id"), nullable=False)
    csr_activity_id = Column(String, ForeignKey("csr_activities.id"), nullable=False)
    status = Column(Enum(ParticipationStatus), default=ParticipationStatus.PENDING)
    points_earned = Column(Integer, nullable=True)
    evidence_file_path = Column(String, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    decided_at = Column(DateTime, nullable=True)
    decided_by = Column(String, ForeignKey("employees.id"), nullable=True)
