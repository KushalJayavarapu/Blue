# Setup Guide for EcoSphere Development

This guide covers setting up the full stack for local development.

## Prerequisites

- **Node.js 18+** (for frontend)
- **Python 3.9+** (for backend)
- **Docker & Docker Compose** (for PostgreSQL) or **PostgreSQL 16+ locally**
- **pnpm** (recommended; npm works too)

## Database Setup (5 min)

### Option A: Docker (recommended for hackathon)
```bash
docker compose up -d
```

This starts PostgreSQL at `localhost:5432` with credentials:
- User: `postgres`
- Password: `postgres`
- Database: `ecosphere`

### Option B: Local PostgreSQL
If you have PostgreSQL installed:
```bash
createdb -U postgres ecosphere
```

Then update `backend/.env`:
```
DATABASE_URL=postgresql://postgres:<your-password>@localhost:5432/ecosphere
```

## Backend Setup (10 min)

```bash
cd backend

# Copy env template
cp .env.example .env

# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations (creates schema)
alembic upgrade head

# Start dev server
uvicorn app.main:app --reload
```

**Expected output:**
```
Uvicorn running on http://127.0.0.1:8000
```

Access the API at: http://localhost:8000/docs (interactive Swagger UI)

### Alembic Setup (one-time only)

If you need to initialize Alembic from scratch:
```bash
cd backend
alembic init alembic
```

Then edit `alembic/env.py` to use the settings from config:
```python
from app.config import settings
# Replace sqlalchemy.url with: database_uri = settings.database_url
```

## Frontend Setup (10 min)

```bash
cd frontend

# Install dependencies (pnpm is faster)
pnpm install
# or: npm install

# Start dev server
pnpm dev
# or: npm run dev
```

**Expected output:**
```
VITE v6.3.5  ready in 500 ms

➜  Local:   http://localhost:5173/
```

Access the app at: http://localhost:5173

### Login Credentials

The app has two built-in users for testing:

**Manager:**
- Name: John Doe
- Role: ESG Manager
- XP: 12,600 | Level: 15 | Badges: 18
- Dept: Operations
- Can see: Dashboard, Settings, + all other modules

**Employee:**
- Name: Sarah Chen
- Role: Employee
- XP: 3,480 | Level: 7 | Badges: 5
- Dept: Engineering
- Can see: All modules except Dashboard & Settings

Click "Login as Manager" or "Login as Employee" to test different roles.

## Development Workflow

### Running Both Servers

Terminal 1 (Backend):
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload
```

Terminal 2 (Frontend):
```bash
cd frontend
pnpm dev
```

Now both are running:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000/docs

### API Proxy

The frontend's `vite.config.ts` proxies `/api/*` requests to `http://localhost:8000`:

```typescript
server: {
  proxy: { "/api": "http://localhost:8000" },
},
```

So frontend code can just call `/api/departments` and it hits the backend.

### Making Changes

**Backend:**
- Edit files in `backend/app/`
- uvicorn auto-reloads on file changes
- Add new routes to `backend/app/main.py`

**Frontend:**
- Edit files in `frontend/src/`
- Vite auto-refreshes the browser
- New pages go in `frontend/src/app/components/pages/`
- New UI components go in `frontend/src/app/components/ui/` (Radix primitives)

## Database Migrations

If the backend team modifies the data model:

```bash
cd backend

# Create a migration (auto-detects schema changes)
alembic revision --autogenerate -m "Add new column to users"

# Review the generated migration in alembic/versions/

# Apply migrations
alembic upgrade head

# Rollback one migration (if needed)
alembic downgrade -1
```

## Troubleshooting

### "Port 5173 already in use"
```bash
# Kill the process using that port
# On macOS/Linux:
lsof -ti:5173 | xargs kill -9
# On Windows (PowerShell):
Get-Process | Where-Object {$_.Name -eq "node"} | Stop-Process
```

### "Can't connect to PostgreSQL"
1. Check Docker container is running: `docker ps`
2. Check credentials in `.env`
3. Test connection: `psql -U postgres -h localhost -d ecosphere`

### "Module not found" errors in frontend
- Run `pnpm install` again
- Delete `node_modules` and `pnpm-lock.yaml`, then `pnpm install`

### Backend 422 errors (validation)
- Check Pydantic model matches API docs at http://localhost:8000/docs
- Swagger UI shows expected request body schema

### Roles/access issues
- Click profile icon in top-right
- Switch role in the modal
- Different modules are visible per role (employees don't see Dashboard/Settings)

## IDE Setup

### VS Code

Install extensions:
- **ES7+ React/Redux/React-Native snippets** (dsznajder.es7-react-js-snippets)
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
- **Python** (ms-python.python)
- **Pylance** (ms-python.vscode-pylance)

### PyCharm / WebStorm

- Open `backend/` as project root for backend
- Open `frontend/` as project root for frontend
- Set Python interpreter to `backend/venv/`

## Next Steps

1. Start both servers (Backend + Frontend)
2. Log in as Manager or Employee
3. Navigate modules to see the UI
4. Familiarize yourself with the `plan.md` (data model, API endpoints, business rules)
5. Pick a module and start implementing endpoints & business logic

## Useful Commands

```bash
# Frontend
cd frontend
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm type-check   # Type checking without build

# Backend
cd backend
uvicorn app.main:app --reload              # Dev server with auto-reload
uvicorn app.main:app --host 0.0.0.0 --port 8000  # Production example
python -m pytest                            # Run tests (if any)

# Database
docker compose up -d                        # Start PostgreSQL
docker compose down                         # Stop PostgreSQL
alembic upgrade head                        # Run migrations
alembic downgrade -1                        # Rollback one
alembic history                             # Show migration history
psql -U postgres -h localhost -d ecosphere  # Connect to DB directly
```

## Deployment Checklist (before demo)

- [ ] Backend health check: `curl http://localhost:8000/health`
- [ ] Frontend loads at http://localhost:5173
- [ ] Can log in as Manager and Employee
- [ ] All 8 modules appear in sidebar (with role filtering)
- [ ] Dark/light theme toggle works
- [ ] Profile modal opens and can update fields
- [ ] Navigate between modules (page changes)
- [ ] No console errors (F12 → Console tab)

---

**Stuck?** Check the main README.md or plan.md for more context.
