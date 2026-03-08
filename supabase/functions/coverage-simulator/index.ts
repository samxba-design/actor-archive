import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const COVERAGE_SYSTEM = `You are a veteran Hollywood script reader with 20+ years of experience at major studios and agencies. You write professional coverage reports that are honest, specific, and actionable.

You evaluate based ONLY on the provided logline, synopsis, and metadata. NEVER invent plot details.

COVERAGE REPORT FORMAT:
- Rating: RECOMMEND, CONSIDER, or PASS (be honest — most scripts get CONSIDER or PASS)
- Overall impression in 2-3 sentences
- Concept: Is this a fresh, marketable idea? Rate 1-10
- Story: Does the narrative arc work? Rate 1-10
- Character: Are protagonists compelling? Rate 1-10
- Dialogue potential: Based on tone/voice in the writing. Rate 1-10
- Marketability: Commercial viability assessment. Rate 1-10
- Strengths: 2-3 specific things that work
- Weaknesses: 2-3 specific areas for improvement
- Comparable titles: 2-3 existing films/shows this reminds you of
- Reader notes: 1-2 paragraphs of detailed professional feedback`;

const COMP_SYSTEM = `You are a development executive with encyclopedic knowledge of film and television. Given a project's logline, genre, and tone, suggest 3-5 comparable titles ("comps") that would be used in a pitch meeting.

For each comp, explain WHY it's comparable (tone, structure, audience, theme — not just surface-level genre match). Include box office/audience data when relevant. Focus on titles from the last 15 years when possible.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, title, logline, synopsis, genre, format, project_type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("API key not configured");

    if (action === "coverage") {
      const context = [
        title && `Title: "${title}"`,
        project_type && `Type: ${project_type}`,
        genre?.length && `Genre: ${genre.join(", ")}`,
        format && `Format: ${format}`,
      ].filter(Boolean).join(" | ");

      const userPrompt = `Generate a professional coverage report for this project.

${context}

LOGLINE: ${logline || "(not provided)"}

SYNOPSIS: ${synopsis || "(not provided)"}`;

      const tools = [{
        type: "function" as const,
        function: {
          name: "coverage_report",
          description: "Return structured coverage report",
          parameters: {
            type: "object",
            properties: {
              rating: { type: "string", enum: ["RECOMMEND", "CONSIDER", "PASS"] },
              overall_impression: { type: "string", description: "2-3 sentence summary" },
              concept_score: { type: "number", description: "1-10" },
              story_score: { type: "number", description: "1-10" },
              character_score: { type: "number", description: "1-10" },
              dialogue_score: { type: "number", description: "1-10" },
              marketability_score: { type: "number", description: "1-10" },
              strengths: { type: "array", items: { type: "string" } },
              weaknesses: { type: "array", items: { type: "string" } },
              comparable_titles: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    year: { type: "number" },
                    reason: { type: "string" },
                  },
                  required: ["title", "reason"],
                  additionalProperties: false,
                },
              },
              reader_notes: { type: "string", description: "1-2 paragraphs of detailed feedback" },
            },
            required: ["rating", "overall_impression", "concept_score", "story_score", "character_score", "dialogue_score", "marketability_score", "strengths", "weaknesses", "comparable_titles", "reader_notes"],
            additionalProperties: false,
          },
        },
      }];

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: COVERAGE_SYSTEM },
            { role: "user", content: userPrompt },
          ],
          tools,
          tool_choice: { type: "function", function: { name: "coverage_report" } },
        }),
      });

      if (!response.ok) {
        const t = await response.text();
        console.error("Gateway error:", response.status, t);
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No result from AI");

      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "comps") {
      const userPrompt = `Suggest comparable titles for this project:

Title: "${title || "Untitled"}"
Type: ${project_type || "screenplay"}
Genre: ${genre?.join(", ") || "not specified"}
Logline: ${logline || "(not provided)"}`;

      const tools = [{
        type: "function" as const,
        function: {
          name: "comp_suggestions",
          description: "Return comparable title suggestions",
          parameters: {
            type: "object",
            properties: {
              comps: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    year: { type: "number" },
                    reason: { type: "string", description: "Why this is a good comp" },
                    audience_overlap: { type: "string", description: "Brief note on shared audience" },
                  },
                  required: ["title", "reason"],
                  additionalProperties: false,
                },
              },
              pitch_line: { type: "string", description: "A 'X meets Y' style pitch line using the best 2 comps" },
            },
            required: ["comps", "pitch_line"],
            additionalProperties: false,
          },
        },
      }];

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: COMP_SYSTEM },
            { role: "user", content: userPrompt },
          ],
          tools,
          tool_choice: { type: "function", function: { name: "comp_suggestions" } },
        }),
      });

      if (!response.ok) {
        const t = await response.text();
        console.error("Gateway error:", response.status, t);
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No result from AI");

      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("coverage-simulator error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
