# PayMint — Product Requirements Document

**Version:** 1.0.0
**Status:** Ready for Engineering
**Last Updated:** 2025
**Prepared For:** Lovable / Bolt / Replit AI Builders

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Problem Statement](#2-problem-statement)
3. [Solution](#3-solution)
4. [User Personas](#4-user-personas)
5. [Business Goals](#5-business-goals)
6. [User Goals](#6-user-goals)
7. [Functional Requirements](#7-functional-requirements)
8. [Technical Architecture](#8-technical-architecture)
9. [Information Architecture](#9-information-architecture)
10. [User Flows](#10-user-flows)
11. [Database Schema](#11-database-schema)
12. [Dashboard Behavior](#12-dashboard-behavior)
13. [Invoice Lifecycle](#13-invoice-lifecycle)
14. [Receipt Lifecycle](#14-receipt-lifecycle)
15. [Authentication Flow](#15-authentication-flow)
16. [CRUD Requirements](#16-crud-requirements)
17. [PDF Export Behavior](#17-pdf-export-behavior)
18. [Empty States](#18-empty-states)
19. [Error Handling](#19-error-handling)
20. [Responsiveness Requirements](#20-responsiveness-requirements)
21. [Future Roadmap](#21-future-roadmap)

---

## 1. Product Overview

**Product Name:** PayMint
**Tagline:** Invoicing that works as hard as you do.
**Category:** SaaS — Invoicing & Receipt Management
**Target Platform:** Web (responsive), PWA-ready

PayMint is a modern invoicing and receipt management SaaS platform designed for the solo economy. It enables freelancers, consultants, creators, and small business owners to create professional invoices, manage client relationships, track payment status in real-time, generate receipts upon payment, and export documents as PDFs — all from a single, elegant interface.

PayMint is not a full accounting suite. It is deliberately scoped to do one thing exceptionally well: **turn work into money, cleanly and professionally.**

---

## 2. Problem Statement

Independent professionals and small teams face a fragmented invoicing experience:

- **Existing tools are either too complex** (QuickBooks, FreshBooks) or too simplistic (basic PDF templates).
- **No unified flow** from invoice creation → payment tracking → receipt generation.
- **Poor mobile experience** — most invoicing tools are desktop-only.
- **Aesthetic mismatch** — invoices from legacy tools look dated, reducing perceived professionalism.
- **No real-time feedback** — dashboard data is stale or requires manual refresh.
- **Time cost** — creating, sending, and following up on invoices takes too long.

The result: freelancers lose revenue through late payments, missed follow-ups, and an unprofessional paper trail.

---

## 3. Solution

PayMint provides a streamlined, opinionated workflow:

1. **Create clients** with full contact and billing details.
2. **Create invoices** tied to clients, with line items, taxes, and due dates.
3. **Track invoice status** (Draft → Sent → Partially Paid → Paid → Overdue).
4. **Mark payments** and automatically generate receipts.
5. **Export** invoices and receipts as branded PDFs.
6. **Monitor health** via a real-time dashboard with key metrics.

Every interaction is instant. Every state change is reflected live. The design is intentionally calm, premium, and trustworthy — so the product itself signals professionalism to the user's clients.

---

## 4. User Personas

### Persona 1 — The Independent Consultant
**Name:** Marcus, 34
**Role:** UX/Strategy Consultant
**Tools:** Notion, Figma, Stripe
**Pain Points:** Manually creates invoices in Figma, chases payments via email, no organized client history.
**Goals:** Send professional invoices in under 2 minutes, track who owes what, look credible to enterprise clients.

### Persona 2 — The Digital Creator
**Name:** Yuki, 27
**Role:** Video editor + brand designer
**Tools:** Adobe CC, Instagram, PayPal
**Pain Points:** No invoice history, clients question legitimacy, zero receipt workflow.
**Goals:** Quick invoice creation on mobile, receipt PDF to send clients after payment.

### Persona 3 — The Online Vendor / Service Business
**Name:** Priya, 41
**Role:** Runs a small e-commerce + services hybrid
**Tools:** Shopify, Google Sheets
**Pain Points:** Manages 30+ clients across spreadsheets, no status visibility.
**Goals:** Centralized client list, clear overdue tracking, batch-exportable records.

---

## 5. Business Goals

| Goal | Metric | Target (6 months) |
|------|--------|-------------------|
| User acquisition | Registered users | 5,000 |
| Activation | Users who create 1+ invoice | 60% of registered |
| Retention | MAU / registered | 35% |
| Revenue | Paid plan conversions | 8% of activated |
| NPS | Net Promoter Score | > 45 |

**Monetization model (future):** Freemium. Free tier: up to 5 active clients, 10 invoices/month. Pro tier: unlimited + custom branding + recurring invoices.

---

## 6. User Goals

- Create an invoice in under 90 seconds.
- Know at a glance how much money is outstanding.
- Never lose track of a client's billing history.
- Send professional PDFs without design work.
- Prove a payment occurred with a receipt.
- Work comfortably from a phone.

---

## 7. Functional Requirements

### 7.1 Authentication
- Email/password sign-up and login via Supabase Auth.
- Email verification on sign-up.
- Password reset via email link.
- Persistent session (remember me behavior).
- Protected routes — unauthenticated users redirected to `/login`.
- User profile: display name, business name, business address, logo upload, currency preference.

### 7.2 Dashboard
- Real-time KPI cards:
  - Total Revenue (all-time paid invoices)
  - Outstanding Balance (sum of unpaid + partially paid)
  - Total Invoices
  - Overdue Invoices count
- Revenue bar chart (monthly, last 12 months) — data from Supabase.
- Recent invoices table (last 5–10, with status badges).
- Recent clients list.
- Time range filter: 12 months / 6 months / 30 days / 7 days.
- All data live-fetched from Supabase on load and after mutations.

### 7.3 Client Management
- Create client: name, email, phone, company, address, notes.
- Edit client details inline or via modal.
- Delete client (with confirmation — warns if active invoices exist).
- View client profile: full details + all associated invoices.
- Search/filter clients by name or company.
- Client list table: sortable by name, total billed, invoice count.

### 7.4 Invoice Management
- Create invoice:
  - Select client (required, from existing clients)
  - Invoice number (auto-generated, editable)
  - Issue date + due date
  - Line items: description, quantity, unit price, tax rate per item
  - Global discount (optional, flat or %)
  - Notes / payment terms
  - Status defaults to "Draft"
- Edit invoice (only Draft and Sent statuses allow full edit).
- Delete invoice (with confirmation).
- Duplicate invoice.
- Change invoice status manually.
- Invoice list: filterable by status tab (All / Unpaid / Partially Paid / Paid / Overdue / Draft).
- Invoice list: searchable by invoice number, client name.
- Invoice list: sortable by date, total, status.
- Inline status badge with color coding.
- View invoice detail: full line item breakdown, timeline, payment history.

### 7.5 Payment Recording
- Mark invoice as paid (full payment).
- Record partial payment: enter amount, date, notes.
- Payment history visible on invoice detail.
- When final payment recorded → invoice status auto-updates to "Paid".
- Receipt becomes available upon full payment.

### 7.6 Receipt Generation
- Auto-generate receipt when invoice reaches "Paid" status.
- Receipt includes: receipt number, invoice reference, client info, payment date, items summary, total paid, payment method (optional).
- Receipt preview in-app.
- Export receipt as PDF.

### 7.7 PDF Export
- Export invoice as PDF: full branded layout.
- Export receipt as PDF.
- PDF includes: business name/logo, client details, line items, totals, status, notes.
- Generation via browser-based PDF (react-pdf or html2canvas + jsPDF).

### 7.8 Settings
- Business profile: name, email, address, logo, currency, tax ID.
- Invoice defaults: default payment terms, default tax rate, invoice number prefix.
- Account: change email, change password, delete account.

---

## 8. Technical Architecture

### 8.1 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | TailwindCSS + shadcn/ui (preset: `b5d3zJ58a`) |
| Backend/DB | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| PDF | @react-pdf/renderer or jsPDF + html2canvas |
| Hosting | Vercel |
| State | React Query (TanStack Query) for server state |
| Forms | React Hook Form + Zod validation |
| Charts | Recharts |
| Icons | Lucide React |

### 8.2 Architecture Principles

- **No dummy static data in production.** All dashboard figures, tables, and lists are fetched from Supabase in real-time.
- **Optimistic UI updates.** Creating a client or invoice should reflect instantly in the UI before server confirmation.
- **Row Level Security (RLS).** All Supabase tables enforce RLS. Users can only access their own data.
- **Supabase Realtime** subscriptions for dashboard metrics so KPI cards update without page refresh.
- **File storage** for business logos via Supabase Storage (bucket: `logos`).

### 8.3 Route Structure

```
/                        → Hero / Landing
/login                   → Login page
/signup                  → Sign-up page
/app                     → App shell (authenticated)
/app/dashboard           → Dashboard (default)
/app/invoices            → Invoice list
/app/invoices/new        → Create invoice
/app/invoices/:id        → Invoice detail / edit
/app/clients             → Client list
/app/clients/new         → Create client
/app/clients/:id         → Client profile
/app/receipts            → Receipt list
/app/receipts/:id        → Receipt detail
/app/settings            → Settings
/app/settings/profile    → Business profile
/app/settings/account    → Account settings
```

---

## 9. Information Architecture

```
PayMint
├── Public
│   ├── Hero Section
│   │   ├── Navbar (logo, Login, Sign Up)
│   │   ├── Hero copy + CTA
│   │   ├── Dashboard preview (static screenshot/mockup)
│   │   └── Minimal footer (links, copyright)
│   ├── /login
│   └── /signup
│
└── App (authenticated)
    ├── Sidebar Navigation
    │   ├── Dashboard
    │   ├── Invoices
    │   ├── Clients
    │   ├── Receipts
    │   └── Settings
    │
    ├── Dashboard
    │   ├── KPI Cards (4)
    │   ├── Revenue Chart
    │   └── Recent Activity Tables
    │
    ├── Invoices
    │   ├── Invoice List (tabs + search + sort)
    │   ├── Invoice Detail / Edit
    │   └── Create Invoice (multi-section form)
    │
    ├── Clients
    │   ├── Client List (search + sort)
    │   ├── Client Detail (info + invoice history)
    │   └── Create / Edit Client (form modal)
    │
    ├── Receipts
    │   ├── Receipt List
    │   └── Receipt Detail / Preview
    │
    └── Settings
        ├── Business Profile
        └── Account
```

---

## 10. User Flows

### 10.1 Onboarding Flow

```
Land on Hero
  → Click "Get Started Free"
  → /signup: enter email + password + business name
  → Email verification sent
  → Verify email → redirect to /app/dashboard
  → First-run empty state with "Create your first invoice" CTA
  → (Optional) Settings prompt: "Complete your business profile"
```

### 10.2 Invoice Creation Flow

```
/app/invoices → Click "+ New Invoice"
  → /app/invoices/new
  → Step 1: Select client (search dropdown or "Add new client" inline)
  → Step 2: Set invoice number, issue date, due date
  → Step 3: Add line items (description, qty, price, tax)
  → Step 4: Add discount (optional) + notes
  → Preview total calculation (live)
  → Click "Save as Draft" OR "Save & Send"
  → Invoice appears instantly in /app/invoices table
  → Toast: "Invoice #1023 created"
  → Dashboard KPIs update
```

### 10.3 Payment Recording Flow

```
/app/invoices → Click invoice row
  → Invoice detail page
  → Click "Record Payment"
  → Modal: amount, payment date, payment method, notes
  → Submit → payment saved to DB
  → Invoice status updates (Partially Paid OR Paid)
  → If Paid → receipt auto-generated
  → Toast: "Payment recorded. Receipt generated."
  → Dashboard updates
```

### 10.4 Receipt & PDF Export Flow

```
Invoice detail (status: Paid)
  → "View Receipt" button becomes active
  → /app/receipts/:id
  → Receipt preview rendered
  → Click "Export PDF"
  → PDF generated in browser and downloaded
  → Filename: "PayMint-Receipt-{receiptNumber}.pdf"
```

### 10.5 Client Management Flow

```
/app/clients → Click "+ New Client"
  → Slide-over panel or modal form
  → Fill: name, email, phone, company, address, notes
  → Submit → client appears instantly in table
  → Click client row → /app/clients/:id
  → View all invoices for this client
  → Edit or delete client from detail page
```

---

## 11. Database Schema

### 11.1 Tables

#### `users` (managed by Supabase Auth + profiles extension)

```sql
CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  email        TEXT NOT NULL,
  full_name    TEXT,
  business_name TEXT,
  business_address TEXT,
  business_email TEXT,
  tax_id       TEXT,
  phone        TEXT,
  logo_url     TEXT,
  currency     TEXT DEFAULT 'USD',
  invoice_prefix TEXT DEFAULT 'INV',
  next_invoice_number INTEGER DEFAULT 1001,
  default_tax_rate DECIMAL(5,2) DEFAULT 0.00,
  default_payment_terms TEXT DEFAULT 'Net 30'
);
```

#### `clients`

```sql
CREATE TABLE clients (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  email        TEXT,
  phone        TEXT,
  company      TEXT,
  address      TEXT,
  city         TEXT,
  country      TEXT,
  notes        TEXT,
  is_archived  BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_name ON clients(user_id, name);
```

#### `invoices`

```sql
CREATE TYPE invoice_status AS ENUM (
  'draft',
  'sent',
  'partially_paid',
  'paid',
  'overdue',
  'cancelled'
);

CREATE TABLE invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  invoice_number  TEXT NOT NULL,
  issue_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date        DATE,
  status          invoice_status NOT NULL DEFAULT 'draft',
  subtotal        DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  tax_total       DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  discount_type   TEXT CHECK (discount_type IN ('flat', 'percent')) DEFAULT NULL,
  discount_value  DECIMAL(10,2) DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  total           DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  amount_paid     DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  balance_due     DECIMAL(12,2) GENERATED ALWAYS AS (total - amount_paid) STORED,
  notes           TEXT,
  payment_terms   TEXT,
  sent_at         TIMESTAMPTZ,
  paid_at         TIMESTAMPTZ,
  UNIQUE(user_id, invoice_number)
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(user_id, status);
CREATE INDEX idx_invoices_due_date ON invoices(user_id, due_date);
```

#### `invoice_items`

```sql
CREATE TABLE invoice_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  invoice_id   UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  description  TEXT NOT NULL,
  quantity     DECIMAL(10,3) NOT NULL DEFAULT 1,
  unit_price   DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  tax_rate     DECIMAL(5,2) DEFAULT 0.00,
  tax_amount   DECIMAL(12,2) DEFAULT 0.00,
  line_total   DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  sort_order   INTEGER DEFAULT 0
);

CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
```

#### `payments`

```sql
CREATE TABLE payments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  invoice_id     UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount         DECIMAL(12,2) NOT NULL,
  payment_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  notes          TEXT
);

CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
```

#### `receipts`

```sql
CREATE TABLE receipts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  invoice_id      UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receipt_number  TEXT NOT NULL,
  issued_at       TIMESTAMPTZ DEFAULT NOW(),
  total_paid      DECIMAL(12,2) NOT NULL,
  notes           TEXT,
  UNIQUE(user_id, receipt_number)
);

CREATE INDEX idx_receipts_invoice_id ON receipts(invoice_id);
CREATE INDEX idx_receipts_user_id ON receipts(user_id);
```

### 11.2 Row Level Security Policies

Apply to all tables. Example for `invoices`:

```sql
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own invoices"
  ON invoices FOR ALL
  USING (auth.uid() = user_id);
```

Apply equivalent policies to `clients`, `invoice_items`, `payments`, `receipts`, `profiles`.

### 11.3 Database Functions

#### Auto-update `updated_at`
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to invoices, clients, profiles
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Auto-set overdue status
```sql
-- Run via Supabase Edge Function (cron, daily):
UPDATE invoices
SET status = 'overdue'
WHERE status IN ('sent', 'partially_paid')
  AND due_date < CURRENT_DATE;
```

---

## 12. Dashboard Behavior

### 12.1 KPI Cards

| Card | Calculation | Update Trigger |
|------|------------|---------------|
| Total Revenue | `SUM(amount_paid)` across all user invoices | Any payment recorded |
| Outstanding | `SUM(balance_due)` where status IN (sent, partially_paid, overdue) | Any invoice/payment mutation |
| Total Invoices | `COUNT(*)` all non-draft invoices | Invoice created/deleted |
| Overdue | `COUNT(*)` where status = overdue | Status change / cron |

### 12.2 Revenue Chart

- X-axis: months (dynamic, based on selected time range)
- Y-axis: total paid amount per month
- Data source: aggregate `payments.amount` grouped by `DATE_TRUNC('month', payment_date)`
- Active/selected bar highlighted in brand color (others in muted tone)
- Tooltip shows exact amount on hover
- Rendered with Recharts `<BarChart>`

### 12.3 Recent Activity Tables

- Recent Invoices: last 8 invoices ordered by `created_at DESC`
- Columns: Invoice #, Client, Issue Date, Total, Status badge, Actions (view, ...)
- Recent Clients: last 5 clients ordered by `created_at DESC`

### 12.4 Time Range Filter

Pills: "12 months" | "6 months" | "30 days" | "7 days"
Affects: revenue chart and recent activity date window.
Default: "12 months"

---

## 13. Invoice Lifecycle

```
DRAFT
  ↓ (user clicks "Send" or manually changes status)
SENT
  ↓ (partial payment recorded)
PARTIALLY_PAID
  ↓ (full payment recorded)
PAID  ←─────────────────────────────────────┐
  ↑                                          │
SENT ──── (full payment recorded directly) ──┘
  ↓ (due date passes, cron runs)
OVERDUE (from SENT or PARTIALLY_PAID)
  ↓ (payment recorded on overdue invoice)
PAID (overdue can transition to paid)
  
Any status → CANCELLED (manual, with confirmation)
```

**Status badge colors:**

| Status | Color Scheme |
|--------|-------------|
| Draft | Grey / neutral |
| Sent | Blue / info |
| Partially Paid | Amber / warning |
| Paid | Green / success |
| Overdue | Red / danger |
| Cancelled | Muted grey, strikethrough |

---

## 14. Receipt Lifecycle

- Receipt is **auto-created** when invoice transitions to `paid` status.
- Receipt number format: `REC-{year}-{4-digit-sequence}` e.g. `REC-2025-0042`
- Receipt is **immutable** after creation (no editing).
- Receipt can be **viewed and downloaded as PDF** at any time.
- Receipts list at `/app/receipts` shows all generated receipts, linked to source invoice.
- If an invoice is somehow uncancelled (edge case) and re-paid, a new receipt is generated.

---

## 15. Authentication Flow

### 15.1 Sign-Up
1. User submits email + password + business name.
2. Supabase creates `auth.users` record.
3. Trigger creates `profiles` row with `id = auth.uid()`.
4. Verification email sent (Supabase default).
5. On verification → redirect to `/app/dashboard`.
6. First-run: empty state with seed data offer (optional dismiss).

### 15.2 Login
1. User submits email + password.
2. Supabase returns session token.
3. Token stored in localStorage via Supabase client.
4. Redirect to `/app/dashboard`.

### 15.3 Session Persistence
- `supabase.auth.onAuthStateChange` listener in root component.
- Protected routes: `<ProtectedRoute>` wrapper checks `session`.
- If no session → redirect to `/login` with `?redirect=/app/...` param.

### 15.4 Password Reset
1. User clicks "Forgot password" on login page.
2. Enter email → Supabase sends reset link.
3. User clicks link → redirect to `/reset-password` route with token.
4. Enter new password → submit → session restored.

---

## 16. CRUD Requirements

### Clients

| Operation | Trigger | Behavior |
|-----------|---------|----------|
| Create | Form submit | Inserted to DB → optimistic update in table → toast |
| Read | Page load | Fetched via React Query, cached |
| Update | Edit form submit | Optimistic update → confirm toast |
| Delete | Confirm dialog | Blocked if active invoices exist → warning modal |

### Invoices

| Operation | Trigger | Behavior |
|-----------|---------|----------|
| Create | Form submit | DB insert → invoice appears in list → dashboard KPIs refresh |
| Read | List / detail page | React Query fetch with cache invalidation |
| Update | Edit form (Draft/Sent only) | Recalculate totals → DB update → optimistic UI |
| Delete | Confirm dialog | Only Draft invoices deletable; others must be cancelled |
| Duplicate | Context menu | Clone invoice (without payments) as new Draft |
| Status Change | Dropdown / action | DB update → badge refreshes → dashboard updates |

### Payments

| Operation | Trigger | Behavior |
|-----------|---------|----------|
| Create | "Record Payment" modal | DB insert → invoice `amount_paid` recalculated → status recalculated → receipt created if fully paid |
| Read | Invoice detail timeline | Fetched on invoice detail load |
| Delete | Not supported in MVP | (future: void payment) |

### Receipts

| Operation | Trigger | Behavior |
|-----------|---------|----------|
| Create | Auto on invoice paid | DB insert → receipt accessible immediately |
| Read | Receipt list + detail | Standard React Query fetch |
| Update | Not supported | Immutable by design |
| Delete | Not supported | Audit trail preserved |

---

## 17. PDF Export Behavior

### Invoice PDF Layout

```
[Business Logo]               [Invoice]
[Business Name]               Invoice #: INV-1023
[Business Address]            Issue Date: Jan 15, 2025
[Business Email]              Due Date: Feb 15, 2025

Bill To:
[Client Name]
[Client Company]
[Client Address]
[Client Email]

─────────────────────────────────────────────────────
DESCRIPTION          QTY    UNIT PRICE    TAX    TOTAL
─────────────────────────────────────────────────────
Brand Strategy...    1      $2,500.00     10%    $2,500.00
Logo Design          1      $1,200.00     10%    $1,200.00
─────────────────────────────────────────────────────
                                    Subtotal:  $3,700.00
                                    Tax (10%): $370.00
                                    Discount:  -$0.00
                                    TOTAL:     $4,070.00
                                    Paid:      $0.00
                                    BALANCE:   $4,070.00
─────────────────────────────────────────────────────
Notes: Payment due within 30 days. Bank transfer preferred.

[Status Badge: UNPAID]
```

### Receipt PDF Layout

```
[Business Logo]               [Receipt]
[Business Name]               Receipt #: REC-2025-0042
                              Invoice #: INV-1023
                              Date: Feb 14, 2025

Received From:
[Client Name] — [Client Company]

Services:
[Summary of invoice items]

TOTAL RECEIVED: $4,070.00
Payment Method: Bank Transfer

Thank you for your business.
```

### Implementation

- Use `@react-pdf/renderer` for fully structured PDFs.
- Alternatively: render a hidden `<div>` with invoice layout → `html2canvas` → `jsPDF`.
- Fonts: embed brand fonts in PDF (subset if needed).
- File naming: `PayMint-Invoice-{invoiceNumber}.pdf`, `PayMint-Receipt-{receiptNumber}.pdf`.

---

## 18. Empty States

Each empty state must have: an icon, a short headline, a supporting sentence, and a primary CTA button.

| Screen | Headline | Supporting Text | CTA |
|--------|----------|-----------------|-----|
| Dashboard (new user) | "Your workspace is ready." | "Create your first invoice to start tracking revenue." | "Create Invoice" |
| Invoices list | "No invoices yet." | "Start by creating your first invoice." | "+ New Invoice" |
| Clients list | "No clients added." | "Add a client to get started." | "+ New Client" |
| Receipts list | "No receipts generated." | "Receipts appear automatically when invoices are paid." | "View Invoices" |
| Client detail (no invoices) | "No invoices for this client." | "Create an invoice assigned to this client." | "Create Invoice" |

Seed/demo data: on first login, offer an optional "Load sample data" button that inserts 2 demo clients + 3 demo invoices to demonstrate the UI. This is dismiss-only and clearly labeled as demo data.

---

## 19. Error Handling

### 19.1 Form Validation
- All forms validated with Zod schemas before submission.
- Inline field errors below each input.
- Form-level error toast for server errors.

### 19.2 Network Errors
- React Query retry logic: 2 retries with exponential backoff.
- Error boundary wraps `/app` shell — shows graceful error screen.
- Toast notification for failed mutations with "Retry" option.

### 19.3 Common Error States

| Error | UI Behavior |
|-------|------------|
| Create invoice — client not found | Inline dropdown error: "Client not found. Add a new one." |
| Delete client — has invoices | Modal warning: "This client has X invoices. Delete client and archive all invoices?" |
| PDF generation failure | Toast: "PDF generation failed. Try again." with retry button |
| Supabase auth error | Inline form error with specific message (wrong password, email exists, etc.) |
| Session expired | Silent redirect to `/login?expired=true` with banner: "Your session expired. Please log in again." |

---

## 20. Responsiveness Requirements

### Breakpoints

| Name | Width | Behavior |
|------|-------|----------|
| Mobile | < 768px | Single column, bottom nav or hamburger menu |
| Tablet | 768px–1024px | Sidebar collapsed (icon only) or hidden |
| Desktop | > 1024px | Full sidebar expanded |

### Sidebar Behavior
- **Desktop (>1024px):** Always visible, 240px wide, full labels.
- **Tablet (768–1024px):** Collapsed to icon-only (60px wide), hover expands.
- **Mobile (<768px):** Hidden by default. Hamburger icon in top bar. Drawer slides in from left as overlay.

### Table Behavior on Mobile
- Invoice and client tables become **card stacks** on mobile.
- Each row renders as a card with key info (name, amount, status badge, action button).
- Horizontal scrolling allowed as fallback on tablet for data-dense tables.

### Forms
- Full-width on mobile.
- Two-column grid collapses to single column below 640px.
- Line item rows stack vertically on mobile.

### Navigation on Mobile
- Top bar: logo left, hamburger right.
- Drawer nav: full-screen overlay with all nav items + user profile + logout.
- Bottom persistent action bar on invoice detail: "Record Payment" + "Export PDF".

---

## 21. Future Roadmap

### Phase 2 (3–6 months post-MVP)
- Recurring invoices (weekly / monthly automation)
- Invoice email delivery (send directly from app via Resend/SendGrid)
- Custom invoice branding (logo, colors, font)
- Client portal (shareable link for clients to view/pay invoices)
- Stripe / PayPal payment link integration

### Phase 3 (6–12 months)
- Multi-currency support with live FX rates
- Tax reporting export (CSV, summary by period)
- Team seats (Pro Business plan)
- Invoice templates library
- Expense tracking module
- Mobile apps (React Native)

### Phase 4 (12+ months)
- Accounting integrations (Xero, QuickBooks)
- API access for developers
- White-label option for agencies
- AI-powered payment follow-up drafts

---

*End of PRD*
