

# Switch to logo.dev for High-Quality Company Logos

## Problem
SimpleIcons only has monochrome brand icons (not real company logos). Hunter.io returns low-quality compressed images. The result looks poor compared to what logo.dev provides: real, high-res, transparent company logos with built-in greyscale and theme support.

## Solution
Use **logo.dev** as the primary logo source. It's the official Clearbit successor with:
- High-res transparent PNG logos
- Built-in `greyscale`, `theme` (light/dark), `format`, `size` parameters
- Name-based lookup (no domain mapping needed): `https://img.logo.dev/name/Netflix?token=KEY`
- Domain-based lookup: `https://img.logo.dev/netflix.com?token=KEY`
- Publishable key (safe to store in codebase, like Stripe's `pk_` keys)

The free Community tier provides sufficient requests for this use case.

## Setup
1. You'll need to register at logo.dev and get a publishable token (starts with `pk_`)
2. Since it's a **publishable key**, it will be stored directly in the codebase (not as a secret)

## Changes

### 1. `src/lib/companyLogos.ts`
- Add `LOGO_DEV_TOKEN` constant (publishable key)
- Rewrite `getCompanyLogoUrl()` to return logo.dev URL:
  ```
  https://img.logo.dev/{domain}?token={TOKEN}&size=200&format=png
  ```
- Add `getCompanyLogoUrlWithMode()` that accepts a `LogoColorMode` and maps to logo.dev params:
  - `original` → no extra params
  - `greyscale` → `&greyscale=true`
  - `white` → `&greyscale=true&theme=dark`
  - `dark` → `&greyscale=true&theme=light`
  - `theme` → `&greyscale=true` (CSS tint via `sepia` + `hue-rotate` on top)
- Keep `COMPANY_DOMAINS` mapping for domain lookups
- Remove `SIMPLE_ICONS_SLUGS` mapping (no longer needed)
- Keep `getFaviconUrl()` as final fallback
- Simplify `LogoColorMode` type (same 5 options)

### 2. `src/components/CompanyLogo.tsx`
- Simplify to 3-stage fallback: **logo.dev** → **Google Favicon** → **Initials**
- Remove SimpleIcons logic entirely
- Pass `colorMode` to URL builder; logo.dev handles greyscale/theme natively
- For `theme` mode only, apply light CSS `sepia` filter to tint toward accent color
- Use `format=png` for transparency support

### 3. `src/components/portfolio/sections/SectionClientLogos.tsx`
- Keep `colorMode` prop and pass through to `CompanyLogo`
- Simplify CSS filter logic (logo.dev handles most modes natively)

### 4. `src/components/dashboard/CompanyLogoLibrary.tsx`
- Update to use new `getCompanyLogoUrl()` (already calls it, just needs source fix)

### 5. `src/pages/dashboard/ClientManager.tsx`
- Line 89 comment says "Clearbit" — update to "logo.dev"
- `getCompanyLogoUrl()` call already works, just source changes

### 6. `src/components/demo/DemoShared.tsx`
- No changes needed — `ClientLogosWithToggle` passes through to `SectionClientLogos`

### 7. Add global logo color mode to settings
- Add `client_logo_color_mode` column to profiles table (text, default 'original')
- Update `SettingsPage.tsx` to include a "Logo Display" selector with 5 options: Original, Greyscale, White, Dark, Theme
- Pass the saved mode through `PortfolioSection.tsx` → `SectionClientLogos`

## Technical Details
- logo.dev publishable keys are designed to be public (like Stripe `pk_` keys)
- URL format: `https://img.logo.dev/{domain}?token=pk_XXX&size=200&format=png&greyscale=true`
- Name lookup: `https://img.logo.dev/name/{brand}?token=pk_XXX&size=200&format=png`
- Free tier is sufficient; no billing required for community use
- `format=png` ensures transparency support
- Database migration: one `ALTER TABLE` to add the color mode preference

