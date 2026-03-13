

# Admin Demo Profile Customization + User Poster/Logo Browser

This is a large feature with two distinct parts. Here's the plan:

## Part 1: Admin Demo Profile Editor

### Problem
Demo profile data (screenwriter, actor, copywriter) is hardcoded in `src/data/demo*Data.ts` files. Admins cannot edit any content, images, layout defaults, or section visibility without code changes.

### Solution
Store demo profile configurations in the `platform_settings` table (already exists with admin-only RLS) and create a new admin page to edit them.

**Database**: No schema changes needed — `platform_settings` already stores JSON values with admin-only RLS. We'll store one setting per demo profile (keys: `demo_screenwriter`, `demo_actor`, `demo_copywriter`) containing all mock data as JSON.

**New file: `src/pages/admin/AdminDemoProfiles.tsx`**
- Tab-based editor for each demo profile type (Screenwriter, Actor, Copywriter)
- Editable fields for: profile info (name, tagline, bio, photo URL, banner URL), CTA config, social links
- Section-by-section editors: credits/projects (with poster URL fields), client logos list, awards, testimonials, press, etc.
- Image fields use URL inputs with live preview thumbnails
- For poster images: integrate TMDB search inline so admin can search and pick posters visually
- For company logos: show the existing `CompanyLogoLibrary` component for visual selection
- Layout defaults: theme, layout preset, hero variant, known-for position, CTA style
- "Reset to Defaults" button per profile to restore hardcoded data
- Save writes JSON to `platform_settings` table

**Update `src/data/demo*Data.ts` files**: Export a hook `useDemoData(profileType)` that first checks `platform_settings` for admin overrides, falls back to hardcoded defaults. Each demo page imports this hook instead of raw constants.

**Update demo pages** (`DemoScreenwriter.tsx`, `DemoActor.tsx`, `DemoCopywriter.tsx`): Replace direct data imports with the hook.

**Add route + nav**: Add `/admin/demo-profiles` route in `App.tsx`, add "Demo Profiles" nav item in `AdminSidebar.tsx`.

### Files
| File | Change |
|------|--------|
| `src/pages/admin/AdminDemoProfiles.tsx` | New — full demo profile editor |
| `src/hooks/useDemoData.ts` | New — hook to load admin overrides from platform_settings, fallback to hardcoded |
| `src/pages/DemoScreenwriter.tsx` | Use `useDemoData('screenwriter')` instead of direct imports |
| `src/pages/DemoActor.tsx` | Use `useDemoData('actor')` instead of direct imports |
| `src/pages/DemoCopywriter.tsx` | Use `useDemoData('copywriter')` instead of direct imports |
| `src/components/admin/AdminSidebar.tsx` | Add "Demo Profiles" nav item |
| `src/App.tsx` | Add `/admin/demo-profiles` route |

---

## Part 2: User-Facing Visual Poster & Logo Browser

### Problem
Users can add projects and client logos, but changing poster images requires manually entering TMDB IDs or URLs. Client logos use a library but the Projects manager doesn't have a visual poster picker.

### Solution

**A. Poster Browser for Projects Manager**

New component: `src/components/dashboard/PosterBrowser.tsx`
- Modal dialog triggered from the project edit form's poster field
- TMDB search integrated (reuses existing `tmdb-search` edge function)
- Shows poster grid with thumbnails — click to select
- Search by title, shows movie/TV results with poster previews
- Selected poster URL auto-fills the project's `poster_url` field
- Also allow manual URL input as fallback

**Update `src/pages/dashboard/ProjectsManager.tsx`**:
- Add a "Browse Posters" button next to the poster URL input
- Opens `PosterBrowser` modal
- On selection, sets `poster_url` (and optionally `backdrop_url`) in the form

**B. Enhanced Company Logo Selection in Client Manager**

The `CompanyLogoLibrary` already exists and works well. Enhancements:
- In `ClientManager.tsx`, when user types a company name in the add/edit form, show auto-suggestions from `COMPANY_DOMAINS` with logo previews
- Add a prominent "Browse Library" button that opens the existing `CompanyLogoLibrary`
- When adding from library, auto-populate logo URL

**Update `src/pages/dashboard/ClientManager.tsx`**:
- Add inline auto-suggest dropdown on company name input showing matching logos
- Make "Browse Library" button more prominent in the add dialog

### Files
| File | Change |
|------|--------|
| `src/components/dashboard/PosterBrowser.tsx` | New — visual TMDB poster search/select modal |
| `src/pages/dashboard/ProjectsManager.tsx` | Add "Browse Posters" button, integrate PosterBrowser |
| `src/pages/dashboard/ClientManager.tsx` | Add inline auto-suggest with logo previews on name input |

---

## Implementation Order
1. Create `useDemoData` hook + admin demo profiles page (backend-first)
2. Wire demo pages to use the hook
3. Build PosterBrowser component
4. Enhance ProjectsManager and ClientManager with visual pickers
5. Add admin route and sidebar nav

