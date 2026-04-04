import { useEffect, useState } from "react";
import { Loader2, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const DashboardPreview = () => {
  const { user } = useAuth();
  const [slug, setSlug] = useState<string | null>(null);
  const [profileType, setProfileType] = useState<string>("screenwriter");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isPublished, setIsPublished] = useState(false);

  // Current draft design state
  const [currentTheme, setCurrentTheme] = useState("cinematic-dark");
  const [currentLayout, setCurrentLayout] = useState("classic");
  const [currentHero, setCurrentHero] = useState("classic");
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [sectionsVisible, setSectionsVisible] = useState<Record<string, boolean>>({});
  const [allSections, setAllSections] = useState<{ key: string; label: string }[]>([]);
  const [savedSnapshot, setSavedSnapshot] = useState<{
    theme: string;
    layout: string;
    hero: string;
    sectionOrder: string[];
    sectionsVisible: Record<string, boolean>;
  } | null>(null);

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
      .select("slug, profile_type, theme, layout_preset, hero_style, section_order, sections_visible, is_published")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setSlug(data?.slug || null);
        const pt = (data as any)?.profile_type || "screenwriter";
        setProfileType(pt);
        const theme = data?.theme || "cinematic-dark";
        const layout = (data as any)?.layout_preset || "classic";
        const hero = (data as any)?.hero_style || "classic";
        setCurrentTheme(theme);
        setCurrentLayout(layout);
        setCurrentHero(hero);
        setIsPublished(Boolean((data as any)?.is_published));

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
        const mergedVisibility = (data as any)?.sections_visible && typeof (data as any).sections_visible === "object"
          ? { ...defaultVisible, ...((data as any).sections_visible as Record<string, boolean>) }
          : defaultVisible;
        setSavedSnapshot({
          theme,
          layout,
          hero,
          sectionOrder: merged,
          sectionsVisible: mergedVisibility,
        });

        setLoading(false);
      });
  }, [user]);

  const applyUpdate = useCallback(async (updates: Record<string, any>, successText: string) => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(updates as any).eq("id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Could not apply", description: error.message, variant: "destructive" });
      return;
    }
    setRefreshKey(k => k + 1);
    toast({ title: "Updated", description: successText });
  }, [user, toast]);

  const isDirty = savedSnapshot
    ? currentTheme !== savedSnapshot.theme ||
      currentLayout !== savedSnapshot.layout ||
      currentHero !== savedSnapshot.hero ||
      JSON.stringify(sectionOrder) !== JSON.stringify(savedSnapshot.sectionOrder) ||
      JSON.stringify(sectionsVisible) !== JSON.stringify(savedSnapshot.sectionsVisible)
    : false;

  const handleSaveChanges = async () => {
    if (!isDirty) return;
    await applyUpdate(
      {
        theme: currentTheme,
        layout_preset: currentLayout,
        hero_style: currentHero,
        section_order: sectionOrder,
        sections_visible: sectionsVisible,
      },
      "Live edits saved"
    );
    setSavedSnapshot({
      theme: currentTheme,
      layout: currentLayout,
      hero: currentHero,
      sectionOrder: [...sectionOrder],
      sectionsVisible: { ...sectionsVisible },
    });
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
  };

  const handleLayoutChange = (layoutId: string) => {
    setCurrentLayout(layoutId);
  };

  const handleHeroChange = (heroId: string) => {
    setCurrentHero(heroId);
  };

  const handleAutoImprove = () => {
    const best = AUTO_IMPROVE_MAP[profileType] || AUTO_IMPROVE_MAP.default;
    setCurrentTheme(best.theme);
    setCurrentLayout(best.layout);
    setCurrentHero(best.hero);
    toast({ title: "Auto-improved", description: "Suggested updates are ready to save." });
  };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over.id as string);
      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      setSectionOrder(newOrder);
    }
  };

  const toggleSectionVisibility = (key: string) => {
    const next = { ...sectionsVisible, [key]: !sectionsVisible[key] };
    setSectionsVisible(next);
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
          {isDirty && <Badge variant="outline" className="text-[10px]">Unsaved</Badge>}
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
          <Button variant="ghost" size="sm" onClick={() => setRefreshKey(k => k + 1)} disabled={saving}>
            <RefreshCw className={`h-4 w-4 mr-1 ${saving ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={handleSaveChanges} disabled={!isDirty || saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
            Save Live Edits
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open(previewUrl, "_blank")}>
            <ExternalLink className="h-4 w-4 mr-1" /> {isPublished ? "View Live Profile" : "Complete Profile"}
          </Button>
        </div>
      </div>

      {/* ─── Main area: sidebar + preview ─── */}
      <div className="flex-1 overflow-hidden flex">
        {/* ─── Design Studio sidebar ─── */}
        <aside className="w-[280px] xl:w-[300px] shrink-0 border-r border-border overflow-y-auto bg-background">
          <div className="p-3 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">Live Edit Studio</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Edit exactly what your public profile shows, then save</p>
          </div>

          {/* Auto-Improve */}
          <div className="p-3 border-b border-border">
            <Button className="w-full" size="sm" disabled={saving} onClick={handleAutoImprove}>
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
                      disabled={saving}
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
                      disabled={saving}
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
                      disabled={saving}
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
