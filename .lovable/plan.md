

## Known For Redesign + Section Display Toggles

### Problem Summary
The Known For section has broken auto-scroll animation (hacking Embla's internal engine which is fragile/version-dependent), poor card alignment, and limited visual appeal. The user wants multiple display modes that are toggleable on the demo, with the same pattern extended to other sections.

### 1. Complete Rewrite of `SectionKnownFor.tsx`

Replace the entire component with 5 clean display variants:

| Variant | Description |
|---|---|
| `strip` | Static left-aligned horizontal row, subtle hover zoom (scale 1.05), scrollable on overflow |
| `scroll` | CSS `@keyframes` marquee-style auto-scroll (no Embla dependency), pauses on hover, smaller cards in a modern filmstrip look |
| `grid` | 2x3 or 3x2 static poster grid, clean and simple |
| `stack` | "Deck of cards" — cards overlap slightly, fan out on hover/scroll. Active card is front-and-center, others peek behind. Click/hover cycles through |
| `spotlight` | One large card visible at a time with prev/next. Card transitions with a smooth crossfade. Title + role + year displayed prominently below |

**Key fixes:**
- Remove Embla dependency entirely — use pure CSS animations for scroll variant (translateX keyframes, `animation-play-state: paused` on hover)
- All variants left-aligned by default
- Consistent hover: subtle scale(1.03) + slight shadow lift on all poster cards
- Title + role always visible below poster in all modes (not hidden)
- Remove the broken `internalEngine()` auto-scroll hack

### 2. Section Display Toggles on Demo Page

Create a `SectionOptionsBar` component — a small, minimal toolbar that appears above each section on the demo page with:
- Variant dropdown (specific to each section type)
- A label: "Customize in your profile settings"

For Known For specifically, the toggle options are the 5 variants above.

This `SectionOptionsBar` wraps any section and provides a thin bar with icon buttons. It's only rendered on the demo page (not on real user profiles).

### 3. Hero Known For Update

The hero's inline Known For strip (PortfolioHero.tsx lines 163-198) also needs the same fix — currently renders tiny 70px cards. Update to:
- Use the same card component from the rewritten SectionKnownFor
- Default to `strip` variant with `display="image"` 
- Respect the user's chosen variant setting

### 4. Files to Change

| File | Change |
|---|---|
| `src/components/portfolio/sections/SectionKnownFor.tsx` | **Full rewrite** — 5 variants, pure CSS animations, no Embla |
| `src/components/portfolio/SectionOptionsBar.tsx` | **New** — demo-only toggle bar for section display modes |
| `src/pages/DemoScreenwriter.tsx` | Wrap Known For sections with SectionOptionsBar, add state for variant selection, pass to all layout components |
| `src/components/portfolio/PortfolioHero.tsx` | Update hero Known For to use consistent card rendering from the new component |

### 5. Implementation Details

**Scroll variant (CSS marquee):**
```
@keyframes kf-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```
Duplicate items to create seamless loop. `animation-play-state: paused` on `:hover`.

**Stack variant:**
Cards absolutely positioned with increasing `left` offset (20px each). On hover, cards spread apart (increase gap). Hovered card scales up and elevates z-index. CSS transitions only — no JS animation loops.

**Spotlight variant:**
Single visible card with index state. Prev/next arrows. Smooth opacity + translateX crossfade between cards. Auto-advance every 4s, pauses on hover.

### 6. Section Options Pattern

The `SectionOptionsBar` pattern is generic — it takes:
- `sectionName: string`
- `options: { key: string, label: string, icon: ReactNode }[]`  
- `value: string`
- `onChange: (value: string) => void`

This same bar can later be added to Services, Awards, Press, etc. For this implementation, we add it to Known For only as the proof of concept, with a note that the same pattern applies to other sections.

