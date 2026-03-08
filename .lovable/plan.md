

## Plan: Services Onboarding, Hire Me CTA, Calendar Booking & Feature Gaps

### What's Missing Today

After reviewing the full codebase, here's what exists vs. what's needed:

**Built:** Auth, onboarding (type → info → slug → actor stats → theme → complete), dashboard (profile editor, projects, gallery, social links, inbox, analytics, settings), public portfolio with 10 themes, contact form, TMDB search edge function.

**Missing / Needed:**
1. Services setup during onboarding (with contextual descriptions per profile type)
2. Hire Me / Book CTA on public portfolio
3. Calendar booking integration (Calendly/Cal.com embed)
4. Dashboard services manager (CRUD for services)
5. Several dashboard managers missing for existing tables (awards, education, events, press, testimonials, skills, representation)
6. Section reordering and visibility toggles in dashboard

---

### 1. Onboarding: Services Step

Add a new step between Theme and Complete called **"Services & Availability"**.

- Displays contextual, pre-populated service suggestions based on `profileType` using the section registry's CTAs and service patterns:
  - **Screenwriter**: Script Coverage, Script Doctoring, Ghostwriting, Adaptation
  - **Actor**: Self-Tape Service, Private Coaching, Audition Prep
  - **Director/Producer**: Music Video, Commercial, Short Film
  - **Copywriter**: Blog Posts, Web Copy, Email Campaigns, SEO Content
  - etc.
- Each service is a toggle card with: name, short description of what it does for their profile, enable/disable switch
- Users can add custom services with name + optional description + optional price
- The step also includes a simple "Available for Hire" toggle with explanation
- Data saved to `services` table on completion

**Files:** New `src/components/onboarding/StepServices.tsx`, update `src/pages/Onboarding.tsx` to add the step.

---

### 2. Hire Me / Book CTA on Public Portfolio

Add a prominent CTA button in `PortfolioHero.tsx`:
- If `available_for_hire` is true, show a styled "Hire Me" or "Book Me" button
- Button behavior options (configured in dashboard settings):
  - Scroll to contact form
  - Open calendar booking link (Calendly/Cal.com URL)
  - Open mailto link
- Store `cta_label` and `cta_url` fields on profiles table (migration needed)
- Also show a subtle badge: "Available for Hire" or "Seeking Representation"

**Database migration:** Add `cta_label text`, `cta_url text`, `cta_type text` (contact_form | calendar | email | custom_url) to `profiles`.

**Files:** Update `PortfolioHero.tsx`, update `SettingsPage.tsx` for CTA configuration.

---

### 3. Calendar Booking Integration

Simple approach — no OAuth needed:
- User pastes their Calendly/Cal.com/Acuity booking URL in dashboard settings
- When CTA type is "calendar", the public portfolio opens the URL in a new tab or shows it in an embedded iframe modal
- Add a `booking_url` column to `profiles` table

**Files:** Update `SettingsPage.tsx` to add booking URL field, create `BookingModal.tsx` for optional iframe embed on portfolio.

---

### 4. Dashboard Services Manager

New dashboard page at `/dashboard/services` for full CRUD:
- Add/edit/delete services with: name, description, starting price, currency, turnaround time, deliverables list, featured toggle
- Drag-to-reorder (or up/down arrows)
- Preview card showing how it looks on portfolio

**Files:** New `src/pages/dashboard/ServicesManager.tsx`, update `Dashboard.tsx` and `DashboardSidebar.tsx`.

---

### 5. Missing Dashboard Managers

Create CRUD managers for tables that exist but have no UI:
- **Awards Manager** — name, organization, category, year, result
- **Education Manager** — institution, degree, field, years
- **Events Manager** — title, venue, date, ticket URL
- **Press Manager** — title, publication, date, article URL, pull quote
- **Testimonials Manager** — author, quote, company, role
- **Skills Manager** — name, category, proficiency
- **Representation Manager** — type, name, company, email, phone

Each follows the same pattern: list view with add/edit/delete, reorder by `display_order`.

**Files:** 7 new pages in `src/pages/dashboard/`, update `Dashboard.tsx` routes and `DashboardSidebar.tsx` nav items.

---

### 6. Section Visibility & Reorder in Settings

Add to `SettingsPage.tsx`:
- List of all sections for the user's profile type (from section registry)
- Toggle visibility per section (saves to `sections_visible` jsonb)
- Drag or arrow-based reordering (saves to `section_order` array)

---

### Implementation Order

1. **Database migration** — add `cta_label`, `cta_url`, `cta_type`, `booking_url` to profiles
2. **StepServices onboarding step** — contextual service suggestions + hire toggle
3. **Hire Me CTA** on portfolio hero + booking modal
4. **ServicesManager** dashboard page
5. **CTA & booking config** in SettingsPage
6. **Missing dashboard managers** (awards, education, events, press, testimonials, skills, representation)
7. **Section visibility & reorder** in settings

### Technical Details

- All new dashboard pages follow the existing pattern: `useState` for form, `useEffect` to fetch, `supabase.from().insert/update/delete` for mutations
- Services onboarding step uses the `PROFILE_TYPES` config to generate contextual suggestions via a mapping object
- Calendar booking is URL-based only (paste Calendly link) — no complex OAuth
- CTA type determines portfolio behavior: `contact_form` scrolls to footer, `calendar` opens booking URL, `email` opens mailto, `custom_url` opens new tab
- Section reorder uses `section_order` array column already on profiles table

