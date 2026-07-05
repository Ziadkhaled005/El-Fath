# Professional Prompt

You are a Senior Product Designer, Senior UX/UI Designer, Senior React Frontend Engineer, ERP Solution Architect, and Business Analyst.

Your task is to design and generate a complete, production-ready ERP/POS System UI and React project for **شركة الفتح لإنتاج وتقطير الزيوت العطرية**.

This is a real business project, not a demo.

---

# General Requirements

Build a **modern, elegant, clean and simple ERP/POS System** because the client requested an easy-to-use system.

The entire system must be **100% in Arabic (RTL)**.

Use **Arabic typography** and proper RTL alignment everywhere.

Currency throughout the system must be:

**الجنيه المصري (EGP / جنيه مصري)**

Use the company's official logo that will be uploaded later.

The logo must appear professionally on:

* Login Screen
* Sidebar
* Printable Invoice
* Reports
* Header
* PDF Exports

---

# Technology Requirements

Generate the entire project using:

* React
* React Router
* React Hooks
* React Context OR Redux Toolkit
* TypeScript
* Tailwind CSS
* Shadcn/UI
* React Hook Form
* Zod Validation
* Recharts
* Framer Motion
* Lucide Icons
* TanStack Table
* React Query

The generated code must be modular, clean, reusable and production-ready.

---

# UI Design

Create a premium modern dashboard.

Simple.

Minimal.

Professional.

Rounded cards.

Soft shadows.

Clean spacing.

Responsive.

Desktop First.

Tablet supported.

Mobile supported.

---

# IMPORTANT

Do NOT leave a single button without functionality.

Every button must navigate somewhere.

Every card must open details.

Every icon must perform an action.

Every table must support:

* Search
* Sort
* Filter
* Pagination
* Export
* Print

No placeholder pages.

No empty pages.

No "Coming Soon".

Everything must work.

---

# Authentication

Create:

* Login
* Forgot Password
* Change Password
* User Profile
* Notifications
* Session Timeout

---

# Dashboard

Dashboard should include:

* Today's Sales
* Today's Purchases
* Inventory Value
* Low Stock Products
* Pending Orders
* Pending Approvals
* Cash Balance
* Branch Performance
* Recent Activities
* Sales Chart
* Monthly Revenue
* Expense Summary

Everything clickable.

---

# Branch Management

The company has **5 branches** initially.

Design the system to support unlimited branches.

The System Administrator can:

* Add Branch
* Edit Branch
* Delete Branch
* Activate Branch
* Deactivate Branch

Each branch has its own:

* Inventory
* Customers
* Suppliers
* Sales
* Purchases
* Cash
* Reports
* Employees

Users from one branch CANNOT see any information from another branch.

Branch isolation is mandatory.

The only person allowed to grant cross-branch access is the System Administrator.

Permission must determine exactly which branches each user can access.

---

# Inventory

Inventory must support:

* Products
* Categories
* Units
* Brands
* Warehouses
* Stock Transfer
* Stock Adjustment
* Inventory Count
* Barcode
* QR Code
* Expiry Date
* Batch Number

Inventory must be separated by branch.

---

# Sales (POS)

Create a professional POS.

Features:

* Barcode Scanner
* Search Products
* Customer Selection
* Discounts
* Taxes
* Multiple Payment Methods
* Cash
* Visa
* Bank Transfer
* Partial Payment
* Hold Invoice
* Resume Invoice
* Print Invoice
* PDF Invoice
* Email Invoice

Invoice must be printable in A4 and Thermal Receipt.

---

# Purchase Management

Support:

* Purchase Orders
* Purchase Invoices
* Supplier Payments
* Purchase Returns
* Approval Workflow

---

# Customers

* Customer List
* Customer Statement
* Credit Limit
* Outstanding Balance
* Customer Groups

---

# Suppliers

* Supplier List
* Supplier Statement
* Supplier Balance
* Purchase History

---

# Expenses

Manage:

* Expense Categories
* Daily Expenses
* Monthly Expenses
* Approval Status

Expense approval workflow:

New Expense

↓

Pending Approval

↓

Approved

↓

Rejected

No expense should become approved automatically.

---

# Accounting

Simple accounting only.

Include:

* Cashbox
* Income
* Expenses
* Journal Entries
* Profit & Loss
* Balance Summary

---

# Reports

Professional reports with filters.

Include:

* Sales Reports
* Purchase Reports
* Inventory Reports
* Customer Reports
* Supplier Reports
* Expense Reports
* Branch Reports
* Employee Reports

All reports support:

* Print
* PDF
* Excel

---

# Human Resources

Include:

* Employees
* Attendance
* Vacations
* Payroll Summary

Simple interface only.

---

# Role & Permission Management (Very Important)

The System Administrator has full control.

Administrator can:

* Create New Role
* Edit Role
* Delete Role
* Clone Role
* Activate Role
* Deactivate Role

Permission Management must allow assigning access to every screen and action separately.

Examples:

Sales
✓ View
✓ Create
✓ Edit
✓ Delete
✓ Print
✓ Export
✓ Approve

Inventory
✓ View
✓ Add
✓ Edit
✓ Delete

Customers
✓ View
✓ Create
✓ Edit

Reports
✓ View
✓ Export
✓ Print

Settings
✓ Full Access

Branch Permissions

Choose exactly which branches each user can access.

Permission Matrix should be visual and easy to manage.

---

# Notifications

Create notification center for:

* Low Stock
* Pending Approval
* New Orders
* Inventory Alerts
* Employee Alerts

---

# Settings

Include:

Company Settings

Logo

Company Information

Tax Settings

Currency

Invoice Design

Branch Settings

System Preferences

Backup

Restore

Audit Logs

---

# Printable Documents

Create professional printable layouts for:

Sales Invoice

Purchase Invoice

Quotation

Customer Statement

Supplier Statement

Expense Report

Inventory Report

All printable pages must include:

Company Logo

Company Name

Branch Name

Address

Phone

Tax Number

QR Code

Professional Footer

Print Date

---

# Navigation

Sidebar should include:

Dashboard

POS

Sales

Purchases

Inventory

Customers

Suppliers

Expenses

Accounting

HR

Reports

Branches

Users

Roles & Permissions

Settings

Profile

Notifications

Logout

---

# UX Requirements

Fast navigation.

No dead ends.

Every screen connected.

Breadcrumbs.

Dialogs.

Confirmation Modals.

Toast Notifications.

Loading States.

Empty States.

Error Handling.

---

# Final Requirement

The final output must feel like a premium ERP system comparable to Odoo, ERPNext, Zoho Inventory, and Oracle NetSuite in structure, while remaining intentionally simplified for a small-to-medium essential oils manufacturing company.

Every page must be fully connected.

Every button must work.

Every navigation item must open a real page.

Every form must validate inputs.

No unfinished UI.

No placeholder content.

No dummy buttons.

The entire interface language must be Arabic (RTL), while the source code, component names, variables, functions, and folder structure must remain in English following React best practices.
