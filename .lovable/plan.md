

# Add Comprehensive Logo Customization + Fix Missing Logos

## Issues Found

1. **Copywriter demo DOES have logos** — `ClientLogosWithToggle` is used with `mockClients` containing Apple, Microsoft, Shopify, etc. If they're not showing, it's likely a rendering/scroll issue or the section is below the fold. All three demos (Actor, Screenwriter, Copywriter) use `ClientLogosWithToggle`.

2. **No colorMode customization exposed** — The `SectionClientLogos` component accepts `colorMode` and `variant` props, but:
   - The demo `ClientLogosWithToggle` only toggles `variant` (bar/grid/marquee), never `colorMode`
   - `PortfolioSection.tsx` line 430 passes NO variant or colorMode to `SectionClientLogos`
   - No size control exists anywhere

3. **Limited customization surface** — Currently only 3 variants (bar, grid, marquee) and 5 color modes exist, with no size or opacity controls.

## Plan

### 1. Expand `SectionClientLogos` props
Add `logoSize` prop (`'sm' | 'md' | 'lg' | 'xl'`) that maps to pixel sizes (20, 28, 36, 48). Keep existing `variant` and `colorMode` props.

### 2. Add `colorMode` toggle to demo `ClientLogosWithToggle`
Update `DemoShared.tsx` to add a second options bar for color mode (Original, Grayscale, White, Dark, Theme) alongside the existing variant bar. This makes the demo interactive for logo styling.

### 3. Add `logoColorMode` to `SectionVariants`
Add `logoColorMode` and `logoSize` to the variants context so demos can toggle these independently.

### 4. Fix `PortfolioSection.tsx` passthrough
Line 430 currently ignores variant/colorMode. Pass stored section preferences through to `SectionClientLogos`.

### 5. Verify all three demos show logos
Confirm Actor, Screenwriter, and Copywriter demos all render `ClientLogosWithToggle`. All three already do — Actor via `demoActorData`, Screenwriter via `demoScreenwriterData`, Copywriter via `demoCopywriterData`.

## Files to Edit

| File | Change |
|------|--------|
| `src/components/portfolio/sections/SectionClientLogos.tsx` | Add `logoSize` prop with sm/md/lg/xl mapping |
| `src/components/demo/DemoShared.tsx` | Add `logoColorMode` and `logoSize` to `SectionVariants`; update `ClientLogosWithToggle` to render color mode + size toggles |
| `src/pages/DemoActor.tsx` | Ensure `ClientLogosWithToggle` is rendered (verify) |
| `src/pages/DemoScreenwriter.tsx` | Already uses it — no change |
| `src/pages/DemoCopywriter.tsx` | Already uses it — no change |
| `src/components/portfolio/PortfolioSection.tsx` | Pass variant/colorMode to `SectionClientLogos` from profile settings |

## Customization Options Summary

**Layout variants**: Bar, Grid, Marquee (existing)
**Color modes**: Original, Grayscale, White, Dark, Theme-tinted (existing, now exposed)
**Sizes**: Small, Medium, Large, Extra Large (new)

All togglable in demos via the existing `SectionOptionsBar` pattern.

