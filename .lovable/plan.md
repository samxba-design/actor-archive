

## Add Section Display Toggles to Every Element on Demo Page

### Overview
Extend the `SectionOptionsBar` toggle pattern (already working for Known For) to every section on the demo page, giving visitors a clear preview of the extensive customization possibilities. Each section gets multiple display variants that showcase different ways to present the same content.

### Section Variant Definitions

| Section | Variants | Description |
|---|---|---|
| **Logline Showcase** | `editorial` (default), `cards`, `minimal` | Editorial = current hover-bar style; Cards = boxed glass cards per logline; Minimal = title + logline only, no metadata |
| **Script Library** | `detailed` (default), `grid`, `compact` | Detailed = current featured+list; Grid = poster-style grid cards; Compact = single-line rows |
| **Produced Credits** | `hero` (default), `poster`, `table`, `timeline` | Hero = featured card + list; Poster = poster grid; Table = compact rows; Timeline = year-grouped |
| **Awards** | `list` (default), `grid`, `laurels` | List = current; Grid = card grid with large icons; Laurels = horizontal laurel-wreath style badges |
| **Testimonials** | `carousel` (default), `cards`, `wall`, `single` | Carousel = rotating; Cards = grid; Wall = masonry-style stacked quotes; Single = one large featured quote |
| **Press** | `feed` (default), `cards`, `quotes` | Feed = current list; Cards = boxed with images; Quotes = pull-quote focused |
| **Services** | `full` (default), `compact`, `pricing` | Full = current grid; Compact = accordion; Pricing = side-by-side comparison table |
| **Client Logos** | `bar` (default), `grid`, `marquee` | Already supported, just needs toggle bar |
| **Hero** | Shows options for `Full`/`Compact` hero + background preset toggles via SectionOptionsBar at top of hero |

### Implementation Strategy

**1. Add variant props to section components** -- Each section component gets an optional `variant` prop. Default behavior stays unchanged. New variants are additional render paths within the same component.

**2. Create variant context in DemoScreenwriter** -- Similar to `KnownForVariantCtx`, create a single `SectionVariantsCtx` context that holds all variant states:
```typescript
interface SectionVariants {
  loglines: string;
  scripts: string;
  credits: string;
  awards: string;
  testimonials: string;
  press: string;
  services: string;
  clientLogos: string;
}
```

**3. Wrap each section with SectionOptionsBar in all layouts** -- Create wrapper components (like `KnownForWithToggle`) for each section that renders the toggle bar + the section with the selected variant.

### Files to Change

| File | Change |
|---|---|
| `src/pages/DemoScreenwriter.tsx` | Add `SectionVariantsCtx`, create wrapper components for each section, replace direct section usage with wrapped versions in all 10 layouts |
| `src/components/portfolio/sections/SectionLoglineShowcase.tsx` | Add `variant` prop with `cards` and `minimal` render paths |
| `src/components/portfolio/sections/SectionAwards.tsx` | Add `variant` prop with `grid` and `laurels` render paths |
| `src/components/portfolio/sections/SectionTestimonials.tsx` | Add `variant` prop with `wall` and `single` render paths |
| `src/components/portfolio/sections/SectionPress.tsx` | Add `variant` prop with `cards` and `quotes` render paths |
| `src/components/portfolio/sections/SectionServices.tsx` | Add `variant` prop with `pricing` render path (compact already exists) |
| `src/components/portfolio/sections/SectionScriptLibrary.tsx` | Add `variant` prop with `grid` and `compact` render paths |
| `src/components/portfolio/sections/SectionProjects.tsx` | Already has `layout` prop (poster/table/grid) -- just needs SectionOptionsBar wrapper on demo |
| `src/components/portfolio/sections/SectionClientLogos.tsx` | Already has `variant` prop -- just needs SectionOptionsBar wrapper on demo |

### Variant Details

**Loglines - `cards` variant**: Each logline in a glass card with format badge, genre tags, page count, and status badge. 2-column grid on desktop.

**Loglines - `minimal` variant**: Just title and logline text, large typography, generous whitespace. No tags/metadata.

**Awards - `grid` variant**: 2x3 card grid, each award in its own card with large icon, result badge, and organization.

**Awards - `laurels` variant**: Horizontal scrolling row of laurel-wreath style circular badges (like film festival laurels on movie posters).

**Testimonials - `wall` variant**: All quotes visible simultaneously in a masonry-like layout with varying sizes.

**Testimonials - `single` variant**: One large featured testimonial with oversized quotation marks, photo, and attribution.

**Press - `cards` variant**: Each press item as a glass card with publication logo placeholder, star rating, and read link.

**Press - `quotes` variant**: Pull-quote focused -- only shows items with pull_quotes, displayed as large italic text with attribution.

**Services - `pricing` variant**: Side-by-side comparison columns with feature checkmarks, pricing at top, turnaround at bottom.

**Scripts - `grid` variant**: Poster-style cards with genre color coding, page count badge overlay, access level indicator.

**Scripts - `compact` variant**: Single-line rows: title | format | pages | access level | action button.

### Architecture Notes
- All new variant render paths live inside their existing section component files -- no new files needed besides DemoScreenwriter changes
- The `SectionOptionsBar` is only rendered on the demo page (controlled by context), never on real user profiles
- Each variant is self-contained CSS/React -- no new animation libraries needed
- The same `variant` prop pattern can later be saved to the user's profile for their chosen display preference

