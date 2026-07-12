# EcoSphere — ESG Management Platform

An ESG (Environmental, Social, Governance) management platform for the Odoo Hackathon 2026. Real-time dashboard with gamification, role-based access, and business rule toggles.

## Quick Start

### Prerequisites
- Docker & Docker Compose (or local PostgreSQL 16+)
- Python 3.9+
- Node.js 18+
- pnpm (recommended) or npm

### 1. Start the Database
```bash
docker compose up -d
```

Or if using local PostgreSQL:
```bash
createdb ecosphere
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000/docs` (Swagger UI).

### 3. Frontend Setup
```bash
cd frontend
pnpm install  # or: npm install
pnpm dev      # or: npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

```
.
├── backend/               # FastAPI + SQLAlchemy + Alembic
│   ├── app/
│   │   ├── config.py     # Settings & env vars (business rules)
│   │   └── main.py       # FastAPI app skeleton
│   ├── alembic/          # Schema migrations
│   └── requirements.txt
├── frontend/              # React + Vite + Tailwind + Radix UI
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx               # Root with auth & theme
│   │   │   ├── components/
│   │   │   │   ├── layout/           # Sidebar, TopNav
│   │   │   │   ├── pages/            # 8 module pages
│   │   │   │   └── ui/               # Radix UI components
│   │   │   └── context/RoleContext   # Auth & user profile
│   │   └── styles/index.css
│   ├── vite.config.ts
│   └── package.json
├── docker-compose.yml     # PostgreSQL container
├── plan.md               # Detailed hackathon build plan
└── README.md             # This file
```

## Tech Stack

| Layer | Tech | Why |
|---|---|---|
| Frontend | React 18.3, TypeScript, Vite 6 | Fast dev, type safety |
| UI Library | Material-UI 7 + Radix UI + shadcn/ui | Accessible, pre-built components |
| Styling | Tailwind CSS 4 | Fast iteration, dark/light themes |
| Forms | React Hook Form 7 | Client-side validation |
| Data Viz | Recharts 2 | Charts & analytics |
| Drag & Drop | react-dnd | Dashboard widgets |
| Icons | Lucide React | Consistent icon set |
| Animations | Motion 12 | Smooth transitions |
| Toasts | Sonner 2 | Notifications & alerts |
| Auth | Context API + local state | Simple RBAC (no external service) |
| Backend | FastAPI | Async, auto-generated API docs |
| ORM | SQLAlchemy + Alembic | Type-safe queries, migrations |
| Validation | Pydantic | Request/response validation |
| Database | PostgreSQL 16 | Relational, offline-friendly |

## Frontend Features

### Login & RBAC
- Two roles: **Employee** (points, badges, challenges) and **Manager** (oversight, settings)
- Persistent user profiles with avatars, departments, XP/level tracking
- Logout resets auth state

### Modules

| Module | Features | Role Access |
|--------|----------|-------------|
| **Dashboard** | ESG score rollup, department rankings, trend charts | Manager only |
| **Environmental** | Carbon transactions, emission factors, goal tracking | All |
| **Social** | CSR activities, participation evidence, approval workflow | All |
| **Governance** | Compliance audits, policy acknowledgements, issue tracking | All |
| **Gamification** | Challenges, badge unlocks, XP rewards, leaderboard | All |
| **Reports** | Custom filters, CSV export, ESG trend reports | All |
| **Settings** | Business rule toggles (auto-calc, evidence-required, badge-auto-award) | Manager only |
| **Simulator** | Test the business rules & notifications | All |

### Theme & UX
- Dark/light mode toggle (persistent via CSS `data-theme` attribute)
- Radial gradient backgrounds (brand colors)
- Glassmorphic sidebar & cards
- Responsive layout (sidebar hides on mobile)
- Profile modal with avatar upload & settings

## Backend Tasks

See `plan.md` section 5-7 for:
- **Data model** (master data, transactional data)
- **API endpoints** (CRUD for each module)
- **Business rules** (all toggleable via Settings)
- **Build phases** (Hour 0-8 roadmap)

## Demo Script

See `plan.md` section 10. Quick version:

1. **Settings** — Toggle business rules (auto-calc, evidence-required, badge-auto-award)
2. **Environmental** — Log a carbon transaction → see auto-calc fire → goal progress updates
3. **Gamification** — Complete a challenge → earn XP → badge auto-awards
4. **Dashboard** — Scores roll up live (Env + Social + Gov → Department → Overall ESG)
5. **Reports** — Generate a report, export CSV

## Development Workflow

- **Feature branches:** One per module per the plan's role assignment
- **Git flow:** Branch → PR → Merge to `main` (keep `main` demoable)
- **API integration:** Frontend calls `/api/*` endpoints (proxy via Vite config)
- **Dark mode:** CSS `data-theme="dark"` on root div; Tailwind & MUI auto-adapt

## Environment Variables

### Backend (`.env`)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecosphere
AUTO_EMISSION_CALC=true          # Auto-calc carbon from purchase/manufacturing/fleet
EVIDENCE_REQUIRED=true           # CSR must have attached proof file
BADGE_AUTO_AWARD=true            # Auto-award when XP/challenge count hit threshold
```

### Frontend
No env vars needed — API proxy is configured in `vite.config.ts`.

## Testing

### Frontend
```bash
cd frontend
# Type checking
pnpm type-check
# Manual testing: npm run dev, then navigate through pages
```

### Backend
```bash
cd backend
pytest
```

## Common Commands

```bash
# Frontend dev
cd frontend && pnpm dev

# Backend dev
cd backend && uvicorn app.main:app --reload

# Database
docker compose up -d                 # Start PostgreSQL
alembic upgrade head                 # Run migrations

# Frontend build
cd frontend && pnpm build

# Backend prod (example)
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

**Full specs:** See `plan.md`
