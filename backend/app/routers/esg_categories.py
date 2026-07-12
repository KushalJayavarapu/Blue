from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.master import ESGCategory, ESGModule
from app.routers._crud import create_obj, delete_obj, get_or_404, update_obj

router = APIRouter(prefix="/esg-categories", tags=["esg-categories"])


class ESGCategoryCreate(BaseModel):
    name: str
    module: ESGModule
    unit: Optional[str] = None
    color: Optional[str] = None


class ESGCategoryUpdate(BaseModel):
    name: Optional[str] = None
    module: Optional[ESGModule] = None
    unit: Optional[str] = None
    color: Optional[str] = None


def to_public(c: ESGCategory) -> dict:
    return {"id": c.id, "name": c.name, "module": c.module.value, "unit": c.unit, "color": c.color}


@router.get("")
def list_esg_categories(db: Session = Depends(get_db)):
    return [to_public(c) for c in db.query(ESGCategory).all()]


@router.post("", status_code=201)
def create_esg_category(body: ESGCategoryCreate, db: Session = Depends(get_db)):
    c = create_obj(db, ESGCategory, name=body.name, module=body.module, unit=body.unit, color=body.color)
    return to_public(c)


@router.patch("/{id}")
def update_esg_category(id: str, body: ESGCategoryUpdate, db: Session = Depends(get_db)):
    c = get_or_404(db, ESGCategory, id)
    c = update_obj(db, c, name=body.name, module=body.module, unit=body.unit, color=body.color)
    return to_public(c)


@router.delete("/{id}", status_code=204)
def delete_esg_category(id: str, db: Session = Depends(get_db)):
    c = get_or_404(db, ESGCategory, id)
    delete_obj(db, c)
