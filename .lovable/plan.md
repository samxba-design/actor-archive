

## Portfolio Page Visual Overhaul

### Problems Identified

1. **Produced Credits section**: Text blends into card backgrounds — the "Ink" theme uses warm cream tones (`40 30% 96%` bg, `40 25% 93%` card bg) with brown text (`30 15% 15%`), but the card content area has almost no contrast separation. The role name, year, genre tags all blend together. The card layout is generic — same grid card as any project.

2. **Flat, static design**: Every section uses the same card-in-grid pattern. No visual rhythm, no section dividers, no decorative elements. The page reads like a form, not a portfolio.

3. **No background atmosphere**: The page is a flat solid color with zero texture or motion. For a film/screenwriter portfolio this feels lifeless.

4. **Weak iconography**: Using tiny Lucide icons (4px strokes) that disappear against the warm palette. No distinctive visual markers per section.

5. **Section headings are plain**: Just bold text, no decorative treatment. No horizontal rules, no numbering, no accent flourishes.

6. **Font usage is underutilized**: The Ink theme specifies Georgia for both heading and body, but the demo loads Playfair Display + Source Serif 4 without actually applying them to the container properly.

### Plan

#### 1. Subtle cinematic background — toggleable
Create `src/components/portfolio/PortfolioBackground.tsx`:
- Animated film-grain texture (CSS-only, very subtle 2-3% opacity)
- Slow-drifting light leak / bokeh overlay using CSS gradients
- Optional: subtle animated film strip border on edges
- Controlled by a small toggle button (bottom-right corner, film reel icon)
- State stored in localStorage, default ON
- All effects use `pointer-events: none`, `position: fixed`

#### 2. Overhaul Produced Credits (`SectionProjects` when `isCredits`)
- **Hero credit card**: Full-width with large backdrop image, overlay gradient, network/studio logo badge, role prominently displayed in accent color with larger font
- **Remaining credits**: Horizontal card layout (image left, content right) instead of small grid cards
- Network/studio name displayed as a prominent badge (e.g., "HBO", "FX", "A24")
- Role name gets a distinct pill/badge treatment with accent background
- Year displayed as a large number element
- Better contrast: use darker overlay on images, ensure text is white/light on dark cards

#### 3. Section heading redesign
Update `PortfolioSection.tsx` and the demo's `Section` wrapper:
- Add a thin accent-colored horizontal rule after heading
- Add subtle section numbering (01, 02, 03...) in muted color
- Slightly larger heading size with letter-spacing

#### 4. Visual rhythm + section dividers
- Add alternating subtle background tints to sections (every other section gets a slightly different bg)
- Add decorative quote marks / film icons as section-specific flourishes
- More generous spacing between sections

#### 5. Improve card contrast across all section components
- `SectionLoglineShowcase`: Add left accent border instead of just flat card
- `SectionAwards`: Make award icons larger, add laurel wreath styling, result badge more prominent
- `SectionPress`: Publication name in bold accent, pull quotes with larger styled quotation marks
- `SectionTestimonials`: Larger quote marks, more dramatic spacing
- `SectionServices`: Featured service gets a glow/gradient accent treatment
- `SectionRepresentation`: Company logos larger, rep type badge more visible

#### 6. Fix demo page font loading
- Actually apply Playfair Display + Source Serif 4 to the container's CSS variables in `DemoScreenwriter.tsx`

### Files to Create
- `src/components/portfolio/PortfolioBackground.tsx`

### Files to Edit
- `src/components/portfolio/sections/SectionProjects.tsx` — credits-specific layout overhaul
- `src/components/portfolio/PortfolioSection.tsx` — section heading redesign with numbering + accent rule
- `src/components/portfolio/sections/SectionLoglineShowcase.tsx` — accent border, better contrast
- `src/components/portfolio/sections/SectionAwards.tsx` — larger icons, result badges
- `src/components/portfolio/sections/SectionPress.tsx` — bolder publication treatment
- `src/components/portfolio/sections/SectionTestimonials.tsx` — larger decorative quotes
- `src/components/portfolio/sections/SectionServices.tsx` — featured glow
- `src/components/portfolio/sections/SectionRepresentation.tsx` — better badge styling
- `src/pages/DemoScreenwriter.tsx` — add PortfolioBackground, fix fonts, pass section index for numbering
- `src/pages/PublicProfile.tsx` — add PortfolioBackground

