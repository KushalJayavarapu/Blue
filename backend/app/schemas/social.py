from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.social import ParticipationStatus, CSRActivityStatus


class CSRActivityCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    department_id: Optional[str] = None
    location: Optional[str] = None
    event_date: Optional[datetime] = None
    capacity: Optional[int] = None
    points_value: int = 0
    requires_evidence: bool = True


class CSRActivityRead(BaseModel):
    id: str
    name: str
    description: Optional[str]
    category: Optional[str]
    department_id: Optional[str]
    location: Optional[str]
    event_date: Optional[datetime]
    capacity: Optional[int]
    participant_count: int
    points_value: int
    requires_evidence: bool
    status: CSRActivityStatus
    created_at: datetime

    class Config:
        from_attributes = True


class EmployeeParticipationCreate(BaseModel):
    employee_id: str
    csr_activity_id: str
    evidence_file_path: Optional[str] = None


class EmployeeParticipationRead(BaseModel):
    id: str
    employee_id: str
    csr_activity_id: str
    status: ParticipationStatus
    points_earned: Optional[int]
    evidence_file_path: Optional[str]
    submitted_at: datetime
    decided_at: Optional[datetime]
    decided_by: Optional[str]

    class Config:
        from_attributes = True
