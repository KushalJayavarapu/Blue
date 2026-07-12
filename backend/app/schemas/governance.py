from datetime import datetime, date
from typing import Optional

from pydantic import BaseModel

from app.models.governance import AuditStatus, ComplianceIssueStatus, ComplianceIssueSeverity


class ESGPolicyCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    effective_date: Optional[date] = None
    requires_acknowledgement: bool = True


class ESGPolicyRead(BaseModel):
    id: str
    title: str
    description: Optional[str]
    category: Optional[str]
    effective_date: Optional[date]
    requires_acknowledgement: bool

    class Config:
        from_attributes = True


class PolicyAcknowledgementCreate(BaseModel):
    employee_id: str
    policy_id: str


class PolicyAcknowledgementRead(BaseModel):
    id: str
    employee_id: str
    policy_id: str
    acknowledged_at: datetime

    class Config:
        from_attributes = True


class AuditCreate(BaseModel):
    title: str
    department_id: Optional[str] = None
    auditor_name: Optional[str] = None
    audit_date: Optional[date] = None


class AuditRead(BaseModel):
    id: str
    title: str
    department_id: Optional[str]
    auditor_name: Optional[str]
    audit_date: Optional[date]
    status: AuditStatus
    findings_summary: Optional[str]

    class Config:
        from_attributes = True


class ComplianceIssueCreate(BaseModel):
    title: str
    description: Optional[str] = None
    department_id: Optional[str] = None
    owner_id: Optional[str] = None
    due_date: Optional[date] = None
    severity: ComplianceIssueSeverity = ComplianceIssueSeverity.MEDIUM


class ComplianceIssueUpdate(BaseModel):
    status: Optional[ComplianceIssueStatus] = None
    owner_id: Optional[str] = None
    due_date: Optional[date] = None
    severity: Optional[ComplianceIssueSeverity] = None


class ComplianceIssueRead(BaseModel):
    id: str
    title: str
    description: Optional[str]
    department_id: Optional[str]
    owner_id: Optional[str]
    due_date: Optional[date]
    status: ComplianceIssueStatus
    severity: ComplianceIssueSeverity
    created_at: datetime

    class Config:
        from_attributes = True


class ProductESGProfileCreate(BaseModel):
    product_name: str
    category_id: Optional[str] = None
    esg_rating: Optional[float] = None
    carbon_footprint: Optional[float] = None
    notes: Optional[str] = None


class ProductESGProfileRead(BaseModel):
    id: str
    product_name: str
    category_id: Optional[str]
    esg_rating: Optional[float]
    carbon_footprint: Optional[float]
    notes: Optional[str]

    class Config:
        from_attributes = True
