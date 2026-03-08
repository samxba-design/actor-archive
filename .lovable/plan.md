

## Plan: Clickable Projects, "Known For" + Client Logos, Glass Shine Fix, Enhanced Project Editor

This plan covers 6 workstreams: (1) making images/projects clickable with IMDb links, (2) fixing the featured project logline font, (3) enabling glass shine on all themes, (4) creating "Known For" and "Client Logo" sections, (5) integrating them into all 10 layouts, and (6) upgrading the ProjectsManager form with guided advanced fields.

---

### 1. Featured Project Font Fix
**File:** `src/components/portfolio/PortfolioHero.tsx` (lines 366-374)

Change the featured project logline from `fontLogline`/`loglineStyle` (italic serif) to `fontBody`/`normal`. Italic serifs at 12px are hard to read in a compact card context.

---

### 2. Glass Shine on All Themes
**File:** `src/components/portfolio/GlassCard.tsx` (line 13)

Remove the `glassEnabled` conditional for the shine class -- always apply `glass-shine-card`. The CSS already handles the subtle sweep; non-glass themes just get it as a decorative touch.

```tsx
// Before
const shineClass = theme.glassEnabled ? "glass-shine-card" : "";
// After
const shineClass = "glass-shine-card";
```

---

### 3. Make Projects/Posters/Featured Clickable
**Files:** `SectionProjects.tsx`, `PortfolioHero.tsx`, `DemoScreenwriter.tsx`

- **PosterCard**: Wrap the entire card in an `<a>` tag linking to `project.imdb_link` (or no link if absent). On hover, show a subtle external-link icon.
- **CreditRow**: The existing IMDb link icon already works; keep it.
- **ProjectCard**: Same wrapping approach.
- **Featured project in hero**: Make the poster image and title clickable, linking to `imdb_link`.
- **CreditHeroCard** (Classic layout): Wrap backdrop image in a link to `imdb_link`.

The link destination is `imdb_link` from the project data. If absent, the card remains static (no dead links).

---

### 4. Create "Known For" Section
**New file:** `src/components/portfolio/sections/SectionKnownFor.tsx`

A horizontal row of 2:3 poster cards (up to 6) for key productions. Each card:
- Poster image fills the card
- Title + role below on solid background (same pattern as redesigned PosterCard)
- Clickable -- links to `imdb_link`
- On mobile: horizontal scroll

Props: `items` (array of projects with poster_url, title, role_name, imdb_link), `variant` (`'strip' | 'grid'`).

**Mock data** in `DemoScreenwriter.tsx`: reuse `mockCredits` items (they already have poster URLs).

---

### 5. Create "Client/Company Logo" Section
**New file:** `src/components/portfolio/sections/SectionClientLogos.tsx`

Displays company logos using the existing `CompanyLogo` component (Clearbit). Three variants:
- **bar**: Horizontal row of grayscale logos, colorize on hover, company name below each
- **grid**: 3-4 column grid with logo + name
- **marquee**: Auto-scrolling horizontal ticker (CSS animation)

Props: `companies` (string array), `variant` (`'bar' | 'grid' | 'marquee'`).

**Mock data:** `["HBO", "FX", "A24", "NBC", "Netflix", "Amazon Studios"]`

---

### 6. Integrate Into All 10 Layouts
**File:** `src/pages/DemoScreenwriter.tsx`

Add `mockKnownFor` and `mockClients` data. Each layout gets both sections with different visual treatments:

| Layout | Known For | Client Logos |
|---|---|---|
| Classic | Poster strip after hero stats | Logo bar above footer sections |
| Standard | Poster strip in sidebar | Logo bar above credits |
| Cinematic | Full-width large poster strip | Marquee ticker |
| Compact | Small inline thumbnails | Logo bar compact |
| Magazine | Poster strip in main column | Logo grid in sidebar |
| Spotlight | Accordion section | Logo bar at top |
| Timeline | Poster strip at top year | Logo bar |
| Bento | 2-col bento tile | Logo grid tile |
| Minimal | Simple text + small posters | Hidden (minimal) |
| Dashboard | Poster strip with stat overlay | Logo grid card |

Also add Known For to the hero component itself (between stats bar and body) as a compact poster strip.

---

### 7. Upgrade ProjectsManager Form with Guided Advanced Fields
**File:** `src/pages/dashboard/ProjectsManager.tsx`

The current form is missing many fields that exist in the `projects` table. Add them in a collapsible "Advanced Settings" section with helper text so users discover customization features:

**New fields to add:**
- `imdb_link` -- "Add your IMDb link so visitors can click through to the full page"
- `network_or_studio` -- "e.g. HBO, A24, Netflix -- displays as a badge on your portfolio"
- `is_featured` -- Toggle: "Feature this project prominently on your portfolio"
- `custom_image_url` -- "Upload a custom image instead of using TMDB poster"
- `backdrop_url` -- "Widescreen banner image for featured display"
- `role_type` -- "e.g. Season 2, Episode 5 -- shown alongside your credit"
- `format` -- "e.g. Feature, Pilot, Limited Series"
- `production_company` -- "Production company name"

Group these under a collapsible "Portfolio Display Options" section with a brief intro: "These settings control how your project appears on your public portfolio. Add links, images, and metadata to make your work stand out."

Each field gets a brief description/placeholder guiding the user.

---

### Files Summary

| File | Action |
|---|---|
| `src/components/portfolio/PortfolioHero.tsx` | Fix logline font; add Known For strip; make featured project clickable |
| `src/components/portfolio/GlassCard.tsx` | Remove glassEnabled conditional for shine |
| `src/components/portfolio/sections/SectionProjects.tsx` | Make PosterCard/ProjectCard clickable via imdb_link |
| `src/components/portfolio/sections/SectionKnownFor.tsx` | **NEW** -- horizontal poster strip |
| `src/components/portfolio/sections/SectionClientLogos.tsx` | **NEW** -- logo bar/grid/marquee |
| `src/pages/DemoScreenwriter.tsx` | Add mock data; integrate Known For + Client Logos into all 10 layouts |
| `src/pages/dashboard/ProjectsManager.tsx` | Add advanced fields section (imdb_link, network, is_featured, images, etc.) with guided helper text |
| `src/index.css` | Add marquee animation keyframes for client logo ticker |

