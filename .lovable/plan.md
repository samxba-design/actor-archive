

# Profile Type Visibility & Quick-Switch Improvements

## Current State
- Profile type switching exists in Settings but is buried — users must scroll to find it
- The sidebar shows no indication of what profile type the user is currently building
- There's no persistent reminder that each type provides purpose-built fields, labels, and sections
- The onboarding `StepProfileType` cards show descriptions but don't emphasize the "built specifically for you" message strongly enough

## Plan

### 1. Add Profile Type Badge to Sidebar Header
In `DashboardSidebar.tsx`, add a prominent badge/chip at the top of the sidebar showing the current profile type (e.g., "Screenwriter" with its icon). Clicking it navigates to Settings (profile type section). This gives constant visibility of the active type.

- Display the profile type label from `PROFILE_TYPES` using the `profileType` from context
- Include the matching icon from the ICON_MAP
- Add a small "Switch" indicator or chevron to signal it's clickable
- Style as a compact, branded chip between the sidebar header and the first nav group

### 2. Add Quick-Switch Dropdown to Dashboard Header
In `DashboardHome.tsx` (or the `PageHeader` area), add a prominent profile type indicator with a dropdown/popover that lets users switch types without navigating to Settings. This reuses the existing `handleProfileTypeChange` logic.

- Show current type as a Badge with icon + label + dropdown chevron
- Dropdown lists all 9 types (excluding multi_hyphenate) with descriptions
- Selecting a type triggers the same `handleProfileTypeChange` flow (update DB, rebuild sections, update context)
- Include a subtle note: "Each type configures your portfolio with purpose-built sections, labels, and tools"

### 3. Add "Built for You" Contextual Messaging
Add a small descriptive line beneath the profile type badge in the sidebar and on the DashboardHome page that reinforces the tailored nature:

- Sidebar badge tooltip: "Your dashboard, sections, and labels are tailored for [Type]"
- DashboardHome: Add a contextual banner/card near the top: "Your portfolio is configured as a **Screenwriter** profile — sections, labels, and tools are purpose-built for your craft. [Switch type →]"

### 4. Enhance Onboarding StepProfileType Messaging
In `StepProfileType.tsx`, update the subtitle copy to better communicate that each type is purpose-built:

- Change description from current generic text to: "Each type comes with purpose-built sections, terminology, and tools designed specifically for your craft."
- Add a small "What does this mean?" expandable that lists examples: "Screenwriters get logline fields, script libraries, and coverage tools. Actors get demo reel sections, headshot galleries, and stats bars."

### Files to Edit
1. `src/components/dashboard/DashboardSidebar.tsx` — profile type badge at top
2. `src/pages/dashboard/DashboardHome.tsx` — contextual banner + quick-switch
3. `src/components/onboarding/StepProfileType.tsx` — enhanced messaging
4. `src/components/dashboard/PageHeader.tsx` — optional profile type indicator in header

