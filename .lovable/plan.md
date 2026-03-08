

## Image Animation Toggles + Hero Identity Customization

### Part 1: Global Image Animation System

Add a new `imageAnimation` key to `SectionVariants` with options that apply to all poster/image areas across the portfolio:

| Animation | Description |
|---|---|
| `none` | Static, no animation |
| `pulse` | Slow scale pulse (1.0 → 1.03 → 1.0, 4s cycle) |
| `drift` | Ken Burns-style slow pan/zoom within frame |
| `glass` | Glassmorphism overlay with frosted border glow |
| `shine` | Light sweep animation across image surface |
| `fade` | Soft fade-in on scroll with opacity transition |
| `tilt` | Subtle 3D perspective tilt on hover |

**Implementation:**
- Add CSS keyframes for `pulse`, `drift`, `shine`, `tilt` in `index.css`
- Create a utility function `getImageAnimationStyle(animation: string)` that returns the appropriate CSS classes/inline styles
- Apply to `PosterCard` in `SectionKnownFor.tsx`, gallery images in `SectionGallery.tsx`, credit posters in `SectionProjects.tsx`, and the hero featured project poster
- Add a `SectionOptionsBar` toggle at the top of the demo page (or as a global bar) labeled "Image Effects" with the 7 options
- Pass the selected animation through `SectionVariantsCtx`

### Part 2: Hero Identity Section — 10+ Layout Variants

Add a `heroLayout` key to `SectionVariants` with these options:

| Layout | Description |
|---|---|
| `classic` | Current: photo left, name + bio right, featured project far right |
| `centered` | Photo centered above, name centered, bio centered, CTA centered below |
| `split` | Full 50/50 split — left: photo + name, right: bio + CTA |
| `minimal` | No photo, just large name + tagline, ultra-clean |
| `banner` | Name overlaid on full-width banner, photo floating bottom-left |
| `sidebar` | Vertical sidebar-style: photo stacked above name, bio, CTA in narrow column, featured takes remaining width |
| `editorial` | Large serif name spanning full width, small photo + meta below in editorial magazine style |
| `card` | Everything contained in a single elevated card, centered on page |
| `stacked` | Everything full-width stacked: known for → name → tagline → bio → CTA → featured, no columns |
| `cinematic` | Name huge and semi-transparent behind photo, dramatic layering |
| `compact` | Already exists — small height, condensed info |

**Implementation:**
- Add `heroLayout` to `SectionVariants` and `VARIANT_OPTIONS`
- Create a `HeroWithToggle` wrapper that renders `SectionOptionsBar` above the hero
- Pass `heroLayout` to `PortfolioHero` as a prop
- Implement the 10 render paths inside `PortfolioHero.tsx` (refactor the content area at lines 161-460)

### Part 3: Hero Right-Side Content Toggle

The featured project area (right column) should be swappable. Add a `heroRightContent` key:

| Option | Description |
|---|---|
| `featured` | Current featured project card |
| `services` | Shows top 1-2 services as compact cards |
| `stats` | Stats prominently displayed in the right column |
| `testimonial` | A single pull-quote testimonial |
| `none` | No right column, identity takes full width |

**Implementation:**
- Add to `SectionVariants` and pass through context
- In `PortfolioHero`, conditionally render different right-column content based on selection
- On demo page, wrap with toggle bar

### Part 4: CTA Button Customization Toggle

Show that the CTA button is fully customizable with preset label examples:

| Preset | Label |
|---|---|
| `script` | "Read My Latest Script" (current) |
| `hire` | "Hire Me" |
| `contact` | "Get in Touch" |
| `reel` | "Watch My Reel" |
| `book` | "Book a Consultation" |
| `custom` | "View My Work" |

**Implementation:**
- Add `ctaPreset` to `SectionVariants`
- Add toggle bar above or near the CTA button area
- When toggled, update `mockProfile.cta_label` dynamically in DemoScreenwriter

### Part 5: Known For in Hero Toggle

Add a `heroKnownFor` key to control the Known For display in the hero area:

| Option | Description |
|---|---|
| `strip` | Current small poster strip above name |
| `large` | Larger posters (120px wide) with more info |
| `text` | Text-only badges showing title + role |
| `hidden` | Don't show known for in hero (only in section below) |

### Files to Change

| File | Change |
|---|---|
| `src/index.css` | Add keyframes for `img-pulse`, `img-drift`, `img-shine`, `img-tilt` |
| `src/components/portfolio/sections/SectionKnownFor.tsx` | Accept `imageAnimation` prop, apply to `PosterCard` |
| `src/components/portfolio/PortfolioHero.tsx` | Add `heroLayout` prop with 10 render variants, `heroRightContent` prop, `heroKnownFor` prop |
| `src/components/portfolio/PortfolioCTA.tsx` | No changes needed (already accepts label) |
| `src/pages/DemoScreenwriter.tsx` | Expand `SectionVariants` with `imageAnimation`, `heroLayout`, `heroRightContent`, `ctaPreset`, `heroKnownFor`. Add toggle bars for each. Pass `heroLayout` to `PortfolioHero`. Dynamically set CTA label based on `ctaPreset` |
| `src/components/portfolio/SectionOptionsBar.tsx` | No changes needed |

### Scope

This is a large change touching 5 files. The hero layout variants are the biggest piece — each variant restructures the same data (name, photo, tagline, bio, CTA, rep, social links, stats) into different visual arrangements. The image animation system is a cross-cutting concern applied via CSS classes. All toggles use the existing `SectionOptionsBar` + `SectionVariantsCtx` pattern.

