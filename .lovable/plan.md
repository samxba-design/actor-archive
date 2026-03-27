
Fix confirmed: this is not a cache issue. Your live published profile currently has `hero_style = "full"` in the database, but `PortfolioHero` only knows layouts like `classic`, `centered`, `split`, `minimal`, `banner`, `editorial`, `compact`, etc. It then does:

```text
layoutRenderers[heroLayout]()
```

So when `heroLayout === "full"`, it calls `undefined()` and the ErrorBoundary shows “Scene Interrupted”.

## Root cause
There is a mismatch between three parts of the app:

- `PortfolioHero.tsx` expects hero layout values like `classic`, `centered`, `compact`
- `SettingsPage.tsx`, `ProfileEditor.tsx`, and `HeroBackgroundEditor.tsx` still save legacy values like `full`
- Existing profiles already have `hero_style: "full"` saved, including the currently published one

## Plan
1. Add a safe normalization layer in `PortfolioHero.tsx`
   - Map legacy/stale values before rendering:
     - `full` → `classic`
     - unknown/invalid values → `classic`
   - Guard `layoutRenderers[resolvedLayout]` so public pages never crash from bad saved data again

2. Unify editor defaults and saved values
   - Update `SettingsPage.tsx` default hero style from `full` to `classic`
   - Update `ProfileEditor.tsx` default/load fallback from `full` to `classic`
   - Update `HeroBackgroundEditor.tsx` so its “Full” button saves `classic` instead of `full`
   - Keep “Compact” mapped to `compact`

3. Backward compatibility cleanup
   - Anywhere a saved `hero_style` is read, normalize old values so older profiles still work immediately
   - Ensure preview, published profile, and dashboard customization all use the same enum

4. Quick audit for similar enum mismatches
   - Check `layout_preset`, hero background mode, and section rendering paths for the same stale-value pattern
   - Fix any additional unsafe direct lookup/call sites that could produce another “Scene Interrupted”

5. Secondary cleanup
   - Fix the `SectionClientLogos` ref warning by making the inner logo item ref-safe or removing ref propagation there
   - This is not the crash, but it should be cleaned up during the same pass

## Files to update
- `src/components/portfolio/PortfolioHero.tsx`
- `src/pages/dashboard/SettingsPage.tsx`
- `src/pages/dashboard/ProfileEditor.tsx`
- `src/components/dashboard/HeroBackgroundEditor.tsx`
- possibly `src/components/portfolio/LiveCustomizePanel.tsx` for consistent fallback behavior

## Expected result
- “View portfolio” works again immediately
- existing broken profiles with old `full` values stop crashing
- future saves won’t reintroduce the bug
- preview and published pages become resilient to stale/invalid hero layout values

## Technical note
This is the exact bug pattern:

```text
saved value: hero_style = "full"
PublicProfile passes heroLayout="full"
PortfolioHero does layoutRenderers["full"]()
=> undefined is not a function
=> ErrorBoundary
=> Scene Interrupted
```

No backend schema changes are needed. This is a targeted frontend compatibility fix plus editor value cleanup.
