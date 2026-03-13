# Full Platform Audit — CreativeSlate

## A. Marketing & Conversion Gaps

### 1. No Visual "How It Works" with Real Screenshots/Mockups

The current How It Works page uses abstract placeholder wireframes (gray rectangles). A visual, graphical step-by-step page with actual UI screenshots or high-fidelity mockups would dramatically increase conversion.

**Recommendation**: Replace the mock UI blocks in `FeatureDeepDive` with real annotated screenshots of the dashboard, portfolio editor, and published profile. Add an animated "before/after" comparison slider showing a blank profile vs. a finished one.

### 2. No FAQ Page

Neither the Pricing page nor a standalone FAQ exists. Common questions (Can I switch plans? Do I keep my data? Can I export?) go unanswered.

**Recommendation**: Add an `/faq` route with an accordion-based FAQ page. Link it from the nav, footer, and pricing page.





---

## B. Onboarding & First-Time UX

### 5. Getting Started Guide Uses localStorage Only

`GettingStartedGuide` tracks dismissal via `localStorage`. If a user clears cache or uses a different device, they see it again. It also can't be re-triggered intentionally.

**Recommendation**: Persist the tour state to the `profiles` table (e.g., `tour_completed_at` column). Add a "Replay Tour" option in the help menu.

### 6. No Contextual Empty States in All Managers

Some managers show generic empty states. Each content manager should have a purpose-driven empty state explaining *why* this section matters for the user's profile type.

**Recommendation**: Audit all manager pages and ensure `EmptyState` component is used consistently with profile-type-aware messaging.

### 7. Skip Button on Onboarding Skips Everything

The "Skip" button on onboarding marks `onboarding_completed: true` and dumps the user into the dashboard with potentially no profile type, no slug, no name set. This creates a broken/empty profile.

**Recommendation**: Either remove the skip button from the first 2 steps (type + basic info are critical), or save whatever partial data exists before skipping.

---

## C. Dashboard UX Issues

### 8. Settings Page is ~1,200 Lines — Overwhelming

`SettingsPage.tsx` is a single monolithic 1,198-line component with 15+ cards. Users can't find what they need.

**Recommendation**: Split into tabbed sub-sections: General, Appearance, SEO/Publishing, Security, Billing. Use a vertical tab layout or anchored scroll sections.

### 9. No Confirmation Before Destructive Actions (Inconsistent)

Account deletion requires typing "DELETE" (good), but publishing/unpublishing, bulk operations, and other destructive actions may lack confirmation.

**Recommendation**: Audit all destructive operations for confirmation dialogs.

### 10. No Data Export

Users can't export their portfolio data (projects, testimonials, contacts) as CSV or JSON. Privacy policy promises this capability.

**Recommendation**: Add an "Export Data" button in Settings that generates a JSON/CSV download of all user content.

### 11. No "Undo" for Accidental Deletes

When a user deletes a project, testimonial, or award, it's gone immediately with no recovery.

**Recommendation**: Add soft-delete with a 30-day trash, or at minimum a toast with an "Undo" action that re-inserts the deleted row.

---

## D. Public Portfolio Issues

### 12. No Meta Image / OG Image for Social Sharing

`og-image` edge function exists but it's unclear if it's wired into `PublicProfile.tsx` SEO tags.

**Recommendation**: Verify the `og:image` meta tag is being set dynamically on public profiles using the edge function URL.

### 13. No Offline/PWA Support

No `manifest.json` or service worker exists. Not critical but would be nice for mobile users.

---

## E. Technical & Security

### 14. Account Deletion Only Deletes Profile Row

The danger zone in Settings deletes from `profiles` but doesn't delete the `auth.users` record. The user's auth account persists as an orphan.

**Recommendation**: Create an edge function `delete-account` that uses the admin API to delete the auth user after cleaning up profile data.

### 15. No Rate Limiting on Contact Form

The public contact form (`PortfolioFooter.tsx`) has no rate limiting or CAPTCHA. It could be spammed.

**Recommendation**: Add a simple rate limit check (e.g., max 5 submissions per IP per hour) via an edge function or RLS policy.

### 16. `robots.txt` References Sitemap but Needs Correct URL

Verify that `robots.txt` points to the correct sitemap edge function URL.

---

## F. Missing Features Worth Adding

### 17. Visual "How It Works" Page (User's Request)

Yes — the current page is text-heavy with abstract wireframes. A redesigned version should include:

- Animated step-by-step with numbered visual cards
- Embedded demo iframe or video walkthrough
- "Try it yourself" interactive section linking to demos
- Before/after portfolio transformation
- Profile type selector showing different section configurations

### 18. Changelog / What's New

No way to communicate new features to existing users.

**Recommendation**: Add a simple `/changelog` page or a "What's New" badge on the notification bell.

### 19. Mobile Responsive Audit

The dashboard sidebar, settings page, and some manager pages may not be fully optimized for mobile. The sidebar uses `SidebarProvider` which should handle this, but the 1,200-line settings page likely has layout issues on small screens.

---

## Priority Implementation Order


| Priority | Item                                           | Effort |
| -------- | ---------------------------------------------- | ------ |
| 1        | Visual How It Works page redesign (#17)        | Medium |
| 2        | Split Settings into tabs (#8)                  | Medium |
| 3        | Fix account deletion to remove auth user (#14) | Small  |
| 4        | Fix onboarding skip to save partial data (#7)  | Small  |
| 5        | Add FAQ page (#2)                              | Small  |
| 6        | Add Data Export (#10)                          | Medium |
| 7        | Persist tour state to DB (#5)                  | Small  |
| 8        | Contact form rate limiting (#15)               | Small  |
| 9        | Verify OG image wiring (#12)                   | Small  |
| 10       | Soft-delete / undo for content (#11)           | Medium |
