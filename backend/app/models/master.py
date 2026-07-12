import enum
from datetime import datetime

from sqlalchemy import Column, String, Integer, Boolean, Numeric, ForeignKey, Enum, DateTime

from app.database import Base
from app.models.base import UUIDPKMixin


class ESGModule(str, enum.Enum):
    ENVIRONMENTAL = "Environmental"
    SOCIAL = "Social"
    GOVERNANCE = "Governance"


class ActiveStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


class EmployeeRole(str, enum.Enum):
    MANAGER = "MANAGER"
    EMPLOYEE = "EMPLOYEE"


class BadgeUnlockRuleType(str, enum.Enum):
    XP_THRESHOLD = "XP_THRESHOLD"
    CHALLENGE_COUNT = "CHALLENGE_COUNT"


class Department(UUIDPKMixin, Base):
    __tablename__ = "departments"

    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
    head_employee_id = Column(String, ForeignKey("employees.id"), nullable=True)
    parent_dept_id = Column(String, ForeignKey("departments.id"), nullable=True)
    employee_count = Column(Integer, default=0)
    status = Column(Enum(ActiveStatus), default=ActiveStatus.ACTIVE)


class Employee(UUIDPKMixin, Base):
    __tablename__ = "employees"

    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)
    role = Column(Enum(EmployeeRole), default=EmployeeRole.EMPLOYEE, nullable=False)
    xp_points = Column(Integer, default=0)
    # nullable: seeded employees predate auth; backfilled on first /auth/register or password set
    password_hash = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    points = Column(Integer, default=0)  # redeemable points balance, distinct from xp_points (level/badges)
    notif_weekly_digest = Column(Boolean, default=True)
    notif_email_compliance = Column(Boolean, default=True)
    notif_deadline_alerts = Column(Boolean, default=True)
    notif_activity = Column(Boolean, default=True)
    notif_challenge_reminders = Column(Boolean, default=True)
    notif_goal = Column(Boolean, default=True)


class Category(UUIDPKMixin, Base):
    """Emission source category, e.g. Purchase / Manufacturing / Fleet / Expense."""

    __tablename__ = "categories"

    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)


class EmissionFactor(UUIDPKMixin, Base):
    __tablename__ = "emission_factors"

    category_id = Column(String, ForeignKey("categories.id"), nullable=False)
    name = Column(String, nullable=False)
    unit = Column(String, nullable=False)  # e.g. "kg CO2e/unit"
    factor_value = Column(Numeric, nullable=False)
    source = Column(String, nullable=True)


class Badge(UUIDPKMixin, Base):
    __tablename__ = "badges"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    icon = Column(String, nullable=True)
    rarity = Column(String, nullable=True)
    # nullable: seed badges don't carry an unlock rule yet, Badge Auto-Award
    # logic will backfill these when it's built
    unlock_rule_type = Column(Enum(BadgeUnlockRuleType), nullable=True)
    unlock_rule_value = Column(Integer, nullable=True)


class Reward(UUIDPKMixin, Base):
    __tablename__ = "rewards"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    points_cost = Column(Integer, nullable=False)
    stock_quantity = Column(Integer, default=0)
    category = Column(String, nullable=True)
    emoji = Column(String, nullable=True)


class ESGCategory(UUIDPKMixin, Base):
    """Org-wide ESG taxonomy entry (module + color), distinct from Category
    (emission-factor categorization used by carbon transactions)."""

    __tablename__ = "esg_categories"

    name = Column(String, nullable=False)
    module = Column(Enum(ESGModule), nullable=False)
    unit = Column(String, nullable=True)
    color = Column(String, nullable=True)


class OrgSettings(UUIDPKMixin, Base):
    """Singleton row (org_settings table has exactly one record)."""

    __tablename__ = "org_settings"

    auto_emission = Column(Boolean, default=True)
    require_evidence = Column(Boolean, default=True)
    auto_award_badges = Column(Boolean, default=True)
    email_compliance = Column(Boolean, default=True)


class PointsLedger(UUIDPKMixin, Base):
    __tablename__ = "points_ledger"

    employee_id = Column(String, ForeignKey("employees.id"), nullable=False)
    delta = Column(Integer, nullable=False)
    reason = Column(String, nullable=False)
    ref_type = Column(String, nullable=True)
    ref_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
