

## Full Audit: Bugs, Missing Functionality, and Improvements

### BUGS & FIXES

**1. ProjectPitchPage device_type always "mobile" or "tablet", never "desktop"**
Line 57: `device_type: window.innerWidth < 768 ? "mobile" : "tablet"` — missing the desktop case. Should match the same logic used in PublicProfile.tsx (which correctly includes desktop).

**2. Signup navigates to /onboarding before email confirmation**
After `supabase.auth.signUp()`, the code navigates to `/onboarding` immediately (line 57). But email confirmation is required (not auto-confirm). The user won't have a valid session yet, so ProtectedRoute will bounce them to /login. Should show a "check your email" state instead of navigating.

**3. PublicProfile missing `headline` in ProfileData interface**
The `ProfileData` interface (line 11-35) doesn't include `headline`, so PortfolioHero won't receive it even though the column exists. The `select("*")` fetches it but the type-cast drops it.

**4. SettingsPage uses `as any` casts for cta_label, cta_url, cta_type, booking_url**
These fields exist in the DB but the types file may not reflect them, causing unsafe casts. Similar issue in ProfileEditor with `headline` and `primary_goal`.

**5. ProtectedRoute doesn't redirect to onboarding for new users**
After signup + email confirm, users land on `/dashboard` but may not have completed onboarding. Should check `onboarding_completed` and redirect to `/onboarding` if false.

**6. Login redirects to /dashboard but Google OAuth callback also goes to /dashboard**
Google-signed-up users skip onboarding entirely since they go straight to dashboard.

**7. Console warning: FeatureCard and ThemeShowcase given refs**
`useInView` hook likely passes refs to function components that don't use `forwardRef`. Minor but visible in console.

### MISSING FUNCTIONALITY

**8. No dashboard home/overview page**
Dashboard index route goes directly to ProfileEditor. Should have a home dashboard showing: profile readiness, recent views, unread inbox count, pipeline summary.

**9. No way to set `project_slug` from ProjectsManager**
The `ProjectPitchPage` route exists (`/p/:slug/:projectSlug`) but the ProjectsManager form doesn't include a `project_slug` field, so pitch pages are unreachable.

**10. No delete account or change password in Settings**
SettingsPage has no account management section. Users can't change password or delete their account from within the app.

**11. No mobile-responsive sidebar**
DashboardLayout uses the sidebar component but there's no mobile menu/drawer treatment visible. On small screens the sidebar may overlap or be inaccessible.

**12. No loading/empty states for many sections**
Several portfolio sections (SectionCaseStudies, SectionWritingSamples, etc.) may not handle empty data gracefully — showing blank space instead of hiding the section.

**13. Contact form missing subject field**
PortfolioFooter contact form only captures name, email, message — no subject or subject_type, even though the DB supports it.

**14. No auto-responder functionality**
The `profiles` table has `auto_responder_enabled` and `auto_responder_message` columns but there's no UI to configure them, and no backend trigger to send auto-responses.

**15. Analytics limited to 1000 rows**
AnalyticsOverview fetches with `.limit(1000)` — for popular profiles this undercounts. Should use a server-side aggregation approach.

**16. No way to manage `section_order` for new section types**
SettingsPage ALL_SECTIONS list is hardcoded and missing many section types defined in profileSections.ts (demo_reels, logline_showcase, script_library, bookshelf, article_feed, case_studies, production_history, writing_samples, stats_bar, representation). Users can't reorder or toggle these.

### IMPROVEMENTS

**17. Onboarding should check if already completed**
If a user visits `/onboarding` after completing it, they go through the whole flow again with no guard. Should redirect to `/dashboard` if `onboarding_completed` is true.

**18. ProfileEditor should save `headline` in the save handler**
Currently `handleSave` doesn't include `headline` or `primary_goal` in the update object (lines 82-92), so these fields are never persisted after initial edit.

**19. Sidebar should be profile-type-aware**
All users see all sidebar items (Coverage Simulator, Comp Matcher, etc.) regardless of profile type. Writers don't need actor-specific tools and vice versa.

**20. No unsaved changes warning**
ProfileEditor and SettingsPage have no dirty-state tracking. Navigating away loses changes silently.

**21. Slug uniqueness not validated client-side**
Both onboarding StepSlug and SettingsPage accept any slug without checking if it's already taken before save.

---

### Implementation Plan

#### Phase A: Critical Fixes (highest priority)

1. **Fix signup flow** — After signup, show confirmation message and stay on signup page. Don't navigate to /onboarding until email is confirmed.
2. **Fix ProtectedRoute** — Add onboarding check: if user exists but `onboarding_completed` is false, redirect to `/onboarding`. If on `/onboarding` and already completed, redirect to `/dashboard`.
3. **Fix ProfileEditor save** — Add `headline` and `primary_goal` to the update payload.
4. **Fix PublicProfile ProfileData interface** — Add `headline` field.
5. **Fix ProjectPitchPage device_type** — Add desktop case.
6. **Add `project_slug` field to ProjectsManager** — Auto-generate from title, editable.

#### Phase B: Missing Core Features

7. **Dashboard home page** — New component showing profile readiness widget, recent views count, unread inbox count, and pipeline status summary. Make this the index route, move ProfileEditor to `/dashboard/profile`.
8. **Sync SettingsPage ALL_SECTIONS with profileSections.ts** — Dynamically build section list based on user's profile type.
9. **Add auto-responder config UI** — In SettingsPage, add toggle and message textarea for auto-responder. Create edge function or DB trigger to send auto-response email on new contact submission.
10. **Add contact form subject field** — Add subject dropdown to PortfolioFooter contact form.

#### Phase C: Polish & UX

11. **Fix forwardRef warnings** — Wrap FeatureCard and ThemeShowcase with `forwardRef` in Index.tsx.
12. **Add unsaved changes warning** — Track dirty state in ProfileEditor and SettingsPage, warn on navigation.
13. **Profile-type-aware sidebar** — Filter sidebar nav items based on user's `profile_type`.
14. **Add change password to Settings** — Simple form calling `supabase.auth.updateUser`.
15. **Improve analytics with server-side aggregation** — Create an edge function or DB view for aggregated analytics to handle >1000 views.

### Files to Edit
- `src/pages/Signup.tsx` — fix post-signup flow
- `src/components/ProtectedRoute.tsx` — add onboarding redirect
- `src/pages/dashboard/ProfileEditor.tsx` — fix save payload
- `src/pages/PublicProfile.tsx` — fix ProfileData interface
- `src/pages/ProjectPitchPage.tsx` — fix device_type
- `src/pages/dashboard/ProjectsManager.tsx` — add project_slug field
- `src/pages/dashboard/SettingsPage.tsx` — sync sections, add auto-responder, add change password
- `src/components/dashboard/DashboardSidebar.tsx` — profile-type-aware filtering
- `src/components/portfolio/PortfolioFooter.tsx` — add subject field
- `src/pages/Index.tsx` — fix forwardRef warnings
- `src/pages/Dashboard.tsx` — add home route, move profile editor

### Files to Create
- `src/pages/dashboard/DashboardHome.tsx` — overview/home page

### Database Migration
```sql
-- No schema changes needed, all columns already exist
```

