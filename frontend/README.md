# EcoSphere — ESG Management Platform

A hackathon build for measuring, managing, and improving an organization's Environmental, Social, and Governance (ESG) performance — combining operational carbon tracking, employee participation, and gamification into a single dashboard.

Built for Odoo hackathon 2026 — 8 hour build window.

---

## Tech Stack

**Frontend**
- React (Vite) + TypeScript
- Tailwind CSS
- TanStack Query (React Query)
- Recharts (or hand-rolled SVG, if unfamiliar)

**Backend**
- Python 3.11+
- FastAPI
- SQLAlchemy (ORM)
- Alembic (migrations)
- Pydantic (validation, 1:1 schema mirror of models)
- PostgreSQL (local instance, no cloud dependency)
- passlib[bcrypt] + python-jose (auth)

**Why this stack:** local-first (no internet dependency during demo), type-safe validation shared across the request/response boundary, ORM-generated queries (prevents SQL injection by construction), and a schema portable to a production Postgres setup with no rewrite.

---

## Modules & Scope

| Module | Status |
|---|---|
| Environmental (Emission Tracking & Goals) | Full build — core scoring dependency |
| Gamification (Challenges, Badges, Leaderboard) | Full build |
| Social (CSR Activities) | Light build — feeds Gamification's points pipeline |
| Dashboard | Full build — consumes all other modules |
| Reports | Simplified — 2–3 fixed reports, custom report builder out of scope |
| Governance (Policies, Audits, Compliance) | Out of scope / stubbed |
| Settings | Departments, Categories, ESG Config toggles |

---

## Git Workflow

- Single repo, `main` as the default/protected branch
- Each member commits their own work directly — no single person pushing on behalf of the team
- One member (Git integration owner) resolves merge conflicts and keeps `main` demoable at all times
