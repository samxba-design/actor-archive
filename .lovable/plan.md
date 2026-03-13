

# Comprehensive UX & Feature Improvement Plan

This is a large, multi-faceted request covering 7 major areas. Here's the complete breakdown.

---

## A. Profile Readiness — Interactive Deep Links

**Current state**: Each checklist item shows a label + tip but isn't clickable. No way to jump to the relevant section.

**Plan**: Add a `route` property to each `CheckItem`. Each incomplete item becomes a clickable button that navigates to the relevant dashboard page. Add a small arrow icon on hover and cursor-pointer styling.

Route mapping:
- "Profile photo uploaded" → `/dashboard/profile`
- "Display name set" → `/dashboard/profile`
- "Headline added" → `/dashboard/profile`
- "Bio written" → `/dashboard/profile`
- "Tagline set" → `/dashboard/profile`
- "Location added" → `/dashboard/profile`
- "At least one project" → `/dashboard/projects`
- "Social links added" → `/dashboard/social`
- "Profile published" → `/dashboard/settings`
- "Projects have loglines" → `/dashboard/projects`
- "Representation listed" → `/dashboard/representation`
- "Awards or fellowships" → `/dashboard/awards`
- "Headshot gallery (3+)" → `/dashboard/gallery`
- "Demo reel uploaded" → `/dashboard/projects`
- "Training & education" → `/dashboard/education`
- "Special skills listed" → `/dashboard/skills`
- "Services listed" → `/dashboard/services`
- "Client testimonials" → `/dashboard/testimonials`
- "Case study added" → `/dashboard/case-study`
- "Banner image uploaded" → `/dashboard/profile`
- "Testimonials added" → `/dashboard/testimonials`
- etc.

Also add: a small "preview" tooltip showing what this looks like on the public profile (e.g., "This appears in your hero section" or "This shows as a grid on your portfolio").

**Files**: `src/components/dashboard/ProfileReadiness.tsx`

---

## B. Theme Accessibility & Default Theme Fix

### B1. Theme quick-access from Dashboard Home
**Problem**: Theme is buried deep in Settings. Users can't find it.

**Plan**: Add a "Theme & Appearance" quick action card to DashboardHome that links to `/dashboard/settings` with a visual preview of the current theme (small color dot strip). Also add a "Change Theme" button in the Quick Actions row.

**Files**: `src/pages/dashboard/DashboardHome.tsx`

### B2. Default theme is "minimal" (stark white)
**Problem**: The `profiles` table defaults to `theme: 'minimal'`. The `legacyThemeMap` maps `minimal` → `modern-minimal`, but the CSS themes system in `lib/themes.ts` defines `minimal` with `--portfolio-bg: 0 0% 100%` (pure white). Meanwhile, the `PortfolioThemeProvider` uses the structured theme system (`themes/themes.ts`) which maps `minimal` → `modern-minimal`. These two systems conflict — the CSS vars from `lib/themes.ts` apply white backgrounds while the structured theme wants something else.

**Root cause**: The `PublicProfile.tsx` uses `PortfolioThemeProvider` with `resolveThemeId()` which maps `minimal` → `modern-minimal`. But the CSS variables from `lib/themes.ts` may also be applied elsewhere. The real issue is that `modern-minimal` in `themes/themes.ts` also has `bgPrimary: '#FAFAFA'` — essentially near-white. This IS the design of the minimal theme. The fix is to change the DEFAULT theme for new profiles from `minimal` to `cinematic-dark` so new users see an attractive theme out of the box.

**Plan**:
1. Change the default theme in profiles table from `'minimal'` to `'cinematic-dark'` (DB migration for the column default)
2. Update `SettingsPage.tsx` form default from `"minimal"` to `"cinematic-dark"`
3. Update onboarding `StepTheme.tsx` to default-select `cinematic-dark`

**Files**: DB migration, `src/pages/dashboard/SettingsPage.tsx`, `src/components/onboarding/StepTheme.tsx`

---

## C. Admin Gets Pro Access + Admin Can Set User Tiers

### C1. Admin bypass for Pro features
**Problem**: `useSubscription` checks Stripe → profiles table. Admin users with no Stripe subscription are blocked from Pro features.

**Plan**: Modify `useSubscription.ts` to check `has_role(uid, 'admin')` and if true, return `tier: "pro"` regardless of Stripe status. This gives all admins full platform access.

**Files**: `src/hooks/useSubscription.ts`

### C2. Set samxba@gmail.com as Pro
**Plan**: Update the `check-subscription` edge function to have an admin email override list, OR simply set `subscription_tier = 'pro'` directly in the profiles table for this user. Since we're adding admin bypass in C1, this is automatically handled — just need to ensure the user has the admin role. We'll add a DB insert for the admin role.

**Action**: Insert admin role for the user via the database tool.

### C3. Admin can change user subscription tier
**Problem**: `AdminUsers.tsx` shows tier as a badge but has no way to change it. No "Upgrade to Pro" or "Downgrade to Free" action.

**Plan**: Add a "Change Tier" option to the user actions dropdown in `AdminUsers.tsx`. Clicking opens a dialog with Free/Pro selector. On confirm, updates `profiles.subscription_tier` directly and logs to `admin_audit_logs`.

**Files**: `src/pages/admin/AdminUsers.tsx`

---

## D. "How It Works" Contextual Guidance Throughout UI

### D1. Enhanced ManagerHelpBanner with visual previews
**Problem**: Current banners are text-only. Users don't understand what each section looks like on the public profile.

**Plan**: Upgrade `ManagerHelpBanner` to support an optional `previewDescription` prop — a short line describing how it appears visually (e.g., "Appears as a grid of cards with star ratings on your portfolio"). Also add a "See example →" link that opens the relevant demo profile page (actor/screenwriter/copywriter) in a new tab, scrolled to the relevant section.

Update all 13 existing banner instances with these enhanced descriptions.

**Files**: `src/components/dashboard/ManagerHelpBanner.tsx`, all 13 manager pages

### D2. Dashboard Home "How It Works" guide
**Problem**: No how-it-works overview on the home page.

**Plan**: Add a collapsible "How CreativeSlate Works" section to DashboardHome, above Smart Import. Three visual steps:
1. "Build" — Add your work, skills, and experience (icon: layers)
2. "Customize" — Choose themes, layouts, and section order (icon: palette)
3. "Share" — Publish your portfolio and share one link (icon: share)

Each step is a card with icon, title, and short description. Dismissible via localStorage.

**Files**: `src/pages/dashboard/DashboardHome.tsx`

### D3. Quick-start options on home page
**Problem**: Import tools exist but aren't prominently featured for first-time users.

**Plan**: For users with `projectCount === 0` and no bio, show a prominent "Get Started Fast" card above everything else with:
- "Upload your resume" (PDF → AI extraction)
- "Import from URL" (LinkedIn, IMDb, personal website, Spotlight, Mandy, Casting Networks)
- "Start from scratch"

Include a small note: "We support importing from LinkedIn, IMDb, personal websites, and more. Your resume PDF works too."

**Files**: `src/pages/dashboard/DashboardHome.tsx`

---

## E. Cross-linking & Integration Improvements

### E1. Link Projects ↔ Awards, Press, Events
**Problem**: Awards, press, and events have `project_id` foreign keys but the manager UIs may not surface them prominently.

**Plan**: In each manager (Awards, Press, Events), ensure the project selector dropdown is prominent with a helper note: "Link this to a project to show them together on your portfolio."

### E2. Sidebar deep-links from ProfileReadiness
Already covered in section A.

### E3. Settings link from theme preview on DashboardHome
Already covered in B1.

### E4. Link "View on Portfolio" from each manager
**Plan**: Add a small "Preview on portfolio →" button in each ManagerHelpBanner that opens `/p/{slug}` in a new tab (if the profile is published). This lets users instantly see how their content looks live.

**Files**: `src/components/dashboard/ManagerHelpBanner.tsx`

---

## F. Missing Features Identified

1. **No testimonial request flow**: Users can manage testimonials but can't send a request link to clients. The `EndorsementRequests` page exists but may need wiring.
2. **No "Preview as visitor" mode**: Users can view their portfolio but there's no clear "Preview" button that opens it in a clean window without edit mode.
3. **Theme preview thumbnails**: The Settings theme picker is text-only. Add small color-dot previews (the `previewColors` array exists in the structured themes but isn't used in Settings).

---

## G. Profile-Type-Specific Analysis

Each profile type has unique needs. Key gaps per type:

**Actor**: Stats bar section exists but needs prominence in readiness checklist. Audio clips (voiceover reels) not tracked in readiness.

**Screenwriter/TV Writer/Playwright**: Coverage Simulator and Comp Matcher links should appear in readiness tips when zero scripts uploaded.

**Copywriter/Corporate Video**: Results Wall and Campaign Timeline sections exist but aren't mentioned in readiness or smart actions.

**Director/Producer**: Production history section exists but isn't tracked in readiness.

**Author/Journalist**: Published Work and Article Feed sections exist but readiness doesn't check for published_works table entries.

**Plan**: Expand ProfileReadiness to check additional type-specific tables (published_works, production_history, actor_stats) and add corresponding smart actions in DashboardHome's TYPE_ACTIONS.

---

## Implementation Order (16 tasks)

1. **ProfileReadiness interactive links** — add route + navigation to each check item
2. **ProfileReadiness visual context** — add "where it appears" descriptions  
3. **Default theme change** — DB migration + code defaults to `cinematic-dark`
4. **Admin Pro bypass** — modify `useSubscription` to grant Pro to admins
5. **Admin role for samxba@gmail.com** — DB insert
6. **Admin tier management** — add Change Tier action in AdminUsers
7. **ManagerHelpBanner enhanced** — add preview descriptions + demo links + "View on portfolio" button
8. **Dashboard Home "How It Works"** — 3-step visual guide
9. **Dashboard Home quick-start** — prominent import CTA for empty profiles
10. **Dashboard Home theme shortcut** — theme preview card + quick action
11. **Theme picker color previews** — use previewColors in Settings
12. **Cross-link project selectors** — ensure Awards/Press/Events prominently link to projects
13. **Expand readiness per profile type** — add published_works, production_history, actor_stats checks
14. **Expand smart actions per type** — add missing TYPE_ACTIONS entries
15. **"Preview Portfolio" prominent button** — ensure it's always visible on DashboardHome even for draft profiles
16. **Update all ManagerHelpBanner instances** — add enhanced descriptions to all 13 managers

### Technical Details

- DB migration: `ALTER TABLE profiles ALTER COLUMN theme SET DEFAULT 'cinematic-dark'`
- `useSubscription.ts`: Add `supabase.rpc("has_role", ...)` check before Stripe check. If admin → return `{ tier: "pro", isPro: true }` immediately.
- `ProfileReadiness.tsx`: Add `route: string` to `CheckItem` interface. Wrap each incomplete item in a `<button onClick={() => navigate(route)}>`.
- `AdminUsers.tsx`: Add `handleChangeTier` function with `supabase.from("profiles").update({ subscription_tier }).eq("id", profileId)` + audit log.
- `ManagerHelpBanner.tsx`: Add optional `previewText`, `demoUrl`, `portfolioSlug` props.

