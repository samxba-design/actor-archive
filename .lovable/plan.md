

# Cross-Pollination Audit: Features to Extend Across Profile Types

## Findings

After reviewing all three demo pages, the section registry, and the portfolio renderer, here are the gaps where improvements made for one profile type should be extended to others:

### 1. Collections — Missing from Section Registry

The `work_collections` system was built and wired into the portfolio renderer and copywriter demo, but the **section registry** (`profileSections.ts`) doesn't include `"collections"` as a `SectionKey`. This means:
- The live layout customizer won't show it as a toggleable/reorderable section
- Profile types that should support it (journalist, author) can't opt in

**Fix**: Add `"collections"` to the `SectionKey` union type. Add it to the `copywriter`, `journalist`, and `author` section configs (these types all use `published_work` and benefit from folder organization).

### 2. Journalist Demo Page — Missing Entirely

There's no `DemoJournalist.tsx`. Journalists share many sections with copywriters (published work, collections, article feed, client logos, press). This is a bigger feature request — not in scope for this fix, but worth noting.

### 3. Screenwriter StandardLayout — One Sidebar Still 280px

In `DemoScreenwriter.tsx` StandardLayout, the Gallery/Skills/Education sidebar grid (line ~104) still uses `lg:grid-cols-[1fr_280px]`. We widened the top sidebar to 320px but missed this second grid row.

**Fix**: Widen to `[1fr_320px]` for consistency.

### 4. Education Section — Missing from Screenwriter & Actor Registry

The section registry for `screenwriter` doesn't include `education`, even though the demo shows it. Actor has `training` (which maps to `EducationWithToggle`) but the key is labeled `"training"` not `"education"`. This inconsistency means the live layout customizer may not show Education for screenwriters.

**Fix**: Add `{ key: "education", label: "Education & Training" }` to the screenwriter section config in the registry.

### 5. Services Section — Missing from Actor Registry

The actor demo doesn't include Services, but actors who offer workshops/coaching could benefit from it. The registry omits `services` for actors.

**Recommendation**: Skip — actors rarely list services. Only add if user requests.

### 6. Published Work + Collections — Available to Journalist/Author in Renderer but Not Demo'd

The portfolio renderer already handles `published_work` with automatic collection detection for ALL profile types. But only the copywriter demo showcases this. Journalist and author profiles in the registry already have `published_work` listed, so the feature works — it's just not demo'd.

**No code change needed** — the renderer handles it automatically.

---

## Implementation Plan

| # | Change | File | Effort |
|---|--------|------|--------|
| 1 | Add `"collections"` to `SectionKey` union | `profileSections.ts` | Tiny |
| 2 | Add collections section config to copywriter, journalist, author types | `profileSections.ts` | Tiny |
| 3 | Widen Screenwriter StandardLayout second sidebar 280→320px | `DemoScreenwriter.tsx` | Tiny |
| 4 | Add `education` section to screenwriter registry config | `profileSections.ts` | Tiny |

All changes are small, targeted edits. No database or backend changes needed.

