

## Smart Writing Assistance + Contextual Help + Profile Evaluation

### Overview

Three complementary features that make the platform more helpful without branding anything as "AI":

1. **Writing Assistant** — Subtle inline tools for loglines, synopses, and summaries
2. **Contextual Glossary Tooltips** — Hover helpers that define industry terms
3. **Profile Impression Evaluator** — Dashboard tool that evaluates how a profile reads to specific industry roles

---

### 1. Writing Assistant (Logline & Synopsis)

**Where it appears:** In ProjectsManager.tsx, next to the Logline and Description textarea fields — a small button labeled "Refine" (wand icon) that opens a popover/drawer.

**Features:**
- **Evaluate current logline**: Sends the logline text to a backend function that scores it against industry-standard logline rules (single protagonist, clear stakes, irony/hook, 25-50 words, present tense, active voice). Returns structured feedback: what works, what to improve, how a reader would perceive it.
- **Suggest improved logline**: Based on the current text (and optionally an uploaded PDF script), generates 2-3 alternative loglines following strict rules. User can pick one or dismiss.
- **Synopsis/summary helper**: Same pattern for the Description field — evaluate clarity, structure, tone. Suggest improvements.
- **PDF context**: Optional file upload (script PDF) that gets parsed and used as context for generating loglines/synopses. Uses existing `scripts` storage bucket.

**Backend:** New edge function `supabase/functions/writing-assist/index.ts` that:
- Accepts `{ type: "evaluate_logline" | "suggest_logline" | "evaluate_synopsis" | "suggest_synopsis", text: string, title?: string, genre?: string[], format?: string, scriptContext?: string }`
- Uses Lovable AI (gemini-3-flash-preview) with a carefully crafted system prompt enforcing logline rules, zero hallucination (only works with provided text), industry-standard structure
- Returns structured output via tool calling (not freeform JSON)
- Handles 429/402 errors gracefully

**UI component:** `src/components/dashboard/WritingAssistant.tsx` — a popover triggered by a small wand icon button next to relevant fields. Shows evaluation results as a card with score, feedback bullets, and optional suggestions. Non-intrusive, dismissible.

**Files:**
- Create `supabase/functions/writing-assist/index.ts`
- Create `src/components/dashboard/WritingAssistant.tsx`
- Edit `src/pages/dashboard/ProjectsManager.tsx` — add the assistant button next to logline/description fields
- Edit `supabase/config.toml` — add function config

---

### 2. Contextual Glossary Tooltips

**What:** Wrap certain labels in the dashboard with a help icon (HelpCircle, tiny, muted) that shows a tooltip on hover defining the term in plain language.

**Terms to define:** Logline, Synopsis, Coverage, Spec Script, Optioned, In Development, Series Bible, Pilot, Treatment, Beat Sheet, Page Count, Format, Genre tags, Access Level (public/gated/private), CTA, Representation, Comparable Titles, etc.

**Implementation:**
- Create `src/components/ui/glossary-tooltip.tsx` — a thin wrapper around existing Tooltip that takes a `term` key, looks up the definition from a static map, and renders a small `?` icon with tooltip
- Create `src/lib/glossary.ts` — static map of term → definition (no AI needed, just curated definitions)
- Integrate into ProjectsManager, ProfileEditor, and other dashboard managers by replacing `<Label>Logline</Label>` with `<Label>Logline <GlossaryTooltip term="logline" /></Label>`

**Files:**
- Create `src/lib/glossary.ts`
- Create `src/components/ui/glossary-tooltip.tsx`
- Edit `src/pages/dashboard/ProjectsManager.tsx` — add tooltips to key labels
- Edit `src/pages/dashboard/ProfileEditor.tsx` — add tooltips to tagline, bio

---

### 3. Profile Impression Evaluator

**Where:** New dashboard page at `/dashboard/insights` (or a section within Settings). A card with a dropdown to select an evaluator persona, then a "Get Impression" button.

**Personas:**
- **Film Buyer / Acquisitions Executive** — evaluates: is this writer someone whose work I'd want to acquire?
- **Casting Director** (for actors) — evaluates: can I quickly find what I need? Is this person castable?
- **Showrunner / EP** — evaluates: would I staff this writer?
- **Literary Manager** — evaluates: would I want to sign this person?
- **Festival Programmer** — evaluates: does this filmmaker have a compelling body of work?
- **Brand / Agency** (for corporate) — evaluates: would I hire this person for a campaign?

**How it works:**
- Fetches the user's full profile data (profile, projects, awards, press, testimonials, skills, representation)
- Sends it to a new edge function `supabase/functions/profile-evaluate/index.ts`
- The function uses Lovable AI with a persona-specific system prompt
- Returns: overall impression (2-3 sentences), 3 strengths, 3 areas to improve, a "readiness score" (1-10), and specific actionable suggestions
- Results displayed in a clean card layout — no mention of AI anywhere, just "Profile Insights"

**Files:**
- Create `supabase/functions/profile-evaluate/index.ts`
- Create `src/pages/dashboard/ProfileInsights.tsx`
- Edit `src/pages/Dashboard.tsx` — add route
- Edit `src/components/dashboard/DashboardSidebar.tsx` — add nav item (Lightbulb icon, "Insights")

---

### Summary of All Files

**Create:**
1. `supabase/functions/writing-assist/index.ts`
2. `supabase/functions/profile-evaluate/index.ts`
3. `src/components/dashboard/WritingAssistant.tsx`
4. `src/components/ui/glossary-tooltip.tsx`
5. `src/lib/glossary.ts`
6. `src/pages/dashboard/ProfileInsights.tsx`

**Edit:**
1. `src/pages/dashboard/ProjectsManager.tsx` — add writing assistant + glossary tooltips
2. `src/pages/dashboard/ProfileEditor.tsx` — add glossary tooltips
3. `src/pages/Dashboard.tsx` — add insights route
4. `src/components/dashboard/DashboardSidebar.tsx` — add Insights nav item
5. `supabase/config.toml` — add both new edge functions

