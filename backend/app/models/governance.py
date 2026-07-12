import enum
from datetime import datetime

from sqlalchemy import Column, String, Boolean, Numeric, ForeignKey, Enum, DateTime, Date

from app.database import Base
from app.models.base import UUIDPKMixin


class AuditStatus(str, enum.Enum):
    SCHEDULED = "SCHEDULED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"


class ComplianceIssueStatus(str, enum.Enum):
    OPEN = "OPEN"
    RESOLVED = "RESOLVED"


class ComplianceIssueSeverity(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class ESGPolicy(UUIDPKMixin, Base):
    __tablename__ = "esg_policies"

    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, nullable=True)
    effective_date = Column(Date, nullable=True)
    requires_acknowledgement = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PolicyAcknowledgement(UUIDPKMixin, Base):
    __tablename__ = "policy_acknowledgements"

    employee_id = Column(String, ForeignKey("employees.id"), nullable=False)
    policy_id = Column(String, ForeignKey("esg_policies.id"), nullable=False)
    acknowledged_at = Column(DateTime, default=datetime.utcnow)


class Audit(UUIDPKMixin, Base):
    __tablename__ = "audits"

    title = Column(String, nullable=False)
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)
    auditor_name = Column(String, nullable=True)
    audit_date = Column(Date, nullable=True)
    status = Column(Enum(AuditStatus), default=AuditStatus.SCHEDULED)
    findings_summary = Column(String, nullable=True)


class ComplianceIssue(UUIDPKMixin, Base):
    """Compliance Issue Ownership rule: owner_id + due_date are required;
    an issue with status OPEN past due_date is flagged overdue."""

    __tablename__ = "compliance_issues"

    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)
    # nullable: seed data has unassigned issues; ownership is enforced going
    # forward at the API layer when an issue is created/claimed, per the
    # Compliance Issue Ownership business rule
    owner_id = Column(String, ForeignKey("employees.id"), nullable=True)
    due_date = Column(Date, nullable=True)
    status = Column(Enum(ComplianceIssueStatus), default=ComplianceIssueStatus.OPEN)
    severity = Column(Enum(ComplianceIssueSeverity), default=ComplianceIssueSeverity.MEDIUM)
    created_at = Column(DateTime, default=datetime.utcnow)


class ProductESGProfile(UUIDPKMixin, Base):
    __tablename__ = "product_esg_profiles"

    product_name = Column(String, nullable=False)
    category_id = Column(String, ForeignKey("categories.id"), nullable=True)
    esg_rating = Column(Numeric, nullable=True)
    carbon_footprint = Column(Numeric, nullable=True)
    notes = Column(String, nullable=True)
