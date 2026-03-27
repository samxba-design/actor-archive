import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Monitor, Tablet, Smartphone, ExternalLink, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Breakpoint = "desktop" | "tablet" | "mobile";

const BREAKPOINT_WIDTHS: Record<Breakpoint, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

const DashboardPreview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("slug")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setSlug(data?.slug || null);
        setLoading(false);
      });
  }, [user]);

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
      {/* Toolbar */}
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
          <Button variant="ghost" size="sm" onClick={() => setRefreshKey(k => k + 1)}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open(previewUrl, "_blank")}>
            <ExternalLink className="h-4 w-4 mr-1" />
            Open
          </Button>
        </div>
      </div>

      {/* Preview frame */}
      <div className="flex-1 overflow-auto bg-muted/30 flex items-start justify-center py-6">
        <div
          className="relative bg-white rounded-xl overflow-hidden shadow-2xl ring-1 ring-border transition-all duration-300"
          style={{ width: `${frameWidth}px`, minHeight: "600px" }}
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-3 py-2 bg-muted/80 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
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
  );
};

export default DashboardPreview;
