import { useState } from "react";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";
import { Crown } from "lucide-react";

interface Props {
  title: string;
  synopsis?: string;
  genre?: string[];
  format?: string;
  currentLogline?: string;
  onApply: (logline: string) => void;
}

interface Variation {
  text: string;
  approach: string;
  word_count: number;
}

export function LoglineGenerator({ title, synopsis, genre, format, currentLogline, onApply }: Props) {
  const { toast } = useToast();
  const { isPro } = useSubscription();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = async () => {
    const storyInfo = [
      title && `Title: ${title}`,
      currentLogline && `Current logline: ${currentLogline}`,
      synopsis && `Synopsis/Description: ${synopsis}`,
      genre?.length && `Genre: ${genre.join(", ")}`,
      format && `Format: ${format}`,
    ].filter(Boolean).join("\n");

    if (storyInfo.length < 10) {
      toast({ title: "Need more info", description: "Add a title and some story details first.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setVariations([]);
    try {
      const { data, error } = await supabase.functions.invoke("writing-assist", {
        body: { type: "generate_loglines", text: storyInfo, title },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setVariations(data.result?.variations || []);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-xs gap-1">
          <Sparkles className="h-3 w-3" />
          Generate Loglines
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Logline Generator
          </DialogTitle>
        </DialogHeader>

        {!isPro ? (
          <div className="py-8 text-center space-y-3">
            <Crown className="h-8 w-8 text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Upgrade to Pro to generate logline variations with AI.</p>
            <Button size="sm" asChild>
              <Link to="/pricing">Upgrade to Pro</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Generate 4 distinct logline variations from your story details. Each takes a different angle — high-concept, character-driven, genre-forward, or emotional hook.
            </p>

            <Button onClick={generate} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {variations.length ? "Regenerate" : "Generate Variations"}
            </Button>

            {loading && (
              <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Crafting loglines...
              </div>
            )}

            {variations.length > 0 && !loading && (
              <div className="space-y-3">
                {variations.map((v, i) => (
                  <div key={i} className="border rounded-lg p-3 space-y-2 hover:border-primary/30 transition-colors">
                    <p className="text-sm leading-relaxed">{v.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {v.approach}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{v.word_count} words</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          onClick={() => handleCopy(v.text, i)}
                        >
                          {copiedIdx === i ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          className="h-6 px-3 text-xs"
                          onClick={() => { onApply(v.text); setOpen(false); }}
                        >
                          Use this
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
