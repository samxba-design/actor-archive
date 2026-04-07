# UX Streamline Audit — Non-Technical First-Time User

Date: 2026-04-07
Scope: First-run setup, profile creation flow, discoverability, and confidence cues for users with zero technical skills.

## Executive assessment

The product foundation is strong and already has many advanced controls. The biggest opportunity is not feature quantity — it is reducing decision fatigue and making every step feel obvious, reversible, and confidence-building.

## What is already working well

1. **Adaptive onboarding step flow**
   - The flow dynamically includes actor/copywriter-specific steps and trims optional steps for simple-goal users.
2. **Persistent onboarding draft state**
   - Progress and form data are cached in local storage and survive refreshes.
3. **Role-specific profile architecture**
   - Profile type selection drives section defaults and system terminology.
4. **Preview-rich dashboard architecture**
   - Existing dashboard route coverage already supports advanced editing surfaces and growth tools.

## Friction points for non-technical users

### 1) Decision overload early
Users are asked to decide profile type + goal + URL before seeing an immediate visual payoff.

### 2) Insufficient setup confidence cues
There is limited “you’re doing it right” feedback while progressing through onboarding.

### 3) Action labels can be interpreted as technical
Terms like “Skip” can feel risky. More humane language (“Finish later”) reduces anxiety.

### 4) Weak defaults communication
The system does useful automation under the hood, but users are not always explicitly told what was auto-configured for them.

## Highest-impact simplification opportunities

## P0 (must-have)

1. **Outcome-first starter templates**
   - Present 3–5 plain-language presets (“Get inquiries”, “Get representation”, “Book calls”).
   - Auto-apply theme, section order, CTA defaults.

2. **Live reassurance panel during onboarding**
   - Show current step, minutes left, and what value this step unlocks.
   - Keep language plain and non-technical.

3. **One-click first publish path**
   - Add a “Publish with defaults” path after required fields only.
   - Move advanced edits behind a clearly labeled “Customize” path.

## P1 (high leverage)

4. **Inline example previews per step**
   - For URL, tagline, services: show “good example” placeholders from the selected profile type.

5. **Guided empty-state playbooks in dashboard**
   - Every empty manager page should offer a short “what to add first” checklist.

6. **Visual diff on auto actions**
   - Whenever system auto-arranges sections, show before/after chips and allow undo.

## P2 (quality of life)

7. **Progressive disclosure labels for advanced controls**
   - Rename “Advanced” areas to “Optional Pro Tweaks”.

8. **Beginner mode in settings**
   - A toggle that hides dense controls until user opts in.

9. **First-week guidance widget**
   - Contextual nudges like “Add 2 testimonials for trust” and “Upload 1 reel for conversion lift”.

## Success metrics to track

- Time to first publish
- Onboarding completion rate
- % users publishing within first session
- First-week return rate
- Public profile CTA click-through rate

## Immediate changes delivered in this pass

- Added a contextual onboarding hint card in the fixed header with:
  - current step label,
  - estimated minutes left,
  - non-technical “why this step matters” guidance.
- Updated “Skip” wording to “Finish later” for less risky framing.
- Added goal-based starter automation in onboarding:
  - selecting a goal now pre-applies theme + layout defaults and hire-status intent.
  - users get a clear “starter setup we’ll apply for you” quick-win panel.
- Added live profile preview in Basic Info step so users can see exactly how name/tagline/location will appear.
- Added slug fallback suggestions when a URL is taken (one-click chips) to prevent setup dead-ends.

## Recommended next implementation sequence

1. Add outcome-first starter presets.
2. Add publish-with-defaults fast path.
3. Add role-specific example content snippets.
4. Add dashboard empty-state checklists.
5. Add auto-change diff + undo surface.
