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

const HEADLINE_RULES = `You are an entertainment industry branding expert. Evaluate ONLY based on the text provided.

HEADLINE RULES:
- One sentence, under 15 words
- Communicates professional identity and unique value
- Should be specific (not generic like "Creative Professional")
- Include notable credentials, specialties, or achievements if relevant
- Professional yet distinctive tone
- Should make the reader want to learn more`;

const BIO_RULES = `You are an entertainment industry career consultant. Write ONLY based on the provided factual context — never invent credits, awards, or details.

BIO RULES:
- 150–300 words, professional tone
- Can be first or third person (third person is industry standard)
- Lead with the most impressive credential or defining trait
- Mention specific, verifiable credits and achievements
- Include genre specialties or areas of focus
- End with current status or what they're working toward
- NEVER fabricate credits, awards, or affiliations
- If limited information is provided, write a shorter, honest bio`;

const LOGLINE_GENERATOR_RULES = `You are a Hollywood development executive and pitch specialist. Generate compelling loglines from provided story details.

RULES:
- Generate 4 distinct logline variations, each with a different angle/approach
- Each logline MUST be 25–50 words, one to two sentences
- Present tense, active voice
- Identify a specific protagonist with a defining trait
- State the inciting incident and central conflict
- Include irony, a hook, or a compelling contrast
- Avoid character names — use descriptors
- No spoilers
- Genre implied through word choice
- Each variation should take a meaningfully different approach (tone, emphasis, hook)
- Base everything ONLY on the provided text — do not invent story elements`;

const BIO_BUILDER_RULES = `You are a creative industry career consultant and professional bio writer. Generate a polished, compelling professional bio from structured career data.

RULES:
- Write in third person, professional tone
- 150–300 words
- Lead with the most impressive/distinctive credential
- Weave in achievements, specializations, and career highlights naturally
- If industry awards or notable clients are mentioned, lead with those
- Match tone to the professional type (e.g., corporate for copywriters, literary for authors, cinematic for filmmakers)
- End with current focus, availability, or what they're seeking
- NEVER fabricate or embellish — only use provided facts
- If limited info, write a shorter but polished bio`;

const PITCH_EMAIL_RULES = `You are an entertainment industry pitch expert and professional communications consultant. Write targeted, compelling pitch emails and query letters.

RULES:
- Professional, warm, but not overly casual
- Opening line should immediately establish relevance (why you're contacting THIS person/company)
- Clearly state what you're pitching and why it matters
- Include a brief, compelling hook (logline, key result, unique angle)
- Mention 1-2 relevant credentials concisely
- Clear call to action (what you want them to do next)
- Keep under 250 words — brevity is crucial
- Adapt tone to the industry context (Hollywood vs. publishing vs. corporate)
- NEVER fabricate credentials — only use provided facts
- Generate 2 variations: one formal, one conversational`;

const SERVICE_DESC_RULES = `You are a professional copywriter who specializes in writing compelling service descriptions for creative professionals.

RULES:
- Write a clear, persuasive service description (80-150 words)
- Lead with the value/outcome the client gets, not the process
- Use active, benefit-driven language
- Include 3-5 specific deliverables as bullet points
- Suggest a professional turnaround time if relevant
- Match tone to the service type (creative, corporate, technical)
- NEVER fabricate capabilities — only work with provided information`;

const CASE_STUDY_DRAFT_RULES = `You are a B2B marketing specialist who writes compelling case studies that showcase client results.

RULES:
- Write in clear, professional prose
- Challenge section: Set up the problem with context (industry, scale, urgency). 2-3 sentences.
- Solution section: Describe the approach and methodology. Focus on strategy, not just tactics. 2-3 sentences.
- Results section: Lead with the most impressive outcome. Use specific numbers. 2-3 sentences.
- If metric data is provided, weave numbers into the narrative naturally
- Professional but engaging tone — not dry or overly technical
- NEVER fabricate results or details — only elaborate on provided facts`;

function buildToolDef(name: string, description: string, properties: Record<string, any>, required: string[]) {
  return {
    type: "function" as const,
    function: {
      name,
      description,
      parameters: { type: "object", properties, required, additionalProperties: false },
    },
  };
}

function getPromptAndTools(type: string, text: string, context: string) {
  switch (type) {
    case "evaluate_logline":
      return {
        systemPrompt: LOGLINE_RULES,
        userPrompt: `Evaluate this logline${context ? ` (${context})` : ""}:\n\n"${text}"`,
        tools: [buildToolDef("logline_evaluation", "Return structured logline evaluation", {
          score: { type: "number", description: "Score 1-10" },
          word_count: { type: "number" },
          strengths: { type: "array", items: { type: "string" }, description: "2-3 things that work well" },
          improvements: { type: "array", items: { type: "string" }, description: "2-3 specific improvements" },
          reader_impression: { type: "string", description: "One sentence: what a reader would think/feel" },
          tense_voice_ok: { type: "boolean", description: "Is it in present tense, active voice?" },
        }, ["score", "word_count", "strengths", "improvements", "reader_impression", "tense_voice_ok"])],
        toolChoice: { type: "function", function: { name: "logline_evaluation" } },
      };

    case "suggest_logline":
      return {
        systemPrompt: LOGLINE_RULES + "\n\nGenerate 2-3 alternative loglines that strictly follow the rules above. Base them ONLY on the provided text — do not invent plot points.",
        userPrompt: `Based on this existing logline${context ? ` (${context})` : ""}, suggest improved alternatives:\n\n"${text}"`,
        tools: [buildToolDef("logline_suggestions", "Return alternative logline suggestions", {
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
        }, ["suggestions"])],
        toolChoice: { type: "function", function: { name: "logline_suggestions" } },
      };

    case "evaluate_synopsis":
      return {
        systemPrompt: SYNOPSIS_RULES,
        userPrompt: `Evaluate this synopsis/description${context ? ` (${context})` : ""}:\n\n"${text}"`,
        tools: [buildToolDef("synopsis_evaluation", "Return structured synopsis evaluation", {
          score: { type: "number", description: "Score 1-10" },
          strengths: { type: "array", items: { type: "string" } },
          improvements: { type: "array", items: { type: "string" } },
          reader_impression: { type: "string" },
          structure_present: { type: "boolean", description: "Has clear beginning/middle/end" },
        }, ["score", "strengths", "improvements", "reader_impression", "structure_present"])],
        toolChoice: { type: "function", function: { name: "synopsis_evaluation" } },
      };

    case "suggest_synopsis":
      return {
        systemPrompt: SYNOPSIS_RULES + "\n\nRewrite or improve the synopsis. Base it ONLY on the provided text — do not invent plot points or characters.",
        userPrompt: `Improve this synopsis${context ? ` (${context})` : ""}:\n\n"${text}"`,
        tools: [buildToolDef("synopsis_suggestion", "Return an improved synopsis", {
          improved_text: { type: "string" },
          changes_made: { type: "array", items: { type: "string" }, description: "What was changed and why" },
        }, ["improved_text", "changes_made"])],
        toolChoice: { type: "function", function: { name: "synopsis_suggestion" } },
      };

    case "evaluate_headline":
      return {
        systemPrompt: HEADLINE_RULES,
        userPrompt: `Evaluate this professional headline${context ? ` (${context})` : ""}:\n\n"${text}"`,
        tools: [buildToolDef("headline_evaluation", "Return structured headline evaluation", {
          score: { type: "number", description: "Score 1-10" },
          strengths: { type: "array", items: { type: "string" }, description: "1-2 things that work" },
          improvements: { type: "array", items: { type: "string" }, description: "1-2 specific improvements" },
          impression: { type: "string", description: "One sentence: what impression this gives" },
        }, ["score", "strengths", "improvements", "impression"])],
        toolChoice: { type: "function", function: { name: "headline_evaluation" } },
      };

    case "suggest_headline":
      return {
        systemPrompt: HEADLINE_RULES + "\n\nGenerate 2-3 alternative headlines. Base them ONLY on the provided context.",
        userPrompt: `Suggest improved headlines based on this${context ? ` (${context})` : ""}:\n\nCurrent: "${text}"`,
        tools: [buildToolDef("headline_suggestions", "Return alternative headline suggestions", {
          suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                text: { type: "string" },
                approach: { type: "string" },
              },
              required: ["text", "approach"],
              additionalProperties: false,
            },
          },
        }, ["suggestions"])],
        toolChoice: { type: "function", function: { name: "headline_suggestions" } },
      };

    case "generate_bio":
      return {
        systemPrompt: BIO_RULES,
        userPrompt: `Generate a professional bio based ONLY on this factual context:\n\n${text}`,
        tools: [buildToolDef("bio_generation", "Return a generated bio", {
          bio_text: { type: "string", description: "The generated bio, 150-300 words" },
          tone_note: { type: "string", description: "Brief note on the tone and approach taken" },
        }, ["bio_text", "tone_note"])],
        toolChoice: { type: "function", function: { name: "bio_generation" } },
      };

    case "improve_bio":
      return {
        systemPrompt: BIO_RULES + "\n\nImprove the provided bio. Only work with factual information already present — do not add credentials or details not in the original.",
        userPrompt: `Improve this professional bio${context ? ` (${context})` : ""}:\n\n"${text}"`,
        tools: [buildToolDef("bio_improvement", "Return an improved bio", {
          improved_text: { type: "string" },
          changes_made: { type: "array", items: { type: "string" }, description: "What was changed and why" },
        }, ["improved_text", "changes_made"])],
        toolChoice: { type: "function", function: { name: "bio_improvement" } },
      };

    // ── NEW AI FEATURES ──

    case "generate_loglines":
      return {
        systemPrompt: LOGLINE_GENERATOR_RULES,
        userPrompt: `Generate 4 distinct logline variations from this story information:\n\n${text}`,
        tools: [buildToolDef("logline_variations", "Return 4 logline variations", {
          variations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                text: { type: "string", description: "The logline (25-50 words)" },
                approach: { type: "string", description: "Brief label: what angle this takes (e.g. 'Emotional hook', 'High-concept', 'Character-driven', 'Genre-forward')" },
                word_count: { type: "number" },
              },
              required: ["text", "approach", "word_count"],
              additionalProperties: false,
            },
          },
        }, ["variations"])],
        toolChoice: { type: "function", function: { name: "logline_variations" } },
      };

    case "build_bio":
      return {
        systemPrompt: BIO_BUILDER_RULES,
        userPrompt: `Build a professional bio from this structured career data:\n\n${text}`,
        tools: [buildToolDef("bio_built", "Return a crafted professional bio", {
          bio_text: { type: "string", description: "The polished bio, 150-300 words" },
          highlights_used: { type: "array", items: { type: "string" }, description: "Key facts/achievements woven into the bio" },
          tone: { type: "string", description: "The tone used (e.g. 'authoritative and warm', 'cinematic and bold')" },
        }, ["bio_text", "highlights_used", "tone"])],
        toolChoice: { type: "function", function: { name: "bio_built" } },
      };

    case "generate_pitch_email":
      return {
        systemPrompt: PITCH_EMAIL_RULES,
        userPrompt: `Write pitch emails based on this context:\n\n${text}`,
        tools: [buildToolDef("pitch_emails", "Return 2 pitch email variations", {
          emails: {
            type: "array",
            items: {
              type: "object",
              properties: {
                subject_line: { type: "string" },
                body: { type: "string" },
                tone: { type: "string", description: "e.g. 'Formal & professional' or 'Warm & conversational'" },
                word_count: { type: "number" },
              },
              required: ["subject_line", "body", "tone", "word_count"],
              additionalProperties: false,
            },
          },
          tips: { type: "array", items: { type: "string" }, description: "2-3 tips for personalizing this email further" },
        }, ["emails", "tips"])],
        toolChoice: { type: "function", function: { name: "pitch_emails" } },
      };

    case "generate_service_description":
      return {
        systemPrompt: SERVICE_DESC_RULES,
        userPrompt: `Write a compelling service description from these notes:\n\n${text}`,
        tools: [buildToolDef("service_description", "Return a polished service description", {
          description: { type: "string", description: "80-150 word service description" },
          suggested_deliverables: { type: "array", items: { type: "string" }, description: "3-5 specific deliverables" },
          suggested_turnaround: { type: "string", description: "Suggested turnaround time" },
        }, ["description", "suggested_deliverables", "suggested_turnaround"])],
        toolChoice: { type: "function", function: { name: "service_description" } },
      };

    case "draft_case_study":
      return {
        systemPrompt: CASE_STUDY_DRAFT_RULES,
        userPrompt: `Draft a compelling case study narrative from these bullet points:\n\n${text}`,
        tools: [buildToolDef("case_study_draft", "Return a structured case study draft", {
          challenge: { type: "string", description: "The challenge section, 2-3 sentences" },
          solution: { type: "string", description: "The solution section, 2-3 sentences" },
          results: { type: "string", description: "The results section, 2-3 sentences" },
          suggested_metrics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                value: { type: "string" },
              },
              required: ["label", "value"],
              additionalProperties: false,
            },
            description: "2-3 suggested metric callouts extracted from the text",
          },
        }, ["challenge", "solution", "results", "suggested_metrics"])],
        toolChoice: { type: "function", function: { name: "case_study_draft" } },
      };

    default:
      return null;
  }
}

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

    const config = getPromptAndTools(type, text, context);
    if (!config) {
      return new Response(
        JSON.stringify({ error: "Invalid type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: any = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: config.systemPrompt },
        { role: "user", content: config.userPrompt },
      ],
      tools: config.tools,
      tool_choice: config.toolChoice,
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
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please try again later." }), {
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
      return new Response(JSON.stringify({ error: "Unable to process. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
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