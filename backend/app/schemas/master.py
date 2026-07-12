from typing import Optional

from pydantic import BaseModel

from app.models.master import ActiveStatus, EmployeeRole, BadgeUnlockRuleType


class DepartmentCreate(BaseModel):
    name: str
    code: str
    head_employee_id: Optional[str] = None
    parent_dept_id: Optional[str] = None


class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    head_employee_id: Optional[str] = None
    parent_dept_id: Optional[str] = None
    status: Optional[ActiveStatus] = None


class DepartmentRead(BaseModel):
    id: str
    name: str
    code: str
    head_employee_id: Optional[str]
    parent_dept_id: Optional[str]
    employee_count: int
    status: ActiveStatus

    class Config:
        from_attributes = True


class EmployeeCreate(BaseModel):
    name: str
    email: str
    department_id: Optional[str] = None
    role: EmployeeRole = EmployeeRole.EMPLOYEE


class EmployeeRead(BaseModel):
    id: str
    name: str
    email: str
    department_id: Optional[str]
    role: EmployeeRole
    xp_points: int

    class Config:
        from_attributes = True


class CategoryCreate(BaseModel):
    name: str
    code: str
    description: Optional[str] = None


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class CategoryRead(BaseModel):
    id: str
    name: str
    code: str
    description: Optional[str]

    class Config:
        from_attributes = True


class EmissionFactorCreate(BaseModel):
    category_id: str
    name: str
    unit: str
    factor_value: float
    source: Optional[str] = None


class EmissionFactorUpdate(BaseModel):
    name: Optional[str] = None
    unit: Optional[str] = None
    factor_value: Optional[float] = None
    source: Optional[str] = None


class EmissionFactorRead(BaseModel):
    id: str
    category_id: str
    name: str
    unit: str
    factor_value: float
    source: Optional[str]

    class Config:
        from_attributes = True


class BadgeCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    unlock_rule_type: Optional[BadgeUnlockRuleType] = None
    unlock_rule_value: Optional[int] = None


class BadgeRead(BaseModel):
    id: str
    name: str
    description: Optional[str]
    icon: Optional[str]
    unlock_rule_type: Optional[BadgeUnlockRuleType]
    unlock_rule_value: Optional[int]

    class Config:
        from_attributes = True


class RewardCreate(BaseModel):
    name: str
    description: Optional[str] = None
    points_cost: int
    stock_quantity: int = 0


class RewardRead(BaseModel):
    id: str
    name: str
    description: Optional[str]
    points_cost: int
    stock_quantity: int

    class Config:
        from_attributes = True
