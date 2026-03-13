

# Full Site Audit — Findings and Recommended Fixes

## Critical Bugs

### 1. PublicProfile missing new profile fields (BROKEN FEATURES)
`src/pages/PublicProfile.tsx` `ProfileData` interface is missing:
- `professional_status` — status badge shows nothing on real profiles
- `status_badge_color` — defaults ignored  
- `status_badge_animation` — defaults ignored
- `hero_bg_image_url` — stock/custom hero images won't render
- `client_logos_position` — client logos always render in body, never below hero
- `headshot_style` — already accessed via `(profile as any)` cast, not typed

The `select("*")` query fetches all columns, so data IS available — but because these fields aren't on the interface, TypeScript doesn't see them and some downstream components may not receive them. The `heroBgImageUrl` prop is never passed to `PortfolioHero` from `PublicProfile`.

**Fix**: Add all missing fields to `ProfileData` and pass `heroBgImageUrl={profile.hero_bg_image_url}` to the `<PortfolioHero>` component.

### 2. Client logos not rendering based on position
`PublicProfile.tsx` has no logic to render client logos in the `below_hero` position. The `client_logos_position` field is saved in settings but never consumed on the public profile page. Client logos only appear if the `SortableSectionList` renders a client logos section.

**Fix**: Add conditional rendering of `SectionClientLogos` below the hero when `client_logos_position === 'below_hero'`.

## Inconsistencies

### 3. GettingStartedGuide says "10+ layout presets" — should say "17 themes"
Line in `GettingStartedGuide.tsx` step 6 says "10+ layout presets and multiple themes" — this is outdated after the theme expansion.

### 4. SEOHead description still says "10+ premium themes"
`Index.tsx` line 305: `description` in `SEOHead` says "10+ premium themes" but the page body already says "17 Stunning Themes."

### 5. Theme showcase on landing page uses old `themes` from `lib/themes.ts`
The `showcaseThemes` array references `["noir", "editorial", "spotlight", "midnight", "minimal", "gallery"]` which come from `src/lib/themes.ts` (the CSS-variable system), not the new `src/themes/themes.ts` portfolio themes. These showcase names don't correspond to any of the 17 actual portfolio themes users can select. This is misleading.

### 6. Pricing page free tier says "Minimal theme" only
Line 28: `"Minimal theme"` — but free users currently get `cinematic-dark` as default. The wording should clarify which theme(s) free users get.

## Missing Features / UX Gaps

### 7. No "Delete Account" option in dashboard settings
Users have no way to delete their account from the dashboard. The settings page has password change but no account deletion.

### 8. No email change option
Users cannot change their email address from the dashboard settings.

### 9. No "Log out of all devices" option
No session management beyond the single logout button.

### 10. No loading/empty state for client logos below hero
If `client_logos_position` is `below_hero` but user has no logos, need to ensure nothing renders (not an empty section).

### 11. No mobile-responsive check on DemoCustomizationPanel
The customization panel has grown significantly with CTA style, background image thumbnails, status badge options — could overflow on mobile.

### 12. Dashboard sidebar has no "Analytics" link for free users
Free users see "Total page view count" as a feature but there's no obvious sidebar link to view it unless they find the analytics page, which is gated.

### 13. No feedback when user hits free project/gallery limits
`FREE_PROJECT_LIMIT = 8` and `FREE_GALLERY_LIMIT = 5` are defined but there's no clear check in `ProjectsManager` or `GalleryManager` that shows a friendly message when limits are reached.

## Recommended Plan (Priority Order)

### Phase 1 — Fix Critical Bugs
| File | Change |
|------|--------|
| `src/pages/PublicProfile.tsx` | Add `professional_status`, `status_badge_color`, `status_badge_animation`, `hero_bg_image_url`, `client_logos_position`, `headshot_style` to `ProfileData`. Pass `heroBgImageUrl` to `PortfolioHero`. Add below-hero client logos rendering. |

### Phase 2 — Fix Inconsistencies  
| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Fix SEOHead description to "17 stunning themes" |
| `src/components/dashboard/GettingStartedGuide.tsx` | Update theme count |
| `src/pages/Pricing.tsx` | Clarify free theme offering |
| `src/pages/Index.tsx` | Update `showcaseThemes` to use actual portfolio theme IDs or at minimum fix the mapping |

### Phase 3 — UX Improvements
| Feature | Description |
|---------|-------------|
| Free tier limit warnings | Show toast/banner when users approach or hit 8 project / 5 gallery limits |
| Analytics link for free users | Add basic analytics summary on dashboard home for free users |
| Account deletion | Add delete account card in settings |

This audit covers 13 findings: 2 critical bugs, 4 inconsistencies, and 7 UX gaps. I recommend implementing Phase 1 and Phase 2 together as they're all quick fixes.

