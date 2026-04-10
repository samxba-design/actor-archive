# CreativeSlate

CreativeSlate is a portfolio platform for creative professionals (actors, writers, directors, copywriters, and multi-hyphenates), built with React + TypeScript + Supabase.

## Project info

- App framework: Vite + React + TypeScript
- Styling: Tailwind + shadcn/ui
- Backend: Supabase (database, auth, edge functions)
- Package manager: npm (lockfile included) / bun lock also present

## Local development

### 1) Clone and install

```sh
git clone <YOUR_GIT_URL>
cd actor-archive
npm install
```

### 2) Run the app

```sh
npm run dev
```

### 3) Build for production

```sh
npm run build
```

### 4) Run tests + lint

```sh
npm run test
npm run lint
```

## Supabase

- SQL migrations: `supabase/migrations/`
- Edge functions: `supabase/functions/*`
- Local config: `supabase/config.toml`

When changing schema, add a new migration file (do not edit historical migrations in place).

## Deployment notes

- Build command: `npm run build`
- Output directory: `dist/`
- Ensure required Supabase env vars are configured in deployment environment.

## Product surfaces (quick map)

- Marketing + public pages: `src/pages/*.tsx`
- Dashboard tools: `src/pages/dashboard/*.tsx`
- Admin console: `src/pages/admin/*.tsx`
- Onboarding flow: `src/pages/Onboarding.tsx` + `src/components/onboarding/*`
