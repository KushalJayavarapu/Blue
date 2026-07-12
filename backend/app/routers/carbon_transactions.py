from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.environmental import CarbonTransaction, TransactionSourceType
from app.routers._crud import create_obj

router = APIRouter(prefix="/carbon-transactions", tags=["carbon-transactions"])


class CarbonTransactionCreate(BaseModel):
    source: TransactionSourceType
    category: str
    dept: str
    factor: Optional[str] = None
    carbon: float
    timestamp: Optional[datetime] = None


def to_public(t: CarbonTransaction) -> dict:
    return {
        "id": t.id,
        "source": t.source_type.value,
        "category": t.category_id,
        "dept": t.department_id,
        "factor": t.emission_factor_id,
        "carbon": float(t.carbon_amount),
        "timestamp": t.created_at.isoformat() if t.created_at else None,
    }


@router.get("")
def list_carbon_transactions(db: Session = Depends(get_db)):
    return [to_public(t) for t in db.query(CarbonTransaction).all()]


@router.post("", status_code=201)
def create_carbon_transaction(body: CarbonTransactionCreate, db: Session = Depends(get_db)):
    t = create_obj(
        db,
        CarbonTransaction,
        source_type=body.source,
        category_id=body.category,
        department_id=body.dept,
        emission_factor_id=body.factor,
        # ponytail: frontend sends the computed carbon amount directly, not a
        # separate raw quantity, so quantity mirrors carbon here
        quantity=body.carbon,
        carbon_amount=body.carbon,
        created_at=body.timestamp or datetime.utcnow(),
    )
    return to_public(t)
