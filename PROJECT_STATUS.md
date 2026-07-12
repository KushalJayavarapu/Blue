# EcoSphere — Project Status

**Status:** ✅ Initialized & Ready for Development  
**Last Updated:** 2026-07-12

## What's Done

### Frontend (100% ✅)
- [x] Full React app with Vite, TypeScript, Tailwind CSS 4
- [x] Material-UI + Radix UI + shadcn/ui components
- [x] Login page with RBAC (Manager/Employee roles)
- [x] Dark/light theme toggle
- [x] 8 fully wired modules:
  - Dashboard (Manager only)
  - Environmental
  - Social (Explore Activities)
  - Governance
  - Gamification (Challenges)
  - Reports
  - Settings (Manager only)
  - Simulator
- [x] Sidebar navigation with role-based visibility
- [x] TopNav with profile modal & theme toggle
- [x] Pre-built UI components (all Radix primitives)
- [x] API proxy configured (frontend calls `/api/*` → backend)

### Project Structure (100% ✅)
- [x] Backend skeleton (FastAPI + SQLAlchemy + Alembic)
- [x] Docker Compose for PostgreSQL
- [x] Git repository initialized
- [x] .gitignore configured
- [x] Comprehensive README.md
- [x] Detailed SETUP.md with dev workflow
- [x] plan.md with full hackathon build plan

## What's NOT Done (Backend)

### Data Model (0% ⏳)
- [ ] SQLAlchemy ORM models (Department, Category, Emission Factor, etc.)
- [ ] Alembic migrations
- [ ] Seed data for demo

### API Endpoints (0% ⏳)
- [ ] Master data CRUD: /api/departments, /categories, /emission-factors, /goals
- [ ] Environmental: /api/carbon-transactions, /api/environmental/summary
- [ ] Social: /api/csr-activities, /api/participation/{id}/approve
- [ ] Governance: /api/audits, /api/compliance-issues
- [ ] Gamification: /api/challenges, /api/badges, /api/leaderboard, /api/rewards/{id}/redeem
- [ ] Dashboard: /api/dashboard/summary, /api/reports/{type}
- [ ] Settings: /api/settings/flags

### Business Rules (0% ⏳)
- [ ] Auto Emission Calculation (from Purchase/Manufacturing/Fleet records)
- [ ] Evidence Requirement (CSR must have proof file)
- [ ] Badge Auto-Award (when XP/challenges hit threshold)
- [ ] Compliance Issue Ownership & overdue tracking
- [ ] Reward Redemption with stock checks
- [ ] Notifications (in-memory list for demo)

## Next Steps for Backend Team

### Phase 1: Data Model & Seed Data (Hour 1-2)
1. Define SQLAlchemy models in `backend/app/models.py`
2. Create Alembic migration: `alembic revision --autogenerate -m "Initial schema"`
3. Run: `alembic upgrade head`
4. Create `backend/app/seed_data.py` with demo dataset

**Reference:** `plan.md` section 4 (data model) + section 9 (schema)

### Phase 2: Core CRUD Endpoints (Hour 2-3)
1. Create `backend/app/routers/` directory
2. Implement master data endpoints (departments, categories, emission-factors, goals)
3. Implement Environmental module (carbon-transactions, summary)
4. Wire routers into `backend/app/main.py`

**Reference:** `plan.md` section 7 (endpoint list)

### Phase 3: Business Rules (Hour 3-5)
1. Implement business rule toggles in Settings endpoint
2. Add auto-emission-calc logic
3. Add evidence-requirement validation
4. Add badge-auto-award logic
5. Add notification system (in-memory, fire via FastAPI responses)

**Reference:** `plan.md` section 6 (business rules)

### Phase 4: Dashboard & Reports (Hour 5-7)
1. Implement score rollup logic: Env/Social/Gov → Department → Overall ESG
2. Create dashboard summary endpoint
3. Implement report generation with custom filters
4. Add CSV export

### Phase 5: Polish & Demo (Hour 7-8)
1. Seed database with realistic data
2. Test all flows end-to-end
3. Verify dark mode renders correctly
4. Rehearse demo script (see `plan.md` section 10)

## Development Commands

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

**API docs:** http://localhost:8000/docs

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

**App:** http://localhost:5173

**Login:**
- Manager: Click "Login as Manager" (John Doe)
- Employee: Click "Login as Employee" (Sarah Chen)

### Database
```bash
docker compose up -d  # Start PostgreSQL
psql -U postgres -h localhost -d ecosphere  # Connect directly
```

## Key Files to Modify

### Backend
- `backend/app/config.py` — Settings & env vars (business rule flags)
- `backend/app/main.py` — FastAPI app + route registration
- `backend/app/models.py` — SQLAlchemy ORM (create new file)
- `backend/app/routers/` — Module-specific endpoints (create new directory)
- `backend/alembic/versions/` — Auto-generated migrations

### Frontend
- `frontend/src/app/components/pages/*.tsx` — Module pages (already stubbed, ready for data)
- `frontend/src/app/context/RoleContext.tsx` — Auth context (can extend)
- `frontend/src/styles/` — Theme & CSS (Tailwind config)

**Important:** Frontend is complete and working. No changes needed until backend sends data. Focus on API integration after endpoints exist.

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18.3 + Vite 6 + TypeScript + Tailwind 4 + Radix UI + MUI |
| **Backend** | FastAPI + SQLAlchemy + Pydantic |
| **Database** | PostgreSQL 16 (Docker) |
| **Validation** | Pydantic (server-side) + React Hook Form (client-side) |
| **Styling** | Tailwind CSS 4 (dark/light automatic) |
| **Icons** | Lucide React |
| **Charts** | Recharts (for dashboard trends) |
| **Notifications** | Sonner toasts + in-memory notification list |
| **Auth** | Context API + local state (no external service) |

## Demo Script

See `plan.md` section 10 for full walkthrough. TL;DR:

1. Settings — Toggle business rules
2. Environmental — Log transaction → auto-calc fires → goal updates
3. Gamification — Complete challenge → XP awarded → badge auto-awards
4. Dashboard — See all scores roll up live
5. Reports — Export CSV

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│           Browser (React App at :5173)                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │ App.tsx (Auth, Theme, Page Routing)              │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ Sidebar     │ TopNav (Theme, Logout, Profile)   │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ PageContent (8 modules, role-filtered)           │   │
│  └──────────────────────────────────────────────────┘   │
│           ↓ fetch('/api/*')                             │
├─────────────────────────────────────────────────────────┤
│  Vite Proxy (localhost:5173 → localhost:8000)          │
├─────────────────────────────────────────────────────────┤
│ FastAPI (Backend at :8000)                              │
│  ├─ config.py (env vars, business rules)                │
│  ├─ main.py (app + CORS + routers)                      │
│  ├─ models.py (SQLAlchemy ORM)                          │
│  └─ routers/ (module-specific endpoints)                │
│           ↓ SQLAlchemy query builder                    │
├─────────────────────────────────────────────────────────┤
│ PostgreSQL (Database, Docker at :5432)                  │
│  └─ ecosphere schema (auto-migrated via Alembic)        │
└─────────────────────────────────────────────────────────┘
```

## Role-Based Access

**Manager (John Doe)** sees:
- Dashboard ✅ (ESG score rollup)
- Environmental ✅
- Social ✅
- Governance ✅
- Gamification ✅
- Reports ✅
- Settings ✅ (toggle business rules)
- Simulator ✅

**Employee (Sarah Chen)** sees:
- Environmental ✅
- Social ✅
- Governance ✅
- Gamification ✅ (primary interface)
- Reports ✅
- Simulator ✅

## Known Limitations / TODOs

- No external authentication (local state only — fine for hackathon)
- No persistent user profiles (reset on page reload)
- No real file upload for CSR evidence (stub UI only)
- Notifications are in-memory (not email)
- No real-time dashboard updates (refresh needed)

These are acceptable for an 8-hour hackathon demo.

## Contact / Support

- **Plan & specs:** See `plan.md`
- **Setup troubleshooting:** See `SETUP.md`
- **Frontend structure:** See `frontend/README.md`
- **Architecture questions:** See `CLAUDE.md` (code-review-graph enabled)

---

**Ready to build!** Start with backend Phase 1 (data model) while frontend team does final UI polish.
