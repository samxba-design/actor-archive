import { useState } from "react";
import { Wand2, Loader2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";

interface Props {
  serviceName: string;
  currentDescription?: string;
  onApply: (result: { description: string; deliverables: string[]; turnaround: string }) => void;
}

export function ServiceDescriptionAI({ serviceName, currentDescription, onApply }: Props) {
  const { toast } = useToast();
  const { isPro } = useSubscription();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generate = async () => {
    if (!serviceName.trim()) {
      toast({ title: "Enter a service name first", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const text = [
        `Service name: ${serviceName}`,
        currentDescription && `Current description: ${currentDescription}`,
      ].filter(Boolean).join("\n");

      const { data, error } = await supabase.functions.invoke("writing-assist", {
        body: { type: "generate_service_description", text },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data.result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1">
          <Wand2 className="h-3 w-3" /> AI Draft
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        {!isPro ? (
          <div className="p-6 text-center space-y-3">
            <Crown className="h-8 w-8 text-primary mx-auto" />
            <p className="text-xs text-muted-foreground">Upgrade to Pro to auto-generate service descriptions.</p>
            <Button size="sm" asChild className="w-full"><Link to="/pricing">Upgrade to Pro</Link></Button>
          </div>
        ) : (
          <div className="p-3 space-y-3">
            <Button onClick={generate} disabled={loading} size="sm" className="w-full text-xs">
              {loading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Wand2 className="mr-1 h-3 w-3" />}
              Generate Description
            </Button>

            {loading && (
              <div className="flex items-center justify-center py-4 text-muted-foreground text-xs">
                <Loader2 className="h-3 w-3 mr-2 animate-spin" /> Writing...
              </div>
            )}

            {result && !loading && (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                <div className="border rounded-md p-2.5">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{result.description}</p>
                </div>
                {result.suggested_deliverables?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Suggested Deliverables</p>
                    <ul className="text-xs space-y-0.5">
                      {result.suggested_deliverables.map((d: string, i: number) => (
                        <li key={i} className="text-muted-foreground">• {d}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.suggested_turnaround && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Turnaround:</span> {result.suggested_turnaround}
                  </p>
                )}
                <Button
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    onApply({
                      description: result.description,
                      deliverables: result.suggested_deliverables || [],
                      turnaround: result.suggested_turnaround || "",
                    });
                    setOpen(false);
                  }}
                >
                  Apply All
                </Button>
              </div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
