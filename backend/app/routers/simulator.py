from typing import Any, Dict

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.simulator import SimulatorScenario
from app.routers._crud import create_obj

router = APIRouter(prefix="/simulator", tags=["simulator"])


class ScenarioCreate(BaseModel):
    presetId: str
    params: Dict[str, Any]
    result: Dict[str, Any]


@router.post("/scenarios", status_code=201)
def create_scenario(body: ScenarioCreate, db: Session = Depends(get_db)):
    s = create_obj(db, SimulatorScenario, preset_id=body.presetId, params=body.params, result=body.result)
    return {"id": s.id, "savedAt": s.saved_at.isoformat()}
