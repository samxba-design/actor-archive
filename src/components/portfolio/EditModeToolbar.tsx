import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Wand2,
  Save,
  Loader2,
  Eye,
  EyeOff,
  GripVertical,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { portfolioThemeList } from "@/themes/themes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useEditMode } from "./EditModeProvider";

const HERO_LAYOUTS = ["classic", "centered", "split", "minimal", "banner", "sidebar", "editorial", "card", "stacked", "cinematic", "compact"];
const SECTION_LAYOUTS = ["classic", "standard", "cinematic", "compact", "magazine", "spotlight", "timeline", "bento", "minimal", "dashboard"];
const STATUS_COLORS = ["green", "blue", "purple", "gold", "rose"];
const STATUS_ANIMATIONS = ["none", "pulse", "glow", "shimmer"];
const CTA_STYLES = ["solid", "outline", "glass", "gradient"];

const QUICK_PRESETS = [
  { id: "polished", title: "Polished", subtitle: "Best for trust", theme: "charcoal-glass", hero: "classic", layout: "standard" },
  { id: "bold", title: "Bold", subtitle: "Best for leads", theme: "cinematic-dark", hero: "banner", layout: "spotlight" },
  { id: "editorial", title: "Editorial", subtitle: "Best for authority", theme: "warm-luxury", hero: "editorial", layout: "magazine" },
];

function SortableSectionRow({
  id,
  label,
  visible,
  onToggle,
}: {
  id: string;
  label: string;
  visible: boolean;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 }}
      className="flex items-center justify-between rounded-md border px-2 py-1.5 text-xs"
    >
      <div className="flex items-center gap-2">
        <button {...attributes} {...listeners} className="text-muted-foreground hover:text-foreground touch-none cursor-grab active:cursor-grabbing">
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <span className={visible ? "text-foreground" : "text-muted-foreground line-through"}>{label}</span>
      </div>
      <button onClick={onToggle} className="text-muted-foreground hover:text-foreground">
        {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

interface Props {
  profileId?: string;
}

const EditModeToolbar = ({ profileId }: Props) => {
  const { isOwner, sectionOrder, setSectionOrder, sectionsVisible, toggleVisibility, hasChanges, saveLayout, saving } = useEditMode();
  const theme = usePortfolioTheme();
  const { toast } = useToast();

  const [appearanceOpen, setAppearanceOpen] = useState(true);
  const [themeId, setThemeId] = useState("cinematic-dark");
  const [heroStyle, setHeroStyle] = useState("classic");
  const [layoutPreset, setLayoutPreset] = useState("classic");
  const [ctaStyle, setCtaStyle] = useState("solid");
  const [statusBadgeColor, setStatusBadgeColor] = useState("green");
  const [statusBadgeAnimation, setStatusBadgeAnimation] = useState("none");
  const [dirtyAppearance, setDirtyAppearance] = useState(false);
  const [savingAppearance, setSavingAppearance] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    if (!profileId || !isOwner) return;
    supabase
      .from("profiles")
      .select("theme, hero_style, layout_preset, cta_style, status_badge_color, status_badge_animation")
      .eq("id", profileId)
      .single()
      .then(({ data }) => {
        if (!data) return;
        setThemeId((data as any).theme || "cinematic-dark");
        setHeroStyle((data as any).hero_style || "classic");
        setLayoutPreset((data as any).layout_preset || "classic");
        setCtaStyle((data as any).cta_style || "solid");
        setStatusBadgeColor((data as any).status_badge_color || "green");
        setStatusBadgeAnimation((data as any).status_badge_animation || "none");
      });
  }, [profileId, isOwner]);

  const sectionItems = useMemo(
    () => sectionOrder.filter((k) => k !== "hero" && k !== "contact"),
    [sectionOrder]
  );

  if (!isOwner || !profileId) return null;

  const chipClass = "px-2 py-0.5 text-[10px] rounded-full border transition-colors";

  const onSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sectionItems.indexOf(active.id as string);
    const newIndex = sectionItems.indexOf(over.id as string);
    if (oldIndex < 0 || newIndex < 0) return;

    const reorderedVisibleOnly = arrayMove(sectionItems, oldIndex, newIndex);
    const staticKeys = sectionOrder.filter((k) => k === "hero" || k === "contact");
    const next = [...staticKeys.filter((k) => k === "hero"), ...reorderedVisibleOnly, ...staticKeys.filter((k) => k === "contact")];
    setSectionOrder(next);
  };

  const applyPreset = (preset: (typeof QUICK_PRESETS)[number]) => {
    setThemeId(preset.theme);
    setHeroStyle(preset.hero);
    setLayoutPreset(preset.layout);
    setDirtyAppearance(true);
  };

  const saveAppearance = async () => {
    setSavingAppearance(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        theme: themeId,
        hero_style: heroStyle,
        layout_preset: layoutPreset,
        cta_style: ctaStyle,
        status_badge_color: statusBadgeColor,
        status_badge_animation: statusBadgeAnimation,
      } as any)
      .eq("id", profileId);

    setSavingAppearance(false);
    if (error) {
      toast({ title: "Could not save appearance", description: error.message, variant: "destructive" });
      return;
    }
    setDirtyAppearance(false);
    toast({ title: "Appearance saved", description: "Refreshing your live profile." });
    window.location.reload();
  };

  const saveAll = async () => {
    if (hasChanges) await saveLayout();
    if (dirtyAppearance) await saveAppearance();
  };

  return (
    <section className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <div
        className="rounded-xl border p-3 md:p-4 space-y-3"
        style={{ background: theme.bgCard, borderColor: theme.borderDefault }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: theme.textPrimary }}>
            <Sparkles className="h-4 w-4" /> Customize Portfolio
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open(window.location.pathname, "_blank")}>
              <ExternalLink className="h-3.5 w-3.5 mr-1" /> View Live
            </Button>
            <Button size="sm" onClick={saveAll} disabled={saving || savingAppearance || (!hasChanges && !dirtyAppearance)}>
              {(saving || savingAppearance) ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1" />}
              Save
            </Button>
          </div>
        </div>

        <div className="rounded-lg border p-3" style={{ borderColor: theme.borderDefault }}>
          <p className="text-[10px] mb-2 uppercase tracking-wider font-semibold" style={{ color: theme.accentPrimary }}>Quick Presets</p>
          <div className="grid md:grid-cols-3 gap-2">
            {QUICK_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="text-left rounded-lg border px-3 py-2"
                style={{ borderColor: theme.borderDefault }}
              >
                <p className="text-xs font-semibold" style={{ color: theme.textPrimary }}>{preset.title}</p>
                <p className="text-[10px]" style={{ color: theme.textTertiary }}>{preset.subtitle}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border p-3" style={{ borderColor: theme.borderDefault }}>
          <button className="w-full flex items-center justify-between" onClick={() => setAppearanceOpen((v) => !v)}>
            <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: theme.accentPrimary }}>
              <Wand2 className="inline h-3 w-3 mr-1" /> Appearance
            </p>
            {appearanceOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          {appearanceOpen && (
            <div className="space-y-3 mt-3">
              <div>
                <p className="text-[10px] mb-1 uppercase tracking-wider" style={{ color: theme.textTertiary }}>Theme</p>
                <div className="flex flex-wrap gap-1">
                  {portfolioThemeList.slice(0, 12).map((t) => (
                    <button key={t.id} onClick={() => { setThemeId(t.id); setDirtyAppearance(true); }} className={chipClass}
                      style={{ borderColor: themeId === t.id ? theme.accentPrimary : theme.borderDefault, color: themeId === t.id ? theme.accentPrimary : theme.textSecondary }}>
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] mb-1 uppercase tracking-wider" style={{ color: theme.textTertiary }}>Hero Layout</p>
                <div className="flex flex-wrap gap-1">
                  {HERO_LAYOUTS.map((option) => (
                    <button key={option} onClick={() => { setHeroStyle(option); setDirtyAppearance(true); }} className={`${chipClass} capitalize`}
                      style={{ borderColor: heroStyle === option ? theme.accentPrimary : theme.borderDefault, color: heroStyle === option ? theme.accentPrimary : theme.textSecondary }}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] mb-1 uppercase tracking-wider" style={{ color: theme.textTertiary }}>Section Layout</p>
                <div className="flex flex-wrap gap-1">
                  {SECTION_LAYOUTS.map((option) => (
                    <button key={option} onClick={() => { setLayoutPreset(option); setDirtyAppearance(true); }} className={`${chipClass} capitalize`}
                      style={{ borderColor: layoutPreset === option ? theme.accentPrimary : theme.borderDefault, color: layoutPreset === option ? theme.accentPrimary : theme.textSecondary }}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] mb-1 uppercase tracking-wider" style={{ color: theme.textTertiary }}>Status Badge</p>
                  <div className="flex flex-wrap gap-1">
                    {STATUS_COLORS.map((option) => (
                      <button key={option} onClick={() => { setStatusBadgeColor(option); setDirtyAppearance(true); }} className={`${chipClass} capitalize`}
                        style={{ borderColor: statusBadgeColor === option ? theme.accentPrimary : theme.borderDefault, color: statusBadgeColor === option ? theme.accentPrimary : theme.textSecondary }}>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] mb-1 uppercase tracking-wider" style={{ color: theme.textTertiary }}>Badge Effect</p>
                  <div className="flex flex-wrap gap-1">
                    {STATUS_ANIMATIONS.map((option) => (
                      <button key={option} onClick={() => { setStatusBadgeAnimation(option); setDirtyAppearance(true); }} className={`${chipClass} capitalize`}
                        style={{ borderColor: statusBadgeAnimation === option ? theme.accentPrimary : theme.borderDefault, color: statusBadgeAnimation === option ? theme.accentPrimary : theme.textSecondary }}>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] mb-1 uppercase tracking-wider" style={{ color: theme.textTertiary }}>CTA Style</p>
                <div className="flex flex-wrap gap-1">
                  {CTA_STYLES.map((option) => (
                    <button key={option} onClick={() => { setCtaStyle(option); setDirtyAppearance(true); }} className={`${chipClass} capitalize`}
                      style={{ borderColor: ctaStyle === option ? theme.accentPrimary : theme.borderDefault, color: ctaStyle === option ? theme.accentPrimary : theme.textSecondary }}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg border p-3" style={{ borderColor: theme.borderDefault }}>
          <p className="text-[10px] mb-2 uppercase tracking-wider font-semibold" style={{ color: theme.accentPrimary }}>Sections</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onSectionDragEnd}>
            <SortableContext items={sectionItems} strategy={verticalListSortingStrategy}>
              <div className="space-y-1.5">
                {sectionItems.map((key) => (
                  <SortableSectionRow
                    key={key}
                    id={key}
                    label={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    visible={sectionsVisible[key] !== false}
                    onToggle={() => toggleVisibility(key)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <div className="mt-2 rounded-md border px-2 py-1.5 text-[11px] flex items-center gap-2" style={{ borderColor: theme.borderDefault, color: theme.textTertiary }}>
            <Check className="h-3.5 w-3.5" /> Try it: Drag sections to reorder, toggle visibility with the eye icon.
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditModeToolbar;
