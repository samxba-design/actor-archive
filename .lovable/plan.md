

# Comprehensive Improvements: Templates, Friction-Free Setup, Type-Aware Labels, and Missing Features

## Issues Identified

### 1. Onboarding Theme Picker Uses Legacy System
`StepTheme.tsx` still references `lib/themes.ts` (the old CSS-variable system with keys like `minimal`, `noir`, `editorial`) instead of `themes/themes.ts` (the structured system with `cinematic-dark`, `warm-luxury`, etc.). Users during onboarding see 10 legacy themes that map to only 7 actual themes. The `INITIAL_DATA` also defaults to `theme: "minimal"`.

### 2. "Known For" Label Hardcoded Everywhere
The title "Known For" is hardcoded in `PublicProfile.tsx`, `DemoScreenwriter.tsx`, `DemoCopywriter.tsx`, `DemoActor.tsx`, `ProjectsManager.tsx`, and `PortfolioTour.tsx`. For copywriters, "Highlights" or "Featured Work" is more appropriate. For journalists, "Featured Articles". For authors, "Featured Books".

### 3. No Quick/Simple Profile Setup Path
Users who just want photo + name + bio + CTA have no streamlined path. The onboarding has 7-8 steps regardless. No "Simple Profile" or "Quick Start" template option.

### 4. No "Achievements" Section
For copywriters and corporate types, there's no dedicated "Notable Achievements" or "Highlights" section distinct from Awards. The existing Awards section focuses on formal awards/festivals.

### 5. Profile Type `defaultTheme` Keys Are Legacy
In `profileSections.ts`, several types reference legacy theme keys (`screenplay`, `editorial`, `corporate`, `cinematic`, `noir`) that don't exist in the structured theme system.

### 6. Missing Layout Templates for Simple Use Cases
The 10 layout presets exist but there's no guidance matching them to simple use cases (reel + info, photo + bio + CTA, highlights showcase).

---

## Implementation Plan

### Task 1: Fix Onboarding Theme Picker to Use Structured Themes
- **`StepTheme.tsx`**: Replace import of `lib/themes.ts` with `themes/themes.ts`. Use `portfolioThemeList` and render `previewColors` dots instead of CSS-variable-based mini previews. Update `THEME_KEYS` to use new IDs: `cinematic-dark`, `warm-luxury`, `modern-minimal`, `mediterranean`, `noir-classic`, `midnight-glass`, `frost`.
- **`Onboarding.tsx`**: Change `INITIAL_DATA.theme` from `"minimal"` to `"cinematic-dark"`.

### Task 2: Fix `defaultTheme` in Profile Type Configs
- **`profileSections.ts`**: Map legacy `defaultTheme` values to valid structured theme IDs:
  - `screenplay` → `cinematic-dark`
  - `editorial` → `warm-luxury`
  - `corporate` → `frost`
  - `cinematic` → `cinematic-dark`
  - `noir` → `noir-classic`
  - `minimal` → `modern-minimal`

### Task 3: Type-Aware "Known For" / "Highlights" Label
- **`typeAwareLabels.ts`**: Add `knownForTitle` field. Defaults to `"Known For"`. Overrides:
  - copywriter: `"Highlights"`
  - journalist: `"Featured Articles"`
  - author: `"Featured Books"`
  - corporate_video: `"Featured Work"`
  - director_producer: `"Known For"` (keep)
  - actor: `"Known For"` (keep)
  - screenwriter/tv_writer/playwright: `"Known For"` (keep)
- **`PublicProfile.tsx`**: Import `getTypeAwareLabels` and use `labels.knownForTitle` instead of hardcoded `"Known For"`.
- **`ProjectsManager.tsx`**: Use type-aware label in the Notable toggle description.
- **`DemoCopywriter.tsx`**, **`DemoScreenwriter.tsx`**, **`DemoActor.tsx`**: Use type-aware label where applicable.
- **`SettingsPage.tsx`**: Update Known For Position card description to use type-aware term.

### Task 4: Add Quick Start / Simple Profile Template in Onboarding
- **`StepGoal.tsx`**: Add a 5th goal option: `"simple_presence"` — "Just a Simple Profile" / "Photo, bio, and contact info — nothing else needed". 
- **`Onboarding.tsx`**: When `primaryGoal === "simple_presence"`, skip the theme/services steps and go straight to completion with a minimal section order: `["bio", "contact"]`. This gives users photo + name + bio + CTA instantly.

### Task 5: Add "Achievements" Section Type
- **`profileSections.ts`**: Add `"achievements"` as a `SectionKey`. Add it to copywriter, corporate_video, and journalist configs as "Notable Achievements" / "Achievements".
- **`PortfolioSection.tsx`**: Map `achievements` to render the existing `SectionAwards` component (reuse awards renderer with different label) or create a lightweight achievements renderer that pulls from awards table with a filter. Simplest: alias achievements to awards with the label override.
- Add `achievements` to `defaultSectionLabels` in PortfolioSection.

### Task 6: Profile Type Config Completeness Audit
- **Copywriter**: Replace section label "Awards" → "Awards & Recognition". Ensure `results_wall` and `campaign_timeline` are in default section order.
- **Actor**: Ensure `demo_reels` is prominently first after hero. Add `known_for` conceptually via the existing `is_notable` project mechanism (already works).
- **Journalist**: Add `published_work` section if missing from config. Currently has `article_feed` but not `published_work`.
- **Author**: Ensure `bookshelf` section comes before `credits`.
- All types: Verify section labels match `typeAwareLabels` output.

### Task 7: Simple Profile Layout Guidance
- **`LayoutSwitcher.tsx`**: Add use-case hints to layout descriptions:
  - `minimal`: "Perfect for a simple photo + bio + contact page"
  - `cinematic`: "Best for actors and directors — reel-forward layout"
  - `compact`: "Everything scannable in 15 seconds"
- **`DashboardHome.tsx`**: In the "How It Works" or quick-start section, add profile template suggestions based on goal: "Just want the basics? Use the Minimal layout with Bio + Contact sections."

---

## Files to Edit
1. `src/components/onboarding/StepTheme.tsx` — structured theme picker
2. `src/pages/Onboarding.tsx` — default theme, quick-start skip logic
3. `src/config/profileSections.ts` — fix defaultTheme keys, add achievements section
4. `src/lib/typeAwareLabels.ts` — add `knownForTitle`
5. `src/pages/PublicProfile.tsx` — use type-aware Known For label
6. `src/pages/dashboard/ProjectsManager.tsx` — type-aware Notable label
7. `src/pages/dashboard/SettingsPage.tsx` — type-aware Known For label
8. `src/components/portfolio/PortfolioSection.tsx` — add achievements mapping
9. `src/components/portfolio/LayoutSwitcher.tsx` — add use-case hints
10. `src/components/onboarding/StepGoal.tsx` — add simple profile goal
11. `src/pages/DemoCopywriter.tsx` — type-aware Known For label
12. `src/pages/DemoScreenwriter.tsx` — type-aware Known For label
13. `src/pages/DemoActor.tsx` — type-aware Known For label

