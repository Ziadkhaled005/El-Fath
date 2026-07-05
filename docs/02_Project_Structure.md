# 2. Project Structure

[← Back to index](00_README.md)

```
El_Fath_V2/
├── index.html                      # Vite entry HTML
├── vite.config.ts                  # Vite config (Tailwind plugin, "@" alias → src, figma:asset resolver)
├── package.json                    # Dependencies (pnpm workspace)
├── postcss.config.mjs
├── README.md                       # Default Figma Make boilerplate readme
├── guidelines/Guidelines.md        # Empty template — no custom rules were filled in
├── ATTRIBUTIONS.md                 # Third-party license attributions
├── default_shadcn_theme.css
└── src/
    ├── main.tsx                    # ReactDOM root, imports global CSS
    ├── styles/
    │   ├── index.css                # Entry stylesheet (imports the others)
    │   ├── globals.css
    │   ├── tailwind.css
    │   ├── theme.css                 # CSS custom properties (design tokens, light/dark)
    │   └── fonts.css                 # Cairo font declarations
    ├── imports/
    │   ├── 0.png                     # Company logo image
    │   └── pasted_text/
    │       └── erp-pos-system.md     # ⭐ Original product specification/prompt used to generate the app
    └── app/
        ├── App.tsx                   # Root component: wraps RouterProvider in AppProvider
        ├── routes.ts                 # All route definitions (React Router v7)
        ├── context/
        │   └── AppContext.tsx        # Global state: auth, notifications, sidebar, branch, toasts
        ├── data/
        │   └── mockData.ts           # All mock/demo data (single source of truth)
        ├── layouts/
        │   └── MainLayout.tsx        # Authenticated shell: sidebar + outlet + toast container
        ├── components/
        │   ├── Header.tsx             # Page header: title, breadcrumbs, branch selector, notif bell, user
        │   ├── Sidebar.tsx            # Main navigation, collapsible, logout
        │   ├── Logo.tsx               # Company logo + name (used in sidebar/login)
        │   ├── figma/ImageWithFallback.tsx
        │   └── ui/                    # 48 shadcn/ui primitives (Radix-based) — scaffolded but NOT
        │                               # imported by any page; available for future use
        └── pages/                    # One component per route (19 pages total)
            ├── Login.tsx
            ├── ForgotPassword.tsx
            ├── RedirectToDashboard.tsx
            ├── Dashboard.tsx
            ├── POS.tsx
            ├── Sales.tsx
            ├── Purchases.tsx
            ├── Inventory.tsx
            ├── Customers.tsx
            ├── Suppliers.tsx
            ├── Expenses.tsx
            ├── Accounting.tsx
            ├── HR.tsx
            ├── Reports.tsx
            ├── Branches.tsx
            ├── Users.tsx
            ├── Roles.tsx
            ├── Settings.tsx
            ├── Notifications.tsx
            └── Profile.tsx
```

## 2.1 What lives where

- **`src/app/pages/`** — one component per route, mostly self‑contained (imports mock data directly, manages its own local state, renders its own `Header`).
- **`src/app/components/`** — shared chrome: `Sidebar`, `Header`, `Logo`. The `ui/` subfolder is the full shadcn/ui kit, scaffolded by the Figma Make template but **not used by any page** (see `04_Design_System.md`).
- **`src/app/context/AppContext.tsx`** — the only piece of shared application state; everything else is local to each page.
- **`src/app/data/mockData.ts`** — the entire "database" of the app, as plain exported constants.
- **`src/imports/`** — assets and reference material pulled in from the original Figma Make project, including the company logo and the original product spec document.

## 2.2 File size reference

| Page | Lines of code |
|---|---|
| RedirectToDashboard.tsx | 5 |
| Logo.tsx | 33 |
| MainLayout.tsx | 62 |
| ForgotPassword.tsx | 82 |
| Notifications.tsx | 93 |
| Header.tsx | 114 |
| Profile.tsx | 140 |
| Suppliers.tsx | 147 |
| Branches.tsx | 154 |
| Sidebar.tsx | 158 |
| Login.tsx | 160 |
| Users.tsx | 168 |
| Purchases.tsx | 174 |
| Sales.tsx | 183 |
| Customers.tsx | 186 |
| Expenses.tsx | 187 |
| Roles.tsx | 197 |
| Dashboard.tsx | 206 |
| Reports.tsx | 228 |
| Settings.tsx | 251 |
| Inventory.tsx | 252 |
| Accounting.tsx | 257 |
| HR.tsx | 270 |
| POS.tsx | 337 |
| **Total** | **~4,044** |
