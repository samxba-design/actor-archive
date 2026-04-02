import { createClient } from "npm:@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response("Missing slug parameter", { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("display_name, first_name, last_name, tagline, profile_photo_url, accent_color, profile_type, location")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !profile) {
      return new Response("Profile not found", { status: 404, headers: corsHeaders });
    }

    const name = profile.display_name || [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Portfolio";
    const tagline = profile.tagline || "";
    const accentColor = profile.accent_color || "#C41E3A";
    const profileType = profile.profile_type?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "";
    const location = profile.location || "";

    // Generate SVG
    const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a"/>
      <stop offset="100%" style="stop-color:#1a1a1a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${accentColor}"/>
      <stop offset="100%" style="stop-color:${accentColor}88"/>
    </linearGradient>
  </defs>
  
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Accent bar -->
  <rect x="0" y="0" width="8" height="630" fill="url(#accent)"/>
  
  <!-- Content area -->
  <text x="80" y="280" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="700" fill="#ffffff">
    ${escapeXml(name.substring(0, 30))}
  </text>
  
  ${tagline ? `<text x="80" y="350" font-family="system-ui, sans-serif" font-size="28" fill="#a0a0a0">${escapeXml(tagline.substring(0, 60))}</text>` : ""}
  
  <!-- Meta info -->
  <text x="80" y="520" font-family="system-ui, sans-serif" font-size="20" fill="${accentColor}">
    ${escapeXml([profileType, location].filter(Boolean).join(" • "))}
  </text>
  
  <!-- Branding -->
  <text x="80" y="580" font-family="system-ui, sans-serif" font-size="18" fill="#666666">
    CreativeSlate
  </text>
</svg>`;

    return new Response(svg, {
      headers: {
        ...corsHeaders,
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("OG image error:", error);
    return new Response("Internal server error", { status: 500, headers: corsHeaders });
  }
});

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
