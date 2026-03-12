

# Complete Dashboard & Profile Building Overhaul

## Audit Findings

After a thorough code review, here are the critical issues preventing users from building profiles that match the demo quality:

### Critical Bugs (Broken)

1. **Section order mismatch between Settings and Public Profile**: The Settings page manages sections using keys like `projects`, `gallery`, `awards` — but the public profile (`PublicProfile.tsx`) uses keys from the Section Registry like `script_library`, `logline_showcase`, `case_studies`, `results_wall`, `video_portfolio`. When a copywriter's settings save `projects` as visible, the public profile tries to render `writing_samples`, `case_studies`, `results_wall` etc. — which are NOT in the saved section order. Result: **entire sections silently disappear**.

2. **Section visibility defaults break new profiles**: When `rebuildSections` runs on type change, it saves section keys from the registry (e.g. `published_work`, `results_wall`). But the sidebar navigation links to hard-coded routes (`/dashboard/projects`, `/dashboard/awards`) that don't correspond to the registry's semantic sections. The user can manage "projects" but the portfolio renders "writing_samples" — **data exists but never displays**.

3. **Dashboard sidebar doesn't refresh when profile type changes**: `DashboardSidebar` fetches `profile_type` once on mount. Changing type in Settings doesn't trigger a sidebar re-render — stale nav items remain visible, and type-specific items don't appear until full page reload.

4. **`(data as any)` type casting throughout**: `ProfileEditor.tsx` and `SettingsPage.tsx` use `(data as any)` for multiple fields (`headline`, `primary_goal`, `hero_style`, `hero_bg_type`, etc.). This indicates the Supabase types file may be out of sync or the query `select()` doesn't include these columns in the TypeScript type. While not a runtime bug, it masks real type errors and makes refactoring dangerous.

### Major UX Issues

5. **No layout preset selector in dashboard**: The demo profiles showcase 10 layout presets (Cinematic, Magazine, Spotlight, Bento, etc.) but there's no way to select a layout preset from the dashboard. The Settings page only has Theme, Font, and Density — no Layout Preset dropdown.

6. **No hero layout variant selector**: The `PortfolioHero` supports 11 hero layouts, but the dashboard only exposes `hero_style` as a hidden field in `ProfileEditor`. No visual picker for hero variants (split, centered, minimal, etc.).

7. **Section display variants not configurable**: Each portfolio section supports Grid, Carousel, Table, Timeline, Laurels, Masonry variants — but there's no UI to pick which variant a section uses. It's all hardcoded defaults.

8. **Project form doesn't adapt to profile type on open**: The project type dropdown defaults to `"screenplay"` regardless of profile type. A copywriter opening "Add Project" sees `screenplay` as default instead of `case_study` or `writing_sample`.

9. **No way to mark projects as "Notable" (Known For)**: The hero strip shows "Known For" projects, but there's no toggle in ProjectsManager to mark `is_notable`. Users can only remove notables from the live portfolio edit mode.

10. **Social links not visible on public portfolio**: The `SocialLinksManager` saves to `social_links` table, but `PortfolioSection.tsx` has no case for rendering social links. They're collected but never displayed.

11. **Bio section not rendered on portfolio**: The Section Registry lists `bio` as a section for most types, but `PortfolioSection.tsx` has no case for `"bio"`. It falls through to `default: return null`.

12. **Missing portfolio sections for registered keys**: Several section keys in the registry have no rendering case in `PortfolioSection.tsx`:
    - `bio` — no renderer
    - `availability` — no renderer  
    - `staffing_info` — no renderer
    - `diversity_programs` — no renderer
    - `publication_logos` — no renderer (separate from `client_logos`)

### Missing Features

13. **No layout preset picker**: Need a visual grid in Settings showing all 10 layout presets with thumbnails/descriptions. Currently `layout_density` is the only layout control.

14. **No hero variant picker**: Need a visual selector showing the 11 hero layouts (split, centered, cinematic, compact, etc.).

15. **No section variant picker**: Per-section display variant controls (Grid vs Carousel vs Timeline etc.).

16. **No drag-and-drop reorder for projects**: Projects can only be reordered by editing `display_order` manually. All demo profiles show beautifully ordered projects but users have no way to reorder.

17. **No image upload for project posters**: The project form has a `poster_url` text input but no file upload. Users must manually paste URLs.

18. **Gallery images can't be selected as project poster**: No integration between Gallery and Project managers.

---

## Implementation Plan

### Phase 1: Fix Critical Section Rendering (Highest Priority)

**Goal**: Make the public portfolio actually render all sections for all profile types.

1. **Add missing section renderers** in `PortfolioSection.tsx`:
   - `bio` — render the profile's bio text with markdown support
   - `availability` — render actor availability info from `actor_stats`
   - `staffing_info` — render from profile metadata
   - `diversity_programs` — render from a simple text/list field

2. **Fix the section key mapping problem**: The core issue is that `SettingsPage` builds section lists from the registry (correct), but the section keys don't always match what `PortfolioSection.tsx` handles. Audit every key in every profile type config and ensure `PortfolioSection` has a `case` for it.

3. **Social links rendering**: Add a `social_links` case to `PortfolioSection.tsx` that fetches and renders social link icons/URLs.

### Phase 2: Dashboard ↔ Portfolio Alignment

4. **Sidebar reactivity**: Lift `profileType` into a React context or use a Supabase realtime subscription so that changing type in Settings immediately updates the sidebar navigation without a page reload.

5. **Smart project type defaults**: When opening "Add Project", set the default `project_type` based on `profileType`:
   - Copywriter → `writing_sample`
   - Actor → `film`
   - Author → `novel`
   - Journalist → `article`
   - Screenwriter → `screenplay`

6. **Add "Notable" toggle to ProjectsManager**: Add an `is_notable` switch in the project form's "Portfolio Display Options" collapsible. Show a star icon on project cards that are marked notable.

### Phase 3: Layout & Hero Customization

7. **Layout preset selector**: Add a visual grid in Settings showing all 10 layout presets. Save to a new `layout_preset` column (or reuse an existing field). Each preset card shows a miniature wireframe and name.

8. **Hero variant picker**: Add a visual selector in `ProfileEditor.tsx` showing hero layout options with small preview thumbnails. Currently `hero_style` exists but has no picker UI.

### Phase 4: Project & Media UX

9. **Project poster upload**: Add a file upload button next to the poster URL input in ProjectsManager. Upload to `project-images` bucket and set the URL.

10. **Project drag-and-drop reorder**: Add drag handles to project cards using `@dnd-kit/sortable` (already installed). Update `display_order` on drop.

11. **Gallery-to-profile-photo picker**: In ProfileEditor, add a "Choose from Gallery" button that opens a modal showing the user's gallery images, allowing selection as profile photo.

### Phase 5: Section Display Variants

12. **Per-section variant storage**: Add a `section_variants` JSON column to profiles (or reuse `sections_visible` as a richer object). Store variant choices per section key.

13. **Variant picker UI**: In the Settings "Portfolio Sections" card, add a small dropdown next to each section for choosing display variant (Grid, Carousel, Table, etc.).

### Phase 6: Polish & Contextual Guidance

14. **Type-aware empty states**: Update all manager empty states to use `getTypeAwareLabels()` for contextual messaging.

15. **Type-aware PageHeader descriptions**: Pass profile type to PageHeader and show type-specific descriptions.

16. **Sidebar count refresh**: After CRUD operations in managers, trigger a sidebar count refresh.

---

## Technical Notes

- **No database migrations needed** for Phases 1-4. All columns exist. Phase 5 may need a `section_variants jsonb` column.
- The `(data as any)` casting issue is cosmetic — the fields exist in the DB but the auto-generated types may lag. Not blocking.
- Layout preset selection requires mapping preset names to the `PortfolioHero` and layout components that already exist.
- The sidebar reactivity fix is best done with a lightweight React context that both `SettingsPage` and `DashboardSidebar` subscribe to.

## Recommended Implementation Order

1. Phase 1 (section rendering fixes) — makes profiles actually work
2. Phase 2 (dashboard alignment) — makes the editing experience match
3. Phase 4 (project UX) — biggest user pain points
4. Phase 3 (layout/hero pickers) — enables visual customization
5. Phase 5 (section variants) — power user feature
6. Phase 6 (polish) — quality of life

