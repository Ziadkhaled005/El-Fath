# Frontend ↔ Backend Integration Report

A full page-by-page audit of `Frontend/src/app/pages/*` against the real backend (documented in `Backend/API_DOCUMENTATION.md`), answering: **which pages still run on fake/mock data instead of the real API.**

**Shared API client**: `Frontend/src/app/services/api.ts` — a `fetch` wrapper (`request<T>()`) with base URL `VITE_API_BASE_URL` (or a hardcoded fallback), attaching `Authorization: Bearer <token>` from `sessionStorage` automatically. It already exposes `authApi`, `dashboardApi`, `productsApi`, `customersApi`, `branchesApi`, `notificationsApi`, `suppliersApi`, `salesApi`, `purchasesApi`.

**Mock data source**: `Frontend/src/app/data/mockData.ts` — static arrays (`PRODUCTS`, `CUSTOMERS`, `SUPPLIERS`, `EMPLOYEES`, `SALES_INVOICES`, `PURCHASES`, `EXPENSES`, `BRANCHES`, `ROLES`, `USERS`, `COMPANY`, `NOTIFICATIONS`, `DASHBOARD_STATS`, etc.) that most pages import directly and render from, instead of calling the API.

---

## Summary Table

| Page | File | Status | Real endpoints used | Mock data used | Create/Edit/Delete persisted? |
|---|---|---|---|---|---|
| Login / Auth | `pages/Login.tsx`, `context/AppContext.tsx` | **Real API** (with a fallback quirk) | `POST /api/Auth/login`, `POST /api/Auth/logout`, `GET /api/Auth/me` | none (hardcoded `DEMO_USER` used only if the login response's `user` field is missing/malformed) | N/A |
| Dashboard | `pages/Dashboard.tsx` | **Real API** | `GET /api/Dashboard/stats`, `/sales-chart`, `/branch-performance`, `/recent-activities`, `GET /api/Products` | none | N/A (read-only) |
| Notifications | `pages/Notifications.tsx`, `context/AppContext.tsx` | **Mixed** | `GET /api/Notifications?unreadOnly=false` | `NOTIFICATIONS` mock exists but is dead/unused | **No** — mark-read/mark-all-read only update local state; `notificationsApi.markRead`/`markAllRead` exist in `api.ts` but are never called |
| POS (checkout) | `pages/POS.tsx` | Fully mock | none | `PRODUCTS`, `CUSTOMERS`, `COMPANY` | **No** — completing a sale only shows a toast; no `salesApi.create` exists to call |
| Sales (invoices list) | `pages/Sales.tsx` | Fully mock | none (`salesApi.list` exists, unused) | `SALES_INVOICES`, `CUSTOMERS` | **No** — delete only filters local state |
| Purchases | `pages/Purchases.tsx` | Fully mock | none (`purchasesApi.list` exists, unused) | `PURCHASES`, `SUPPLIERS` | **No** — approve/reject/create only mutate local state |
| Inventory (Products) | `pages/Inventory.tsx` | Fully mock | none (`productsApi` full CRUD + adjust-stock exists, unused) | `PRODUCTS` | **No** — add/edit/delete/adjust-stock all local-only |
| Customers | `pages/Customers.tsx` | Fully mock | none (`customersApi` full CRUD exists, unused) | `CUSTOMERS` | **No** |
| Suppliers | `pages/Suppliers.tsx` | Fully mock | none (`suppliersApi.list` exists, unused; no create/update/delete client methods exist even though the backend has them) | `SUPPLIERS` | **No** |
| Expenses | `pages/Expenses.tsx` | Fully mock | none — **no `expensesApi` exists in `api.ts` at all** | `EXPENSES` | **No** — approve/reject/create local-only |
| HR (Employees + Attendance/Vacations/Payroll tabs) | `pages/HR.tsx` | Fully mock (all 4 tabs) | none — **no employees/HR API client exists at all** | `EMPLOYEES` | **No** |
| Branches | `pages/Branches.tsx` | Fully mock | none (`branchesApi.list` exists, unused) | `BRANCHES` | **No** — including status toggle |
| Users | `pages/Users.tsx` | Fully mock | none — **no `usersApi` exists in `api.ts` at all** | `USERS`, `ROLES`, `BRANCHES` | **No** — including status toggle and "reset password" |
| Roles / Permissions | `pages/Roles.tsx` | Fully mock | none — **no `rolesApi`/permissions client exists** | `ROLES` (permission matrix itself is a hardcoded local constant, never loaded from anywhere) | **No** — the permissions-matrix "Save" button doesn't even write to local mock data, just shows a toast |
| Accounting | `pages/Accounting.tsx` | Fully mock | none — **no accounting API client exists at all** | none (doesn't even use `mockData.ts` — journal/monthly figures are hardcoded constants inside the component itself) | **No** — new journal entries vanish on refresh |
| Reports | `pages/Reports.tsx` | Fully mock | none — zero API calls of any kind | `SALES_INVOICES`, `SALES_CHART_DATA`, `PRODUCTS`, `BRANCHES` (3 of 8 tabs render mock data; the other 5 are empty placeholders) | N/A (read-only) |
| Settings (all 6 tabs) | `pages/Settings.tsx` | Fully mock, nothing persists | none — **no settings API client exists at all** | `COMPANY` (Company tab only; Invoice/Tax/Notifications/Backup/Audit tabs are page-local state or hardcoded, not even from mock data) | **No** — every tab's "Save" button just shows a toast |

---

## Key Findings

1. **Only 2 of 17 pages are fully wired to the real backend**: Login/Auth and Dashboard. Notifications is half-wired (reads real data, writes are fake).

2. **The backend is far ahead of the frontend.** Every single one of these mock pages has a complete, working, previously-verified backend API sitting unused (see `Backend/API_DOCUMENTATION.md`): Products, Sales (checkout + list), Purchases, Customers, Suppliers, Expenses, Employees/HR (attendance/leaves/salaries), Branches, Users, Roles + permissions matrix, Accounting (journal/cashbox/P&L/balance sheet), Reports (8 endpoints), Settings (company/invoice/tax/notifications/audit-log). None of this backend work is reachable from the UI yet.

3. **Two different kinds of gap exist**, and they require different amounts of frontend work to close:
   - **API client already exists, just unused** — Products, Customers, Suppliers (partial), Branches (partial), Sales (list only), Purchases (list only), Notifications (partial). These pages just need to swap their `mockData` import for the existing `xApi` calls.
   - **No API client exists yet at all** — Expenses, Employees/HR, Users, Roles/Permissions, Accounting, Reports, Settings. These need new functions added to `services/api.ts` before the pages can be wired up, even though the backend endpoints they'd call are already built and documented.

4. **Nothing anywhere actually persists a create/edit/delete/status-toggle.** Every single mutating action across every mock page follows the same pattern: mutate local React state, show a success toast, done. A page refresh silently discards it. This is true even on Notifications' mark-read (where the read-endpoint already exists) and Roles' permission matrix (where saving doesn't even reach the mock array, let alone a server).

5. **Login has a fallback-to-fake-user quirk worth fixing regardless of any wider wiring effort**: if `POST /api/Auth/login` succeeds but its `user` field doesn't map cleanly, `AppContext.tsx` silently substitutes a hardcoded `DEMO_USER` ("أحمد محمد السيد" / `ahmed.admin`) as the logged-in identity. Since `AuthUserDto` always returns a well-formed `user` object per `Backend/API_DOCUMENTATION.md`, this fallback should be dead code in practice — but it's worth confirming the frontend's expected `user` shape actually still matches `AuthUserDto` (e.g. after the recent `fullName` addition) so this fallback never silently triggers.

6. **`services/api.ts`'s base URL defaults to a hosted URL (`https://medshareappapi.runasp.net`)**, not `localhost:5080` — confirm `VITE_API_BASE_URL` is actually set to the local backend in whatever `.env`/`.env.local` the frontend dev server reads, otherwise "wiring up" a page might silently hit the wrong server.
