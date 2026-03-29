import { useEffect, useState, useCallback } from "react";
import { useFormDraft } from "@/hooks/useFormDraft";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, ExternalLink, ArrowUp, ArrowDown, Eye, EyeOff, Lock, Search, Check, Layout, Columns, Star, Circle, Square, RectangleHorizontal, UserX, Sparkles, Mail, AlertTriangle, Trash2, Download, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { portfolioThemeList } from "@/themes/themes";
import { fontPairings } from "@/lib/fontPairings";
import { getProfileTypeConfig, getMergedSections, PROFILE_TYPES, type SectionConfig } from "@/config/profileSections";
import { getTypeAwareLabels } from "@/lib/typeAwareLabels";
import { useSubscription } from "@/hooks/useSubscription";
import { ProBadge } from "@/components/UpgradeGate";
import { useProfileTypeContext } from "@/contexts/ProfileTypeContext";
import type { HeroLayout, KnownForPosition } from "@/components/portfolio/PortfolioHero";

const KNOWN_FOR_POSITIONS: { id: KnownForPosition; label: string; description: string }[] = [
  { id: "hero_above_name", label: "Above Name", description: "Posters displayed above your name in the hero" },
  { id: "hero_below_cta", label: "Below CTA", description: "Posters displayed below your call-to-action button" },
  { id: "hero_beside_photo", label: "Beside Photo", description: "Posters displayed next to your headshot" },
  { id: "below_hero", label: "Below Hero", description: "Full-width strip right below the hero section" },
  { id: "body_section", label: "Body Section", description: "As a regular section in the main content area" },
  { id: "hidden", label: "Hidden", description: "Don't show this section on your portfolio" },
];

const HERO_LAYOUTS: { id: HeroLayout; label: string; description: string }[] = [
  { id: "classic", label: "Classic", description: "Photo left, text right" },
  { id: "centered", label: "Centered", description: "Everything centered" },
  { id: "split", label: "Split", description: "50/50 photo and text" },
  { id: "minimal", label: "Minimal", description: "Text-only, compact" },
  { id: "banner", label: "Banner", description: "Full-width background image" },
  { id: "sidebar", label: "Sidebar", description: "Photo in sidebar column" },
  { id: "editorial", label: "Editorial", description: "Magazine-style layout" },
  { id: "card", label: "Card", description: "Contained card layout" },
  { id: "stacked", label: "Stacked", description: "Vertical stack layout" },
  { id: "cinematic", label: "Cinematic", description: "Widescreen, dramatic" },
  { id: "compact", label: "Compact", description: "Minimal height hero" },
];

const LAYOUT_PRESETS = [
  { id: "classic", label: "Classic", description: "Traditional single-column layout" },
  { id: "standard", label: "Standard", description: "Clean, professional look" },
  { id: "cinematic", label: "Cinematic", description: "Widescreen, high-impact" },
  { id: "compact", label: "Compact", description: "Dense, information-rich" },
  { id: "magazine", label: "Magazine", description: "Editorial multi-column" },
  { id: "spotlight", label: "Spotlight", description: "Focus on featured work" },
  { id: "timeline", label: "Timeline", description: "Chronological career view" },
  { id: "bento", label: "Bento", description: "Grid-based card layout" },
  { id: "minimal", label: "Minimal", description: "Maximum whitespace" },
  { id: "dashboard", label: "Dashboard", description: "Metrics-forward layout" },
];

// ─── Sortable section row for DnD reordering ──────────────────────────────────
function SortableSectionRow({ id, label, visible, onToggle }: { id: string; label: string; visible: boolean; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className={`flex items-center justify-between py-2.5 px-3 rounded-lg border transition-colors ${isDragging ? "shadow-lg z-50 bg-accent" : "border-border bg-background hover:bg-accent/30"}`}
    >
      <div className="flex items-center gap-3">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors touch-none">
          <GripVertical className="h-4 w-4" />
        </button>
        <span className={`text-sm font-medium select-none ${visible ? "text-foreground" : "text-muted-foreground line-through"}`}>{label}</span>
      </div>
      <button onClick={onToggle} className="p-1 rounded-md hover:bg-accent transition-colors">
        {visible ? <Eye className="h-4 w-4 text-foreground" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
      </button>
    </div>
  );
}

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isPro } = useSubscription();
  const { profileType: contextProfileType, setProfileType: setContextProfileType, setSlug: setContextSlug } = useProfileTypeContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileType, setProfileType] = useState<string | null>(null);
  const [secondaryTypes, setSecondaryTypes] = useState<string[]>([]);
  const [heroStyle, setHeroStyle] = useState<string>("full");
  
  const [headshotStyle, setHeadshotStyle] = useState<string>("circle");
  const [knownForPosition, setKnownForPosition] = useState<KnownForPosition>("hero_above_name");
  const [ctaStyle, setCtaStyle] = useState<string>("outlined");
  const [clientLogosPosition, setClientLogosPosition] = useState<string>("body_section");
  const [professionalStatus, setProfessionalStatus] = useState<string>("");
  const [statusBadgeColor, setStatusBadgeColor] = useState<string>("green");
  const [statusBadgeAnimation, setStatusBadgeAnimation] = useState<string>("pulse");
  const [form, setForm] = useState({
    slug: "",
    theme: "cinematic-dark",
    accent_color: "#C41E3A",
    is_published: false,
    show_contact_form: true,
    available_for_hire: false,
    seeking_representation: false,
    cta_label: "",
    cta_url: "",
    cta_type: "contact_form",
    booking_url: "",
    contact_mode: "form",
    auto_responder_enabled: false,
    auto_responder_message: "",
    font_pairing: "default",
    layout_density: "spacious",
    layout_preset: "classic",
    custom_css: "",
    seo_indexable: false,
    ga_measurement_id: "",
    
  });
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [sectionsVisible, setSectionsVisible] = useState<Record<string, boolean>>({});
  const [allSections, setAllSections] = useState<{ key: string; label: string }[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [autoResponderEnabled, setAutoResponderEnabled] = useState(false);
  const [autoResponderMessage, setAutoResponderMessage] = useState("");
  const [savingAutoResponder, setSavingAutoResponder] = useState(false);

  // IMPORTANT: Call hooks BEFORE any conditional returns
  const { clearDraft } = useFormDraft("settings-page", form, setForm as any);

  // DnD sensors for section ordering
  const dndSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("slug, theme, accent_color, is_published, show_contact_form, available_for_hire, seeking_representation, cta_label, cta_url, cta_type, booking_url, section_order, sections_visible, profile_type, secondary_types, auto_responder_enabled, auto_responder_message, font_pairing, layout_density, layout_preset, custom_css, seo_indexable, contact_mode, hero_style, known_for_position, headshot_style, cta_style, client_logos_position, professional_status, status_badge_color, status_badge_animation, ga_measurement_id")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          const pt = data.profile_type || null;
          const st = (data as any).secondary_types || [];
          setProfileType(pt);
          setSecondaryTypes(st);
          setHeroStyle((data as any).hero_style || "classic");
          
          setHeadshotStyle((data as any).headshot_style || "circle");
          setKnownForPosition(((data as any).known_for_position as KnownForPosition) || "hero_above_name");
          setCtaStyle((data as any).cta_style || "outlined");
          setClientLogosPosition((data as any).client_logos_position || "body_section");
          setProfessionalStatus((data as any).professional_status || "");
          setStatusBadgeColor((data as any).status_badge_color || "green");
          setStatusBadgeAnimation((data as any).status_badge_animation || "pulse");

          let sections: { key: string; label: string }[] = [];
          if (pt) {
            const sectionConfigs = pt === "multi_hyphenate"
              ? getMergedSections(pt, st)
              : (getProfileTypeConfig(pt)?.sections || []);
            sections = sectionConfigs
              .filter((s: SectionConfig) => s.key !== "hero" && s.key !== "contact")
              .map((s: SectionConfig) => ({ key: s.key, label: s.label }));
          }
          if (sections.length === 0) {
            sections = [
              { key: "projects", label: "Projects" }, { key: "gallery", label: "Gallery" },
              { key: "services", label: "Services" }, { key: "awards", label: "Awards" },
              { key: "education", label: "Education & Training" }, { key: "events", label: "Events" },
              { key: "press", label: "Press & Reviews" }, { key: "testimonials", label: "Testimonials" },
              { key: "skills", label: "Skills" }, { key: "representation", label: "Representation" },
            ];
          }
          setAllSections(sections);

          const savedOrder = data.section_order || [];
          const sectionKeys = sections.map(s => s.key);
          const merged = savedOrder.filter((k: string) => sectionKeys.includes(k));
          sectionKeys.forEach(k => { if (!merged.includes(k)) merged.push(k); });
          setSectionOrder(merged);

          const defaultVisible = Object.fromEntries(sectionKeys.map(k => [k, true]));
          if (data.sections_visible && typeof data.sections_visible === "object") {
            setSectionsVisible({ ...defaultVisible, ...(data.sections_visible as Record<string, boolean>) });
          } else {
            setSectionsVisible(defaultVisible);
          }

          setForm({
            slug: data.slug || "", theme: data.theme || "cinematic-dark", accent_color: data.accent_color || "#C41E3A",
            is_published: data.is_published || false, show_contact_form: data.show_contact_form !== false,
            available_for_hire: data.available_for_hire || false, seeking_representation: data.seeking_representation || false,
            cta_label: (data as any).cta_label || "", cta_url: (data as any).cta_url || "",
            cta_type: (data as any).cta_type || "contact_form", booking_url: (data as any).booking_url || "",
            contact_mode: (data as any).contact_mode || "form", auto_responder_enabled: (data as any).auto_responder_enabled || false,
            auto_responder_message: (data as any).auto_responder_message || "", font_pairing: (data as any).font_pairing || "default",
            layout_density: (data as any).layout_density || "spacious", layout_preset: (data as any).layout_preset || "classic",
            custom_css: (data as any).custom_css || "", seo_indexable: (data as any).seo_indexable || false,
            ga_measurement_id: (data as any).ga_measurement_id || "",
            
          });
          setAutoResponderEnabled((data as any).auto_responder_enabled || false);
          setAutoResponderMessage((data as any).auto_responder_message || "");
        }
        setLoading(false);
      });
  }, [user]);

  const rebuildSections = (pt: string | null, st: string[]) => {
    let sections: { key: string; label: string }[] = [];
    if (pt) {
      const sectionConfigs = pt === "multi_hyphenate" ? getMergedSections(pt, st) : (getProfileTypeConfig(pt)?.sections || []);
      sections = sectionConfigs.filter((s: SectionConfig) => s.key !== "hero" && s.key !== "contact").map((s: SectionConfig) => ({ key: s.key, label: s.label }));
    }
    if (sections.length === 0) {
      sections = [
        { key: "projects", label: "Projects" }, { key: "gallery", label: "Gallery" },
        { key: "services", label: "Services" }, { key: "awards", label: "Awards" },
        { key: "education", label: "Education & Training" }, { key: "events", label: "Events" },
        { key: "press", label: "Press & Reviews" }, { key: "testimonials", label: "Testimonials" },
        { key: "skills", label: "Skills" }, { key: "representation", label: "Representation" },
      ];
    }
    setAllSections(sections);
    const sectionKeys = sections.map(s => s.key);
    setSectionOrder(sectionKeys);
    setSectionsVisible(Object.fromEntries(sectionKeys.map(k => [k, true])));
  };

  const handleProfileTypeChange = async (newType: string) => {
    if (!user) return;
    setProfileType(newType);
    setSecondaryTypes([]);
    setContextProfileType(newType);
    const { error } = await supabase.from("profiles").update({ profile_type: newType, secondary_types: [] } as any).eq("id", user.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    rebuildSections(newType, []);
    toast({ title: "Profile type updated", description: `Switched to ${PROFILE_TYPES.find(p => p.key === newType)?.label || newType}. Section layout has been reset.` });
  };

  const saveAutoResponder = async () => {
    if (!user) return;
    setSavingAutoResponder(true);
    const { error } = await supabase
      .from("profiles")
      .update({ auto_responder_enabled: autoResponderEnabled, auto_responder_message: autoResponderMessage } as any)
      .eq("id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Auto-responder settings updated." });
    }
    setSavingAutoResponder(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      slug: form.slug || null, theme: form.theme, accent_color: form.accent_color || null,
      is_published: form.is_published, show_contact_form: form.show_contact_form,
      available_for_hire: form.available_for_hire, seeking_representation: form.seeking_representation,
      cta_label: form.cta_label || null, cta_url: form.cta_url || null, cta_type: form.cta_type || "contact_form",
      booking_url: form.booking_url || null, contact_mode: form.contact_mode || "form",
      section_order: sectionOrder, sections_visible: sectionsVisible,
      auto_responder_enabled: form.auto_responder_enabled, auto_responder_message: form.auto_responder_message || null,
      font_pairing: form.font_pairing || "default", layout_density: form.layout_density || "spacious",
      layout_preset: form.layout_preset || "classic", custom_css: form.custom_css || null,
      seo_indexable: form.seo_indexable, ga_measurement_id: form.ga_measurement_id || null,
      hero_style: heroStyle || "classic", headshot_style: headshotStyle || "circle",
      known_for_position: knownForPosition || "hero_above_name", cta_style: ctaStyle || null,
      client_logos_position: clientLogosPosition || "body_section", professional_status: professionalStatus || null,
      status_badge_color: statusBadgeColor || "green", status_badge_animation: statusBadgeAnimation || "pulse",
      
    } as any).eq("id", user.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { setContextSlug(form.slug || null); toast({ title: "Saved", description: "Settings updated." }); clearDraft(); }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) { toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" }); return; }
    if (newPassword !== confirmPassword) { toast({ title: "Error", description: "Passwords don't match.", variant: "destructive" }); return; }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Password updated", description: "Your password has been changed." }); setNewPassword(""); setConfirmPassword(""); }
    setChangingPassword(false);
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const newOrder = [...sectionOrder];
    const target = index + direction;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    setSectionOrder(newOrder);
  };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over.id as string);
      setSectionOrder(arrayMove(sectionOrder, oldIndex, newIndex));
    }
  };

  const toggleSectionVisibility = (key: string) => {
    setSectionsVisible(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportData = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const [projects, testimonials, contacts, awards, skills, education, services, press, events, gallery, socialLinks, representation, publishedWorks] = await Promise.all([
        supabase.from("projects").select("*").eq("profile_id", user.id),
        supabase.from("testimonials").select("*").eq("profile_id", user.id),
        supabase.from("contact_submissions").select("*").eq("profile_id", user.id),
        supabase.from("awards").select("*").eq("profile_id", user.id),
        supabase.from("skills").select("*").eq("profile_id", user.id),
        supabase.from("education").select("*").eq("profile_id", user.id),
        supabase.from("services").select("*").eq("profile_id", user.id),
        supabase.from("press").select("*").eq("profile_id", user.id),
        supabase.from("events").select("*").eq("profile_id", user.id),
        supabase.from("gallery_images").select("*").eq("profile_id", user.id),
        supabase.from("social_links").select("*").eq("profile_id", user.id),
        supabase.from("representation").select("*").eq("profile_id", user.id),
        supabase.from("published_works").select("*").eq("profile_id", user.id),
      ]);
      const exportPayload = {
        exported_at: new Date().toISOString(),
        projects: projects.data || [],
        testimonials: testimonials.data || [],
        contact_submissions: contacts.data || [],
        awards: awards.data || [],
        skills: skills.data || [],
        education: education.data || [],
        services: services.data || [],
        press: press.data || [],
        events: events.data || [],
        gallery_images: gallery.data || [],
        social_links: socialLinks.data || [],
        representation: representation.data || [],
        published_works: publishedWorks.data || [],
      };
      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `creativeslate-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click(); URL.revokeObjectURL(url);
      toast({ title: "Export complete", description: "Your data has been downloaded as JSON." });
    } catch (err: any) {
      toast({ title: "Export failed", description: err.message, variant: "destructive" });
    } finally { setExporting(false); }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Themes, layouts, sections, and visibility</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="seo">SEO & Publish</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* ═══ GENERAL TAB ═══ */}
        <TabsContent value="general" className="space-y-6 mt-6">
          {/* Profile Type */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Type</CardTitle>
              <CardDescription>Determines which sections, labels, and tools are shown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PROFILE_TYPES.filter(pt => pt.key !== "multi_hyphenate").map((pt) => (
                  <button key={pt.key} onClick={() => handleProfileTypeChange(pt.key)}
                    className={`text-left p-3 rounded-lg border transition-all text-sm ${profileType === pt.key ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:border-primary/40 hover:bg-accent/50"}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{pt.label}</span>
                      {profileType === pt.key && <Check className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{pt.description.split(".")[0]}.</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">⚠️ Changing type will reset your section layout.</p>
            </CardContent>
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

          {/* CTA */}
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
                <Label>CTA Style</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[
                    { id: "filled", label: "Filled", desc: "Solid accent color" },
                    { id: "outlined", label: "Outlined", desc: "Transparent with border" },
                    { id: "gradient", label: "Gradient", desc: "Accent gradient fill" },
                  ].map((s) => (
                    <button key={s.id} onClick={() => setCtaStyle(s.id)}
                      className={`text-left p-2.5 rounded-lg border transition-all text-xs ${ctaStyle === s.id ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:border-primary/40 hover:bg-accent/50"}`}>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground">{s.label}</span>
                        {ctaStyle === s.id && <Check className="h-3 w-3 text-primary" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Button Label</Label>
                <Input value={form.cta_label} onChange={(e) => setForm((f) => ({ ...f, cta_label: e.target.value }))} placeholder="e.g. Hire Me, Book a Call" />
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
                  <Input value={form.booking_url} onChange={(e) => setForm((f) => ({ ...f, booking_url: e.target.value }))} placeholder="https://calendly.com/your-name" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Privacy</CardTitle>
              <CardDescription>Control how visitors can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Contact Mode</Label>
                <Select value={form.contact_mode} onValueChange={(v) => setForm((f) => ({ ...f, contact_mode: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="form">Contact Form Only</SelectItem>
                    <SelectItem value="agent">Agent/Rep Info Only</SelectItem>
                    <SelectItem value="both">Both Form & Agent Info</SelectItem>
                    <SelectItem value="none">Hidden (No Contact)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Contact Form</Label>
                <Switch checked={form.show_contact_form} onCheckedChange={(v) => setForm((f) => ({ ...f, show_contact_form: v }))} />
              </div>
            </CardContent>
          </Card>

          {/* Auto-Responder */}
          <Card className={!isPro ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Auto-Responder</CardTitle>
                {!isPro && <ProBadge />}
              </div>
              <CardDescription>Automatically acknowledge incoming contact messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Auto-Responder</Label>
                <Switch checked={form.auto_responder_enabled} onCheckedChange={(v) => setForm((f) => ({ ...f, auto_responder_enabled: v }))} disabled={!isPro} />
              </div>
              {form.auto_responder_enabled && isPro && (
                <div>
                  <Label>Response Message</Label>
                  <Textarea value={form.auto_responder_message} onChange={(e) => setForm((f) => ({ ...f, auto_responder_message: e.target.value }))} rows={3} placeholder="Thanks for reaching out! I'll get back to you within 48 hours." />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Standalone Auto-Responder Card */}
          <Card>
            <CardHeader>
              <CardTitle>Auto-Responder</CardTitle>
              <CardDescription>Automatically reply when someone sends you a message.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable auto-reply</Label>
                <Switch checked={autoResponderEnabled} onCheckedChange={setAutoResponderEnabled} />
              </div>
              {autoResponderEnabled && (
                <div className="space-y-2">
                  <Label>Reply message</Label>
                  <Textarea
                    value={autoResponderMessage}
                    onChange={e => setAutoResponderMessage(e.target.value)}
                    placeholder="Thanks for reaching out! I'll get back to you shortly."
                    rows={3}
                  />
                </div>
              )}
              <Button onClick={saveAutoResponder} disabled={savingAutoResponder}>
                {savingAutoResponder ? <Loader2 className="animate-spin h-4 w-4" /> : "Save"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ APPEARANCE TAB ═══ */}
        <TabsContent value="appearance" className="space-y-6 mt-6">
          {/* Hero Layout */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Columns className="h-4 w-4" /> Hero Layout</CardTitle>
              <CardDescription>Choose how your hero section is structured</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {HERO_LAYOUTS.map((layout) => (
                  <button key={layout.id} onClick={() => setHeroStyle(layout.id)}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${heroStyle === layout.id ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:border-primary/40 hover:bg-accent/50"}`}>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground">{layout.label}</span>
                      {heroStyle === layout.id && <Check className="h-3 w-3 text-primary" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{layout.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Headshot Style */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Circle className="h-4 w-4" /> Headshot Style</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: "circle", label: "Circular", icon: <div className="w-8 h-8 rounded-full bg-muted border-2 border-primary/30" /> },
                  { id: "rounded", label: "Rounded", icon: <div className="w-8 h-8 rounded-xl bg-muted border-2 border-primary/30" /> },
                  { id: "square", label: "Square", icon: <div className="w-8 h-8 rounded-none bg-muted border-2 border-primary/30" /> },
                  { id: "frame", label: "Framed", icon: <div className="w-8 h-8 rounded-lg bg-muted border-2 border-primary ring-2 ring-primary/30" /> },
                  { id: "hidden", label: "Hidden", icon: <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><UserX className="h-4 w-4 text-muted-foreground" /></div> },
                ].map((style) => (
                  <button key={style.id} onClick={() => setHeadshotStyle(style.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${headshotStyle === style.id ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:border-primary/40 hover:bg-accent/50"}`}>
                    {style.icon}
                    <p className="text-xs font-medium text-foreground">{style.label}</p>
                    {headshotStyle === style.id && <Check className="h-3 w-3 text-primary" />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Known For Position */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Star className="h-4 w-4" /> {getTypeAwareLabels(profileType).knownForTitle} Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {KNOWN_FOR_POSITIONS.map((pos) => (
                  <button key={pos.id} onClick={() => setKnownForPosition(pos.id)}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${knownForPosition === pos.id ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:border-primary/40 hover:bg-accent/50"}`}>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground">{pos.label}</span>
                      {knownForPosition === pos.id && <Check className="h-3 w-3 text-primary" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{pos.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Client Logos Position */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><RectangleHorizontal className="h-4 w-4" /> Client Logos Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "below_hero", label: "Below Hero", desc: "Right after the hero" },
                  { id: "above_sections", label: "Above Sections", desc: "Before main content" },
                  { id: "body_section", label: "Body Section", desc: "Regular content section" },
                  { id: "hidden", label: "Hidden", desc: "Don't show logos" },
                ].map((pos) => (
                  <button key={pos.id} onClick={() => setClientLogosPosition(pos.id)}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${clientLogosPosition === pos.id ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:border-primary/40 hover:bg-accent/50"}`}>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground">{pos.label}</span>
                      {clientLogosPosition === pos.id && <Check className="h-3 w-3 text-primary" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{pos.desc}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Layout Preset */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Layout className="h-4 w-4" /> Layout Preset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {LAYOUT_PRESETS.map((preset) => (
                  <button key={preset.id} onClick={() => setForm(f => ({ ...f, layout_preset: preset.id }))}
                    className={`text-left p-3 rounded-lg border transition-all text-sm ${form.layout_preset === preset.id ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:border-primary/40 hover:bg-accent/50"}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{preset.label}</span>
                      {form.layout_preset === preset.id && <Check className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{preset.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Theme & Typography */}
          <Card>
            <CardHeader>
              <CardTitle>Theme & Typography</CardTitle>
              <CardDescription>Choose a visual theme for your portfolio. Changes preview live when you save.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Presets */}
              <div>
                <Label className="mb-2 block">Quick Presets</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Film Professional", theme: "cinematic-dark", heroLayout: "classic", layoutPreset: "classic" },
                    { label: "Actor Modern", theme: "obsidian-noir", heroLayout: "centered", layoutPreset: "magazine" },
                    { label: "Director Cinematic", theme: "neon-noir", heroLayout: "banner", layoutPreset: "bento" },
                    { label: "Writer Literary", theme: "warm-luxury", heroLayout: "minimal", layoutPreset: "minimal" },
                    { label: "Clean Professional", theme: "clean-professional", heroLayout: "split", layoutPreset: "classic" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setForm(f => ({
                        ...f,
                        theme: preset.theme,
                        layout_preset: preset.layoutPreset,
                      }))}
                      className="text-xs px-3 py-1.5 rounded-full border transition-all hover:border-primary/60 hover:bg-accent/50 border-border text-muted-foreground"
                    >
                      ✦ {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Label>Visual Theme</Label>
                  {!isPro && <ProBadge />}
                </div>
                {/* Group themes by category */}
                {[
                  { label: "Dark", ids: ["cinematic-dark", "neon-noir", "obsidian-noir", "deep-space", "gothic-editorial", "electric-noir", "forest-noir"] },
                  { label: "Light", ids: ["modern-minimal", "warm-luxury", "clean-professional", "ivory-editorial"] },
                  { label: "Specialty", ids: ["vintage-film", "brutalist-studio", "rose-gold-glam"] },
                ].map(group => {
                  const groupThemes = portfolioThemeList.filter(t => group.ids.includes(t.id));
                  if (groupThemes.length === 0) return null;
                  return (
                    <div key={group.label} className="mb-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{group.label}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {groupThemes.map((t) => {
                          const isFree = ["cinematic-dark", "modern-minimal"].includes(t.id);
                          const isLocked = !isPro && !isFree;
                          const isSelected = form.theme === t.id;
                          return (
                            <button key={t.id}
                              onClick={() => !isLocked && setForm((f) => ({ ...f, theme: t.id }))}
                              disabled={isLocked}
                              className={`text-left rounded-xl border-2 overflow-hidden transition-all ${
                                isSelected ? "border-primary ring-2 ring-primary/30 scale-[1.02]" :
                                isLocked ? "border-border opacity-50 cursor-not-allowed" :
                                "border-border hover:border-primary/50 hover:scale-[1.01]"
                              }`}>
                              {/* Mini visual preview */}
                              <div className="h-16 relative" style={{ background: t.bgPrimary || t.previewColors[0] }}>
                                {/* Fake hero strip */}
                                <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end px-2 pb-1.5 gap-2"
                                  style={{ background: `linear-gradient(to top, ${t.bgPrimary || t.previewColors[0]}, transparent)` }}>
                                  <div className="w-5 h-5 rounded-full border" style={{ background: t.accentPrimary || t.previewColors[2], borderColor: `${t.accentPrimary || t.previewColors[2]}50` }} />
                                  <div className="flex flex-col gap-0.5">
                                    <div className="h-1.5 w-12 rounded-full" style={{ background: t.textPrimary || t.previewColors[1], opacity: 0.9 }} />
                                    <div className="h-1 w-8 rounded-full" style={{ background: t.textSecondary || t.previewColors[4], opacity: 0.5 }} />
                                  </div>
                                  <div className="ml-auto px-1.5 py-0.5 rounded-sm text-[7px] font-bold"
                                    style={{ background: t.accentPrimary || t.previewColors[2], color: "#fff" }}>
                                    CTA
                                  </div>
                                </div>
                                {/* Locked overlay */}
                                {isLocked && (
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Lock className="h-4 w-4 text-white/70" />
                                  </div>
                                )}
                                {/* Selected checkmark */}
                                {isSelected && (
                                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                    <Check className="h-3 w-3 text-primary-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="px-2 py-1.5 bg-card border-t border-border/50">
                                <p className="font-semibold text-foreground text-[11px]">{t.name}</p>
                                <p className="text-[9px] text-muted-foreground mt-0.5 line-clamp-1">{t.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div>
                <Label>Accent Color</Label>
                <div className="flex items-center gap-3 mt-1">
                  <input type="color" value={form.accent_color} onChange={(e) => setForm((f) => ({ ...f, accent_color: e.target.value }))} className="w-10 h-10 rounded cursor-pointer border border-border" />
                  <span className="text-sm text-muted-foreground">{form.accent_color}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Label>Font Pairing</Label>
                  {!isPro && <ProBadge />}
                </div>
                <Select value={form.font_pairing} onValueChange={(v) => setForm((f) => ({ ...f, font_pairing: v }))} disabled={!isPro}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.values(fontPairings).map((fp) => (
                      <SelectItem key={fp.key} value={fp.key}>{fp.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Custom CSS */}
          <Card className={!isPro ? "opacity-60 pointer-events-none" : ""}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Custom CSS</CardTitle>
                {!isPro && <ProBadge />}
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={form.custom_css} onChange={(e) => setForm((f) => ({ ...f, custom_css: e.target.value }))} rows={5} placeholder={`.portfolio-container h2 {\n  text-transform: uppercase;\n}`} className="font-mono text-xs" disabled={!isPro} />
            </CardContent>
          </Card>

          {/* Status Badge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Status Badge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">Quick Select</Label>
                <div className="flex flex-wrap gap-1.5">
                  {(() => {
                    const sharedPresets = ["Available for Hire", "Open to Opportunities", "Not Currently Available"];
                    const typePresets: Record<string, string[]> = {
                      actor: ["Available for Auditions", "Seeking Representation", "On Set"],
                      screenwriter: ["Open to Assignments", "Seeking Representation", "In Writers' Room"],
                      copywriter: ["Available for Projects", "Accepting Clients"],
                    };
                    const presets = [...(typePresets[profileType || ""] || []), ...sharedPresets];
                    return presets.map((p) => (
                      <button key={p} onClick={() => setProfessionalStatus(p)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${professionalStatus === p ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                        {p}
                      </button>
                    ));
                  })()}
                </div>
              </div>
              <div>
                <Label>Custom Status Text</Label>
                <Input value={professionalStatus} onChange={(e) => setProfessionalStatus(e.target.value)} placeholder="Type a custom status..." className="mt-1" />
              </div>
              <div>
                <Label className="mb-2 block">Badge Color</Label>
                <div className="flex gap-2">
                  {[
                    { id: "green", color: "#22c55e" }, { id: "blue", color: "#3b82f6" },
                    { id: "gold", color: "#f59e0b" }, { id: "red", color: "#ef4444" },
                    { id: "purple", color: "#a855f7" }, { id: "accent", color: form.accent_color },
                  ].map((c) => (
                    <button key={c.id} onClick={() => setStatusBadgeColor(c.id)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${statusBadgeColor === c.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "border-border"}`}
                      style={{ backgroundColor: c.color }} />
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Effect</Label>
                <div className="flex gap-1.5">
                  {[{ id: "pulse", label: "Pulse" }, { id: "glow", label: "Glow" }, { id: "static", label: "Static" }, { id: "none", label: "None" }].map((a) => (
                    <button key={a.id} onClick={() => setStatusBadgeAnimation(a.id)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${statusBadgeAnimation === a.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ SEO & PUBLISH TAB ═══ */}
        <TabsContent value="seo" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Publish Portfolio</CardTitle>
                  <CardDescription>Make your portfolio visible to the public</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={form.is_published ? "default" : "secondary"}>{form.is_published ? "Live" : "Draft"}</Badge>
                  <Switch checked={form.is_published} onCheckedChange={(v) => setForm((f) => ({ ...f, is_published: v }))} />
                </div>
              </div>
            </CardHeader>
            {form.is_published && form.slug && (
              <CardContent className="space-y-4">
                <a href={`/p/${form.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary flex items-center gap-1 hover:underline">
                  /p/{form.slug} <ExternalLink className="h-3 w-3" />
                </a>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2"><Search className="h-3.5 w-3.5" /> Allow Search Engine Indexing</Label>
                    <p className="text-xs text-muted-foreground">{form.seo_indexable ? "Your portfolio can be found via Google" : "Only accessible via direct link"}</p>
                  </div>
                  <Switch checked={form.seo_indexable} onCheckedChange={(v) => setForm((f) => ({ ...f, seo_indexable: v }))} />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" /> Feature in CreativeSlate Discovery</Label>
                    <p className="text-xs text-muted-foreground">
                      {form.is_featured
                        ? "Your portfolio may appear in the public discovery feed"
                        : "Your portfolio is private — only accessible via direct link"}
                    </p>
                  </div>
                  <Switch checked={form.is_featured} onCheckedChange={(v) => setForm((f) => ({ ...f, is_featured: v }))} />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Google Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Search className="h-4 w-4" /> Google Analytics</CardTitle>
              <CardDescription>Add your GA4 Measurement ID to track visitor analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <Input placeholder="G-XXXXXXXXXX" value={form.ga_measurement_id} onChange={(e) => setForm((f) => ({ ...f, ga_measurement_id: e.target.value }))} className="max-w-xs" />
            </CardContent>
          </Card>

          {/* Custom Domain */}
          <Card className="opacity-70">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Custom Domain</CardTitle>
                <ProBadge />
                <Badge variant="outline" className="text-[10px]">Coming Soon</Badge>
              </div>
              <CardDescription>Connect your own domain (e.g. yourname.com)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Input placeholder="yourname.com" disabled className="flex-1 opacity-50" />
                <Button disabled variant="outline" size="sm">Connect</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ SECTIONS TAB ═══ */}
        <TabsContent value="sections" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Sections</CardTitle>
              <CardDescription>Drag to reorder. Toggle the eye icon to show/hide. Changes save when you click Save.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <DndContext
                sensors={dndSensors}
                collisionDetection={closestCenter}
                onDragEnd={handleSectionDragEnd}
              >
                <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                  {sectionOrder.map((key) => {
                    const section = allSections.find(s => s.key === key);
                    if (!section) return null;
                    const visible = sectionsVisible[key] !== false;
                    return (
                      <SortableSectionRow
                        key={key}
                        id={key}
                        label={section.label}
                        visible={visible}
                        onToggle={() => toggleSectionVisibility(key)}
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>
              <p className="text-xs text-muted-foreground pt-2">
                💡 Tip: You can also drag sections directly on your live portfolio in Edit Mode.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ ACCOUNT TAB ═══ */}
        <TabsContent value="account" className="space-y-6 mt-6">
          {/* Billing */}
          {isPro && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Star className="h-4 w-4" /> Billing & Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Pro</Badge>
                  <span className="text-sm text-muted-foreground">Active subscription</span>
                </div>
                <Button variant="outline" onClick={async () => {
                  try {
                    const { data, error } = await supabase.functions.invoke("customer-portal");
                    if (error) throw error;
                    if (data?.url) window.open(data.url, "_blank");
                  } catch (err: any) { toast({ title: "Error", description: err.message || "Could not open billing portal", variant: "destructive" }); }
                }}>
                  <ExternalLink className="mr-2 h-4 w-4" /> Manage Billing
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Data Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Download className="h-4 w-4" /> Export Data</CardTitle>
              <CardDescription>Download all your portfolio data as a JSON file</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={handleExportData} disabled={exporting}>
                {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Export All Data
              </Button>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="h-4 w-4" /> Change Password</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>New Password</Label><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" /></div>
              <div><Label>Confirm Password</Label><Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" /></div>
              <Button onClick={handleChangePassword} disabled={changingPassword || !newPassword}>
                {changingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Change Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mail className="h-4 w-4" /> Change Email</CardTitle>
              <CardDescription>A confirmation link will be sent to the new address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Current email</Label><p className="text-sm text-muted-foreground">{user?.email || "—"}</p></div>
              <div><Label>New Email</Label><Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new@email.com" /></div>
              <Button onClick={async () => {
                if (!newEmail.trim() || !newEmail.includes("@")) { toast({ title: "Invalid email", variant: "destructive" }); return; }
                setChangingEmail(true);
                const { error } = await supabase.auth.updateUser({ email: newEmail });
                if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
                else { toast({ title: "Confirmation sent", description: "Check your new email to confirm." }); setNewEmail(""); }
                setChangingEmail(false);
              }} disabled={changingEmail || !newEmail}>
                {changingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update Email
              </Button>
            </CardContent>
          </Card>

          {/* Session Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lock className="h-4 w-4" /> Session Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={async () => {
                const { error } = await supabase.auth.signOut({ scope: 'others' });
                if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
                else { toast({ title: "Done", description: "All other sessions have been signed out." }); }
              }}>Sign Out Other Devices</Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-4 w-4" /> Danger Zone</CardTitle>
              <CardDescription>Permanently delete your account and all data. Cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Type <span className="font-mono font-bold">DELETE</span> to confirm</Label>
                <Input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="DELETE" className="max-w-xs" />
              </div>
              <Button variant="destructive" disabled={deleteConfirmText !== "DELETE" || deletingAccount}
                onClick={async () => {
                  if (!user) return;
                  setDeletingAccount(true);
                  try {
                    // Call edge function to properly delete auth user + profile
                    const { error } = await supabase.functions.invoke("delete-account");
                    if (error) throw error;
                    await supabase.auth.signOut();
                    toast({ title: "Account deleted", description: "Your account and data have been removed." });
                    window.location.href = "/";
                  } catch (err: any) {
                    toast({ title: "Error", description: "Could not delete account. Please contact support.", variant: "destructive" });
                    setDeletingAccount(false);
                  }
                }}>
                {deletingAccount ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Delete Account Permanently
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
