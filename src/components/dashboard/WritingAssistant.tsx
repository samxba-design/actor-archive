import { useState } from "react";
import { Wand2, Loader2, Check, ChevronDown, ChevronUp, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";

interface WritingAssistantProps {
  text: string;
  field: "logline" | "description" | "headline" | "bio";
  title?: string;
  genre?: string[];
  format?: string;
  onApply?: (text: string) => void;
}

type EvalResult = {
  score: number;
  strengths: string[];
  improvements: string[];
  reader_impression: string;
  word_count?: number;
  tense_voice_ok?: boolean;
  structure_present?: boolean;
};

type SuggestResult = {
  suggestions?: Array<{ text: string; approach: string }>;
  improved_text?: string;
  changes_made?: string[];
};

export function WritingAssistant({ text, field, title, genre, format, onApply }: WritingAssistantProps) {
  const { toast } = useToast();
  const { isPro } = useSubscription();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"idle" | "eval" | "suggest">("idle");
  const [evalResult, setEvalResult] = useState<EvalResult | null>(null);
  const [suggestResult, setSuggestResult] = useState<SuggestResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const isLogline = field === "logline";
  const isHeadline = field === "headline";
  const isBio = field === "bio";
  const evalType = isLogline ? "evaluate_logline" : isHeadline ? "evaluate_headline" : isBio ? "improve_bio" : "evaluate_synopsis";
  const suggestType = isLogline ? "suggest_logline" : isHeadline ? "suggest_headline" : isBio ? "improve_bio" : "suggest_synopsis";

  const callAssist = async (type: string) => {
    if (!text || text.trim().length < 5) {
      toast({ title: "Not enough text", description: "Write a bit more before refining.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setMode(type.startsWith("evaluate") ? "eval" : "suggest");
    setEvalResult(null);
    setSuggestResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("writing-assist", {
        body: { type, text, title, genre, format },
      });

      if (error) throw error;
      if (data?.error) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
        setMode("idle");
        setLoading(false);
        return;
      }

      if (type.startsWith("evaluate")) {
        setEvalResult(data.result);
      } else {
        setSuggestResult(data.result);
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Something went wrong", variant: "destructive" });
      setMode("idle");
    }
    setLoading(false);
  };

  const scoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 5) return "text-yellow-600";
    return "text-red-500";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-muted-foreground hover:text-foreground"
          title={`Refine ${isLogline ? "logline" : "description"}`}
        >
          <Wand2 className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs">Refine</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        {!isPro ? (
          <div className="p-6 text-center space-y-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm">AI Writing Assistant</h3>
            <p className="text-xs text-muted-foreground">Upgrade to Pro to evaluate and improve your loglines, bios, and descriptions with AI.</p>
            <Button size="sm" asChild className="w-full">
              <Link to="/pricing">Upgrade to Pro — $19.99/mo</Link>
            </Button>
          </div>
        ) : (
        <>
        <div className="p-3 border-b">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={mode === "eval" ? "default" : "outline"}
              onClick={() => callAssist(evalType)}
              disabled={loading}
              className="flex-1 text-xs"
            >
              {loading && mode === "eval" ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3 mr-1" />
              )}
              Evaluate
            </Button>
            <Button
              size="sm"
              variant={mode === "suggest" ? "default" : "outline"}
              onClick={() => callAssist(suggestType)}
              disabled={loading}
              className="flex-1 text-xs"
            >
              {loading && mode === "suggest" ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Wand2 className="h-3 w-3 mr-1" />
              )}
              Suggest
            </Button>
          </div>
        </div>

        {loading && (
          <div className="p-6 flex items-center justify-center text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing...
          </div>
        )}

        {evalResult && !loading && (
          <div className="p-3 space-y-3 max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Score</span>
              <span className={`text-2xl font-bold ${scoreColor(evalResult.score)}`}>
                {evalResult.score}/10
              </span>
            </div>

            {evalResult.word_count != null && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{evalResult.word_count} words</span>
                {evalResult.tense_voice_ok != null && (
                  <Badge variant={evalResult.tense_voice_ok ? "default" : "destructive"} className="text-[10px] px-1.5 py-0">
                    {evalResult.tense_voice_ok ? "✓ Tense/voice" : "✗ Tense/voice"}
                  </Badge>
                )}
              </div>
            )}

            <p className="text-sm italic text-muted-foreground">"{evalResult.reader_impression}"</p>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {showDetails ? "Hide" : "Show"} details
            </button>

            {showDetails && (
              <>
                <div>
                  <p className="text-xs font-medium text-green-700 mb-1">Strengths</p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    {evalResult.strengths.map((s, i) => (
                      <li key={i} className="flex gap-1.5">
                        <Check className="h-3 w-3 text-green-600 shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-amber-700 mb-1">To improve</p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    {evalResult.improvements.map((s, i) => (
                      <li key={i} className="flex gap-1.5">
                        <span className="text-amber-500 shrink-0">→</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {suggestResult && !loading && (
          <div className="p-3 space-y-3 max-h-80 overflow-y-auto">
            {suggestResult.suggestions?.map((s, i) => (
              <div key={i} className="border rounded-md p-2.5 space-y-1.5">
                <p className="text-sm">{s.text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{s.approach}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs"
                    onClick={() => {
                      onApply?.(s.text);
                      setOpen(false);
                    }}
                  >
                    Use this
                  </Button>
                </div>
              </div>
            ))}
            {suggestResult.improved_text && (
              <div className="space-y-2">
                <div className="border rounded-md p-2.5">
                  <p className="text-sm">{suggestResult.improved_text}</p>
                </div>
                {suggestResult.changes_made && (
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    {suggestResult.changes_made.map((c, i) => (
                      <li key={i}>• {c}</li>
                    ))}
                  </ul>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-xs w-full"
                  onClick={() => {
                    onApply?.(suggestResult.improved_text!);
                    setOpen(false);
                  }}
                >
                  Use this version
                </Button>
              </div>
            )}
          </div>
        )}

        {!loading && !evalResult && !suggestResult && (
          <div className="p-4 text-center text-xs text-muted-foreground">
            {isLogline
              ? "Evaluate your logline against industry standards or get alternative suggestions."
              : "Get feedback on your synopsis structure and clarity, or get an improved version."}
          </div>
        )}
        </>
        )}
      </PopoverContent>
    </Popover>
  );
}
