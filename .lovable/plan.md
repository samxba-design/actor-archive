

## Plan: "How It Works" Page + Fix Demo Access

### Issues Found

1. **"See Examples" button** on the landing page links to `/signup` instead of `/demo/screenwriter` (line 355 of Index.tsx). The demo route itself is public and works fine — it's just not linked correctly.
2. No dedicated "How It Works" or features breakdown page exists.

### Implementation

#### 1. Fix Demo Link on Landing Page
In `src/pages/Index.tsx`, change the "See Examples" button href from `/signup` to `/demo/screenwriter`.

#### 2. Create "How It Works" Page (`src/pages/HowItWorks.tsx`)
A graphically designed, scroll-driven page with the same cinematic styling as the landing page. Structure:

```text
┌─────────────────────────────────────────┐
│  Nav (same as landing)                  │
├─────────────────────────────────────────┤
│  HERO: "Built for Creatives Who Are     │
│         Tired of Being Invisible"       │
│  Subhead: The industry problem          │
├─────────────────────────────────────────┤
│  PAIN POINTS (3-4 cards, animated in)   │
│  - Generic websites don't speak the     │
│    industry's language                  │
│  - Scattered credits across IMDb,       │
│    LinkedIn, personal sites             │
│  - No way to gate scripts or track      │
│    who's reading your work              │
│  - Hours wasted formatting instead      │
│    of creating                          │
├─────────────────────────────────────────┤
│  HOW IT WORKS (3 steps, numbered)       │
│  1. Pick your profile type & theme      │
│  2. Add credits, scripts, reels         │
│  3. Publish & share your custom URL     │
│  Each step has a mock UI illustration   │
├─────────────────────────────────────────┤
│  FEATURE DEEP-DIVES (alternating        │
│  left/right layout with mock visuals)   │
│  - TMDB auto-fill + poster import       │
│  - Script library with access control   │
│  - Built-in analytics dashboard         │
│  - AI writing assistant & coverage sim  │
│  - 10+ industry-designed themes         │
│  - Contact form + pipeline tracker      │
│  - Custom domains & embed widgets       │
├─────────────────────────────────────────┤
│  WHO IT'S FOR (profile type cards)      │
│  Screenwriters, Directors, Actors,      │
│  Authors, Creators, Multi-Hyphenates    │
│  Each with 3-4 bullet points of         │
│  type-specific features                 │
├─────────────────────────────────────────┤
│  COMPARISON TABLE                       │
│  CreativeSlate vs generic website       │
│  builders vs no website                 │
├─────────────────────────────────────────┤
│  CTA: "Start Building — It's Free"     │
│  + Link to live demo                    │
├─────────────────────────────────────────┤
│  Footer                                 │
└─────────────────────────────────────────┘
```

Visual approach:
- Reuses `CinematicBackground`, `BokehField`, landing CSS variables
- Each section animates in via `useInView`
- Pain point cards use red/warning accent, solution cards use gold/green
- Mock UI illustrations are CSS-only (styled divs, no images needed)
- Comparison table uses checkmarks and x-marks

#### 3. Add Route + Navigation
- Add `/how-it-works` route in `App.tsx`
- Add "How It Works" link in the landing page nav bar
- Add "How It Works" link in the landing page footer
- Link the hero "See Examples" → demo, add a separate "How It Works" link nearby

### Files to Create
- `src/pages/HowItWorks.tsx` — full features/how-it-works page

### Files to Edit
- `src/pages/Index.tsx` — fix "See Examples" link, add "How It Works" nav link
- `src/App.tsx` — add `/how-it-works` route

