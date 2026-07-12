from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.master import EmissionFactor
from app.routers._crud import create_obj

router = APIRouter(prefix="/emission-factors", tags=["emission-factors"])


class EmissionFactorCreate(BaseModel):
    name: str
    category: str
    factor: float
    unit: str


def to_public(f: EmissionFactor) -> dict:
    return {
        "id": f.id,
        "name": f.name,
        "category": f.category_id,
        "factor": float(f.factor_value),
        "unit": f.unit,
    }


@router.get("")
def list_emission_factors(db: Session = Depends(get_db)):
    return [to_public(f) for f in db.query(EmissionFactor).all()]


@router.post("", status_code=201)
def create_emission_factor(body: EmissionFactorCreate, db: Session = Depends(get_db)):
    f = create_obj(
        db,
        EmissionFactor,
        name=body.name,
        category_id=body.category,
        factor_value=body.factor,
        unit=body.unit,
    )
    return to_public(f)
