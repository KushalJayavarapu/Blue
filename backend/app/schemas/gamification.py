from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.gamification import (
    ChallengeStatus,
    ChallengeDifficulty,
    ChallengeParticipationStatus,
    RedemptionStatus,
)


class ChallengeCreate(BaseModel):
    name: str
    description: Optional[str] = None
    xp_reward: int = 0
    difficulty: Optional[ChallengeDifficulty] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class ChallengeRead(BaseModel):
    id: str
    name: str
    description: Optional[str]
    xp_reward: int
    difficulty: Optional[ChallengeDifficulty]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    status: ChallengeStatus

    class Config:
        from_attributes = True


class ChallengeParticipationCreate(BaseModel):
    employee_id: str
    challenge_id: str


class ChallengeParticipationRead(BaseModel):
    id: str
    employee_id: str
    challenge_id: str
    status: ChallengeParticipationStatus
    joined_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class EmployeeBadgeRead(BaseModel):
    id: str
    employee_id: str
    badge_id: str
    awarded_at: datetime

    class Config:
        from_attributes = True


class RewardRedemptionCreate(BaseModel):
    employee_id: str
    reward_id: str


class RewardRedemptionRead(BaseModel):
    id: str
    employee_id: str
    reward_id: str
    points_spent: int
    status: RedemptionStatus
    redeemed_at: datetime

    class Config:
        from_attributes = True
