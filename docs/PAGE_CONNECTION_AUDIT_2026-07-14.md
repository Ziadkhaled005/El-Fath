# Frontend Backend Connection Report

Audit date: 2026-07-14

Scope: all routed frontend page components in `src/app/routes.ts`, plus shared backend calls made through `src/app/context/AppContext.tsx`.

## Executive Summary

- Audited user-facing pages: 19
- Utility redirect route: 1 (`/` redirects to `/dashboard`)
- Pages fully connected to backend: 6
- Pages partially connected to backend: 4
- Pages not connected to backend: 9
- Pages with any backend connection at all: 10 of 19

Counting rule:

- Fully connected: the page's main displayed data and main save/update/delete/read actions call backend APIs.
- Partially connected: the page calls at least one backend API, but key workflows are still local-only, use mock fallback as normal behavior, or call the wrong endpoint for a mutation.
- Not connected: no backend API is called for the page's main workflow.

## Shared API Layer

API client file: `src/app/services/api.ts`

Base URL:

- `VITE_API_BASE_URL`, if set.
- Otherwise `https://medshareappapi.runasp.net`.

Authentication:

- Access token is stored in `sessionStorage` as `erp_access_token`.
- The API wrapper attaches `Authorization: Bearer <token>` automatically for authenticated requests.

Available API groups:

- `authApi`
- `dashboardApi`
- `productsApi`
- `customersApi`
- `branchesApi`
- `notificationsApi`
- `suppliersApi`
- `salesApi`
- `purchasesApi`
- `expensesApi`

Important note: several pages initialize from `src/app/data/mockData.ts` and only replace that state if the API returns a non-empty collection. This means an empty backend response can still leave mock data visible.

## Page-by-Page Status

| # | Route | Page file | Status | Backend calls found | Main gap |
|---|---|---|---|---|---|
| 1 | `/login` | `src/app/pages/Login.tsx` + `src/app/context/AppContext.tsx` | Fully connected | `POST /api/Auth/login`, `GET /api/Auth/me`, `POST /api/Auth/logout` | Login falls back to a hardcoded `DEMO_USER` if the response user cannot be mapped. |
| 2 | `/forgot-password` | `src/app/pages/ForgotPassword.tsx` | Not connected | None | Submit only flips local `sent` state. No reset email API call. |
| 3 | `/dashboard` | `src/app/pages/Dashboard.tsx` | Fully connected | Dashboard stats, sales chart, branch performance, recent activities, products list | Read-only page. Uses API data with product list support. |
| 4 | `/notifications` | `src/app/pages/Notifications.tsx` + `src/app/context/AppContext.tsx` | Fully connected | Notifications list, mark read, mark all read | Mutations are optimistic and errors are swallowed, but backend calls exist. |
| 5 | `/inventory` | `src/app/pages/Inventory.tsx` | Fully connected | Products list, create, update, delete, adjust stock | Falls back to mock products on load failure. |
| 6 | `/customers` | `src/app/pages/Customers.tsx` | Fully connected | Customers list, create, update, delete | Falls back to mock customers on load failure. |
| 7 | `/branches` | `src/app/pages/Branches.tsx` | Fully connected | Branches list, create, update, delete, status toggle via update | Falls back to mock branches on load failure. |
| 8 | `/suppliers` | `src/app/pages/Suppliers.tsx` | Partially connected | Suppliers list, create, update | Delete is local-only; it removes from React state and never calls `suppliersApi.remove`. |
| 9 | `/sales` | `src/app/pages/Sales.tsx` | Partially connected | Sales list | Delete calls `salesApi.create({ id, action: "delete" })`, which is not a real delete endpoint. New invoices navigate to POS. |
| 10 | `/purchases` | `src/app/pages/Purchases.tsx` | Partially connected | Purchases list | Approve/reject call `purchasesApi.list()` instead of a mutation. New purchase calls `suppliersApi.create()` instead of a purchase create endpoint. |
| 11 | `/profile` | `src/app/pages/Profile.tsx` | Partially connected | Logout through `authApi.logout`; profile identity from auth context | Save profile and change password are local toast-only actions. `authApi.profile()` exists but is not used. |
| 12 | `/pos` | `src/app/pages/POS.tsx` | Not connected | None | Products/customers/company come from mock data. Checkout only shows a toast/local behavior. |
| 13 | `/expenses` | `src/app/pages/Expenses.tsx` | Not connected | None | `expensesApi` exists, but the page does not import it. List/add/approve/reject are local-only. |
| 14 | `/hr` | `src/app/pages/HR.tsx` | Not connected | None | Employees and HR flows use `EMPLOYEES` mock data only. |
| 15 | `/accounting` | `src/app/pages/Accounting.tsx` | Not connected | None | Journal, cashbox, P&L, and balance data are hardcoded in the component. New journal entries are local-only. |
| 16 | `/reports` | `src/app/pages/Reports.tsx` | Not connected | None | Uses mock invoices, purchases, products, employees, branches, and chart data. |
| 17 | `/roles` | `src/app/pages/Roles.tsx` | Not connected | None | Roles and permissions are local/mock only. Permission save does not persist to backend. |
| 18 | `/settings` | `src/app/pages/Settings.tsx` | Not connected | None | Company/settings values are mock/local state. Save buttons only show toasts. |
| 19 | `/users` | `src/app/pages/Users.tsx` | Not connected | None | Users, roles, and branches come from mock data. User create/update/status/reset flows are local-only. |
| - | `/` | `src/app/pages/RedirectToDashboard.tsx` | Utility route | None | Redirects to `/dashboard`; not counted as a user-facing connected page. |

## Connected Page Count

Using the counting rule above:

- Fully connected: 6 pages
- Partially connected: 4 pages
- Any backend connection: 10 pages
- Not connected: 9 pages

Fully connected pages:

1. Login
2. Dashboard
3. Notifications
4. Inventory
5. Customers
6. Branches

Partially connected pages:

1. Suppliers
2. Sales
3. Purchases
4. Profile

Not connected pages:

1. Forgot Password
2. POS
3. Expenses
4. HR
5. Accounting
6. Reports
7. Roles
8. Settings
9. Users

## Highest Priority Fixes

1. Wire POS checkout to `salesApi.create()` or a dedicated sale/checkout endpoint.
2. Fix Sales delete. Do not call `salesApi.create()` for deletion.
3. Add real purchase create/approve/reject API methods, then update `Purchases.tsx`.
4. Connect `Expenses.tsx` to the existing `expensesApi`.
5. Add supplier delete persistence by calling `suppliersApi.remove(id)`.
6. Connect Profile save to `authApi.profile()` and add/change password endpoint support if available.
7. Remove or clearly gate mock fallback behavior so empty backend tables do not appear as fake populated data.
