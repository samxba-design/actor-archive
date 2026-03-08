

## Compact Layout Fix + Known For Carousel + Cross-Template Audit

### Problems Identified

1. **Compact layout — bottom 3-column grid is cramped**: Awards, Press, and Testimonials are squeezed into `lg:grid-cols-3` with no breathing room. The Known For images in the hero sit too close to the stats text on the left.

2. **No Known For section above the name**: The user wants a prominent Known For poster display in the hero area, positioned above the name/identity block — not just tiny thumbnails next to the stats bar at the bottom.

3. **Known For images need carousel with dynamic motion**: Currently a static `flex` row. Should use embla-carousel (already installed) for smooth auto-scrolling, drag-to-scroll, and a polished feel.

4. **Cross-template issues found during audit**:
   - **Compact**: 3-col bottom grid too tight; Known For not included at all in body
   - **Standard**: Known For strip at top looks OK but no carousel motion
   - **Spotlight**: Known For in accordion — loses visual impact
   - **Minimal**: No client logos by design, but Known For could benefit from carousel
   - **Dashboard**: Known For inside GlassCard is cramped at half-width
   - All layouts use static `flex` for Known For — none have dynamic carousel feel

### Plan

#### 1. Add Known For carousel variant to `SectionKnownFor.tsx`
- Add `variant: 'carousel'` option using embla-carousel-react (already installed)
- Auto-play with slow continuous scroll, pause on hover
- Smooth drag interaction, loop enabled
- Prev/Next arrows on hover (using existing Carousel UI components or custom minimal arrows)

#### 2. Add Known For above name in `PortfolioHero.tsx`
- Move the hero Known For from below stats bar to **above** the identity block
- Full-width row of poster thumbnails at top of hero content area, above the photo+name
- Use the new carousel variant for smooth auto-scrolling motion
- Keep it compact (60-70px poster width) so it doesn't overwhelm the name

#### 3. Fix Compact layout in `DemoScreenwriter.tsx`
- Change bottom section from `lg:grid-cols-3` to `lg:grid-cols-[1fr_1fr_auto]` or `lg:grid-cols-2` with testimonials below
- Add proper spacing (`gap-6` instead of `gap-4`)
- Add a Known For carousel section in the compact layout body
- Move Known For images away from being jammed next to text — give them their own row with `justify-end` or `ml-auto` alignment

#### 4. Apply carousel variant across layouts
- Classic, Standard, Cinematic, Compact: use `variant="carousel"` for Known For strips
- Bento, Dashboard: keep grid/strip in constrained spaces
- Spotlight: keep in accordion but use carousel inside

### Files to Edit

| File | Changes |
|---|---|
| `src/components/portfolio/sections/SectionKnownFor.tsx` | Add `carousel` variant using embla-carousel with auto-play, loop, drag |
| `src/components/portfolio/PortfolioHero.tsx` | Move Known For from stats bar to above-name position; use carousel variant |
| `src/pages/DemoScreenwriter.tsx` | Fix Compact layout grid spacing; add Known For to Compact; switch strip→carousel across layouts |

