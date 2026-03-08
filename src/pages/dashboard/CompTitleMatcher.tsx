import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Film, Save } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

interface CompResult {
  comps: { title: string; year?: number; reason: string; audience_overlap?: string }[];
  pitch_line: string;
}

const CompTitleMatcher = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<CompResult | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("projects").select("*").eq("profile_id", user.id).order("display_order")
      .then(({ data }) => { setProjects(data || []); setLoading(false); });
  }, [user]);

  const runComps = async () => {
    const project = projects.find((p) => p.id === selectedId);
    if (!project) return;
    setRunning(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("coverage-simulator", {
        body: {
          action: "comps",
          title: project.title,
          logline: project.logline,
          genre: project.genre,
          project_type: project.project_type,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  const saveComps = async () => {
    if (!result || !selectedId) return;
    setSaving(true);
    const comparable_titles = result.comps.map((c) => ({
      title: c.title,
      year: c.year,
      reason: c.reason,
    }));
    const { error } = await supabase.from("projects").update({ comparable_titles }).eq("id", selectedId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Comp titles saved to your project." });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Comp Title Matcher</h1>
        <p className="text-muted-foreground mt-1">Find comparable titles for your pitch — the "X meets Y" that execs want to hear.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select a Project</CardTitle>
          <CardDescription>Works best with a logline and genre tags.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger><SelectValue placeholder="Choose a project..." /></SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.title} ({p.project_type})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={runComps} disabled={!selectedId || running} className="w-full">
            {running ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finding Comps...</> : <><Sparkles className="mr-2 h-4 w-4" /> Find Comparable Titles</>}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Pitch Line */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Your Pitch Line</p>
              <p className="text-lg font-semibold text-foreground italic">"{result.pitch_line}"</p>
            </CardContent>
          </Card>

          {/* Comps */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Comparable Titles</CardTitle>
                <Button size="sm" variant="outline" onClick={saveComps} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Save className="mr-2 h-3 w-3" />}
                  Save to Project
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.comps.map((c, i) => (
                <div key={i} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <Film className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{c.title}</span>
                    {c.year && <Badge variant="secondary" className="text-xs">{c.year}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{c.reason}</p>
                  {c.audience_overlap && (
                    <p className="text-xs text-muted-foreground mt-2 italic">Audience: {c.audience_overlap}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CompTitleMatcher;
