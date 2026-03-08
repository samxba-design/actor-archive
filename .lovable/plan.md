

## Comprehensive Readability & Design Fix Across All Themes and Layouts

### Problems Found

**1. Featured Project Card (Hero) — Clunky & Unreadable**
- The card uses `heroText` (#F5F0EB white) for title text even though the card has its own solid `bgSecondary` background below the image — white text on cream/white background on light themes
- Genre tag backgrounds are hardcoded `rgba(255,255,255,0.06)` — invisible on light themes
- The 16:9 image + gradient + info-below layout feels heavy and wastes space
- Fix: Redesign as a sleek horizontal card (image left, info right) with all text using `theme.textPrimary` (not `heroText`), and theme-aware tag styling

**2. Stats Bar — "Scripts Available / In Development / Awards" Unreadable**
- Uses `heroTextFaint` = `rgba(245,240,235,0.4)` — barely visible even on dark themes
- Fix: Use `heroTextMuted` for labels instead of `heroTextFaint`

**3. Genre/Status Tags Throughout — No Fill, Invisible on Light Themes**
- `SectionLoglineShowcase`: genre tags use `border: 1px solid ${theme.borderDefault}` + `color: theme.textTertiary` — on Mediterranean/Warm Luxury/Frost these are nearly invisible (#A39E90 on #F4EDE4)
- `SectionScriptLibrary`: status badges same issue ("Optioned", "In Development", "Spec" unreadable)
- `SectionProjects` PosterCard: genre tags same issue
- Fix: Add subtle filled backgrounds (`theme.accentSubtle` or `theme.bgElevated`) to all tag/badge elements, increase text contrast to `theme.textSecondary`

**4. Glass Shine Animation Still Not Visible**
- The `::after` pseudo-element has `z-index: 1` but GlassCard children sit on top of it (normal stacking), making the sweep invisible behind content
- Fix: Add `z-index: 2` to the pseudo-element and ensure card content has `position: relative; z-index: 3` so shine sweeps between background and content — or move shine to `::before` and keep it purely decorative beneath content

**5. Award Result Badges — Low Contrast**
- Non-winner badges use `color: theme.textTertiary` with `border: 1px solid ${theme.borderDefault}` — same invisible-on-light-themes problem
- Fix: Use `theme.textSecondary` and `theme.bgElevated` fill

**6. Featured Project Card Redesign**
- Current: 16:9 landscape image → gradient → solid info bar. Looks like a generic media card
- Proposed: Compact horizontal layout — small poster (2:3) on left, info stacked on right. Title, role badge, genre chips with fills, logline excerpt. Much more elegant, less vertical space

### Files to Edit

| File | Changes |
|---|---|
| `src/components/portfolio/PortfolioHero.tsx` | Redesign featured project card to horizontal poster+info layout; fix stats bar text contrast; fix genre tag colors to use theme tokens not hardcoded rgba |
| `src/components/portfolio/sections/SectionLoglineShowcase.tsx` | Add filled background to genre tags; use `textSecondary` instead of `textTertiary` |
| `src/components/portfolio/sections/SectionScriptLibrary.tsx` | Add filled background to status badges and genre references |
| `src/components/portfolio/sections/SectionProjects.tsx` | Fix PosterCard genre tag contrast |
| `src/components/portfolio/sections/SectionAwards.tsx` | Fix non-winner badge contrast |
| `src/components/portfolio/GlassCard.tsx` | Fix glass shine z-index layering so sweep is visible above background but below content |
| `src/index.css` | Adjust glass-shine `::after` z-index |

### Implementation Order
1. Fix GlassCard shine z-index layering
2. Redesign featured project card in hero (horizontal poster layout)
3. Fix stats bar label contrast
4. Add filled backgrounds to all genre/status tags across LoglineShowcase, ScriptLibrary, Projects, Awards
5. Verify all 7 themes × 10 layouts produce readable text

