import enum
from datetime import datetime

from sqlalchemy import Column, String, Integer, ForeignKey, Enum, DateTime

from app.database import Base
from app.models.base import UUIDPKMixin


class ChallengeStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    UPCOMING = "UPCOMING"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"


class ChallengeDifficulty(str, enum.Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"


class ChallengeParticipationStatus(str, enum.Enum):
    JOINED = "JOINED"
    COMPLETED = "COMPLETED"


class RedemptionStatus(str, enum.Enum):
    REDEEMED = "REDEEMED"
    FULFILLED = "FULFILLED"


class Challenge(UUIDPKMixin, Base):
    __tablename__ = "challenges"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    xp_reward = Column(Integer, default=0)
    difficulty = Column(Enum(ChallengeDifficulty), nullable=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    # ponytail: plain String (not a Postgres ENUM) so the kanban "col" value set
    # (draft/upcoming/active/completed) can grow without an ALTER TYPE migration;
    # validity is enforced by ChallengeStatus at the Pydantic layer.
    status = Column(String, default=ChallengeStatus.DRAFT.value, nullable=False)


class ChallengeParticipation(UUIDPKMixin, Base):
    __tablename__ = "challenge_participations"

    employee_id = Column(String, ForeignKey("employees.id"), nullable=False)
    challenge_id = Column(String, ForeignKey("challenges.id"), nullable=False)
    status = Column(Enum(ChallengeParticipationStatus), default=ChallengeParticipationStatus.JOINED)
    joined_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)


class EmployeeBadge(UUIDPKMixin, Base):
    """Rows here are written by the Badge Auto-Award rule the moment an
    employee's xp_points/challenge count satisfies a Badge's unlock rule."""

    __tablename__ = "employee_badges"

    employee_id = Column(String, ForeignKey("employees.id"), nullable=False)
    badge_id = Column(String, ForeignKey("badges.id"), nullable=False)
    awarded_at = Column(DateTime, default=datetime.utcnow)


class RewardRedemption(UUIDPKMixin, Base):
    __tablename__ = "reward_redemptions"

    employee_id = Column(String, ForeignKey("employees.id"), nullable=False)
    reward_id = Column(String, ForeignKey("rewards.id"), nullable=False)
    points_spent = Column(Integer, nullable=False)
    status = Column(Enum(RedemptionStatus), default=RedemptionStatus.REDEEMED)
    redeemed_at = Column(DateTime, default=datetime.utcnow)
