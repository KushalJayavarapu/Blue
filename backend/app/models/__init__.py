# Import every model so Base.metadata / Alembic autogenerate can see them.
from app.models.master import (
    Department,
    Employee,
    Category,
    EmissionFactor,
    Badge,
    Reward,
    ESGCategory,
    OrgSettings,
    PointsLedger,
)
from app.models.environmental import CarbonTransaction, EnvironmentalGoal
from app.models.social import CSRActivity, EmployeeParticipation
from app.models.gamification import (
    Challenge,
    ChallengeParticipation,
    EmployeeBadge,
    RewardRedemption,
)
from app.models.governance import (
    ESGPolicy,
    PolicyAcknowledgement,
    Audit,
    ComplianceIssue,
    ProductESGProfile,
)
from app.models.dashboard import DepartmentScore
from app.models.notification import Notification
from app.models.simulator import SimulatorScenario

__all__ = [
    "Department",
    "Employee",
    "Category",
    "EmissionFactor",
    "Badge",
    "Reward",
    "ESGCategory",
    "OrgSettings",
    "PointsLedger",
    "CarbonTransaction",
    "EnvironmentalGoal",
    "CSRActivity",
    "EmployeeParticipation",
    "Challenge",
    "ChallengeParticipation",
    "EmployeeBadge",
    "RewardRedemption",
    "ESGPolicy",
    "PolicyAcknowledgement",
    "Audit",
    "ComplianceIssue",
    "ProductESGProfile",
    "DepartmentScore",
    "Notification",
    "SimulatorScenario",
]
