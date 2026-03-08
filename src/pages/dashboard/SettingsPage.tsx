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
import { Loader2, Save, ExternalLink, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import { themes } from "@/lib/themes";

const ALL_SECTIONS = [
  { key: "projects", label: "Projects" },
  { key: "gallery", label: "Gallery" },
  { key: "services", label: "Services" },
  { key: "awards", label: "Awards" },
  { key: "education", label: "Education & Training" },
  { key: "events", label: "Events" },
  { key: "press", label: "Press & Reviews" },
  { key: "testimonials", label: "Testimonials" },
  { key: "skills", label: "Skills" },
  { key: "representation", label: "Representation" },
];

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
    cta_label: "",
    cta_url: "",
    cta_type: "contact_form",
    booking_url: "",
  });
  const [sectionOrder, setSectionOrder] = useState<string[]>(ALL_SECTIONS.map(s => s.key));
  const [sectionsVisible, setSectionsVisible] = useState<Record<string, boolean>>(
    Object.fromEntries(ALL_SECTIONS.map(s => [s.key, true]))
  );

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("slug, theme, accent_color, is_published, show_contact_form, available_for_hire, seeking_representation, cta_label, cta_url, cta_type, booking_url, section_order, sections_visible")
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
            cta_label: (data as any).cta_label || "",
            cta_url: (data as any).cta_url || "",
            cta_type: (data as any).cta_type || "contact_form",
            booking_url: (data as any).booking_url || "",
          });
          if (data.section_order && data.section_order.length > 0) {
            setSectionOrder(data.section_order);
          }
          if (data.sections_visible && typeof data.sections_visible === "object") {
            setSectionsVisible({ ...Object.fromEntries(ALL_SECTIONS.map(s => [s.key, true])), ...(data.sections_visible as Record<string, boolean>) });
          }
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
        cta_label: form.cta_label || null,
        cta_url: form.cta_url || null,
        cta_type: form.cta_type || "contact_form",
        booking_url: form.booking_url || null,
        section_order: sectionOrder,
        sections_visible: sectionsVisible,
      } as any)
      .eq("id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Settings updated." });
    }
    setSaving(false);
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const newOrder = [...sectionOrder];
    const target = index + direction;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    setSectionOrder(newOrder);
  };

  const toggleSectionVisibility = (key: string) => {
    setSectionsVisible(prev => ({ ...prev, [key]: !prev[key] }));
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
              <Switch checked={form.is_published} onCheckedChange={(v) => setForm((f) => ({ ...f, is_published: v }))} />
            </div>
          </div>
        </CardHeader>
        {form.is_published && form.slug && (
          <CardContent>
            <a href={`/p/${form.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary flex items-center gap-1 hover:underline">
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
            <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))} placeholder="your-name" />
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
                  <SelectItem key={t.key} value={t.key}>{t.label} — {t.description}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Accent Color</Label>
            <div className="flex items-center gap-3 mt-1">
              <input type="color" value={form.accent_color} onChange={(e) => setForm((f) => ({ ...f, accent_color: e.target.value }))} className="w-10 h-10 rounded cursor-pointer border border-border" />
              <span className="text-sm text-muted-foreground">{form.accent_color}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Call-to-Action Button</CardTitle>
          <CardDescription>Configure the main action button on your portfolio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>CTA Type</Label>
            <Select value={form.cta_type} onValueChange={(v) => setForm((f) => ({ ...f, cta_type: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="contact_form">Scroll to Contact Form</SelectItem>
                <SelectItem value="calendar">Open Calendar Booking</SelectItem>
                <SelectItem value="email">Send Email</SelectItem>
                <SelectItem value="custom_url">Custom URL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Button Label</Label>
            <Input value={form.cta_label} onChange={(e) => setForm((f) => ({ ...f, cta_label: e.target.value }))} placeholder="e.g. Hire Me, Book a Call, Get in Touch" />
          </div>
          {(form.cta_type === "email" || form.cta_type === "custom_url") && (
            <div>
              <Label>{form.cta_type === "email" ? "Email Address" : "URL"}</Label>
              <Input value={form.cta_url} onChange={(e) => setForm((f) => ({ ...f, cta_url: e.target.value }))} placeholder={form.cta_type === "email" ? "you@email.com" : "https://..."} />
            </div>
          )}
          {form.cta_type === "calendar" && (
            <div>
              <Label>Booking URL</Label>
              <Input value={form.booking_url} onChange={(e) => setForm((f) => ({ ...f, booking_url: e.target.value }))} placeholder="https://calendly.com/your-name or https://cal.com/your-name" />
              <p className="text-xs text-muted-foreground mt-1">Paste your Calendly, Cal.com, or Acuity scheduling link</p>
            </div>
          )}
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

      {/* Section Visibility & Reorder */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Sections</CardTitle>
          <CardDescription>Toggle visibility and reorder sections on your portfolio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {sectionOrder.map((key, index) => {
            const section = ALL_SECTIONS.find(s => s.key === key);
            if (!section) return null;
            const visible = sectionsVisible[key] !== false;
            return (
              <div key={key} className="flex items-center justify-between py-2 px-3 rounded-md border border-border">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveSection(index, -1)} disabled={index === 0}>
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveSection(index, 1)} disabled={index === sectionOrder.length - 1}>
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className={`text-sm font-medium ${visible ? "text-foreground" : "text-muted-foreground line-through"}`}>{section.label}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => toggleSectionVisibility(key)}>
                  {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
