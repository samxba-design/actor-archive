

# Remaining Gaps to Fix

After auditing the full codebase against the approved plan, here are the items that were **not yet implemented**:

---

## 1. Cross-link Project Selectors in Awards, Press, Events (Plan item E1)

**Gap**: The database tables `awards`, `press`, and `events` all have `project_id` foreign key columns, but none of the manager forms include a project selector dropdown. Users cannot link awards/press/events to specific projects.

**Fix**: In `AwardsManager.tsx`, `PressManager.tsx`, and `EventsManager.tsx`:
- Fetch the user's projects list on mount
- Add a `project_id` Select dropdown in each form dialog with helper text: "Link to a project (optional)"
- Include `project_id` in the save payload

---

## 2. ManagerHelpBanner `portfolioSlug` Not Passed (Plan item E4)

**Gap**: The `ManagerHelpBanner` component supports a `portfolioSlug` prop for a "View on portfolio" link, but none of the 13 manager pages pass it. Users can't jump to their live portfolio from any manager.

**Fix**: In each manager page, fetch the user's slug (or use the `ProfileTypeContext` which likely has it) and pass `portfolioSlug={slug}` to the banner.

---

## 3. Theme Preview in Settings Missing Color Dots for Current Theme (Plan item F3 / B1)

**Status**: Already implemented — the Settings theme picker now shows `previewColors` dot strips. This is done.

---

## 4. Admin Tier Change Already Implemented

**Status**: `AdminUsers.tsx` has `handleChangeTier`, tier dialog, and `Crown` icon in dropdown. Done.

---

## 5. Admin Role for samxba@gmail.com

**Status**: Confirmed in DB — user has `admin` role. Done.

---

## 6. Admin Pro Bypass in useSubscription

**Status**: Already checks `has_role` and returns `pro` for admins. Done.

---

## Summary: 2 Remaining Tasks

| # | Task | Files |
|---|------|-------|
| 1 | Add project_id selector to Awards, Press, Events forms | `AwardsManager.tsx`, `PressManager.tsx`, `EventsManager.tsx` |
| 2 | Pass `portfolioSlug` to all ManagerHelpBanner instances | All 13 manager pages |

### Technical Approach

**Task 1 — Project selector**: Each manager fetches projects via `supabase.from("projects").select("id, title").eq("profile_id", user.id)`. Add a `<Select>` with "None" default + project list. Add `project_id` to form state, interface, and save payload.

**Task 2 — portfolioSlug**: Use the existing `ProfileTypeContext` or fetch slug from profiles. The context already provides `slug` via `useProfileTypeContext()`. Pass it as `portfolioSlug={slug}` on each `<ManagerHelpBanner>`. Check if context exposes slug — if not, add a quick profiles query.

