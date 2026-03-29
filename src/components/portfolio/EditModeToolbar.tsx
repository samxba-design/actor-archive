/**
 * EditModeToolbar.tsx — Unified Customize toolbar for portfolio owner.
 *
 * Single "Customize" entry point with two tabs:
 *  • Sections — drag-to-reorder + hide/show sections (existing edit mode)
 *  • Appearance — theme, hero layout, section layout, accent color
 *
 * Replaces both the old EditModeToolbar + LiveCustomizePanel trigger button.
 */
import { useEffect, useState } from "react";
import { Pencil, Save, X, Loader2, Palette, Layers, Settings2, Check, EyeOff, Eye, Layout, Grid } from "lucide-react";
import { useEditMode } from "./EditModeProvider";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { portfolioThemeList } from "@/themes/themes";
import { useToast } from "@/hooks/use-toast";

type Tab = "sections" | "appearance";

// ─── Appearance panel (extracted from LiveCustomizePanel) ─────────────────────

const THEME_GROUPS = [
  { label: "Dark",     ids: ["cinematic-dark", "charcoal-glass", "neon-noir", "gothic", "midnight-glass", "noir-classic"] },
  { label: "Light",   ids: ["warm-luxury", "modern-minimal", "frost", "azure-glass", "pearl", "mediterranean"] },
  { label: "Colour",  ids: ["creative-rose", "ocean-blue", "frontier", "sage-studio", "sunset-warmth", "slate-pro"] },
];

const QUICK_PRESETS = [
  { name: "Film Professional",  theme: "cinematic-dark",  hero: "classic",  layout: "classic" },
  { name: "Actor Modern",       theme: "charcoal-glass",  hero: "centered", layout: "magazine" },
  { name: "Director Cinematic", theme: "neon-noir",        hero: "banner",   layout: "bento" },
  { name: "Writer Literary",    theme: "warm-luxury",      hero: "minimal",  layout: "minimal" },
];

const HERO_LAYOUTS = ["classic", "centered", "split", "minimal", "banner", "editorial"];
const SECTION_LAYOUTS = ["classic", "magazine", "bento", "minimal", "spotlight", "dashboard"];

interface AppearancePanelProps {
  profileId: string;
  theme: any;
}

const AppearancePanel = ({ profileId, theme }: AppearancePanelProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("cinematic-dark");
  const [currentHeroLayout, setCurrentHeroLayout] = useState("classic");
  const [currentLayoutPreset, setCurrentLayoutPreset] = useState("classic");
  const [currentAccentColor, setCurrentAccentColor] = useState("#C41E3A");

  useEffect(() => {
    supabase.from("profiles").select("theme, hero_style, layout_preset, accent_color").eq("id", profileId).single().then(({ data }) => {
      if (data) {
        setCurrentTheme((data as any).theme || "cinematic-dark");
        setCurrentHeroLayout((data as any).hero_style || "classic");
        setCurrentLayoutPreset((data as any).layout_preset || "classic");
        setCurrentAccentColor((data as any).accent_color || "#C41E3A");
      }
    });
  }, [profileId]);

  const saveChange = async (updates: Record<string, any>) => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update(updates as any).eq("id", profileId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setSaving(false);
    } else {
      // Apply update optimistically to local state
      if ("theme" in updates) setCurrentTheme(updates.theme);
      if ("hero_style" in updates) setCurrentHeroLayout(updates.hero_style);
      if ("layout_preset" in updates) setCurrentLayoutPreset(updates.layout_preset);
      if ("accent_color" in updates) setCurrentAccentColor(updates.accent_color);
      setSaving(false);
      // Reload to reflect theme change
      window.location.reload();
    }
  };

  const labelStyle = { color: theme.accentPrimary };
  const borderFaint = `${theme.borderDefault}60`;

  return (
    <div className="space-y-4 pb-2">
      {/* Quick Presets */}
      <div className="pb-4 border-b" style={{ borderColor: borderFaint }}>
        <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={labelStyle}>Quick Presets</label>
        <div className="grid grid-cols-1 gap-1.5">
          {QUICK_PRESETS.map((p) => (
            <button key={p.name} onClick={() => saveChange({ theme: p.theme, hero_style: p.hero, layout_preset: p.layout })} disabled={saving}
              className="text-left text-xs px-3 py-2 rounded-lg border transition-all hover:scale-[1.01]"
              style={{ background: `${theme.accentPrimary}10`, borderColor: `${theme.accentPrimary}30`, color: theme.textSecondary }}>
              ✦ {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="pb-4 border-b" style={{ borderColor: borderFaint }}>
        <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={labelStyle}>Theme</label>
        {THEME_GROUPS.map((group) => (
          <div key={group.label} className="mb-2">
            <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: theme.textTertiary }}>{group.label}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {group.ids.map((tid) => {
                const t = portfolioThemeList.find(x => x.id === tid);
                if (!t) return null;
                const active = currentTheme === tid;
                return (
                  <button key={tid} onClick={() => saveChange({ theme: tid })} disabled={saving}
                    className="flex items-center gap-1.5 text-[10px] px-2 py-1.5 rounded-lg border transition-all"
                    style={{ background: active ? `${theme.accentPrimary}20` : "transparent", borderColor: active ? theme.accentPrimary : theme.borderDefault, color: active ? theme.accentPrimary : theme.textSecondary }}>
                    <div className="flex gap-0.5">
                      {t.previewColors.slice(0, 3).map((c, i) => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
                    </div>
                    {active && <Check className="w-2.5 h-2.5 ml-auto shrink-0" />}
                    {!active && t.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Hero Layout */}
      <div className="pb-4 border-b" style={{ borderColor: borderFaint }}>
        <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={labelStyle}>
          <Layout className="w-3 h-3 inline mr-1" />Hero Layout
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {HERO_LAYOUTS.map((id) => {
            const active = currentHeroLayout === id;
            return (
              <button key={id} onClick={() => saveChange({ hero_style: id })} disabled={saving}
                className="text-[10px] px-1.5 py-1.5 rounded-lg border transition-all capitalize"
                style={{ background: active ? `${theme.accentPrimary}20` : "transparent", borderColor: active ? theme.accentPrimary : theme.borderDefault, color: active ? theme.accentPrimary : theme.textSecondary }}>
                {id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Layout */}
      <div className="pb-4 border-b" style={{ borderColor: borderFaint }}>
        <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={labelStyle}>
          <Grid className="w-3 h-3 inline mr-1" />Section Layout
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {SECTION_LAYOUTS.map((id) => {
            const active = currentLayoutPreset === id;
            return (
              <button key={id} onClick={() => saveChange({ layout_preset: id })} disabled={saving}
                className="text-[10px] px-1.5 py-1.5 rounded-lg border transition-all capitalize"
                style={{ background: active ? `${theme.accentPrimary}20` : "transparent", borderColor: active ? theme.accentPrimary : theme.borderDefault, color: active ? theme.accentPrimary : theme.textSecondary }}>
                {id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={labelStyle}>Accent Color</label>
        <div className="flex items-center gap-2">
          <input type="color" value={currentAccentColor}
            onChange={(e) => setCurrentAccentColor(e.target.value)}
            onBlur={(e) => saveChange({ accent_color: e.target.value })}
            disabled={saving}
            className="w-10 h-10 rounded-lg cursor-pointer border" style={{ borderColor: theme.borderDefault }} />
          <span className="text-xs font-mono" style={{ color: theme.textSecondary }}>{currentAccentColor}</span>
        </div>
      </div>

      <p className="text-[9px] text-center pt-1" style={{ color: theme.textTertiary }}>Changes save instantly</p>
    </div>
  );
};

// ─── Main toolbar ─────────────────────────────────────────────────────────────

interface Props {
  profileId?: string;
}

const EditModeToolbar = ({ profileId }: Props) => {
  const { isOwner, editMode, setEditMode, saving, saveLayout, hasChanges, sectionOrder, sectionsVisible, toggleVisibility } = useEditMode();
  const theme = usePortfolioTheme();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("sections");

  if (!isOwner) return null;

  // ── Collapsed pill ────────────────────────────────────────────────────────
  if (!open) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => { setOpen(true); setEditMode(true); }}
          className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-xl backdrop-blur-xl transition-all hover:scale-105 active:scale-95"
          style={{
            background: `${theme.accentPrimary}`,
            color: theme.textOnAccent,
            boxShadow: `0 4px 24px ${theme.accentGlow || theme.accentPrimary}50`,
          }}
        >
          <Settings2 className="h-4 w-4" />
          Customize Portfolio
        </button>
      </div>
    );
  }

  // ── Expanded panel ────────────────────────────────────────────────────────
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[22rem] max-h-[80vh] flex flex-col rounded-2xl shadow-2xl"
      style={{ background: theme.bgElevated, border: `1px solid ${theme.borderDefault}`, backdropFilter: "blur(20px)" }}
    >
      {/* Toolbar header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b" style={{ borderColor: `${theme.borderDefault}60` }}>
        <span className="text-sm font-bold" style={{ color: theme.textPrimary }}>Customize Portfolio</span>
        <div className="flex items-center gap-2">
          {activeTab === "sections" && hasChanges && (
            <button onClick={saveLayout} disabled={saving}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg transition-colors"
              style={{ background: theme.accentPrimary, color: theme.textOnAccent }}>
              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
              Save
            </button>
          )}
          <button onClick={() => { setOpen(false); setEditMode(false); }}
            className="p-1.5 rounded-lg transition-colors hover:opacity-70" style={{ color: theme.textTertiary }}>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 border-b" style={{ borderColor: `${theme.borderDefault}60` }}>
        {([["sections", "Sections", Layers], ["appearance", "Appearance", Palette]] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setActiveTab(id as Tab)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all"
            style={{
              color: activeTab === id ? theme.accentPrimary : theme.textTertiary,
              borderBottom: activeTab === id ? `2px solid ${theme.accentPrimary}` : "2px solid transparent",
            }}>
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>

      {/* Panel body */}
      <div className="overflow-y-auto px-4 py-3 flex-1">
        {activeTab === "sections" ? (
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: theme.accentPrimary }}>
              Show / Hide Sections
            </p>
            {sectionOrder.filter(k => k !== "hero" && k !== "contact").map((key) => {
              const visible = sectionsVisible[key] !== false;
              const label = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
              return (
                <div key={key} className="flex items-center justify-between py-1.5 px-2 rounded-lg transition-colors hover:opacity-80 cursor-pointer"
                  style={{ background: visible ? `${theme.accentPrimary}08` : "transparent" }}
                  onClick={() => toggleVisibility(key)}>
                  <span className="text-xs" style={{ color: visible ? theme.textPrimary : theme.textTertiary }}>{label}</span>
                  <button className="p-1 rounded transition-colors" style={{ color: visible ? theme.accentPrimary : theme.textTertiary }}>
                    {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          profileId ? <AppearancePanel profileId={profileId} theme={theme} /> : null
        )}
      </div>
    </div>
  );
};

export default EditModeToolbar;
