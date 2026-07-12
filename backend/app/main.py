from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    activities,
    audits,
    badges,
    carbon_transactions,
    challenges,
    compliance_issues,
    dashboard,
    departments,
    emission_factors,
    esg_categories,
    goals,
    notifications,
    org_settings,
    policies,
    product_esg_profiles,
    rewards,
    simulator,
)

app = FastAPI(title="EcoSphere API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(departments.router)
app.include_router(esg_categories.router)
app.include_router(org_settings.router)
app.include_router(goals.router)
app.include_router(carbon_transactions.router)
app.include_router(emission_factors.router)
app.include_router(product_esg_profiles.router)
app.include_router(activities.router)
app.include_router(policies.router)
app.include_router(audits.router)
app.include_router(compliance_issues.router)
app.include_router(challenges.router)
app.include_router(badges.router)
app.include_router(rewards.router)
app.include_router(simulator.router)
app.include_router(dashboard.router)
app.include_router(notifications.router)

# Auth, uploads (avatar/evidence/bulk-import), and aggregate endpoints
# (dashboard, reports, leaderboard, diversity, search, notifications) depend
# on an auth/session layer that doesn't exist yet -- added in a follow-up pass.
