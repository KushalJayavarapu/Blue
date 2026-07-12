from datetime import datetime, date
from typing import Optional

from pydantic import BaseModel

from app.models.environmental import TransactionSourceType, GoalStatus


class CarbonTransactionCreate(BaseModel):
    department_id: str
    category_id: str
    emission_factor_id: Optional[str] = None
    source_type: TransactionSourceType
    source_reference: Optional[str] = None
    quantity: float
    created_by: Optional[str] = None


class CarbonTransactionRead(BaseModel):
    id: str
    department_id: str
    category_id: str
    emission_factor_id: Optional[str]
    source_type: TransactionSourceType
    source_reference: Optional[str]
    quantity: float
    carbon_amount: float
    created_by: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class EnvironmentalGoalCreate(BaseModel):
    department_id: str
    name: str
    target_value: float
    deadline: Optional[date] = None


class EnvironmentalGoalUpdate(BaseModel):
    name: Optional[str] = None
    target_value: Optional[float] = None
    current_value: Optional[float] = None
    deadline: Optional[date] = None
    status: Optional[GoalStatus] = None


class EnvironmentalGoalRead(BaseModel):
    id: str
    department_id: str
    name: str
    target_value: float
    current_value: float
    deadline: Optional[date]
    status: GoalStatus

    class Config:
        from_attributes = True
