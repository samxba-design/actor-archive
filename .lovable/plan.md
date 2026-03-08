

## UX Audit: Onboarding, Contextual Help, User Guides, and Overall Experience

### Issues Found

---

#### 1. ONBOARDING FLOW

**1a. Step numbering is wrong in StepBasicInfo**
`StepBasicInfo.tsx` line 22 says "Step 2" but it's actually step 3 (after Profile Type and Goal). Similarly, `StepSlug.tsx` says "Step 3" but is step 4. The step labels are hardcoded and don't account for the dynamic step count.

**1b. No "skip" option on optional steps**
StepActorStats, StepTheme, and StepBasicInfo (for optional fields like tagline, location) force users through without a clear skip path. Only StepServices has "Skip for now." Users who want to move fast get slowed down.

**1c. No data persistence between sessions**
If a user closes the browser mid-onboarding, all progress is lost (state is in-memory only). Long onboarding flows (up to 8 steps) risk abandonment.

**1d. Slug availability check doesn't exclude current user**
`StepSlug.tsx` line 43-49 checks if a slug exists but doesn't filter out the current user's own slug. If a user returns to onboarding (edge case), their own slug shows as "taken."

**1e. No input validation feedback**
No password strength indicator on signup. No character count on tagline/bio fields. No format hints on height input (accepts any text). Age range doesn't validate min < max.

**1f. Google OAuth redirects to /onboarding always**
Login's Google OAuth redirects to `/onboarding` (line 54 in Login.tsx), but if a returning user logs in via Google, they'd hit `/onboarding` then get bounced to `/dashboard` by ProtectedRoute. This creates a brief flash/redirect chain.

---

#### 2. CONTEXTUAL HELP & GLOSSARY

**2a. Glossary tooltips only used in ProfileEditor**
The glossary system has 30+ terms defined but `GlossaryTooltip` is only imported in `ProfileEditor.tsx`. It's absent from: ProjectsManager, ScriptManager, PipelineTracker, CaseStudyBuilder, AwardsManager -- all places where users encounter industry terminology.

**2b. No contextual help in dashboard managers**
The content manager pages (Awards, Press, Events, Education, Skills, Testimonials, etc.) have no explanatory text about what each section is for, how it appears on the portfolio, or best practices. Users create content blindly without understanding the impact.

**2c. No "what will this look like?" preview**
When editing profile or adding projects in the dashboard, there's no way to see a live preview of how it renders on the public portfolio. Users must publish, open in new tab, then come back.

---

#### 3. DASHBOARD UX

**3a. Duplicate Profile Readiness implementations**
`DashboardHome.tsx` has a simplified 5-check readiness score (lines 51-58), while `ProfileReadiness.tsx` has a comprehensive version with 15+ checks. The dashboard home shows the simpler one, making the detailed component unused or redundant on the main view.

**3b. No empty states with guidance**
Most manager pages (Awards, Press, Events, etc.) likely show nothing when empty -- no illustration, no explanation of what the section is, no "here's an example" content. The analytics page shows "No data yet" as plain text (line 145).

**3c. No first-time dashboard guidance**
After onboarding completes, users land on the dashboard with no tour, walkthrough, or suggested next steps beyond the readiness checklist. The portfolio tour (`PortfolioTour`) only exists on the public portfolio page, not the dashboard.

**3d. Quick Actions are too basic**
DashboardHome shows only 3 quick actions (Edit Profile, Manage Projects, Settings). Missing high-value actions like "Add your first project," "Upload a headshot," "Preview your portfolio," or "Share your portfolio link."

**3e. Sidebar is overwhelming**
The sidebar has 5 groups with 20+ navigation items visible at once. No progressive disclosure -- a brand-new user with zero content sees the same complex nav as a power user. No badges/indicators for which sections have content.

---

#### 4. AUTH & ACCOUNT

**4a. ForgotPassword page has no branding**
`ForgotPassword.tsx` uses plain `bg-background` with no brand panel, unlike Login and Signup which have the cinematic left panel. Inconsistent experience.

**4b. No password requirements shown on signup**
Signup has `minLength={6}` on the password field but no visible indicator of requirements. Users discover the requirement only after submission fails.

**4c. No "resend confirmation" flow**
After signup, users see "Check your email" but the only option is "try again" which just resets the form. No actual resend confirmation email button.

---

#### 5. PUBLIC PORTFOLIO

**5a. Portfolio tour targets may not exist**
`PortfolioTour.tsx` targets elements by ID (`tour-identity`, `tour-known-for`, etc.) but if a section is hidden or the profile type doesn't include it, `spotlightRect` becomes null and the tooltip renders at position 0,0.

**5b. Tour is only for screenwriter-style profiles**
The tour steps reference "scripts," "awards," "IMDb" -- not relevant for copywriters, journalists, or corporate video creators. No profile-type-aware tour content.

---

#### 6. MISSING UX PATTERNS

**6a. No loading skeletons**
Pages show a spinner while loading. No skeleton/placeholder UI for content areas, which causes layout shift.

**6b. No confirmation dialogs for destructive actions**
Publish/unpublish toggle on DashboardHome (line 78) immediately executes without confirmation. Delete actions in managers likely lack "are you sure?" prompts.

**6c. No keyboard shortcuts**
No keyboard navigation support beyond basic tab. Power users can't use shortcuts for common actions (save, preview, navigate sections).

**6d. No mobile-optimized onboarding**
The onboarding grid layouts (3-column for profile types, 5-column for themes) may not adapt well to mobile. The chip/pill selectors for actor stats could overflow.

---

### Recommended Plan (Priority Order)

| # | Fix | Files |
|---|-----|-------|
| 1 | **Fix step numbering** -- derive step labels dynamically from current index | All `Step*.tsx` components |
| 2 | **Add skip buttons** to StepActorStats, StepTheme, StepBasicInfo optional fields | `StepActorStats.tsx`, `StepTheme.tsx` |
| 3 | **Spread GlossaryTooltip** across all dashboard managers (Projects, Scripts, Awards, Press, Pipeline, etc.) | 8+ dashboard pages |
| 4 | **Add empty states** with illustrations and guidance text to all manager pages | All manager pages |
| 5 | **Add dashboard welcome tour** for first-time users after onboarding | New `DashboardTour.tsx`, `DashboardHome.tsx` |
| 6 | **Fix ForgotPassword branding** to match Login/Signup aesthetic | `ForgotPassword.tsx` |
| 7 | **Fix Google OAuth redirect** -- Login should redirect to `/dashboard`, not `/onboarding` | `Login.tsx` |
| 8 | **Add contextual descriptions** to each dashboard manager page header explaining what the section does and how it appears | All manager pages |
| 9 | **Consolidate Profile Readiness** -- use the detailed `ProfileReadiness` component on DashboardHome, remove the inline duplicate | `DashboardHome.tsx` |
| 10 | **Smart Quick Actions** -- show context-aware next steps based on what's missing (e.g., "Upload your headshot" if no photo) | `DashboardHome.tsx` |
| 11 | **Add password strength indicator** on signup | `Signup.tsx` |
| 12 | **Fix slug availability check** to exclude current user | `StepSlug.tsx` |
| 13 | **Add input validation** -- age range min < max, character counters, height format hint | `StepActorStats.tsx`, `StepBasicInfo.tsx` |
| 14 | **Profile-type-aware portfolio tour** -- adjust steps based on profile type | `PortfolioTour.tsx` |
| 15 | **Add confirmation dialogs** for publish/unpublish and delete actions | `DashboardHome.tsx`, manager pages |

This is a large scope. I recommend tackling items 1-10 as a first pass (the highest-impact, lowest-risk improvements), then items 11-15 as a follow-up.

