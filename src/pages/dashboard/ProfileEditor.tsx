import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Wand2, ChevronDown, ChevronUp } from "lucide-react";
import { GlossaryTooltip } from "@/components/ui/glossary-tooltip";
import { WritingAssistant } from "@/components/dashboard/WritingAssistant";
import ProfileReadiness from "@/components/dashboard/ProfileReadiness";
import { WritingAssistant } from "@/components/dashboard/WritingAssistant";

interface ProfileForm {
  display_name: string;
  first_name: string;
  last_name: string;
  headline: string;
  tagline: string;
  bio: string;
  location: string;
  profile_photo_url: string;
  banner_url: string;
  profile_type: string;
  primary_goal: string;
}

const ProfileEditor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [generatingBio, setGeneratingBio] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    display_name: "",
    first_name: "",
    last_name: "",
    headline: "",
    tagline: "",
    bio: "",
    location: "",
    profile_photo_url: "",
    banner_url: "",
    profile_type: "",
    primary_goal: "",
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, first_name, last_name, headline, tagline, bio, location, profile_photo_url, banner_url, profile_type, primary_goal")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            display_name: data.display_name || "",
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            headline: (data as any).headline || "",
            tagline: data.tagline || "",
            bio: data.bio || "",
            location: data.location || "",
            profile_photo_url: data.profile_photo_url || "",
            banner_url: data.banner_url || "",
            profile_type: data.profile_type || "",
            primary_goal: (data as any).primary_goal || "",
          });
        }
        setLoading(false);
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: form.display_name || null,
        first_name: form.first_name || null,
        last_name: form.last_name || null,
        headline: form.headline || null,
        tagline: form.tagline || null,
        bio: form.bio || null,
        location: form.location || null,
        profile_photo_url: form.profile_photo_url || null,
        banner_url: form.banner_url || null,
      })
      .eq("id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Profile updated successfully." });
    }
    setSaving(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, bucket: string, field: keyof ProfileForm) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) {
      toast({ title: "Upload error", description: error.message, variant: "destructive" });
      return;
    }
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    setForm((prev) => ({ ...prev, [field]: urlData.publicUrl }));
  };

  const handleGenerateBio = async () => {
    setGeneratingBio(true);
    try {
      // Fetch context: projects and awards
      const [projectsRes, awardsRes] = await Promise.all([
        supabase.from("projects").select("title, project_type, role_name, year").eq("profile_id", user!.id).order("year", { ascending: false }).limit(10),
        supabase.from("awards").select("name, organization, result, year").eq("profile_id", user!.id).limit(10),
      ]);

      const context = {
        profile_type: form.profile_type,
        goal: form.primary_goal,
        name: form.display_name || [form.first_name, form.last_name].filter(Boolean).join(" "),
        tagline: form.tagline,
        headline: form.headline,
        location: form.location,
        projects: projectsRes.data || [],
        awards: awardsRes.data || [],
      };

      const { data, error } = await supabase.functions.invoke("writing-assist", {
        body: { type: "generate_bio", text: JSON.stringify(context), title: context.name },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const bio = data.result?.bio_text;
      if (bio) {
        setForm((prev) => ({ ...prev, bio }));
        toast({ title: "Bio generated", description: "Review and edit as needed." });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setGeneratingBio(false);
    }
  };

  const handleApplySuggestion = (text: string, field: "headline" | "bio") => {
    setForm((prev) => ({ ...prev, [field]: text }));
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  const update = (field: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const bioPreviewLength = 200;
  const bioIsTruncatable = form.bio.length > bioPreviewLength;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Photos</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Profile Photo</Label>
            {form.profile_photo_url && (
              <img src={form.profile_photo_url} alt="Profile" className="w-20 h-20 rounded-full object-cover mt-2 mb-2" />
            )}
            <Input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, "headshots", "profile_photo_url")} />
          </div>
          <div>
            <Label>Banner Image</Label>
            {form.banner_url && (
              <img src={form.banner_url} alt="Banner" className="w-full h-32 object-cover rounded-md mt-2 mb-2" />
            )}
            <Input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, "banners", "banner_url")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>First Name</Label><Input value={form.first_name} onChange={update("first_name")} /></div>
            <div><Label>Last Name</Label><Input value={form.last_name} onChange={update("last_name")} /></div>
          </div>
          <div><Label>Display Name</Label><Input value={form.display_name} onChange={update("display_name")} /></div>
          <div><Label>Tagline <GlossaryTooltip term="tagline" /></Label><Input value={form.tagline} onChange={update("tagline")} placeholder="e.g. Award-winning screenwriter" /></div>
          <div><Label>Location</Label><Input value={form.location} onChange={update("location")} placeholder="e.g. Los Angeles, CA" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Headline & Bio</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {/* Headline */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label>Headline <GlossaryTooltip term="headline" /></Label>
              <WritingAssistant
                field="headline"
                text={form.headline}
                onApply={(text) => handleApplySuggestion(text, "headline")}
                title={form.display_name || form.first_name}
                format={form.profile_type}
              />
            </div>
            <Input
              value={form.headline}
              onChange={update("headline")}
              placeholder="e.g. Emmy-nominated screenwriter specializing in limited series"
            />
            <p className="text-xs text-muted-foreground mt-1">A short pitch line that appears prominently on your portfolio</p>
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label>Bio <GlossaryTooltip term="bio" /></Label>
              <div className="flex items-center gap-1">
                <WritingAssistant
                  field="bio"
                  text={form.bio}
                  onApply={(text) => handleApplySuggestion(text, "bio")}
                  title={form.display_name || form.first_name}
                  format={form.profile_type}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateBio}
                  disabled={generatingBio}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {generatingBio ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Wand2 className="h-3 w-3 mr-1" />}
                  Generate
                </Button>
              </div>
            </div>
            <Textarea
              value={form.bio}
              onChange={update("bio")}
              rows={6}
              placeholder="Tell your story — credentials, notable work, awards, and what drives you..."
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">{form.bio.length} characters</p>
              {bioIsTruncatable && (
                <button
                  onClick={() => setBioExpanded(!bioExpanded)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {bioExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  Preview
                </button>
              )}
            </div>
            {bioIsTruncatable && (
              <div className="mt-2 p-3 rounded-md bg-muted/50 text-sm leading-relaxed whitespace-pre-line">
                {bioExpanded ? form.bio : `${form.bio.slice(0, bioPreviewLength)}...`}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileEditor;
