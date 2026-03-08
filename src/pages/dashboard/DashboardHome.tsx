import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Loader2, Eye, Inbox, GitBranch, User, FolderOpen, Settings,
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
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Here's how your portfolio is performing</p>
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
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate("/dashboard/analytics")}>
          <CardContent className="pt-6 flex items-center gap-3">
            <Eye className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold text-foreground">{recentViews}</p>
              <p className="text-xs text-muted-foreground">Views (30d)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate("/dashboard/inbox")}>
          <CardContent className="pt-6 flex items-center gap-3">
            <Inbox className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold text-foreground">{unreadInbox}</p>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate("/dashboard/projects")}>
          <CardContent className="pt-6 flex items-center gap-3">
            <FolderOpen className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold text-foreground">{projectCount}</p>
              <p className="text-xs text-muted-foreground">Projects</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate("/dashboard/pipeline")}>
          <CardContent className="pt-6 flex items-center gap-3">
            <GitBranch className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold text-foreground">{totalPipeline}</p>
              <p className="text-xs text-muted-foreground">In pipeline</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile readiness */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Profile Readiness</CardTitle>
            <Badge variant={readinessScore === 100 ? "default" : "secondary"}>{readinessScore}%</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${readinessScore}%` }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {checks.map((c) => (
              <div key={c.label} className="flex items-center gap-2 text-sm">
                {c.done ? (
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span className={c.done ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start" onClick={() => navigate("/dashboard/profile")}>
              <User className="mr-2 h-4 w-4" />Edit Profile
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate("/dashboard/projects")}>
              <FolderOpen className="mr-2 h-4 w-4" />Manage Projects
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate("/dashboard/settings")}>
              <Settings className="mr-2 h-4 w-4" />Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
