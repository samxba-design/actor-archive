import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, AlertCircle, TrendingUp } from "lucide-react";
import { getProfileTypeConfig } from "@/config/profileSections";

interface CheckItem {
  label: string;
  done: boolean;
  priority: "high" | "medium" | "low";
  tip: string;
}

const ProfileReadiness = () => {
  const { user } = useAuth();
  const [checks, setChecks] = useState<CheckItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!user) return;
    const evaluate = async () => {
      // Fetch all relevant data in parallel
      const [profileRes, projectsRes, awardsRes, pressRes, testimonialsRes, servicesRes, skillsRes, galleryRes, socialRes, repRes, educationRes] = await Promise.all([
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

      const profileType = profile.profile_type || "screenwriter";
      const items: CheckItem[] = [];

      // Universal checks
      items.push({ label: "Profile photo uploaded", done: !!profile.profile_photo_url, priority: "high", tip: "A professional photo builds instant trust." });
      items.push({ label: "Display name set", done: !!profile.display_name, priority: "high", tip: "Your name is the first thing visitors see." });
      items.push({ label: "Headline added", done: !!(profile as any).headline, priority: "high", tip: "A strong headline tells visitors who you are in one line." });
      items.push({ label: "Bio written", done: !!profile.bio && profile.bio.length > 50, priority: "high", tip: "A detailed bio (100+ words) gives credibility." });
      items.push({ label: "Tagline set", done: !!profile.tagline, priority: "medium", tip: "A tagline appears under your name on the portfolio." });
      items.push({ label: "Location added", done: !!profile.location, priority: "low", tip: "Helps industry contacts know your market." });
      items.push({ label: "At least one project", done: projects.length > 0, priority: "high", tip: "Projects are the core of your portfolio." });
      items.push({ label: "Social links added", done: socials.length > 0, priority: "medium", tip: "Link your IMDb, LinkedIn, or social profiles." });
      items.push({ label: "Profile published", done: !!profile.is_published, priority: "high", tip: "Your portfolio isn't visible until published." });

      // Type-specific checks
      if (["screenwriter", "tv_writer", "playwright"].includes(profileType)) {
        const withLoglines = projects.filter((p) => p.logline);
        items.push({ label: "Projects have loglines", done: withLoglines.length >= Math.min(projects.length, 2), priority: "high", tip: "Every script should have a polished logline." });
        items.push({ label: "Representation listed", done: reps.length > 0, priority: "medium", tip: "If repped, showing your agent signals credibility." });
        items.push({ label: "Awards or fellowships", done: awards.length > 0, priority: "medium", tip: "Contest wins and fellowships validate your writing." });
      }

      if (profileType === "actor") {
        items.push({ label: "Headshot gallery (3+)", done: gallery.length >= 3, priority: "high", tip: "Casting directors need multiple looks." });
        items.push({ label: "Demo reel uploaded", done: projects.some((p) => p.video_url), priority: "high", tip: "A reel is essential for casting." });
        items.push({ label: "Training & education", done: education.length > 0, priority: "medium", tip: "Show your training background." });
        items.push({ label: "Representation listed", done: reps.length > 0, priority: "high", tip: "Agents and managers should be listed." });
        items.push({ label: "Special skills listed", done: skills.length >= 3, priority: "medium", tip: "List combat, languages, instruments, etc." });
      }

      if (profileType === "director_producer") {
        items.push({ label: "Showreel uploaded", done: projects.some((p) => p.video_url), priority: "high", tip: "Visual work speaks louder than words." });
        items.push({ label: "Production stills", done: gallery.length >= 2, priority: "medium", tip: "Behind-the-scenes photos show your process." });
        items.push({ label: "Awards listed", done: awards.length > 0, priority: "medium", tip: "Festival laurels build credibility fast." });
      }

      if (["copywriter", "corporate_video"].includes(profileType)) {
        items.push({ label: "Case study added", done: projects.some((p) => p.project_type === "case_study"), priority: "high", tip: "Case studies with metrics convert clients." });
        items.push({ label: "Services listed", done: services.length > 0, priority: "high", tip: "Clients need to know what you offer and at what price." });
        items.push({ label: "Client testimonials", done: testimonials.length > 0, priority: "high", tip: "Social proof drives hiring decisions." });
      }

      if (["author", "journalist"].includes(profileType)) {
        items.push({ label: "Published works added", done: projects.length >= 2, priority: "high", tip: "Show your body of work." });
        items.push({ label: "Press or reviews", done: press.length > 0, priority: "medium", tip: "Critical reception adds authority." });
      }

      // General nice-to-haves
      items.push({ label: "Banner image uploaded", done: !!profile.banner_url, priority: "low", tip: "A banner makes your portfolio feel polished." });
      items.push({ label: "Testimonials added", done: testimonials.length > 0, priority: "medium", tip: "What others say about you matters." });

      // Calculate score
      const totalWeight = items.reduce((sum, i) => sum + (i.priority === "high" ? 3 : i.priority === "medium" ? 2 : 1), 0);
      const doneWeight = items.filter((i) => i.done).reduce((sum, i) => sum + (i.priority === "high" ? 3 : i.priority === "medium" ? 2 : 1), 0);
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

  const scoreColor = score >= 80 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-500";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Profile Readiness
          </CardTitle>
          <span className={`text-2xl font-bold ${scoreColor}`}>{score}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden mt-2">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${score}%`,
              backgroundColor: score >= 80 ? "hsl(142 71% 45%)" : score >= 50 ? "hsl(48 96% 53%)" : "hsl(0 84% 60%)",
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-1 max-h-[400px] overflow-y-auto">
        {incomplete.length > 0 && (
          <div className="space-y-1 mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">To Do</p>
            {incomplete.map((item) => (
              <div key={item.label} className="flex items-start gap-2 py-1.5 group">
                {item.priority === "high" ? (
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">{item.tip}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {complete.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Done</p>
            {complete.map((item) => (
              <div key={item.label} className="flex items-center gap-2 py-1">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                <p className="text-sm text-muted-foreground line-through">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileReadiness;
