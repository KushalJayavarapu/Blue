from datetime import datetime

from sqlalchemy import Column, String, JSON, DateTime

from app.database import Base
from app.models.base import UUIDPKMixin


class SimulatorScenario(UUIDPKMixin, Base):
    __tablename__ = "simulator_scenarios"

    preset_id = Column(String, nullable=False)
    params = Column(JSON, nullable=False)
    result = Column(JSON, nullable=False)
    saved_at = Column(DateTime, default=datetime.utcnow)
