

## Full UI Color & Design Overhaul

### The Problem
The current palette — near-black backgrounds with bright amber/orange accents — is harsh and glaring. It reads more "tech startup" than "premium creative platform."

### New Direction: Deep Burgundy + Warm Cream + Gold

A refined palette inspired by luxury film branding, theater programs, and gallery invitations:

```text
Current               →  New
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Black (220 20% 4%)    →  Deep burgundy-charcoal (345 25% 8%)
Amber/orange buttons  →  Soft rose-gold gradient (350 40% 55% → 20 35% 55%)
Gold accents          →  Warm champagne (35 30% 72%)
Blue-gray text        →  Warm cream-gray (30 15% 70%)
Card backgrounds      →  Deep wine (345 20% 12%)
Borders               →  Muted plum (345 15% 18%)
```

### Landing Page Changes (Index.tsx)

**Backgrounds & surfaces:**
- Main bg: deep burgundy-black `hsl(345 25% 8%)`
- Cards: `hsl(345 20% 12% / 0.6)` with warm border `hsl(345 15% 18%)`
- Nav: `hsl(345 25% 8% / 0.85)` with backdrop blur

**Accent & CTA buttons:**
- Replace `from-amber-500 to-orange-500` gradient with a soft rose-gold: `hsl(350 45% 58%)` → `hsl(20 40% 58%)` 
- Button text stays dark for contrast
- Hover glow shifts from gold to warm rose

**Text:**
- Primary text: warm off-white `hsl(30 20% 92%)`
- Muted text: champagne-gray `hsl(30 12% 55%)`
- Gradient headline: replace gold with a cream-to-rose gradient

**Ambient effects:**
- Spotlight follow: change from gold tint to soft burgundy-rose `hsl(345 40% 50% / 0.04)`
- Hero ambient glow: warm rose radial instead of gold
- CTA pulsing glow: rose-gold instead of amber

**Feature card hover:** Inset border glow shifts to rose-champagne tones

**Theme showcase pills:** Active pill uses rose-gold bg instead of amber

**Stats icons:** Champagne color instead of gold

### CSS Changes (index.css)

**Landing page tokens:**
```
--landing-bg: 345 25% 8%
--landing-fg: 30 20% 92%
--landing-accent: 350 40% 58%
--landing-card: 345 20% 12%
--landing-border: 345 15% 18%
--landing-muted: 30 12% 55%
```

**Spotlight follow:** Change `hsl(40 80% 55% / 0.04)` → `hsl(345 40% 50% / 0.04)`

**Gold gradient text class:** Replace with `.text-gradient-rose` using cream → rose → warm tones

**Marquee fade edges:** Update to match new bg `hsl(345 25% 8%)`

**Auth brand panel:** Update gradient from blue-black to burgundy-charcoal: `hsl(345 25% 6%)` → `hsl(345 20% 10%)`; spotlight drift uses rose instead of gold

### Auth Pages (Login.tsx, Signup.tsx)

- Brand panel background: burgundy gradient matching landing
- Film icon accent: champagne instead of gold
- Quote text: warm cream tones
- Keep right panel clean white (light mode) for readability contrast

### Onboarding

- Progress bar accent: rose-gold instead of default primary
- StepComplete confetti: mix of rose, champagne, cream particles instead of amber/gold

### Dashboard Sidebar

- No major color changes needed (uses shadcn theme tokens which are neutral)
- Optionally tint the sidebar background slightly warm

### Portfolio Sections

- No changes — portfolios use their own theme system (10 themes), independent of app chrome

### Files to Update
1. `src/index.css` — landing tokens, spotlight, gradient text, auth panel, marquee edges
2. `src/pages/Index.tsx` — all inline HSL values for bg, text, cards, buttons, glows
3. `src/pages/Login.tsx` — brand panel icon color, quote styling
4. `src/pages/Signup.tsx` — same as Login
5. `src/components/onboarding/StepComplete.tsx` — confetti colors

