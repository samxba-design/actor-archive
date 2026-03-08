import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Loader2, Eye, EyeOff, Globe, Inbox, GitBranch, User, FolderOpen, Settings,
  ArrowRight, ExternalLink, CheckCircle2, AlertCircle
} from "lucide-react";

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [recentViews, setRecentViews] = useState(0);
  const [unreadInbox, setUnreadInbox] = useState(0);
  const [pipelineCounts, setPipelineCounts] = useState<Record<string, number>>({});
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [profileRes, viewsRes, inboxRes, pipelineRes, projectsRes] = await Promise.all([
        supabase.from("profiles").select("display_name, slug, is_published, profile_type, profile_photo_url, onboarding_completed, bio, tagline").eq("id", user.id).single(),
        supabase.from("page_views").select("id", { count: "exact", head: true }).eq("profile_id", user.id).gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("profile_id", user.id).eq("is_read", false),
        supabase.from("pipeline_submissions").select("status").eq("profile_id", user.id),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
      ]);

      setProfile(profileRes.data);
      setRecentViews(viewsRes.count || 0);
      setUnreadInbox(inboxRes.count || 0);
      setProjectCount(projectsRes.count || 0);

      const counts: Record<string, number> = {};
      (pipelineRes.data || []).forEach((s) => { counts[s.status] = (counts[s.status] || 0) + 1; });
      setPipelineCounts(counts);

      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  // Profile readiness score
  const checks = [
    { label: "Profile photo", done: !!profile?.profile_photo_url },
    { label: "Bio", done: !!profile?.bio },
    { label: "Tagline", done: !!profile?.tagline },
    { label: "At least 1 project", done: projectCount > 0 },
    { label: "Published", done: !!profile?.is_published },
  ];
  const readinessScore = Math.round((checks.filter(c => c.done).length / checks.length) * 100);

  const totalPipeline = Object.values(pipelineCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-4xl space-y-6" style={{ color: "hsl(var(--landing-fg))" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "hsl(var(--landing-fg))" }}>
            Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""}
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--landing-muted))" }}>Here's how your portfolio is performing</p>
        </div>
        <div className="flex items-center gap-2">
          {profile?.slug && (
            <Button
              variant={profile?.is_published ? "outline" : "default"}
              size="sm"
              onClick={async () => {
                const newState = !profile?.is_published;
                await supabase.from("profiles").update({ is_published: newState }).eq("id", user!.id);
                setProfile((p: any) => ({ ...p, is_published: newState }));
              }}
            >
              {profile?.is_published ? (
                <><EyeOff className="mr-2 h-4 w-4" />Unpublish</>
              ) : (
                <><Globe className="mr-2 h-4 w-4" />Publish Portfolio</>
              )}
            </Button>
          )}
          {profile?.slug && profile?.is_published && (
            <Button variant="outline" size="sm" onClick={() => window.open(`/p/${profile.slug}`, "_blank")}>
              <ExternalLink className="mr-2 h-4 w-4" />View
            </Button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { icon: Eye, value: recentViews, label: "Views (30d)", route: "/dashboard/analytics" },
          { icon: Inbox, value: unreadInbox, label: "Unread messages", route: "/dashboard/inbox" },
          { icon: FolderOpen, value: projectCount, label: "Projects", route: "/dashboard/projects" },
          { icon: GitBranch, value: totalPipeline, label: "In pipeline", route: "/dashboard/pipeline" },
        ].map((s, i) => (
          <div key={i} onClick={() => navigate(s.route)}
            className="cursor-pointer rounded-xl border p-5 flex items-center gap-3 transition-all hover:border-opacity-80"
            style={{ background: "hsl(var(--landing-card) / 0.6)", borderColor: "hsl(var(--landing-border))" }}>
            <s.icon className="h-8 w-8 shrink-0" style={{ color: "hsl(var(--landing-champagne))" }} />
            <div>
              <p className="text-2xl font-bold" style={{ color: "hsl(var(--landing-fg))" }}>{s.value}</p>
              <p className="text-xs" style={{ color: "hsl(var(--landing-muted))" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Profile readiness */}
      <div className="rounded-xl border p-6" style={{ background: "hsl(var(--landing-card) / 0.6)", borderColor: "hsl(var(--landing-border))" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>Profile Readiness</h2>
          <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{ background: readinessScore === 100 ? "hsl(140 40% 45% / 0.2)" : "hsl(var(--landing-card))", color: readinessScore === 100 ? "hsl(140 50% 65%)" : "hsl(var(--landing-muted))" }}>{readinessScore}%</span>
        </div>
        <div className="w-full rounded-full h-2 mb-4" style={{ background: "hsl(var(--landing-border))" }}>
          <div className="h-2 rounded-full transition-all" style={{ width: `${readinessScore}%`, background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center gap-2 text-sm">
              {c.done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "hsl(140 50% 55%)" }} />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" style={{ color: "hsl(var(--landing-muted))" }} />
              )}
              <span style={{ color: c.done ? "hsl(var(--landing-fg))" : "hsl(var(--landing-muted))" }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border p-6" style={{ background: "hsl(var(--landing-card) / 0.6)", borderColor: "hsl(var(--landing-border))" }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "hsl(var(--landing-fg))" }}>Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button variant="outline" className="justify-start" onClick={() => navigate("/dashboard/profile")} style={{ borderColor: "hsl(var(--landing-border))", color: "hsl(var(--landing-fg))", background: "transparent" }}>
            <User className="mr-2 h-4 w-4" />Edit Profile
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => navigate("/dashboard/projects")} style={{ borderColor: "hsl(var(--landing-border))", color: "hsl(var(--landing-fg))", background: "transparent" }}>
            <FolderOpen className="mr-2 h-4 w-4" />Manage Projects
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => navigate("/dashboard/settings")} style={{ borderColor: "hsl(var(--landing-border))", color: "hsl(var(--landing-fg))", background: "transparent" }}>
            <Settings className="mr-2 h-4 w-4" />Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
