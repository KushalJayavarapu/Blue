from typing import Type, TypeVar

from fastapi import HTTPException
from sqlalchemy.orm import Session

M = TypeVar("M")


def get_or_404(db: Session, model: Type[M], id: str) -> M:
    obj = db.get(model, id)
    if obj is None:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
    return obj


def create_obj(db: Session, model: Type[M], **fields) -> M:
    obj = model(**fields)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_obj(db: Session, obj: M, **fields) -> M:
    for key, value in fields.items():
        if value is not None:
            setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj


def delete_obj(db: Session, obj) -> None:
    db.delete(obj)
    db.commit()
