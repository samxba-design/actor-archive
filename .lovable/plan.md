

# Site-Wide Audit: Gaps, Issues & Improvements

## 1. Bugs & Functionality Issues

### 1a. Console Error: forwardRef Warning
`SectionProjects` and `PosterCard` are receiving refs but are not wrapped in `React.forwardRef()`. The `WithToggle` wrapper in `DemoShared.tsx` passes refs to these components. This causes React warnings on every demo page load.
**Fix**: Wrap `SectionProjects` (and `PosterCard` inside it) with `forwardRef`, or stop passing refs from `WithToggle`.

### 1b. Client Logos Not Passed Props in PortfolioSection
Line 430 of `PortfolioSection.tsx` renders `<SectionClientLogos items={data} />` without passing `colorMode`, `variant`, or `logoSize`. The customization options we just built have no effect on real (non-demo) profiles.
**Fix**: Read user preferences from the profile or section config and pass them through.

### 1c. ResetPassword Page Unstyled
`ResetPassword.tsx` uses generic `bg-background` / `text-foreground` classes instead of the branded `landing-*` CSS variables used everywhere else. It looks visually disconnected from Login, Signup, and ForgotPassword.
**Fix**: Wrap in `AuthLayout` with the same quote sidebar pattern.

### 1d. Representation Section Excludes Email & Phone
`PortfolioSection.tsx` line 204 explicitly omits `email` and `phone` from the representation query columns. The `SectionRepresentation` component renders `Mail` and `Phone` icons but they never have data.
**Fix**: Add `email,phone` to the select string.

### 1e. Signup Redirects Confirmed Users to /onboarding
`Signup.tsx` line 45: if a user is already logged in, it redirects to `/onboarding` instead of `/dashboard`. `ProtectedRoute` handles this, but there's a flash of redirect.
**Fix**: Redirect to `/dashboard` (ProtectedRoute will handle the onboarding check).

---

## 2. Security Concerns

### 2a. Logo.dev Token Exposed in Client Bundle
The publishable token `pk_WI7pAXJIQ5-QD8yVHEfJYQ` is hardcoded in `companyLogos.ts`. This is acceptable per logo.dev docs (like a Stripe publishable key), but worth noting — it can be domain-restricted in the logo.dev dashboard for extra safety.

### 2b. Subscription Check Has Silent Failures
`useSubscription.ts` catches errors silently at lines 71 and 82, falling back without logging. If the edge function or RPC fails, users could incorrectly get "free" tier access or, conversely, lose Pro features.
**Fix**: Add error logging so failures are visible in console.

---

## 3. UX / Streamlining Issues

### 3a. No Loading State for Section Data
`PortfolioSection.tsx` line 296: `if (loading) return null;` — sections silently disappear during data fetch. On slow connections, the portfolio appears to have fewer sections until data loads.
**Fix**: Return a subtle skeleton or placeholder.

### 3b. Section Heading Code Duplicated 4 Times
The section heading pattern (number + h2 + accent rule) is copy-pasted for `bio`, `availability`, `stats_bar`, and the default case in `PortfolioSection.tsx`. Any style change requires editing 4 places.
**Fix**: Extract into a `SectionHeading` component.

### 3c. PortfolioSection Has a Massive Switch Statement (483 Lines)
The component handles data fetching, rendering, and heading display for 25+ section types in a single file. This is the most complex component in the codebase and a maintenance bottleneck.
**Fix**: Split data-fetching logic into a `useSectionData` hook and rendering into a `SectionRenderer` component.

### 3d. No 404 for Unpublished/Missing Public Profiles
`PublicProfile.tsx` sets `notFound` state but doesn't render a proper 404 page — worth verifying the actual rendering for this case.

### 3e. Demo Pages Don't Share a Layout Route
`DemoActor`, `DemoScreenwriter`, and `DemoCopywriter` are three separate 1000+ line page files with significant duplication. They should share a common `DemoPage` wrapper with profile-type-specific data injected.

---

## 4. Missing Features / Gaps

### 4a. No Dashboard Route for "Headshot Style" Setting
`headshot_style` is stored and used in the hero, but it's only accessible from the general Settings page buried among many fields. There's no visual preview of the headshot shape options.

### 4b. No Mobile Nav for Marketing Pages
The viewport is 375px. Marketing pages use `MarketingNav` — need to verify it has a hamburger menu for mobile. If not, navigation is inaccessible.

### 4c. No Email Verification Reminder
After signup, users see a "check your email" message, but if they miss it and try to log in, they get a generic "Invalid login credentials" error with no hint about email verification.

### 4d. No Bulk Delete in Content Managers
Dashboard managers (Projects, Awards, etc.) manage items one at a time. For users with many items, there's no multi-select or bulk delete.

### 4e. No Undo for Section Visibility Toggles in Edit Mode
When a user toggles a section off in edit mode, there's no undo. They must re-toggle manually.

---

## 5. Performance

### 5a. PortfolioSection Makes Individual Queries Per Section
Each section fires its own database query. A profile with 15 sections makes 15+ parallel queries. This could be consolidated into fewer queries (e.g., one query for all project-based sections).

### 5b. No Image Optimization on Portfolio
Profile photos and gallery images are served at original resolution. There's an `imageCompression.ts` utility, but it's only used on upload — no responsive `srcSet` or CDN resizing on display.

---

## Priority Recommendations

| Priority | Item | Effort |
|----------|------|--------|
| High | Fix representation email/phone query omission (1d) | Small |
| High | Pass colorMode/variant to SectionClientLogos in real profiles (1b) | Small |
| High | Fix forwardRef console errors (1a) | Small |
| Medium | Style ResetPassword page consistently (1c) | Small |
| Medium | Add error logging to subscription checks (2b) | Small |
| Medium | Extract SectionHeading component (3b) | Medium |
| Medium | Fix signup redirect target (1e) | Small |
| Low | Refactor PortfolioSection into hook + renderer (3c) | Large |
| Low | Consolidate demo pages (3e) | Large |
| Low | Add section loading skeletons (3a) | Medium |

