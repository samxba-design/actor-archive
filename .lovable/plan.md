

# Phase 1 — Foundation: Build Plan

## Current State
Blank Lovable project. No Supabase connection. Need to connect Lovable Cloud first.

## Step 1: Connect Lovable Cloud
Prompt Supabase connection to provision auth, database, storage, and edge functions.

## Step 2: Database Migration — Full Schema

One large SQL migration creating all enums, 21+ tables, RLS policies, auth trigger, and storage buckets.

**Enums:** `profile_type` (10 values), `project_type`, `access_level`, `contact_subject_type`, `app_role`, `subscription_tier`

**Tables (key columns noted only where non-obvious):**

- `profiles` — id (references auth.users), profile_type enum, slug (unique), display_name, tagline, bio, location, profile_photo_url, banner_url, is_published, is_draft, theme, **secondary_types TEXT[]**, **accent_color TEXT DEFAULT '#C41E3A'**, **font_pairing TEXT DEFAULT 'default'**, **layout_density TEXT DEFAULT 'spacious'**, **section_order TEXT[]**, **sections_visible JSONB DEFAULT '{}'**, **custom_css TEXT**, custom_domain, subscription_tier enum DEFAULT 'free', created_at, updated_at
- `actor_stats` — full spec (height_cm, age range, hair/eye, ethnicity[], unions[], accents[], languages JSONB, vocal_range, dance_styles[], special_skills[], passport_countries[], work_permits JSONB, availability fields, travel fields)
- `representation` — profile_id, rep_type (agent/manager/lawyer), name, company, department, email, phone, market (US/UK), logo_url
- `projects` — universal table with profile_id, project_type enum, title, **project_slug** (UNIQUE with profile_id), description, logline, page_count, genre[], format, status, script_pdf_url, access_level enum, password_hash, nda_url, tmdb_id, poster_url, backdrop_url, publication, article_url, beat, client, challenge, solution, results, cast_size_notation, duration, set_requirements, rights_status, purchase_links JSONB, writing_samples_category, comparable_titles JSONB, is_featured, display_order, created_at, updated_at
- `production_history` — project_id, theatre_name, city, country, year, director, cast_names, production_photos TEXT[]
- `awards`, `press`, `testimonials`, `services`, `education`, `skills`, `events`, `social_links` — as specified
- `gallery_images` — as specified with image_type, tags[], photographer_credit, display_order
- `contact_submissions` — subject_type enum, sender fields, message, related project, read/starred/archived
- `download_logs`, `page_views`, `email_captures` — tracking tables
- `company_logos`, `tmdb_cache` — cache tables as specified
- `user_roles` — security definer pattern

**RLS:** Owner-write on all content tables. Public read for published profiles and their linked content. Public insert on contact_submissions, page_views, email_captures. Private buckets for scripts/documents.

**Auth trigger:** On auth.users insert → create profiles row with user ID, tier 'free', is_published false.

**Storage buckets:** headshots, banners, project-images, scripts (private), gallery, logos, thumbnails, documents (private)

## Step 3: TypeScript Types & Supabase Client
Auto-generated types from the schema + manual type helpers for section registry config.

## Step 4: Auth Pages
- `/login` — email/password + Google OAuth
- `/signup` — email/password + Google OAuth  
- `/forgot-password` and `/reset-password` flows
- Auth context hook, protected route wrapper
- Post-signup redirect to `/onboarding`

## Step 5: Section Registry Config
`src/config/profileSections.ts` — config-only, no UI. Defines all 10 profile types with their section lists, labels, icons, default themes, and project type filters. Multi-hyphenate reads from `secondary_types` to merge sections.

## Step 6: Route Setup
Update App.tsx: `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/onboarding`, `/dashboard/*`, `/:slug`, `/:slug/:project_slug`

## Output
Working auth flow, complete database, TypeScript types, routing, and section registry config — ready for Phase 2 (onboarding wizard).

