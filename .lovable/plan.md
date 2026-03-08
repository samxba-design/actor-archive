

## Full Design, Functionality & UX Audit — By User Type

---

### A. LANDING PAGE & MARKETING

**Issues:**
1. **No profile-type-specific value propositions** — The landing page speaks generically to "entertainment professionals." There are no tailored sections showing what the platform looks like for an Actor vs. a Copywriter vs. a Screenwriter. The `profileTypes` array (line 24-30, Index.tsx) lists 5 types but only shows icons with labels — no click-through to see what each type gets.
2. **No interactive demo CTA** — The demo page exists at `/demo/screenwriter` but is not linked from the landing page or How It Works page. Users can't try before signing up.
3. **Fake social proof** — Stats (2,400+ portfolios, 1.2M views, 18K messages) are hardcoded, not pulled from real data. Testimonials are fabricated with stock photos. This is fine for MVP but should be flagged.
4. **No video walkthrough** — HowItWorks page has text steps but no embedded video demo showing the product in action.
5. **Missing "See Examples" section** — No link to any real public portfolio from the landing page. Users can't see what a finished portfolio looks like before committing.
6. **Pricing page doesn't show current plan** — If a logged-in user visits `/pricing`, they see generic pricing without any indicator of their current plan status (the `useSubscription` hook is used but only to show the checkout button state).

---

### B. ONBOARDING — BY USER TYPE

**B1. All Types:**
- **No onboarding persistence** — If a user refreshes or closes during the 7-8 step flow, all data is lost. Should save draft to `profiles` table after each step.
- **No "preview" at the end** — `StepComplete` shows a text summary but no visual preview of how the portfolio will look with the selected theme and data.
- **StepGoal is generic** — The 4 goals (Finding Representation, Getting Hired, Pitching Projects, Professional Presence) don't change anything downstream. The `primary_goal` is saved but never used to customize the dashboard experience, suggest sections, or prioritize readiness checks.
- **No guidance on what comes next** — After completing onboarding, users land on the dashboard with no immediate direction. The welcome tour referenced in memory is not implemented in the codebase.

**B2. Actor-Specific:**
- Solid. StepActorStats captures all essential casting data. Age range validation works. Skip option exists. Height input accepts free text (good for imperial/metric flexibility). Union status is multi-select (correct).
- **Missing**: No headshot upload during onboarding. Actors need a photo immediately — it's their most critical asset.

**B3. Screenwriter/TV Writer/Playwright:**
- No screenwriter-specific onboarding step. These users go straight from basic info → slug → theme → services → complete. They should be prompted to add at least one project (script) during onboarding since that's the core content.

**B4. Author/Journalist:**
- Same generic flow. No book/publication import step. The Google Books integration exists in ProjectsManager but isn't surfaced during onboarding.

**B5. Copywriter/Corporate Video:**
- No case study or client logo prompt during onboarding. These are the most important sections for this user type.

**B6. Director/Producer:**
- No showreel/video URL prompt during onboarding. Directors need visual work upfront.

**B7. Multi-Hyphenate:**
- Works well. Multiple type selection correctly triggers `multi_hyphenate` profile with merged sections. However, there's no explanation of what sections they'll get from each selected type.

---

### C. DASHBOARD — BY USER TYPE

**C1. Sidebar Relevance:**
- The sidebar correctly filters tools by `visibleTo` (e.g., Coverage Simulator only for screenwriters). Good implementation.
- **Missing**: No content count badges on sidebar items. Users can't see at a glance which sections have 0 items and need attention.
- **Missing**: No "Getting Started" or "Setup Guide" link in sidebar for new users.

**C2. ProfileReadiness — Type-Specific Checks:**
- Well implemented. Checks adapt to profile type (actor: headshots, demo reel, representation; screenwriter: loglines, awards; copywriter: case studies, services, testimonials).
- **Issue**: Readiness score appears on both DashboardHome and ProfileEditor, making two identical DB calls. Should be cached/shared.

**C3. Empty States:**
- `EmptyState` component exists and is used in AwardsManager and other managers. Good.
- **Missing**: EmptyState doesn't vary by profile type. An actor seeing "No awards yet" should get different copy than a copywriter.

**C4. Dashboard Home — Smart Actions:**
- Smart actions logic (lines 74-103, DashboardHome.tsx) covers: headshot, bio, projects, testimonials, social links, awards, publish.
- **Missing type-specific actions**: 
  - Actor: "Upload demo reel", "List your agent"
  - Screenwriter: "Add loglines to your scripts"
  - Copywriter: "Create a case study"
  - Author: "Add your first book"
- **Missing**: No "Share your portfolio" action with copy-to-clipboard URL.

**C5. Quick Actions are static** — Always shows Edit Profile, Manage Projects, Settings regardless of user type. Should adapt (e.g., Actor → "Manage Gallery" instead of "Manage Projects").

**C6. No dashboard welcome tour** — Referenced in memory but not in codebase. No `DashboardTour.tsx` exists.

---

### D. PUBLIC PORTFOLIO

**D1. SEO & Meta:**
- Good. OpenGraph tags, JSON-LD structured data, and dynamic `<title>` are all set. ✓

**D2. Portfolio Tour:**
- `PortfolioTour.tsx` filters steps by `profileType` and checks DOM element existence before rendering. Good.
- **Issue**: Tour content is still screenwriter-centric. Actors don't have a "Scripts" step but there's no actor-specific step like "Headshot Gallery" or "Demo Reel."

**D3. Missing Portfolio Features:**
- **No "Contact Me" floating button** — The contact form is at the bottom. On long portfolios, there's no persistent way to reach it.
- **No "Back to Top" button** — Long portfolios (10+ sections) have no scroll-to-top.
- **No social sharing buttons** — Visitors can't easily share the portfolio on LinkedIn/Twitter.
- **No PDF export / download** — Users can't generate a one-page resume/CV from their portfolio data.

---

### E. SETTINGS & CONFIGURATION

**E1. Section Order Manager:**
- Well implemented with drag-up/drag-down buttons and visibility toggles per section. Sections are pulled from the profile type config. ✓

**E2. CTA Configuration:**
- Four CTA types (contact form, calendar, email, custom URL) with label customization. Good coverage. ✓

**E3. Missing:**
- **No "Danger Zone"** — No account deletion or data export option in settings.
- **No email notification preferences** — Users can't choose whether to receive email when someone contacts them.
- **No analytics email digest** — Weekly/monthly portfolio performance summary.

---

### F. CROSS-CUTTING ISSUES

1. **No loading skeletons** — All pages show a spinner. Should use Skeleton components for content areas.
2. **No confirmation for destructive actions** — `handleDelete` in ProjectsManager (line 245) and ContactInbox (line 49) delete immediately without confirmation dialog.
3. **No undo/restore** — Deleted items are permanently gone. No soft-delete or trash.
4. **No keyboard shortcuts** — Power users can't use Cmd+S to save, Cmd+P to preview, etc.
5. **No mobile optimization audit** — Onboarding grids, chip selectors, and sidebar are not explicitly responsive-tested. The sidebar uses `collapsible="icon"` which may not work well on mobile.
6. **Social links route mismatch** — Dashboard sidebar links to `/dashboard/social` but smart actions link to `/dashboard/social-links`. These need to match.
7. **No dark/light mode toggle** — The portfolio themes support both dark and light variants, but the dashboard itself is hardcoded to a dark theme with no toggle.

---

### PRIORITY IMPLEMENTATION PLAN

| # | Fix | Impact | Files |
|---|-----|--------|-------|
| 1 | **Add onboarding persistence** — save draft to profiles after each step | High — prevents data loss | `Onboarding.tsx` |
| 2 | **Type-specific smart actions** — adapt DashboardHome next steps per profile type | High — guides users | `DashboardHome.tsx` |
| 3 | **Add photo upload to onboarding** — new step after BasicInfo for all types, emphasized for actors | High — actors need this | New `StepPhoto.tsx`, `Onboarding.tsx` |
| 4 | **Confirmation dialogs for delete** — wrap all `handleDelete` calls with AlertDialog | High — prevents data loss | `ProjectsManager.tsx`, `AwardsManager.tsx`, `ContactInbox.tsx`, +8 managers |
| 5 | **Link demo page from landing** — add "Try the Demo" button to Index.tsx hero and HowItWorks | High — conversion | `Index.tsx`, `HowItWorks.tsx` |
| 6 | **Fix social links route** — smart action links `/dashboard/social-links` but route is `/dashboard/social` | Medium — broken link | `DashboardHome.tsx` |
| 7 | **Add loading skeletons** — replace spinner with Skeleton in DashboardHome, managers | Medium — polish | Multiple dashboard pages |
| 8 | **Sidebar content badges** — show item count next to each nav item | Medium — discoverability | `DashboardSidebar.tsx` |
| 9 | **Dashboard welcome tour** — step-by-step overlay for first-time dashboard users | Medium — retention | New `DashboardTour.tsx`, `DashboardHome.tsx` |
| 10 | **Add "first project" step to onboarding** — type-aware prompt (script for writers, book for authors, case study for copywriters) | Medium — content | New `StepFirstProject.tsx`, `Onboarding.tsx` |
| 11 | **Back to Top + Floating Contact CTA** on public portfolio | Medium — UX | `PublicProfile.tsx` |
| 12 | **Type-specific empty states** — vary copy/illustrations per profile type | Low — polish | `EmptyState.tsx`, all managers |
| 13 | **Share portfolio action** — copy URL to clipboard from dashboard home | Low — viral | `DashboardHome.tsx` |
| 14 | **Pricing page current plan indicator** — highlight user's active plan | Low — clarity | `Pricing.tsx` |
| 15 | **Use primary_goal downstream** — customize readiness weights and smart actions based on user's goal | Low — personalization | `ProfileReadiness.tsx`, `DashboardHome.tsx` |

