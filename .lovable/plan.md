

## Compact Layout Fix, Featured Project Redesign, Animated Guide & Template Polish

### 1. Remove Known For from Compact Layout Body
The Compact layout currently has a full-width `SectionKnownFor` carousel that dominates the page. Since Known For already appears in the hero above the name, this is redundant. Remove lines 353-358 from `DemoScreenwriter.tsx` (the Known For section in CompactLayout).

### 2. Redesign Featured Project Card in Hero
The current featured project card (right side of hero, `PortfolioHero.tsx` lines 354-438) has issues:
- "View on IMDb" uses the full `PortfolioCTA` component with arrow, which looks oversized for a compact card
- Layout is a horizontal flex with poster left + info right, but alignment feels cramped

**Redesign approach:**
- Replace the `PortfolioCTA` "View on IMDb" button with a small, subtle inline link: just the text "IMDb" with an external-link icon, styled as a small pill/badge (like the genre tags)
- Make the entire card clickable if `imdb_link` exists (wrap in `<a>`) instead of having a separate button
- Remove the dedicated CTA button entirely — the card itself is the link
- Add a subtle hover overlay on the poster side with an external-link icon
- Tighten spacing: reduce `p-4` to `p-3`, reduce `space-y-2` to `space-y-1.5`

### 3. First-Visit Animated Guide (Onboarding Tour)
Create a new component `src/components/portfolio/PortfolioTour.tsx`:
- On first visit (tracked via `localStorage` key `portfolio-tour-seen`), show a step-by-step highlight overlay
- Steps highlight key sections: Hero/Identity, Known For, Featured Project, Credits, Stats Bar
- Each step: a dark overlay with a "spotlight" cutout around the target element, a tooltip with title + description + "Next"/"Done" buttons
- 5-6 steps total, each explaining what can be customized
- Small "Skip Tour" link on each step
- Uses `document.getElementById()` to find target elements (add `id` attributes to key sections in hero and layout)
- Animate transitions between steps with fade

**Steps:**
1. Profile photo + name area — "Your identity. Customize your name, photo, tagline, and representation."
2. Known For strip — "Showcase your best work. Add up to 6 key credits with poster art."
3. Featured Project card — "Highlight a current project. Links to IMDb, scripts, or custom URLs."
4. Stats bar — "Auto-generated from your portfolio data. Scripts, awards, and active projects."
5. Layout/Theme switchers — "Choose from 10 layouts and 7 visual themes. Every section can be rearranged."

### 4. Cross-Template Visual Audit & Fixes

**Classic:** CreditHeroCard — the `ArrowRight` icon on hover (line 224) should be `ExternalLink` for consistency with other clickable cards.

**Standard:** The Known For carousel at top is fine but the `display="both"` makes cards tall. Switch to `display="image"` for a cleaner, more visual strip.

**Cinematic:** Good as-is. The full-width poster gallery + marquee ticker work well.

**Compact (post-fix):** After removing Known For, the layout is cleaner. Move client logos bar to below the credits table for better flow.

**Magazine:** Good structure. No changes needed.

**Spotlight:** Known For inside accordion loses visual impact. Add `display="image"` to keep it compact when opened.

**Timeline:** Good. No changes.

**Bento:** Known For strip spanning 2 cols works. No changes.

**Minimal:** Good. Intentionally sparse.

**Dashboard:** Known For in half-width GlassCard is cramped. Switch from `strip` to `grid` with `display="image"` for better use of space.

### Files to Edit

| File | Changes |
|---|---|
| `src/pages/DemoScreenwriter.tsx` | Remove Known For from Compact; tweak Standard display; fix Classic icon; adjust Dashboard Known For |
| `src/components/portfolio/PortfolioHero.tsx` | Redesign featured project card — remove CTA button, make whole card clickable, add subtle IMDb badge, tighten spacing; add `id` attributes for tour targets |
| `src/components/portfolio/PortfolioTour.tsx` | **NEW** — First-visit animated guide with spotlight overlay and step tooltips |

### Implementation Order
1. Redesign featured project card in hero
2. Fix Compact layout (remove Known For section)
3. Apply cross-template tweaks
4. Build animated tour component
5. Integrate tour into DemoScreenwriter page

