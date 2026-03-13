

# Deep Site Audit — Complete Findings

## Architecture & Data Flow

The site uses a Section Registry (`profileSections.ts`) that maps 10 profile types to semantic section keys. The dashboard sidebar uses hardcoded route paths (`/dashboard/projects`, `/dashboard/awards`), while the public portfolio renders sections by registry keys (`script_library`, `logline_showcase`). Data flows through `PortfolioSection.tsx` which queries Supabase per-section and delegates to specialized renderers.

---

## Critical Bugs

### 1. Layout Preset picker saves to wrong column
`SettingsPage.tsx` line 415: `setForm(f => ({ ...f, layout_density: preset.id }))` — the Layout Preset picker saves its selection into `layout_density`, which is supposed to be "spacious" / "compact" / "dense". This means choosing "Bento" or "Magazine" overwrites the actual density setting. Neither `PublicProfile.tsx` nor any layout component reads `layout_density` as a layout preset. The presets are decorative — they save a value but nothing on the portfolio side consumes it.

### 2. Hero layout saved in two places, only one used
`ProfileEditor.tsx` saves `hero_style` (line 114). `SettingsPage.tsx` also saves `hero_style` (line 254). Both save to the same column, but the user may edit one and not realize the other overwrites it. The Settings page hero picker is the intended UI, but ProfileEditor also has `HeroBackgroundEditor` which sets `hero_style`. Confusing and conflict-prone.

### 3. `(data as any)` casts throughout
`ProfileEditor.tsx` lines 78-91 and `SettingsPage.tsx` lines 108-171 cast numerous fields with `(data as any)`. These fields (`headline`, `primary_goal`, `hero_style`, `hero_bg_type`, `known_for_position`, `cta_label`, `cta_url`, `cta_type`, `booking_url`, `font_pairing`, `layout_density`, `custom_css`, `seo_indexable`, `contact_mode`, `auto_responder_enabled`, `auto_responder_message`) exist in the DB but aren't in the generated TypeScript types. This prevents type-checking from catching real errors.

### 4. No email notification for contact form submissions
The `contact-notify` edge function exists but `PortfolioFooter.tsx` inserts to `contact_submissions` table only — it never invokes the edge function. Contact form submissions are saved but the profile owner has no way to know they received a message without checking the dashboard.

### 5. Stripe checkout/subscription flow incomplete
`create-checkout` and `check-subscription` edge functions exist, but `useSubscription.ts` always returns `isPro: false` for all users unless they have a specific `subscription_tier` in the profiles table. There's no Stripe webhook to update `subscription_tier` after payment. The Pricing page likely sends users to checkout but their subscription status never updates.

---

## Major UX Issues

### 6. No drag-and-drop reorder for projects in dashboard
`@dnd-kit` is installed and used for section reordering on the public portfolio, but `ProjectsManager` has no drag-and-drop. Users can't reorder projects — they're displayed by `display_order` but there's no UI to change it.

### 7. Gallery manager lacks drag-and-drop reorder
Same issue as projects — `display_order` exists but no reorder UI.

### 8. No "Reply" from inbox
`ContactInbox.tsx` shows messages with star/archive/delete but has no reply functionality. The `reply_sent` column exists in the DB but is never set. Users must note the sender's email and reply from their own email client.

### 9. Onboarding doesn't set default section_order
`Onboarding.tsx` saves `profile_type`, theme, services, etc. but never sets `section_order` or `sections_visible`. New users get `null` for both, causing `PublicProfile.tsx` to fall back to `DEFAULT_SECTION_ORDER` which is a generic list that doesn't match their profile type's registry. First-time portfolios show wrong sections.

### 10. No image upload for banner/hero background
`HeroBackgroundEditor` is referenced in `ProfileEditor` but it's unclear if it supports file upload to the `banners` bucket. The banner_url field exists but there's no explicit upload flow visible in the ProfileEditor — it delegates to `HeroBackgroundEditor` component which wasn't fully audited.

### 11. Demo pages don't link to signup
Demo pages (Actor, Screenwriter, Copywriter) show impressive portfolios but the only way to sign up is via the marketing nav. There's no prominent "Build yours" CTA within the demo experience.

### 12. Analytics limited to 1000 rows
`AnalyticsOverview.tsx` line 34: `.limit(1000)` — profiles with >1000 views lose data in the analytics view. Should use aggregate queries or pagination.

---

## Missing Features

### 13. No email notifications
No mechanism to email users when they receive a contact submission, when their profile gets views, or for any other event. The `contact-notify` edge function exists but isn't wired up.

### 14. No Google OAuth / social login
Only email/password signup. No social login options despite Lovable Cloud supporting them.

### 15. No "Duplicate Project" action
Users creating similar projects (e.g., multiple case studies) must re-enter everything from scratch.

### 16. No bulk actions in managers
Can't bulk-delete, bulk-reorder, or bulk-update items in any manager (projects, awards, etc.).

### 17. No search/filter in project manager
With many projects, there's no way to search or filter. The project list is a flat scroll.

### 18. No undo for destructive actions
Deleting a project, award, or testimonial is immediate and permanent. No soft-delete, no undo toast.

### 19. No "Import from LinkedIn" or resume parser
For copywriters and corporate users, importing work history from LinkedIn or a resume would dramatically speed onboarding.

### 20. No multi-language support
All UI is English-only. No i18n infrastructure.

### 21. No PWA / offline support
No service worker, no manifest for installability.

### 22. No collaborative profiles
No way for an agent/manager to edit their client's profile.

---

## Performance Issues

### 23. Every section makes its own Supabase query
`PortfolioSection.tsx` fires a separate `useEffect` fetch for each section. A profile with 12 sections makes 12 parallel requests on page load. Should batch into a single query or use a data provider.

### 24. No image optimization / CDN
Images are served directly from Supabase storage. No responsive `srcset`, no WebP conversion, no lazy loading with blur placeholders.

### 25. No caching of portfolio data
Every visit triggers full re-fetch. No SWR, no React Query for the public portfolio. The dashboard uses React Query client but never uses it for caching.

---

## Security Concerns

### 26. Custom CSS allows potential XSS
`sanitizeCSS` is used but should be audited — CSS injection can include `url()` calls, `expression()` in older IE, etc.

### 27. OG image generation exposes profile data
The `og-image` edge function renders profile data into an image. If it doesn't verify `is_published`, it could expose unpublished profile data.

---

## Code Quality Issues

### 28. Duplicate theme systems
`src/lib/themes.ts` defines CSS-variable-based themes for the portfolio. `src/themes/themes.ts` defines a completely separate `PortfolioTheme` object with explicit color values. These two systems are partially redundant and don't always stay in sync.

### 29. No error boundaries around managers
If a Supabase query fails in any manager (projects, awards, etc.), the component shows nothing. No error state UI, no retry button.

### 30. `contact_submissions` lacks `profile_id` index
The table has no index on `profile_id`, meaning inbox queries do a sequential scan as the table grows.

---

## Recommended Fix Priority

**Tier 1 — Broken / blocking:**
1. Fix layout preset not actually applying (either wire it to real layout logic or remove fake options)
2. Set default `section_order` during onboarding
3. Wire up `contact-notify` edge function to email on new submissions
4. Fix Stripe webhook to update `subscription_tier`

**Tier 2 — Major UX gaps:**
5. Add drag-and-drop reorder to ProjectsManager and GalleryManager
6. Add reply-to-email from ContactInbox
7. Add demo-to-signup CTAs on demo pages
8. Batch portfolio section queries

**Tier 3 — Quality & polish:**
9. Add Google OAuth login
10. Add duplicate project action
11. Add error states to all managers
12. Add image optimization (lazy load, srcset)
13. Remove `(data as any)` casts
14. Consolidate duplicate theme systems

