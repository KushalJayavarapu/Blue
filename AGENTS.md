# AGENTS.md

Instructions for any AI coding agent (Claude Code, Cursor, Copilot, etc.) working in this repo.
Read this fully before making changes. See `PLAN.md` for the full project plan and build order.

## Project

EcoSphere — an ESG (Environmental, Social, Governance) management platform. Built for an 8-hour
hackathon. Full spec (data model, business rules, wireframes) is summarized in `PLAN.md`.

## Tech stack

- Backend: Python + FastAPI, SQLAlchemy ORM, Alembic migrations, Pydantic schemas
- Database: PostgreSQL (local instance, no cloud dependency)
- Frontend: React (Vite) + TypeScript + Tailwind CSS v4 + shadcn/ui (Radix) + React Router v7 +
  React Hook Form + TanStack Query + Recharts + Lucide React + Sonner
- No auth layer — a header-level employee/department picker simulates "who's acting"

## Repo structure

```
/backend
  /app
    /models        SQLAlchemy models — one file per entity group (master_data.py, transactions.py)
    /schemas        Pydantic request/response schemas, mirror the models 1:1
    /routers        FastAPI routers, one file per module (environmental.py, social.py, ...)
    /services       Pure business logic functions — see rules below
    config.py        Feature flags (AUTO_EMISSION_CALC, EVIDENCE_REQUIRED, BADGE_AUTO_AWARD)
    main.py           FastAPI app entrypoint
  /alembic            Migrations
  requirements.txt
/frontend
  /src
    /pages           One folder per module (dashboard, environmental, social, governance,
                      gamification, reports, settings) — each exports a page component used
                      as a route element
    /components
      /ui             shadcn-generated primitives (button, dialog, table, form, ...) — don't
                      hand-edit these beyond what `shadcn add` generates; re-run the CLI instead
      AppShell.tsx    Sidebar + tab bar wrapper shared by every route
    /api               TanStack Query hooks, one file per module, all calls go through here
    /types             TypeScript types mirrored from backend Pydantic schemas
    router.tsx          Route table — one entry per module page
    main.tsx             App entrypoint: QueryClientProvider, RouterProvider, <Toaster />
```

## Setup commands

Backend:
```
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Frontend:
```
cd frontend
npm install
npm run dev
```

Environment variables (backend `.env`, never commit this file):
```
DATABASE_URL=postgresql://localhost/ecosphere
AUTO_EMISSION_CALC=true
EVIDENCE_REQUIRED=true
BADGE_AUTO_AWARD=true
```

## Conventions the agent must follow

1. **Business logic is pure functions, in `app/services/`.** Functions take plain data in and
   return plain data out — no DB session, no request object inside them. Example:
   `calculate_emission(quantity, factor) -> float`,
   `rollup_department_score(env, social, gov, weights) -> float`,
   `check_badge_unlock(employee_stats, badge_rule) -> bool`.
   Route handlers fetch records, call these functions, then persist the result. This keeps the
   logic testable and lets frontend/backend work happen without waiting on each other.

2. **Every Pydantic schema in `/schemas` should mirror a SQLAlchemy model in `/models` 1:1**,
   plus a `*Create` variant that omits server-generated fields (id, timestamps). Don't skip
   validation by accepting raw dicts in a route.

3. **Feature flags live in `app/config.py` and are read at request time, not import time**, so
   toggling a Setting in the UI takes effect immediately without a server restart.

4. **No hardcoded/mocked data once a real endpoint exists.** Mock JSON in the frontend is only
   acceptable in the first hour, before the backend is up, and must be replaced — don't leave
   stale mocks alongside real endpoints.

5. **All frontend data fetching goes through TanStack Query hooks in `/api`.** Don't `fetch()`
   directly inside a component.

6. **Forms use React Hook Form**, with `shadcn`'s `<Form>` wrapper components where a form
   involves more than 1-2 fields (goal creation, challenge creation, compliance issue). Show
   validation errors inline, not just as a toast — the toast is for the submit result, not field
   errors.

7. **Any user-facing event that matches the Notification System requirement fires a Sonner
   toast**: badge unlock, CSR/Challenge approval decision, new compliance issue, policy
   acknowledgement reminder. Use `toast.success(...)` / `toast.error(...)` from `"sonner"` at the
   point the action completes (e.g. right after the mutation's `onSuccess`), not buried in a
   separate notification page.

8. **New UI primitives come from `npx shadcn@latest add <component>`**, not hand-written from
   scratch — check `/components/ui` first before building a new dropdown/modal/table component.

9. **Every new model needs an Alembic migration**, not a manual schema edit. Run
   `alembic revision --autogenerate -m "description"` then review the generated file before
   applying it.

10. **Git**: one branch per module (`feature/environmental`, `feature/gamification`, etc.), PR
    into `main`. Don't push directly to `main`. Keep `main` demoable at all times — if a feature
    isn't finished, it stays on its branch.

11. **Don't commit**: `.env`, the local Postgres data directory, `node_modules`, `venv`, any
    `.db` file, or `components.json`'s generated output beyond what `shadcn add` produces.

## AI Agent Tooling

Three tools are configured to assist agents working on this codebase:

### sequential-thinking (MCP)

**When to use:** Before implementing multi-step business logic (e.g., score rollups, badge-unlock rules spanning environmental/social/governance). Use this to decompose the problem, trace decision paths, and verify edge cases without writing code first.

**How:** Ask Claude to use sequential-thinking to reason through the logic step-by-step, breaking down the problem and exploring all paths.

### code-review-graph (MCP)

**When to use:** Before modifying files in `app/services/`, `/components`, or `/api` hooks. This MCP server maps the codebase's structure and dependency graph, helping you understand the blast radius of a change.

**Quick start:**
- After schema changes: run `code-review-graph build` to regenerate the graph
- Before editing shared code: query the graph for `get_impact_radius` to see downstream consumers

For detailed tools and workflow, see **MCP Tools: code-review-graph** section at the end of this file.

### ponytail (Plugin)

**When to use:** To reinforce the rule above (convention #1): no abstractions beyond what the task requires, and prefer stdlib/existing deps over new packages.

**Philosophy:** The best code is the code you never wrote. Ponytail audits diffs for over-engineering, unused parameters, speculative abstractions, and dependency choices. It encourages minimal, direct solutions aligned with YAGNI.

## Testing

If time allows, add `pytest` tests only for functions in `app/services/` — they're pure functions
with no DB dependency, so they're the cheapest to test and the most likely place for a silent
bug (emission math, score rollup, badge unlock logic). Skip UI/integration tests — first thing to
cut if time is short.

## What "done" looks like for any task

Before marking a task complete, check it against `PLAN.md` section 8 (Definition of done): does
this feature use live data (not static JSON), validate its input, follow the existing UI shell,
and get merged through a PR rather than pushed straight to `main`?