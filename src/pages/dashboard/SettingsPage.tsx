import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, ExternalLink } from "lucide-react";
import { themes } from "@/lib/themes";

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    theme: "minimal",
    accent_color: "#C41E3A",
    is_published: false,
    show_contact_form: true,
    available_for_hire: false,
    seeking_representation: false,
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("slug, theme, accent_color, is_published, show_contact_form, available_for_hire, seeking_representation")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            slug: data.slug || "",
            theme: data.theme || "minimal",
            accent_color: data.accent_color || "#C41E3A",
            is_published: data.is_published || false,
            show_contact_form: data.show_contact_form !== false,
            available_for_hire: data.available_for_hire || false,
            seeking_representation: data.seeking_representation || false,
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
        slug: form.slug || null,
        theme: form.theme,
        accent_color: form.accent_color || null,
        is_published: form.is_published,
        show_contact_form: form.show_contact_form,
        available_for_hire: form.available_for_hire,
        seeking_representation: form.seeking_representation,
      })
      .eq("id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Settings updated." });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save
        </Button>
      </div>

      {/* Publish */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Publish Portfolio</CardTitle>
              <CardDescription>Make your portfolio visible to the public</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={form.is_published ? "default" : "secondary"}>
                {form.is_published ? "Live" : "Draft"}
              </Badge>
              <Switch
                checked={form.is_published}
                onCheckedChange={(v) => setForm((f) => ({ ...f, is_published: v }))}
              />
            </div>
          </div>
        </CardHeader>
        {form.is_published && form.slug && (
          <CardContent>
            <a
              href={`/p/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary flex items-center gap-1 hover:underline"
            >
              /p/{form.slug} <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        )}
      </Card>

      {/* URL */}
      <Card>
        <CardHeader><CardTitle>Portfolio URL</CardTitle></CardHeader>
        <CardContent>
          <Label>Slug</Label>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">/p/</span>
            <Input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
              placeholder="your-name"
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Theme</Label>
            <Select value={form.theme} onValueChange={(v) => setForm((f) => ({ ...f, theme: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(themes).map((t) => (
                  <SelectItem key={t.key} value={t.key}>
                    {t.label} — {t.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Accent Color</Label>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="color"
                value={form.accent_color}
                onChange={(e) => setForm((f) => ({ ...f, accent_color: e.target.value }))}
                className="w-10 h-10 rounded cursor-pointer border border-border"
              />
              <span className="text-sm text-muted-foreground">{form.accent_color}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toggles */}
      <Card>
        <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Show Contact Form</Label>
            <Switch checked={form.show_contact_form} onCheckedChange={(v) => setForm((f) => ({ ...f, show_contact_form: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Available for Hire</Label>
            <Switch checked={form.available_for_hire} onCheckedChange={(v) => setForm((f) => ({ ...f, available_for_hire: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Seeking Representation</Label>
            <Switch checked={form.seeking_representation} onCheckedChange={(v) => setForm((f) => ({ ...f, seeking_representation: v }))} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
