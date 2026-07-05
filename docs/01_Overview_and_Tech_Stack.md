# 1. Overview & Technology Stack

[← Back to index](00_README.md)

## 1.1 Executive Summary

El Fath V2 is a single‑page application that simulates a full multi‑branch ERP/POS system for an essential‑oils manufacturing and retail company. It covers the full operational surface of a small‑to‑medium business — point of sale, sales, purchasing, inventory, customers, suppliers, expenses, accounting, HR, reporting, branch management, and role/permission administration — entirely in Arabic with right‑to‑left layout.

The project is currently a **front‑end prototype**: all data is hard‑coded in a single mock‑data module and held in React component state. There is no backend, no database, and no real authentication — by design, this is a UI/UX deliverable meant to demonstrate the complete system before backend development begins.

The codebase also ships the **original product specification** it was generated from, at `src/imports/pasted_text/erp-pos-system.md`. That document is the single best reference for the client's actual intent and was used throughout this documentation to assess what was delivered vs. what remains (see `08_Spec_Coverage.md`).

## 1.2 Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 18.3.1 |
| Build tool | Vite | 6.3.5 |
| Language | TypeScript | (via Vite/React plugin) |
| Routing | React Router (`createBrowserRouter`) | 7.13.0 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) + inline CSS‑in‑JS | 4.1.12 |
| Component library (scaffolded, mostly unused) | shadcn/ui on Radix UI primitives | various |
| Icons | Lucide React | 0.487.0 |
| Charts | Recharts | 2.15.2 |
| Forms (available, not wired up) | React Hook Form | 7.55.0 |
| Animation (available) | Motion (Framer Motion successor) | 12.23.24 |
| Notifications (custom toast, not the library) | Sonner (installed, unused — custom toast built instead) | 2.0.3 |
| Dates | date-fns | 3.6.0 |
| Package manager | pnpm (workspace config present) | — |

> **Note on dependencies:** `package.json` includes a large set of libraries (MUI, react-dnd, react-slick, embla-carousel, vaul, cmdk, etc.) that are part of the default Figma Make / shadcn scaffold template. The majority are **not actually imported anywhere in `src/app`** — only React, React Router, Lucide icons, and Recharts are in active use. This keeps `node_modules` heavier than the app strictly needs. See `10_Recommendations.md` for a cleanup suggestion.

## 1.3 At a Glance

- **19 routes / pages**, all in Arabic RTL
- **~4,044 lines** of application code (pages + layouts + components, excluding unused shadcn primitives)
- **0 backend dependencies** — fully self‑contained, runs entirely client‑side
- **1 demo user** for login (no multi‑user accounts yet)
- **Currency:** Egyptian Pound (ج.م / EGP) throughout
