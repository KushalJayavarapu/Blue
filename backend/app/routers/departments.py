from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.master import ActiveStatus, Department
from app.routers._crud import create_obj, delete_obj, get_or_404, update_obj

router = APIRouter(prefix="/departments", tags=["departments"])


class DepartmentCreate(BaseModel):
    name: str
    code: str
    head: Optional[str] = None
    parentId: Optional[str] = None


class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    head: Optional[str] = None
    parentId: Optional[str] = None
    active: Optional[bool] = None


def to_public(d: Department) -> dict:
    return {
        "id": d.id,
        "name": d.name,
        "code": d.code,
        "head": d.head_employee_id,
        "parentId": d.parent_dept_id,
        "employeeCount": d.employee_count,
        "active": d.status == ActiveStatus.ACTIVE,
    }


@router.get("")
def list_departments(db: Session = Depends(get_db)):
    return [to_public(d) for d in db.query(Department).all()]


@router.post("", status_code=201)
def create_department(body: DepartmentCreate, db: Session = Depends(get_db)):
    d = create_obj(
        db,
        Department,
        name=body.name,
        code=body.code,
        head_employee_id=body.head,
        parent_dept_id=body.parentId,
    )
    return to_public(d)


@router.patch("/{id}")
def update_department(id: str, body: DepartmentUpdate, db: Session = Depends(get_db)):
    d = get_or_404(db, Department, id)
    status = None
    if body.active is not None:
        status = ActiveStatus.ACTIVE if body.active else ActiveStatus.INACTIVE
    d = update_obj(
        db,
        d,
        name=body.name,
        code=body.code,
        head_employee_id=body.head,
        parent_dept_id=body.parentId,
        status=status,
    )
    return to_public(d)


@router.delete("/{id}", status_code=204)
def delete_department(id: str, db: Session = Depends(get_db)):
    d = get_or_404(db, Department, id)
    delete_obj(db, d)
