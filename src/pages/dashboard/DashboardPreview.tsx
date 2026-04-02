import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2, Monitor, Tablet, Smartphone, ExternalLink, ArrowLeft, RefreshCw,
  Sparkles, Palette, Layout, Columns, Eye, EyeOff, GripVertical, Check, ChevronDown, Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { portfolioThemeList } from "@/themes/themes";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getProfileTypeConfig, getMergedSections, type SectionConfig } from "@/config/profileSections";

type Breakpoint = "desktop" | "tablet" | "mobile";

const BREAKPOINT_WIDTHS: Record<Breakpoint, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

const LAYOUT_PRESETS = [
  { id: "classic", label: "Classic", desc: "Single-column" },
  { id: "standard", label: "Standard", desc: "Clean, professional" },
  { id: "cinematic", label: "Cinematic", desc: "Widescreen" },
  { id: "compact", label: "Compact", desc: "Dense, info-rich" },
  { id: "magazine", label: "Magazine", desc: "Multi-column" },
  { id: "spotlight", label: "Spotlight", desc: "Featured work" },
  { id: "timeline", label: "Timeline", desc: "Chronological" },
  { id: "bento", label: "Bento", desc: "Grid cards" },
  { id: "minimal", label: "Minimal", desc: "Max whitespace" },
  { id: "dashboard", label: "Dashboard", desc: "Metrics-forward" },
];

const HERO_LAYOUTS = [
  { id: "classic", label: "Classic" },
  { id: "centered", label: "Centered" },
  { id: "split", label: "Split" },
  { id: "minimal", label: "Minimal" },
  { id: "banner", label: "Banner" },
  { id: "sidebar", label: "Sidebar" },
  { id: "editorial", label: "Editorial" },
  { id: "card", label: "Card" },
  { id: "stacked", label: "Stacked" },
  { id: "cinematic", label: "Cinematic" },
  { id: "compact", label: "Compact" },
];

const RECOMMENDED: Record<string, { themes: string[]; layouts: string[]; heroLayouts: string[] }> = {
  copywriter: { themes: ["charcoal-glass", "frost", "slate-pro"], layouts: ["magazine", "bento"], heroLayouts: ["centered", "minimal"] },
  actor: { themes: ["cinematic-dark", "neon-noir", "charcoal-glass"], layouts: ["classic", "spotlight"], heroLayouts: ["classic", "banner"] },
  screenwriter: { themes: ["cinematic-dark", "warm-luxury", "gothic"], layouts: ["classic", "minimal"], heroLayouts: ["classic", "cinematic"] },
  director: { themes: ["noir-classic", "midnight-glass", "cinematic-dark"], layouts: ["cinematic", "bento"], heroLayouts: ["cinematic", "banner"] },
  journalist: { themes: ["warm-luxury", "slate-pro", "frost"], layouts: ["magazine", "classic"], heroLayouts: ["editorial", "classic"] },
  author: { themes: ["warm-luxury", "mediterranean", "pearl"], layouts: ["minimal", "classic"], heroLayouts: ["minimal", "centered"] },
  corporate_video: { themes: ["frost", "slate-pro", "azure-glass"], layouts: ["standard", "bento"], heroLayouts: ["classic", "split"] },
  playwright: { themes: ["gothic", "warm-luxury", "cinematic-dark"], layouts: ["classic", "timeline"], heroLayouts: ["editorial", "cinematic"] },
  tv_writer: { themes: ["cinematic-dark", "neon-noir", "charcoal-glass"], layouts: ["magazine", "classic"], heroLayouts: ["classic", "banner"] },
};

const SUGGESTIONS: Record<string, string[]> = {
  copywriter: [
    "Add case studies to showcase measurable results",
    "Include client logos to build social proof",
    "Feature testimonials from satisfied clients",
    "Upload writing samples in Published Works",
  ],
  actor: [
    "Upload a demo reel to grab attention immediately",
    "Add headshots to your gallery for casting directors",
    "Complete your actor stats (height, age range, etc.)",
    "List your representation info",
  ],
  screenwriter: [
    "Add loglines to each project for quick pitching",
    "Upload script samples to your Script Library",
    "Add awards and festival selections",
    "Include production history for produced work",
  ],
  director: [
    "Feature your best demo reel prominently",
    "Add production history with crew credits",
    "Include press coverage and reviews",
    "Showcase festival selections and awards",
  ],
  default: [
    "Add a professional photo to your profile",
    "Write a compelling bio that showcases your expertise",
    "Add at least 3 projects to your portfolio",
    "Include testimonials from colleagues or clients",
  ],
};

const AUTO_IMPROVE_MAP: Record<string, { theme: string; layout: string; hero: string }> = {
  copywriter: { theme: "charcoal-glass", layout: "magazine", hero: "centered" },
  actor: { theme: "cinematic-dark", layout: "classic", hero: "classic" },
  screenwriter: { theme: "cinematic-dark", layout: "classic", hero: "classic" },
  director: { theme: "noir-classic", layout: "cinematic", hero: "cinematic" },
  journalist: { theme: "warm-luxury", layout: "magazine", hero: "editorial" },
  author: { theme: "warm-luxury", layout: "minimal", hero: "minimal" },
  corporate_video: { theme: "frost", layout: "standard", hero: "classic" },
  default: { theme: "charcoal-glass", layout: "classic", hero: "centered" },
};

// ─── Sortable section row ────────────────────────────────────────────────────
function SortableSectionRow({ id, label, visible, onToggle }: { id: string; label: string; visible: boolean; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className={`flex items-center justify-between py-1.5 px-2 rounded-md border text-xs transition-colors ${isDragging ? "shadow-lg z-50 bg-accent" : "border-border bg-background hover:bg-accent/30"}`}
    >
      <div className="flex items-center gap-2">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none">
          <GripVertical className="h-3 w-3" />
        </button>
        <span className={`select-none ${visible ? "text-foreground" : "text-muted-foreground line-through"}`}>{label}</span>
      </div>
      <button onClick={onToggle} className="p-0.5 rounded hover:bg-accent transition-colors">
        {visible ? <Eye className="h-3 w-3 text-foreground" /> : <EyeOff className="h-3 w-3 text-muted-foreground" />}
      </button>
    </div>
  );
}

const DashboardPreview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [slug, setSlug] = useState<string | null>(null);
  const [profileType, setProfileType] = useState<string>("screenwriter");
  const [loading, setLoading] = useState(true);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const [applying, setApplying] = useState(false);

  // Current design state
  const [currentTheme, setCurrentTheme] = useState("cinematic-dark");
  const [currentLayout, setCurrentLayout] = useState("classic");
  const [currentHero, setCurrentHero] = useState("classic");
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [sectionsVisible, setSectionsVisible] = useState<Record<string, boolean>>({});
  const [allSections, setAllSections] = useState<{ key: string; label: string }[]>([]);

  // Sidebar collapsible state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    suggestions: true, themes: false, layouts: false, hero: false, sections: false,
  });

  const dndSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const recs = RECOMMENDED[profileType] || RECOMMENDED.screenwriter;

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("slug, profile_type, theme, layout_preset, hero_style, section_order, sections_visible")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setSlug(data?.slug || null);
        const pt = (data as any)?.profile_type || "screenwriter";
        setProfileType(pt);
        setCurrentTheme(data?.theme || "cinematic-dark");
        setCurrentLayout((data as any)?.layout_preset || "classic");
        setCurrentHero((data as any)?.hero_style || "classic");

        // Build sections
        let sections: { key: string; label: string }[] = [];
        const sectionConfigs = pt === "multi_hyphenate"
          ? getMergedSections(pt, [])
          : (getProfileTypeConfig(pt)?.sections || []);
        sections = sectionConfigs
          .filter((s: SectionConfig) => s.key !== "hero" && s.key !== "contact")
          .map((s: SectionConfig) => ({ key: s.key, label: s.label }));
        if (sections.length === 0) {
          sections = [
            { key: "projects", label: "Projects" }, { key: "gallery", label: "Gallery" },
            { key: "services", label: "Services" }, { key: "awards", label: "Awards" },
            { key: "testimonials", label: "Testimonials" },
          ];
        }
        setAllSections(sections);
        const savedOrder = (data as any)?.section_order || [];
        const sectionKeys = sections.map(s => s.key);
        const merged = savedOrder.filter((k: string) => sectionKeys.includes(k));
        sectionKeys.forEach(k => { if (!merged.includes(k)) merged.push(k); });
        setSectionOrder(merged);
        const defaultVisible = Object.fromEntries(sectionKeys.map(k => [k, true]));
        if ((data as any)?.sections_visible && typeof (data as any).sections_visible === "object") {
          setSectionsVisible({ ...defaultVisible, ...((data as any).sections_visible as Record<string, boolean>) });
        } else {
          setSectionsVisible(defaultVisible);
        }

        setLoading(false);
      });
  }, [user]);

  const applyUpdate = useCallback(async (updates: Record<string, any>, successText: string) => {
    if (!user) return;
    setApplying(true);
    const { error } = await supabase.from("profiles").update(updates as any).eq("id", user.id);
    setApplying(false);
    if (error) {
      toast({ title: "Could not apply", description: error.message, variant: "destructive" });
      return;
    }
    setRefreshKey(k => k + 1);
    toast({ title: "Updated", description: successText });
  }, [user, toast]);

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    applyUpdate({ theme: themeId }, `Theme changed to ${portfolioThemeList.find(t => t.id === themeId)?.name || themeId}`);
  };

  const handleLayoutChange = (layoutId: string) => {
    setCurrentLayout(layoutId);
    applyUpdate({ layout_preset: layoutId }, `Layout changed to ${layoutId}`);
  };

  const handleHeroChange = (heroId: string) => {
    setCurrentHero(heroId);
    applyUpdate({ hero_style: heroId }, `Hero changed to ${heroId}`);
  };

  const handleAutoImprove = () => {
    const best = AUTO_IMPROVE_MAP[profileType] || AUTO_IMPROVE_MAP.default;
    setCurrentTheme(best.theme);
    setCurrentLayout(best.layout);
    setCurrentHero(best.hero);
    applyUpdate(
      { theme: best.theme, layout_preset: best.layout, hero_style: best.hero },
      "Auto-optimized your profile design for maximum impact!"
    );
  };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over.id as string);
      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      setSectionOrder(newOrder);
      applyUpdate({ section_order: newOrder }, "Section order updated");
    }
  };

  const toggleSectionVisibility = (key: string) => {
    const next = { ...sectionsVisible, [key]: !sectionsVisible[key] };
    setSectionsVisible(next);
    applyUpdate({ sections_visible: next }, `${key} ${next[key] ? "shown" : "hidden"}`);
  };

  const togglePanel = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!slug) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <p className="text-muted-foreground text-sm">Set a portfolio URL first.</p>
        <Button onClick={() => navigate("/dashboard/settings")}>Go to Settings</Button>
      </div>
    );
  }

  const previewUrl = `/p/${slug}`;
  const frameWidth = BREAKPOINT_WIDTHS[breakpoint];
  const suggestions = SUGGESTIONS[profileType] || SUGGESTIONS.default;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* ─── Top toolbar ─── */}
      <div className="flex items-center justify-between gap-4 px-1 pb-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <span className="text-sm text-muted-foreground font-mono">/p/{slug}</span>
          <Badge variant="secondary" className="text-[10px]">{profileType.replace(/_/g, " ")}</Badge>
        </div>

        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {(["desktop", "tablet", "mobile"] as Breakpoint[]).map((bp) => {
            const Icon = bp === "desktop" ? Monitor : bp === "tablet" ? Tablet : Smartphone;
            return (
              <button
                key={bp}
                onClick={() => setBreakpoint(bp)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  breakpoint === bp ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{bp.charAt(0).toUpperCase() + bp.slice(1)}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setRefreshKey(k => k + 1)} disabled={applying}>
            <RefreshCw className={`h-4 w-4 mr-1 ${applying ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open(previewUrl, "_blank")}>
            <ExternalLink className="h-4 w-4 mr-1" /> Open
          </Button>
        </div>
      </div>

      {/* ─── Main area: sidebar + preview ─── */}
      <div className="flex-1 overflow-hidden flex">
        {/* ─── Design Studio sidebar ─── */}
        <aside className="w-[280px] xl:w-[300px] shrink-0 border-r border-border overflow-y-auto bg-background">
          <div className="p-3 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">Design Studio</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Changes apply instantly to the preview</p>
          </div>

          {/* Auto-Improve */}
          <div className="p-3 border-b border-border">
            <Button className="w-full" size="sm" disabled={applying} onClick={handleAutoImprove}>
              <Sparkles className="h-4 w-4 mr-1" /> Auto-Improve Profile
            </Button>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              Applies the optimal theme, layout, and hero for {profileType.replace(/_/g, " ")}s.
            </p>
          </div>

          {/* ─── Suggestions ─── */}
          <Collapsible open={openSections.suggestions} onOpenChange={() => togglePanel("suggestions")}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-xs font-semibold text-foreground hover:bg-accent/30 transition-colors">
              <span className="flex items-center gap-1.5"><Lightbulb className="h-3.5 w-3.5" /> Smart Suggestions</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openSections.suggestions ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3 space-y-1.5">
              {suggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground p-2 rounded-md bg-accent/20 border border-border/50">
                  <span className="text-primary shrink-0 mt-px">→</span>
                  <span>{s}</span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* ─── Themes ─── */}
          <Collapsible open={openSections.themes} onOpenChange={() => togglePanel("themes")}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-xs font-semibold text-foreground hover:bg-accent/30 transition-colors border-t border-border">
              <span className="flex items-center gap-1.5"><Palette className="h-3.5 w-3.5" /> Theme</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openSections.themes ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3">
              <div className="grid grid-cols-3 gap-1.5">
                {portfolioThemeList.map((t) => {
                  const isSelected = currentTheme === t.id;
                  const isRecommended = recs.themes.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleThemeChange(t.id)}
                      disabled={applying}
                      className={`relative rounded-lg border overflow-hidden transition-all ${
                        isSelected ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="h-8 flex items-end p-1 gap-0.5" style={{ background: t.bgPrimary || t.previewColors[0] }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: t.accentPrimary || t.previewColors[2] }} />
                        <div className="flex-1 h-1 rounded-full" style={{ background: t.textPrimary || t.previewColors[1], opacity: 0.5 }} />
                      </div>
                      <div className="px-1 py-0.5 bg-card">
                        <p className="text-[8px] font-medium text-foreground truncate">{t.name}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-2 w-2 text-primary-foreground" />
                        </div>
                      )}
                      {isRecommended && !isSelected && (
                        <div className="absolute top-0.5 left-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-[9px] text-muted-foreground mt-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-1 align-middle" />
                Recommended for {profileType.replace(/_/g, " ")}
              </p>
            </CollapsibleContent>
          </Collapsible>

          {/* ─── Layout ─── */}
          <Collapsible open={openSections.layouts} onOpenChange={() => togglePanel("layouts")}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-xs font-semibold text-foreground hover:bg-accent/30 transition-colors border-t border-border">
              <span className="flex items-center gap-1.5"><Layout className="h-3.5 w-3.5" /> Layout</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openSections.layouts ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3">
              <div className="grid grid-cols-2 gap-1.5">
                {LAYOUT_PRESETS.map((l) => {
                  const isSelected = currentLayout === l.id;
                  const isRecommended = recs.layouts.includes(l.id);
                  return (
                    <button
                      key={l.id}
                      onClick={() => handleLayoutChange(l.id)}
                      disabled={applying}
                      className={`text-left p-2 rounded-md border text-[11px] transition-all ${
                        isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-foreground">{l.label}</span>
                        {isRecommended && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                        {isSelected && <Check className="h-2.5 w-2.5 text-primary ml-auto" />}
                      </div>
                      <p className="text-[9px] text-muted-foreground">{l.desc}</p>
                    </button>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* ─── Hero ─── */}
          <Collapsible open={openSections.hero} onOpenChange={() => togglePanel("hero")}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-xs font-semibold text-foreground hover:bg-accent/30 transition-colors border-t border-border">
              <span className="flex items-center gap-1.5"><Columns className="h-3.5 w-3.5" /> Hero Layout</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openSections.hero ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3">
              <div className="grid grid-cols-3 gap-1.5">
                {HERO_LAYOUTS.map((h) => {
                  const isSelected = currentHero === h.id;
                  const isRecommended = recs.heroLayouts.includes(h.id);
                  return (
                    <button
                      key={h.id}
                      onClick={() => handleHeroChange(h.id)}
                      disabled={applying}
                      className={`p-1.5 rounded-md border text-[10px] font-medium transition-all ${
                        isSelected ? "border-primary bg-primary/10 text-foreground" : "border-border hover:border-primary/40 text-muted-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {h.label}
                        {isRecommended && <span className="w-1 h-1 rounded-full bg-primary" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* ─── Sections ─── */}
          <Collapsible open={openSections.sections} onOpenChange={() => togglePanel("sections")}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-xs font-semibold text-foreground hover:bg-accent/30 transition-colors border-t border-border">
              <span className="flex items-center gap-1.5"><GripVertical className="h-3.5 w-3.5" /> Sections</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openSections.sections ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3 space-y-1">
              <DndContext sensors={dndSensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
                <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                  {sectionOrder.map((key) => {
                    const section = allSections.find(s => s.key === key);
                    if (!section) return null;
                    return (
                      <SortableSectionRow
                        key={key}
                        id={key}
                        label={section.label}
                        visible={sectionsVisible[key] !== false}
                        onToggle={() => toggleSectionVisibility(key)}
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>
              <p className="text-[9px] text-muted-foreground pt-1">Drag to reorder • Click eye to toggle</p>
            </CollapsibleContent>
          </Collapsible>
        </aside>

        {/* ─── Preview iframe ─── */}
        <div className="flex-1 overflow-auto bg-muted/20 p-4">
          <div className="flex items-start justify-center">
            <div
              className="relative bg-background rounded-xl overflow-hidden shadow-2xl ring-1 ring-border transition-all duration-300"
              style={{ width: `${frameWidth}px`, maxWidth: "100%", minHeight: "600px" }}
            >
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/70 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/15" />
                </div>
                <div className="flex-1 bg-background rounded-md px-3 py-0.5 text-[10px] text-muted-foreground font-mono">
                  creativeslate.com/p/{slug}
                </div>
              </div>
              <iframe
                key={refreshKey}
                src={previewUrl}
                className="w-full border-0"
                style={{ height: "calc(100vh - 10rem)", minHeight: "600px" }}
                title="Portfolio Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
