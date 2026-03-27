import { useEffect, useState, useRef, useCallback } from "react";
import { compressImage } from "@/lib/imageCompression";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, Wand2, ChevronDown, ChevronUp, ExternalLink, Trash2, User, FileUp, Globe, Check, AlertCircle, CheckCircle2, Crop } from "lucide-react";
import { ResumeImporter } from "@/components/dashboard/ResumeImporter";
import { URLImporter } from "@/components/dashboard/URLImporter";
import { GlossaryTooltip } from "@/components/ui/glossary-tooltip";
import { WritingAssistant } from "@/components/dashboard/WritingAssistant";
import { BioBuilderWizard } from "@/components/dashboard/BioBuilderWizard";
import ProfileReadiness from "@/components/dashboard/ProfileReadiness";
import HeroBackgroundEditor from "@/components/dashboard/HeroBackgroundEditor";
import { useFormDraft } from "@/hooks/useFormDraft";
import ImageCropper from "@/components/ImageCropper";

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
  hero_style: string;
  hero_background_preset: string;
  hero_bg_type: string;
  hero_bg_solid_color: string;
  hero_bg_video_url: string;
  slug: string;
}

const EDITOR_SECTIONS = [
  { id: "photo", label: "Photo" },
  { id: "hero-bg", label: "Hero" },
  { id: "basic-info", label: "Info" },
  { id: "headline-bio", label: "Bio" },
];

type SaveStatus = "idle" | "saving" | "saved" | "error";

const ProfileEditor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [bioExpanded, setBioExpanded] = useState(false);
  const [generatingBio, setGeneratingBio] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [urlOpen, setUrlOpen] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropImage, setCropImage] = useState<string>("");
  const [cropType, setCropType] = useState<"headshot" | "banner">("headshot");
  const slugTimeout = useRef<ReturnType<typeof setTimeout>>();
  const autoSaveTimeout = useRef<ReturnType<typeof setTimeout>>();
  const initialLoad = useRef(true);
  const [loadedForm, setLoadedForm] = useState<ProfileForm | null>(null);
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
    hero_style: "classic",
    hero_background_preset: "",
    hero_bg_type: "preset",
    hero_bg_solid_color: "",
    hero_bg_video_url: "",
    slug: "",
  });

  const { clearDraft } = useFormDraft("profile-editor", form, setForm);

  // Check if form has changed from loaded state
  const isDirty = loadedForm ? JSON.stringify(form) !== JSON.stringify(loadedForm) : false;

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, first_name, last_name, headline, tagline, bio, location, profile_photo_url, banner_url, profile_type, primary_goal, hero_style, hero_background_preset, hero_bg_type, hero_bg_solid_color, hero_bg_video_url, slug")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          const loaded: ProfileForm = {
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
            hero_style: (data as any).hero_style || "classic",
            hero_background_preset: (data as any).hero_background_preset || "",
            hero_bg_type: (data as any).hero_bg_type || "preset",
            hero_bg_solid_color: (data as any).hero_bg_solid_color || "",
            hero_bg_video_url: (data as any).hero_bg_video_url || "",
            slug: data.slug || "",
          };
          setForm(loaded);
          setLoadedForm(loaded);
        }
        setLoading(false);
        initialLoad.current = false;
      });
  }, [user]);

  // Auto-save with 2s debounce
  useEffect(() => {
    if (initialLoad.current || !isDirty || loading) return;
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    autoSaveTimeout.current = setTimeout(() => {
      handleSave(true);
    }, 2000);
    return () => { if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current); };
  }, [form]);

  // Slug live availability check
  const checkSlugAvailability = useCallback((slug: string) => {
    if (slugTimeout.current) clearTimeout(slugTimeout.current);
    if (!slug || slug.length < 2) { setSlugAvailable(null); return; }
    setSlugChecking(true);
    slugTimeout.current = setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("slug", slug)
        .neq("id", user?.id || "")
        .maybeSingle();
      setSlugAvailable(!data);
      setSlugChecking(false);
    }, 500);
  }, [user?.id]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setForm(prev => ({ ...prev, slug: val }));
    checkSlugAvailability(val);
  };

  const handleSave = async (isAutoSave = false) => {
    if (!user) return;
    setSaveStatus("saving");
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
        primary_goal: form.primary_goal || null,
        hero_background_preset: form.hero_background_preset || null,
        hero_bg_type: form.hero_bg_type || "preset",
        hero_bg_solid_color: form.hero_bg_solid_color || null,
        hero_bg_video_url: form.hero_bg_video_url || null,
        slug: form.slug || null,
      } as any)
      .eq("id", user.id);

    if (error) {
      setSaveStatus("error");
      if (!isAutoSave) toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSaveStatus("saved");
      setLoadedForm({ ...form });
      clearDraft();
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, cropTypeArg: "headshot" | "banner") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read file as data URL and open cropper
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      setCropImage(result);
      setCropType(cropTypeArg);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedDataUrl: string) => {
    if (!user) return;

    try {
      // Convert data URL to blob
      const response = await fetch(croppedDataUrl);
      const blob = await response.blob();
      const file = new File([blob], `${cropType}.jpg`, { type: "image/jpeg" });

      // Compress if needed
      const maxDim = cropType === "headshot" ? 800 : 1920;
      const compressed = await compressImage(file, {
        maxWidth: maxDim,
        maxHeight: maxDim,
        quality: 0.85,
      });

      // Upload to storage
      const bucket = cropType === "headshot" ? "headshots" : "banners";
      const ext = compressed.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, compressed, { upsert: true });

      if (error) {
        toast({ title: "Upload error", description: error.message, variant: "destructive" });
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
      const field = cropType === "headshot" ? "profile_photo_url" : "banner_url";
      setForm((prev) => ({ ...prev, [field]: urlData.publicUrl }));
      toast({ title: "Success", description: `${cropType === "headshot" ? "Photo" : "Banner"} uploaded and cropped` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleRemovePhoto = () => {
    setForm((prev) => ({ ...prev, profile_photo_url: "" }));
  };

  const handleGenerateBio = async () => {
    setGeneratingBio(true);
    try {
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

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const saveStatusLabel = saveStatus === "saving" ? "Saving…" :
    saveStatus === "saved" ? "Saved" :
    saveStatus === "error" ? "Error" : null;

  const SaveStatusIcon = saveStatus === "saving" ? Loader2 :
    saveStatus === "saved" ? Check :
    saveStatus === "error" ? AlertCircle : null;

  return (
    <div className="max-w-2xl space-y-6">
      {/* Sticky editor nav */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border -mx-4 px-4 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          {EDITOR_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className="px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap"
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {saveStatusLabel && (
            <span className={`flex items-center gap-1 text-xs ${saveStatus === "error" ? "text-destructive" : "text-muted-foreground"}`}>
              {SaveStatusIcon && <SaveStatusIcon className={`h-3 w-3 ${saveStatus === "saving" ? "animate-spin" : ""}`} />}
              {saveStatusLabel}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={() => setResumeOpen(true)}>
            <FileUp className="mr-1 h-3.5 w-3.5" />Resume
          </Button>
          <Button variant="outline" size="sm" onClick={() => setUrlOpen(true)}>
            <Globe className="mr-1 h-3.5 w-3.5" />URL
          </Button>
          {form.slug && (
            <Button variant="outline" size="sm" onClick={() => window.open(`/p/${form.slug}`, "_blank")}>
              <ExternalLink className="mr-1 h-3.5 w-3.5" />Preview
            </Button>
          )}
          <Button onClick={() => handleSave(false)} disabled={saveStatus === "saving" || !isDirty} size="sm">
            {saveStatus === "saving" ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1 h-3.5 w-3.5" />}
            Save
          </Button>
        </div>
      </div>

      <ResumeImporter open={resumeOpen} onOpenChange={setResumeOpen} profileType={form.profile_type} onComplete={() => window.location.reload()} />
      <URLImporter open={urlOpen} onOpenChange={setUrlOpen} profileType={form.profile_type} onComplete={() => window.location.reload()} />

      <ProfileReadiness />

      {/* Profile Photo Card */}
      <Card id="photo">
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>This photo appears as your main headshot on your portfolio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {form.profile_photo_url ? (
              <img src={form.profile_photo_url} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-border" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <p className="text-sm font-medium text-foreground">
                {form.profile_photo_url ? "✓ Profile photo set" : "No profile photo yet"}
              </p>
              <p className="text-xs text-muted-foreground">
                {form.profile_photo_url
                  ? "Upload a new photo to replace, or remove the current one."
                  : "Upload a professional headshot or portrait photo."}
              </p>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <Input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, "headshot")} />
                  <span className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                    {form.profile_photo_url ? "Replace Photo" : "Upload Photo"}
                  </span>
                </label>
                {form.profile_photo_url && (
                  <Button variant="ghost" size="sm" onClick={handleRemovePhoto} className="text-destructive hover:text-destructive">
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div id="hero-bg">
        {user && (
          <HeroBackgroundEditor
            userId={user.id}
            heroStyle={form.hero_style}
            heroBackgroundPreset={form.hero_background_preset}
            bannerUrl={form.banner_url}
            heroBgType={form.hero_bg_type}
            heroBgSolidColor={form.hero_bg_solid_color}
            heroBgVideoUrl={form.hero_bg_video_url}
            onUpdate={(fields) => setForm((prev) => ({ ...prev, ...fields }))}
          />
        )}
      </div>

      <Card id="basic-info">
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
          <CardDescription>Your name, tagline, and location as displayed on the portfolio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>First Name</Label><Input value={form.first_name} onChange={update("first_name")} /></div>
            <div><Label>Last Name</Label><Input value={form.last_name} onChange={update("last_name")} /></div>
          </div>
          <div>
            <Label>Display Name</Label>
            <Input value={form.display_name} onChange={update("display_name")} />
            <p className="text-xs text-muted-foreground mt-1">How your name appears on the portfolio — can be a stage name or brand</p>
          </div>
          <div><Label>Tagline <GlossaryTooltip term="tagline" /></Label><Input value={form.tagline} onChange={update("tagline")} placeholder="e.g. Award-winning screenwriter" /></div>
          <div><Label>Location</Label><Input value={form.location} onChange={update("location")} placeholder="e.g. Los Angeles, CA" /></div>
          <div>
            <Label>Portfolio URL Slug</Label>
            <div className="relative">
              <Input
                value={form.slug}
                onChange={handleSlugChange}
                placeholder="your-name"
                className="pr-8"
              />
              {slugChecking && <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
              {!slugChecking && slugAvailable === true && form.slug && <CheckCircle2 className="absolute right-2.5 top-2.5 h-4 w-4 text-green-600" />}
              {!slugChecking && slugAvailable === false && <AlertCircle className="absolute right-2.5 top-2.5 h-4 w-4 text-destructive" />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {slugAvailable === false ? (
                <span className="text-destructive">This slug is already taken — choose another.</span>
              ) : form.slug ? (
                <>Your portfolio will be at <span className="font-mono">/p/{form.slug}</span></>
              ) : (
                "Letters, numbers, and hyphens only"
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card id="headline-bio">
        <CardHeader>
          <CardTitle>Headline & Bio</CardTitle>
          <CardDescription>Your pitch and story — these appear prominently on your portfolio</CardDescription>
        </CardHeader>
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
                <BioBuilderWizard
                  name={form.display_name || [form.first_name, form.last_name].filter(Boolean).join(" ")}
                  profileType={form.profile_type}
                  onApply={(text) => handleApplySuggestion(text, "bio")}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateBio}
                  disabled={generatingBio}
                  className="h-7 px-2 text-xs"
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
              <div className="mt-2 p-3 rounded-md bg-muted/50 text-sm leading-relaxed whitespace-pre-line text-foreground">
                {bioExpanded ? form.bio : `${form.bio.slice(0, bioPreviewLength)}...`}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ImageCropper
        open={cropOpen}
        onOpenChange={setCropOpen}
        imageUrl={cropImage}
        aspectRatio={cropType === "headshot" ? 1 : 16 / 9}
        aspectLabel={cropType === "headshot" ? "Square (1:1) — best for headshots" : "Banner (16:9) — best for hero backgrounds"}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};

export default ProfileEditor;
