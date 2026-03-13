

# Feature & Fix Recommendations — Prioritized Roadmap

Based on a thorough review of the codebase, here are the most impactful additions grouped by priority.

---

## HIGH PRIORITY — Revenue & Reliability

### 1. Stripe Webhook Handler
**Problem:** There's no `stripe-webhook` edge function. Subscription status only syncs when users visit the dashboard (via `check-subscription`). If a user cancels, upgrades, or their payment fails, the `profiles.subscription_tier` stays stale until they log in.

**Fix:** Create a `supabase/functions/stripe-webhook/index.ts` that handles `customer.subscription.created`, `updated`, `deleted`, and `invoice.payment_failed` events, updating `profiles.subscription_tier` in real-time.

### 2. Stripe Customer Portal Link
**Problem:** `customer-portal` edge function exists but there's no visible "Manage Billing" button in the Settings page for Pro users to cancel/change plans.

**Fix:** Add a "Billing" card in SettingsPage for Pro users with a button that invokes `customer-portal` and redirects.

---

## MEDIUM PRIORITY — User Experience

### 3. In-App Notifications / Activity Feed
**Problem:** When someone submits a contact form or downloads a script, the user only sees it if they check the Inbox. No push or in-app notification system exists.

**Fix:** Add a notifications bell in the dashboard header that queries recent `contact_submissions` (unread count) and `download_logs`. Could use Supabase Realtime on `contact_submissions` for live updates.

### 4. Image Upload to Storage (not just URLs)
**Problem:** Profile photos, gallery images, and posters currently rely on external URLs or TMDB links. There's no direct file upload to your own storage bucket, meaning images could break if external hosts go down.

**Fix:** Create a Supabase Storage bucket (`portfolio-assets`) and add an upload component that stores files there, returning permanent URLs.

### 5. Bulk Project Reorder (Drag & Drop)
**Problem:** Projects have `display_order` but the ProjectsManager likely requires manual ordering. A drag-and-drop reorder using the already-installed `@dnd-kit` would improve UX significantly.

**Fix:** Add sortable drag-and-drop to the project list in ProjectsManager, saving new `display_order` values on drop.

---

## LOWER PRIORITY — Growth & Polish

### 6. Dynamic Sitemap Generation
**Problem:** `robots.txt` references `/sitemap.xml` but no sitemap exists. Published profiles won't get indexed by search engines.

**Fix:** Create an edge function `sitemap` that queries all published profiles with `seo_indexable = true` and returns a valid XML sitemap.

### 7. Google Analytics / Plausible Integration
**Problem:** No client-side analytics beyond the custom `page_views` table. Users can't connect Google Analytics or similar.

**Fix:** Add an optional GA Measurement ID field in Settings → SEO. Inject the GA script on the public profile if set.

### 8. Social Login (Google OAuth)
**Problem:** Only email/password auth exists. Social login would reduce signup friction.

**Fix:** Enable Google provider in auth config and add a "Continue with Google" button on Login/Signup pages.

### 9. Email Notifications for Contact Form
**Problem:** `contact-notify` edge function exists but it's unclear if it's wired up. Verify it sends emails on new submissions and consider adding configurable notification preferences.

---

## Summary Table

| # | Feature | Impact | Effort |
|---|---------|--------|--------|
| 1 | Stripe webhook | Critical for billing reliability | Medium |
| 2 | Manage Billing button | Quick win for Pro users | Small |
| 3 | Notification bell | Better engagement | Medium |
| 4 | Image upload to storage | Data reliability | Medium |
| 5 | Drag-and-drop project reorder | UX polish | Small |
| 6 | Dynamic sitemap | SEO | Small |
| 7 | Analytics integration field | Growth tracking | Small |
| 8 | Google OAuth | Signup conversion | Small |
| 9 | Email notification check | Reliability | Small |

Which of these would you like to tackle first, or would you like to focus on a subset?

