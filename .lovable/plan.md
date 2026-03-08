

## Plan: Universal Client Logos & Production Photos

### Problem Summary

1. **`client_logos` section is broken on the portfolio** — `PortfolioSection.tsx` has NO `case "client_logos"` in its data-fetching switch or render switch. The `client_logos_profile` DB table exists and `ClientManager` works, but the data never reaches the public portfolio.

2. **`SectionClientLogos` accepts `companies: string[]`** (plain names for Clearbit lookup) but the DB stores objects with `company_name`, `logo_url` (custom uploads), `website_url`. Needs to accept DB-backed items.

3. **Client logos restricted to copywriter + corporate_video** — should be available to all profile types that work with companies/clients (screenwriter, director, journalist, author, etc.).

4. **Gallery/production photos restricted to actor + director + corporate_video** — screenwriters, playwrights, copywriters, journalists, and authors should also be able to upload production stills and BTS photos.

---

### Changes

#### 1. Fix `SectionClientLogos` to accept DB-backed items
Update the component to accept `items: { company_name: string; logo_url: string | null; website_url: string | null }[]` instead of `companies: string[]`. Render custom `logo_url` when present, fall back to Clearbit via `CompanyLogo`.

#### 2. Wire `client_logos` in `PortfolioSection.tsx`
- Add `case "client_logos"` to the data-fetching switch — query `client_logos_profile` table
- Add `case "client_logos"` to the render switch — pass DB items to updated `SectionClientLogos`

#### 3. Add `client_logos` section to all relevant profile types in `profileSections.ts`
Add to: screenwriter, tv_writer, playwright, author, journalist, director_producer (already on copywriter + corporate_video).

#### 4. Add `gallery` section to remaining profile types
Add gallery to: screenwriter, tv_writer, playwright, author, journalist, copywriter — with contextual labels like "Production Photos" or "Behind the Scenes."

#### 5. Expand sidebar `Clients` visibility
Update `DashboardSidebar.tsx` to show Clients nav item for all profile types (remove `visibleTo` restriction or expand the list).

#### 6. Expand Gallery image types
Add "event_photo", "book_cover", "campaign_creative" to the `IMAGE_TYPES` array in `GalleryManager.tsx` so all profile types have relevant categories.

---

### Files to modify
- `src/components/portfolio/sections/SectionClientLogos.tsx` — accept DB items
- `src/components/portfolio/PortfolioSection.tsx` — add client_logos fetch + render
- `src/config/profileSections.ts` — add client_logos + gallery to more types
- `src/components/dashboard/DashboardSidebar.tsx` — expand Clients visibility
- `src/pages/dashboard/GalleryManager.tsx` — add more image type categories

