import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, ArrowRight, TrendingUp } from "lucide-react";
import { UpgradeGate } from "@/components/UpgradeGate";

const PERSONAS = [
  { value: "film_buyer", label: "Film Buyer / Acquisitions Exec", description: "Would they want to acquire your work?" },
  { value: "showrunner", label: "Showrunner / EP", description: "Would they staff you in a writers' room?" },
  { value: "literary_manager", label: "Literary Manager", description: "Would they want to sign you?" },
  { value: "casting_director", label: "Casting Director", description: "Can they find what they need quickly?" },
  { value: "festival_programmer", label: "Festival Programmer", description: "Does your body of work stand out?" },
  { value: "brand_agency", label: "Brand / Agency", description: "Would they hire you for a campaign?" },
];

interface EvalResult {
  overall_impression: string;
  readiness_score: number;
  strengths: string[];
  improvements: string[];
  action_items: string[];
}

const ProfileInsights = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [persona, setPersona] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);

  const fetchProfileData = async () => {
    if (!user) return null;

    const [profile, projects, awards, press, testimonials, skills, representation, socialLinks] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("projects").select("title, project_type, logline, description, genre, year, status, role_name, director, network_or_studio").eq("profile_id", user.id),
      supabase.from("awards").select("name, organization, category, result, year").eq("profile_id", user.id),
      supabase.from("press").select("title, publication, press_type, date, excerpt").eq("profile_id", user.id),
      supabase.from("testimonials").select("author_name, author_role, author_company, quote").eq("profile_id", user.id),
      supabase.from("skills").select("name, category, proficiency").eq("profile_id", user.id),
      supabase.from("representation").select("rep_type, company, name, market").eq("profile_id", user.id),
      supabase.from("social_links").select("platform, url").eq("profile_id", user.id),
    ]);

    return {
      profile: profile.data ? {
        display_name: profile.data.display_name,
        tagline: profile.data.tagline,
        bio: profile.data.bio,
        location: profile.data.location,
        profile_type: profile.data.profile_type,
        available_for_hire: profile.data.available_for_hire,
        seeking_representation: profile.data.seeking_representation,
        has_photo: !!profile.data.profile_photo_url,
        has_banner: !!profile.data.banner_url,
      } : null,
      projects: projects.data || [],
      awards: awards.data || [],
      press: press.data || [],
      testimonials: testimonials.data || [],
      skills: skills.data || [],
      representation: representation.data || [],
      social_links: socialLinks.data || [],
    };
  };

  const handleEvaluate = async () => {
    if (!persona) {
      toast({ title: "Select a perspective", description: "Choose who you want to evaluate your profile as.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const profileData = await fetchProfileData();
      if (!profileData) throw new Error("Could not load profile data");

      const { data, error } = await supabase.functions.invoke("profile-evaluate", {
        body: { persona, profileData },
      });

      if (error) throw error;
      if (data?.error) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
        setLoading(false);
        return;
      }

      setResult(data.result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Something went wrong", variant: "destructive" });
    }
    setLoading(false);
  };

  const scoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 5) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-500 bg-red-50 border-red-200";
  };

  const selectedPersona = PERSONAS.find((p) => p.value === persona);

  return (
    <UpgradeGate feature="profile_insights" label="Profile Insights">
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">
          See how your profile reads to different industry professionals.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Choose a perspective</CardTitle>
          <CardDescription>
            Select an industry role to see how they'd perceive your portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={persona} onValueChange={setPersona}>
            <SelectTrigger>
              <SelectValue placeholder="Select who's viewing your profile..." />
            </SelectTrigger>
            <SelectContent>
              {PERSONAS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  <div>
                    <div className="font-medium">{p.label}</div>
                    <div className="text-xs text-muted-foreground">{p.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleEvaluate} disabled={loading || !persona} className="w-full">
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4 mr-2" />
            )}
            {loading ? "Analyzing..." : "Get Impression"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`flex items-center justify-center w-16 h-16 rounded-xl border-2 text-2xl font-bold shrink-0 ${scoreColor(result.readiness_score)}`}>
                  {result.readiness_score}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {selectedPersona?.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{result.overall_impression}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-700 flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-green-600 shrink-0">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-amber-700 flex items-center gap-1.5">
                  <ArrowRight className="h-4 w-4" /> To Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.improvements.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-amber-500 shrink-0">→</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {result.action_items.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="font-medium text-foreground shrink-0">{i + 1}.</span>
                    {s}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    </UpgradeGate>
  );
};

export default ProfileInsights;
