import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOGLINE_RULES = `You are a senior screenplay reader and development executive. Evaluate writing ONLY based on the text provided — never invent or assume story details.

LOGLINE RULES (industry standard):
- 25–50 words, one to two sentences max
- Present tense, active voice
- Identify a specific protagonist (not "a person" — give them a defining trait)
- State the inciting incident or catalyst
- Make the central conflict and stakes clear
- Include irony, a hook, or a compelling contrast
- Avoid character names (use descriptors)
- No spoilers — don't reveal the ending
- Genre should be implied through word choice and tone`;

const SYNOPSIS_RULES = `You are a senior screenplay reader. Evaluate writing ONLY based on the text provided — never invent or assume story details.

SYNOPSIS EVALUATION CRITERIA:
- Clear three-act structure (setup, confrontation, resolution)
- Written in present tense, third person
- Conveys tone and genre through prose style
- Introduces protagonist with a defining trait
- Establishes stakes within the first paragraph
- Covers all major plot turns including the ending
- Appropriate length (1–3 pages for features, 0.5–1 page for shorts)
- Avoids scene-by-scene description — captures the narrative arc
- Professional, readable prose (not a beat sheet)`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, text, title, genre, format } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("API key not configured");

    if (!text || text.trim().length < 5) {
      return new Response(
        JSON.stringify({ error: "Please enter some text first." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const context = [
      title && `Title: "${title}"`,
      genre?.length && `Genre: ${genre.join(", ")}`,
      format && `Format: ${format}`,
    ]
      .filter(Boolean)
      .join(" | ");

    let systemPrompt: string;
    let userPrompt: string;
    let tools: any[] | undefined;
    let toolChoice: any | undefined;

    if (type === "evaluate_logline") {
      systemPrompt = LOGLINE_RULES;
      userPrompt = `Evaluate this logline${context ? ` (${context})` : ""}:\n\n"${text}"`;
      tools = [
        {
          type: "function",
          function: {
            name: "logline_evaluation",
            description: "Return structured logline evaluation",
            parameters: {
              type: "object",
              properties: {
                score: { type: "number", description: "Score 1-10" },
                word_count: { type: "number" },
                strengths: { type: "array", items: { type: "string" }, description: "2-3 things that work well" },
                improvements: { type: "array", items: { type: "string" }, description: "2-3 specific improvements" },
                reader_impression: { type: "string", description: "One sentence: what a reader would think/feel" },
                tense_voice_ok: { type: "boolean", description: "Is it in present tense, active voice?" },
              },
              required: ["score", "word_count", "strengths", "improvements", "reader_impression", "tense_voice_ok"],
              additionalProperties: false,
            },
          },
        },
      ];
      toolChoice = { type: "function", function: { name: "logline_evaluation" } };
    } else if (type === "suggest_logline") {
      systemPrompt = LOGLINE_RULES + "\n\nGenerate 2-3 alternative loglines that strictly follow the rules above. Base them ONLY on the provided text — do not invent plot points.";
      userPrompt = `Based on this existing logline${context ? ` (${context})` : ""}, suggest improved alternatives:\n\n"${text}"`;
      tools = [
        {
          type: "function",
          function: {
            name: "logline_suggestions",
            description: "Return alternative logline suggestions",
            parameters: {
              type: "object",
              properties: {
                suggestions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" },
                      approach: { type: "string", description: "Brief note on what angle this takes" },
                    },
                    required: ["text", "approach"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["suggestions"],
              additionalProperties: false,
            },
          },
        },
      ];
      toolChoice = { type: "function", function: { name: "logline_suggestions" } };
    } else if (type === "evaluate_synopsis") {
      systemPrompt = SYNOPSIS_RULES;
      userPrompt = `Evaluate this synopsis/description${context ? ` (${context})` : ""}:\n\n"${text}"`;
      tools = [
        {
          type: "function",
          function: {
            name: "synopsis_evaluation",
            description: "Return structured synopsis evaluation",
            parameters: {
              type: "object",
              properties: {
                score: { type: "number", description: "Score 1-10" },
                strengths: { type: "array", items: { type: "string" } },
                improvements: { type: "array", items: { type: "string" } },
                reader_impression: { type: "string" },
                structure_present: { type: "boolean", description: "Has clear beginning/middle/end" },
              },
              required: ["score", "strengths", "improvements", "reader_impression", "structure_present"],
              additionalProperties: false,
            },
          },
        },
      ];
      toolChoice = { type: "function", function: { name: "synopsis_evaluation" } };
    } else if (type === "suggest_synopsis") {
      systemPrompt = SYNOPSIS_RULES + "\n\nRewrite or improve the synopsis. Base it ONLY on the provided text — do not invent plot points or characters.";
      userPrompt = `Improve this synopsis${context ? ` (${context})` : ""}:\n\n"${text}"`;
      tools = [
        {
          type: "function",
          function: {
            name: "synopsis_suggestion",
            description: "Return an improved synopsis",
            parameters: {
              type: "object",
              properties: {
                improved_text: { type: "string" },
                changes_made: { type: "array", items: { type: "string" }, description: "What was changed and why" },
              },
              required: ["improved_text", "changes_made"],
              additionalProperties: false,
            },
          },
        },
      ];
      toolChoice = { type: "function", function: { name: "synopsis_suggestion" } };
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: any = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools,
      tool_choice: toolChoice,
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      return new Response(JSON.stringify({ error: "Unable to process. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ type, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("writing-assist error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
