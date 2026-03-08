

## Plan: Bio Builder, Goal Selection & Bio Refinement

### 1. Database Migration — Add `primary_goal` and `headline` columns to `profiles`

Add two new columns:
- `primary_goal text` — stores the user's selected goal (e.g., "seeking_representation", "getting_hired", "pitching_projects", "professional_presence")
- `headline text` — a short pitch line (separate from tagline), displayed prominently on the portfolio

### 2. New Onboarding Step: Goal Selection (`StepGoal.tsx`)

Insert a new step after Profile Type selection (step 1) — "What's your main goal?"

Goals with icons:
- **Finding representation** — "I'm looking for an agent or manager"
- **Getting hired** — "I want to attract work and job opportunities"
- **Pitching projects** — "I want to sell or option my material"
- **Building a professional profile** — "I want a polished portfolio to share"

Single-select cards, same style as StepProfileType. Updates `OnboardingData.primaryGoal`. Saved to `profiles.primary_goal` on completion.

### 3. Bio Builder in ProfileEditor

Replace the plain bio textarea with a structured "Bio" card that includes:

**a. Headline field** — A one-line pitch field above the bio (e.g., "Emmy-nominated screenwriter specializing in limited series"). Has a "Refine" button (reuses WritingAssistant pattern) that calls the `writing-assist` edge function with a new type `evaluate_headline` / `suggest_headline`.

**b. Bio textarea with expand/collapse preview** — Shows a truncated preview with "Read more" like the public profile will. Character count indicator.

**c. "Generate Bio" button** — A small wand button that calls the `writing-assist` edge function with a new type `generate_bio`. The function pulls context from: profile type, goal, tagline, headline, location, existing projects/awards (passed from the client). Returns a structured, factual bio draft. User can apply or dismiss.

**d. "Improve Bio" button** — Sends existing bio text for evaluation and improvement suggestions (similar to logline evaluate/suggest pattern).

### 4. Edge Function Updates (`writing-assist`)

Add 4 new types to the existing edge function:

- `evaluate_headline` — Scores the headline pitch line (clarity, impact, specificity, professional tone)
- `suggest_headline` — Generates 2-3 headline alternatives based on profile context
- `generate_bio` — Creates a bio draft from provided context (profile type, goal, credits, awards, location). System prompt enforces: factual only, no hallucination, professional tone, 150-300 words, third person optional
- `improve_bio` — Evaluates existing bio and returns improved version with changes noted

### 5. Public Profile Bio Display (`PortfolioHero.tsx`)

Update bio rendering:
- Show `headline` as a distinct line below the name (bolder than tagline, different styling)
- Bio text: if longer than ~200 chars, show truncated with a "Read more" expand toggle
- This keeps the hero clean while allowing detailed bios

### 6. Onboarding Data Flow Updates

- Add `primaryGoal` and `headline` to `OnboardingData` interface
- Add `StepGoal` to the step sequence (after type, before basic info)
- Save `primary_goal` to profiles on completion
- Increment step count and adjust step numbering

### Files to Create
1. `src/components/onboarding/StepGoal.tsx` — goal selection step

### Files to Edit
1. `src/pages/Onboarding.tsx` — add goal step, add `primaryGoal`/`headline` to data, save to DB
2. `src/pages/dashboard/ProfileEditor.tsx` — add headline field, bio generate/improve buttons, expand preview
3. `src/components/portfolio/PortfolioHero.tsx` — render headline, bio truncation with expand
4. `supabase/functions/writing-assist/index.ts` — add headline and bio evaluation/generation types
5. `src/lib/glossary.ts` — add "headline", "primary goal" terms

### Database Migration
```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS primary_goal text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS headline text;
```

