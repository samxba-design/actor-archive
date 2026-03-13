

# Fix: Show Company Logos in Full Color by Default

## Problem
`CompanyLogo` defaults to `grayscale = true` and `SectionClientLogos` always passes `grayscale` — so all logos appear black & white. They should show in their original colors by default.

## Changes

### 1. `src/components/CompanyLogo.tsx`
- Change default `grayscale` prop from `true` to `false`

### 2. `src/components/portfolio/sections/SectionClientLogos.tsx`
- Add `colorMode` prop: `'original' | 'grayscale' | 'theme'` (default `'original'`)
- `original`: no filter — full color logos
- `grayscale`: current behavior — grayscale with color on hover
- `theme`: apply a CSS filter to tint logos toward the theme's accent color
- Remove hardcoded `grayscale` class from the custom `logo_url` img tag
- Pass `grayscale={colorMode === 'grayscale'}` to `CompanyLogo`
- For `theme` mode, apply a CSS `filter: grayscale(1) sepia(1) hue-rotate(...)` based on theme accent

### 3. Demo data files (no changes needed)
The demo pages already pass companies to `SectionClientLogos` — once the default changes to full color, they'll show correctly.

This is a small, focused change — ~15 lines across 2 files.

