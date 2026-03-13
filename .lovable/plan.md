

# Full Site Audit — Remaining Issues & Improvements

After a deep-dive into all 3 demo profiles (Screenwriter, Actor, Copywriter), all 10 layout presets, the public profile renderer, landing page, auth flows, and dashboard, here are the remaining issues:

---

## 1. Console Errors — `forwardRef` Warning (All Demos)

**Issue**: `PortfolioSectionWrapper` is a function component that receives a `ref` from `StandardLayout` grid contexts but doesn't use `forwardRef`. This generates React warnings for every `WithToggle` component rendered inside layout grids.

**Fix**: Wrap `PortfolioSectionWrapper` with `React.forwardRef` so it correctly forwards refs.

---

## 2. Actor Demo — StandardLayout Sidebar Too Narrow (280px)

**Issue**: `DemoActor.tsx` StandardLayout uses `lg:grid-cols-[1fr_280px]` for the Demo Reels / Representation row. 280px is too tight for Representation cards with agent names, phone numbers, and emails — text gets truncated.

**Fix**: Widen to `[1fr_320px]` to match the Screenwriter demo's corrected sidebar width.

---

## 3. Copywriter Demo — StandardLayout Sidebar Too Narrow (280px)  

**Issue**: `DemoCopywriter.tsx` StandardLayout uses `[1fr_280px]` for Case Studies / Skills+Education. Skills tags and education cards overflow or wrap awkwardly at 280px.

**Fix**: Widen to `[1fr_320px]`.

---

## 4. Screenwriter Dashboard Layout — Duplicate "Services" Section

**Issue**: In `DemoScreenwriter.tsx` DashboardLayout, Services appears twice: once in the main 2-col grid (line 444) and again in the bottom 3-col grid (line 477-480). This is redundant.

**Fix**: Replace the duplicate Services card in the bottom 3-col grid with `RepresentationWithToggle` or `EducationWithToggle` — content that's currently missing from the Dashboard layout.

---

## 5. Actor Dashboard Layout — Missing Key Sections

**Issue**: Actor's DashboardLayout is missing Gallery, Events, Representation (as a standalone card), and Skills. These are all present in other layouts.

**Fix**: Add a row with Gallery and Worked With (clients) cards below the existing grid.

---

## 6. Copywriter Dashboard Layout — Missing Published Work

**Issue**: Copywriter's DashboardLayout shows Case Studies, Services, Clients, Testimonials, Awards, Press, Skills — but is missing Published Work, which is a core copywriter section.

**Fix**: Add Published Work card to the dashboard grid.

---

## 7. Actor StandardLayout — Missing Services/Clients Section

**Issue**: Actor StandardLayout shows Stats, Clients, Demo Reels, Representation, Credits, Awards, Training, Gallery, Testimonials, Press — but no Events, Skills as standalone, or Services if the actor offers workshops/coaching.

**Recommendation**: Minor — acceptable for actor profile type. No change needed unless user requests.

---

## 8. `PortfolioSectionWrapper` Section Number for `index={-1}`

**Issue**: Several layouts use `index={-1}` for "Known For" / "Written For" sections. This produces section number "00" (from `String(-1 + 1).padStart(2, "0")`). This is fine because `sectionNumberStyle` defaults to `'hidden'` in most themes, but if a theme shows numbers, "00" looks odd.

**Fix**: Skip rendering the section number when `index < 0`.

---

## 9. All Demo Pages — Identical Boilerplate (Minor Tech Debt)

**Issue**: All three demo pages (~600 lines each) share nearly identical main page wrappers (banner, DemoProfileTabs, Hero, CustomizationPanel, client logos positioning, platform CTA, footer, switchers, MidScrollCTA, DemoExplainer, PDF modal). This is ~100 lines of duplicated code per file.

**Recommendation**: Extract a shared `DemoPageShell` component. Low priority — functional, just maintenance burden.

---

## Summary: Actionable Fixes (Implementation Order)

| # | Fix | Files | Effort |
|---|-----|-------|--------|
| 1 | Add `forwardRef` to `PortfolioSectionWrapper` | `PortfolioSectionWrapper.tsx` | Small |
| 2 | Widen Actor StandardLayout sidebar 280→320px | `DemoActor.tsx` | Tiny |
| 3 | Widen Copywriter StandardLayout sidebar 280→320px | `DemoCopywriter.tsx` | Tiny |
| 4 | Remove duplicate Services in Screenwriter DashboardLayout, replace with Education | `DemoScreenwriter.tsx` | Tiny |
| 5 | Skip section number when `index < 0` | `PortfolioSectionWrapper.tsx` | Tiny |
| 6 | Add missing sections to Actor & Copywriter DashboardLayouts | `DemoActor.tsx`, `DemoCopywriter.tsx` | Small |

Total: 4 files, all small targeted edits. No database or backend changes needed.

