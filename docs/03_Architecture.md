# 3. Architecture

[← Back to index](00_README.md)

## 3.1 Application bootstrap

`main.tsx` mounts `<App />` into `#root`. `App.tsx` wraps the entire router tree in a single global `AppProvider` (React Context) — there is no Redux/Zustand; all shared state lives in one context object.

```tsx
// App.tsx
export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
```

## 3.2 Routing (`routes.ts`)

Built with React Router v7's `createBrowserRouter`. Two route groups:

- **Public routes** (no layout): `/login`, `/forgot-password`
- **Protected routes** (nested under `MainLayout`): `/`, `/dashboard`, `/pos`, `/sales`, `/purchases`, `/inventory`, `/customers`, `/suppliers`, `/expenses`, `/accounting`, `/hr`, `/reports`, `/branches`, `/users`, `/roles`, `/settings`, `/notifications`, `/profile`

The index route (`/`) renders `RedirectToDashboard`, which immediately navigates to `/dashboard`. See `11_Routes_Map.md` for the full tree.

## 3.3 Route protection

`MainLayout.tsx` checks `isAuthenticated` from `AppContext` on mount; if false, it calls `navigate('/login')` and renders `null`. This is a simple client‑side guard only — there is no server‑side session validation (none exists, since there's no backend). See `05_Authentication.md` for details.

## 3.4 Global state (`AppContext.tsx`)

A single context exposes:

| State | Purpose |
|---|---|
| `user` / `isAuthenticated` / `login()` / `logout()` | Auth session, persisted to `sessionStorage` under key `erp_user` |
| `notifications` / `markNotificationRead()` / `markAllRead()` / `unreadCount` | Notification center (seeded from `mockData.NOTIFICATIONS`) |
| `sidebarCollapsed` / `toggleSidebar()` | Sidebar collapse/expand UI state |
| `currentBranch` / `setCurrentBranch()` | Active branch selector in the header (not actually used to filter data anywhere yet) |
| `toasts` / `addToast()` / `removeToast()` | Custom toast notification queue (auto-dismiss after 3.5s) |

## 3.5 Data layer

There is no API client and no React Query usage despite the original spec calling for it. All "backend" data lives in `src/app/data/mockData.ts` as exported constant arrays/objects (`COMPANY`, `BRANCHES`, `PRODUCTS`, `CUSTOMERS`, `SUPPLIERS`, `EMPLOYEES`, `SALES_INVOICES`, `PURCHASES`, `EXPENSES`, `DASHBOARD_STATS`, `SALES_CHART_DATA`, `BRANCH_PERFORMANCE`, `RECENT_ACTIVITIES`, `ROLES`, `USERS`, `NOTIFICATIONS`). Pages import these directly and manage CRUD‑like interactions purely in local component state (`useState`) — nothing persists across a page refresh except the logged‑in user. Full schema reference: `07_Data_Model.md`.

## 3.6 Styling approach

Two parallel styling systems coexist:

1. **Tailwind v4 + shadcn/ui design tokens** (`theme.css`, `globals.css`) — a complete light/dark CSS‑variable token system (`--background`, `--primary`, `--sidebar`, chart colors, radii, etc.) is defined and the full Radix/shadcn component kit (48 components: dialog, table, tabs, select, calendar, command palette, etc.) is scaffolded under `components/ui/`.
2. **Inline CSS‑in‑JS (style objects)** — in practice, **every page and layout component in this build uses inline `style={{ ... }}` objects** with a hard‑coded gold‑and‑black brand palette, not the shadcn tokens or Tailwind utility classes. The `components/ui/*` library is present in the bundle but **not referenced by a single page**, confirming it's leftover scaffolding rather than the actual UI implementation.

This means: the design system "exists" in the codebase but the real UI was hand‑built with inline styles, so future contributors should be aware that updating `theme.css` tokens will currently have **no visible effect** on the app. Full detail in `04_Design_System.md`.

## 3.7 Fonts & RTL

- Arabic typography uses **Cairo** (declared in `fonts.css`, applied via `fontFamily: 'Cairo, sans-serif'` inline on nearly every element).
- `MainLayout` and `Login` set `dir="rtl"` explicitly on their root containers; the rest of the RTL behavior relies on natural Arabic text flow rather than logical CSS properties (`margin-inline-start` etc.), so layout mirroring is manual per component rather than automatic.
