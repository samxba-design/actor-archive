import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { url, extract_type, profile_type } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    if (!FIRECRAWL_API_KEY) {
      return new Response(JSON.stringify({ error: "Firecrawl is not configured. Please connect Firecrawl in Settings." }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Step 1: Scrape URL with Firecrawl
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log("Scraping:", formattedUrl);
    const scrapeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ url: formattedUrl, formats: ["markdown"], onlyMainContent: true }),
    });

    const scrapeData = await scrapeRes.json();
    if (!scrapeRes.ok) {
      if (scrapeRes.status === 402) {
        return new Response(JSON.stringify({ error: "Firecrawl credits exhausted. Please upgrade your Firecrawl plan." }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.error("Firecrawl error:", scrapeData);
      throw new Error(scrapeData.error || "Failed to scrape URL");
    }

    const markdown = scrapeData.data?.markdown || scrapeData.markdown || "";
    if (!markdown) throw new Error("No content found at URL");

    // Step 2: Determine extraction type
    const isLinkedIn = formattedUrl.includes("linkedin.com");
    const isIMDb = formattedUrl.includes("imdb.com");

    let systemPrompt: string;
    if (extract_type === "press") {
      systemPrompt = `Extract press/article data from this page content. Return JSON via the tool call.`;
    } else if (extract_type === "education") {
      systemPrompt = `Extract education/institution data from this page. Return JSON via the tool call.`;
    } else if (extract_type === "project") {
      systemPrompt = `Extract project/portfolio item data from this page. Return JSON via the tool call.`;
    } else {
      systemPrompt = `You are extracting professional profile data from a ${isLinkedIn ? "LinkedIn profile" : isIMDb ? "IMDb page" : "website"}. 
Profile type context: ${profile_type || "creative professional"}.
Extract all relevant professional data. For work history, map to appropriate project_type values: feature_film, tv_series, short_film, web_series, commercial, music_video, documentary, stage_play, book, article, blog_post, case_study, campaign, video, podcast, other.
Return structured data via the tool call.`;
    }

    // Build tool schema based on extract_type
    const tools = getToolsForType(extract_type || "profile");

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Source URL: ${formattedUrl}\n\nPage content:\n${markdown.slice(0, 40000)}` },
        ],
        tools,
        tool_choice: { type: "function", function: { name: tools[0].function.name } },
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const t = await aiRes.text();
      console.error("AI error:", aiRes.status, t);
      throw new Error("AI extraction failed");
    }

    const aiData = await aiRes.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No structured response from AI");

    const parsed = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ success: true, data: parsed, source_url: formattedUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error("scrape-profile-url error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getToolsForType(type: string) {
  if (type === "press") {
    return [{
      type: "function" as const,
      function: {
        name: "return_press_data",
        description: "Return extracted press/article data",
        parameters: {
          type: "object",
          properties: {
            title: { type: "string" },
            publication: { type: ["string", "null"] },
            date: { type: ["string", "null"], description: "YYYY-MM-DD format" },
            excerpt: { type: ["string", "null"] },
            pull_quote: { type: ["string", "null"] },
          },
          required: ["title"],
        },
      },
    }];
  }

  if (type === "education") {
    return [{
      type: "function" as const,
      function: {
        name: "return_education_data",
        description: "Return extracted education data",
        parameters: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  institution: { type: "string" },
                  degree_or_certificate: { type: ["string", "null"] },
                  field_of_study: { type: ["string", "null"] },
                  year_start: { type: ["number", "null"] },
                  year_end: { type: ["number", "null"] },
                },
                required: ["institution"],
              },
            },
          },
          required: ["items"],
        },
      },
    }];
  }

  if (type === "project") {
    return [{
      type: "function" as const,
      function: {
        name: "return_project_data",
        description: "Return extracted project data",
        parameters: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: ["string", "null"] },
            role_name: { type: ["string", "null"] },
            year: { type: ["number", "null"] },
            project_type: { type: "string" },
            client: { type: ["string", "null"] },
            genre: { type: "array", items: { type: "string" } },
            tags: { type: "array", items: { type: "string" } },
          },
          required: ["title", "project_type"],
        },
      },
    }];
  }

  // Full profile extraction
  return [{
    type: "function" as const,
    function: {
      name: "return_profile_data",
      description: "Return extracted professional profile data",
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
          education: { type: "array", items: { type: "object", properties: { institution: { type: "string" }, degree_or_certificate: { type: ["string", "null"] }, field_of_study: { type: ["string", "null"] }, year_start: { type: ["number", "null"] }, year_end: { type: ["number", "null"] } }, required: ["institution"] } },
          work_history: { type: "array", items: { type: "object", properties: { title: { type: "string" }, description: { type: ["string", "null"] }, role_name: { type: ["string", "null"] }, year: { type: ["number", "null"] }, project_type: { type: "string" }, client: { type: ["string", "null"] }, genre: { type: "array", items: { type: "string" } } }, required: ["title", "project_type"] } },
          social_links: { type: "array", items: { type: "object", properties: { platform: { type: "string" }, url: { type: "string" } }, required: ["platform", "url"] } },
          awards: { type: "array", items: { type: "object", properties: { name: { type: "string" }, organization: { type: ["string", "null"] }, year: { type: ["number", "null"] }, result: { type: ["string", "null"] } }, required: ["name"] } },
        },
        required: ["skills", "education", "work_history", "social_links", "awards"],
      },
    },
  }];
}
