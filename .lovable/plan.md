

## Premium Portfolio Theming System — Full Rebuild

This is a large rebuild touching the theme engine, all portfolio components, the demo page, the public profile page, and the settings UI. The scope breaks into 7 implementation phases.

### Current State
- `src/lib/themes.ts` has 10 themes using HSL CSS variables (minimal, noir, editorial, etc.)
- `profiles.theme` column already exists (TEXT, stores theme key)
- Portfolio components use `hsl(var(--portfolio-*))` CSS variables — good foundation
- Demo page (`DemoScreenwriter.tsx`) hardcodes "ink" theme with mock data
- Settings page has a theme dropdown selector (basic)
- No `portfolio_theme` concept — just `theme` on profiles

### Architecture Change
Replace the current simple HSL variable themes with a rich `PortfolioTheme` interface that includes typography, card styles, CTA behavior, animation settings, and glass morphism tokens. The new themes are applied via a `ThemeProvider` that maps all tokens to CSS custom properties on a wrapper div.

### Phase 1: Theme Types & Definitions

**Create `src/themes/theme-types.ts`** — Full `PortfolioTheme` interface with all tokens (bg, text, accent, border, status, font, card, CTA, hero, section number, animation, glass).

**Create `src/themes/themes.ts`** — Export all 7 theme objects:
1. `cinematic-dark` — Near-black, copper accent, Playfair Display serif, editorial numbering
2. `warm-luxury` — Ivory body + dark hero, gold accent, Cormorant Garamond, underlined CTAs
3. `modern-minimal` — White, monochrome black accent, Inter only, zero-radius cards, no parallax
4. `mediterranean` — Parchment/bone bg, terracotta accent, DM Serif Display, pill-shaped CTAs
5. `noir-classic` — True black, blood red accent, Bebas Neue condensed display, no card lift
6. `midnight-glass` — Deep navy, steel-blue accent, frosted glass cards, Inter light (300 weight)
7. `frost` — Silver-white with glass morphism, DM Sans, muted blue accent, light mode glass

**Create `src/themes/ThemeProvider.tsx`** — Context provider that converts theme tokens to `--portfolio-*` CSS variables on a wrapper div. Exposes `usePortfolioTheme()` hook.

**Update `src/lib/themes.ts`** — Keep for backward compatibility but have it reference the new theme system. Map old theme keys to new ones.

### Phase 2: Google Fonts Loading

Load all display fonts needed across themes: Playfair Display, Cormorant Garamond, DM Serif Display, Bebas Neue, Inter, DM Sans. On the settings/demo page load all; on public pages load only the selected theme's fonts dynamically.

### Phase 3: Portfolio Components Rebuild

All components switch from `hsl(var(--portfolio-*))` HSL values to direct hex/rgba values via CSS variables. The ThemeProvider sets these as `--portfolio-bg-primary`, `--portfolio-text-primary`, etc.

**`src/components/portfolio/PortfolioHero.tsx`** — Complete rewrite:
- Two-column hero: left (photo + name + credentials + bio snippet + CTAs), right (Featured Project card)
- 85vh desktop / 70vh mobile with hero image + bottom gradient overlay
- Profile photo with accent glow border
- Representation info near top if available
- Stats bar below hero (X Scripts / Y Projects / Z Awards) as compact horizontal row
- Icon-only social links (no pill badges)
- Staggered fade-in animation on load
- Parallax on hero image (desktop only, controlled by theme token)
- Bio with smooth max-height expand/collapse

**`src/components/portfolio/PortfolioFooter.tsx`** — Minimal dark footer: thin divider, name left, social icons right, copyright + platform credit, contact form styled to theme.

**`src/components/portfolio/PortfolioSection.tsx`** — Section heading with editorial `01 ——— Section Title` pattern. Number style, divider style controlled by theme tokens.

**`src/components/portfolio/PortfolioCTA.tsx`** — New component. Renders 4 CTA variants based on theme token: `text-link`, `outlined`, `underlined`, `filled-subtle`.

**`src/components/portfolio/sections/SectionLoglineShowcase.tsx`** — Single column, no card wrappers. Title in display font, logline in serif italic (or normal per theme), genre tags as small pills, metadata in uppercase. Thin dividers between. First item featured (larger). Scroll fade-in with stagger. Hover: title shifts to accent.

**`src/components/portfolio/sections/SectionScriptLibrary.tsx`** — 3-4 column grid desktop, 2 tablet, 1 mobile. Compact cards: icon + title + format + status badge + CTA. Featured script full-width. Filter pills (All/Feature/Series/Pilot). No coverage quotes on grid (save for detail view).

**`src/components/portfolio/sections/SectionProjects.tsx`** — Credits with proper dark-theme contrast, network badges, role pills.

**`src/components/portfolio/sections/SectionAwards.tsx`** — Minimal layout, result badges (Winner gets accent fill).

**`src/components/portfolio/sections/SectionPress.tsx`** — Publication in accent, pull quotes with left border.

**`src/components/portfolio/sections/SectionTestimonials.tsx`** — Serif quotes, author photos with accent ring.

**`src/components/portfolio/sections/SectionServices.tsx`** — Cards with featured glow treatment.

**`src/components/portfolio/sections/SectionRepresentation.tsx`** — Compact, near top. Rep type in uppercase accent text.

Glass morphism: When `glassEnabled` is true, cards use `backdrop-filter: blur()` with transparent backgrounds. When false, solid `bgSecondary`.

### Phase 4: Demo Page (`DemoScreenwriter.tsx`)

Complete rewrite:
- Default to `cinematic-dark` theme
- **Floating theme switcher** (bottom-right): elegant row of color dots (one per theme, showing `previewColors[0]`), clicking switches theme in real-time. Small label shows current theme name. Only on demo page.
- Representation info displayed prominently near hero
- Compact layout: two-column hero, 3-col script grid, horizontal stats bar
- Discreet "Build Your Own" CTA (outlined, not gradient pill)
- Remove PortfolioBackground grain effects
- Section order optimized: Hero → Representation → Loglines → Script Library → Credits → Awards → Press → Testimonials → Services → Footer

### Phase 5: Public Profile Page (`PublicProfile.tsx`)

- Wrap in `ThemeProvider` using profile's `theme` value
- Support `?preview_theme=xxx` query param for logged-in user previewing
- Load only the selected theme's fonts
- No theme switcher (theme is fixed)
- Compact layout matching demo page structure

### Phase 6: Theme Selector in Settings

Update `SettingsPage.tsx`:
- Replace basic theme dropdown with grid of theme preview cards (3 per row)
- Each card: color swatches row, theme name, description, mini preview (styled divs showing palette), select radio
- "Preview Portfolio" link opens portfolio with `?preview_theme=xxx`
- Save updates `profiles.theme`

### Phase 7: Database

No migration needed — `profiles.theme` column already exists as TEXT. Just ensure new theme keys are used. Old theme values (`ink`, `minimal`, etc.) will be mapped to nearest new theme via a compatibility map in the theme provider.

### Layout Principles (Applied Across All Themes)
- Two-column hero on desktop
- Stats as horizontal bar, not a section
- 3-4 column script grids
- Representation near top
- Target: 2-3 viewport scrolls max for 4-6 scripts
- 44px minimum touch targets on mobile
- Max content width 1080px

### Key Files

**Create:**
- `src/themes/theme-types.ts`
- `src/themes/themes.ts`
- `src/themes/ThemeProvider.tsx`
- `src/components/portfolio/PortfolioCTA.tsx`
- `src/components/portfolio/ThemeSwitcher.tsx` (demo-only floating switcher)

**Major Rewrites:**
- `src/components/portfolio/PortfolioHero.tsx`
- `src/components/portfolio/PortfolioFooter.tsx`
- `src/components/portfolio/PortfolioSection.tsx`
- `src/pages/DemoScreenwriter.tsx`
- `src/pages/PublicProfile.tsx`
- All section components in `src/components/portfolio/sections/`

**Update:**
- `src/lib/themes.ts` (backward compat mapping)
- `src/pages/dashboard/SettingsPage.tsx` (theme selector grid)

### Implementation Order
1. Theme types + all 7 theme definitions + ThemeProvider
2. PortfolioCTA component
3. Rebuild PortfolioHero (two-column, compact, stats bar)
4. Rebuild all section components with CSS variable refs + glass support
5. Rebuild PortfolioFooter
6. Rebuild PortfolioSection heading treatment
7. Rewrite DemoScreenwriter with theme switcher
8. Update PublicProfile for new theme system
9. Update SettingsPage theme selector UI

