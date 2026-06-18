# AGENTS.md

## Cursor Cloud specific instructions

CreativeSlate is a single-page **Vite + React + TypeScript** app (shadcn/ui + Tailwind) backed by a **hosted Supabase project** (DB, auth, storage, edge functions). There is **no local backend** to run — the committed `.env` already contains live `VITE_SUPABASE_*` credentials, so auth and most data paths work against the remote project out of the box.

### Running / commands
- Dev server: `npm run dev` (Vite). It listens on **port 8080** by default. If you also run the sibling `auditionscenes` app at the same time, give one of them a different port, e.g. `npm run dev -- --port 8080` here and `--port 8081` there.
- Standard scripts live in `package.json`: `dev`, `build`, `build:dev`, `preview`, `lint`, `test`, `test:watch`.

### Non-obvious caveats
- **Dependency install must use `npm install --legacy-peer-deps`.** There are peer-dependency conflicts (e.g. `typescript@^6` vs `typescript-eslint`'s `<5.9` peer). The committed `package-lock.json` is also out of sync with `package.json`, so `npm ci` fails — use `npm install` (not `npm ci`).
- **`npm run lint` reports hundreds of pre-existing errors** (mostly `@typescript-eslint/no-explicit-any` in the Deno `supabase/functions/*` edge functions, plus a `require()` in `tailwind.config.ts`). These are baseline issues in the repo, not something you introduced. ESLint itself runs fine.
- **Signup requires email confirmation** (enforced by Supabase). A new account is created in the backend but the dashboard/onboarding (protected routes) are unreachable until the email link is clicked, so you cannot reach authenticated views with a fresh signup alone.
- **No-auth surfaces for testing core functionality:** public demo portfolios at `/demo/actor`, `/demo/screenwriter`, `/demo/copywriter`, the `/explore` page, and public profiles at `/p/:slug`. The demo pages render from mock data, so their contact form will not persist (it targets a non-existent `profile_id`).
- Edge-function third-party integrations (Stripe, Lovable AI, Firecrawl, TMDB, Resend) rely on secrets set **server-side in the hosted Supabase project**, not in local `.env`; they are not needed to boot or browse the app.
