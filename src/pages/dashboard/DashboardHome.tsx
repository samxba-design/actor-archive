import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Eye, EyeOff, Globe, Inbox, GitBranch, User, FolderOpen, Settings,
  ArrowRight, ExternalLink, Camera, FileText, MessageSquare,
  Award, Link2, Sparkles, Image, Users, PenTool, Film, Mic2, BookOpen,
  Briefcase, Share2, Copy, Check, Layers, Palette, type LucideIcon
} from "lucide-react";
import ProfileReadiness from "@/components/dashboard/ProfileReadiness";
import { PROFILE_TYPES } from "@/config/profileSections";
import { ResumeImporter } from "@/components/dashboard/ResumeImporter";
import { URLImporter } from "@/components/dashboard/URLImporter";
import { BulkImporter } from "@/components/dashboard/BulkImporter";

interface SmartAction {
  label: string;
  description: string;
  icon: LucideIcon;
  route: string;
}

// Type-specific smart action definitions
const TYPE_ACTIONS: Record<string, SmartAction[]> = {
  actor: [
    { label: "Upload demo reel", description: "Casting directors want to see you in action", icon: Film, route: "/dashboard/projects" },
    { label: "List your agent or manager", description: "Let producers know who to contact", icon: Users, route: "/dashboard/representation" },
    { label: "Add headshots to gallery", description: "Headshots are your #1 asset as an actor", icon: Image, route: "/dashboard/gallery" },
  ],
  screenwriter: [
    { label: "Add loglines to your scripts", description: "A strong logline is your calling card", icon: FileText, route: "/dashboard/scripts" },
    { label: "Run the coverage simulator", description: "Get AI feedback on your screenplay", icon: Sparkles, route: "/dashboard/coverage" },
  ],
  tv_writer: [
    { label: "Add your spec or pilot", description: "Showcase your original voice", icon: FileText, route: "/dashboard/scripts" },
    { label: "Find comp titles", description: "Position your work with comparable shows", icon: Sparkles, route: "/dashboard/comps" },
  ],
  playwright: [
    { label: "Add production history", description: "Document where your plays have been staged", icon: FileText, route: "/dashboard/projects" },
  ],
  author: [
    { label: "Add your first book", description: "Import from Google Books or add manually", icon: BookOpen, route: "/dashboard/projects" },
  ],
  journalist: [
    { label: "Add published articles", description: "Showcase your body of published work", icon: FileText, route: "/dashboard/projects" },
  ],
  copywriter: [
    { label: "Create a case study", description: "Show the results of your best campaigns", icon: PenTool, route: "/dashboard/case-study" },
    { label: "Add your top clients", description: "Showcase the brands you've worked with", icon: Users, route: "/dashboard/clients" },
    { label: "Upload a writing sample", description: "Headlines, emails, landing pages, speeches", icon: FileText, route: "/dashboard/projects" },
    { label: "List your specializations", description: "Content strategy, crisis comms, paid ads…", icon: Sparkles, route: "/dashboard/skills" },
    { label: "List your services & pricing", description: "Help clients understand what you offer", icon: Briefcase, route: "/dashboard/services" },
  ],
  corporate_video: [
    { label: "Create a case study", description: "Showcase your best client work with metrics", icon: PenTool, route: "/dashboard/case-study" },
    { label: "Add your showreel", description: "Upload or link your demo reel", icon: Film, route: "/dashboard/projects" },
  ],
  director_producer: [
    { label: "Import credits from TMDB", description: "Auto-fill your filmography with posters", icon: Film, route: "/dashboard/projects" },
    { label: "Add your showreel", description: "Showcase your directing work", icon: Film, route: "/dashboard/projects" },
  ],
};

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
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
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [publishAction, setPublishAction] = useState<"publish" | "unpublish">("publish");
  const [copied, setCopied] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [urlOpen, setUrlOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [howItWorksDismissed, setHowItWorksDismissed] = useState(() => localStorage.getItem("hiw_dismissed") === "true");

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
    return (
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  const totalPipeline = Object.values(pipelineCounts).reduce((a, b) => a + b, 0);
  const profileType = profile?.profile_type as string | null;
  const profileTypeLabel = PROFILE_TYPES.find(pt => pt.key === profileType)?.label;

  // Build smart actions based on missing data + profile type
  const smartActions: SmartAction[] = [];
  if (!profile?.profile_photo_url) {
    smartActions.push({ label: "Upload your headshot", description: "A professional photo builds instant trust", icon: Camera, route: "/dashboard/profile" });
  }
  if (!profile?.bio) {
    smartActions.push({ label: "Write your bio", description: "Tell visitors about your experience and background", icon: FileText, route: "/dashboard/profile" });
  }
  if (projectCount === 0) {
    smartActions.push({ label: "Add your first project", description: "Projects are the core of your portfolio", icon: FolderOpen, route: "/dashboard/projects" });
  }

  // Add type-specific actions
  if (profileType && TYPE_ACTIONS[profileType]) {
    for (const action of TYPE_ACTIONS[profileType]) {
      if (smartActions.length < 6 && !smartActions.some(a => a.route === action.route)) {
        smartActions.push(action);
      }
    }
  }

  // Generic fallback actions
  if (testimonialCount === 0 && smartActions.length < 6) {
    smartActions.push({ label: "Add a testimonial", description: "Social proof drives hiring decisions", icon: MessageSquare, route: "/dashboard/testimonials" });
  }
  if (socialCount === 0 && smartActions.length < 6) {
    smartActions.push({ label: "Connect social links", description: "Link your IMDb, LinkedIn, or social profiles", icon: Link2, route: "/dashboard/social" });
  }
  if (awardCount === 0 && smartActions.length < 6) {
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

  // Profile-type-aware quick actions
  const quickActions = [
    { label: "Edit Profile", icon: User, route: "/dashboard/profile" },
    ...(profileType === "actor"
      ? [{ label: "Manage Gallery", icon: Image, route: "/dashboard/gallery" }]
      : [{ label: "Manage Projects", icon: FolderOpen, route: "/dashboard/projects" }]
    ),
    { label: "Settings", icon: Settings, route: "/dashboard/settings" },
  ];

  const handlePublishToggle = () => {
    setPublishAction(profile?.is_published ? "unpublish" : "publish");
    setShowPublishConfirm(true);
  };

  const confirmPublishToggle = async () => {
    const newState = publishAction === "publish";
    await supabase.from("profiles").update({ is_published: newState }).eq("id", user!.id);
    setProfile((p: any) => ({ ...p, is_published: newState }));
    setShowPublishConfirm(false);
    toast({ title: newState ? "Portfolio published!" : "Portfolio unpublished" });
  };

  const handleCopyLink = async () => {
    if (profile?.slug) {
      await navigator.clipboard.writeText(`${window.location.origin}/p/${profile.slug}`);
      setCopied(true);
      toast({ title: "Link copied!" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">Here's how your portfolio is performing</p>
            {profileTypeLabel && (
              <Badge variant="secondary" className="text-[10px] cursor-pointer hover:bg-accent" onClick={() => navigate("/dashboard/settings")}>
                {profileTypeLabel}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {profile?.slug && profile?.is_published && (
            <Button variant="ghost" size="sm" onClick={handleCopyLink}>
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? "Copied!" : "Share Link"}
            </Button>
          )}
          {profile?.slug && (
            <Button
              variant={profile?.is_published ? "outline" : "default"}
              size="sm"
              onClick={handlePublishToggle}
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
            className="cursor-pointer rounded-xl border border-border p-5 flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] group bg-card/60">
            <s.icon className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover:scale-110 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Readiness */}
      <ProfileReadiness />

      {/* Smart Next Steps */}
      <div className="rounded-xl border border-border p-6 bg-card/60">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
          <Sparkles className="h-5 w-5 text-primary" />
          Next Steps
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {smartActions.slice(0, 4).map((action, i) => (
            <button
              key={i}
              onClick={() => {
                if (action.route === "#publish") {
                  handlePublishToggle();
                } else if (action.route.startsWith("/p/")) {
                  window.open(action.route, "_blank");
                } else {
                  navigate(action.route);
                }
              }}
              className="text-left p-4 rounded-lg border border-border transition-all duration-300 hover:border-primary/30 hover:bg-accent/50 hover:scale-[1.01] active:scale-[0.99] group flex items-start gap-3"
            >
              <action.icon className="h-5 w-5 shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:underline transition-all">{action.label}</p>
                <p className="text-xs mt-0.5 text-muted-foreground">{action.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 mt-0.5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-border p-6 bg-card/60">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((qa, i) => (
            <Button key={i} variant="outline" className="justify-start" onClick={() => navigate(qa.route)}>
              <qa.icon className="mr-2 h-4 w-4" />{qa.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Smart Import Tools */}
      <div className="rounded-xl border border-border p-6 bg-card/60">
        <h2 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Smart Import
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Auto-fill your profile from existing sources</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button variant="outline" className="justify-start" onClick={() => setResumeOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />Import from Resume
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => setUrlOpen(true)}>
            <Share2 className="mr-2 h-4 w-4" />Import from URL
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => setBulkOpen(true)}>
            <Briefcase className="mr-2 h-4 w-4" />Bulk Import (CSV/JSON)
          </Button>
        </div>
      </div>

      <ResumeImporter open={resumeOpen} onOpenChange={setResumeOpen} profileType={profileType || undefined} onComplete={() => window.location.reload()} />
      <URLImporter open={urlOpen} onOpenChange={setUrlOpen} profileType={profileType || undefined} onComplete={() => window.location.reload()} />
      <BulkImporter open={bulkOpen} onOpenChange={setBulkOpen} onComplete={() => window.location.reload()} />

      {/* Publish/Unpublish confirmation */}
      <AlertDialog open={showPublishConfirm} onOpenChange={setShowPublishConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {publishAction === "unpublish" ? "Unpublish your portfolio?" : "Publish your portfolio?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {publishAction === "unpublish"
                ? "Your portfolio will no longer be visible to the public. You can republish at any time."
                : "Your portfolio will be visible to anyone with the link. Make sure you're happy with how it looks!"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPublishToggle}>
              {publishAction === "unpublish" ? "Unpublish" : "Publish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardHome;
