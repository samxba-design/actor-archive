import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, Circle, AlertCircle, TrendingUp, ArrowRight } from "lucide-react";

interface CheckItem {
  label: string;
  done: boolean;
  priority: "high" | "medium" | "low";
  tip: string;
  weight: number;
  route: string;
  previewHint: string;
}

const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

function applyGoalWeights(items: CheckItem[], goal: string | null) {
  if (!goal) return items;
  const boosts: Record<string, string[]> = {
    representation: ["Representation listed", "Demo reel uploaded", "Projects have loglines", "Awards or fellowships"],
    hiring: ["Services listed", "Client testimonials", "Case study added", "Portfolio published"],
    pitching: ["Projects have loglines", "At least one project", "Awards or fellowships", "Demo reel uploaded"],
    presence: ["Profile photo uploaded", "Bio written", "Banner image uploaded", "Social links added"],
  };
  const goalKey = goal.toLowerCase().includes("represent") ? "representation"
    : goal.toLowerCase().includes("hir") ? "hiring"
    : goal.toLowerCase().includes("pitch") ? "pitching" : "presence";
  const boosted = boosts[goalKey] || [];
  return items.map(item => {
    if (boosted.includes(item.label) && item.priority !== "high") {
      return { ...item, priority: "high" as const, weight: PRIORITY_WEIGHT.high };
    }
    return item;
  });
}

function CircularProgress({ score, size = 72, strokeWidth = 6 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "hsl(142 71% 45%)" : score >= 50 ? "hsl(48 96% 53%)" : "hsl(0 84% 60%)";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-foreground">{score}%</span>
      </div>
    </div>
  );
}

const ProfileReadiness = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checks, setChecks] = useState<CheckItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!user) return;
    const evaluate = async () => {
      const [profileRes, projectsRes, awardsRes, pressRes, testimonialsRes, servicesRes, skillsRes, galleryRes, socialRes, repRes, educationRes, publishedRes, prodHistRes, actorStatsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("projects").select("id, project_type, logline, video_url, poster_url").eq("profile_id", user.id),
        supabase.from("awards").select("id").eq("profile_id", user.id),
        supabase.from("press").select("id").eq("profile_id", user.id),
        supabase.from("testimonials").select("id").eq("profile_id", user.id),
        supabase.from("services").select("id").eq("profile_id", user.id),
        supabase.from("skills").select("id").eq("profile_id", user.id),
        supabase.from("gallery_images").select("id").eq("profile_id", user.id),
        supabase.from("social_links").select("id").eq("profile_id", user.id),
        supabase.from("representation").select("id").eq("profile_id", user.id),
        supabase.from("education").select("id").eq("profile_id", user.id),
        supabase.from("published_works").select("id").eq("profile_id", user.id),
        supabase.from("production_history").select("id").eq("profile_id", user.id),
        supabase.from("actor_stats").select("id").eq("profile_id", user.id),
      ]);

      const profile = profileRes.data;
      if (!profile) { setLoading(false); return; }

      const projects = projectsRes.data || [];
      const awards = awardsRes.data || [];
      const press = pressRes.data || [];
      const testimonials = testimonialsRes.data || [];
      const services = servicesRes.data || [];
      const skills = skillsRes.data || [];
      const gallery = galleryRes.data || [];
      const socials = socialRes.data || [];
      const reps = repRes.data || [];
      const education = educationRes.data || [];
      const publishedWorks = publishedRes.data || [];
      const prodHistory = prodHistRes.data || [];
      const actorStats = actorStatsRes.data || [];

      const profileType = profile.profile_type || "screenwriter";
      const primaryGoal = profile.primary_goal || null;
      let items: CheckItem[] = [];

      const item = (label: string, done: boolean, priority: "high" | "medium" | "low", tip: string, route: string, previewHint: string): CheckItem => ({
        label, done, priority, tip, weight: PRIORITY_WEIGHT[priority], route, previewHint,
      });

      // Universal checks
      items.push(item("Profile photo uploaded", !!profile.profile_photo_url, "high", "+15% — A professional photo builds instant trust.", "/dashboard/profile", "Appears as your avatar in the hero section"));
      items.push(item("Display name set", !!profile.display_name, "high", "+10% — Your name is the first thing visitors see.", "/dashboard/profile", "Large heading in your hero section"));
      items.push(item("Headline added", !!(profile as any).headline, "high", "+10% — A strong headline tells visitors who you are.", "/dashboard/profile", "Subtitle text below your name"));
      items.push(item("Bio written", !!profile.bio && profile.bio.length > 50, "high", "+15% — A detailed bio gives credibility.", "/dashboard/profile", "Appears in the About / Bio section"));
      items.push(item("Tagline set", !!profile.tagline, "medium", "+5% — Appears under your name on the portfolio.", "/dashboard/profile", "Short text under your name in the hero"));
      items.push(item("Location added", !!profile.location, "low", "+3% — Helps contacts know your market.", "/dashboard/profile", "Shown as a badge in your hero section"));
      items.push(item("At least one project", projects.length > 0, "high", "+15% — Projects are the core of your portfolio.", "/dashboard/projects", "Displayed as cards in your Projects section"));
      items.push(item("Social links added", socials.length > 0, "medium", "+5% — Link your IMDb, LinkedIn, or social profiles.", "/dashboard/social", "Icon row in your hero or footer"));
      items.push(item("Profile published", !!profile.is_published, "high", "+10% — Not visible until published.", "/dashboard/settings", "Makes your portfolio live at your URL"));

      // Type-specific checks
      if (["screenwriter", "tv_writer", "playwright"].includes(profileType)) {
        const withLoglines = projects.filter((p) => p.logline);
        items.push(item("Projects have loglines", withLoglines.length >= Math.min(projects.length, 2), "high", "+10% — Every script should have a polished logline.", "/dashboard/projects", "Loglines appear as taglines on project cards"));
        items.push(item("Representation listed", reps.length > 0, "medium", "+5% — Showing your agent signals credibility.", "/dashboard/representation", "Agent/manager info in the Representation section"));
        items.push(item("Awards or fellowships", awards.length > 0, "medium", "+5% — Contest wins validate your writing.", "/dashboard/awards", "Displayed as laurel badges in the Awards section"));
      }

      if (profileType === "actor") {
        items.push(item("Headshot gallery (3+)", gallery.length >= 3, "high", "+10% — Casting directors need multiple looks.", "/dashboard/gallery", "Grid of photos in the Gallery section"));
        items.push(item("Demo reel uploaded", projects.some((p) => p.video_url), "high", "+15% — Essential for casting.", "/dashboard/projects", "Plays as an embedded video on your portfolio"));
        items.push(item("Training & education", education.length > 0, "medium", "+5% — Show your training background.", "/dashboard/education", "Listed in the Education & Training section"));
        items.push(item("Representation listed", reps.length > 0, "high", "+10% — Agents and managers should be listed.", "/dashboard/representation", "Contact cards in the Representation section"));
        items.push(item("Special skills listed", skills.length >= 3, "medium", "+5% — Languages, combat, instruments, etc.", "/dashboard/skills", "Skill tags in the Skills section"));
        items.push(item("Actor stats filled", actorStats.length > 0, "medium", "+5% — Height, age range, union status, etc.", "/dashboard/profile", "Stats bar shown in hero or body section"));
      }

      if (profileType === "director_producer") {
        items.push(item("Showreel uploaded", projects.some((p) => p.video_url), "high", "+15% — Visual work speaks louder.", "/dashboard/projects", "Embedded video player on your portfolio"));
        items.push(item("Production stills", gallery.length >= 2, "medium", "+5% — BTS photos show your process.", "/dashboard/gallery", "Photo grid in the Gallery section"));
        items.push(item("Awards listed", awards.length > 0, "medium", "+5% — Festival laurels build credibility.", "/dashboard/awards", "Laurel badges in the Awards section"));
        items.push(item("Production history", prodHistory.length > 0, "medium", "+5% — Document where your work has been staged.", "/dashboard/projects", "Timeline in the Production History section"));
      }

      if (["copywriter", "corporate_video"].includes(profileType)) {
        items.push(item("Case study added", projects.some((p) => p.project_type === "case_study"), "high", "+15% — Case studies with metrics convert clients.", "/dashboard/case-study", "Rich cards in the Case Studies section"));
        items.push(item("Services listed", services.length > 0, "high", "+10% — Clients need to know what you offer.", "/dashboard/services", "Service cards with pricing in the Services section"));
        items.push(item("Client testimonials", testimonials.length > 0, "high", "+10% — Social proof drives hiring decisions.", "/dashboard/testimonials", "Quote cards in the Testimonials section"));
      }

      if (["author", "journalist"].includes(profileType)) {
        items.push(item("Published works added", publishedWorks.length >= 1, "high", "+10% — Show your body of work.", "/dashboard/published-work", "Article/book cards in the Published Work section"));
        items.push(item("Press or reviews", press.length > 0, "medium", "+5% — Critical reception adds authority.", "/dashboard/press", "Review cards in the Press section"));
      }

      // General nice-to-haves
      items.push(item("Banner image uploaded", !!profile.banner_url, "low", "+3% — Makes your portfolio feel polished.", "/dashboard/profile", "Full-width background behind your hero"));
      items.push(item("Testimonials added", testimonials.length > 0, "medium", "+5% — What others say about you matters.", "/dashboard/testimonials", "Quote cards in the Testimonials section"));

      items = applyGoalWeights(items, primaryGoal);

      const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
      const doneWeight = items.filter((i) => i.done).reduce((sum, i) => sum + i.weight, 0);
      setScore(Math.round((doneWeight / totalWeight) * 100));
      setChecks(items);
      setLoading(false);
    };
    evaluate();
  }, [user]);

  if (loading) return null;

  const incomplete = checks.filter((c) => !c.done).sort((a, b) => {
    const p = { high: 0, medium: 1, low: 2 };
    return p[a.priority] - p[b.priority];
  });
  const complete = checks.filter((c) => c.done);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          <CircularProgress score={score} />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Profile Readiness
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {score >= 90 ? "Your portfolio is looking great!" :
               score >= 70 ? "Almost there — a few more steps to stand out." :
               score >= 40 ? "Good start — keep adding content to boost your profile." :
               "Let's get your portfolio off the ground."}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 max-h-[400px] overflow-y-auto">
        <TooltipProvider delayDuration={300}>
          {incomplete.length > 0 && (
            <div className="space-y-1 mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">To Do</p>
              {incomplete.map((item) => (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate(item.route)}
                      className="w-full flex items-start gap-2 py-2 px-2 rounded-md text-left transition-all duration-200 hover:bg-accent/50 group cursor-pointer"
                    >
                      {item.priority === "high" ? (
                        <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.tip}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[200px]">
                    <p className="text-xs">{item.previewHint}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}
          {complete.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Done</p>
              {complete.map((item) => (
                <div key={item.label} className="flex items-center gap-2 py-1 px-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  <p className="text-sm text-muted-foreground line-through">{item.label}</p>
                </div>
              ))}
            </div>
          )}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default ProfileReadiness;
