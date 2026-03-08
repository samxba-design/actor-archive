import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TMDB_API_KEY = Deno.env.get("TMDB_API_KEY");
    if (!TMDB_API_KEY) {
      return new Response(
        JSON.stringify({ error: "TMDB_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const query = url.searchParams.get("query");
    const mediaType = url.searchParams.get("type") || "movie"; // movie or tv
    const tmdbId = url.searchParams.get("id");

    // If ID provided, fetch details (and check cache first)
    if (tmdbId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Check cache
      const { data: cached } = await supabase
        .from("tmdb_cache")
        .select("*")
        .eq("tmdb_id", parseInt(tmdbId))
        .eq("media_type", mediaType)
        .maybeSingle();

      if (cached) {
        return new Response(JSON.stringify(cached), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fetch from TMDB
      const detailRes = await fetch(
        `${TMDB_BASE}/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits`
      );
      if (!detailRes.ok) {
        return new Response(
          JSON.stringify({ error: "TMDB fetch failed" }),
          { status: detailRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const detail = await detailRes.json();

      const director = detail.credits?.crew?.find((c: any) => c.job === "Director")?.name || null;
      const notableCast = detail.credits?.cast?.slice(0, 5).map((c: any) => c.name) || [];
      const year = mediaType === "movie"
        ? detail.release_date?.split("-")[0]
        : detail.first_air_date?.split("-")[0];

      const cacheEntry = {
        tmdb_id: parseInt(tmdbId),
        media_type: mediaType,
        title: detail.title || detail.name,
        year: year ? parseInt(year) : null,
        poster_url: detail.poster_path ? `${TMDB_IMG}/w500${detail.poster_path}` : null,
        backdrop_url: detail.backdrop_path ? `${TMDB_IMG}/w1280${detail.backdrop_path}` : null,
        genre: detail.genres?.map((g: any) => g.name) || [],
        director,
        notable_cast: notableCast,
        synopsis: detail.overview || null,
        runtime_minutes: detail.runtime || detail.episode_run_time?.[0] || null,
        network_or_studio: mediaType === "tv"
          ? detail.networks?.[0]?.name
          : detail.production_companies?.[0]?.name || null,
        raw_data: detail,
      };

      // Cache it
      await supabase.from("tmdb_cache").upsert(cacheEntry, {
        onConflict: "tmdb_id,media_type",
      });

      return new Response(JSON.stringify(cacheEntry), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Search mode
    if (!query || query.length < 2) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const searchRes = await fetch(
      `${TMDB_BASE}/search/${mediaType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`
    );

    if (!searchRes.ok) {
      if (searchRes.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "2" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "TMDB search failed" }),
        { status: searchRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const searchData = await searchRes.json();

    const results = searchData.results?.slice(0, 10).map((r: any) => ({
      tmdb_id: r.id,
      title: r.title || r.name,
      year: (r.release_date || r.first_air_date)?.split("-")[0] || null,
      poster_url: r.poster_path ? `${TMDB_IMG}/w200${r.poster_path}` : null,
      media_type: mediaType,
    })) || [];

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
