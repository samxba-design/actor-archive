

# Ocean Blue Readability, CTA Defaults, Hero Background Images, and Demo Customization

## Issues Identified

1. **Ocean Blue hero text unreadable** — `bgHero: '#1A2840'` is dark but text in the hero section can still lack contrast depending on hero background mode. When `heroBgType` is `bokeh` (the copywriter default), the gradient blend of `bgPrimary (#F5F8FC)` and `bgHero (#1A2840)` creates mid-tones where white text washes out.

2. **CTA default too aggressive** — Ocean Blue sets `ctaStyle: 'filled-bold'` (solid accent fill). Default should be more subtle like `'shine-sweep'` (glass-like shimmer effect).

3. **No CTA style picker in demo panel** — Users can change the CTA label text but not the visual button style (outlined, glow-pulse, shine-sweep, etc.). This should be customizable.

4. **Copywriter demo doesn't show client logos at top** — Default `clientLogosPosition` is `body_section`, should be `below_hero` or `above_sections` for copywriter.

5. **No hero background image support** — Current `heroBgType` options are: preset gradient, solid color, bokeh, video loop, animated gradient. There's no "stock image" or "custom image" option. Users can upload a banner via `HeroBackgroundEditor`, but there's no curated library of stock backgrounds, and demo pages can't showcase this.

## Plan

### 1. Fix Ocean Blue Theme Readability

**File: `src/themes/themes.ts`** — Update the ocean-blue theme:
- Change `bgHero` from `#1A2840` to `#0F1A2E` (darker navy for better scrim contrast)
- Adjust `heroOverlayGradient` to use stronger opacity stops
- Change default `ctaStyle` from `'filled-bold'` to `'shine-sweep'` (subtle glass shimmer)

### 2. Add CTA Style Picker to Demo Customization

**File: `src/components/demo/DemoShared.tsx`**:
- Add `ctaStyle` to `SectionVariants` type: `'text-link' | 'outlined' | 'filled-subtle' | 'underlined' | 'glow-pulse' | 'shine-sweep' | 'neon-border' | 'filled-bold'`
- Add to `VARIANT_OPTIONS` with labels
- Default to `'shine-sweep'`

**File: `src/components/demo/DemoCustomizationPanel.tsx`**:
- Add CTA Style row under CTA category: `{ key: "ctaStyle", label: "Style" }`

**File: Demo pages (all 3)**:
- Pass `variants.ctaStyle` to override the theme's `ctaStyle` on the rendered portfolio. This requires the demo pages to dynamically override the theme's CTA style.

### 3. Set Copywriter Default Client Logos to Top

**File: `src/pages/DemoCopywriter.tsx`**:
- Change `copywriterDefaultVariants.clientLogosPosition` from default (`body_section`) to `'below_hero'`

### 4. Add Hero Background Image Support with Stock Library

**New concept: `heroBgType: 'image'`** — A new background mode that uses a curated stock image with a dark overlay for text readability.

**File: `src/components/demo/DemoShared.tsx`**:
- Add `'image'` to `HeroBgType` union
- Add `heroBgImage` to `SectionVariants`: string key selecting from a stock library
- Add `STOCK_HERO_IMAGES` constant: ~12 curated Unsplash images (via direct URLs) covering:
  - Film/cinema: dark theater, film reels, movie set lights
  - Urban: city skyline at night, aerial city, moody streets  
  - Abstract: dark textures, ink in water, light trails
  - Creative: desk workspace, typewriter, studio lighting
  - Nature: misty mountains, ocean waves, golden hour landscapes
- Add to `VARIANT_OPTIONS` for both `heroBgType` (add 'Image' option) and `heroBgImage` (the stock picks)

**File: `src/components/demo/DemoCustomizationPanel.tsx`**:
- Add `heroBgImage` to HERO_CATEGORY keys (only visible when `heroBgType === 'image'`)

**File: `src/components/portfolio/PortfolioHero.tsx`**:
- Add `heroBgImage?: string` prop
- Add `case 'image'` in `renderBackground()` that renders the stock image URL with a dark scrim overlay (same treatment as uploaded banner images)

**File: `src/components/dashboard/HeroBackgroundEditor.tsx`**:
- Add `'image'` to `BG_MODES`
- Add stock image grid picker when mode is 'image'
- Users can also upload their own (existing upload functionality already works for banners)

**File: Database migration**:
- Add `hero_bg_image_url` column to profiles for users who pick a stock image or custom URL

### 5. All Demo Pages — Wire Up New Features

**Files: `DemoScreenwriter.tsx`, `DemoActor.tsx`, `DemoCopywriter.tsx`**:
- Pass `heroBgImage` prop to PortfolioHero based on `variants.heroBgImage`
- Override theme `ctaStyle` with `variants.ctaStyle`

### Stock Hero Images List

```text
Cinema:      Dark theater seats, Film projector light, Behind-the-scenes set
Urban:       City skyline night, Moody alley neon, Aerial downtown
Abstract:    Dark marble texture, Ink clouds in water, Light trails
Creative:    Vintage typewriter, Studio lighting setup, Coffee & notebook
Nature:      Misty forest, Ocean at dusk, Mountain ridge golden hour
```

Each image served from Unsplash with `w=1920&q=80` for quality + performance.

### Files Summary

| File | Change |
|------|--------|
| `src/themes/themes.ts` | Fix ocean-blue: darker bgHero, stronger overlay, shine-sweep CTA default |
| `src/components/demo/DemoShared.tsx` | Add `ctaStyle` + `heroBgImage` to variants, add `'image'` to HeroBgType, add `STOCK_HERO_IMAGES` constant |
| `src/components/demo/DemoCustomizationPanel.tsx` | Add CTA Style row, add Background Image row (conditional) |
| `src/components/portfolio/PortfolioHero.tsx` | Add `heroBgImage` prop, add `case 'image'` background renderer |
| `src/components/dashboard/HeroBackgroundEditor.tsx` | Add 'Image' mode with stock image grid picker |
| `src/pages/DemoCopywriter.tsx` | Set `clientLogosPosition: 'below_hero'`, wire ctaStyle + heroBgImage |
| `src/pages/DemoScreenwriter.tsx` | Wire ctaStyle + heroBgImage |
| `src/pages/DemoActor.tsx` | Wire ctaStyle + heroBgImage |
| Migration | Add `hero_bg_image_url` to profiles |

