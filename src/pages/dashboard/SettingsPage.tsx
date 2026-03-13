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
import { Loader2, Save, ExternalLink, ArrowUp, ArrowDown, Eye, EyeOff, Lock, Search, Check, Layout, Columns, Star } from "lucide-react";
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
  const [knownForPosition, setKnownForPosition] = useState<KnownForPosition>("hero_above_name");
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
  });
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [sectionsVisible, setSectionsVisible] = useState<Record<string, boolean>>({});
  const [allSections, setAllSections] = useState<{ key: string; label: string }[]>([]);

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("slug, theme, accent_color, is_published, show_contact_form, available_for_hire, seeking_representation, cta_label, cta_url, cta_type, booking_url, section_order, sections_visible, profile_type, secondary_types, auto_responder_enabled, auto_responder_message, font_pairing, layout_density, layout_preset, custom_css, seo_indexable, contact_mode, hero_style, known_for_position")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          const pt = data.profile_type || null;
          const st = (data as any).secondary_types || [];
          setProfileType(pt);
          setSecondaryTypes(st);
          setHeroStyle((data as any).hero_style || "full");
          setKnownForPosition(((data as any).known_for_position as KnownForPosition) || "hero_above_name");

          // Build sections list from profile type config
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
            slug: data.slug || "",
            theme: data.theme || "cinematic-dark",
            accent_color: data.accent_color || "#C41E3A",
            is_published: data.is_published || false,
            show_contact_form: data.show_contact_form !== false,
            available_for_hire: data.available_for_hire || false,
            seeking_representation: data.seeking_representation || false,
            cta_label: (data as any).cta_label || "",
            cta_url: (data as any).cta_url || "",
            cta_type: (data as any).cta_type || "contact_form",
            booking_url: (data as any).booking_url || "",
            contact_mode: (data as any).contact_mode || "form",
            auto_responder_enabled: (data as any).auto_responder_enabled || false,
            auto_responder_message: (data as any).auto_responder_message || "",
            font_pairing: (data as any).font_pairing || "default",
            layout_density: (data as any).layout_density || "spacious",
            layout_preset: (data as any).layout_preset || "classic",
            custom_css: (data as any).custom_css || "",
            seo_indexable: (data as any).seo_indexable || false,
          });
        }
        setLoading(false);
      });
  }, [user]);

  const rebuildSections = (pt: string | null, st: string[]) => {
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

    const { error } = await supabase
      .from("profiles")
      .update({ profile_type: newType, secondary_types: [] } as any)
      .eq("id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    rebuildSections(newType, []);
    toast({ title: "Profile type updated", description: `Switched to ${PROFILE_TYPES.find(p => p.key === newType)?.label || newType}. Section layout has been reset.` });
  };

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
        contact_mode: form.contact_mode || "form",
        section_order: sectionOrder,
        sections_visible: sectionsVisible,
        auto_responder_enabled: form.auto_responder_enabled,
        auto_responder_message: form.auto_responder_message || null,
        font_pairing: form.font_pairing || "default",
        layout_density: form.layout_density || "spacious",
        layout_preset: form.layout_preset || "classic",
        custom_css: form.custom_css || null,
        seo_indexable: form.seo_indexable,
        hero_style: heroStyle || "full",
        known_for_position: knownForPosition || "hero_above_name",
      } as any)
      .eq("id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      // Update context slug
      setContextSlug(form.slug || null);
      toast({ title: "Saved", description: "Settings updated." });
      clearDraft();
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords don't match.", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated", description: "Your password has been changed." });
      setNewPassword("");
      setConfirmPassword("");
    }
    setChangingPassword(false);
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

  const { clearDraft } = useFormDraft("settings-page", form, setForm as any);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Themes, layouts, sections, and visibility — everything here is fully customizable</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save
        </Button>
      </div>

      {/* Profile Type Switcher */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Type</CardTitle>
          <CardDescription>Your profile type determines which sections, labels, and tools are shown throughout the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PROFILE_TYPES.filter(pt => pt.key !== "multi_hyphenate").map((pt) => (
              <button
                key={pt.key}
                onClick={() => handleProfileTypeChange(pt.key)}
                className={`text-left p-3 rounded-lg border transition-all text-sm ${
                  profileType === pt.key
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border hover:border-primary/40 hover:bg-accent/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{pt.label}</span>
                  {profileType === pt.key && <Check className="h-3.5 w-3.5 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{pt.description.split(".")[0]}.</p>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">⚠️ Changing type will reset your section layout to match the new profile type.</p>
        </CardContent>
      </Card>

      {/* Hero Layout Picker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Columns className="h-4 w-4" /> Hero Layout</CardTitle>
          <CardDescription>Choose how your hero section is structured on the portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {HERO_LAYOUTS.map((layout) => (
              <button
                key={layout.id}
                onClick={() => setHeroStyle(layout.id)}
                className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                  heroStyle === layout.id
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border hover:border-primary/40 hover:bg-accent/50"
                }`}
              >
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

      {/* Known For Position Picker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Star className="h-4 w-4" /> Known For Position</CardTitle>
          <CardDescription>Choose where your "Known For" poster cards appear on the portfolio. Posters are sourced from projects marked as Notable (via the ⭐ toggle in Projects Manager), and images come from TMDB auto-fetch or manual uploads.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {KNOWN_FOR_POSITIONS.map((pos) => (
              <button
                key={pos.id}
                onClick={() => setKnownForPosition(pos.id)}
                className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                  knownForPosition === pos.id
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border hover:border-primary/40 hover:bg-accent/50"
                }`}
              >
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

      {/* Layout Preset Picker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Layout className="h-4 w-4" /> Layout Preset</CardTitle>
          <CardDescription>Structural layout of your portfolio page — affects how sections are arranged</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LAYOUT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setForm(f => ({ ...f, layout_preset: preset.id }))}
                className={`text-left p-3 rounded-lg border transition-all text-sm ${
                  form.layout_preset === preset.id
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border hover:border-primary/40 hover:bg-accent/50"
                }`}
              >
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
          <CardContent className="space-y-4">
            <a href={`/p/${form.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary flex items-center gap-1 hover:underline">
              /p/{form.slug} <ExternalLink className="h-3 w-3" />
            </a>
            <div className="pt-3 border-t border-border space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Search className="h-3.5 w-3.5" />
                    Allow Search Engine Indexing
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {form.seo_indexable
                      ? "Your portfolio can be found via Google and other search engines"
                      : "Your portfolio is only accessible via direct link (recommended for privacy)"}
                  </p>
                </div>
                <Switch checked={form.seo_indexable} onCheckedChange={(v) => setForm((f) => ({ ...f, seo_indexable: v }))} />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Custom Domain - Coming Soon */}
      <Card className="opacity-70">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Custom Domain</CardTitle>
            <ProBadge />
            <Badge variant="outline" className="text-[10px]">Coming Soon</Badge>
          </div>
          <CardDescription>Connect your own domain (e.g. yourname.com) to your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Input placeholder="yourname.com" disabled className="flex-1 opacity-50" />
            <Button disabled variant="outline" size="sm">Connect</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Custom domains will be available soon for Pro users. Stay tuned!</p>
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

      {/* Theme */}
      <Card>
        <CardHeader><CardTitle>Theme & Typography</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label>Visual Theme</Label>
              {!isPro && <ProBadge />}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {portfolioThemeList.map((t) => {
                const isFree = ["cinematic-dark", "modern-minimal"].includes(t.id);
                const isLocked = !isPro && !isFree;
                return (
                  <button
                    key={t.id}
                    onClick={() => !isLocked && setForm((f) => ({ ...f, theme: t.id }))}
                    disabled={isLocked}
                    className={`text-left p-3 rounded-lg border transition-all text-sm ${
                      form.theme === t.id
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : isLocked
                          ? "border-border opacity-50 cursor-not-allowed"
                          : "border-border hover:border-primary/40 hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-xs">{t.name}</span>
                      {form.theme === t.id && <Check className="h-3 w-3 text-primary" />}
                      {isLocked && <Lock className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    <div className="flex gap-1 mt-1.5">
                      {t.previewColors.slice(0, 5).map((c, i) => (
                        <div key={i} className="w-4 h-4 rounded-full border border-border/50" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{t.description}</p>
                  </button>
                );
              })}
            </div>
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
            <p className="text-xs text-muted-foreground mt-1">Override the theme's default fonts</p>
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
          <CardDescription>Advanced: inject custom styles into your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={form.custom_css}
            onChange={(e) => setForm((f) => ({ ...f, custom_css: e.target.value }))}
            rows={6}
            placeholder={`.portfolio-container h2 {\n  text-transform: uppercase;\n}`}
            className="font-mono text-xs"
            disabled={!isPro}
          />
          <p className="text-xs text-muted-foreground mt-1">CSS is scoped to your portfolio page only</p>
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
            <p className="text-xs text-muted-foreground mt-1">
              {form.contact_mode === "agent" ? "Visitors will see your agent/rep contact instead of a form" :
               form.contact_mode === "both" ? "Both the contact form and your agent info will be shown" :
               form.contact_mode === "none" ? "No contact options will be shown on your portfolio" :
               "Visitors can message you directly via the contact form"}
            </p>
          </div>
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
              <Textarea
                value={form.auto_responder_message}
                onChange={(e) => setForm((f) => ({ ...f, auto_responder_message: e.target.value }))}
                rows={4}
                placeholder="Thanks for reaching out! I'll get back to you within 48 hours."
              />
              <p className="text-xs text-muted-foreground mt-1">This message will be shown to visitors after they submit a contact form</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Visibility & Reorder */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Sections</CardTitle>
          <CardDescription>Toggle visibility and reorder sections on your portfolio. Changes are saved when you click Save above.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {sectionOrder.map((key, index) => {
            const section = allSections.find(s => s.key === key);
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

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock className="h-4 w-4" />Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" minLength={6} />
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button onClick={handleChangePassword} disabled={changingPassword || !newPassword}>
            {changingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
