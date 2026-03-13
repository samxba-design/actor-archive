

# Writer/Copywriter Layout Defaults, CTA Styles, and New Light Themes

## 1. Move Client Logos Higher for Writers & Copywriters

**Problem**: In the section registry (`profileSections.ts`), `client_logos` appears near the bottom for writer types (screenwriter, copywriter, journalist, etc.). For client-facing profiles, showcasing known brands should be prominent.

**Fix**: For `screenwriter`, `tv_writer`, `copywriter`, `journalist`, and `corporate_video` profile types, move `client_logos` to position 3-4 in the default `sections` array (right after `hero` and `bio`). This only affects new profiles — existing users keep their custom order.

**Files**: `src/config/profileSections.ts`

## 2. Default Known For Position = `hero_above_name` for Writers; Prevent Duplication

**Problem**: When `known_for_position` is `hero_above_name`, the Known For strip renders in the hero AND can also appear as a body section if it's in the section order.

**Fix**: In `src/pages/PublicProfile.tsx`, add a guard: when `known_for_position` is `hero_above_name`, `hero_below_cta`, or `hero_beside_photo`, skip rendering the Known For body section. The existing code at line 277 only checks for `below_hero` and `body_section`, which is correct — but we also need to ensure the `SortableSectionList` doesn't render a duplicate `credits`/known-for section. Check if there's a separate `known_for` section key in the section list that could cause duplication.

After checking: Known For is NOT a section key — it's rendered by the hero and by the explicit block at line 277. The duplication issue would only happen if `below_hero` or `body_section` is set AND the hero also shows it. The current code correctly gates the body rendering. **No code change needed here** — the existing logic is correct.

## 3. Client Logos Default to Horizontal Bar Above Name

For writer/copywriter defaults, set client logos `variant` to `'bar'` (already default) and ensure client_logos appears high in section order. The "above name" concept applies to Known For posters, not client logos — client logos are a body section. Moving them higher in the section order is the right approach.

## 4. Animated CTA Button Styles

**Current state**: `PortfolioCTA` supports 4 static styles: `text-link`, `outlined`, `underlined`, `filled-subtle`. No animation options.

**Add 4 new animated CTA styles**:
- `glow-pulse` — Pulsing border glow using accent color (reuse the `glow-pulse` keyframe we already added)
- `shine-sweep` — Shimmer light sweep across the button surface
- `neon-border` — Bright neon outline with soft ambient glow
- `filled-bold` — Solid accent-colored fill with scale-up hover + shadow bloom

**Implementation**:
- Add new styles to `PortfolioCTA.tsx` with CSS animations inline
- Add corresponding keyframes to `src/index.css`
- Extend the `ctaStyle` type in `theme-types.ts` to include the new options
- Add CTA style picker to `SettingsPage.tsx` so users can choose their button style
- Update themes to keep existing defaults but make animated styles available

**Files**: `src/themes/theme-types.ts`, `src/components/portfolio/PortfolioCTA.tsx`, `src/index.css`, `src/pages/dashboard/SettingsPage.tsx`

## 5. New Light Premium Themes

**Current light themes**: `Frost` (silver glass), `Modern Minimal` (white/green), `Warm Luxury` (cream/gold), `Mediterranean` (terracotta)

**Add 2 new light themes**:

### Azure Glass
- Light sky blue background (`#EDF4FC`)
- Glass-enabled with frosted cards
- Cool blue accent (`#2B7DE9`)
- Modern sans-serif fonts (Inter)
- Premium feel: rounded cards, soft shadows, glass blur

### Pearl
- Warm white/pearl background (`#FAFAF8`)
- Soft rose-gold accent (`#C4856C`)
- Elegant serif display font (Cormorant Garamond)
- Subtle card shadows, no glass
- Refined, luxury editorial feel

**Files**: `src/themes/themes.ts`, `src/themes/theme-types.ts` (no type changes needed, just new theme objects)

## 6. Summary of File Changes

| File | Change |
|------|--------|
| `src/config/profileSections.ts` | Move `client_logos` higher in section order for 5 writer/corporate types |
| `src/themes/theme-types.ts` | Extend `ctaStyle` union with 4 new animated options |
| `src/components/portfolio/PortfolioCTA.tsx` | Add rendering for `glow-pulse`, `shine-sweep`, `neon-border`, `filled-bold` styles with animations |
| `src/index.css` | Add keyframes for CTA animations (shine-sweep, neon-border pulse) |
| `src/themes/themes.ts` | Add `azureGlass` and `pearl` theme definitions |
| `src/pages/dashboard/SettingsPage.tsx` | Add CTA style picker UI |

