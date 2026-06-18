# Proyecto Progra — Frontend

React + Vite + TypeScript restaurant reservation admin UI, wired to [ProyectoIProgra2](../Proyecto%20prograII/ProyectoIProgra2) via Axios (or in-memory mock when `VITE_USE_MOCK_API=true`).

## Stack

- TanStack Router, Query, Form, Table
- Tailwind CSS v4
- Axios + Vite proxy (`/api` → `http://localhost:5147`) or mock store (`src/api/mock/`)
- **UI UX Pro Max** skill (`.cursor/skills/ui-ux-pro-max/`) + design system (`design-system/restaurante-progra/`)

## UI / UX Pro Max

Installed via CLI:

```bash
npm install -g uipro-cli
uipro init --ai cursor   # already done in this repo
```

Regenerate design tokens when the product positioning changes:

```bash
python .cursor/skills/ui-ux-pro-max/scripts/search.py "restaurant admin dashboard" --design-system --persist -p "Restaurante Progra" --stack react
```

Global rules: `design-system/restaurante-progra/MASTER.md`  
Cursor rule: `.cursor/rules/ui-design.mdc` (auto-applies on `src/ui/**` edits).

**Restart Cursor** after install so Agent Skills pick up the skill.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Run with real API

**Terminal 1 — backend** (from `ProyectoIProgra2`):

```powershell
cd "C:\Proyecto prograII\ProyectoIProgra2"
dotnet run --launch-profile http
```

Listens at `http://localhost:5147`.

**Terminal 2 — frontend**:

```powershell
cd C:\Proyecto_Progra
npm run dev
```

Restart Vite after changing `.env`.

## Environment

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=/api
```

- `false` + `/api`: Vite proxies to `http://localhost:5147` (recommended).
- `true`: in-memory mock, no backend required.
- Direct URL (no proxy): `VITE_API_BASE_URL=http://localhost:5147/api` (CORS enabled on the API).

## Features (mock)

| Route | Domain |
|-------|--------|
| `/dashboard` | KPIs and quick links |
| `/plano-salon` | Floor plan — tables libre / reservada / bloqueada by date & shift |
| `/clientes` | Client CRUD |
| `/reservas` | Reservations CRUD, cancel, mark attended |
| `/mesas` | Tables list + create |
| `/zonas` | Zones CRUD |
| `/lista-espera` | Waitlist + convert to reservation |
| `/bloqueos` | Table/zone blocks |

## Architecture

```
src/api/
  mock/           # Seed + in-memory store (ProyectoIProgra2 data)
  types/          # Shared domain types
  features/       # Per-domain services → mock (later axios)
  shared/         # Lookups, utils

src/ui/
  pages/          # Route screens
  shell/          # NavBar, buttons, links
  layouts/        # Root layout
  shared/         # ConfirmDialog, badges, mock banner
```

## Connecting the real API later

1. Add CORS on ProyectoIProgra2 for `http://localhost:5173`
2. Set `VITE_API_BASE_URL=http://localhost:5147/api`
3. Replace each `*.service.ts` body: call `apiClient` instead of `mockStore`
4. Map DTO field names if the API uses PascalCase JSON

Hooks, queries, and UI stay unchanged.

## Add a feature

Copy `api/features/clientes` + `ui/pages/clientes` + `routes/clientes.tsx`.
