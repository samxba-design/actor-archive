

## Landing Page: Cinematic Background & Glassmorphism Mode

### Background Imagery — Animated, Premium Film Aesthetic

Instead of static images (which would need hosting/loading), I'll build **pure CSS/SVG animated backgrounds** that evoke a Hollywood studio feel:

1. **Animated film light rays** — Rotating conic gradients simulating stage spotlights sweeping across the hero section. Two or three beams at different angles, slow rotation, very low opacity (~3-5%) in warm rose/champagne tones.

2. **Floating bokeh particles** — CSS-only circles with varying sizes (4px–40px), blur, and opacity that drift slowly upward/diagonal. Gold, rose, and champagne hues. Evokes out-of-focus studio lights — the classic cinematic bokeh look.

3. **Film strip decorative border** — SVG-based film perforations running vertically along the edges, very faint, parallax-scrolling at a slower rate. Reinforces the movie studio identity without being heavy-handed.

4. **Vignette overlay** — Radial gradient darkening the edges of the viewport, exactly like a cinema screen. Subtle but effective.

5. **Animated gradient mesh** — Slow-moving mesh of 3-4 radial gradients (burgundy, rose, champagne, deep plum) that shift position over ~20s, creating a living, breathing background beneath the content.

### Glassmorphism Mode (Default ON, Toggleable)

A **glass/dynamic** treatment applied to cards, nav, and containers:

- **Nav bar**: Frosted glass — `backdrop-filter: blur(20px)` with semi-transparent burgundy bg, subtle top-border highlight
- **Feature cards**: Glass cards with `backdrop-filter: blur(16px)`, semi-transparent fill, visible frosted edge, 1px gradient border (white/10% top, transparent bottom)
- **Theme showcase browser frame**: Glass treatment with inner shadow
- **Stats section**: Glass pill containers
- **CTA section**: Frosted glass panel behind the content

**Toggle mechanism**: A small toggle button in the nav (a `Sparkles` or diamond icon) that switches between:
- **Glass mode** (default): All glassmorphism effects active, animated backgrounds visible through elements
- **Solid mode**: Opaque card backgrounds, simpler borders, no backdrop-filter — for users who prefer less visual complexity or have performance concerns

Store preference in `localStorage`.

### Files to Change

1. **`src/index.css`** — Add keyframes for light rays rotation, bokeh float, gradient mesh drift. Add `.glass-mode` utility classes. Add vignette overlay. Add film strip SVG pattern.

2. **`src/pages/Index.tsx`** — Add background layer components (light rays, bokeh particles, vignette, film strip edges). Add glass toggle in nav. Apply conditional glass classes to all cards/surfaces. Generate ~12 bokeh particles with randomized positions, sizes, animation durations.

3. **`tailwind.config.ts`** — Add `backdrop-blur-xl` if not present, add custom animation durations for slow ambient effects.

### Visual Hierarchy (layer order, bottom to top)

```text
1. Solid burgundy background
2. Animated gradient mesh (3 moving radial gradients)
3. Light ray sweeps (conic gradients, rotating)
4. Bokeh particles (floating blurred circles)
5. Vignette overlay (edge darkening)
6. Film strip borders (left/right edges)
7. Content (nav, sections, cards — all glass or solid)
8. Film grain (existing, stays on top)
9. Spotlight follow (existing, mouse-tracking)
```

### Bokeh Particle Details
- 12-15 particles, absolutely positioned with random initial positions
- Each has unique `animation-duration` (15-40s), `animation-delay` (0-10s)
- Float upward with slight horizontal drift using a single `@keyframes bokeh-float`
- Colors: `hsl(350 40% 55% / 0.08)`, `hsl(35 40% 70% / 0.06)`, `hsl(20 35% 55% / 0.05)`
- Blur: 2px-8px depending on size (larger = more blur = further "away")

### Glass Toggle Implementation
- `useState` initialized from `localStorage.getItem('glass-mode') !== 'false'` (default ON)
- Toggle button in nav bar, small icon button
- Conditional class `glass-active` on the root container
- CSS uses `.glass-active .glass-card { backdrop-filter: blur(16px); background: hsl(var(--landing-card) / 0.4); }` vs without: `background: hsl(var(--landing-card) / 0.8);`

