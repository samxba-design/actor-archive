

# UX Gaps & Improvements Plan

## Issues Identified

### 1. No Form Draft Persistence
When users navigate between dashboard tabs (e.g. editing Profile, then clicking to Projects and back), all unsaved form state is lost. No `beforeunload` warnings exist either. This is a significant friction point.

### 2. Demo Pages Lack Explanatory Context
The demo pages show a tiny "Demo portfolio — Create yours free →" banner but don't explain what the user is looking at, how the customization works, or that every element can be hidden/customized. The `SectionOptionsBar` toggles are powerful but have no introductory context.

### 3. Dashboard Tour is Basic
The existing `DashboardTour` is a generic 5-step modal overlay. It doesn't mention that sections can be hidden/reordered, doesn't highlight customization power, and doesn't adapt to profile type.

### 4. No "Everything is Customizable" Messaging
Users aren't told during setup or in the dashboard that every text, section, and element can be disabled, hidden, or rearranged. This is a key value prop that's invisible.

### 5. No Contextual Help in Managers
While glossary tooltips exist for industry terms, there are no contextual help hints explaining what each manager does or how it maps to the portfolio (e.g., "These skills appear as tags in your Skills section").

---

## Implementation Plan

### A. Form Draft Persistence (Auto-Save to sessionStorage)

Create a `useFormDraft(key, form, setForm)` hook that:
- Saves form state to `sessionStorage` on every change (debounced 500ms)
- Restores from `sessionStorage` on mount if a draft exists
- Clears the draft on successful save
- Adds a `beforeunload` warning when there are unsaved changes

Apply to: `ProfileEditor`, `SettingsPage`, and any manager with inline edit forms.

### B. Enhanced Dashboard Startup Guide

Replace the current basic `DashboardTour` with a richer, visually appealing `GettingStartedGuide`:
- Triggered on first login (replaces current localStorage-based tour)
- Profile-type-aware steps (e.g., actors see "Upload headshots", writers see "Add scripts")
- Explicitly tells users: "Every section on your portfolio can be hidden, reordered, or customized"
- Includes a step about Edit Mode on the live portfolio
- Progress-bar style with illustrations/icons per step
- "Show me again" button in Settings for users who dismissed it

### C. Demo Page Explainer Overlay

Add a dismissible intro card/overlay to demo pages that appears on first visit:
- Title: "You're viewing a fully customizable portfolio"
- Bullet points: "Try the theme & layout switchers below", "Click section toggles to show/hide elements", "Drag sections to reorder", "Every element you see can be customized or removed"
- "Got it" dismiss button, tracked in localStorage
- Small persistent "?" help button in corner to re-show

### D. Contextual Help Banners in Managers

Add a small, dismissible info banner at the top of key manager pages explaining:
- What the manager controls and where it appears on the portfolio
- That the section can be hidden entirely from Settings or Edit Mode
- Example: In `SkillsManager`: "These skills appear as tags in the Skills section of your portfolio. You can hide this section entirely in Settings → Section Order."

Create a reusable `ManagerHelpBanner` component with:
- `title`, `description`, `learnMoreRoute` props
- Dismissible per-manager via localStorage
- Compact, non-intrusive design

### E. "Customization Power" Callouts

Add strategic callouts in:
- **Onboarding completion step** (`StepComplete`): "Remember: every section can be hidden, reordered, or styled from your portfolio's Edit Mode"
- **Settings page header**: Brief note that sections, themes, and layouts are all customizable
- **Edit Mode toolbar tooltip**: First-time tooltip explaining drag-to-reorder + eye-icon-to-toggle

---

## Technical Details

**New files:**
- `src/hooks/useFormDraft.ts` — sessionStorage-based form persistence hook
- `src/components/dashboard/GettingStartedGuide.tsx` — enhanced startup tour (replaces `DashboardTour`)
- `src/components/demo/DemoExplainer.tsx` — first-visit overlay for demo pages
- `src/components/dashboard/ManagerHelpBanner.tsx` — reusable contextual help banner

**Modified files:**
- `src/pages/dashboard/ProfileEditor.tsx` — add `useFormDraft`
- `src/pages/dashboard/SettingsPage.tsx` — add `useFormDraft` + customization note
- `src/pages/DemoScreenwriter.tsx`, `DemoActor.tsx`, `DemoCopywriter.tsx` — add `DemoExplainer`
- `src/components/onboarding/StepComplete.tsx` — add customization reminder
- `src/components/dashboard/DashboardLayout.tsx` — swap `DashboardTour` → `GettingStartedGuide`
- Key manager pages (Skills, Projects, Gallery, Awards, etc.) — add `ManagerHelpBanner`

