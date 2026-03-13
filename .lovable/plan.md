

# Status Audit & Remaining Work

## What's Complete
- Form draft persistence (ProfileEditor, SettingsPage)
- Enhanced Getting Started Guide (profile-type-aware, 7 steps)
- Demo Explainer overlay on all 3 demo pages
- ManagerHelpBanner component created
- Customization callout in StepComplete
- Weighted ProfileReadiness score
- Interaction tracking (reel_played, contact_clicked, cta_clicked, cv_downloaded)
- Analytics engagement metrics display
- Auto-save with status indicator in ProfileEditor
- Live slug availability check
- QR code generation in Embed & Share
- Contact notify edge function wired in PortfolioFooter

## What's Missing

### 1. ManagerHelpBanner only applied to SkillsManager
It was created but never added to the other 12+ manager pages. Each needs a contextual banner explaining what the data controls and that the section can be hidden.

**Pages to add banners:**
- ProjectsManager — "These appear in your Projects/Credits section"
- GalleryManager — "Images show in your Gallery section"
- AwardsManager — "Awards display in your Awards section"
- EducationManager — "Training appears in your Education section"
- TestimonialsManager — "Quotes show in your Testimonials section"
- ServicesManager — "Services appear in your Services section"
- PressManager — "Press items show in your Press section"
- EventsManager — "Events display in your Events section"
- SocialLinksManager — "Links appear as icons on your portfolio"
- ClientManager — "Logos show in your Clients section"
- RepresentationManager — "Agent info shows in your Representation section"
- PublishedWorkManager — "Published work appears in its own section"
- ScriptManager — "Scripts appear with optional password protection"

### 2. `as any` cast still in PortfolioFooter (line 97)
`subject_type: form.subject_type as any` — should be properly typed.

### 3. Settings page customization note
Need to verify the header note about customization was added.

## Plan

**A. Add ManagerHelpBanner to all 13 manager pages** — import the component and add it below the PageHeader in each file with appropriate copy explaining what the section does and linking to Settings.

**B. Fix the remaining `as any` cast** in PortfolioFooter.tsx line 97.

**C. Verify Settings customization header** — check if it was added, add if missing.

Each banner follows the same pattern: import `ManagerHelpBanner`, add it right after `<PageHeader>`, with a unique `id`, descriptive `title`, short `description`, and `learnMoreRoute="/dashboard/settings"`.

