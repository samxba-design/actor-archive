

# Overhaul: Dashboard Design Studio + Profile-Type-Aware Theming

## Problems Identified

1. **DashboardPreview is a bare iframe with 4 hardcoded presets** — no real design tools, no profile-type awareness, no live customization
2. **Theme selector in Settings references phantom themes** — groups hardcode IDs like `obsidian-noir`, `deep-space`, `ivory-editorial`, `electric-noir`, `forest-noir`, `rose-gold-glam`, `vintage-film`, `brutalist-studio` that don't actually exist (they resolve via `legacyThemeMap` but show as empty groups)
3. **No copywriter-specific presets or recommendations** — the Quick Presets in Settings only show "Film Professional", "Actor Modern", "Director Cinematic", "Writer Literary", "Clean Professional"
4. **Duplicate Auto-Responder cards** — two separate auto-responder UI blocks in General tab (lines 536-585)
5. **Settings page is 1139 lines of monolith** — overwhelming, hard to navigate, mixes design controls with account management
6. **No "Auto Improve" or smart suggestions** — no intelligence about what's missing or what would look better
7. **No consolidated live preview with design controls** — DashboardPreview just embeds an iframe with no sidebar design tools beyond 4 presets

## Plan

### 1. Fix Theme Selector — Show Only Real Themes (SettingsPage.tsx)

Replace the hardcoded theme group arrays with the actual theme IDs from `portfolioThemes`. Group them dynamically:

```
Dark: cinematic-dark, noir-classic, midnight-glass, neon-noir, charcoal-glass, gothic
Light: modern-minimal, warm-luxury, frost, pearl, sage-studio, slate-pro
Colorful: creative-rose, ocean-blue, mediterranean, azure-glass, frontier, sunset-warmth
```

This ensures every registered theme appears and no phantom themes show up.

### 2. Profile-Type-Aware Quick Presets (SettingsPage.tsx)

Replace the generic 5 presets with presets mapped to `profileType`:

| Profile Type | Preset 1 | Preset 2 | Preset 3 |
|---|---|---|---|
| Copywriter | Charcoal Glass + Magazine | Frost + Bento | Slate Pro + Classic |
| Actor | Cinematic Dark + Classic | Neon Noir + Spotlight | Charcoal Glass + Magazine |
| Screenwriter | Cinematic Dark + Classic | Warm Luxury + Minimal | Gothic + Classic |
| Director | Noir Classic + Cinematic | Midnight Glass + Bento | Cinematic Dark + Classic |
| Journalist | Warm Luxury + Magazine | Slate Pro + Classic | Frost + Bento |
| Author | Warm Luxury + Minimal | Mediterranean + Classic | Pearl + Magazine |
| Corporate | Frost + Standard | Slate Pro + Bento | Azure Glass + Dashboard |

Each preset also sets an appropriate `hero_style` for the profession.

### 3. Remove Duplicate Auto-Responder (SettingsPage.tsx)

Delete the standalone auto-responder card (lines 559-585). The one inside the Pro-gated card (lines 536-557) is sufficient.

### 4. Overhaul DashboardPreview — Design Studio (DashboardPreview.tsx)

Transform the preview page from a bare iframe into a proper design studio with a rich sidebar:

**Sidebar sections:**
- **Smart Suggestions** — profile-type-aware recommendations (e.g., "Add a case study to showcase results" for copywriters, "Upload a demo reel" for actors). Pulls from profile completion data
- **Auto-Improve** button — applies the best preset for the user's profile type + sets optimal hero layout + section order in one click
- **Theme** — compact theme grid showing all real themes with mini color swatches (reuse the visual preview pattern from Settings)
- **Layout** — layout preset picker (classic, magazine, bento, etc.) with profile-type recommendations highlighted
- **Hero** — hero layout picker (classic, centered, split, etc.)
- **Sections** — collapsible drag-and-drop section reorder with visibility toggles (move from Settings to here as primary location)

All changes apply immediately to the iframe via Supabase update + iframe refresh. The iframe reloads on each change (already works via `refreshKey`).

**Remove** the current 4 hardcoded `QUICK_DESIGNS`.

### 5. Profile-Type Recommendations in Design Studio

Add a small recommendation engine:

```typescript
const RECOMMENDED: Record<string, { themes: string[]; layouts: string[]; heroLayouts: string[] }> = {
  copywriter: { themes: ['charcoal-glass', 'frost', 'slate-pro'], layouts: ['magazine', 'bento'], heroLayouts: ['centered', 'minimal'] },
  actor: { themes: ['cinematic-dark', 'neon-noir', 'charcoal-glass'], layouts: ['classic', 'spotlight'], heroLayouts: ['classic', 'banner'] },
  // ... etc
};
```

Recommended items get a subtle badge/highlight in the pickers.

### 6. Reduce Hero Whitespace Globally

Several themes still have `heroHeight: '70vh'` or `'75vh'`. Normalize:
- Dark cinematic themes: `'62vh'`
- Light/editorial themes: `'55vh'`
- Compact/minimal: keep at `'280px'` or `'50vh'`

This affects `themes.ts` — all 18 theme objects.

## Files Modified

| File | Change | Effort |
|---|---|---|
| `src/themes/themes.ts` | Reduce heroHeight across all themes | Small |
| `src/pages/dashboard/SettingsPage.tsx` | Fix theme groups, add type-aware presets, remove duplicate auto-responder | Medium |
| `src/pages/dashboard/DashboardPreview.tsx` | Full rewrite as Design Studio with rich sidebar | Large |

3 files total. No database changes needed — all settings already exist as columns.

