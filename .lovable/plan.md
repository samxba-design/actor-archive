

# Status Badge Customization

## Current State
- `PortfolioHero.tsx` renders `professional_status` as a green text with a ping-animated dot, using `theme.statusAvailable` color
- `SettingsPage.tsx` has two boolean toggles: "Available for Hire" and "Seeking Representation" — but no `professional_status` text field, no animation picker, no color options
- The `profiles` table has `available_for_hire` and `seeking_representation` booleans but no `professional_status`, `status_badge_color`, or `status_badge_animation` columns
- Demo data sets `professional_status` as a string but real users can't control it

## Plan

### 1. Database Migration
Add three columns to `profiles`:
```sql
ALTER TABLE public.profiles
  ADD COLUMN professional_status text DEFAULT NULL,
  ADD COLUMN status_badge_color text DEFAULT 'green',
  ADD COLUMN status_badge_animation text DEFAULT 'pulse';
```

### 2. Profile-Type-Aware Preset Options
Define preset status options per profile type so users get relevant quick-select choices:

| Profile Type | Presets |
|---|---|
| Actor | Available for Auditions, Seeking Representation, On Set, Between Projects |
| Screenwriter/TV Writer | Open to Assignments, Seeking Representation, In Writers' Room, Staffing Season |
| Director/Producer | Accepting Projects, In Production, In Post, In Development |
| Copywriter | Available for Projects, Accepting Clients, Booked Through Q2 |
| Author | On Book Tour, Accepting Submissions, Writing Next Book |
| Journalist | Open to Commissions, On Assignment |
| All types (shared) | Available for Hire, Open to Opportunities, Not Currently Available, Hidden |

Users can also type any custom text.

### 3. Animation Options
- **Pulse** (default) — the current ping animation on the dot
- **Glow** — soft box-shadow pulse on the entire badge
- **Breathe** — opacity fade in/out cycle
- **Static** — no animation, solid dot
- **None** — hide the dot entirely, text only

### 4. Color Options
- Green (default), Blue, Gold/Amber, Red, Purple, White, or pick from theme accent

### 5. Settings Page UI Changes (`SettingsPage.tsx`)
Replace the two boolean switches ("Available for Hire" / "Seeking Representation") with a single **Status Badge** card:

```text
┌─ Status Badge ──────────────────────────────────────────────┐
│ Status: [dropdown: presets + custom input]                   │
│   Quick picks: Available for Hire | Seeking Rep | Open to…  │
│   Or type your own: [___________________________]           │
│                                                              │
│ Color:  ● Green  ● Blue  ● Gold  ● Red  ● Purple  ● Accent │
│ Effect: [Pulse] [Glow] [Breathe] [Static] [None]            │
│                                                              │
│ Preview: ● Available for Hire                                │
│                                                              │
│ [Hide badge entirely] toggle                                 │
└──────────────────────────────────────────────────────────────┘
```

### 6. PortfolioHero.tsx Updates
- Read `professional_status`, `status_badge_color`, `status_badge_animation` from profile
- Render badge with chosen color and animation class
- Support all 5 animation styles via CSS classes
- Backward compat: if `professional_status` is null but `available_for_hire` or `seeking_representation` is true, auto-derive status text

### 7. Demo Pages
- Add `status_badge_color` and `status_badge_animation` to demo data
- Add status badge customization to `DemoCustomizationPanel`

### Files

| File | Change |
|------|--------|
| Migration | Add 3 columns to profiles |
| `src/pages/dashboard/SettingsPage.tsx` | Replace boolean switches with Status Badge card (presets, custom text, color picker, animation picker, live preview) |
| `src/components/portfolio/PortfolioHero.tsx` | Read new fields, apply color/animation dynamically, backward compat |
| `src/index.css` | Add keyframes for glow, breathe animations |
| `src/components/demo/DemoCustomizationPanel.tsx` | Add status badge options |
| `src/components/demo/DemoShared.tsx` | Add statusBadgeColor + statusBadgeAnimation to variants |
| Demo data files | Add new fields |

