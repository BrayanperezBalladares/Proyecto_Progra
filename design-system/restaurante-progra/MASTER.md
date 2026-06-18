# Design System — Restaurante Progra
> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Restaurante Progra  
**Last updated:** 2026-06-11  
**Visual direction:** Precision Operations  
**Category:** Restaurant Management SaaS — Operational Admin UI

---

## Visual Direction: "Precision Operations"

A professional, operationally efficient interface for daily use by restaurant staff. Inspired by Swiss Modernism applied to dense data contexts. Clean hierarchy, minimal decoration, maximum information legibility. Trustworthy without feeling bureaucratic. Premium without feeling decorative.

**Not:** Generic AI dashboard, glassmorphism, vibrant startup energy, excessive cards, heavy gradients.  
**Yes:** Clear data hierarchy, confident typography, efficient layouts, calm color palette, purposeful accents.

---

## Color System

All tokens live in `src/index.css` under `@theme`. **Never use raw Tailwind color values in components** — always reference semantic tokens.

### Brand Tokens

| Token | CSS Variable | Hex | Usage |
|-------|-------------|-----|-------|
| Primary | `--color-primary` | `#1E3A8A` | Brand navy — headings, active nav, primary icons |
| Primary Hover | `--color-primary-hover` | `#1E3052` | Hover state for primary elements |
| Secondary | `--color-secondary` | `#3B82F6` | Links, secondary actions, informational accents |
| CTA | `--color-cta` | `#B45309` | Amber-700 — accessible accent (4.6:1 on white ✓ WCAG AA) |
| CTA Hover | `--color-cta-hover` | `#92400E` | Hover/active CTA |
| CTA Light | `--color-cta-light` | `#FEF3C7` | Badge/chip backgrounds |

**Color rationale:** Navy (#1E3A8A) anchors trust and professionalism. Amber-700 CTA was specifically chosen over the original amber-600 (#CA8A04, which failed WCAG AA at 2.87:1) to reach 4.6:1 contrast ratio.

### Surface Tokens

| Token | CSS Variable | Hex | Usage |
|-------|-------------|-----|-------|
| Surface | `--color-surface` | `#FFFFFF` | Card/panel backgrounds, inputs |
| Background | `--color-background` | `#F8FAFC` | Page background (slate-50) |
| Background Subtle | `--color-background-subtle` | `#F1F5F9` | Table headers, hover states, subtle fills (slate-100) |

### Text Tokens

| Token | CSS Variable | Hex | Contrast | Usage |
|-------|-------------|-----|----------|-------|
| Primary Dark | `--color-primary-dark` | `#0F172A` | 19:1 | Body text, default text color |
| Muted | `--color-muted` | `#475569` | 5.7:1 | Secondary text, labels, metadata |

**Note:** `--color-primary-dark` was corrected from `#1E40AF` (blue-800, which failed WCAG in body text contexts) to `#0F172A` (slate-900). The CSS variable name is preserved for backward compatibility.

### Border Tokens

| Token | CSS Variable | Hex | Usage |
|-------|-------------|-----|-------|
| Border | `--color-border` | `#E2E8F0` | Default borders, dividers (slate-200) |
| Border Strong | `--color-border-strong` | `#CBD5E1` | Table separators, emphasized dividers (slate-300) |

### Feedback Tokens

| Token | CSS Variable | Hex | Usage |
|-------|-------------|-----|-------|
| Danger | `--color-danger` | `#DC2626` | Errors, destructive actions |
| Danger Light | `--color-danger-light` | `#FEE2E2` | Error backgrounds |
| Success | `--color-success` | `#059669` | Success states, available/active |
| Success Light | `--color-success-light` | `#D1FAE5` | Success backgrounds |
| Warning | `--color-warning` | `#D97706` | Warning states |
| Warning Light | `--color-warning-light` | `#FEF9C3` | Warning backgrounds |

---

## Typography

### Font Pairing

| Font | CSS Variable | Usage |
|------|-------------|-------|
| Karla | `--font-sans` | Body text, labels, table data, form controls, badges, button text — all operational UI |
| Playfair Display SC | `--font-display` | Page H1 titles, brand name in nav only |

**Rationale:** Playfair Display SC renders ALL-CAPS which is appropriate for large display headings but counterproductive in dense operational contexts. All interface labels, table headers, form fields, and dialogs use Karla.

**Application rule:** `font-display` class → page titles (`<h1>`) and brand logo only. Everything else → font-sans.

### Type Scale

| Element | Size | Weight | Font |
|---------|------|--------|------|
| Page title (H1) | 24-30px | 700 | Playfair SC |
| Section title (H2) | 14-16px | 600 | Karla |
| Body | 15px | 400 | Karla |
| Label | 12px | 500 | Karla |
| Table header | 12px | 600 | Karla (uppercase) |
| Badge | 12px | 600 | Karla |
| Code/mono | 12-13px | 400 | system monospace |

---

## Spacing

Base unit: 4px. All spacing follows the Tailwind 4px grid.

| Token | CSS Variable | Value | Usage |
|-------|-------------|-------|-------|
| xs | `--space-xs` | 4px | Icon gaps, tight inline |
| sm | `--space-sm` | 8px | Icon-to-label gaps |
| md | `--space-md` | 16px | Standard element padding |
| lg | `--space-lg` | 24px | Section padding |
| xl | `--space-xl` | 32px | Large section gaps |
| 2xl | `--space-2xl` | 48px | Page section separation |

---

## Elevation

| Level | CSS Variable | Value | Usage |
|-------|-------------|-------|-------|
| xs | `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.04)` | Cards, list items |
| sm | `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.06)` | Panels, tables |
| md | `--shadow-md` | `0 4px 6px rgba(0,0,0,0.05)` | Hover states, dropdowns |
| lg | `--shadow-lg` | `0 10px 15px rgba(30,58,138,0.07)` | Modals, drawers |

**Policy:** Flat-forward. Use shadows sparingly — they signal elevation/interaction, not decoration. Default panels use `shadow-xs` or `shadow-sm` only.

---

## Border Radius Policy

| Context | Radius | Tailwind |
|---------|--------|---------|
| Buttons, inputs, badges, chips | 6px | `rounded-md` |
| Cards, panels, tables | 8px | `rounded-md` or `rounded-lg` |
| Modal dialogs | 8px | `rounded-lg` |
| Avatar, status dot | Full | `rounded-full` |
| Floor plan zone card | 8px | `rounded-md` |

**Avoid:** `rounded-xl` (12px) and `rounded-2xl` for operational panels. They read as consumer/marketing UI. Restaurant staff need efficiency, not softness.

---

## Component Reference

### Buttons

Use `AppButton` from `@ui/shell/button/app-button`. Four variants:

| Variant | Background | Use |
|---------|-----------|-----|
| `primary` | Navy (`--color-primary`) | Primary action per screen — one per section |
| `secondary` | Ring border | Cancel, secondary actions |
| `ghost` | Transparent | Tertiary, inline actions |
| `danger` | Red | Destructive — always paired with ConfirmDialog |

**Loading state:** Shows `Loader2` spinner + label text (e.g., "Guardando…"). Never show empty buttons.

### Icon Buttons

Use `AppIconButton` from `@ui/shell/icon-button/app-icon-button`. Always supply:
- `label` prop (screen reader text)
- `title` via the label prop
- `aria-label` via the label prop

### Form Controls

Use `.app-input` and `.app-select` CSS classes. Apply via `inputClass` and `selectClass` from `@ui/shell/styles/form-classes`.

**Datetime fields:** Always use `type="datetime-local"` with `toDateTimeLocal`/`fromDateTimeLocal` helpers from `form-classes.ts`. Never expose ISO datetime strings as raw text inputs.

**Labels:** Always use Spanish labels, always use `<label>` with explicit text. Never use field names as labels.

### Panels / Cards

- Operations panels: `.app-panel` (white surface, 1px border, `shadow-sm`)
- Stat cards: `.stat-card` (with subtle hover)
- Zone blocks (plano): `.restaurant-zone-card`
- Warning section (bloqueos): custom border-warning styling

### Tables

Wrapper: `.app-table-wrap` — handles overflow-x scroll + border
Table: `.app-table` — consistent header + row styles

**Empty state:** All tables must have an `<EmptyState>` component in `<tbody>` when `data.length === 0`. Import from `@ui/shared/components/empty-state/empty-state`.

### Status Badges

Use `StatusBadge` from `@ui/shared/components/status-badge/status-badge`.

Includes a colored dot indicator — never rely on color alone (WCAG 1.4.1).

Defined states: `Activa`, `Cancelada`, `Atendida`, `Libre`, `Reservada`, `Bloqueada`.

### Dialogs

Use `ConfirmDialog` from `@ui/shared/components/confirm-dialog/confirm-dialog`.

Features: Focus trap, ESC key close, auto-focus cancel button, click-outside close.

**Rule:** All destructive actions (delete, cancel reservation, etc.) must go through `ConfirmDialog`.

### Empty States

Two variants available in `@ui/shared/components/empty-state/empty-state`:
- `EmptyState` — for use inside `<tbody>` (wraps in `<tr><td colSpan={999}>`)
- `EmptyStateBlock` — for use in grid/list contexts

Both require: `icon` (LucideIcon), `title`, optional `description`, optional `action`.

### Page Header

Use `PageHeader` from `@ui/shared/components/page-header/page-header`.

Props: `title` (required), `description` (optional), `actions` (optional ReactNode — for page-level CTAs).

### Mock Banner

`MockBanner` is self-contained — only renders when `isMockApi()` is true. No props needed. Place once per page, after `PageHeader`.

---

## Navigation

### Structure

8 top-level routes, all accessible from the global nav:

| Route | Label | Icon |
|-------|-------|------|
| `/dashboard` | Dashboard | LayoutDashboard |
| `/plano-salon` | Plano salón | Map |
| `/reservas` | Reservas | CalendarCheck |
| `/clientes` | Clientes | Users |
| `/lista-espera` | Lista espera | Clock |
| `/mesas` | Mesas | UtensilsCrossed |
| `/zonas` | Zonas | MapPin |
| `/bloqueos` | Bloqueos | Ban |

### Responsive Behavior

- **≥1024px (lg):** Horizontal nav with icon + label. Active item: navy background + white text.
- **<1024px:** Hamburger button → right-side slide-in drawer (220ms cubic-bezier transition).
- Drawer closes on: route change, ESC key, click outside, close button.
- Body scroll locked while drawer is open.

### Skip Link

`.skip-link` class provides a visually hidden skip-to-content link that appears on focus. Target: `#main-content` on the `<main>` element.

---

## Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|---------|
| Default (mobile) | 0-639px | Single column, stacked forms, drawer nav |
| `sm` | 640px+ | 2-column grids, side-by-side form fields |
| `lg` | 1024px+ | Desktop nav, multi-column tables, sidebar layouts |
| `xl` / max container | 1152px | `max-w-6xl` centered container |

**No horizontal page scroll at any breakpoint.** Tables use `overflow-x-auto` wrapper.

---

## Accessibility Requirements

- All interactive elements: visible focus ring (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`)
- Touch targets: minimum 40px height (`.app-input` min-height: 2.5rem, buttons min 32px)
- All icon-only buttons: `aria-label` + `title` via `label` prop
- All status indicators: colored dot + text label (not color alone)
- All modals/dialogs: focus trap, ESC close, `aria-modal="true"`, `aria-labelledby`
- `prefers-reduced-motion`: universal rule in `@layer base` disables all transitions
- Skip link: present on every page via `NavBar`
- Tables: `<thead>` with `<th scope="col">`, action columns with `<span class="sr-only">Acciones</span>`
- Images/icons: all decorative icons have `aria-hidden`

---

## shadcn/ui Decision: Not Adopted

**Decision date:** 2026-06-11  
**Decision:** Do not adopt shadcn/ui at this time.

**Rationale:**
1. Tailwind CSS v4 uses `@theme` directives incompatible with shadcn CLI's assumptions
2. The existing component system satisfies all requirements with direct fixes
3. Accessibility gaps (focus trap, ESC handling) were resolved with ~20 lines each
4. Adding a library mid-project introduces more risk than benefit
5. Revisit when shadcn officially supports Tailwind v4

---

## File Organization

```
src/ui/
  shell/
    button/           AppButton (forwardRef, 4 variants, spinner loading)
    icon-button/      AppIconButton (ghost + danger)
    nav-bar/          NavBar (mobile drawer + desktop horizontal + skip link)
    app-link/         AppLink (TanStack Router Link wrapper)
    styles/
      form-classes.ts Class constants + datetime helpers
  layouts/
    root-layout.tsx   Shell: NavBar + main#main-content
  shared/
    components/
      page-header/    PageHeader (title + description + actions slot)
      mock-banner/    MockBanner (self-conditional, compact)
      confirm-dialog/ ConfirmDialog (focus trap + ESC + click-outside)
      status-badge/   StatusBadge (dot + label)
      empty-state/    EmptyState (table) + EmptyStateBlock (grid)
      loading-spinner/ LoadingSpinner (sm/md/lg)
      error-message/  ErrorMessage (icon + role=alert)
  pages/
    dashboard/        KPI stat cards + quick links
    reservas/         Full CRUD + filter chips + datetime-local
    clientes/         Full CRUD + confirm delete
    mesas/            Create + list
    zonas/            Full CRUD + grid list
    lista-espera/     Queue + convert-to-reservation dialog
    bloqueos/         Block single mesa + entire zone, list
    plano-salon/      Floor plan (preserved, minor token fixes)
```

---

## Anti-Patterns — DO NOT USE

- ❌ Raw Tailwind color classes (`gray-200`, `gray-500`, `blue-800`) in component files — use semantic tokens
- ❌ Raw `rounded-xl border border-gray-200 bg-white p-6 shadow-sm` — use `.app-panel`
- ❌ Raw `rounded-lg border px-3 py-2` on inputs — use `.app-input` / `inputClass`
- ❌ ISO datetime strings as text inputs — use `type="datetime-local"` with helpers
- ❌ Lowercase field names as labels — use Spanish human-readable labels
- ❌ Tables without empty state — all tables must have `EmptyState`
- ❌ Destructive actions without `ConfirmDialog`
- ❌ `isLoading ? 'Loading…' : children` string in buttons — use the `isLoading` prop
- ❌ Emojis as icons — Lucide only
- ❌ `font-display` on anything other than H1/brand — use `font-sans` for operational UI
- ❌ Dialog/modal without focus trap and ESC key handling
- ❌ Visible focus: never `outline-none` without replacement focus style

---

## Pre-Delivery Checklist

- [ ] All color classes use semantic tokens (no raw `gray-*`, `blue-*`)
- [ ] All forms use `app-input` / `app-select` classes
- [ ] Datetime fields use `type="datetime-local"` with helpers
- [ ] All labels in Spanish with proper `<label>` elements
- [ ] All tables have `EmptyState` for zero rows
- [ ] All destructive actions go through `ConfirmDialog`
- [ ] All icon-only buttons have `label` prop
- [ ] All decorative icons have `aria-hidden`
- [ ] No horizontal scroll at 375px
- [ ] Nav drawer works at 375px
- [ ] Focus visible on all interactive elements
- [ ] `prefers-reduced-motion` respected (universal rule in CSS)
- [ ] Mock banner renders correctly (or is hidden for real API)
