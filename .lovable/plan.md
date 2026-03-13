

# Demo Customization Consolidation, Clean Preview Mode, and PDF Export

## Problems Identified

1. **Client logos have no position setting** — unlike Known For, users can't control where client logos appear (above hero, below hero, etc.)
2. **Demo page customization bars are scattered** — Hero Layout, Hero Right, CTA, Known For Style, Image Effects, Known For Position, and Background are all separate bars stacked vertically below the hero. No grouping, no logic.
3. **Known For style and position are separate cards in Settings** — style is only on the demo page toggle, position is in SettingsPage, and they're disconnected
4. **No way to hide customization bars** — visitors and admins can't see a "clean" finished portfolio preview
5. **No PDF export button on demo pages**
6. **PDF export formatting could be tighter** — currently may overflow to multiple pages

## Plan

### 1. Consolidate Demo Customization into a Collapsible Panel

**File: `src/components/demo/DemoShared.tsx`** — Add a new `DemoCustomizationPanel` component

Instead of 7+ individual `SectionOptionsBar` rows stacked below the hero, group them into a single collapsible floating panel with logical categories:

```text
┌─ Customize Portfolio ──────────────────────────── [Hide ✕] ─┐
│                                                              │
│ HERO                                                         │
│ Layout: [Classic] [Centered] [Split] ...                     │
│ Right Content: [Featured] [Services] [Stats] ...             │
│ Background: [Preset] [Solid] [Bokeh] [Video] [Gradient]     │
│ Headshot: (image effect picker)                              │
│                                                              │
│ KNOWN FOR                                                    │
│ Style: [Strip] [Scroll] [Grid] [Stack] [Spotlight]           │
│ Position: [Above Name] [Below CTA] [Beside Photo] ...       │
│                                                              │
│ CLIENT LOGOS                                                 │
│ Layout: [Bar] [Grid] [Marquee]                               │
│ Color: [Original] [Grayscale] [White] [Dark]                 │
│ Size: [S] [M] [L] [XL]                                      │
│ Position: [Below Hero] [Above Sections] [Body] [Hidden]      │
│                                                              │
│ CTA                                                          │
│ Button: [Read Script] [Hire Me] [Get in Touch] ...           │
└──────────────────────────────────────────────────────────────┘
```

- Collapsible by category (Hero, Known For, Client Logos, CTA)
- Full "Hide All Customization" toggle that removes ALL `SectionOptionsBar` instances from inline sections AND hides the panel — shows only a small "Show Customization" floating button
- State stored in `SectionVariantsCtx` as `showCustomization: boolean`

### 2. Add Client Logo Position Setting

**File: `src/components/demo/DemoShared.tsx`**
- Add `clientLogosPosition` to `SectionVariants`: `'below_hero' | 'above_sections' | 'body_section' | 'hidden'`
- Add to `VARIANT_OPTIONS`

**File: `src/pages/DemoScreenwriter.tsx` (and Actor/Copywriter)**
- Render `ClientLogosWithToggle` at the correct position based on `variants.clientLogosPosition` (similar to how `knownForPosition` works for Known For)
- Remove hardcoded client logo placements from individual layout components

**File: `src/pages/dashboard/SettingsPage.tsx`**
- Add a "Client Logos Position" picker card (similar to Known For Position) so real users can save this preference
- Add `client_logos_position` column to `profiles` table via migration

### 3. Hide Customization / Clean Preview Mode

**File: `src/components/demo/DemoShared.tsx`**
- Extend `SectionVariantsCtx` with `showCustomization` boolean (default: `true`)
- `WithToggle` component: when `showCustomization === false`, skip rendering `SectionOptionsBar`, render only the children
- `ClientLogosWithToggle`: same — hide the 3 option bars when in clean mode

**File: `src/pages/DemoScreenwriter.tsx` (and Actor/Copywriter)**
- Replace the inline customization bars block with the new `DemoCustomizationPanel`
- Add a floating "Clean Preview" toggle button (eye icon) near the layout/theme switchers

### 4. Add PDF Export Button to Demo Pages

**File: `src/pages/DemoScreenwriter.tsx` (and Actor/Copywriter)**
- Add a `FileDown` icon button in the fixed bottom bar area (near layout/theme switchers)
- Opens `PDFExportModal` with the mock profile data, passing `isPro={true}` for demo purposes

### 5. Improve PDF Export Formatting

**File: `src/components/portfolio/PDFExportModal.tsx`**
- Tighten spacing: reduce section margins, line heights, font sizes
- Limit credits to 8 (from 12), awards to 6, skills to 15
- Add page-break-inside: avoid on sections
- Set max-height constraints to keep content to ~1 page
- Add client logos as a compact inline list (company names only) if present
- Add representation section (agent/manager names)
- Reduce bio to 250 chars max

### Database Migration

Add `client_logos_position` column to profiles:
```sql
ALTER TABLE public.profiles 
ADD COLUMN client_logos_position text DEFAULT 'body_section';
```

### Files Summary

| File | Change |
|------|--------|
| `src/components/demo/DemoShared.tsx` | Add `DemoCustomizationPanel`, `clientLogosPosition` variant, `showCustomization` toggle, update `WithToggle` |
| `src/pages/DemoScreenwriter.tsx` | Replace inline bars with panel, add PDF export button, handle client logo position |
| `src/pages/DemoActor.tsx` | Same changes |
| `src/pages/DemoCopywriter.tsx` | Same changes |
| `src/components/portfolio/PDFExportModal.tsx` | Tighten formatting, add sections, keep to 1 page |
| `src/pages/dashboard/SettingsPage.tsx` | Add Client Logos Position picker |
| Migration | Add `client_logos_position` to profiles |

