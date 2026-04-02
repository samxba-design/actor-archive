# Full Audit: Demo Experience, Customization Depth, and Missing Killer Features

Date: 2026-04-02  
Owner: Product + Design + Growth + Frontend

## Executive summary

The platform already has strong foundations (theme switching, layout switching, section variants, demo style capture, and profile-type demos), but the current experience still feels **tool-centric** instead of **outcome-centric**.

### Core gap
Users are offered lots of controls, but not enough:
1. **intent-based starting points** ("I need leads", "I need reps", "I need booking calls"),
2. **automated quality upgrades** (one-click polish + conversion optimization),
3. **profile-type specific intelligence** (different optimization logic for actor vs screenwriter vs copywriter),
4. **preview confidence signals** (what changed, why it matters, projected impact).

---

## Current strengths (keep and build on)

- Cross-demo profile navigation and explicit copywriter route is available and now more visible.
- Theme + layout switching already exists and supports fast visual iteration.
- Section-level variants are comprehensive and composable.
- Demo style capture provides a useful signup bridge.
- Dashboard preview supports breakpoint checks and now supports quick presets.

These capabilities are solid primitives; the next step is packaging them into **guided outcomes**.

---

## Top missing features (priority order)

## P0 — Must-have to feel "super advanced + super easy"

### 1) Goal-based "Start Mode" at first interaction
Add a first-step selector with outcomes:
- Get More Inquiries
- Get Representation
- Book More Calls
- Showcase Premium Work
- Build Trust Fast

Each mode should auto-apply:
- theme + layout
- CTA preset/style
- section order
- hidden/shown section defaults
- copy tone presets

**Why:** users think in goals, not in layout IDs.

### 2) True "Auto-Arrange Best Profile" engine (scored)
Current one-click arrangement should evolve into a scored optimizer that:
- evaluates profile completeness
- detects weak hero/CTA combinations
- flags section overload
- tunes hierarchy for the selected goal

Output should include:
- before/after summary
- confidence score
- undo support
- "apply all" + "review each change"

### 3) Conversion-focused live preview overlays
In preview mode, add optional overlays:
- CTA prominence score
- readability contrast warnings
- fold analysis (what is above first screen)
- trust signals present/missing (testimonials, logos, press, awards)

**Why:** turns preview into decision support, not just visual output.

### 4) Quick actions rail (persistent)
A sticky rail with one-click actions:
- Improve Hero
- Fix CTA
- Reorder for Conversion
- Simplify Visual Noise
- Apply High-Trust Variant

Each action should animate/highlight changed components.

---

## P1 — High-impact differentiation

### 5) Profile-type-specific intelligence packs

## Actor optimization pack
- Casting-friendly hero mode (headshot-first, credits high, rep visible)
- Reel-first vs headshot-first toggle
- Audition-focused CTA presets
- Role-type filters in "Known For"

## Screenwriter optimization pack
- Logline-first story mode
- Producer pitch mode (credits + packaged projects first)
- Spec sample mode with frictionless request CTA
- Genre-market fit tagging

## Copywriter optimization pack
- Results-first mode (metrics wall on top)
- Offer ladder CTA (audit → package → retainer)
- Industry-specific social proof arrangement
- Case-study compression/expansion modes

### 6) Advanced section recipes (multi-section bundles)
Instead of independent toggles, provide bundles:
- "Proof Stack" (logos + testimonials + press)
- "Authority Stack" (awards + features + speaking)
- "Sales Stack" (services + pricing + CTA + FAQs)

### 7) AI-assisted copy blocks everywhere
Missing assistant coverage should include:
- CTA copy variants by goal
- headline/tagline alternatives by audience
- testimonial rewrites (short/long)
- case study summary generator
- service package naming/pricing suggestions

---

## P2 — Power-user and growth loops

### 8) Preset marketplace + saved style systems
- save your own design systems
- shareable preset links
- team presets (agency mode)
- "clone this profile setup" from demos/public examples

### 9) A/B test-ready profile states
- create Variant A / Variant B
- rotate CTA style/copy
- compare response metrics

### 10) Frictionless onboarding automations
- resume/URL ingestion is present; add "instant homepage draft"
- auto-generate section order from imported data confidence
- smart missing-content prompts in priority order

---

## UX polish opportunities (specific)

1. Replace generic labels like "Standard", "Classic" with use-case labels:
   - "Best for Leads"
   - "Best for Casting"
   - "Best for Authority"

2. Add "Why this preset" microcopy beneath every quick preset.

3. Add "Preview changed" pulse and a compact changelog toast after auto actions.

4. Improve small-screen customization UX:
   - bottom sheet controls
   - swipe between categories
   - sticky apply/undo

5. Add interaction memory per user:
   - remembers last active profile type, preset category, and viewport.

---

## Missing killer features (big bets)

1. **Portfolio Co-Pilot**
   - conversational "improve my profile" with direct edits and one-click apply.

2. **Intent Simulator**
   - simulate visitor type (casting director / producer / CMO) and show what they see first.

3. **Opportunity Mode**
   - paste a job/casting brief; profile auto-reorders to match that opportunity.

4. **Trust Optimizer**
   - analyzes proof density and recommends exact additions to increase conversion confidence.

5. **One-Click Brand Sync**
   - pulls brand palette/fonts from user website/social and generates a coherent style system.

---

## Implementation roadmap (6-week)

### Week 1–2
- Goal-based start mode
- preset metadata (who it is for + expected impact)
- richer quick action rail + undo stack

### Week 3–4
- scoring-based auto-arrange v1
- preview overlays (readability, CTA visibility, trust signals)
- profile-type intelligence defaults

### Week 5–6
- AI copy helper expansion (CTA/headline/testimonial/service copy)
- multi-section recipe bundles
- variant compare (A/B-ready state cloning)

---

## Success metrics

- Time-to-first-publish (target: -35%)
- Demo-to-signup conversion (target: +20%)
- Signup-to-publish conversion (target: +25%)
- Users applying "Auto-Arrange" at least once (target: 40%+)
- Average number of meaningful style actions/session (target: +30%)
- Contact CTA click-through from public profiles (target: +15%)

---

## Final recommendation

Keep the advanced controls, but wrap them in **outcome-first workflows** and **profile-specific intelligence**. The product will feel both more premium and easier when users can choose a goal and get a high-quality result in one click, with transparent, reversible changes.
