

## Copywriter User Type: Feature Enhancement Plan

### What Exists Today

The copywriter profile currently has:
- **Sections**: Hero, Bio, Case Studies, Writing Samples, Client Logos, Testimonials, Services & Rates, Press, Awards, Contact
- **Case Study Builder**: Challenge → Solution → Results with AI assist and up to 3 key metrics
- **Writing Samples**: Grouped by `writing_samples_category`, links to external URLs or PDFs
- **Client Logos**: Clearbit auto-fetch with bar/grid/marquee variants; domain map includes ~20 brands (Nike, Google, Microsoft, etc.) but missing many major copywriter clients
- **Services**: Full/compact/pricing variants with deliverables, turnaround, featured toggle
- **Skills**: Tags/bars/grouped variants with proficiency levels
- **Project types**: `case_study`, `writing_sample`, `campaign`, `article`, `other`

### What's Missing for a Serious Copywriter

---

#### 1. RESULTS & METRICS SHOWCASE (New Section)
Case studies store `metric_callouts` in JSON but **the portfolio section never renders them**. `SectionCaseStudies.tsx` only shows `results` as plain text — the structured metrics (e.g., "+47% conversion", "3.2M impressions") are completely ignored. This is the single biggest gap: copywriters sell on results.

**Fix**: Render `metric_callouts` as large stat cards within each case study. Add a new standalone "Results Wall" / "Impact Numbers" section variant that aggregates top metrics across all case studies into a bold visual grid.

---

#### 2. VIDEO/MEDIA SHOWCASE (New Section: `video_portfolio`)
Copywriters increasingly produce video ads, social content, and brand films. The current system only supports video via the generic `video_url` on projects, and demo_reels is actor/director-only. Need a dedicated video portfolio section for copywriters showing:
- Embedded video player (YouTube/Vimeo via existing oEmbed)
- Client name + campaign name overlay
- Category filters (Paid Ads, Social, Brand Film, Product Launch)

**Implementation**: Add `video_portfolio` as a new section key for copywriter config. Reuse existing `projects` table filtering by `project_type = 'campaign'` with `video_url` present.

---

#### 3. SPECIALIZATION TAGS / EXPERTISE AREAS
The current skills system is too generic (name + category + proficiency). Copywriters need to showcase **specializations** like: Leadership Speeches, Crisis Communications, Content Strategy, Paid Ads, Email Marketing, UX Writing, SEO, Brand Voice, Social Media, Technical Writing. These should render as prominent, visually distinct pills — not buried in a skills list.

**Fix**: Add a new `specializations` display variant to `SectionSkills` that renders large, prominent cards with icons and optional short descriptions. Pre-populate category suggestions for copywriters in the Skills Manager.

---

#### 4. EXPANDED COMPANY LOGO LIBRARY
`companyLogos.ts` has ~20 brands in the "Brands (for copywriter clients)" section. Missing critical ones: SoFi, Deloitte, McKinsey, Accenture, PWC, Goldman Sachs, JPMorgan, American Express, Visa, Mastercard, PayPal, Square, Intuit, HubSpot, Mailchimp, Zendesk, Twilio, Datadog, Snowflake, Palantir, Coinbase, Robinhood, LinkedIn, Twitter/X, TikTok, Pinterest, Reddit, Lyft, DoorDash, Instacart, Peloton, Lululemon, Under Armour, Puma, New Balance, Target, Walmart, Costco, Home Depot, Lowe's, CVS, Walgreens, Johnson & Johnson, Pfizer, Unilever, P&G, L'Oréal, Nestlé, General Electric, Siemens, Intel, AMD, Nvidia, Cisco, Dell, HP, Lenovo, Verizon, AT&T, T-Mobile, Comcast, Disney, Red Bull, Monster Energy.

**Fix**: Expand `COMPANY_DOMAINS` map with 80+ additional brand domains.

---

#### 5. CUSTOM LOGO UPLOAD
Clearbit doesn't have logos for every company. Many copywriters work with startups, agencies, or niche brands. Need ability to:
- Upload custom client logos to the `logos` storage bucket (already exists)
- Fall back to uploaded logo when Clearbit fails
- Store in a new `client_logos` table with `profile_id`, `company_name`, `logo_url`, `website_url`, `display_order`

**Implementation**: New DB table + new dashboard page "Client Manager" that lets users add companies with auto-fetch OR manual upload. The existing `SectionClientLogos` component reads from this table instead of hardcoded company names.

---

#### 6. CASE STUDY DISPLAY VARIANTS
`SectionCaseStudies.tsx` has only one layout — a vertical stack of cards. Copywriters need:
- **Magazine**: Full-width hero image + text overlay for featured case studies
- **Grid**: 2-column card grid for scanning
- **Metrics-first**: Lead with the numbers, story below
- **Before/After**: Side-by-side comparison layout

**Fix**: Add `variant` prop to `SectionCaseStudies` with 4 layouts, matching the pattern used in Skills, Services, Gallery, etc.

---

#### 7. WRITING SAMPLES ENHANCEMENT
`SectionWritingSamples.tsx` is bare — just titles with external links. Copywriters need:
- Inline preview/excerpt (first 200 chars of the description)
- Category icons (Email, Landing Page, Social, Blog, Ad Copy, Speech)
- Featured toggle to highlight best samples
- Image/thumbnail support for visual campaigns

**Fix**: Enhance the component with richer cards, category-based icons, and excerpt rendering.

---

#### 8. CAMPAIGN TIMELINE
Copywriters often want to show career progression — major campaigns over time. The `events` table exists but is designed for physical events. Need a "Campaign Timeline" view that plots projects chronologically with client logos and key results.

**Implementation**: New section variant in `SectionProjects` that renders as a vertical timeline filtered to `campaign` and `case_study` types, sorted by year.

---

#### 9. COPYWRITER-SPECIFIC ONBOARDING
Current onboarding for copywriters goes: Profile Type → Goal → Basic Info → Slug → Theme → Services → Complete. Missing:
- Prompt to add at least one client/brand name
- Prompt for top 3 specializations
- Suggested theme ("corporate" is the default — good)

**Fix**: Add a `StepSpecializations` step that shows common copywriter specializations as selectable chips (pre-saves to `skills` table). Add a client name prompt.

---

#### 10. COPYWRITER-SPECIFIC SMART ACTIONS
Current `TYPE_ACTIONS` for copywriter only has 2 items. Should include:
- "Add your top clients" → Client Manager
- "Upload a writing sample" → Projects (writing_sample type)
- "Showcase a video campaign" → Projects (campaign type)
- "List your specializations" → Skills Manager

---

### Implementation Priority

| # | Feature | Impact | Effort |
|---|---------|--------|--------|
| 1 | **Render metric_callouts in case studies** | Critical — copywriters sell on numbers | Small — template change only |
| 2 | **Case study display variants** (magazine, grid, metrics-first) | High — visual differentiation | Medium |
| 3 | **Expand company logo library** (+80 brands) | High — instant credibility | Small — data entry |
| 4 | **Client logos DB table + upload** | High — handles unknown brands | Medium — new table + page |
| 5 | **Enhanced writing samples** (excerpts, icons, thumbnails) | High — richer showcase | Medium |
| 6 | **Specializations skill variant** (large prominent cards) | High — copywriter identity | Medium |
| 7 | **Video portfolio section** for campaigns | Medium — growing need | Small — reuse existing |
| 8 | **Copywriter smart actions + onboarding step** | Medium — better guidance | Small |
| 9 | **Campaign timeline variant** in SectionProjects | Medium — career narrative | Medium |
| 10 | **Results Wall section** (aggregated metrics) | Medium — impressive visual | Medium |

### Files to Create/Modify

- `src/lib/companyLogos.ts` — expand domain map
- `src/components/portfolio/sections/SectionCaseStudies.tsx` — variants + metric rendering
- `src/components/portfolio/sections/SectionWritingSamples.tsx` — enhanced cards
- `src/components/portfolio/sections/SectionSkills.tsx` — specializations variant
- `src/components/portfolio/sections/SectionClientLogos.tsx` — DB-backed + upload fallback
- `src/components/portfolio/PortfolioSection.tsx` — wire new section keys
- `src/config/profileSections.ts` — add sections to copywriter config
- `src/pages/dashboard/DashboardHome.tsx` — expanded copywriter smart actions
- `src/pages/dashboard/SkillsManager.tsx` — copywriter category suggestions
- New: `src/pages/dashboard/ClientManager.tsx` — manage client logos
- New: DB migration for `client_logos_profile` table
- New: `src/components/portfolio/sections/SectionResultsWall.tsx`

