

# Add New Themes, Change Demo Defaults, Enhance Theme Previews

## Current State
- 9 themes total: 4 dark (cinematic-dark, noir-classic, midnight-glass, noir), 5 light/mixed (warm-luxury, modern-minimal, mediterranean, frost, azure-glass, pearl)
- All 3 demo pages default to `cinematic-dark` — too dark for first impression
- Theme picker shows only 3 color dots per theme — no graphical preview of what the portfolio looks like
- Landing page uses a distinctive dark rose/champagne palette (`--landing-bg: 345 25% 8%`, accent `350 40% 58%`) that has no matching portfolio theme

## New Themes to Add (8 total → bringing library to 17)

| Theme | Palette | Typography | Style Notes |
|-------|---------|-----------|-------------|
| **Creative Rose** | Dark rose bg (#1E0F14), champagne text, rose accent — matches landing page exactly | Playfair Display + Inter | Parallax, glow-pulse CTA, glass cards — the "homepage" theme |
| **Ocean Blue** | Light cream-white bg (#F5F8FC), navy text, natural blue (#2563EB) accent | DM Sans + DM Sans | Clean, professional, perfect copywriter default |
| **Frontier** | Aged parchment bg (#F0E4D0), dark brown text (#3B2A1A), burnt sienna accent (#8B4513) | Libre Baskerville + Source Sans 3 | Rustic, western, textured feel. Thick-line dividers, 0px card radius |
| **Gothic** | Near-black bg (#0C0A0E), pale violet text (#D8D0E0), deep purple accent (#6B21A8) | Cinzel + Inter | Dramatic, ornate. Editorial section numbers, gradient dividers |
| **Sage Studio** | Soft sage green bg (#F0F4F0), dark forest text (#1A2E1A), muted green accent (#4A7A5A) | Lora + Inter | Natural, calming. Great for wellness/lifestyle creatives |
| **Sunset Warmth** | Warm peach bg (#FFF5EE), rich brown text (#2D1810), coral accent (#E8725C) | Poppins + Poppins | Friendly, inviting. Rounded cards (12px), filled-subtle CTA |
| **Slate Pro** | Cool gray bg (#F4F5F7), charcoal text (#1E2028), steel blue accent (#4A6FA5) | IBM Plex Sans + IBM Plex Sans | Corporate-clean, no-nonsense. Static animations, minimal section numbers |
| **Neon Noir** | Pure black bg (#050505), white text, electric cyan accent (#00E5FF) | Space Grotesk + Inter | Futuristic, high-energy. Glow cards, neon-border CTA, glass enabled |

## Demo Default Changes

| Demo | New Default Theme | Rationale |
|------|------------------|-----------|
| Screenwriter | `creative-rose` | Matches homepage aesthetic, dramatic and cinematic |
| Copywriter | `ocean-blue` | Clean, professional, blue — as requested |
| Actor | `cinematic-dark` | Keep dark for actors — dramatic, headshot-forward feel works |

## Enhanced Theme Previews in ThemeSwitcher

Replace the 3 color dots with a **mini graphical preview strip** per theme:
- A small 180×48px rectangle showing the theme's `bgPrimary` as background, with:
  - A thin accent-colored bar at the top
  - Theme name in the theme's `fontDisplay` font
  - A small text sample in `textSecondary`
  - Border using the theme's `borderDefault`
- This gives users an instant visual sense of each theme's personality

## Files to Change

| File | Change |
|------|--------|
| `src/themes/themes.ts` | Add 8 new theme definitions, update exports, add to legacy map |
| `src/components/portfolio/ThemeSwitcher.tsx` | Replace color dots with mini graphical preview strips |
| `src/pages/DemoScreenwriter.tsx` | Change default from `cinematic-dark` to `creative-rose` |
| `src/pages/DemoCopywriter.tsx` | Change default from `cinematic-dark` to `ocean-blue` |
| `src/pages/Index.tsx` | Update "10+ Stunning Themes" to "17 Stunning Themes" |

No database changes needed — themes are purely frontend.

