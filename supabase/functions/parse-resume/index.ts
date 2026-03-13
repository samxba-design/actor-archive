import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { text, profile_type } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Resume text is required" }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a resume parser for creative professionals. Extract structured data from the resume text provided. Return ONLY valid JSON matching this exact schema — no markdown, no explanation:

{
  "display_name": "string or null",
  "first_name": "string or null",
  "last_name": "string or null",
  "headline": "short professional title or null",
  "tagline": "one-liner summary or null",
  "bio": "professional bio paragraph or null",
  "location": "city, state/country or null",
  "skills": [{ "name": "string", "category": "string or null" }],
  "education": [{ "institution": "string", "degree_or_certificate": "string or null", "field_of_study": "string or null", "year_start": "number or null", "year_end": "number or null", "is_ongoing": false }],
  "work_history": [{ "title": "string", "description": "string or null", "role_name": "string or null", "year": "number or null", "project_type": "feature_film|tv_series|short_film|web_series|commercial|music_video|documentary|stage_play|book|article|blog_post|case_study|campaign|video|podcast|other", "client": "string or null", "genre": ["string"] }],
  "social_links": [{ "platform": "string", "url": "string" }],
  "awards": [{ "name": "string", "organization": "string or null", "year": "number or null", "result": "won|nominated|finalist|selected|null" }]
}

Profile type context: ${profile_type || "general creative professional"}. Map work history to appropriate project_type values. If unsure, use "other".`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text.slice(0, 50000) },
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_parsed_resume",
            description: "Return the structured resume data",
            parameters: {
              type: "object",
              properties: {
                display_name: { type: ["string", "null"] },
                first_name: { type: ["string", "null"] },
                last_name: { type: ["string", "null"] },
                headline: { type: ["string", "null"] },
                tagline: { type: ["string", "null"] },
                bio: { type: ["string", "null"] },
                location: { type: ["string", "null"] },
                skills: { type: "array", items: { type: "object", properties: { name: { type: "string" }, category: { type: ["string", "null"] } }, required: ["name"] } },
                education: { type: "array", items: { type: "object", properties: { institution: { type: "string" }, degree_or_certificate: { type: ["string", "null"] }, field_of_study: { type: ["string", "null"] }, year_start: { type: ["number", "null"] }, year_end: { type: ["number", "null"] }, is_ongoing: { type: "boolean" } }, required: ["institution"] } },
                work_history: { type: "array", items: { type: "object", properties: { title: { type: "string" }, description: { type: ["string", "null"] }, role_name: { type: ["string", "null"] }, year: { type: ["number", "null"] }, project_type: { type: "string" }, client: { type: ["string", "null"] }, genre: { type: "array", items: { type: "string" } } }, required: ["title", "project_type"] } },
                social_links: { type: "array", items: { type: "object", properties: { platform: { type: "string" }, url: { type: "string" } }, required: ["platform", "url"] } },
                awards: { type: "array", items: { type: "object", properties: { name: { type: "string" }, organization: { type: ["string", "null"] }, year: { type: ["number", "null"] }, result: { type: ["string", "null"] } }, required: ["name"] } },
              },
              required: ["skills", "education", "work_history", "social_links", "awards"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "return_parsed_resume" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI parsing failed");
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No structured response from AI");

    const parsed = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error("parse-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
