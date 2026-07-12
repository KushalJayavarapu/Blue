import uuid

from sqlalchemy import Column, String


class UUIDPKMixin:
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
