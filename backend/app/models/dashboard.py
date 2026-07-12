from datetime import datetime

from sqlalchemy import Column, String, Numeric, ForeignKey, DateTime

from app.database import Base
from app.models.base import UUIDPKMixin


class DepartmentScore(UUIDPKMixin, Base):
    """Rollup snapshot: environmental/social/governance -> overall ESG,
    recalculated per period (e.g. one row per department per month)."""

    __tablename__ = "department_scores"

    department_id = Column(String, ForeignKey("departments.id"), nullable=False)
    period = Column(String, nullable=False)  # e.g. "2026-07"
    environmental_score = Column(Numeric, default=0)
    social_score = Column(Numeric, default=0)
    governance_score = Column(Numeric, default=0)
    overall_score = Column(Numeric, default=0)
    calculated_at = Column(DateTime, default=datetime.utcnow)
