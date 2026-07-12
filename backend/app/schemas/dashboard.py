from datetime import datetime

from pydantic import BaseModel


class DepartmentScoreRead(BaseModel):
    id: str
    department_id: str
    period: str
    environmental_score: float
    social_score: float
    governance_score: float
    overall_score: float
    calculated_at: datetime

    class Config:
        from_attributes = True
