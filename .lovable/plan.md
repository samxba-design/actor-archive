

# Comprehensive Dashboard Overhaul Plan

## Problems Identified

1. **No way to change profile type** after onboarding. The Profile Editor page has `profile_type` in the form but never renders a selector or saves it.
2. **No "Preview Portfolio" button** visible in the dashboard. The sidebar has one but only when `slug` is set and only in the footer — easy to miss. No preview button on the Profile Editor or Dashboard Home.
3. **Dark-on-dark text** throughout the dashboard. The `DashboardLayout` uses `landing-*` CSS variables (designed for a dark landing page), but child components use standard Tailwind classes like `text-foreground`, `text-muted-foreground`, `bg-card`, `bg-muted` — these resolve to **light theme values** (near-white backgrounds with dark text), causing contrast collisions against the dark `landing-bg` wrapper.
4. **Profile photo UX is confusing** — no preview of current state, file input gives no feedback, uploaded gallery photos can't be selected as profile photo.
5. **"Add Event", "Add Award" buttons don't work** — these buttons use `onClick={openAdd}` which sets `dialogOpen` to `true`. The buttons themselves look correct in code. The likely issue is the dark-on-dark styling making the Dialog invisible or the button appearing unclickable due to color. Need to verify Dialog renders with correct colors.
6. **No client/company association** on projects for copywriters — the `projects` table has `client` column but it's not prominently surfaced for copywriter profile types.
7. **No profile-type-aware field labels** — e.g., "Logline" shows for all types when it should say "Brief" or "Description" for copywriters.

## Plan

### Task 1: Profile Type Switcher in Settings
- Add a "Profile Type" card to `SettingsPage.tsx` with a multi-select grid (reusing the `PROFILE_TYPES` config from `profileSections.ts`)
- When user selects a new type, update `profile_type` and `secondary_types` in the profiles table
- On save, sidebar, sections, and all type-aware logic automatically adjusts
- Show a warning that changing type will reset section order

### Task 2: Fix Dark-on-Dark Color System
The root cause: `DashboardLayout` applies `landing-bg` / `landing-fg` as inline styles, but all child components use standard CSS variables (`--foreground`, `--card`, etc.) which are light-mode values.

**Fix approach**: Override the standard CSS variables inside the dashboard context to match the dark landing palette. Add a `.dashboard-shell` class to `DashboardLayout`'s wrapper div, and in `index.css` define:
```css
.dashboard-shell {
  --background: var(--landing-bg);
  --foreground: var(--landing-fg);
  --card: var(--landing-card);
  --card-foreground: var(--landing-fg);
  --muted: 345 15% 18%;
  --muted-foreground: var(--landing-muted);
  --border: var(--landing-border);
  --input: var(--landing-border);
  --accent: 345 20% 16%;
  --accent-foreground: var(--landing-fg);
  --popover: var(--landing-card);
  --popover-foreground: var(--landing-fg);
  --primary: var(--landing-accent);
  --primary-foreground: var(--landing-fg);
}
```
This makes **all** shadcn components (Cards, Buttons, Inputs, Dialogs, Selects) render correctly in the dark dashboard without touching individual components. Remove all inline `style={{ color: "hsl(var(--landing-fg))" }}` hacks from `DashboardHome.tsx` and other pages.

### Task 3: Add Prominent "Preview Portfolio" Button
- Add a sticky "Preview" button to the dashboard header bar in `DashboardLayout.tsx` (next to the keyboard shortcut icon)
- Opens `/p/{slug}` in a new tab
- If no slug is set, show tooltip "Set your URL slug in Settings first"
- Also add a preview button to `ProfileEditor.tsx` header

### Task 4: Fix Profile Photo UX
In `ProfileEditor.tsx`:
- Show current photo with a clear label: "Current Profile Photo" with the image, or "No profile photo set" placeholder
- Add a "Remove" button to clear the photo
- Add helper text: "This photo appears as your main headshot on your portfolio"
- If gallery images exist, add "Choose from Gallery" button that opens a picker modal showing uploaded gallery images

### Task 5: Fix Dialog/Button Visibility (Consequence of Task 2)
The "Add Event", "Add Award" buttons likely work in code but are invisible or low-contrast due to the color system mismatch. Fixing Task 2 should resolve this. Additionally:
- Verify all Dialog components inherit correct colors (they use `--popover` vars, which Task 2 fixes)
- Add explicit `text-foreground` to any remaining hardcoded color references

### Task 6: Profile-Type-Aware Labels & Fields
Create a utility `getTypeAwareLabels(profileType)` that returns context-specific labels:
- **Screenwriter/TV Writer/Playwright**: "Logline", "Script", "Credits"
- **Copywriter**: "Brief/Description", "Writing Sample", "Client Work" + prominent `client` field
- **Actor**: "Role", "Demo Reel", "Credits"
- **Author**: "Synopsis", "Book", "Publications"
- **Journalist**: "Lede/Summary", "Article", "Published Work"

Apply these labels in `ProjectsManager.tsx`, `PageHeader` descriptions, and empty state copy.

For copywriters specifically:
- Surface `client` field prominently in the project form (already exists in DB)
- Add "Company/Client" association field to the project card display
- Add YouTube/video link field for produced video content
- Add "Final Produced Piece" URL field for linking to live campaigns

### Task 7: Contextual Guidance
- Enhance `PageHeader.tsx` to show profile-type-specific descriptions
- Add helper text under key form fields explaining what they're for
- Add a "What should I put here?" expandable tip to empty states
- On Dashboard Home, show the current profile type as a badge with "Change" link to Settings

## Technical Notes
- The color fix (Task 2) is the highest-impact change — it fixes buttons, dialogs, text, inputs, and cards all at once
- Profile type change (Task 1) needs to also update `section_order` and `sections_visible` to match the new type's default sections
- No database migrations needed — all columns already exist (`profile_type`, `secondary_types`, `client`, etc.)

