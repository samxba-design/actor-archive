

# Remove Fallbacks, Add Retina + More Color Modes

## Current State
The code **is** already using logo.dev correctly with the token `pk_WI7pAXJIQ5-QD8yVHEfJYQ`. The URL structure is right: `https://img.logo.dev/{domain}?token=...&size=200&format=png`.

## What's Wrong
1. **Fallback chain still exists** — on `onError`, it falls back to Google Favicon then initials. logo.dev already returns its own monogram fallback for unknown domains, so we should trust it entirely.
2. **Missing `retina=true`** — logo.dev docs say without this, logos appear blurry on high-density displays. Your viewport has `devicePixelRatio: 2.8125`, so this is critical.
3. **Limited color/style modes** — only 5 modes. logo.dev supports more combinations.

## Changes

### 1. `src/lib/companyLogos.ts`
- Add `retina=true` to all logo.dev URLs (doubles resolution for sharp display on HiDPI screens)
- Remove `getFaviconUrl()` function entirely
- Keep the same `LogoColorMode` type but document the full set:
  - `original` — full color logo
  - `grayscale` — desaturated (`greyscale=true`)
  - `white` — white logo for dark backgrounds (`theme=light&format=png`)
  - `dark` — dark logo for light backgrounds (`theme=dark&format=png`)
  - `theme` — grayscale + CSS sepia tint toward accent color

### 2. `src/components/CompanyLogo.tsx`
- **Remove all fallback stages** — no favicon, no initials. Just render the logo.dev `<img>` directly.
- logo.dev returns a monogram automatically for unknown domains (HTTP 200), so `onError` is unnecessary for most cases. Keep a minimal `onError` that just hides the image if it truly 404s (network error).
- Remove the `useState` stage tracking entirely.

### 3. `src/components/portfolio/sections/SectionClientLogos.tsx`
- No changes needed — it already passes `colorMode` through correctly.

### 4. `src/components/demo/DemoShared.tsx`
- Update `ClientLogosWithToggle` to pass `colorMode` through so demo users can see the modes in action.

## Summary
Two surgical changes: add `retina=true` for sharpness, remove the fallback chain since logo.dev handles everything natively.

