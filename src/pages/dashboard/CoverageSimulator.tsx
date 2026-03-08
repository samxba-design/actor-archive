import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Star, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Tables } from "@/integrations/supabase/types";
import { UpgradeGate } from "@/components/UpgradeGate";

type Project = Tables<"projects">;

interface CoverageReport {
  rating: "RECOMMEND" | "CONSIDER" | "PASS";
  overall_impression: string;
  concept_score: number;
  story_score: number;
  character_score: number;
  dialogue_score: number;
  marketability_score: number;
  strengths: string[];
  weaknesses: string[];
  comparable_titles: { title: string; year?: number; reason: string }[];
  reader_notes: string;
}

const ratingConfig = {
  RECOMMEND: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 border-green-200", label: "RECOMMEND" },
  CONSIDER: { icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", label: "CONSIDER" },
  PASS: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 border-red-200", label: "PASS" },
};

const ScoreBar = ({ label, score }: { label: string; score: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{score}/10</span>
    </div>
    <Progress value={score * 10} className="h-2" />
  </div>
);

const CoverageSimulator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<CoverageReport | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("projects")
      .select("*")
      .eq("profile_id", user.id)
      .order("display_order")
      .then(({ data }) => {
        setProjects(data || []);
        setLoading(false);
      });
  }, [user]);

  const runCoverage = async () => {
    const project = projects.find((p) => p.id === selectedId);
    if (!project) return;

    setRunning(true);
    setReport(null);
    try {
      const { data, error } = await supabase.functions.invoke("coverage-simulator", {
        body: {
          action: "coverage",
          title: project.title,
          logline: project.logline,
          synopsis: project.synopsis || project.description,
          genre: project.genre,
          format: project.format,
          project_type: project.project_type,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setReport(data.result);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  const selected = projects.find((p) => p.id === selectedId);
  const cfg = report ? ratingConfig[report.rating] : null;

  return (
    <UpgradeGate feature="coverage_sim" label="Coverage Simulator">
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Coverage Simulator</h1>
        <p className="text-muted-foreground mt-1">Get AI-powered script coverage — the same format used by studio readers.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select a Project</CardTitle>
          <CardDescription>Choose a project with a logline and/or synopsis for best results.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger><SelectValue placeholder="Choose a project..." /></SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title} ({p.project_type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selected && !selected.logline && !selected.synopsis && !selected.description && (
            <p className="text-sm text-destructive">This project has no logline or synopsis. Add one for meaningful coverage.</p>
          )}

          <Button onClick={runCoverage} disabled={!selectedId || running} className="w-full">
            {running ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Coverage...</> : <><FileText className="mr-2 h-4 w-4" /> Run Coverage Report</>}
          </Button>
        </CardContent>
      </Card>

      {report && cfg && (
        <>
          {/* Rating */}
          <Card className={`border-2 ${cfg.bg}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <cfg.icon className={`h-8 w-8 ${cfg.color}`} />
                <div>
                  <h2 className={`text-2xl font-bold ${cfg.color}`}>{cfg.label}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{report.overall_impression}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scores */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Scores</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <ScoreBar label="Concept" score={report.concept_score} />
              <ScoreBar label="Story" score={report.story_score} />
              <ScoreBar label="Character" score={report.character_score} />
              <ScoreBar label="Dialogue" score={report.dialogue_score} />
              <ScoreBar label="Marketability" score={report.marketability_score} />
            </CardContent>
          </Card>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-lg text-green-700">Strengths</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {report.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg text-red-700">Weaknesses</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {report.weaknesses.map((w, i) => (
                    <li key={i} className="flex gap-2 text-sm"><XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />{w}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Comps */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Comparable Titles</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {report.comparable_titles.map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                  <Star className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">{c.title}</span>
                    {c.year && <span className="text-muted-foreground text-sm"> ({c.year})</span>}
                    <p className="text-sm text-muted-foreground mt-0.5">{c.reason}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Reader Notes */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Reader Notes</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-line">{report.reader_notes}</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
    </UpgradeGate>
  );
};

export default CoverageSimulator;
