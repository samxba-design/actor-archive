

## Fix Text Readability on Poster Credits + Audit All Layouts

### Core Problem
The `PosterCard` component overlays text on poster images using a gradient from `theme.bgPrimary`. On light themes, this creates a cream/white semi-transparent wash — the dark text blends with the colorful poster beneath. On dark themes, the overlay works but text colors like `textTertiary` are still too low contrast against busy poster imagery.

The reference image confirms: role badges ("STAFF WRITER", "CO-WRITER"), network names, and genre tags are unreadable when placed over movie posters with only a gradient overlay.

### Fix 1: Poster Card Text Readability
**File:** `src/components/portfolio/sections/SectionProjects.tsx`

Redesign `PosterCard` so text is **below** the poster image, not overlaid on it:
- Poster image fills the top with 2:3 aspect ratio — clean, no overlay text
- Below the image: a solid-background info bar with title, role badge, network, year
- This guarantees readability on every theme since text sits on `bgSecondary`/`bgElevated`
- On hover, show a subtle scale-up on the image only
- Network logo + name go in the info bar, role as an accent-colored badge

### Fix 2: Glass Shine Not Appearing
**File:** `src/index.css`

The `::after` pseudo-element has `z-index: 1` but `overflow: hidden` on the parent clips it. The issue is the combination of `top: -50%` / `height: 200%` — this works, but the opacity values (`0.03` and `0.06`) are too subtle to see on most screens. Increase to `0.06` / `0.12` for visibility and add a slight delay between cycles so the shine isn't constant.

### Fix 3: Audit All 10 Layouts for Contrast Issues
**File:** `src/pages/DemoScreenwriter.tsx`

- **Classic layout**: `CreditHeroCard` has the same overlay-text-on-image problem. Move the title/role/logline info below the backdrop image instead of overlaying.
- **Standard layout**: Uses `layout="poster"` — fixed by Fix 1.
- **Cinematic layout**: Same poster fix.
- **Compact layout**: Uses `layout="table"` — table rows are fine, text on solid backgrounds.
- **Magazine layout**: Uses poster — fixed by Fix 1.
- **Spotlight layout**: Content on solid `GlassCard` backgrounds — fine.
- **Timeline layout**: Uses poster — fixed by Fix 1.
- **Bento layout**: Uses poster — fixed by Fix 1.
- **Minimal layout**: Uses table — fine.
- **Dashboard layout**: Uses table inside `GlassCard` — fine.

### Fix 4: CreditHeroCard Readability (Classic Layout)
**File:** `src/pages/DemoScreenwriter.tsx`

Redesign `CreditHeroCard` to use a split layout: backdrop image on top, info on a solid background below. Or increase gradient opacity to `ee`→`ff` at bottom for guaranteed contrast.

### Implementation Summary

| File | Changes |
|---|---|
| `src/components/portfolio/sections/SectionProjects.tsx` | Redesign `PosterCard` — move all text below poster image onto solid background |
| `src/index.css` | Increase glass shine opacity from 0.03/0.06 to 0.06/0.12 |
| `src/pages/DemoScreenwriter.tsx` | Fix `CreditHeroCard` text contrast |

