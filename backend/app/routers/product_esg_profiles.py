from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.governance import ProductESGProfile
from app.routers._crud import create_obj

router = APIRouter(prefix="/product-esg-profiles", tags=["product-esg-profiles"])


class ProductESGProfileCreate(BaseModel):
    productName: str
    carbonFootprint: Optional[float] = None
    notes: Optional[str] = None


def to_public(p: ProductESGProfile) -> dict:
    return {
        "id": p.id,
        "productName": p.product_name,
        "carbonFootprint": float(p.carbon_footprint) if p.carbon_footprint is not None else None,
        "notes": p.notes,
    }


@router.get("")
def list_product_esg_profiles(db: Session = Depends(get_db)):
    return [to_public(p) for p in db.query(ProductESGProfile).all()]


@router.post("", status_code=201)
def create_product_esg_profile(body: ProductESGProfileCreate, db: Session = Depends(get_db)):
    p = create_obj(
        db,
        ProductESGProfile,
        product_name=body.productName,
        carbon_footprint=body.carbonFootprint,
        notes=body.notes,
    )
    return to_public(p)
