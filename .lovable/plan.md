

# Work Collections — Portfolio Folder System for Copywriters

## The Problem

Right now, a copywriter with 30+ pieces gets a single flat grid. The `category` field on published_works provides basic grouping, but users can't create their own named collections, control which pieces go where, or present a visual "browse by folder" experience. For prolific writers, this becomes cluttered and overwhelming for visitors.

## What This Adds

A **Collections** system — user-created, named folders that group published works (and optionally writing samples/projects) into browsable sets. Think of it like a visual bookshelf where each shelf has a name, cover image, and description.

**Portfolio visitor experience:**
- Sees a grid of collection cards (e.g., "Crypto & Web3", "Email Campaigns", "SaaS Landing Pages")
- Each card shows a cover image, title, piece count, and optional description
- Clicking a card expands inline (accordion) or opens a sub-view showing the pieces inside
- Featured/uncollected pieces still appear at the top level

**Dashboard experience:**
- New "Collections Manager" page under Content
- Create/rename/delete collections with custom names, cover images, descriptions
- Drag pieces into collections (a piece can belong to one collection or none)
- Reorder collections and pieces within them

## Technical Design

### Database

One new table:

```sql
CREATE TABLE public.work_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_expanded_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

Add a nullable `collection_id` column to `published_works`:

```sql
ALTER TABLE public.published_works 
  ADD COLUMN collection_id UUID REFERENCES public.work_collections(id) ON DELETE SET NULL;
```

Standard RLS: owner CRUD + public SELECT on published profiles.

### New Files

1. **`src/pages/dashboard/CollectionsManager.tsx`** — CRUD interface for collections, with the ability to assign published works to them
2. **`src/components/portfolio/sections/SectionCollections.tsx`** — Portfolio renderer showing collection cards with expand/collapse to reveal contents inside

### Modified Files

1. **`src/pages/dashboard/PublishedWorkManager.tsx`** — Add a "Collection" dropdown to the add/edit form
2. **`src/components/dashboard/DashboardSidebar.tsx`** — Add "Collections" nav item under Content
3. **`src/config/profileSections.ts`** — Register `collections` section for copywriter/journalist types
4. **`src/pages/PublicProfile.tsx`** — Wire up the new section renderer
5. **`src/pages/DemoCopywriter.tsx`** — Add demo data and render collections in layouts

### Portfolio Section Renderer

The `SectionCollections` component will:
- Render collection cards in a 2-column grid
- Each card shows cover image, name, piece count badge, and description snippet
- Click to expand inline (animated accordion) revealing the pieces inside as a mini-grid
- Uncollected pieces render separately below (or above, depending on variant)
- Support `variant` prop: `"grid"` (card-based), `"accordion"` (stacked expandable), `"tabs"` (horizontal tab switcher)

### Scope Control

- Available to all profile types that use published_works (copywriter, journalist, author)
- Collections section is optional — users who don't create collections see the existing flat published_works section unchanged
- A piece without a `collection_id` is "uncollected" and renders normally

## Implementation: 6 Steps

1. Run migration: create `work_collections` table + add `collection_id` to `published_works` + RLS policies
2. Create `CollectionsManager.tsx` dashboard page with CRUD
3. Update `PublishedWorkManager.tsx` to include collection assignment dropdown
4. Create `SectionCollections.tsx` portfolio renderer with grid/accordion/tabs variants
5. Register in section config, sidebar nav, and public profile renderer
6. Add demo data to `DemoCopywriter.tsx`

