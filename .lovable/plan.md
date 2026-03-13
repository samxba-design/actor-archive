

# Remaining Gaps & Fixes for Perfection

After a thorough audit of every profile type config, label system, demo page, and public portfolio rendering, here are the remaining issues:

---

## 1. Hardcoded "Known For" in Demo Pages & ProjectsManager

**DemoScreenwriter.tsx** — 3 instances of hardcoded `"Known For"` (lines 43, 70, 142). For screenwriters the label should stay "Known For" per `typeAwareLabels`, so this is actually correct. Same for **DemoActor.tsx** (line 54, 126, 537). These are fine for actor/screenwriter types.

**ProjectsManager.tsx** (lines 640-642) — The Notable toggle label and description are hardcoded:
- `"Known For (Notable)"` and `"Show in the "Known For" strip"`
- Should use `labels.knownForTitle` so copywriters see "Highlights" instead.

**PortfolioTour.tsx** (line 19) — Tour step title is hardcoded `"Known For"`. Should be dynamic based on profile type, but the tour already filters by `profileTypes` (only shows for screenwriter/actor/etc where "Known For" is correct). However, if a copywriter is multi-hyphenate with these types, it would show the wrong label.

**Fix**: Update `ProjectsManager.tsx` to use `labels.knownForTitle`. Optionally update `PortfolioTour.tsx` to accept dynamic label.

---

## 2. Demo Pages Missing Type-Aware Labels for Non-KnownFor Sections

The demo pages use hardcoded section titles. For demo purposes this is acceptable since each demo page targets a specific profile type. No fix needed.

---

## 3. `KNOWN_FOR_POSITIONS` Descriptions in SettingsPage Are Generic

The "Hidden" option description (line 30) says `"Don't show this section on your portfolio"` — generic but fine. However the descriptions reference "poster cards" which doesn't make sense for copywriters where it's "Highlights". 

**Fix**: Make the `KNOWN_FOR_POSITIONS` descriptions use the dynamic label from `getTypeAwareLabels`.

---

## 4. Missing `education` / `training` Section in Some Configs

- **Copywriter** config has no `training` or `education` section. Copywriters may have certifications (Google Ads, HubSpot). Should add `education` as "Certifications & Training".
- **Journalist** config has no `training`/`education` section. Should add as "Education".
- **Corporate Video** config has no `training`/`education` section. Should add as "Certifications".

---

## 5. Missing `social_links` Section in All Profile Type Configs

The `social_links` section exists in `PortfolioSection.tsx` and renders `SectionSocialLinks`, but no profile type config in `profileSections.ts` includes it. Users can manage social links in the dashboard but they never appear on the portfolio unless manually added to `section_order`.

**Fix**: Add `social_links` as a section in every profile type config (near the end, before `contact`).

---

## 6. Missing `custom_sections` in Profile Type Configs

Similarly, `custom_sections` renders in `PortfolioSection.tsx` but isn't listed in any type config. Users who create custom sections may not see them unless they manually add the key.

**Fix**: Add `custom_sections` to each config as the last section before `contact`.

---

## 7. `video_portfolio` Section Missing from Director/Producer

Director/Producer config has `demo_reels` but no `video_portfolio`. A separate video portfolio section could showcase different content. Minor gap — `demo_reels` covers this adequately.

---

## Summary: Actionable Fixes

| # | Issue | Files | Priority |
|---|-------|-------|----------|
| 1 | ProjectsManager "Known For" label hardcoded | `ProjectsManager.tsx` | High |
| 2 | SettingsPage KNOWN_FOR_POSITIONS descriptions hardcoded | `SettingsPage.tsx` | Medium |
| 3 | Missing `social_links` section in all profile type configs | `profileSections.ts` | High |
| 4 | Missing `education` section for copywriter, journalist, corporate | `profileSections.ts` | Medium |
| 5 | Missing `custom_sections` in profile type configs | `profileSections.ts` | Medium |
| 6 | PortfolioTour "Known For" title hardcoded | `PortfolioTour.tsx` | Low |

### Technical Approach

**Task 1** — In `ProjectsManager.tsx`, the `labels` variable already exists from `getTypeAwareLabels`. Replace `"Known For (Notable)"` with `{labels.knownForTitle} (Notable)` and the description string similarly.

**Task 2** — In `SettingsPage.tsx`, make the KNOWN_FOR_POSITIONS array dynamic or interpolate `knownForTitle` into the CardDescription text (already partially done).

**Task 3** — Add `{ key: "social_links", label: "Social Links", description: "Links to your social profiles" }` to every profile type config, positioned just before `contact`.

**Task 4** — Add `{ key: "education", label: "Certifications & Training", description: "..." }` to copywriter, journalist, and corporate_video configs. Use type-appropriate labels.

**Task 5** — Add `{ key: "custom_sections", label: "Custom Sections", description: "Your custom content blocks" }` as the last entry before `contact` in each config.

**Task 6** — In `PortfolioTour.tsx`, optionally pass profileType-aware label for the "Known For" step title.

