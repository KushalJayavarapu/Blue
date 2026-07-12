import enum
from datetime import datetime

from sqlalchemy import Column, String, Numeric, ForeignKey, Enum, DateTime, Date

from app.database import Base
from app.models.base import UUIDPKMixin


class TransactionSourceType(str, enum.Enum):
    PURCHASE = "PURCHASE"
    MANUFACTURING = "MANUFACTURING"
    EXPENSE = "EXPENSE"
    FLEET = "FLEET"
    MANUAL = "MANUAL"


class GoalStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    ACHIEVED = "ACHIEVED"
    MISSED = "MISSED"


class CarbonTransaction(UUIDPKMixin, Base):
    """When AUTO_EMISSION_CALC is on, carbon_amount is derived from quantity *
    emission_factor.factor_value at write time instead of being entered by hand."""

    __tablename__ = "carbon_transactions"

    department_id = Column(String, ForeignKey("departments.id"), nullable=False)
    category_id = Column(String, ForeignKey("categories.id"), nullable=False)
    emission_factor_id = Column(String, ForeignKey("emission_factors.id"), nullable=True)
    source_type = Column(Enum(TransactionSourceType), nullable=False)
    source_reference = Column(String, nullable=True)  # e.g. PO/invoice number
    quantity = Column(Numeric, nullable=False)
    carbon_amount = Column(Numeric, nullable=False)
    created_by = Column(String, ForeignKey("employees.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class EnvironmentalGoal(UUIDPKMixin, Base):
    __tablename__ = "environmental_goals"

    department_id = Column(String, ForeignKey("departments.id"), nullable=False)
    name = Column(String, nullable=False)
    target_value = Column(Numeric, nullable=False)
    current_value = Column(Numeric, default=0)
    deadline = Column(Date, nullable=True)
    status = Column(Enum(GoalStatus), default=GoalStatus.ACTIVE)
