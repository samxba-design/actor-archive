

## Plan: Sample Screenwriter Profile Page + Remaining Fixes

### 1. Create a Demo/Sample Profile Page

Build a new route `/demo/screenwriter` that renders a **fully fleshed-out screenwriter portfolio** using hardcoded mock data — no database needed. This serves as a marketing showcase on the landing page.

**Mock data includes:**
- **Profile**: "Jordan Avery", headshot (Unsplash), banner image, tagline "Emmy-nominated screenwriter | Features & Limited Series", bio, location "Los Angeles, CA", available for hire, seeking representation
- **Social links**: IMDb, X/Twitter, Instagram, LinkedIn
- **Logline Showcase**: 3 screenplays with genre tags, loglines, status badges (Optioned, In Development, Spec)
- **Script Library**: 4-5 scripts with page counts, format labels, genre pills
- **Produced Credits**: 3 film/TV credits with TMDB-style posters (Unsplash stand-ins), year, role, network/studio
- **Awards**: 6 items — Nicholl Fellowship semifinalist, Austin Film Festival winner, etc.
- **Press**: 3 items — Deadline interview, Variety feature, IndieWire review
- **Testimonials**: 3 quotes from "producers" and "showrunners"
- **Representation**: Agent + Manager cards with company, name, email
- **Contact form**: Functional-looking form (non-submitting on demo)
- **CTA button**: "Read My Latest Script"

The page will use the `screenplay` theme and reuse all existing section components (`SectionLoglineShowcase`, `SectionScriptLibrary`, `SectionProjects`, `SectionAwards`, `SectionPress`, `SectionTestimonials`, `SectionRepresentation`) with the mock data passed directly as props.

**Files:**
- Create `src/pages/DemoScreenwriter.tsx` — standalone page composing PortfolioHero + all section components with mock data
- Update `src/App.tsx` — add route `/demo/screenwriter`
- Update `src/pages/Index.tsx` — add a "See a Live Example" CTA linking to the demo

### 2. Remaining Fixes & Improvements

**A. Section components need `items` prop passed directly (not fetched)**
Currently all section components receive data, which is good. But `PortfolioHero` and `PortfolioFooter` fetch social links internally. For the demo page, we'll pass social links as a prop (optional override).

**B. Missing fixes still needed:**
1. **Bio section renderer** — Add a `bio` case in `PortfolioSection` that renders a standalone bio block (for profiles that hide bio from hero)
2. **Contact section in section order** — Skip `contact` key in the section loop (already done) but ensure footer placement respects order
3. **Storage buckets** — Need migration to create `headshots`, `banners`, `gallery` buckets with public read policies

### 3. Implementation Approach

**DemoScreenwriter.tsx structure:**
```
- Apply screenplay theme to container
- Load Google Fonts for Courier
- Render PortfolioHero with mock profile + socialLinks prop
- Render each section component directly with mock arrays
- Render PortfolioFooter with mock profile
- Add a floating "Build Your Own" banner linking to /signup
```

All images will use high-quality Unsplash URLs (free, no API key needed). The page is entirely static/client-side — zero database calls.

### 4. Landing Page Integration

Add a prominent section on the landing page between the features grid and the CTA:
- "See What You Can Build" heading
- Screenshot/card preview linking to `/demo/screenwriter`
- "View Live Demo →" button

### Files to Create/Edit
1. **Create** `src/pages/DemoScreenwriter.tsx` — full demo page with mock data
2. **Edit** `src/App.tsx` — add `/demo/screenwriter` route
3. **Edit** `src/pages/Index.tsx` — add demo CTA section
4. **Edit** `src/components/portfolio/PortfolioHero.tsx` — accept optional `socialLinks` prop override
5. **Edit** `src/components/portfolio/PortfolioFooter.tsx` — accept optional `socialLinks` prop override

