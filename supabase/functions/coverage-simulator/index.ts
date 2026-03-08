import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const COVERAGE_SYSTEM_SCREEN = `You are a veteran Hollywood script reader with 20+ years of experience at major studios and agencies. You write professional coverage reports that are honest, specific, and actionable.

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

const COVERAGE_SYSTEM_BOOK = `You are a veteran literary editor and book reviewer with 20+ years of experience at major publishing houses. You write professional manuscript evaluations that are honest, specific, and actionable.

You evaluate based ONLY on the provided synopsis, description, and metadata. NEVER invent plot details.

EVALUATION FORMAT:
- Rating: RECOMMEND, CONSIDER, or PASS (be honest — most manuscripts get CONSIDER or PASS)
- Overall impression in 2-3 sentences
- Concept: Is this a fresh, marketable premise? Rate 1-10
- Story: Does the narrative arc and structure work? Rate 1-10
- Character: Are protagonists compelling and well-drawn? Rate 1-10
- Voice: Based on tone/voice in the writing. Rate 1-10
- Marketability: Commercial viability and audience potential. Rate 1-10
- Strengths: 2-3 specific things that work
- Weaknesses: 2-3 specific areas for improvement
- Comparable titles: 2-3 existing books this reminds you of
- Editor notes: 1-2 paragraphs of detailed professional feedback`;

const COMP_SYSTEM_SCREEN = `You are a development executive with encyclopedic knowledge of film and television. Given a project's logline, genre, and tone, suggest 3-5 comparable titles ("comps") that would be used in a pitch meeting.

For each comp, explain WHY it's comparable (tone, structure, audience, theme — not just surface-level genre match). Include box office/audience data when relevant. Focus on titles from the last 15 years when possible.`;

const COMP_SYSTEM_BOOK = `You are a literary agent with encyclopedic knowledge of published books. Given a manuscript's synopsis, genre, and tone, suggest 3-5 comparable titles ("comps") that would be used in a query letter or pitch to editors.

For each comp, explain WHY it's comparable (tone, themes, audience, structure — not just surface-level genre match). Include sales data or awards when relevant. Focus on titles from the last 10 years when possible.`;

const BOOK_TYPES = ["novel", "book", "short_story"];

function isBookProject(projectType?: string): boolean {
  return BOOK_TYPES.includes(projectType || "");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, title, logline, synopsis, genre, format, project_type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("API key not configured");

    const isBook = isBookProject(project_type);

    if (action === "coverage") {
      const context = [
        title && `Title: "${title}"`,
        project_type && `Type: ${project_type}`,
        genre?.length && `Genre: ${genre.join(", ")}`,
        format && `Format: ${format}`,
      ].filter(Boolean).join(" | ");

      const userPrompt = isBook
        ? `Generate a professional manuscript evaluation for this book.\n\n${context}\n\nSYNOPSIS: ${logline || synopsis || "(not provided)"}\n\nDESCRIPTION: ${synopsis || "(not provided)"}`
        : `Generate a professional coverage report for this project.\n\n${context}\n\nLOGLINE: ${logline || "(not provided)"}\n\nSYNOPSIS: ${synopsis || "(not provided)"}`;

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
            { role: "system", content: isBook ? COVERAGE_SYSTEM_BOOK : COVERAGE_SYSTEM_SCREEN },
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
      const userPrompt = isBook
        ? `Suggest comparable titles for this book:\n\nTitle: "${title || "Untitled"}"\nType: ${project_type || "novel"}\nGenre: ${genre?.join(", ") || "not specified"}\nSynopsis: ${logline || "(not provided)"}`
        : `Suggest comparable titles for this project:\n\nTitle: "${title || "Untitled"}"\nType: ${project_type || "screenplay"}\nGenre: ${genre?.join(", ") || "not specified"}\nLogline: ${logline || "(not provided)"}`;

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
            { role: "system", content: isBook ? COMP_SYSTEM_BOOK : COMP_SYSTEM_SCREEN },
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
