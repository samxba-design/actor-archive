

## Portfolio Layout & Visual Polish Improvements

### Problems Identified

1. **Layout is too vertical** — each section takes full width and stacks sequentially, creating excessive scrolling. Services buried at the bottom (index 6).
2. **No dynamic visual effects** — the page is static; glass themes lack any shimmer/shine animation that would sell the premium feel.
3. **Services should be a top-level, configurable-position element** — currently a full-row section at the bottom. Should default to a compact sidebar panel near the hero.
4. **Credits section wastes space** — CreditHero takes massive vertical space for one project, then remaining credits stack vertically.
5. **Awards + Press side-by-side is good**, but testimonials and services below are still full-width single sections creating scroll.
6. **No section reordering mechanism** — user can't control where sections appear.

### Plan

#### 1. Glass Shine Animation (CSS-only)
Add a subtle animated light sweep effect to glass-enabled cards. A diagonal white gradient that slowly moves across the card surface, creating a "glass catching light" effect. CSS `@keyframes` with `background-position` animation on a pseudo-element. Only active when `theme.glassEnabled` is true. Very subtle — 8-12 second cycle, 3-5% opacity white gradient.

**Files:** Add CSS keyframes to `src/index.css`, apply conditionally in card components via a shared `useGlassShine()` utility or a `GlassCard` wrapper component.

#### 2. Compact Services Panel
Redesign `SectionServices` to support two display modes:
- **Sidebar mode** (default): Compact card that fits in a column alongside other content. Service names as a tight list with prices, expandable for details.
- **Full mode**: Current card grid layout, used when the user explicitly chooses full-width.

**File:** `src/components/portfolio/sections/SectionServices.tsx`

#### 3. Restructure DemoScreenwriter Layout — Dense Grid
Reorganize the page body into a more information-dense grid layout:

```text
┌─────────────────────────────────────┐
│           HERO (2-col)              │
├───────────────────────┬─────────────┤
│   Logline Showcase    │  Services   │
│   (main column)       │  (sidebar)  │
├───────────────────────┴─────────────┤
│         Script Library (3-4 col)    │
├───────────────────────┬─────────────┤
│   Produced Credits    │ Testimonials│
│   (compact table/row) │ (carousel)  │
├───────────────────────┴─────────────┤
│     Awards · Press (side by side)   │
├─────────────────────────────────────┤
│           Footer / Contact          │
└─────────────────────────────────────┘
```

This keeps the page to ~2 viewport scrolls. Loglines + Services share a row. Credits + Testimonials share a row.

**File:** `src/pages/DemoScreenwriter.tsx`

#### 4. Compact Credits — Table-Style
Replace the CreditHero + stacked CreditCards with a compact horizontal table-like layout. Each credit is a single row: poster thumbnail (48px) | title | role badge | network | year. Featured credit gets a subtle accent left border but same row height. This collapses 3 credits into the space currently used by 1.

**File:** `src/components/portfolio/sections/SectionProjects.tsx`

#### 5. Section Ordering Support
Add a `sectionOrder` prop concept to the demo page. For real users, store section order in the database (future). For now, the demo page hardcodes an optimized order with the dense grid layout.

#### 6. Ambient Background Glow
For dark themes, add a very subtle animated radial gradient glow that slowly drifts behind the content area (not in the hero). Think distant nebula — 2-3% opacity, 15-20 second animation cycle. Adds life without distraction.

**File:** `src/pages/DemoScreenwriter.tsx` (inline positioned div)

### Files to Create
- `src/components/portfolio/GlassCard.tsx` — Reusable card wrapper with optional glass shine animation

### Files to Edit
- `src/index.css` — Add `@keyframes glass-shine` animation
- `src/components/portfolio/sections/SectionServices.tsx` — Compact sidebar mode
- `src/components/portfolio/sections/SectionProjects.tsx` — Compact table-style credits
- `src/pages/DemoScreenwriter.tsx` — Dense grid layout, ambient glow, reordered sections
- `src/components/portfolio/sections/SectionTestimonials.tsx` — Ensure carousel works well at smaller widths

