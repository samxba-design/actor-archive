import { useState } from "react";
import { Wand2, Loader2, Crown, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";

interface Props {
  name: string;
  profileType?: string;
  onApply: (bio: string) => void;
}

const STEPS = ["basics", "highlights", "generate"] as const;
type Step = typeof STEPS[number];

export function BioBuilderWizard({ name, profileType, onApply }: Props) {
  const { toast } = useToast();
  const { isPro } = useSubscription();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("basics");
  const [loading, setLoading] = useState(false);
  const [generatedBio, setGeneratedBio] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [tone, setTone] = useState("");

  const [form, setForm] = useState({
    yearsExperience: "",
    specializations: "",
    notableClients: "",
    achievements: "",
    currentFocus: "",
    personality: "",
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const generate = async () => {
    setLoading(true);
    setGeneratedBio("");
    try {
      const context = JSON.stringify({
        name,
        profile_type: profileType,
        years_experience: form.yearsExperience,
        specializations: form.specializations,
        notable_clients: form.notableClients,
        achievements: form.achievements,
        current_focus: form.currentFocus,
        personality_keywords: form.personality,
      });

      const { data, error } = await supabase.functions.invoke("writing-assist", {
        body: { type: "build_bio", text: context, title: name },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setGeneratedBio(data.result?.bio_text || "");
      setHighlights(data.result?.highlights_used || []);
      setTone(data.result?.tone || "");
      setStep("generate");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const reset = () => {
    setStep("basics");
    setGeneratedBio("");
    setHighlights([]);
    setForm({ yearsExperience: "", specializations: "", notableClients: "", achievements: "", currentFocus: "", personality: "" });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-xs gap-1">
          <Wand2 className="h-3 w-3" />
          Bio Builder
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-primary" />
            AI Bio Builder
          </DialogTitle>
        </DialogHeader>

        {!isPro ? (
          <div className="py-8 text-center space-y-3">
            <Crown className="h-8 w-8 text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Upgrade to Pro to build your bio with AI.</p>
            <Button size="sm" asChild><Link to="/pricing">Upgrade to Pro</Link></Button>
          </div>
        ) : (
          <>
            {/* Step indicator */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step === s ? "bg-primary text-primary-foreground" : STEPS.indexOf(step) > i ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {STEPS.indexOf(step) > i ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className={step === s ? "font-medium text-foreground" : ""}>
                    {s === "basics" ? "Your Story" : s === "highlights" ? "Highlights" : "Review"}
                  </span>
                  {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 mx-1" />}
                </div>
              ))}
            </div>

            {step === "basics" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Tell us about your career — the AI will craft a polished bio from these details.</p>
                <div>
                  <Label className="text-xs">Years of experience</Label>
                  <Input value={form.yearsExperience} onChange={update("yearsExperience")} placeholder="e.g. 8 years" />
                </div>
                <div>
                  <Label className="text-xs">Specializations / focus areas</Label>
                  <Input value={form.specializations} onChange={update("specializations")} placeholder="e.g. Brand strategy, crisis comms, UX writing" />
                </div>
                <div>
                  <Label className="text-xs">Notable clients or brands</Label>
                  <Input value={form.notableClients} onChange={update("notableClients")} placeholder="e.g. Microsoft, SoFi, Nike" />
                </div>
                <Button onClick={() => setStep("highlights")} className="w-full">
                  Next: Highlights <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}

            {step === "highlights" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Add achievements and personality to make your bio stand out.</p>
                <div>
                  <Label className="text-xs">Key achievements or awards</Label>
                  <Textarea value={form.achievements} onChange={update("achievements")} rows={2} placeholder="e.g. 2x Webby Award winner, increased client revenue by 300%" />
                </div>
                <div>
                  <Label className="text-xs">What you're currently focused on</Label>
                  <Input value={form.currentFocus} onChange={update("currentFocus")} placeholder="e.g. Building brand voice systems for fintech startups" />
                </div>
                <div>
                  <Label className="text-xs">Personality / tone keywords</Label>
                  <Input value={form.personality} onChange={update("personality")} placeholder="e.g. Bold, witty, data-driven" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("basics")} className="flex-1">Back</Button>
                  <Button onClick={generate} disabled={loading} className="flex-1">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Generate Bio
                  </Button>
                </div>
              </div>
            )}

            {step === "generate" && (
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Crafting your bio...
                  </div>
                ) : (
                  <>
                    <div className="border rounded-lg p-4 space-y-3">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{generatedBio}</p>
                    </div>
                    {tone && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Tone:</span> {tone}
                      </p>
                    )}
                    {highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {highlights.map((h, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">{h}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => { setStep("highlights"); }} className="flex-1">Edit Inputs</Button>
                      <Button variant="outline" onClick={generate} disabled={loading} className="flex-1">Regenerate</Button>
                      <Button onClick={() => { onApply(generatedBio); setOpen(false); }} className="flex-1">Use This Bio</Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
