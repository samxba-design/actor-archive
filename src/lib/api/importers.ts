import { supabase } from '@/integrations/supabase/client';

export interface ParsedProfileData {
  display_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  headline?: string | null;
  tagline?: string | null;
  bio?: string | null;
  location?: string | null;
  skills: { name: string; category?: string | null }[];
  education: { institution: string; degree_or_certificate?: string | null; field_of_study?: string | null; year_start?: number | null; year_end?: number | null; is_ongoing?: boolean }[];
  work_history: { title: string; description?: string | null; role_name?: string | null; year?: number | null; project_type: string; client?: string | null; genre?: string[] }[];
  social_links: { platform: string; url: string }[];
  awards: { name: string; organization?: string | null; year?: number | null; result?: string | null }[];
}

export async function parseResume(text: string, profileType?: string): Promise<{ success: boolean; data?: ParsedProfileData; error?: string }> {
  const { data, error } = await supabase.functions.invoke('parse-resume', {
    body: { text, profile_type: profileType },
  });
  if (error) return { success: false, error: error.message };
  if (data?.error) return { success: false, error: data.error };
  return { success: true, data: data.data };
}

export async function scrapeProfileUrl(url: string, extractType?: string, profileType?: string): Promise<{ success: boolean; data?: any; error?: string }> {
  const { data, error } = await supabase.functions.invoke('scrape-profile-url', {
    body: { url, extract_type: extractType, profile_type: profileType },
  });
  if (error) return { success: false, error: error.message };
  if (data?.error) return { success: false, error: data.error };
  return { success: true, data: data.data };
}

export async function commitProfileData(userId: string, data: ParsedProfileData, options?: { onlyEmpty?: boolean }) {
  const results: { table: string; inserted: number; error?: string }[] = [];

  // Update profile fields (only non-null fields, optionally only empty ones)
  const profileUpdate: Record<string, any> = {};
  const profileFields = ['display_name', 'first_name', 'last_name', 'headline', 'tagline', 'bio', 'location'] as const;

  if (options?.onlyEmpty) {
    // Fetch current profile to check which fields are empty
    const { data: current } = await supabase.from('profiles').select('display_name, first_name, last_name, headline, tagline, bio, location').eq('id', userId).single();
    if (current) {
      for (const field of profileFields) {
        if (!current[field] && data[field]) profileUpdate[field] = data[field];
      }
    }
  } else {
    for (const field of profileFields) {
      if (data[field]) profileUpdate[field] = data[field];
    }
  }

  if (Object.keys(profileUpdate).length > 0) {
    const { error } = await supabase.from('profiles').update(profileUpdate as any).eq('id', userId);
    results.push({ table: 'profiles', inserted: error ? 0 : 1, error: error?.message });
  }

  // Insert skills
  if (data.skills?.length) {
    const rows = data.skills.map((s, i) => ({ profile_id: userId, name: s.name, category: s.category || null, display_order: i }));
    const { error } = await supabase.from('skills').insert(rows as any);
    results.push({ table: 'skills', inserted: error ? 0 : rows.length, error: error?.message });
  }

  // Insert education
  if (data.education?.length) {
    const rows = data.education.map((e, i) => ({
      profile_id: userId, institution: e.institution,
      degree_or_certificate: e.degree_or_certificate || null,
      field_of_study: e.field_of_study || null,
      year_start: e.year_start || null, year_end: e.year_end || null,
      is_ongoing: e.is_ongoing || false, display_order: i,
    }));
    const { error } = await supabase.from('education').insert(rows as any);
    results.push({ table: 'education', inserted: error ? 0 : rows.length, error: error?.message });
  }

  // Insert work history as projects
  if (data.work_history?.length) {
    const rows = data.work_history.map((w, i) => ({
      profile_id: userId, title: w.title,
      description: w.description || null, role_name: w.role_name || null,
      year: w.year || null, project_type: w.project_type || 'other',
      client: w.client || null, genre: w.genre || null,
      display_order: i,
    }));
    const { error } = await supabase.from('projects').insert(rows as any);
    results.push({ table: 'projects', inserted: error ? 0 : rows.length, error: error?.message });
  }

  // Insert social links
  if (data.social_links?.length) {
    const rows = data.social_links.map((s, i) => ({
      profile_id: userId, platform: s.platform, url: s.url, display_order: i,
    }));
    const { error } = await supabase.from('social_links').insert(rows as any);
    results.push({ table: 'social_links', inserted: error ? 0 : rows.length, error: error?.message });
  }

  // Insert awards
  if (data.awards?.length) {
    const rows = data.awards.map((a, i) => ({
      profile_id: userId, name: a.name,
      organization: a.organization || null, year: a.year || null,
      result: a.result || null, display_order: i,
    }));
    const { error } = await supabase.from('awards').insert(rows as any);
    results.push({ table: 'awards', inserted: error ? 0 : rows.length, error: error?.message });
  }

  return results;
}
