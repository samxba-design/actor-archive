

# Fix Company Logos: Switch from Dead Clearbit to Hunter.io Logo API

## Problem
The Clearbit Logo API (`logo.clearbit.com`) is shut down. All company logos show only text names with no images.

## Solution
Switch to **Hunter.io's free Logo API** (`https://logos.hunter.io/{domain}`). It's free, requires no API key, no signup, and returns real high-res company logos. Verified it returns valid WEBP images for disney.com, netflix.com, etc.

## Changes

### 1. `src/lib/companyLogos.ts`
- Change `getCompanyLogoUrl()` to use `https://logos.hunter.io/{domain}` instead of `https://logo.clearbit.com/{domain}?size={size}`
- The Hunter.io API doesn't take a size parameter -- it returns a standard high-res logo
- Keep `getFaviconUrl()` as-is for fallback
- Update `fetchCompanyLogo()` to use the new URL

### 2. `src/components/CompanyLogo.tsx`
- Add fallback chain: if Hunter.io logo fails to load, try Google favicon (`getFaviconUrl`), then show styled initials
- Use `useState` to track fallback state instead of hiding broken images

### 3. `src/components/dashboard/CompanyLogoLibrary.tsx`
- Update to use `getCompanyLogoUrl()` which will now point to Hunter.io (already does, just needs the source fix)

### 4. `src/components/portfolio/sections/SectionClientLogos.tsx`
- Update the custom logo `img` fallback behavior to match the improved `CompanyLogo` pattern

No database changes needed. No API keys needed.

