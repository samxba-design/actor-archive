

## Live Drag-and-Drop Portfolio Customizer

### Current State
Section reordering is done via arrow buttons in Settings — disconnected from the actual portfolio. Users can't see results in real-time.

### What We'll Build
An **Edit Mode** overlay on the live portfolio preview that lets authenticated owners:
1. **Drag sections** to reorder them vertically
2. **Toggle section visibility** inline (eye icon per section)
3. **Auto-save** the new order to the `section_order` column in profiles

### Architecture

**New dependency**: `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` — the standard React DnD library, lightweight and accessible.

**Key components**:
- **`EditModeProvider`** — context that tracks whether the logged-in user owns this profile and if edit mode is active
- **`EditModeToolbar`** — floating toolbar with "Edit Layout" toggle, appears only for profile owners viewing their own portfolio
- **`DraggableSectionWrapper`** — wraps each `PortfolioSection` with drag handle, hover outline, visibility toggle, and section label badge
- **`SortableSectionList`** — replaces the plain `.map()` in `PublicProfile.tsx` with a `DndContext` + `SortableContext` that handles reorder logic

**Flow**:
1. Owner visits their portfolio → sees a floating "Customize" button (bottom-left)
2. Click activates edit mode: sections get drag handles, blue outlines, and hover controls
3. Drag a section → smooth animated reorder with `@dnd-kit` collision detection
4. Toggle eye icon → instantly hides/shows section
5. Click "Save" → persists `section_order` + `sections_visible` to DB
6. Click "Done" → exits edit mode, returns to normal view

### Files

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/components/portfolio/EditModeProvider.tsx` | Context: isOwner, editMode state, save handler |
| Create | `src/components/portfolio/EditModeToolbar.tsx` | Floating toolbar with Customize/Save/Done buttons |
| Create | `src/components/portfolio/DraggableSectionWrapper.tsx` | Drag handle, outline, visibility toggle per section |
| Create | `src/components/portfolio/SortableSectionList.tsx` | DndContext + SortableContext wrapper with reorder logic |
| Modify | `src/pages/PublicProfile.tsx` | Wrap sections with EditModeProvider + SortableSectionList |
| Install | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | DnD library |

### Design Details
- Drag handles: 6-dot grip icon on left edge of each section
- Active drag: section gets subtle elevation shadow + 2px accent border
- Drop placeholder: dashed border where section will land
- Toolbar: glass-morphism floating bar matching existing portfolio theme variables
- Mobile: sections get tap-and-hold to initiate drag (dnd-kit handles this natively)
- Non-owners and logged-out visitors see the normal portfolio with zero edit UI

