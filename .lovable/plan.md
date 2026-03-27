

# Full Functionality Audit — Bugs & Fixes

## Bug 1: Settings Save Fails (Silent Error)

**Root cause**: `SettingsPage.tsx` line 285 includes `hero_right_content` in the `.update()` call, but this column does NOT exist in the `profiles` table. Supabase rejects unknown columns, so every save attempt returns an error. The error is caught by a toast, but the save silently fails.

**Fix**: Remove `hero_right_content: heroRightContent || "featured"` from the update payload (line 285). Also remove the related state variable `heroRightContent` and the read on line 175 since the column doesn't exist.

## Bug 2: "Scene Interrupted" on Preview

**Root cause**: When a logged-in user navigates to `/p/{slug}`, `PublicProfile.tsx` line 338 passes `heroRightContent={(profile.hero_right_content as any) || 'featured'}` to `PortfolioHero`. While this alone doesn't crash, the PublicProfile interface (line 75) declares `hero_right_content` as a field, but `select("*")` won't return it since the column doesn't exist in the DB. The value comes through as undefined → falls back to `'featured'` → safe.

The actual crash is more likely caused by a **missing `collections` section handler**. When a user's profile has `collections` in their `section_order` array (which can happen after switching to copywriter/journalist/author), `PortfolioSection.tsx` has no `case "collections"` in either the `fetchData` switch or the `renderSection` switch. While currently this returns null (no crash), the standalone `collections` section key is a dead-end.

The most probable crash source is a **stale or corrupted `section_order`** containing keys not handled by the layout renderers (e.g., MagazineLayout, BentoLayout, DashboardLayout), where certain layouts render sections with `allSections.find()` and may pass undefined props.

**Fix**: Add a `case "collections"` handler to `PortfolioSection.tsx` that fetches collections + published works and renders `SectionCollections`. This mirrors the logic already inside the `published_work` case.

## Bug 3: `is_featured` Ghost State in Settings

The form state includes `is_featured: false` (line 138) and reads it from `(data as any).is_featured` (line 228), but the `profiles` table does not have an `is_featured` column. The value always defaults to false and is never saved. It's dead code.

**Fix**: Remove `is_featured` from the form state object and the data reading line.

## Bug 4: Settings Save May Also Fail Because of `is_featured`

Wait — checking line 270-286 again, `is_featured` is NOT in the update payload. Only `hero_right_content` is. So this is dead code, not a crash. Still worth cleaning up.

## Bug 5: `collections` Section Not Fetched or Rendered Independently

The `profileSections.ts` registry now includes `collections` for copywriter, journalist, and author. But `PortfolioSection.tsx`:
- Has no `case "collections"` in the data fetch switch (lines 119-293)
- Has no `case "collections"` in the render switch (lines 394-460)

When a real user's profile has `collections` in `section_order`, nothing renders. The collections data is only loaded as a sub-feature of `published_work`.

**Fix**: Add a `case "collections"` to both switches in `PortfolioSection.tsx` — fetch from `work_collections` + `published_works`, render using `SectionCollections`.

---

## Implementation Plan

| # | Fix | File | Effort |
|---|-----|------|--------|
| 1 | Remove `hero_right_content` from update payload | `SettingsPage.tsx` | Tiny |
| 2 | Remove `heroRightContent` state + read (dead code) | `SettingsPage.tsx` | Tiny |
| 3 | Remove `is_featured` from form state + read (dead code) | `SettingsPage.tsx` | Tiny |
| 4 | Remove `hero_right_content` from PublicProfile interface | `PublicProfile.tsx` | Tiny |
| 5 | Remove `heroRightContent` prop from PortfolioHero call in PublicProfile | `PublicProfile.tsx` | Tiny |
| 6 | Add `case "collections"` fetch + render handler | `PortfolioSection.tsx` | Small |

6 targeted edits across 3 files. No database changes needed.

