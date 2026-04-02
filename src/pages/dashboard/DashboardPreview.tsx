import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Monitor, Tablet, Smartphone, ExternalLink, ArrowLeft, RefreshCw, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type Breakpoint = "desktop" | "tablet" | "mobile";
type GoalMode = "book_work" | "find_rep" | "build_authority";

const BREAKPOINT_WIDTHS: Record<Breakpoint, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

const QUICK_DESIGNS = [
  { label: "Cinematic Pro", theme: "cinematic-dark", layout: "cinematic" },
  { label: "Modern Portfolio", theme: "obsidian-noir", layout: "magazine" },
  { label: "Clean Professional", theme: "clean-professional", layout: "standard" },
  { label: "Bold Spotlight", theme: "neon-noir", layout: "spotlight" },
] as const;

const GOAL_MODE_LABELS: Record<GoalMode, { title: string; description: string }> = {
  book_work: { title: "Book More Work", description: "Higher-clarity CTA and service visibility." },
  find_rep: { title: "Find Representation", description: "Emphasize credits, reels, and industry polish." },
  build_authority: { title: "Build Authority", description: "Position awards, press, and social proof first." },
};

const DashboardPreview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [slug, setSlug] = useState<string | null>(null);
  const [profileType, setProfileType] = useState<string>("screenwriter");
  const [loading, setLoading] = useState(true);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const [applying, setApplying] = useState(false);
  const [goalMode, setGoalMode] = useState<GoalMode>("book_work");
  const [lastChanges, setLastChanges] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("slug, profile_type")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setSlug(data?.slug || null);
        setProfileType((data as any)?.profile_type || "screenwriter");
        setLoading(false);
      });
  }, [user]);

  const applyDesign = async (payload: Record<string, any>, successText: string, changes: string[]) => {
    if (!user) return;
    setApplying(true);
    const { error } = await supabase.from("profiles").update(payload as any).eq("id", user.id);
    setApplying(false);
    if (error) {
      toast({ title: "Could not apply design", description: error.message, variant: "destructive" });
      return;
    }
    setLastChanges(changes);
    setRefreshKey((k) => k + 1);
    toast({ title: "Design updated", description: successText });
  };

  const goalRecipe = useMemo(() => {
    if (goalMode === "book_work") {
      return {
        payload: { theme: "clean-professional", layout_preset: "standard", cta_style: "filled-bold", cta_label: "Book a Call" },
        changes: ["Applied clean-professional theme", "Switched to standard conversion-friendly layout", "Upgraded CTA style to filled-bold", "Set CTA label to 'Book a Call'"],
      };
    }
    if (goalMode === "find_rep") {
      return {
        payload: { theme: "obsidian-noir", layout_preset: profileType === "actor" ? "cinematic" : "magazine", cta_style: "outlined", cta_label: "Request Materials" },
        changes: ["Applied obsidian-noir theme", "Adjusted layout for representation review", "Set CTA style to outlined for premium tone", "Set CTA label to 'Request Materials'"],
      };
    }
    return {
      payload: { theme: "neon-noir", layout_preset: "spotlight", cta_style: "shine-sweep", cta_label: "View Featured Work" },
      changes: ["Applied neon-noir authority theme", "Set spotlight layout to focus signature work", "Enabled shine-sweep CTA treatment", "Set CTA label to 'View Featured Work'"],
    };
  }, [goalMode, profileType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!slug) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <p className="text-muted-foreground text-sm">You need to set a portfolio URL before previewing.</p>
        <Button onClick={() => navigate("/dashboard/settings")}>Go to Settings</Button>
      </div>
    );
  }

  const previewUrl = `/p/${slug}`;
  const frameWidth = BREAKPOINT_WIDTHS[breakpoint];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between gap-4 px-1 pb-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <span className="text-sm text-muted-foreground font-mono">/p/{slug}</span>
        </div>

        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {(["desktop", "tablet", "mobile"] as Breakpoint[]).map((bp) => {
            const Icon = bp === "desktop" ? Monitor : bp === "tablet" ? Tablet : Smartphone;
            return (
              <button
                key={bp}
                onClick={() => setBreakpoint(bp)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  breakpoint === bp ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {bp.charAt(0).toUpperCase() + bp.slice(1)}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open(previewUrl, "_blank")}>
            <ExternalLink className="h-4 w-4 mr-1" />
            Open
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-muted/20 py-6 px-4">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4 items-start">
          <aside className="rounded-xl border bg-background/95 p-4 space-y-4 xl:sticky xl:top-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Live design controls</p>
              <h2 className="text-sm font-semibold">Quick presets & smart cleanup</h2>
              <p className="text-[11px] text-muted-foreground mt-1">Profile type detected: <span className="font-semibold text-foreground">{profileType.replaceAll("_", " ")}</span></p>
            </div>

            <div className="space-y-2">
              {QUICK_DESIGNS.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  disabled={applying}
                  onClick={() => applyDesign({ theme: preset.theme, layout_preset: preset.layout }, `${preset.label} applied to your profile.`, [`Theme → ${preset.theme}`, `Layout → ${preset.layout}`])}
                  className="w-full text-left rounded-lg border p-2.5 text-xs transition-colors hover:border-primary/50 hover:bg-accent disabled:opacity-60"
                >
                  <div className="font-medium text-foreground">{preset.label}</div>
                  <div className="text-muted-foreground">Theme: {preset.theme} • Layout: {preset.layout}</div>
                </button>
              ))}
            </div>

            <div className="rounded-lg border p-2.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <Target className="h-3.5 w-3.5 text-primary" />
                Goal Mode
              </div>
              {(["book_work", "find_rep", "build_authority"] as GoalMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setGoalMode(mode)}
                  className={`w-full rounded-md border px-2 py-1.5 text-left transition-colors ${goalMode === mode ? "border-primary bg-primary/10" : "border-border hover:bg-accent"}`}
                >
                  <p className="text-xs font-medium">{GOAL_MODE_LABELS[mode].title}</p>
                  <p className="text-[11px] text-muted-foreground">{GOAL_MODE_LABELS[mode].description}</p>
                </button>
              ))}
              <Button
                className="w-full"
                disabled={applying}
                onClick={() =>
                  applyDesign(
                    goalRecipe.payload,
                    `${GOAL_MODE_LABELS[goalMode].title} mode applied with smart defaults.`,
                    goalRecipe.changes,
                  )
                }
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Auto-Arrange Best Profile
              </Button>
            </div>

            {lastChanges.length > 0 && (
              <div className="rounded-lg border p-2.5">
                <p className="text-xs font-semibold mb-1">Last smart changes</p>
                <ul className="space-y-1 text-[11px] text-muted-foreground list-disc pl-4">
                  {lastChanges.map((change) => (
                    <li key={change}>{change}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          <div className="flex items-start justify-center rounded-2xl p-3 sm:p-5 bg-gradient-to-br from-background via-muted/20 to-background border">
            <div
              className="relative bg-white rounded-xl overflow-hidden shadow-2xl ring-1 ring-border transition-all duration-300"
              style={{ width: `${frameWidth}px`, minHeight: "600px" }}
            >
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/70 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200/90" />
                </div>
                <div className="flex-1 bg-background rounded-md px-3 py-0.5 text-xs text-muted-foreground font-mono">
                  creativeslate.com/p/{slug}
                </div>
              </div>
              <iframe
                key={refreshKey}
                src={previewUrl}
                className="w-full border-0"
                style={{ height: "calc(100vh - 14rem)", minHeight: "600px" }}
                title="Portfolio Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
