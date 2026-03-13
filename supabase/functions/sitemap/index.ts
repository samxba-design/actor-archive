import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("slug, updated_at")
    .eq("is_published", true)
    .eq("seo_indexable", true)
    .not("slug", "is", null);

  if (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }

  const baseUrl = "https://actor-archive.lovable.app";

  const urls = (profiles || [])
    .filter((p: any) => p.slug)
    .map((p: any) => {
      const lastmod = p.updated_at ? new Date(p.updated_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
      return `  <url>
    <loc>${baseUrl}/p/${p.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

  // Add static pages
  const staticPages = [
    { path: "/", priority: "1.0", freq: "daily" },
    { path: "/pricing", priority: "0.7", freq: "monthly" },
    { path: "/how-it-works", priority: "0.7", freq: "monthly" },
    { path: "/demo/actor", priority: "0.6", freq: "monthly" },
    { path: "/demo/screenwriter", priority: "0.6", freq: "monthly" },
    { path: "/demo/copywriter", priority: "0.6", freq: "monthly" },
  ];

  const staticUrls = staticPages.map(
    (p) => `  <url>
    <loc>${baseUrl}${p.path}</loc>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join("\n")}
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
    status: 200,
  });
});
