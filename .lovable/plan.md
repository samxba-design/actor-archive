

# Dark Charcoal Glass Theme + Portfolio Showcase Overhaul

## Overview

Three interconnected improvements: (1) reduce hero head space across all profiles, (2) create a new premium "Charcoal Glass" theme as the copywriter default, and (3) massively upgrade the portfolio showcase system with multiple display modes, customizable columns, and enhanced content ingestion — then extend it across all relevant profile types.

---

## 1. Reduce Hero Head Space (All Profiles)

**Problem**: All 17 themes have `heroHeight` set between 72vh-90vh, creating excessive empty space above the name/content block which sits at `bottom-left`.

**Fix**: Reduce `heroHeight` across all themes by ~10-15vh (e.g. 85vh→70vh, 80vh→65vh, 75vh→62vh). This tightens the hero without losing its visual impact. Compact layout stays at 280px.

**File**: `src/themes/themes.ts` — all 17 theme objects.

---

## 2. New "Charcoal Glass" Theme

A premium dark charcoal theme with glassmorphism enabled by default. Designed for writers and professionals who want sophistication without the "cinematic" drama.

**Palette**:
- Background: `#1A1A1F` (warm charcoal, not pure black)
- Secondary: `#222228`, Elevated: `#2A2A32`
- Text: `#E8E6E3` primary, `#9A9898` secondary
- Accent: `#7C8CF8` (soft periwinkle-blue — professional, not flashy)
- Glass: enabled, subtle frosted blur with fine white border
- Typography: `'Plus Jakarta Sans'` display + `'Inter'` body — modern, clean
- Cards: 10px radius, subtle glass background, gentle hover glow
- CTA: `filled-subtle` with rounded corners
- Hero: 65vh, compact but impactful
- Section dividers: gradient, subtle
- Animations: moderate parallax, smooth transitions

**File**: `src/themes/themes.ts` — add `charcoalGlass` object + register in `portfolioThemes`.

**Set as copywriter default**: `src/pages/DemoCopywriter.tsx` — change `useState("ocean-blue")` to `useState("charcoal-glass")`.

---

## 3. Portfolio Showcase System Overhaul

### 3a. New Display Modes for `SectionPublishedWork`

Currently supports 3 variants: `magazine`, `grid`, `list`. Add these new modes:

| Mode | Description |
|------|-------------|
| `card` | Rich cards with image, title, stats (read time, publication), category badge, summary snippet |
| `compact` | Slim horizontal rows — small thumbnail + title + publication + date. Dense, scannable |
| `text-only` | No images. Clean typographic list with title, publication, date, category. Minimal |
| `visual` | Large square/rectangular image tiles with title overlay, dynamic blur on hover |
| `mosaic` | Pinterest-style masonry with mixed image aspect ratios |

### 3b. Customizable Column Count

Add a `columns` prop (1-5) to `SectionPublishedWork`. Default varies by variant:
- `visual`/`grid`/`mosaic`: 3 columns
- `card`: 2 columns  
- `compact`/`text-only`/`list`: 1 column
- `magazine`: featured full-width + 3-col grid

Users can override via the dashboard settings or live customizer.

### 3c. Image Aspect Ratio Options

Add `aspectRatio` prop: `square` (1:1), `landscape` (16:9), `portrait` (3:4), `wide` (2:1). Applied to image containers in `grid`, `card`, and `visual` modes.

### 3d. Featured Image Sources

Each published work item already supports `cover_image_url` and `pdf_thumbnail_url`. Enhance the system to support:

- **Custom upload**: Already exists
- **Auto-extract from PDF**: Already exists via `pdf_thumbnail_url`
- **Auto-extract from link**: Add OG image scraping — when a user pastes an article URL, attempt to pull `og:image`, title, and description from it. Use the existing `scrape-profile-url` edge function pattern to add a lightweight `scrape-article-meta` function
- **AI-generated**: Add an "AI Generate Cover" button that uses the writing-assist edge function to generate a prompt, then the AI image generation skill to create a themed cover image
- **Text preview**: For text-only pieces, auto-generate a styled preview card showing the first ~50 words as a visual

### 3e. Content Input Methods

The `PublishedWorkManager` currently supports PDF upload and article URL. Add:

- **Paste as text**: A textarea where users can paste article content directly. Stored in a new `content_text` column on `published_works`
- **Link metadata auto-pull**: When pasting a URL, auto-fetch title, description, OG image, and publication name. Pre-fill form fields
- **Document upload**: Accept `.doc`/`.docx` in addition to PDF

**Database migration**: Add `content_text TEXT` and `content_type TEXT DEFAULT 'link'` columns to `published_works`.

### 3f. Variant Toggle in Demo + Live Customizer

Add `publishedWork` to `SectionVariants` with options for all display modes. Wire into `DemoCustomizationPanel` and `LiveCustomizePanel`.

---

## 4. Cross-Profile Extension

### Profile-Type Terminology

| Profile Type | Section Label | What "Pieces" Are Called |
|---|---|---|
| Copywriter | Portfolio | Pieces |
| Journalist | Published Work | Articles |
| Author | Published Work | Publications |
| Screenwriter | Writing Samples | Scripts & Samples |
| TV Writer | Writing Samples | Scripts & Samples |
| Playwright | Published Work | Scripts & Publications |
| Corporate/Video | Portfolio | Projects |
| Director/Producer | Portfolio | Projects |

The section already exists for most types via `published_work` in the section registry. The new display modes and features are renderer-level, so they automatically apply everywhere `SectionPublishedWork` is used.

### Demo Pages

- **DemoScreenwriter**: Already has published work section. Will benefit from new `compact` and `text-only` modes
- **DemoActor**: Add a lightweight portfolio section showing demo reels and headshot galleries (already has `demo_reels` and `gallery` sections — no new section needed, just ensure the showcase variants are available)
- **DemoCopywriter**: Showcase the `visual` mode by default with the new charcoal-glass theme

---

## Implementation Order

| # | Task | Files | Effort |
|---|------|-------|--------|
| 1 | Reduce heroHeight across all 17 themes | `themes.ts` | Small |
| 2 | Create charcoal-glass theme | `themes.ts` | Medium |
| 3 | Set charcoal-glass as copywriter demo default | `DemoCopywriter.tsx` | Tiny |
| 4 | Add 5 new display modes to SectionPublishedWork | `SectionPublishedWork.tsx` | Large |
| 5 | Add columns + aspectRatio props | `SectionPublishedWork.tsx` | Medium |
| 6 | Add content_text + content_type columns | DB migration | Tiny |
| 7 | Add text paste + link auto-pull to PublishedWorkManager | `PublishedWorkManager.tsx` | Medium |
| 8 | Add publishedWork variant to customization panel | `DemoShared.tsx`, `DemoCustomizationPanel.tsx` | Small |
| 9 | Wire new variants into demo pages | `DemoCopywriter.tsx`, `DemoScreenwriter.tsx` | Small |

Total: ~5 core files + 1 DB migration. The new display modes and charcoal theme are the biggest pieces.

