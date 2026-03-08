

## Comprehensive Improvements & Feature Gaps

After reviewing the full codebase, here's everything needed — organized by priority and user type.

---

### A. Critical Fixes & Missing Functionality

1. **Settings page doesn't save CTA fields** — `handleSave` omits `cta_label`, `cta_url`, `cta_type`, `booking_url` from the update payload (lines 88-99). Users configure CTA but it never persists.

2. **PortfolioSection missing "representation" renderer** — `PortfolioSection.tsx` has no case for `"representation"` in the switch statement, so representation data never renders on public profiles. Need to create `SectionRepresentation.tsx`.

3. **Contact section rendering** — The contact form is in `PortfolioFooter` but `sectionKey === "contact"` in `PortfolioSection` hits the default case and renders nothing. The section order system includes "contact" but it has no effect on placement since it's always in the footer.

4. **No "bio" section renderer** — Several profile types list `"bio"` as a section in the registry, but there's no bio section component. Bio is shown in the hero only. If a user hides it from hero via customization, it disappears entirely.

5. **No storage buckets created** — ProfileEditor uploads to `headshots` and `banners` buckets, GalleryManager to `gallery`. These buckets need to exist in storage. If they weren't created via migration, uploads will fail silently.

---

### B. Per-User-Type Gaps

**Screenwriter / TV Writer / Playwright:**
- No script PDF viewer or download UI on portfolio — `script_pdf_url` and `series_bible_url` exist in projects table but aren't rendered in `SectionProjects`
- No logline showcase section — registry has `logline_showcase` but no renderer; loglines are just a field on projects
- No script library section — `script_library` in registry, no component
- No download-gating (email capture before download) — `access_level` field exists but isn't enforced on public portfolio

**Actor:**
- No actor stats bar on public portfolio — registry has `stats_bar`, no renderer; `actor_stats` data is fetched nowhere in PublicProfile
- No demo reels section — `demo_reels` in registry, no component; video URLs exist on projects but no dedicated reel player
- No `availability` section renderer

**Author:**
- No `bookshelf` section — registry lists it, no component; `purchase_links` jsonb on projects is unused

**Journalist:**
- No `article_feed` section — listed in registry, no component
- No `publication_logos` / `client_logos` section

**Copywriter:**
- No `case_studies` section renderer
- No `writing_samples` section
- No `client_logos` section

**Director/Producer:**
- No `production_history` section renderer (table exists, no UI)

---

### C. Dashboard UX Improvements

1. **No dashboard home/overview** — Landing on `/dashboard` goes straight to ProfileEditor. Add a welcome page with quick stats (views, inbox unread count, published status) and quick action buttons.

2. **No image upload in most managers** — Awards (`laurel_image_url`), press (`image_url`, `publication_logo_url`), testimonials (`author_photo_url`) have image fields but the dashboard managers only have text inputs, no file upload.

3. **No TMDB integration in ProjectsManager** — The edge function exists but ProjectsManager doesn't use it. Users should be able to search TMDB and auto-fill title, poster, director, cast, year, etc.

4. **No reorder UI in most managers** — `display_order` exists on all tables but most managers have no drag/arrow controls.

5. **Empty states** — All managers show nothing when empty. Add illustrated empty states with helper text.

---

### D. Portfolio Presentation Improvements

1. **Section labels aren't contextual** — A screenwriter sees "Projects" instead of "Screenplays". Labels should come from the section registry based on `profile_type`.

2. **No "credits" distinction** — Credits section just filters projects by film/tv_show type but renders identically to projects. Should show a timeline/filmography layout.

3. **No font loading** — Themes reference fonts like Georgia, Courier, Playfair Display but these aren't loaded via Google Fonts. Only system fonts work.

4. **Profile photo/banner upload missing on onboarding** — Users set up everything during onboarding except photos, then have to find the profile editor to add them.

---

### Implementation Plan (Priority Order)

**Phase 1 — Critical fixes (must-fix):**
- Fix Settings page to persist CTA fields
- Create `SectionRepresentation.tsx` for public portfolio
- Create missing section renderers: `stats_bar` (actor stats), `demo_reels` (video player)

**Phase 2 — Writer-focused sections:**
- `SectionScriptLibrary` — cards with PDF download, page count, format, logline
- `SectionLoglineShowcase` — featured loglines with genre tags
- Download gating via email capture modal (uses `email_captures` + `download_logs` tables)

**Phase 3 — Remaining section renderers:**
- `SectionBookshelf` — book covers with purchase links
- `SectionArticleFeed` — filterable article list with publication logos
- `SectionCaseStudies` — challenge/solution/results layout
- `SectionClientLogos` — logo grid
- `SectionProductionHistory` — timeline with theatre/venue info
- `SectionWritingSamples` — categorized samples

**Phase 4 — Dashboard improvements:**
- Dashboard overview/home page with stats
- TMDB search in ProjectsManager
- File upload in Awards, Press, Testimonials managers
- Contextual section labels from registry
- Empty states across all managers

**Phase 5 — Polish:**
- Google Fonts loading for theme fonts
- Photo upload step in onboarding
- Filmography-style credits layout
- Reorder controls in all managers

---

### Technical Details

- All new section components follow the pattern in `SectionAwards.tsx`: receive `items` array, render themed cards using `hsl(var(--portfolio-*))` CSS variables
- Settings CTA fix: add `cta_label`, `cta_url`, `cta_type`, `booking_url` to the `.update()` call
- TMDB integration: use existing `TmdbSearchDropdown` component and `/tmdb-search` edge function
- Font loading: add a `useEffect` in `PublicProfile` that injects a `<link>` tag for the theme's Google Fonts
- Download gating: modal with email input → insert into `email_captures` → return download URL → log to `download_logs`
- Storage buckets may need creation via migration if not already done

