

# Fix Diamond Button Confusion + Make "Explore Live Demos" Stand Out

## Issues

1. **Diamond button is confusing** — it toggles glassmorphism on/off, but there's no label or tooltip explaining this. The visual change is subtle (just backdrop blur), making it seem broken. It also affects the "Explore Live Demos" button text readability in one of the modes.

2. **"Explore Live Demos" is too subtle** — it's a standard `variant="outline"` button with muted text color (`landing-fg / 0.8`), easily overlooked next to the primary CTA.

## Plan

### 1. Remove Diamond Toggle from Homepage Nav
The glass toggle is a developer/design tool, not a user-facing feature. Remove `showGlassToggle` from the `MarketingNav` call on the Index page (line 316). Keep glass mode always on (it's the default and looks better). The toggle can remain available in the nav component for other pages if needed, but shouldn't confuse landing page visitors.

### 2. Make "Explore Live Demos" a Premium, Glowing Button
Replace the plain outline button (lines 367-372) with a visually striking treatment:
- **Animated glowing border** — a subtle pulsing border using the accent color
- **Shimmer effect** — a moving light sweep across the button surface
- **Slightly larger text** and bolder weight
- Use a semi-transparent accent background instead of fully transparent outline
- Add a soft box-shadow glow that pulses

### Files to Edit

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Remove `showGlassToggle` prop from `MarketingNav`; restyle "Explore Live Demos" button with glow + shimmer |
| `src/index.css` | Add `@keyframes glow-pulse` and `.btn-glow` utility class for the animated border effect |

