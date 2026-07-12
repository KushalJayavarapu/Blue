from datetime import datetime

from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime

from app.database import Base
from app.models.base import UUIDPKMixin


class Notification(UUIDPKMixin, Base):
    __tablename__ = "notifications"

    employee_id = Column(String, ForeignKey("employees.id"), nullable=False)
    title = Column(String, nullable=True)
    message = Column(String, nullable=False)
    page = Column(String, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
