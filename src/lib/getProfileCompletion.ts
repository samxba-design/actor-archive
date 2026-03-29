/**
 * getProfileCompletion — calculates profile completion score.
 * Each of the 8 fields is worth equal weight (12.5% each).
 */

export interface ProfileCompletionInput {
  profile_photo_url?: string | null;
  bio?: string | null;
  tagline?: string | null;
  headline?: string | null;
  location?: string | null;
  // Counts from related tables (loaded externally)
  reelCount?: number;
  creditCount?: number;
  contactEmail?: string | null;
  skillCount?: number;
}

export interface ProfileCompletionResult {
  score: number; // 0–100
  missing: string[];
}

const FIELDS: Array<{
  key: keyof ProfileCompletionInput | "reelCount" | "creditCount" | "skillCount";
  label: string;
  check: (p: ProfileCompletionInput) => boolean;
}> = [
  {
    key: "profile_photo_url",
    label: "Profile photo",
    check: (p) => !!p.profile_photo_url,
  },
  {
    key: "bio",
    label: "Bio / about text",
    check: (p) => !!(p.bio && p.bio.trim().length > 10),
  },
  {
    key: "reelCount",
    label: "Demo reel",
    check: (p) => (p.reelCount ?? 0) >= 1,
  },
  {
    key: "creditCount",
    label: "Film or TV credit",
    check: (p) => (p.creditCount ?? 0) >= 1,
  },
  {
    key: "contactEmail",
    label: "Contact email or info",
    check: (p) => !!(p.contactEmail && p.contactEmail.trim().length > 0),
  },
  {
    key: "tagline",
    label: "Tagline or headline",
    check: (p) => !!(p.tagline?.trim() || p.headline?.trim()),
  },
  {
    key: "skillCount",
    label: "Skills / special skills",
    check: (p) => (p.skillCount ?? 0) >= 1,
  },
  {
    key: "location",
    label: "Location / city",
    check: (p) => !!(p.location && p.location.trim().length > 0),
  },
];

export function getProfileCompletion(profile: ProfileCompletionInput): ProfileCompletionResult {
  const total = FIELDS.length;
  const done = FIELDS.filter((f) => f.check(profile));
  const missing = FIELDS.filter((f) => !f.check(profile)).map((f) => f.label);
  const score = Math.round((done.length / total) * 100);
  return { score, missing };
}
