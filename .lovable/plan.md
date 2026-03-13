

# Poster Picker Upgrade — Multi-Variant Poster Selection

## Current State vs Spec

**What we already have (working well):**
- `tmdb-search` edge function with TMDB API proxy, caching in `tmdb_cache`, search + detail modes
- `PosterBrowser` dialog with search, movie/TV toggle, poster grid, manual URL fallback
- `TmdbSearchDropdown` inline autocomplete for title lookup
- Integration in `ProjectsManager` with Browse button, Upload button, and manual URL input

**The key gap:** Our current flow returns ONE poster per title (the default TMDB poster). The described spec fetches ALL available poster variants per title via TMDB's `/images` endpoint, giving users 4-8 poster choices per movie/TV show at multiple resolutions. This is the main missing piece.

## Plan

### 1. Upgrade Edge Function to Return Poster Variants

**File: `supabase/functions/tmdb-search/index.ts`**

Add a new mode triggered by `?id=X&type=Y&images=true` (or always include images when fetching by ID):

- After fetching detail from TMDB, also call `/${mediaType}/${id}/images?api_key=...` endpoint
- Extract up to 8 poster entries from `response.posters[]`, each with:
  - `url_small`: `w185` size (for thumbnail grid)
  - `url_medium`: `w342` size (for storage)
  - `url_large`: `w500` size (for high-res display)
- Extract up to 4 backdrop entries from `response.backdrops[]`
- Return these in the response as `poster_variants[]` and `backdrop_variants[]` alongside existing fields
- Cache the variants in the existing `tmdb_cache` entry (store in `raw_data` or add a `poster_variants` jsonb column)

### 2. Upgrade PosterBrowser to Show Variant Grid

**File: `src/components/dashboard/PosterBrowser.tsx`**

Change the UX from "click a title → auto-select its single poster" to a two-step flow:

**Step 1 — Title results** (current grid stays but clicking now expands):
- Clicking a title card fetches detail + poster variants
- The selected title expands into an inline panel showing all poster variants in a grid (4-6 columns)

**Step 2 — Pick a poster variant:**
- Each variant shows as a clickable thumbnail (`url_small`)
- Clicking a variant immediately selects it, passing `url_medium` as `poster_url` and `url_large` as a high-res option
- Also shows backdrop variants below with a "Use as backdrop" option
- A "Back to results" button returns to the title list

Keep the manual URL tab unchanged.

### 3. No Changes Needed to ProjectsManager Integration

The existing `onSelect` callback interface already accepts `poster_url` and `backdrop_url`. The upgraded PosterBrowser just provides better poster options — no changes needed to the integration point.

### Files Summary

| File | Change |
|------|--------|
| `supabase/functions/tmdb-search/index.ts` | Add `/images` API call when fetching by ID, return `poster_variants[]` and `backdrop_variants[]` with multi-resolution URLs |
| `src/components/dashboard/PosterBrowser.tsx` | Two-step flow: title search → expand to show all poster variants in a nested grid, click any variant to select |

