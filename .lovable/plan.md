

## Plan: Add Background Type Toggle to Demo Profiles

### Current State
The demo profiles already have a robust `SectionVariantsCtx` system with a `SectionOptionsBar` toggle UI. This powers toggleable options for hero layouts, section variants, image animations, etc. The new background types (Solid, Bokeh, Video, Gradient) are **not yet exposed** in this demo customization system.

### What Changes

**1. Extend `SectionVariants` with a `heroBgType` key**
In `DemoShared.tsx`, add `heroBgType: 'preset' | 'solid' | 'bokeh' | 'video' | 'gradient'` to the variants interface and default it to `'preset'`.

**2. Add a "Background" toggle row to the demo options bar**
In the `WithToggle` wrapper or the hero section area of each demo page, render a `SectionOptionsBar` for "Background" with options: Preset, Solid Color, Bokeh + Spotlight, Video Loop, Animated Gradient.

**3. Wire the toggle into `PortfolioHero`**
Pass the selected `heroBgType` as a prop to `PortfolioHero`. The hero component will render the corresponding background based on the selected type — this uses the same rendering logic being built for real profiles.

**4. Demo-specific defaults**
Each demo profile type can showcase different defaults:
- Screenwriter demo → preset (current behavior)
- Copywriter demo → bokeh
- Actor demo → video or gradient

This means visitors can cycle through all background modes on any demo page, seeing exactly how their profile could look — same as how they currently toggle between hero layouts, section variants, and image effects.

### Files to Modify
- `src/components/demo/DemoShared.tsx` — add `heroBgType` to variants context + default
- `src/pages/DemoScreenwriter.tsx` — pass `heroBgType` to hero, add toggle
- `src/pages/DemoCopywriter.tsx` — same
- `src/pages/DemoActor.tsx` — same
- `src/components/portfolio/PortfolioHero.tsx` — accept and render `heroBgType` prop

All toggles use the existing `SectionOptionsBar` component — no new UI patterns needed.

