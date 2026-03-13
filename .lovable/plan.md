

# Remaining Audit Items — Status & Plan

## Already Done ✅
| # | Item | Status |
|---|------|--------|
| 1 | Visual How It Works page | ✅ Redesigned |
| 2 | FAQ page | ✅ Created at `/faq` |
| 8 | Settings split into tabs | ✅ Tabbed layout |
| 14 | Account deletion (auth user) | ✅ Edge function created |
| 12 | OG image wiring | ✅ `og:image` set from profile photo |
| 16 | robots.txt sitemap URL | ✅ Points to edge function |

## Still Needs Implementation

### Priority 1: Tour state persistence (#5) — Small
- Add `tour_completed_at` column to `profiles` table
- Update `GettingStartedGuide.tsx` to read/write from DB instead of `localStorage`
- Add "Replay Tour" button in dashboard header help menu

### Priority 2: Onboarding skip fix (#7) — Small
- In `Onboarding.tsx`, disable the Skip button on Steps 1-2 (profile type + basic info) since these are required
- For later steps, save whatever partial data exists before marking onboarding complete

### Priority 3: Contact form rate limiting (#15) — Small
- Add a simple client-side rate limiter (max 3 submissions per 5 minutes using sessionStorage timestamp tracking)
- Add a honeypot hidden field to catch bots
- Optionally add server-side IP-based rate limiting in the contact-notify edge function

### Priority 4: Contextual empty states (#6) — Medium
- Audit all manager pages for missing/generic empty states
- Update `EmptyState` component calls to include profile-type-aware descriptions explaining why each section matters
- Key pages: ProjectsManager, GalleryManager, TestimonialsManager, AwardsManager, ScriptManager, ServicesManager

### Priority 5: Destructive action confirmations (#9) — Small
- Audit publish/unpublish toggles, bulk operations, and individual delete buttons across all managers
- Ensure `useDeleteConfirmation` hook is used consistently

### Priority 6: Data export improvements (#10) — Small
- The export button exists in Settings but verify it exports ALL content types (projects, scripts, testimonials, awards, education, events, press, services, skills, contacts, gallery)

### Priority 7: Soft-delete / undo (#11) — Medium
- Add toast-with-undo pattern: on delete, show a toast with "Undo" button that re-inserts the row within 5 seconds
- Apply to ProjectsManager, TestimonialsManager, AwardsManager, and other content managers
- This is lighter than a full soft-delete system and gives immediate value

## Not in original priority list but flagged
- **OG image could use the edge function** instead of just profile photo (richer social cards)
- **Changelog / What's New (#18)** — low priority, skip for now
- **Mobile responsive audit (#19)** — worth a pass but lower priority

## Recommended implementation order
1. Tour persistence + Onboarding skip fix (quick DB + UI changes)
2. Contact form rate limiting + honeypot (security)
3. Undo-on-delete toast pattern (apply to 4-5 managers)
4. Contextual empty states (content polish)
5. Destructive action audit (consistency)

Total effort: ~5-6 implementation steps, mostly small.

