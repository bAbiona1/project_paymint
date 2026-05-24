# PayMint — Style Guide

**Version:** 1.0.0
**shadcn Preset:** `b5d3zJ58a`
**Status:** Ready for Implementation
**Prepared For:** Lovable / Bolt / Replit AI Builders

---

> **Builder Instruction:** This document is the single source of truth for all visual decisions in PayMint. Before generating any component, read the relevant section. The shadcn preset `b5d3zJ58a` provides the base token system — all component overrides and extensions defined here layer on top of it. Do not deviate from this guide for the sake of convenience.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [shadcn Preset Setup](#2-shadcn-preset-setup)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing System](#5-spacing-system)
6. [Border Radius System](#6-border-radius-system)
7. [Elevation & Shadows](#7-elevation--shadows)
8. [Layout & Grid](#8-layout--grid)
9. [Motion System](#9-motion-system)
10. [Component Styling Rules](#10-component-styling-rules)
    - Sidebar
    - Navbar / Top Bar
    - Dashboard KPI Cards
    - Revenue Chart
    - Tables
    - Forms & Inputs
    - Buttons
    - Modals & Dialogs
    - Slide-Over Panels
    - Dropdowns & Selects
    - Invoice Cards & Rows
    - Receipt Preview
    - Status Badges
    - Empty States
    - Loading States / Skeletons
    - Avatars
    - Toasts & Notifications
11. [Hero Section](#11-hero-section)
12. [Dashboard Design Language](#12-dashboard-design-language)
13. [Invoice & Receipt Design Language](#13-invoice--receipt-design-language)
14. [Responsive Design Rules](#14-responsive-design-rules)
15. [Interaction States](#15-interaction-states)
16. [Design Reference Analysis](#16-design-reference-analysis)

---

## 1. Design Philosophy

### 1.1 Visual Identity

PayMint is built on the principle that **financial tools should inspire confidence, not anxiety.** The visual language is calm, deliberate, and editorial — it communicates competence without showing off.

The aesthetic is positioned between **Stripe** (obsessive precision, clean data surfaces) and **Linear** (elegant developer taste, spacious density) with the warmth of **Notion** (readable, human, approachable). The overall impression should be: *"this was built by someone who cares deeply about craft."*

Every design decision should pass this test: **Does this feel like it belongs in a premium SaaS product that handles money?** If it feels playful, decorative, or loud — remove it.

### 1.2 Emotional Feel

- **Calm:** No jarring colors. No aggressive gradients. No animation that demands attention.
- **Trustworthy:** Clean data display. Consistent hierarchy. Nothing hidden or confusing.
- **Efficient:** Information is where you expect it. Actions are obvious. Every screen has one primary purpose.
- **Premium:** Whitespace is generous. Typography is intentional. Shadows are subtle. Details are refined.

### 1.3 Interaction Philosophy

Interactions should feel **immediate and quiet.** Hover states are gentle. Transitions are short. Modals slide in rather than pop. Loading skeletons shimmer softly. Nothing should feel heavy or mechanical.

The rule: **if the animation is drawing attention to itself rather than communicating state, remove it.**

### 1.4 Spacing Philosophy

Breathing room is a feature. Content should never feel compressed. Use space to communicate grouping, hierarchy, and priority. Sections are separated by space — not dividers.

Default inner padding for cards and sections: `24px`. Between content groups: `32px–48px`. Between page sections: `64px`.

### 1.5 Hierarchy Philosophy

Three levels of visual hierarchy are enough:

1. **Primary:** The main number, action, or title. Largest. Heaviest weight.
2. **Secondary:** Supporting labels, metadata, column headers. Medium weight. Slightly muted color.
3. **Tertiary:** Timestamps, IDs, hints. Small. Muted.

Never have four competing levels of hierarchy on one screen.

---

## 2. shadcn Preset Setup

**Preset ID:** `b5d3zJ58a`

### Builder Instructions

When initializing the project with shadcn/ui:

```bash
npx shadcn@latest init
```

Select the preset `b5d3zJ58a` when prompted, or apply it via the shadcn Themes panel.

All component usage in this project must:
1. Import from `@/components/ui/` (shadcn local copies).
2. Apply additional className overrides as defined in this style guide.
3. Never import from `shadcn/ui` directly — only local copies allow safe override.

The preset establishes base CSS variables in `:root` and `.dark`. All color references in Tailwind classes (`bg-background`, `text-foreground`, etc.) map to these variables. The extended palette defined in Section 3 adds to — not replaces — these base tokens.

**Always use CSS variable-based colors** (e.g., `bg-card`, `text-muted-foreground`) rather than raw Tailwind color utilities (e.g., `bg-gray-100`) unless explicitly specified in this guide. This ensures light/dark mode consistency.

---

## 3. Color System

PayMint uses a restrained, intentional palette. No gradients on UI chrome. No neon. No aggressive saturation. Colors are used to communicate status, hierarchy, and brand — not decoration.

### 3.1 Brand Palette

```css
:root {
  /* --- Brand Primary: Deep Sage/Slate Green --- */
  --paymint-primary-950: #0d1f1a;
  --paymint-primary-900: #132b24;
  --paymint-primary-800: #1a3a30;
  --paymint-primary-700: #1f4a3c;
  --paymint-primary-600: #265c4a;   /* Primary interactive: buttons, active states */
  --paymint-primary-500: #2d7059;   /* Hover state for primary */
  --paymint-primary-400: #3a8f70;
  --paymint-primary-300: #5aaa8a;
  --paymint-primary-200: #8ecab4;
  --paymint-primary-100: #c4e4d9;
  --paymint-primary-50:  #edf7f3;   /* Light tint for backgrounds, hover rows */

  /* --- Accent: Warm Slate (for secondary actions, info) --- */
  --paymint-accent-600: #3d4f6e;
  --paymint-accent-500: #4a5f84;
  --paymint-accent-400: #6278a0;
  --paymint-accent-100: #dde3ef;
  --paymint-accent-50:  #f0f3f8;

  /* --- Surface Colors --- */
  --paymint-surface-bg:       #f7f8f9;   /* Page background (app shell) */
  --paymint-surface-card:     #ffffff;   /* Card, panel, modal surfaces */
  --paymint-surface-subtle:   #f2f4f6;   /* Table row hover, input bg */
  --paymint-surface-border:   #e5e8ec;   /* Default border color */
  --paymint-surface-divider:  #eceef1;   /* Table dividers, section separators */

  /* --- Text Hierarchy --- */
  --paymint-text-primary:     #0f1923;   /* Main headings, numbers */
  --paymint-text-secondary:   #4a5568;   /* Labels, supporting text */
  --paymint-text-tertiary:    #8896a4;   /* Timestamps, metadata, hints */
  --paymint-text-disabled:    #b0bcc8;   /* Disabled form labels */
  --paymint-text-inverse:     #ffffff;   /* Text on dark surfaces */

  /* --- Status Colors --- */
  /* Success — Paid */
  --paymint-success-bg:       #edfaf4;
  --paymint-success-text:     #1a6b45;
  --paymint-success-border:   #a7dfca;

  /* Warning — Partially Paid */
  --paymint-warning-bg:       #fef9ec;
  --paymint-warning-text:     #7a5a0d;
  --paymint-warning-border:   #f5d87a;

  /* Danger — Overdue */
  --paymint-danger-bg:        #fff1f1;
  --paymint-danger-text:      #8b1a1a;
  --paymint-danger-border:    #f5b4b4;

  /* Info — Sent */
  --paymint-info-bg:          #eef4fd;
  --paymint-info-text:        #1e4d8c;
  --paymint-info-border:      #a8c5f0;

  /* Neutral — Draft / Cancelled */
  --paymint-neutral-bg:       #f2f4f6;
  --paymint-neutral-text:     #5a6473;
  --paymint-neutral-border:   #d1d8e0;
}
```

### 3.2 Tailwind Config Extensions

```js
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      brand: {
        DEFAULT: 'var(--paymint-primary-600)',
        hover:   'var(--paymint-primary-500)',
        light:   'var(--paymint-primary-50)',
        dark:    'var(--paymint-primary-900)',
      },
      surface: {
        bg:      'var(--paymint-surface-bg)',
        card:    'var(--paymint-surface-card)',
        subtle:  'var(--paymint-surface-subtle)',
        border:  'var(--paymint-surface-border)',
      },
      ink: {
        primary:   'var(--paymint-text-primary)',
        secondary: 'var(--paymint-text-secondary)',
        tertiary:  'var(--paymint-text-tertiary)',
      },
      status: {
        paid:        'var(--paymint-success-text)',
        'paid-bg':   'var(--paymint-success-bg)',
        partial:     'var(--paymint-warning-text)',
        'partial-bg':'var(--paymint-warning-bg)',
        overdue:     'var(--paymint-danger-text)',
        'overdue-bg':'var(--paymint-danger-bg)',
        sent:        'var(--paymint-info-text)',
        'sent-bg':   'var(--paymint-info-bg)',
        draft:       'var(--paymint-neutral-text)',
        'draft-bg':  'var(--paymint-neutral-bg)',
      }
    }
  }
}
```

### 3.3 Color Usage Rules

- **Never** use `--paymint-primary-600` as a background for large surfaces.
- **Never** use status colors for decorative purposes.
- Primary brand green is reserved for: primary buttons, active sidebar items, active tab indicators, chart accent bar, links.
- Surfaces use only `--paymint-surface-*` tokens.
- No gradients on UI chrome. One exception: the hero section product preview card may use a very subtle `--paymint-primary-50` to `white` radial gradient.

---

## 4. Typography

### 4.1 Font Stack

```css
/* Display / Headings — Editorial, authoritative */
--font-display: 'DM Serif Display', 'Georgia', serif;

/* Body / UI — Clean, readable, modern */
--font-body: 'DM Sans', 'system-ui', sans-serif;

/* Monospace — Invoice numbers, amounts, codes */
--font-mono: 'DM Mono', 'Fira Code', monospace;
```

**Import in index.css:**
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
```

### 4.2 Type Scale

```css
/* --- Headings --- */
.text-display   { font-size: 3rem;     line-height: 1.1;  font-weight: 400; font-family: var(--font-display); letter-spacing: -0.02em; }
.text-h1        { font-size: 2.25rem;  line-height: 1.2;  font-weight: 600; font-family: var(--font-body); letter-spacing: -0.02em; }
.text-h2        { font-size: 1.75rem;  line-height: 1.25; font-weight: 600; font-family: var(--font-body); letter-spacing: -0.015em; }
.text-h3        { font-size: 1.375rem; line-height: 1.3;  font-weight: 600; font-family: var(--font-body); letter-spacing: -0.01em; }
.text-h4        { font-size: 1.125rem; line-height: 1.4;  font-weight: 600; font-family: var(--font-body); }

/* --- Body --- */
.text-body-lg   { font-size: 1.0625rem; line-height: 1.65; font-weight: 400; }
.text-body      { font-size: 0.9375rem; line-height: 1.6;  font-weight: 400; }
.text-body-sm   { font-size: 0.875rem;  line-height: 1.55; font-weight: 400; }

/* --- Labels & UI --- */
.text-label     { font-size: 0.8125rem; line-height: 1.4; font-weight: 500; letter-spacing: 0.005em; }
.text-caption   { font-size: 0.75rem;   line-height: 1.4; font-weight: 400; }
.text-overline  { font-size: 0.6875rem; line-height: 1.4; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }

/* --- Numbers & Amounts (KPI cards, totals) --- */
.text-amount-xl { font-size: 2.5rem;  font-weight: 600; font-family: var(--font-mono); letter-spacing: -0.02em; }
.text-amount-lg { font-size: 1.75rem; font-weight: 600; font-family: var(--font-mono); letter-spacing: -0.015em; }
.text-amount    { font-size: 1.125rem; font-weight: 500; font-family: var(--font-mono); }
.text-amount-sm { font-size: 0.9375rem; font-weight: 500; font-family: var(--font-mono); }
```

### 4.3 Typography Rules

- **KPI card numbers** always use `text-amount-xl` in `var(--paymint-text-primary)`.
- **Table cell amounts** use `text-amount-sm`, right-aligned, monospace.
- **Section headings** inside the app use `text-h3` or `text-h4`. Never `text-h1` inside the app shell.
- **Hero headline** uses `text-display` with the accent word in italic serif.
- **Column headers** in tables: `text-overline` in `var(--paymint-text-tertiary)`.
- **Invoice numbers and receipt numbers** always in `var(--font-mono)`.

---

## 5. Spacing System

PayMint uses a base-4 spacing system. All spacing values should be multiples of 4.

```
4px   → xs  → tight elements, icon gaps
8px   → sm  → badge padding, compact elements
12px  → md  → form field internal padding
16px  → lg  → standard element spacing
24px  → xl  → card inner padding (default)
32px  → 2xl → between major content sections
48px  → 3xl → between page-level sections
64px  → 4xl → hero/large section vertical rhythm
96px  → 5xl → hero top/bottom padding
```

### Tailwind Spacing Config Extension

```js
spacing: {
  '4.5': '18px',
  '13': '52px',
  '15': '60px',
  '18': '72px',
  '22': '88px',
}
```

### Practical Spacing Rules

- Card padding: `p-6` (24px)
- Table cell padding: `px-4 py-3` (16px / 12px)
- Table header padding: `px-4 py-2.5`
- Form field gap: `gap-4` (16px)
- Section gap inside dashboard: `gap-6` (24px) or `gap-8` (32px)
- Sidebar nav item padding: `px-3 py-2`
- Modal padding: `p-6` on desktop, `p-4` on mobile

---

## 6. Border Radius System

```css
--radius-sm:   4px;    /* Tags, small badges */
--radius-md:   8px;    /* Buttons, inputs, small cards */
--radius-lg:   12px;   /* Cards, panels, modals */
--radius-xl:   16px;   /* Large cards, product preview frames */
--radius-2xl:  24px;   /* Hero section frame, large containers */
--radius-full: 9999px; /* Pills, avatar circles */
```

**Rules:**
- All `<Input>` and `<Select>`: `rounded-md` (8px)
- All `<Button>`: `rounded-md` (8px) for default; `rounded-full` for hero CTA pill
- All dashboard cards: `rounded-xl` (12px)
- Sidebar: no border radius (flush edge)
- Modals and drawers: `rounded-xl` (top corners only for bottom sheet on mobile)
- Status badges: `rounded-full`
- Avatar: `rounded-full`

---

## 7. Elevation & Shadows

PayMint uses shadows sparingly and always softly. Elevation communicates floating surfaces, not depth for decoration.

```css
--shadow-sm:  0 1px 2px 0 rgba(15, 25, 35, 0.04);
--shadow-md:  0 2px 8px -2px rgba(15, 25, 35, 0.08), 0 1px 2px 0 rgba(15, 25, 35, 0.04);
--shadow-lg:  0 8px 24px -4px rgba(15, 25, 35, 0.10), 0 2px 8px -2px rgba(15, 25, 35, 0.06);
--shadow-xl:  0 20px 48px -8px rgba(15, 25, 35, 0.12), 0 8px 16px -4px rgba(15, 25, 35, 0.06);
--shadow-modal: 0 24px 64px -12px rgba(15, 25, 35, 0.16);
```

**Usage:**
- Dashboard cards: `shadow-sm` with `border border-[var(--paymint-surface-border)]`
- Modals / dialogs: `shadow-xl`
- Sidebar: `shadow-sm` (subtle right border preferred)
- Dropdowns / popovers: `shadow-lg`
- Navbar on scroll: `shadow-md`
- Cards on hover (interactive): `shadow-md` (elevated up)

**Do not** use colored shadows. Do not use `box-shadow` insets on interactive elements (use border-color change instead).

---

## 8. Layout & Grid

### 8.1 App Shell Layout

```
┌─────────────────────────────────────────────────────┐
│                     Top Bar (mobile only)           │
├────────────────┬────────────────────────────────────┤
│                │                                    │
│   Sidebar      │         Main Content Area          │
│   (240px)      │         (flex-1, scrollable)       │
│                │                                    │
│                │                                    │
└────────────────┴────────────────────────────────────┘
```

- Sidebar: `w-[240px]`, fixed, `h-screen`, `overflow-y-auto`
- Content area: `flex-1`, `overflow-y-auto`, `bg-[var(--paymint-surface-bg)]`
- Max content width: `max-w-[1200px]`, centered with `mx-auto`
- Content padding: `px-8 py-8` on desktop, `px-4 py-6` on mobile

### 8.2 Dashboard Grid

```
┌────────────┬────────────┬────────────┬────────────┐
│  KPI Card  │  KPI Card  │  KPI Card  │  KPI Card  │
└────────────┴────────────┴────────────┴────────────┘
┌─────────────────────────────────────────────────────┐
│                 Revenue Chart Card                  │
└─────────────────────────────────────────────────────┘
┌──────────────────────────┬──────────────────────────┐
│   Recent Invoices Table  │   Recent Clients List    │
└──────────────────────────┴──────────────────────────┘
```

- KPI cards: `grid grid-cols-2 lg:grid-cols-4 gap-4`
- Revenue chart: full width card
- Bottom row: `grid grid-cols-1 lg:grid-cols-2 gap-6`

### 8.3 Page Header Pattern

Every app page uses:
```
[Page Title - text-h2]          [Primary Action Button]
[Subtitle / breadcrumb text]
─────────────────────────────────────────────────────
[Content]
```

Page title `mb-1`, subtitle `mb-6`, then content.

### 8.4 Hero Layout

```
┌────────────────────────────────────────────────────┐
│  NAVBAR: Logo left  │  Nav links center  │ CTA right │
├────────────────────────────────────────────────────┤
│                                                    │
│  [Eyebrow text]        ┌──────────────────────────┐│
│  [Headline             │   Product Preview Card   ││
│   spanning 2–3 lines]  │   (dashboard screenshot  ││
│                        │    or bento grid stats)  ││
│  [Subheadline]         │                          ││
│                        └──────────────────────────┘│
│  [CTA Button]                                      │
│  [Social proof]                                    │
│                                                    │
└────────────────────────────────────────────────────┘
```

- Hero: two-column layout on desktop, single column on mobile
- Left: text content, CTAs
- Right: visual product preview (bento-grid stat cards or framed dashboard screenshot)

---

## 9. Motion System

### 9.1 Timing Tokens

```css
--duration-instant: 50ms;
--duration-fast:    120ms;
--duration-normal:  200ms;
--duration-slow:    320ms;
--duration-enter:   240ms;
--duration-exit:    160ms;

--ease-default:  cubic-bezier(0.16, 1, 0.3, 1);    /* snappy decelerate */
--ease-out:      cubic-bezier(0, 0, 0.2, 1);
--ease-in:       cubic-bezier(0.4, 0, 1, 1);
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1); /* slight overshoot for enters */
```

### 9.2 Animation Rules

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Button hover (bg/shadow) | 120ms | ease-out |
| Sidebar item hover | 120ms | ease-out |
| Modal enter | 240ms | ease-default |
| Modal exit | 160ms | ease-in |
| Slide-over enter | 280ms | ease-default |
| Toast enter | 240ms | ease-spring |
| Toast exit | 160ms | ease-in |
| Table row hover | 80ms | ease-out |
| Sidebar collapse/expand | 240ms | ease-default |
| Skeleton shimmer | 1.4s | linear (loop) |
| Status badge appear | 200ms | ease-spring |

### 9.3 Keyframe Definitions

```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

@keyframes skeleton-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### 9.4 Page & Component Entrance

- Dashboard KPI cards: staggered `fade-in-up` with `animation-delay: 0ms, 60ms, 120ms, 180ms`
- Table rows: no entrance animation (performance)
- Modal: `fade-in` on overlay + `fade-in-up` on dialog panel
- Slide-over: `slide-in-right`
- Toasts: `fade-in-up` from bottom-right

---

## 10. Component Styling Rules

### 10.1 Sidebar

```
Width:          240px (expanded) / 60px (collapsed)
Background:     var(--paymint-surface-card)  [white]
Right border:   1px solid var(--paymint-surface-border)
Shadow:         none (border is enough)
Padding:        px-3 pt-6 pb-4
```

**Logo area:**
- `h-14` top area, logo left-aligned with `px-3`
- Logo: brand mark + "PayMint" wordmark in `text-h4` weight 700

**Search bar:**
- Input styled as: `bg-[var(--paymint-surface-subtle)] border-none rounded-md text-sm h-9`
- Placeholder: "Search..." with search icon left
- `mx-2 mb-4`

**Nav section label:**
- `text-overline text-[var(--paymint-text-tertiary)] px-3 mb-1 mt-4`

**Nav item (default):**
```
height:     36px
padding:    px-3
border-radius: rounded-md
color:      text-[var(--paymint-text-secondary)]
icon:       16px, same color, mr-2.5
font:       text-sm font-medium
```

**Nav item (hover):**
```
bg:   var(--paymint-surface-subtle)
transition: 120ms ease-out
```

**Nav item (active):**
```
bg:     var(--paymint-primary-50)
color:  var(--paymint-primary-600)
icon:   var(--paymint-primary-600)
font:   font-semibold
```

**Bottom section:**
- User avatar + name + role (if applicable)
- Settings link
- Logout button in `text-[var(--paymint-text-tertiary)]`

---

### 10.2 Navbar / Top Bar

**Used only on the public hero page and on mobile (inside app).**

**Public navbar:**
```
height:     64px
background: white
border-bottom: 1px solid var(--paymint-surface-border) (on scroll)
padding:    px-8 (desktop), px-4 (mobile)
```

- Logo: left
- Nav links (Features, Pricing): center, `text-sm text-[var(--paymint-text-secondary)]`
- CTA: right — "Log in" as ghost, "Get Started" as primary pill button
- On scroll > 10px: add `shadow-sm` via JS scroll listener

**App top bar (mobile only):**
```
height:     56px
background: white
border-bottom: 1px solid var(--paymint-surface-border)
padding:    px-4
```

- Hamburger icon (left) → triggers sidebar drawer
- "PayMint" wordmark (center)
- Avatar / profile icon (right)

---

### 10.3 Dashboard KPI Cards

```
Background:   white
Border:       1px solid var(--paymint-surface-border)
Border-radius: rounded-xl (12px)
Padding:      p-6
Shadow:       var(--shadow-sm)
```

**Internal layout:**
```
[Icon + Label row]          [Trend indicator (optional)]
[Big number - text-amount-xl]
[Secondary label - text-caption text-tertiary]
```

- Icon: 20px, `text-[var(--paymint-text-tertiary)]`, in a `w-8 h-8 rounded-md bg-[var(--paymint-surface-subtle)]` container
- Label: `text-label text-[var(--paymint-text-secondary)] mb-2`
- Primary number: `text-amount-xl text-[var(--paymint-text-primary)]`
- Supporting text: `text-caption text-[var(--paymint-text-tertiary)] mt-1`
- Hover: `shadow-md` transition, very subtle

**KPI cards must never show static data.** All numbers are live from Supabase.

---

### 10.4 Revenue Chart

```
Background:   white
Border:       1px solid var(--paymint-surface-border)
Border-radius: rounded-xl
Padding:      p-6
```

- Chart container: `h-[260px]` on desktop
- Bar color (default): `var(--paymint-surface-border)` tint (`#e0e5eb`)
- Bar color (active/selected/current month): `var(--paymint-primary-600)`
- Bar border-radius: `radius: [4, 4, 0, 0]` in Recharts
- Axis lines: none. Grid lines: horizontal only, `stroke: var(--paymint-surface-divider)`
- Tooltip: custom component — dark pill (`bg: #0f1923`, `text: white`, `rounded-lg`, `px-3 py-1.5`, `text-sm font-mono`)
- X-axis labels: `text-caption text-[var(--paymint-text-tertiary)]`
- Y-axis: hidden axis line, labels right side, `text-caption`

---

### 10.5 Tables

**Table container card:**
```
Background:   white
Border:       1px solid var(--paymint-surface-border)
Border-radius: rounded-xl
Overflow:     hidden (radius clips table)
Shadow:       var(--shadow-sm)
```

**Table header row:**
```
Background:   var(--paymint-surface-bg)  [#f7f8f9]
Border-bottom: 1px solid var(--paymint-surface-border)
Height:       40px
```

- Header cells: `text-overline text-[var(--paymint-text-tertiary)]`
- Sort icon: 14px, shows on hover, `text-[var(--paymint-text-tertiary)]`

**Table body row:**
```
Height:       52px (standard)
Border-bottom: 1px solid var(--paymint-surface-divider)
```

- Row hover: `bg-[var(--paymint-surface-subtle)]`, transition 80ms
- Last row: no border-bottom
- Cursor: `pointer` on clickable rows

**Table cell types:**
- Text cells: `text-body-sm text-[var(--paymint-text-primary)]`
- Secondary text (client name subtitle, etc.): `text-caption text-[var(--paymint-text-tertiary)]`
- Amount cells: `text-amount-sm text-[var(--paymint-text-primary)]`, right-aligned
- Date cells: `text-body-sm text-[var(--paymint-text-secondary)]`
- Status cells: contains badge component (see 10.14)
- Actions cell: icon buttons, right-aligned, visible on row hover (opacity transition)

**Tab filter row (above table):**
```
Border-bottom: 1px solid var(--paymint-surface-border)
Tab item: text-sm font-medium px-1 py-2.5 mr-6
Active tab: text-[var(--paymint-primary-600)], border-bottom: 2px solid var(--paymint-primary-600)
Inactive tab: text-[var(--paymint-text-secondary)], no border
```

**Pagination footer:**
```
Height:       48px
Border-top:   1px solid var(--paymint-surface-border)
Padding:      px-4
```

---

### 10.6 Forms & Inputs

**Input field:**
```
Height:         40px
Background:     white
Border:         1px solid var(--paymint-surface-border)
Border-radius:  rounded-md (8px)
Padding:        px-3
Font:           text-body-sm
Color:          text-[var(--paymint-text-primary)]
```

**States:**
- Default: `border-[var(--paymint-surface-border)]`
- Hover: `border-[var(--paymint-primary-300)]`
- Focus: `border-[var(--paymint-primary-600)] ring-2 ring-[var(--paymint-primary-100)]`
- Error: `border-[var(--paymint-danger-border)] ring-2 ring-[var(--paymint-danger-bg)]`
- Disabled: `bg-[var(--paymint-surface-subtle)] text-[var(--paymint-text-disabled)] cursor-not-allowed`

**Label:**
- `text-label font-medium text-[var(--paymint-text-secondary)]`
- `mb-1.5` below label, before input
- Required indicator: `text-[var(--paymint-danger-text)] ml-0.5` → `*`

**Helper / Error text:**
- `text-caption mt-1`
- Error: `text-[var(--paymint-danger-text)]`
- Hint: `text-[var(--paymint-text-tertiary)]`

**Textarea:**
- Same border/radius rules as input
- `min-h-[80px]`, `resize-y`

**Form section grouping:**
- `<fieldset>` replacement: `<div className="space-y-4">` per logical group
- Between groups: `<div className="border-t border-[var(--paymint-surface-divider)] my-6" />`
- Section label: `text-h4 mb-4`

**Line item row (invoice form):**
```
Grid: description (flex-1) | qty (80px) | unit price (120px) | tax (80px) | total (120px) | delete (40px)
Gap: gap-3
Border-bottom: 1px solid var(--paymint-surface-divider)
Padding: py-3
```

---

### 10.7 Buttons

**Primary Button:**
```
Background:       var(--paymint-primary-600)
Text:             white
Height:           40px
Padding:          px-4
Border-radius:    rounded-md
Font:             text-sm font-semibold
Hover bg:         var(--paymint-primary-500)
Active bg:        var(--paymint-primary-700)
Transition:       120ms ease-out
```

**Hero CTA (pill variant):**
```
Same as primary, but:
Border-radius:    rounded-full
Height:           48px
Padding:          px-8
Font-size:        text-base
```

**Secondary Button:**
```
Background:       white
Border:           1px solid var(--paymint-surface-border)
Text:             text-[var(--paymint-text-primary)]
Hover bg:         var(--paymint-surface-subtle)
Hover border:     var(--paymint-primary-300)
```

**Ghost Button:**
```
Background:       transparent
Text:             text-[var(--paymint-text-secondary)]
Hover bg:         var(--paymint-surface-subtle)
No border
```

**Destructive Button:**
```
Background:       var(--paymint-danger-bg)
Text:             var(--paymint-danger-text)
Border:           1px solid var(--paymint-danger-border)
Hover bg:         darken by 5%
```

**Icon Button (action cell):**
```
Size:             32px × 32px
Border-radius:    rounded-md
Background:       transparent on default, var(--paymint-surface-subtle) on hover
Icon:             16px
```

**Button sizes:**
- `sm`: `h-8 px-3 text-xs`
- `default`: `h-10 px-4 text-sm`
- `lg`: `h-11 px-6 text-sm`
- `xl` (hero only): `h-12 px-8 text-base`

---

### 10.8 Modals & Dialogs

**Overlay:**
```
Background: rgba(15, 25, 35, 0.5)
Backdrop-filter: blur(2px)
```

**Dialog panel:**
```
Background:     white
Border-radius:  rounded-xl (12px)
Shadow:         var(--shadow-modal)
Padding:        p-6
Max-width:      480px (confirmation dialogs), 640px (forms), 800px (invoice detail)
Width:          90vw (on small screens)
```

**Dialog structure:**
```
Header (mb-4):    title (text-h4) + optional subtitle (text-body-sm text-tertiary) + close button (top-right)
Body:             form content or message
Footer (mt-6):    action buttons — cancel (ghost) left, confirm (primary/destructive) right
```

---

### 10.9 Slide-Over Panels

Used for: "Add New Client", "Record Payment".

```
Width:        480px (desktop), 100vw (mobile)
Position:     fixed right-0, h-screen
Background:   white
Shadow:       var(--shadow-xl)
Border-left:  1px solid var(--paymint-surface-border)
Padding:      p-6
```

- Header: title + close button (X icon, top-right)
- Overlay behind: same as modal overlay
- Animation: `slide-in-right` (240ms ease-default)
- Scrollable inner content if form is tall
- Footer: sticky `bottom-0 bg-white border-t px-6 py-4` with action buttons

---

### 10.10 Dropdowns & Selects

**Select trigger:**
- Same styling as input field
- Chevron icon: `text-[var(--paymint-text-tertiary)]`, rotates 180° on open

**Dropdown panel:**
```
Background:     white
Border:         1px solid var(--paymint-surface-border)
Border-radius:  rounded-lg (12px)
Shadow:         var(--shadow-lg)
Padding:        p-1
Min-width:      match trigger or 160px
```

**Dropdown item:**
```
Height:         36px
Padding:        px-3
Border-radius:  rounded-md (inside panel)
Font:           text-sm
Color:          text-[var(--paymint-text-primary)]
Hover bg:       var(--paymint-surface-subtle)
Active:         var(--paymint-primary-50) with text-[var(--paymint-primary-600)]
```

---

### 10.11 Invoice Cards & Row Detail

**Invoice row in table:**
Same as table row spec above, with:
- Invoice number: monospace, `text-sm font-medium`
- Client name: primary text + company name below in caption
- Dates: secondary text
- Amount: right-aligned, monospace
- Status badge: centered
- Actions: eye icon + ellipsis menu icon

**Invoice detail page layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Back arrow]  Invoice #INV-1023   [Status Badge]   │
│                                                     │
│  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │ Invoice Info    │  │  Payment Summary        │  │
│  │ Client details  │  │  Total / Paid / Balance │  │
│  │ Dates, terms    │  │  [Record Payment btn]   │  │
│  └─────────────────┘  └─────────────────────────┘  │
│                                                     │
│  Line Items Table                                   │
│                                                     │
│  Subtotal / Tax / Discount / Total                  │
│                                                     │
│  Payment History Timeline                           │
│                                                     │
│  Notes                                              │
└─────────────────────────────────────────────────────┘
```

---

### 10.12 Receipt Preview

Receipt preview renders inside a constrained white card (`max-w-[640px]`, `mx-auto`, `shadow-lg`, `rounded-xl`, `p-8`), simulating a paper document:

```
[Business logo top-left]           RECEIPT
[Business name + address]          Receipt #: REC-2025-0042
                                   Invoice #: INV-1023
                                   Date: Feb 14, 2025
─────────────────────────────────────────────────────────
Received From:
[Client Name] / [Company]

Services Rendered:
[Item summary — italic, text-body-sm]

─────────────────────────────────────────────────────────
                                 TOTAL PAID: $4,070.00

Method: Bank Transfer
─────────────────────────────────────────────────────────
Thank you for your business.
```

- Background: white
- Thin horizontal rules: `border-t border-[var(--paymint-surface-border)]`
- Brand color accent: thin `4px` left border in `var(--paymint-primary-600)` on the "TOTAL PAID" row
- "RECEIPT" title: `text-overline` tracked out, `text-[var(--paymint-text-tertiary)]`
- Export button floats above preview: primary button, right-aligned

---

### 10.13 Status Badges

Badges use `rounded-full`, `text-xs font-medium`, `px-2.5 py-0.5`.

| Status | Background | Text Color | Border |
|--------|-----------|-----------|--------|
| Draft | `--paymint-neutral-bg` | `--paymint-neutral-text` | `--paymint-neutral-border` |
| Sent | `--paymint-info-bg` | `--paymint-info-text` | `--paymint-info-border` |
| Partially Paid | `--paymint-warning-bg` | `--paymint-warning-text` | `--paymint-warning-border` |
| Paid | `--paymint-success-bg` | `--paymint-success-text` | `--paymint-success-border` |
| Overdue | `--paymint-danger-bg` | `--paymint-danger-text` | `--paymint-danger-border` |
| Cancelled | `--paymint-neutral-bg` | `--paymint-neutral-text` | `--paymint-neutral-border` |

All badges: `border` (1px), `inline-flex items-center gap-1.5`
Optional dot before text: `w-1.5 h-1.5 rounded-full bg-current`

---

### 10.14 Empty States

Each empty state is centered in its content area, vertically centered if possible.

```
Icon:        48px, in rounded-xl bg-[var(--paymint-surface-subtle)], text-[var(--paymint-text-tertiary)]
Headline:    text-h4 mt-4 mb-1
Supporting:  text-body-sm text-[var(--paymint-text-tertiary)] max-w-[280px] text-center mb-6
CTA:         primary or secondary button
```

Empty states must never show "lorem ipsum" or placeholder content. The message must be contextually accurate to the specific screen.

---

### 10.15 Loading States / Skeletons

Use skeleton loaders — not spinners — for content that takes > 200ms.

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--paymint-surface-subtle) 25%,
    var(--paymint-surface-border) 50%,
    var(--paymint-surface-subtle) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.4s linear infinite;
  border-radius: var(--radius-sm);
}
```

**Skeleton patterns:**
- KPI cards: `h-8 w-24` for number, `h-3 w-16` for label
- Table rows: `h-4` lines at varying widths matching column content
- Chart: full `h-[260px]` skeleton block
- Text: `h-3` lines at 60–90% width

**Spinners** are acceptable only for button loading states (inline, 16px, same color as button text).

---

### 10.16 Avatars

```
Size: w-8 h-8 (table), w-10 h-10 (profile), w-12 h-12 (large)
Border-radius: rounded-full
Background (fallback initials): var(--paymint-primary-100) text-[var(--paymint-primary-700)]
Font: text-sm font-semibold (for initials)
```

---

### 10.17 Toasts & Notifications

Use shadcn `<Sonner>` or `<Toast>` positioned `bottom-right`.

**Success toast:**
```
Background: white
Border-left: 3px solid var(--paymint-success-text)
Shadow: var(--shadow-lg)
Border-radius: rounded-lg
```

**Error toast:**
```
Border-left: 3px solid var(--paymint-danger-text)
```

**Info toast:**
```
Border-left: 3px solid var(--paymint-info-text)
```

Each toast: icon (16px) + message text (text-sm) + optional action link + dismiss X button.
Auto-dismiss: 4 seconds.

---

## 11. Hero Section

### 11.1 Structure

```html
<section class="hero">
  <nav>...</nav>       <!-- Navbar -->
  <div class="hero-body">
    <div class="hero-left">    <!-- Left: copy + CTA -->
      <p class="eyebrow">...</p>
      <h1>...</h1>
      <p class="subheadline">...</p>
      <div class="cta-row">...</div>
      <div class="social-proof">...</div>
    </div>
    <div class="hero-right">   <!-- Right: visual preview -->
      <div class="preview-frame">...</div>
    </div>
  </div>
  <footer class="hero-footer">...</footer>
</section>
```

### 11.2 Hero Typography

```
Eyebrow:     text-overline text-[var(--paymint-primary-600)] mb-3
H1:          font-display text-5xl lg:text-6xl leading-[1.1] tracking-tight
             Color: var(--paymint-text-primary)
             Accent word: italic, var(--paymint-primary-600)
Subheadline: text-body-lg text-[var(--paymint-text-secondary)] mt-4 max-w-[480px]
```

**Example headline structure:**
```
Invoice smarter.
Get paid *faster.*
```
Where "faster" is in DM Serif Display italic in brand green.

### 11.3 Hero Background

- Page background: `white` or very subtle `var(--paymint-surface-bg)`
- No full-bleed color backgrounds
- No gradients on the hero background (per design direction)
- Optional: extremely subtle dot-grid pattern in `var(--paymint-surface-border)` at 5% opacity

### 11.4 Product Preview Frame

```
Background:   white
Border:       1px solid var(--paymint-surface-border)
Border-radius: rounded-2xl (24px)
Shadow:       var(--shadow-xl)
Overflow:     hidden
```

Contains a **bento grid** of stat mini-cards:

```
┌─────────────────┬───────────────────┐
│  Dashboard      │  $24,350          │
│  screenshot     │  Total Revenue    │
│  or mockup      ├───────────────────┤
│                 │  12 Invoices      │
│                 │  3 Overdue        │
└─────────────────┴───────────────────┘
```

Stat mini-cards use `var(--paymint-primary-900)` as dark bg for the main stat card (inspired by the Ascone hero reference's dark stat tile).

### 11.5 CTA Row

```
Primary: "Get Started Free" — pill button, primary color, h-12 px-8
Ghost:   "See how it works" — text link with arrow icon
Gap:     gap-4 items-center
```

### 11.6 Social Proof

- 3–4 avatar circles (stacked, -ml-2) + text: "Trusted by 1,000+ freelancers"
- `text-caption text-[var(--paymint-text-tertiary)]`
- Star rating display in amber: `★★★★★ 4.9`

### 11.7 Minimal Footer

```
Height:       64px
Border-top:   1px solid var(--paymint-surface-border)
Content:      © 2025 PayMint · Privacy · Terms
Font:         text-caption text-[var(--paymint-text-tertiary)]
```

---

## 12. Dashboard Design Language

### 12.1 Principles

The dashboard is a **command center, not a report.** Users should be able to assess their financial health in under 5 seconds.

- Show only what matters: 4 KPIs, 1 revenue trend, recent activity.
- No decorative elements on the dashboard.
- Every number must be accurate and real-time.
- Zero tolerance for static data.

### 12.2 Section Separation

Use **space + card borders** to separate sections — not horizontal rules or background bands.

- Between page header and KPI cards: `mt-8`
- Between KPI cards and chart: `mt-6`
- Between chart and tables: `mt-6`
- Between table sections: `gap-6`

### 12.3 Interaction Behavior

- KPI cards: hover lifts shadow (`shadow-sm` → `shadow-md`), cursor `pointer`, optionally click to navigate to filtered invoice list.
- Chart bars: hover shows tooltip, active bar color changes.
- Recent invoices rows: hover highlights, click navigates to invoice detail.
- Time range pills: active pill has `bg-[var(--paymint-text-primary)] text-white rounded-full`, inactive is ghost.

### 12.4 KPI Card Layout Details

```
┌─────────────────────────────────────────┐
│  [Icon Box]  Total Revenue              │
│                                         │
│  $24,350.00                             │
│  +12% from last month  ↑                │
└─────────────────────────────────────────┘
```

Trend indicator: `text-caption` + up/down arrow icon + percentage in `text-[var(--paymint-success-text)]` (positive) or `text-[var(--paymint-danger-text)]` (negative).

---

## 13. Invoice & Receipt Design Language

### 13.1 Invoice List Page

**Page header:**
- Title: "Invoices" (text-h2)
- Subtitle: "Manage and track all your invoices" (text-body-sm text-tertiary)
- Right: "+ New Invoice" (primary button with Plus icon)

**Filter tabs** (reference: RimSource table image):
- "All" | "Unpaid" | "Partially Paid" | "Paid" | "Overdue" | "Draft"
- Active tab: brand green indicator underline, brand green text
- Tab row sits inside the table card, at the top, separated by border-bottom

**Search + filter row:**
- Search input left: `w-[280px]`
- Date range picker right: month navigation (← Jan 2025 →) in ghost input style
- Sort button: far right

**Table columns:** Invoice Date | Number | Client | Total | Paid | Balance | Status | Actions

### 13.2 Invoice Number Format

- Pattern: `{prefix}-{number}` e.g. `INV-1023`
- Prefix from settings (default `INV`)
- Always monospace in UI
- Auto-incremented from `profiles.next_invoice_number`

### 13.3 Invoice Create / Edit Form

Multi-section, single page (no wizard/steps):

1. **Client & Invoice Info** (top row: client select, invoice #, dates)
2. **Line Items** (repeating rows, "Add item" button)
3. **Discount & Notes** (optional section, collapsible)
4. **Summary sidebar** (sticky on desktop, shows live-calculated totals)

Live calculation: all totals update as user types — no form submission required.

### 13.4 Receipt Design

Receipts are formal, document-like. They should feel like something worth printing.

- Constrained width: `max-w-[640px] mx-auto`
- White surface with generous padding (`p-10`)
- Thin brand color vertical bar on left edge (`w-1 bg-[var(--paymint-primary-600)] rounded-r`)
- Clear hierarchy: RECEIPT title → parties → items → total
- "Thank you" line at bottom in italic serif

---

## 14. Responsive Design Rules

### 14.1 Breakpoint Application

```css
/* Mobile first */
.container { padding: 0 16px; }

@media (min-width: 640px)  { .container { padding: 0 24px; } }
@media (min-width: 768px)  { .container { padding: 0 32px; } }
@media (min-width: 1024px) { .container { padding: 0 40px; } }
@media (min-width: 1280px) { .container { max-width: 1200px; margin: 0 auto; padding: 0 40px; } }
```

### 14.2 Sidebar Responsive Behavior

```
< 768px:   Hidden. Triggered by hamburger. Full-screen overlay drawer.
768–1024px: Collapsed (icon-only, 60px). Hover to expand with label tooltip.
> 1024px:  Always expanded (240px). No toggle.
```

### 14.3 Table → Card Transformation (Mobile)

On screens < 768px, data tables transform to card stacks:

```jsx
// Each row becomes:
<div className="bg-white border border-surface-border rounded-xl p-4 mb-3">
  <div className="flex justify-between items-start">
    <div>
      <p className="text-sm font-medium">{client}</p>
      <p className="text-caption text-tertiary">#{invoiceNumber}</p>
    </div>
    <StatusBadge status={status} />
  </div>
  <div className="flex justify-between mt-3 items-center">
    <p className="text-caption text-tertiary">{dueDate}</p>
    <p className="text-amount font-semibold">{total}</p>
  </div>
</div>
```

### 14.4 KPI Cards Grid on Mobile

```
Mobile:  grid-cols-2 gap-3
Tablet:  grid-cols-2 gap-4
Desktop: grid-cols-4 gap-4
```

### 14.5 Invoice Form on Mobile

- All inputs full-width, single column
- Line item rows: stacked vertically, each field labeled
- Summary sticky at bottom (above keyboard)
- Save button: full-width, fixed bottom bar

---

## 15. Interaction States

### 15.1 Focus States

```css
/* Global focus ring */
:focus-visible {
  outline: 2px solid var(--paymint-primary-600);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

No focus rings on mouse click — only keyboard navigation.

### 15.2 Hover States Summary

| Element | Hover Change |
|---------|-------------|
| Primary button | bg darkens, shadow lifts |
| Secondary button | bg fills with surface-subtle |
| Ghost button | bg fills with surface-subtle |
| Nav item | bg fills with surface-subtle |
| Active nav item | stays green, bg darkens slightly |
| Table row | bg fills with surface-subtle |
| KPI card | shadow lifts from sm → md |
| Chart bar | color brightens, tooltip appears |
| Status badge | no hover (non-interactive) |
| Icon button | bg fills with surface-subtle, rounded-md |

### 15.3 Disabled States

```css
[disabled], [aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

---

## 16. Design Reference Analysis

### From Dashboard Reference (Revolve)

**What was extracted:**
- Left sidebar with icon + label, search bar at top, grouped nav sections — adopted directly
- Clean white card panels on grey background — adopted (`surface-card` on `surface-bg`)
- Time-range pill tabs for chart filtering — adopted
- Single accent bar in the chart (active month highlighted, others muted) — adopted with brand green instead of purple
- Breadcrumb navigation pattern — adopted in page headers
- "Available Balance" with massive number typography using DM Mono — adopted for KPI cards
- Soft rounded status badges (teal "Settled") — adopted with PayMint status system
- Micro detail: very subtle shadows, border-defined cards — adopted

**What was rejected:**
- Purple brand color — replaced with deep sage green
- Generic icon style — replaced with Lucide
- "File / Store / Company" nav section — not relevant to PayMint

---

### From Hero Reference (Ascone)

**What was extracted:**
- Editorial serif + sans combination (italic serif for emphasis word) — adopted (DM Serif Display italic)
- Two-column hero with right-side bento stat cards — adopted
- Dark high-contrast stat card (dark green tile with white number) — adopted for hero preview
- Minimal navbar with ghost + filled CTA pair — adopted
- Star rating + face avatars social proof row — adopted
- Cream/sand surface card for secondary stat — adapted to `--paymint-primary-50`
- Globe/decorative icon use inside stat cards — adopted for "active clients" card
- Eyebrow text label above headline — adopted ("text-overline text-brand")
- Large editorial headline: font-weight 600, tight tracking — adopted

**What was rejected:**
- Dark green as primary background (too heavy for productivity app) — used only in dark stat tile accent
- Background texture/fabric image — replaced with minimal dot pattern

---

### From Invoice Table Reference (RimSource)

**What was extracted:**
- Status tab filters at top of table (All / Unpaid / Partially Paid / Fully Paid) — adopted
- Color-coded status badges with distinct hues per status — adopted (green/pink/teal/grey system → PayMint system)
- "+ Add Invoice" CTA in top-right with icon — adopted
- Page subtitle below title — adopted
- Month navigation (← Jan 2025 →) date filter — adopted
- Inline action icons (eye = view, ellipsis = more actions) — adopted
- Total / Paid / Balance three-column money display — adopted in table columns
- Search bar above table, left-aligned — adopted
- Compact row height with clean typography — adopted

**What was rejected:**
- Colored sidebar workspace switcher (yellow avatar brand) — simplified to clean wordmark
- Two-level sidebar navigation (MENU / ADVANCED sections) — simplified
- Blue primary accent — replaced with brand green

---

### From Invoice List Reference (CFlow)

**What was extracted:**
- Date-grouped invoice sections with period headers — considered for receipt list view
- Dual-column value display (Invoice value / After tax) — adapted to Total / Balance in table
- "Fix payment" CTA as inline pill action badge — adapted to "Record Payment" inline action
- "Paid: date" confirmation checkmark pattern — adapted to status badge + paid date
- PDF pill button per row for instant export — adopted (icon button in actions column)
- Light lavender background — rejected (use `--paymint-surface-bg` warm grey instead)
- Total invoice value footer bar — adapted to dashboard KPI card
- Clean row spacing and low visual noise — directly adopted

**What was rejected:**
- Purple CTA buttons — replaced with brand green
- Heavy use of purple throughout — architectural color, not PayMint's palette
- Section-grouped table layout — flattened to standard table with tab filters (cleaner for search)

---

*End of Style Guide*

---

> **Final Builder Note:** These two documents — PRD.md and STYLE_GUIDE.md — together define every dimension of PayMint. Do not make visual or functional decisions that contradict either document. When in doubt: minimal, calm, precise. If a component is not defined here, default to the shadcn preset `b5d3zJ58a` base and follow the color/spacing/radius rules established in this guide.
