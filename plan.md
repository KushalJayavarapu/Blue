# EcoSphere — ESG Management Platform: Hackathon Build Plan

Odoo Hackathon 2026 · 8-hour sprint · Team of 3-4

## 1. What we're building

An ESG (Environmental, Social, Governance) management platform that integrates operational data, employee participation, and compliance activities into one dashboard, with gamification to drive engagement. Four modules: Environmental, Social, Governance, Gamification — plus Reports and Settings.

Full spec reference: wireframe screens (7 modules) + data model + business rules, already reviewed. This plan turns that into an executable order of work.

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | React (Vite) + TypeScript | Fast parallel dev across screens, type safety against the API |
| Styling | Tailwind CSS v4 | Consistent color scheme/layout must-have, CSS-first config, faster builds than v3 |
| Component library | shadcn/ui (Radix UI primitives) | Accessible, pre-built tables/modals/dropdowns/forms — the fastest way to cover 7 modules' worth of UI without hand-building every table and dialog |
| Routing | React Router v7 | Turns the wireframe's sidebar + tabs into real routes/pages instead of one monolithic view |
| Forms | React Hook Form | Client-side validation feedback before submit — a second layer on top of Pydantic's server-side validation |
| Icons | Lucide React | Sidebar/nav/action icons |
| Notifications (UI) | Sonner | Toasts for the required Notification System: badge unlocks, approval decisions, compliance alerts, policy reminders |
| Charts | Recharts | Dashboard trend line + department ranking |
| Data fetching | TanStack Query | Real API calls with loading/error states — satisfies "no static JSON" |
| Backend | Python + FastAPI | Async-native, auto-generates OpenAPI docs at `/docs`, structural validation |
| Validation (server) | Pydantic (built into FastAPI) | Request/response shape enforced automatically — no separate validation layer needed |
| ORM + migrations | SQLAlchemy + Alembic | Real schema migrations, safe for a team editing the schema together |
| Database | PostgreSQL (local) | Relational constraints, concurrent writes, no cloud dependency — runs fully offline for a laptop demo |
| Auth | None | Not in scope — use a simple employee/department picker in the header instead |
| Version control | Git + GitHub, branch per module | One person merges into `main`, keeps it always demoable |
| Tests (if time allows) | pytest on business-logic functions only | Cheapest to test, most likely place for a silent bug |

## 3. Team & role assignment (3-4 people)

| Role | Owns | Notes |
|---|---|---|
| **Backend & data lead** | SQLAlchemy schema, Alembic migrations, seed data, all API routes, business-rule logic | Starts first — everyone else depends on this. Writes business logic as pure functions (see AGENTS.md). |
| **Environmental + Dashboard** | Goals, emission factors, carbon transactions (read side), dashboard aggregation | Highest ESG weight (40%) — this is the module to make deepest |
| **Gamification (+ light Social/Governance)** | Challenges, badges, leaderboard, XP; simple list+approve screens for CSR activities and audits | Self-contained, visually satisfying, exercises Badge Auto-Award rule |
| **Reports + Settings + Git owner** | Report generation, custom filter builder, CSV export, Settings toggles, merging branches into `main` | With 3-4 people, someone must own git integration or `main` breaks under deadline pressure |

## 4. Data model (condensed reference)

**Master data:** Department, Category, Emission Factor, Product ESG Profile, Environmental Goal, ESG Policy, Badge, Reward

**Transactional data:** Carbon Transaction, CSR Activity, Employee Participation, Challenge, Challenge Participation, Policy Acknowledgement, Audit, Compliance Issue, Department Score

Full field lists live in the original spec doc — pull exact fields from there when writing the SQLAlchemy models, don't re-derive them.

## 5. Build order (5 phases)

```
Hour 0-1   Setup            → repo, Postgres + Alembic, seed data, FastAPI skeleton, Vite skeleton
Hour 1-3   Core CRUD        → master data endpoints/screens + one full module (Environmental) end-to-end
Hour 3-5   Business rules   → auto emission calc, XP award, badge auto-award, evidence requirement — all as toggleable flags
Hour 5-7   Dashboard/Reports→ score rollup (Env/Social/Gov → Department → Overall ESG), one working report + CSV export
Hour 7-8   Polish & demo    → responsive check, git cleanup, seed a believable demo dataset, rehearse the walkthrough
```

Data dependency order (why this sequence, not screen order): Master config → Daily operations → Carbon transactions & participation → Module scores → Overall ESG score → Dashboard. The Dashboard is screen ① in the wireframe but the *last* thing to have real data, since it only mirrors everything below it.

## 6. Business rules — in scope, not optional

These directly map to the "nice to have" and "expected features" sections. Each is a Settings toggle, default **on**:

- **Auto Emission Calculation** — when enabled, Carbon Transactions calculate automatically from linked Purchase/Manufacturing/Expense/Fleet records using the relevant Emission Factor.
- **Evidence Requirement** — when enabled, CSR participation cannot be marked Approved without an attached proof file.
- **Badge Auto-Award** — when enabled, a Badge is assigned the moment an employee's XP or completed-challenge count satisfies the Badge's Unlock Rule. No manual action.
- **Compliance Issue Ownership** — every Compliance Issue must have an Owner and Due Date; overdue-while-Open issues get flagged.
- **Reward Redemption** — redeeming a Reward deducts Points from the employee's balance, subject to stock availability.
- **Notifications** — at minimum: new compliance issue, CSR/Challenge approval decisions, policy acknowledgement reminders, badge unlocks. An in-memory notification list is enough for a demo — doesn't need to be email.

## 7. API endpoint list (starting point — expand as needed)

```
Master data
  GET/POST/PUT   /api/departments
  GET/POST/PUT   /api/categories
  GET/POST/PUT   /api/emission-factors
  GET/POST/PUT   /api/goals

Environmental
  GET/POST        /api/carbon-transactions
  GET              /api/environmental/summary

Social
  GET/POST         /api/csr-activities
  POST              /api/participation/{id}/approve

Governance
  GET/POST         /api/audits
  GET/POST/PUT     /api/compliance-issues

Gamification
  GET/POST          /api/challenges
  POST                /api/challenges/{id}/join
  GET                  /api/badges
  GET                  /api/leaderboard
  POST                 /api/rewards/{id}/redeem

Dashboard & Reports
  GET  /api/dashboard/summary
  GET  /api/reports/{type}
  POST /api/reports/custom

Settings
  GET/PUT /api/settings/flags
```

## 8. Definition of done — mapped to the hackathon rules

| Rule | Concrete check |
|---|---|
| Use real/dynamic data, not static JSON | Every screen fetches from a live FastAPI endpoint via TanStack Query |
| Responsive, clean, consistent UI | Tailwind design tokens set once, reused everywhere; test at mobile width before demo |
| Validate input robustly | Every POST/PUT has a Pydantic schema rejecting bad input with a clear error |
| Intuitive navigation | Sidebar + tab shell consistent across all modules (already matches the wireframe) |
| Proper version control | Branch per module owner, PRs into `main`, one person merging |
| Backend API design + local DB | `/docs` Swagger UI live; PostgreSQL running locally, schema in Alembic |
| Offline/local, not cloud-dependent | Entire stack runs on localhost, no external API calls required for core flow |
| Trendy tech only if it adds value | No tech in this stack was picked for novelty — each row has a stated reason |

## 9. Setup & configuration files

Drop these in at Hour 0 so nobody loses time on environment setup. Copy each block into the
matching file path.

### `docker-compose.yml` (repo root) — local Postgres, one command to start

```yaml
version: "3.8"
services:
  db:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ecosphere
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

Start it with `docker compose up -d`. No local Postgres install needed. If nobody has Docker,
fall back to a native Postgres install and create the `ecosphere` database manually — same
connection string either way.

### `backend/requirements.txt`

```
fastapi
uvicorn[standard]
sqlalchemy
alembic
psycopg2-binary
pydantic
pydantic-settings
python-dotenv
python-multipart
```

### `backend/.env.example` (copy to `.env`, never commit `.env` itself)

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecosphere
AUTO_EMISSION_CALC=true
EVIDENCE_REQUIRED=true
BADGE_AUTO_AWARD=true
```

### `backend/app/config.py`

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    auto_emission_calc: bool = True
    evidence_required: bool = True
    badge_auto_award: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
```

### `backend/app/main.py` (minimal skeleton, expand with routers as they're built)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

# app.include_router(environmental.router, prefix="/api/environmental")
# app.include_router(social.router, prefix="/api/social")
# ...add each module router here as it's built
```

### Alembic setup (run once)

```
cd backend
alembic init alembic
```

Then in `alembic/env.py`, point it at `settings.database_url` (import `from app.config import
settings`) instead of a hardcoded URL, so migrations always use the same connection string as
the app.

### `frontend/package.json` — key dependencies to install

```
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install react-router-dom
npm install tailwindcss @tailwindcss/vite
npm install @tanstack/react-query recharts axios
npm install react-hook-form lucide-react sonner
npx shadcn@latest init
```

`shadcn@latest init` will ask a few prompts (base color, CSS variables) and sets up
`components.json`, the `@/` path alias, and the Tailwind theme tokens automatically — accept the
defaults unless someone wants to bikeshed the color palette.

### `frontend/vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    proxy: { "/api": "http://localhost:8000" },
  },
});
```

The proxy means frontend code just calls `/api/...` — no CORS juggling, no hardcoded
`localhost:8000` scattered through components. The `@` alias is what makes shadcn's
`@/components/ui/...` imports work.

### `frontend/tsconfig.json` — path alias (needed for shadcn imports)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### `frontend/src/index.css` — Tailwind v4 is CSS-first, no `tailwind.config.js` needed

```css
@import "tailwindcss";
```

`shadcn init` appends the theme tokens (colors, radius, etc.) below this line automatically —
don't hand-edit that block.

### `frontend/src/router.tsx` — one route per module, matches the wireframe's sidebar

```tsx
import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import EnvironmentalPage from "@/pages/environmental/EnvironmentalPage";
import SocialPage from "@/pages/social/SocialPage";
import GovernancePage from "@/pages/governance/GovernancePage";
import GamificationPage from "@/pages/gamification/GamificationPage";
import ReportsPage from "@/pages/reports/ReportsPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import AppShell from "@/components/AppShell";

export const router = createBrowserRouter([
  {
    element: <AppShell />, // sidebar + tab bar wrapper, shared across all routes
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/environmental", element: <EnvironmentalPage /> },
      { path: "/social", element: <SocialPage /> },
      { path: "/governance", element: <GovernancePage /> },
      { path: "/gamification", element: <GamificationPage /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
]);
```

### `frontend/src/main.tsx` — wire up router, query client, and the toaster

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { router } from "@/router";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  </StrictMode>,
);
```

Call `toast.success("Badge unlocked!")` (import `{ toast }` from `"sonner"`) anywhere a
notification event fires — badge unlocks, approval decisions, new compliance issues.

### `frontend/.env.example`

```
VITE_API_BASE_URL=/api
```

With this in place, Hour 0 becomes: `docker compose up -d` → `alembic upgrade head` →
`uvicorn app.main:app --reload` on one terminal, `npm run dev` on another, and both frontend and
backend teams are unblocked within minutes.

## 10. Demo script (order to show judges)

1. Settings — show the business-rule toggles exist and are real, not decorative
2. Environmental — log a Purchase → show a Carbon Transaction auto-calculated from it → show the Goal progress bar move
3. Gamification — complete a Challenge → show XP added → show a Badge auto-award fire
4. Dashboard — show all four scores rolling up live from the actions just taken
5. Reports — generate one report, export it

This sequence proves the full pipeline is real, not screens with fake numbers.