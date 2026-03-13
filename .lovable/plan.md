

# Backend Improvements & Smart Import Features

## Current State

The dashboard already has several auto-fill integrations:
- **TMDB search** for film/TV projects (poster, cast, synopsis, genre auto-fill)
- **Google Books search** for book-type projects (cover, publisher, ISBN auto-fill)
- **Clearbit logos** for client company logos
- **AI Bio Builder** wizard that generates bios from structured prompts
- **AI Writing Assistant** for loglines, descriptions, etc.

What's **completely missing**: resume import, LinkedIn scraping, URL-based profile import, and bulk data population from external sources.

## What Users Need to Build a Complete Profile

A user must currently fill in ~15 different managers manually: Profile info, Projects, Awards, Education, Skills, Services, Gallery, Press, Testimonials, Social Links, Representation, Published Works, Events, Client Logos, Custom Sections. This is extremely tedious. Smart import would dramatically reduce this.

---

## Implementation Plan

### 1. Resume/PDF Import via AI Parsing

**Flow**: User uploads a PDF resume → edge function parses it with AI → extracts structured data → auto-populates profile fields, education, skills, and work history as projects.

- Create `supabase/functions/parse-resume/index.ts` edge function
- Accept PDF file upload, convert to text using a simple PDF text extraction approach
- Send extracted text to Lovable AI (e.g. `google/gemini-2.5-flash`) with a structured prompt requesting JSON output for: `display_name`, `tagline`, `bio`, `location`, `skills[]`, `education[]`, `work_history[]` (mapped to projects), `social_links[]`
- Return structured JSON to frontend
- Create `src/components/dashboard/ResumeImporter.tsx` — a dialog with file upload, parsing progress, and a review/confirm step showing extracted data before committing
- Add "Import from Resume" button to `ProfileEditor.tsx` and `DashboardHome.tsx`
- On confirm, batch-insert into `profiles`, `skills`, `education`, `projects`, `social_links` tables

### 2. URL Scraping for Auto-Fill (LinkedIn, IMDb, Personal Sites)

**Flow**: User pastes a URL → edge function scrapes it via Firecrawl → AI extracts structured profile data → user reviews and confirms.

- Connect Firecrawl connector (already available in workspace)
- Create `supabase/functions/scrape-profile-url/index.ts` edge function
- Accept a URL, call Firecrawl scrape API for markdown content
- Send markdown to Lovable AI with a prompt like: "Extract professional profile data from this page. Return JSON with: name, title, bio, location, skills, work_history, education, social_links, awards"
- Handle different URL types with tailored prompts:
  - LinkedIn URLs → focus on experience, education, skills
  - IMDb URLs → focus on filmography, credits (supplement existing TMDB)
  - Personal website URLs → extract bio, portfolio items, contact info
- Create `src/components/dashboard/URLImporter.tsx` — input field for URL, scrape button, loading state, review/edit step
- Add to `ProfileEditor.tsx` as "Import from URL" alongside resume import

### 3. Smart Auto-Fill for Individual Managers

Extend the URL-scraping pattern to individual managers:

- **ProjectsManager**: "Import from URL" button that scrapes a project page (Behance, Dribbble, Medium article) and pre-fills title, description, images, tags
- **PressManager**: Paste an article URL → extract title, publication, date, excerpt, pull quote
- **EducationManager**: Paste a university profile URL → extract institution, degree, dates
- **Published Works**: Paste article/blog URL → extract title, publication, date, summary

Each uses the same Firecrawl + AI pattern with a manager-specific extraction schema.

### 4. Bulk Import from Structured Data

- Create `src/components/dashboard/BulkImporter.tsx` — accepts CSV or JSON paste
- Support bulk import for: Projects, Awards, Education, Skills, Press
- Parse columns, show preview table, let user map columns, then batch-insert
- Useful for users migrating from other portfolio platforms

### 5. Auto-Populate Profile from Social Links

When a user adds social links (LinkedIn, IMDb, personal site), offer to scrape those URLs to populate missing profile data:

- After saving a social link in `SocialLinksManager`, if the URL is LinkedIn/IMDb/personal site, show a toast: "Want to auto-fill your profile from this link?"
- On confirm, trigger the same scrape-profile-url function
- Only fill empty fields (don't overwrite existing data)

---

## Technical Architecture

```text
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Frontend    │────▶│  Edge Function   │────▶│  Firecrawl  │
│  Importer    │     │  scrape-profile  │     │  API        │
│  Component   │     │  -url            │     └─────────────┘
└─────────────┘     │                  │
                    │  ┌───────────┐   │
                    │  │ Lovable   │   │
                    │  │ AI (Gemini│◀──│ (parse scraped text)
                    │  │ 2.5 Flash)│   │
                    │  └───────────┘   │
                    └──────────────────┘

┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Resume      │────▶│  Edge Function   │────▶│  Lovable AI │
│  Upload UI   │     │  parse-resume    │     │  (Gemini)   │
└─────────────┘     └──────────────────┘     └─────────────┘
```

## Dependencies

- **Firecrawl connector**: Already available in workspace, needs to be linked to project
- **Lovable AI**: Already available, no API key needed
- **No new database tables needed** — all data maps to existing tables (profiles, skills, education, projects, social_links, awards, press)

## Implementation Order

1. Connect Firecrawl to project
2. Create `parse-resume` edge function + `ResumeImporter` component
3. Create `scrape-profile-url` edge function + `URLImporter` component
4. Add per-manager URL import buttons (Press, Published Works, Education)
5. Add bulk CSV/JSON import
6. Add social-link-triggered auto-fill suggestions

