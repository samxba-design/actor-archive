import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Loader2, Eye, EyeOff, Globe, Inbox, GitBranch, User, FolderOpen, Settings,
  ArrowRight, ExternalLink, CheckCircle2, AlertCircle, Camera, FileText, MessageSquare,
  Award, Link2, Sparkles, type LucideIcon
} from "lucide-react";
import ProfileReadiness from "@/components/dashboard/ProfileReadiness";

interface SmartAction {
  label: string;
  description: string;
  icon: LucideIcon;
  route: string;
}

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [recentViews, setRecentViews] = useState(0);
  const [unreadInbox, setUnreadInbox] = useState(0);
  const [pipelineCounts, setPipelineCounts] = useState<Record<string, number>>({});
  const [projectCount, setProjectCount] = useState(0);
  const [testimonialCount, setTestimonialCount] = useState(0);
  const [socialCount, setSocialCount] = useState(0);
  const [awardCount, setAwardCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [profileRes, viewsRes, inboxRes, pipelineRes, projectsRes, testimonialsRes, socialsRes, awardsRes, galleryRes] = await Promise.all([
        supabase.from("profiles").select("display_name, slug, is_published, profile_type, profile_photo_url, onboarding_completed, bio, tagline").eq("id", user.id).single(),
        supabase.from("page_views").select("id", { count: "exact", head: true }).eq("profile_id", user.id).gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("profile_id", user.id).eq("is_read", false),
        supabase.from("pipeline_submissions").select("status").eq("profile_id", user.id),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
        supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
        supabase.from("social_links").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
        supabase.from("awards").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
        supabase.from("gallery_images").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
      ]);

      setProfile(profileRes.data);
      setRecentViews(viewsRes.count || 0);
      setUnreadInbox(inboxRes.count || 0);
      setProjectCount(projectsRes.count || 0);
      setTestimonialCount(testimonialsRes.count || 0);
      setSocialCount(socialsRes.count || 0);
      setAwardCount(awardsRes.count || 0);
      setGalleryCount(galleryRes.count || 0);

      const counts: Record<string, number> = {};
      (pipelineRes.data || []).forEach((s) => { counts[s.status] = (counts[s.status] || 0) + 1; });
      setPipelineCounts(counts);

      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8" style={{ color: "hsl(var(--landing-muted))" }} /></div>;
  }

  const totalPipeline = Object.values(pipelineCounts).reduce((a, b) => a + b, 0);

  // Build smart actions based on missing data
  const smartActions: SmartAction[] = [];
  if (!profile?.profile_photo_url) {
    smartActions.push({ label: "Upload your headshot", description: "A professional photo builds instant trust", icon: Camera, route: "/dashboard/gallery" });
  }
  if (!profile?.bio) {
    smartActions.push({ label: "Write your bio", description: "Tell visitors about your experience and background", icon: FileText, route: "/dashboard/profile" });
  }
  if (projectCount === 0) {
    smartActions.push({ label: "Add your first project", description: "Projects are the core of your portfolio", icon: FolderOpen, route: "/dashboard/projects" });
  }
  if (testimonialCount === 0) {
    smartActions.push({ label: "Add a testimonial", description: "Social proof drives hiring decisions", icon: MessageSquare, route: "/dashboard/testimonials" });
  }
  if (socialCount === 0) {
    smartActions.push({ label: "Connect social links", description: "Link your IMDb, LinkedIn, or social profiles", icon: Link2, route: "/dashboard/social-links" });
  }
  if (awardCount === 0) {
    smartActions.push({ label: "Add awards or fellowships", description: "Festival laurels and wins build credibility", icon: Award, route: "/dashboard/awards" });
  }
  if (!profile?.is_published && profile?.slug) {
    smartActions.push({ label: "Publish your portfolio", description: "Make your portfolio visible to the world", icon: Globe, route: "#publish" });
  }

  // If all smart actions are done, show power-user actions
  if (smartActions.length === 0) {
    smartActions.push(
      { label: "View your portfolio", description: "See how visitors experience your page", icon: ExternalLink, route: `/p/${profile?.slug}` },
      { label: "Check analytics", description: "See who's viewing your portfolio", icon: Eye, route: "/dashboard/analytics" },
    );
  }

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

      {/* Profile Readiness — consolidated from ProfileReadiness component */}
      <ProfileReadiness />

      {/* Smart Next Steps */}
      <div className="rounded-xl border p-6" style={{ background: "hsl(var(--landing-card) / 0.6)", borderColor: "hsl(var(--landing-border))" }}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "hsl(var(--landing-fg))" }}>
          <Sparkles className="h-5 w-5" style={{ color: "hsl(var(--landing-champagne))" }} />
          Next Steps
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {smartActions.slice(0, 4).map((action, i) => (
            <button
              key={i}
              onClick={() => {
                if (action.route === "#publish") {
                  // Trigger publish
                  supabase.from("profiles").update({ is_published: true }).eq("id", user!.id).then(() => {
                    setProfile((p: any) => ({ ...p, is_published: true }));
                  });
                } else if (action.route.startsWith("/p/")) {
                  window.open(action.route, "_blank");
                } else {
                  navigate(action.route);
                }
              }}
              className="text-left p-4 rounded-lg border transition-all hover:border-opacity-80 group flex items-start gap-3"
              style={{ borderColor: "hsl(var(--landing-border))", background: "transparent" }}
            >
              <action.icon className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "hsl(var(--landing-champagne))" }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium group-hover:underline" style={{ color: "hsl(var(--landing-fg))" }}>{action.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "hsl(var(--landing-muted))" }}>{action.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" style={{ color: "hsl(var(--landing-muted))" }} />
            </button>
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
