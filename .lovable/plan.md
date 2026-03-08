

## Plan: Multi-Profile Demo Pages with Navigation

### Scope
This is a large feature. Given the DemoScreenwriter page is 1,182 lines, building two full demo profiles (Actor + Copywriter) plus a navigation system requires breaking into manageable pieces. I recommend implementing this across **2-3 rounds** to keep quality high.

**Round 1** (this plan): Actor demo + demo navigation system
**Round 2**: Copywriter demo

---

### Architecture

#### 1. Extract shared demo infrastructure
The DemoScreenwriter has ~400 lines of reusable code (WithToggle system, AmbientGlow, MidScrollCTA, VARIANT_OPTIONS, SectionVariantsCtx). Extract into a shared module.

**Create `src/components/demo/DemoShared.tsx`** containing:
- `SectionVariants` type + `SectionVariantsCtx` context + `useSectionVariants` hook
- `VARIANT_OPTIONS` map
- `WithToggle` component
- All `*WithToggle` wrapper components (Loglines, Credits, Awards, etc.)
- `AmbientGlow`, `MidScrollCTA`
- `CreditHeroCard`
- Default variants

#### 2. Demo navigation — profile type tabs
**Create `src/components/demo/DemoProfileTabs.tsx`**:
- Horizontal tab bar rendered at top of every demo page (below the demo banner)
- Tabs: Screenwriter | Actor | Copywriter (expandable later)
- Uses `useNavigate` to switch between `/demo/screenwriter`, `/demo/actor`, `/demo/copywriter`
- Glass-morphism styling consistent with existing theme
- Active tab highlighted with accent color

#### 3. DemoActor page (`src/pages/DemoActor.tsx`)
Actor-specific design priorities (what casting directors scan in 15 seconds):

**Hero customization**:
- `heroRightContent` defaults to `"none"` — instead, a **Showreel embed** sits directly below the hero as the first visible section
- The showreel is a large, cinematic video player (16:9 aspect ratio) with a click-to-play overlay showing a film-frame thumbnail
- CTA presets: "Request Headshots", "Contact My Agent", "Self-Tape Available", "Audition Me"

**Mock data — "Mia Torres" — actor profile**:
- Profile photo: professional headshot
- Tagline: "SAG-AFTRA · Drama & Comedy · LA / NYC"
- Stats bar: Height 5'7", Playing Age 24-32, SAG-AFTRA, accents (Standard American, RP British, Southern), languages, based in LA
- Demo reels: Dramatic Reel (featured, large), Comedy Reel, Commercial Reel
- Credits: 6 film/TV credits with poster images, role names (Lead, Recurring, Guest Star)
- Headshot gallery: 6 diverse looks (dramatic, commercial, theatrical, lifestyle)
- Training: Yale School of Drama MFA, Upright Citizens Brigade, Meisner Studio
- Special skills: Stage combat (certified), horseback riding, gymnastics, piano, fluent Spanish
- Awards: SAG Award nom, Indie Spirit nom
- Press: Variety "10 Actors to Watch", review quotes
- Representation: agent + manager cards
- Availability: "Available for pilot season", self-tape turnaround 24hrs

**Section order (Classic layout)**:
1. Hero (headshot + name + stats summary)
2. Physical Stats (comp card)
3. Demo Reels (showreel featured prominently)
4. Credits (poster layout)
5. Headshot Gallery
6. Training
7. Special Skills
8. Awards
9. Press & Reviews
10. Representation
11. Availability / Contact

**Layouts**: Reuse same 10 layout presets but with actor-appropriate section ordering in each.

#### 4. Update landing page
Modify `Index.tsx` "Live Demo CTA" section:
- Change the single "View Live Demo" button to a dropdown or segmented control
- Options: "Screenwriter" | "Actor" | "Copywriter"
- Each links to `/demo/{type}`
- Also update the "See Examples" button in the hero to link to a demo selector or default to screenwriter

#### 5. Routes
Add to `App.tsx`:
```
<Route path="/demo/actor" element={<DemoActor />} />
<Route path="/demo/copywriter" element={<DemoCopywriter />} />
```

---

### Files

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/components/demo/DemoShared.tsx` | Shared variants, toggles, ambient effects |
| Create | `src/components/demo/DemoProfileTabs.tsx` | Tab navigation across demo profiles |
| Create | `src/pages/DemoActor.tsx` | Full actor demo with showreel-first layout |
| Modify | `src/pages/DemoScreenwriter.tsx` | Import shared code, add DemoProfileTabs |
| Modify | `src/pages/Index.tsx` | Demo selector dropdown in CTA section |
| Modify | `src/App.tsx` | Add new demo routes |

### Design Details
- Actor demo defaults to "cinematic" theme (dark, dramatic — suits headshots)
- Showreel section uses `SectionDemoReels` with `variant="featured"` as default, rendering the primary reel at full width with click-to-play overlay
- Stats bar renders `SectionActorStats` with full comp card format
- DemoProfileTabs: fixed below demo banner, glass background, smooth transitions between tabs
- All demos share the same ThemeSwitcher + LayoutSwitcher + SectionOptionsBar system

