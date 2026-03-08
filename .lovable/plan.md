

## Portfolio Demo Page & Component Audit — Comprehensive Fix Plan

### Issues Identified

**Visual Bugs:**
1. **Glass shine animation not visible** — The `::after` pseudo-element has `inset: -50%` which positions it way outside, and combined with `width: 40%` and `overflow: hidden` on the parent, the shine sweep never enters the visible area. The animation math is wrong.
2. **White-on-white text** — Light themes (Warm Luxury, Modern Minimal, Mediterranean, Frost) have light `bgPrimary` but the body sections inherit `textPrimary` which may blend. The `heroText` hardcodes `#F5F0EB` (warm white) regardless of theme, which is unreadable on light-mode hero backgrounds.
3. **"Available" badge** — Currently hardcoded to show "Available" when `available_for_hire` is true. Should instead show the user's chosen professional status (e.g., "Seeking Representation", "For Hire", "Open to Projects").
4. **Produced credits use generic Unsplash images** — Should show actual poster-style images and use poster aspect ratio (2:3) not landscape thumbnails.
5. **Console warning** — `border` and `borderLeft` conflict in `ScriptCard` when `isFeatured`.
6. **No layout variations** — Demo only shows one layout. Users should see multiple arrangement options.

**Layout & Design Issues:**
7. **Credits section too compact** — Table-style rows work but the poster images are 40x40 squares. For produced credits, poster layout (2:3 aspect) is more appropriate.
8. **No layout switcher on demo page** — User asked for multiple sample layouts showing different arrangements.
9. **Theme switcher works but no layout switching**.

### Plan

#### 1. Fix Glass Shine Animation
The `::after` pseudo-element positioning is broken. Fix the CSS so the shine sweep actually traverses the visible card area. Change from `inset: -50%` to proper absolute positioning with the gradient sweeping left-to-right across the full card width.

**File:** `src/index.css` — Rewrite `.glass-shine-card::after` positioning and animation.

#### 2. Fix Text Contrast on Light Themes
- In `PortfolioHero.tsx`: Make `heroText` colors conditional — use dark text when the theme has a light body background AND no banner image, use the hero overlay text colors appropriately.
- In all section components: Text colors already use `theme.textPrimary` etc. which should be correct per-theme. The issue is specifically in the hero when there's no banner — it falls back to `heroText` which is hardcoded warm white.

**File:** `src/components/portfolio/PortfolioHero.tsx`

#### 3. Replace "Available" with Professional Status
- Add a `professionalStatus` field concept to the profile mock data (values like "Seeking Representation", "For Hire", "Open to Projects", "In Development", or null for nothing).
- Update `PortfolioHero.tsx` to display `profile.professional_status` instead of hardcoded "Available".
- Remove the `available_for_hire` boolean check for the status badge.

**Files:** `src/pages/DemoScreenwriter.tsx` (mock data), `src/components/portfolio/PortfolioHero.tsx`

#### 4. Poster-Style Credits Layout
- Change `SectionProjects` to support a `layout` prop: `'poster'` (default for credits with images), `'table'` (compact row), `'grid'` (card grid).
- Poster layout: 2:3 aspect ratio cards in a horizontal scrollable row or 4-column grid. Each shows poster image, title overlay at bottom, role badge, network logo.
- Update mock data to use more cinematic poster-style images.

**File:** `src/components/portfolio/sections/SectionProjects.tsx`, `src/pages/DemoScreenwriter.tsx`

#### 5. Fix ScriptCard Border Conflict
Use `borderLeftWidth` + `borderLeftColor` instead of `borderLeft` shorthand to avoid React warning about mixing `border` and `borderLeft`.

**File:** `src/components/portfolio/sections/SectionScriptLibrary.tsx`

#### 6. Add Layout Switcher to Demo Page
Add a floating layout switcher alongside the theme switcher that lets visitors toggle between layout presets:
- **Standard** — Current dense grid (loglines+services sidebar, credits+testimonials sidebar)
- **Cinematic** — Full-width sections, poster credits, large logline cards
- **Compact** — Maximum density, table credits, minimal spacing
- **Magazine** — Editorial two-column with large featured areas

Each layout rearranges the same sections in different grid configurations and passes different props to components (e.g., `isCredits` vs poster mode, `compact` vs full services).

**Files:** `src/pages/DemoScreenwriter.tsx`, `src/components/portfolio/ThemeSwitcher.tsx` (expand to include layout toggle)

#### 7. Add Professional Status Options
Add a `professional_status` field to the theme/profile system. Options per profession:
- Screenwriter: "For Hire", "Seeking Representation", "In Development", "Open to Projects"
- Actor: "Seeking Representation", "Available for Auditions", "Currently Cast"
- Director: "Open to Projects", "In Production"
- General: "Available", "Open to Work", null (hidden)

**Files:** `src/components/portfolio/PortfolioHero.tsx`, `src/pages/DemoScreenwriter.tsx`

### Files to Edit
- `src/index.css` — Fix glass-shine-card animation CSS
- `src/components/portfolio/PortfolioHero.tsx` — Fix text contrast, replace "Available" with professional status
- `src/components/portfolio/sections/SectionProjects.tsx` — Add poster layout mode, fix image aspect ratios
- `src/components/portfolio/sections/SectionScriptLibrary.tsx` — Fix border shorthand conflict
- `src/components/portfolio/ThemeSwitcher.tsx` — Add layout toggle alongside theme dots
- `src/pages/DemoScreenwriter.tsx` — Add layout switching, update mock data with professional_status, better poster images, multiple layout configs

### Implementation Order
1. Fix glass shine CSS animation
2. Fix text contrast for light themes
3. Replace "Available" with professional status system
4. Add poster layout to SectionProjects
5. Fix ScriptCard border warning
6. Add layout switcher with multiple layout presets
7. Update mock data with better imagery

