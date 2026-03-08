import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { GlossaryTooltip } from "@/components/ui/glossary-tooltip";

interface ProfileForm {
  display_name: string;
  first_name: string;
  last_name: string;
  tagline: string;
  bio: string;
  location: string;
  profile_photo_url: string;
  banner_url: string;
}

const ProfileEditor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    display_name: "",
    first_name: "",
    last_name: "",
    tagline: "",
    bio: "",
    location: "",
    profile_photo_url: "",
    banner_url: "",
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, first_name, last_name, tagline, bio, location, profile_photo_url, banner_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            display_name: data.display_name || "",
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            tagline: data.tagline || "",
            bio: data.bio || "",
            location: data.location || "",
            profile_photo_url: data.profile_photo_url || "",
            banner_url: data.banner_url || "",
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

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  const update = (field: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

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
          <div><Label>Bio <GlossaryTooltip term="bio" /></Label><Textarea value={form.bio} onChange={update("bio")} rows={6} placeholder="Tell your story..." /></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileEditor;
