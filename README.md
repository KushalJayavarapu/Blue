# EcoSphere — ESG Management Platform

An ESG (Environmental, Social, Governance) management platform for the Odoo Hackathon 2026.

## Quick Start

### Prerequisites
- Docker & Docker Compose (or local PostgreSQL 16+)
- Python 3.9+
- Node.js 18+

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
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

- `backend/` — FastAPI + SQLAlchemy + Alembic
- `frontend/` — React + TypeScript + Vite + Tailwind
- `docker-compose.yml` — PostgreSQL container
- `plan.md` — Detailed hackathon build plan

## Architecture

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS v4, shadcn/ui |
| Backend | FastAPI, SQLAlchemy ORM, Pydantic validation |
| Database | PostgreSQL 16 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Radix UI primitives) |
| Forms | React Hook Form |
| Data Fetching | TanStack Query (React Query) |
| Icons | Lucide React |
| Notifications | Sonner |
| Charts | Recharts |

## Modules

1. **Environmental** — Carbon transactions, emission factors, goals tracking
2. **Social** — CSR activities, employee participation, approval workflows
3. **Governance** — Audits, compliance issues, policy acknowledgements
4. **Gamification** — Challenges, badges, XP system, leaderboard
5. **Dashboard** — Real-time ESG score rollups across departments
6. **Reports** — Report generation, custom filters, CSV export
7. **Settings** — Business rule toggles (auto-calc, evidence requirements, badge auto-award)

## Development

- Each team member works on a feature branch
- Push to origin and create a PR into `main`
- One person owns git integration — merges PRs to keep `main` always demoable
- API routes are listed in `plan.md` section 7

## Testing

Run pytest on business logic:
```bash
cd backend
pytest
```

## Demo Script

See `plan.md` section 10 for the full walkthrough order.

Quick version:
1. Settings — toggle business rules
2. Environmental — log a transaction, see auto-calc
3. Gamification — complete a challenge, see badge award
4. Dashboard — see scores roll up live
5. Reports — generate and export

---

For detailed specs, see `plan.md`.
