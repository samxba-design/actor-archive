

## Monetization: 2-Tier System (Free + Pro)

### Tier Structure

**Free** — generous enough to be genuinely useful:
- 1 profile with custom slug
- Up to 8 projects
- Up to 5 gallery images
- 1 theme (Minimal)
- Default font pairing + layout density
- Basic contact form
- Social links (unlimited)
- Basic analytics (total views only)
- All content sections (awards, education, events, press, testimonials, skills, representation)
- Public portfolio with "Powered by CreativeSlate" footer badge

**Pro — $19.99/month or $191.88/year ($15.99/mo, ~20% discount)**
- Unlimited projects + gallery images
- All 10+ themes
- Font pairing selector
- Layout density toggle
- Custom CSS editor
- Custom domain setup
- AI Writing Assistant (evaluate + suggest for loglines, bios, headlines)
- AI Coverage Simulator
- Comp Title Matcher
- Profile Insights (AI persona evaluation)
- Full analytics (device, referrer, geo, time series)
- Contact inbox with auto-responder
- Pipeline tracker
- Smart follow-up
- Endorsement requests
- Case study builder
- Embed widget / iframe support
- Script access levels beyond Public (Gated, Password, NDA, Private)
- Download tracking with detailed logs
- Booking calendar integration
- Remove CreativeSlate footer badge

### Implementation

#### 1. Create `src/hooks/useSubscription.ts`
- Reads `subscription_tier` from profiles table
- Exposes `tier`, `isPro`, `canAccess(feature)` 
- Feature map: `{ themes: 'pro', ai_writing: 'pro', coverage_sim: 'pro', ... }`

#### 2. Create `src/components/UpgradeGate.tsx`
- Reusable wrapper: if user lacks access, shows blurred overlay with lock icon + "Upgrade to Pro" CTA
- Links to `/pricing`
- Variant: `inline` (small badge/button) vs `overlay` (full section blur)

#### 3. Create `src/pages/Pricing.tsx`
- Two-column layout: Free vs Pro
- Monthly/yearly toggle ($19.99/mo vs $15.99/mo billed annually)
- Feature comparison checklist
- CTA buttons (Free = "Get Started", Pro = "Upgrade Now")
- Cinematic styling matching landing page

#### 4. Apply gates across dashboard
| Feature | File | Gate behavior |
|---|---|---|
| Themes beyond Minimal | `SettingsPage.tsx` | Lock options with badge |
| Font pairing | `SettingsPage.tsx` | Lock selector |
| Custom CSS | `SettingsPage.tsx` | Lock textarea |
| Layout density | `SettingsPage.tsx` | Lock selector |
| Auto-responder | `SettingsPage.tsx` | Lock toggle |
| Custom domain | `SettingsPage.tsx` | Lock field |
| AI Writing Assistant | `WritingAssistant.tsx` | Show upgrade on click |
| Coverage Simulator | `CoverageSimulator.tsx` | Wrap in UpgradeGate |
| Comp Matcher | `CompTitleMatcher.tsx` | Wrap in UpgradeGate |
| Profile Insights | `ProfileInsights.tsx` | Wrap in UpgradeGate |
| Full Analytics | `AnalyticsOverview.tsx` | Gate detailed breakdown |
| Pipeline Tracker | `PipelineTracker.tsx` | Wrap in UpgradeGate |
| Smart Follow-Up | `SmartFollowUp.tsx` | Wrap in UpgradeGate |
| Case Study Builder | `CaseStudyBuilder.tsx` | Wrap in UpgradeGate |
| Embed Widget | `EmbedAndShare.tsx` | Gate iframe code |
| Projects limit (8) | `ProjectsManager.tsx` | Block add after 8 |
| Gallery limit (5) | `GalleryManager.tsx` | Block upload after 5 |
| Script access levels | `ProjectsManager.tsx` | Lock non-public levels |

#### 5. Sidebar + footer changes
- `DashboardSidebar.tsx`: Show tier badge + "Upgrade" button for free users
- `PortfolioFooter.tsx`: Show "Powered by CreativeSlate" on free tier, hide on Pro
- `Index.tsx` + nav: Add "Pricing" link

#### 6. Route
- Add `/pricing` to `App.tsx`

### Files to Create
- `src/hooks/useSubscription.ts`
- `src/components/UpgradeGate.tsx`
- `src/pages/Pricing.tsx`

### Files to Edit
- `src/App.tsx` — add pricing route
- `src/pages/Index.tsx` — add Pricing nav link
- `src/components/dashboard/DashboardSidebar.tsx` — tier badge + upgrade button
- `src/components/dashboard/WritingAssistant.tsx` — gate AI calls
- `src/pages/dashboard/SettingsPage.tsx` — gate themes, fonts, CSS, domain, auto-responder, density
- `src/pages/dashboard/CoverageSimulator.tsx` — wrap in gate
- `src/pages/dashboard/CompTitleMatcher.tsx` — wrap in gate
- `src/pages/dashboard/ProfileInsights.tsx` — wrap in gate
- `src/pages/dashboard/AnalyticsOverview.tsx` — gate detailed analytics
- `src/pages/dashboard/PipelineTracker.tsx` — wrap in gate
- `src/pages/dashboard/SmartFollowUp.tsx` — wrap in gate
- `src/pages/dashboard/CaseStudyBuilder.tsx` — wrap in gate
- `src/pages/dashboard/EmbedAndShare.tsx` — gate embed code
- `src/pages/dashboard/ProjectsManager.tsx` — limit projects + gate access levels
- `src/pages/dashboard/GalleryManager.tsx` — limit uploads
- `src/components/portfolio/PortfolioFooter.tsx` — badge on free tier

No database changes needed — `subscription_tier` enum already has `free` and `pro` values on the profiles table.

