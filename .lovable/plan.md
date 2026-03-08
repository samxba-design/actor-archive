

## Author/Novelist Support Audit

### What Exists
- **Profile type** `author` is registered with sections: Hero, Bio, Bookshelf, Publications, Awards, Press, Endorsements, Readings & Tours, Representation, Contact
- **DB columns** on `projects` table: `publisher`, `isbn`, `page_count`, `purchase_links` (jsonb) — all exist
- **Project types**: `novel`, `book`, `short_story` enums exist
- **SectionBookshelf** component renders book covers, publisher, year, and purchase links
- **Google Books API** utility exists at `src/lib/googleBooks.ts` — fully functional `searchBooks()` method
- **Bookshelf query** in PortfolioSection filters projects by `["novel", "book", "short_story"]`

### What's Missing

**1. ProjectsManager has no author-specific fields**
The form only shows: title, type, slug, logline, description, genre, year, director, role, status, video URL, poster URL. Missing:
- `publisher` field
- `isbn` field  
- `page_count` field
- `purchase_links` editor (add Amazon, Bookshop.org, etc.)
- Google Books search integration (auto-fill cover, publisher, ISBN from `src/lib/googleBooks.ts`)

**2. No conditional form fields based on project type**
When an author selects `novel`, `book`, or `short_story`, they should see book-specific fields (publisher, ISBN, page count, purchase links) instead of irrelevant ones (director, video URL).

**3. Industry Tools has no author-relevant content**
The contest deadlines and staffing checklist are screenwriter/playwright-only. Authors need:
- Literary contest deadlines (PEN awards, National Book Award, Pushcart Prize, etc.)
- Query season checklist (query letter, synopsis, comp titles, sample chapters)

**4. Coverage Simulator and Comp Title Matcher don't adapt for authors**
These tools use screenwriting terminology. Authors need book-specific language (manuscript vs. script, query letter vs. logline).

**5. No "Reading/Tour" event type differentiation**
Events section exists but has no author-specific context like "Book Signing", "Reading", "Book Tour".

---

### Implementation Plan

#### 1. Add author-specific fields to ProjectsManager
- Show `publisher`, `isbn`, `page_count` fields when project_type is `novel`, `book`, or `short_story`
- Hide irrelevant fields (`director`, `video_url`) for book types
- Add a `purchase_links` editor: repeatable rows with label (Amazon, Bookshop, etc.) + URL
- Integrate Google Books search: a search button that calls `searchBooks()` and auto-fills cover, publisher, ISBN, page count

#### 2. Update Industry Tools for authors
- Add literary contest deadlines (PEN/Faulkner, National Book Award, Pushcart Prize, Reedsy, etc.)
- Add a "Query Season Prep" checklist for authors (polish query letter, prepare synopsis, update comp titles, etc.)
- Filter by `profileType === "author"` alongside existing writer checks

#### 3. Adapt smart tools for authors
- Update Coverage Simulator prompt to handle manuscripts (not just scripts)
- Update Comp Title Matcher to use book-appropriate language

#### Files to Edit
- `src/pages/dashboard/ProjectsManager.tsx` — conditional fields, purchase links editor, Google Books integration
- `src/pages/dashboard/IndustryTools.tsx` — add literary contests + query checklist
- `supabase/functions/coverage-simulator/index.ts` — adapt prompts for book manuscripts

#### Files unchanged
- `src/lib/googleBooks.ts` — already complete
- `src/components/portfolio/sections/SectionBookshelf.tsx` — already renders all book data
- `src/config/profileSections.ts` — author config already complete

