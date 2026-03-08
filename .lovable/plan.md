

## Advanced Customization & Link/Embed Support Audit

### Current State

**Customization features implemented:**
- 10 themes with CSS custom properties (colors, fonts, border-radius)
- Custom accent color picker
- Section reorder + visibility toggles
- CTA button with 4 types (contact form, calendar, email, custom URL)
- Booking modal for Calendly/Cal.com embeds

**Customization features NOT implemented (DB columns exist but unused):**
- `font_pairing` — column exists, no UI or rendering logic
- `layout_density` — column exists (`spacious` default), no UI or rendering logic
- `custom_css` — column exists, never injected into the portfolio
- `custom_domain` — column exists, no setup flow

**Link & embed support:**
- YouTube/Vimeo embeds work in Demo Reels section only
- IMDb links on project cards
- Social links (IMDb, Instagram, X, LinkedIn, YouTube, etc.) in hero and footer
- Purchase links on bookshelf items
- Article URLs on article feed cards
- Script PDF download links in script library
- Booking URL embeds via iframe modal
- Video URLs on projects used for demo reels filtering
- QR code + embed iframe in Embed & Share page

**Link/embed gaps:**
- No video embed on individual project cards (only in demo_reels section)
- No rich link previews anywhere (paste a URL, show title + thumbnail)
- Bio field is plain text — no markdown or links support
- Project descriptions are plain text — no links or formatting
- No way to add external links to press items beyond `article_url`
- SectionProjects doesn't link to project detail/pitch pages
- No trailer embed on project cards despite `video_url` existing

---

### Implementation Plan

#### 1. Font Pairing Selector (Settings)
Add a font pairing dropdown to SettingsPage with 5-6 curated pairs (e.g., "Inter/Inter", "Georgia/Inter", "Playfair Display/Source Sans", "DM Serif Display/DM Sans", "Space Grotesk/Inter"). Save to `font_pairing`. In PublicProfile, override `--portfolio-heading-font` and `--portfolio-body-font` from the pairing, overriding the theme default. Load Google Fonts dynamically.

**Files:** `src/pages/dashboard/SettingsPage.tsx`, `src/pages/PublicProfile.tsx`, `src/lib/themes.ts` (add font pairings map)

#### 2. Layout Density Toggle (Settings)
Add a 3-option toggle: Compact / Default / Spacious. Controls spacing multiplier applied to portfolio sections. Save to `layout_density`. Apply via CSS variable `--portfolio-spacing` on the container.

**Files:** `src/pages/dashboard/SettingsPage.tsx`, `src/pages/PublicProfile.tsx`

#### 3. Custom CSS Editor (Settings)
Add a code textarea in Settings for advanced users. Save to `custom_css`. Inject as a `<style>` tag inside the portfolio container with scoping.

**Files:** `src/pages/dashboard/SettingsPage.tsx`, `src/pages/PublicProfile.tsx`

#### 4. Video Embeds on Project Cards
SectionProjects currently shows images but ignores `video_url`. Add a play button overlay on project cards that have a `video_url` — clicking opens an inline YouTube/Vimeo embed or links out. Reuse `extractYouTubeId`/`extractVimeoId` from `videoEmbed.ts`.

**Files:** `src/components/portfolio/sections/SectionProjects.tsx`

#### 5. Link Project Cards to Pitch Pages
SectionProjects cards don't link anywhere. When a project has `project_slug`, wrap the card in an `<a>` linking to `/p/{profileSlug}/{projectSlug}`.

**Files:** `src/components/portfolio/sections/SectionProjects.tsx`, needs profile slug passed down (add prop or context)

#### 6. Rich Text Bio with Links
Convert bio from plain `<p>` to support basic inline links and bold/italic via a lightweight markdown renderer (detect `[text](url)`, `**bold**`, `*italic*`). No external dependency — simple regex replacer.

**Files:** `src/components/portfolio/PortfolioHero.tsx` (bio rendering), create `src/lib/simpleMarkdown.ts`

#### 7. Video Embed in Bookshelf/Article Sections
SectionBookshelf and SectionArticleFeed items can have `video_url` but don't render embeds. Add optional video embed or trailer button for books with trailers and articles with accompanying video.

**Files:** `src/components/portfolio/sections/SectionBookshelf.tsx`, `src/components/portfolio/sections/SectionArticleFeed.tsx`

---

### Summary of Files

**Create:**
- `src/lib/simpleMarkdown.ts` — lightweight markdown-to-HTML for bios
- `src/lib/fontPairings.ts` — font pairing definitions

**Edit:**
- `src/pages/dashboard/SettingsPage.tsx` — add font pairing, layout density, custom CSS
- `src/pages/PublicProfile.tsx` — apply font pairing, layout density, inject custom CSS
- `src/components/portfolio/PortfolioHero.tsx` — render bio with simple markdown
- `src/components/portfolio/sections/SectionProjects.tsx` — video overlay + pitch page links
- `src/components/portfolio/sections/SectionBookshelf.tsx` — optional video/trailer button
- `src/components/portfolio/sections/SectionArticleFeed.tsx` — optional video embed

