import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PERSONAS: Record<string, string> = {
  film_buyer: `You are a Film Buyer / Acquisitions Executive at a major distribution company. You evaluate screenwriters based on: commercial viability of their work, track record of produced/optioned material, genre versatility, industry connections (representation, press), and overall professionalism of their presentation. You're looking for writers whose projects you'd want to acquire or develop.`,
  casting_director: `You are an experienced Casting Director reviewing an actor's portfolio. You evaluate based on: headshot quality and variety, clear physical stats and availability info, demo reel quality, range of roles shown, training/education background, representation info accessibility, and overall ease of finding what you need quickly.`,
  showrunner: `You are a Showrunner / Executive Producer evaluating a writer for a potential staffing opportunity. You look for: voice and originality in their writing samples, genre expertise, produced credits, ability to write in different tones, awards/recognition, and overall impression of reliability and professionalism.`,
  literary_manager: `You are a Literary Manager evaluating whether to sign a new client. You assess: quality and volume of writing samples, uniqueness of voice, marketability, career trajectory (awards, press, produced work), professionalism of presentation, and whether this writer has a clear brand/niche.`,
  festival_programmer: `You are a Film Festival Programmer reviewing a filmmaker's body of work. You evaluate: artistic merit and originality, festival track record (selections, awards), critical reception (press), quality of project descriptions and materials, and overall curatorial fit.`,
  brand_agency: `You are a Creative Director at a Brand/Agency evaluating a creative professional for campaign work. You assess: portfolio diversity, client testimonials, case study quality (challenge/solution/results), professional presentation, turnaround reliability, and brand alignment.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { persona, profileData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("API key not configured");

    const personaPrompt = PERSONAS[persona];
    if (!personaPrompt) {
      return new Response(JSON.stringify({ error: "Invalid persona" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `${personaPrompt}

IMPORTANT RULES:
- Base your evaluation ONLY on the data provided. Do not invent or assume information.
- Be constructive and specific. Generic advice is useless.
- If the profile is sparse, note what's missing and why it matters for THIS specific evaluator role.
- Be honest but professional — this is meant to help the user improve.`;

    const userPrompt = `Evaluate this portfolio profile:\n\n${JSON.stringify(profileData, null, 2)}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "profile_evaluation",
              description: "Return structured profile evaluation",
              parameters: {
                type: "object",
                properties: {
                  overall_impression: { type: "string", description: "2-3 sentence summary of overall impression" },
                  readiness_score: { type: "number", description: "Score 1-10 for how ready this profile is" },
                  strengths: { type: "array", items: { type: "string" }, description: "3 specific strengths" },
                  improvements: { type: "array", items: { type: "string" }, description: "3 specific areas to improve" },
                  action_items: { type: "array", items: { type: "string" }, description: "3 concrete next steps" },
                },
                required: ["overall_impression", "readiness_score", "strengths", "improvements", "action_items"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "profile_evaluation" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      return new Response(JSON.stringify({ error: "Unable to evaluate. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ persona, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("profile-evaluate error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
