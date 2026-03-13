

# Improve Company Logo Quality and Display Options

## Problem
Hunter.io logos are low-resolution and washed out compared to the original grayscale display. The API returns small, compressed images that look poor at display sizes. We also lack transparency support and enough display mode options.

## Solution
Switch to **logo.dev** (the official Clearbit successor) as primary source — it returns crisp, high-res logos with transparent backgrounds. Add more color mode options for the section.

**logo.dev** provides a free public tier at `https://img.logo.dev/{domain}?token=pk_X&size=200&format=png`. The `format=png` ensures transparency. However, this requires a free API token.

**Alternative without token**: Use **Google's favicon API at 256px** combined with a **curated SVG/PNG logo CDN** like `https://cdn.simpleicons.org/{brand}` (SimpleIcons — 3000+ brand SVGs, free, transparent, high quality).

**Best hybrid approach:**
1. **Primary**: SimpleIcons CDN (`https://cdn.simpleicons.org/{slug}`) — crisp SVGs, transparent, scalable
2. **Fallback**: Hunter.io (current) for companies not in SimpleIcons
3. **Final fallback**: Google favicon → initials

SimpleIcons covers all the major brands we use (Netflix, Disney, Apple, Microsoft, etc.) and returns perfect vector logos.

## Changes

### 1. `src/lib/companyLogos.ts`
- Add a `SIMPLE_ICONS_SLUGS` mapping for known companies (e.g., `"Netflix" → "netflix"`, `"Warner Bros" → "warnerbros"`)
- Update `getCompanyLogoUrl()` to return SimpleIcons URL as primary: `https://cdn.simpleicons.org/{slug}`
- Keep Hunter.io as secondary fallback
- Add a `getSimpleIconUrl()` function that accepts optional color parameter

### 2. `src/components/CompanyLogo.tsx`
- Update fallback chain: SimpleIcons SVG → Hunter.io → Google favicon → initials (4 stages)
- Add `colorMode` prop (`'original' | 'grayscale' | 'theme' | 'white' | 'dark'`)
- For SimpleIcons, append color to URL: `https://cdn.simpleicons.org/{slug}/{color}` — this gives us native color control without CSS filters (much crisper)
- `white` mode: append `/white` to SimpleIcons URL
- `dark` mode: append `/000000`
- `grayscale`: append `/999999`
- `theme`: append the theme's accent hex
- `original`: no color suffix (uses brand's official color)

### 3. `src/components/portfolio/sections/SectionClientLogos.tsx`
- Expand `ColorMode` type to include `'white' | 'dark'`
- Pass `colorMode` through to `CompanyLogo`
- Remove CSS filter approach for theme mode — use native SimpleIcons color instead

### 4. `src/components/demo/DemoShared.tsx`
- Update `ClientLogosWithToggle` to pass `colorMode` option (default `'original'`)

## Why SimpleIcons is Better
- **SVG format** — infinitely scalable, always crisp
- **Transparent backgrounds** — native
- **Built-in color control** — via URL parameter, no CSS filters needed
- **3000+ brands** — covers all our mapped companies
- **Free, no API key** — CDN hosted

