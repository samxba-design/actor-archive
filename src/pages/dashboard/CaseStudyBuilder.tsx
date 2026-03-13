import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, Wand2 } from "lucide-react";
import { UpgradeGate } from "@/components/UpgradeGate";

const CaseStudyBuilder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    client: "",
    challenge: "",
    solution: "",
    results: "",
    metric1Label: "",
    metric1Value: "",
    metric2Label: "",
    metric2Value: "",
    metric3Label: "",
    metric3Value: "",
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleGenerate = async () => {
    if (!form.title && !form.client && !form.challenge) {
      toast({ title: "Add context", description: "Fill in at least a title, client, or challenge first.", variant: "destructive" });
      return;
    }
    setGenerating(true);
    try {
      const context = JSON.stringify({
        title: form.title,
        client: form.client,
        challenge: form.challenge,
        solution: form.solution,
        results: form.results,
      });
      const { data, error } = await supabase.functions.invoke("writing-assist", {
        body: { type: "draft_case_study", text: context, title: form.title },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const r = data.result;
      if (r) {
        setForm((prev) => ({
          ...prev,
          challenge: r.challenge || prev.challenge,
          solution: r.solution || prev.solution,
          results: r.results || prev.results,
          metric1Label: r.suggested_metrics?.[0]?.label || prev.metric1Label,
          metric1Value: r.suggested_metrics?.[0]?.value || prev.metric1Value,
          metric2Label: r.suggested_metrics?.[1]?.label || prev.metric2Label,
          metric2Value: r.suggested_metrics?.[1]?.value || prev.metric2Value,
          metric3Label: r.suggested_metrics?.[2]?.label || prev.metric3Label,
          metric3Value: r.suggested_metrics?.[2]?.value || prev.metric3Value,
        }));
        toast({ title: "Generated", description: "Review and edit the case study content." });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user || !form.title) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const metrics = [
      form.metric1Label && { label: form.metric1Label, value: form.metric1Value },
      form.metric2Label && { label: form.metric2Label, value: form.metric2Value },
      form.metric3Label && { label: form.metric3Label, value: form.metric3Value },
    ].filter(Boolean);

    const { error } = await supabase.from("projects").insert({
      profile_id: user.id,
      title: form.title,
      project_type: "case_study",
      client: form.client,
      challenge: form.challenge,
      solution: form.solution,
      results: form.results,
      metric_callouts: metrics.length > 0 ? metrics : null,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Case study added to your projects." });
      setForm({ title: "", client: "", challenge: "", solution: "", results: "", metric1Label: "", metric1Value: "", metric2Label: "", metric2Value: "", metric3Label: "", metric3Value: "" });
    }
    setSaving(false);
  };

  return (
    <UpgradeGate feature="case_study_builder" label="Case Study Builder">
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Case Study Builder</h1>
        <p className="text-muted-foreground mt-1">Structure your client work into compelling case studies with Challenge → Solution → Results.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Project Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Project Title</Label><Input value={form.title} onChange={update("title")} placeholder="e.g. Brand Repositioning for Acme Corp" /></div>
          <div><Label>Client</Label><Input value={form.client} onChange={update("client")} placeholder="e.g. Acme Corporation" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">The Story</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleGenerate} disabled={generating} className="text-xs">
              {generating ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Wand2 className="mr-1 h-3 w-3" />}
              AI Assist
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Challenge</Label><Textarea value={form.challenge} onChange={update("challenge")} rows={3} placeholder="What problem did the client face?" /></div>
          <div><Label>Solution</Label><Textarea value={form.solution} onChange={update("solution")} rows={3} placeholder="What did you do to solve it?" /></div>
          <div><Label>Results</Label><Textarea value={form.results} onChange={update("results")} rows={3} placeholder="What were the outcomes?" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Key Metrics</CardTitle><CardDescription>Add up to 3 standout numbers.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          {([1, 2, 3] as const).map((n) => (
            <div key={n} className="grid grid-cols-2 gap-3">
              <div><Label>Metric {n} Label</Label><Input value={form[`metric${n}Label` as keyof typeof form]} onChange={update(`metric${n}Label`)} placeholder="e.g. Revenue increase" /></div>
              <div><Label>Value</Label><Input value={form[`metric${n}Value` as keyof typeof form]} onChange={update(`metric${n}Value`)} placeholder="e.g. +47%" /></div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Save as Case Study Project
      </Button>
    </div>
    </UpgradeGate>
  );
};

export default CaseStudyBuilder;
