import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { useEditMode } from "@/components/portfolio/EditModeProvider";
import { useToast } from "@/hooks/use-toast";
import { Settings2, EyeOff, Palette, Layout, Grid, Sliders } from "lucide-react";
import { portfolioThemeList } from "@/themes/themes";

interface Props {
  profileId: string;
}

const LiveCustomizePanel = ({ profileId }: Props) => {
  const { isOwner } = useEditMode();
  const { toast } = useToast();
  const theme = usePortfolioTheme();
  const [showCustomization, setShowCustomization] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>("cinematic-dark");
  const [currentHeroLayout, setCurrentHeroLayout] = useState<string>("classic");
  const [currentLayoutPreset, setCurrentLayoutPreset] = useState<string>("classic");
  const [currentCtaStyle, setCurrentCtaStyle] = useState<string>("outlined");
  const [currentAccentColor, setCurrentAccentColor] = useState<string>("#C41E3A");

  useEffect(() => {
    if (!isOwner) return;
    supabase
      .from("profiles")
      .select("theme, hero_style, layout_preset, cta_style, accent_color")
      .eq("id", profileId)
      .single()
      .then(({ data }) => {
        if (data) {
          setCurrentTheme((data as any).theme || "cinematic-dark");
          setCurrentHeroLayout((data as any).hero_style || "classic");
          setCurrentLayoutPreset((data as any).layout_preset || "classic");
          setCurrentCtaStyle((data as any).cta_style || "outlined");
          setCurrentAccentColor((data as any).accent_color || "#C41E3A");
        }
      });
  }, [isOwner, profileId]);

  const saveChange = async (updates: Record<string, any>) => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update(updates).eq("id", profileId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      // Reload to show live changes
      window.location.reload();
    }
    setSaving(false);
  };

  if (!isOwner) return null;

  const THEME_GROUPS = [
    { label: "Dark", ids: ["cinematic-dark", "neon-noir", "obsidian-noir", "deep-space", "gothic-editorial"] },
    { label: "Light", ids: ["modern-minimal", "warm-luxury", "clean-professional", "ivory-editorial"] },
    { label: "Specialty", ids: ["vintage-film", "brutalist-studio", "electric-noir", "rose-gold-glam", "forest-noir"] },
  ];

  if (!showCustomization) {
    return (
      <div className="fixed bottom-24 right-6 z-40">
        <button
          onClick={() => setShowCustomization(true)}
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl backdrop-blur-xl transition-all hover:scale-105 active:scale-95"
          style={{
            background: theme.accentPrimary,
            color: theme.textOnAccent,
            boxShadow: `0 4px 24px ${theme.accentGlow}60`,
          }}
        >
          <Settings2 className="w-3.5 h-3.5" />
          Customize
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-24 right-6 z-40 w-80 max-h-[65vh] overflow-y-auto rounded-2xl p-4 shadow-2xl"
      style={{
        background: theme.bgElevated,
        border: `1px solid ${theme.borderDefault}`,
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4" style={{ color: theme.accentPrimary }} />
          <span className="text-sm font-bold" style={{ color: theme.textPrimary }}>Customize Portfolio</span>
        </div>
        <button
          onClick={() => setShowCustomization(false)}
          className="p-1.5 rounded-lg transition-colors hover:opacity-70"
          style={{ color: theme.textTertiary }}
        >
          <EyeOff className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Presets */}
      <div className="mb-4 pb-4 border-b" style={{ borderColor: `${theme.borderDefault}60` }}>
        <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: theme.accentPrimary }}>
          Quick Presets
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {[
            { name: "Film Professional", theme: "cinematic-dark", hero: "classic", layout: "classic" },
            { name: "Actor Modern", theme: "obsidian-noir", hero: "centered", layout: "magazine" },
            { name: "Director Cinematic", theme: "neon-noir", hero: "banner", layout: "bento" },
            { name: "Writer Literary", theme: "warm-luxury", hero: "minimal", layout: "minimal" },
          ].map((preset) => (
            <button
              key={preset.name}
              onClick={() => saveChange({ theme: preset.theme, hero_style: preset.hero, layout_preset: preset.layout })}
              disabled={saving}
              className="text-left text-xs px-3 py-2 rounded-lg border transition-all hover:scale-[1.01]"
              style={{
                background: `${theme.accentPrimary}10`,
                borderColor: `${theme.accentPrimary}30`,
                color: theme.textSecondary,
              }}
            >
              ✦ {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="mb-4 pb-4 border-b" style={{ borderColor: `${theme.borderDefault}60` }}>
        <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: theme.accentPrimary }}>
          Theme
        </label>
        {THEME_GROUPS.map((group) => (
          <div key={group.label} className="mb-2">
            <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: theme.textTertiary }}>{group.label}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {group.ids.map((tid) => {
                const t = portfolioThemeList.find(x => x.id === tid);
                if (!t) return null;
                return (
                  <button
                    key={tid}
                    onClick={() => saveChange({ theme: tid })}
                    disabled={saving}
                    className="flex items-center gap-1.5 text-[10px] px-2 py-1.5 rounded-lg border transition-all"
                    style={{
                      background: currentTheme === tid ? `${theme.accentPrimary}20` : "transparent",
                      borderColor: currentTheme === tid ? theme.accentPrimary : theme.borderDefault,
                      color: currentTheme === tid ? theme.accentPrimary : theme.textSecondary,
                    }}
                  >
                    <div className="flex gap-0.5">
                      {t.previewColors.slice(0, 3).map((c, i) => (
                        <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                      ))}
                    </div>
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Hero Layout */}
      <div className="mb-4 pb-4 border-b" style={{ borderColor: `${theme.borderDefault}60` }}>
        <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: theme.accentPrimary }}>
          <Layout className="w-3 h-3 inline mr-1" />Hero Layout
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: "classic", label: "Classic" },
            { id: "centered", label: "Centered" },
            { id: "split", label: "Split" },
            { id: "minimal", label: "Minimal" },
            { id: "banner", label: "Banner" },
            { id: "editorial", label: "Editorial" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => saveChange({ hero_style: id })}
              disabled={saving}
              className="text-[10px] px-1.5 py-1.5 rounded-lg border transition-all"
              style={{
                background: currentHeroLayout === id ? `${theme.accentPrimary}20` : "transparent",
                borderColor: currentHeroLayout === id ? theme.accentPrimary : theme.borderDefault,
                color: currentHeroLayout === id ? theme.accentPrimary : theme.textSecondary,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Section Layout */}
      <div className="mb-4 pb-4 border-b" style={{ borderColor: `${theme.borderDefault}60` }}>
        <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: theme.accentPrimary }}>
          <Grid className="w-3 h-3 inline mr-1" />Section Layout
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "classic", label: "Classic" },
            { id: "magazine", label: "Magazine" },
            { id: "bento", label: "Bento" },
            { id: "minimal", label: "Minimal" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => saveChange({ layout_preset: id })}
              disabled={saving}
              className="text-xs px-2 py-1.5 rounded-lg border transition-all"
              style={{
                background: currentLayoutPreset === id ? `${theme.accentPrimary}20` : "transparent",
                borderColor: currentLayoutPreset === id ? theme.accentPrimary : theme.borderDefault,
                color: currentLayoutPreset === id ? theme.accentPrimary : theme.textSecondary,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: theme.accentPrimary }}>
          <Sliders className="w-3 h-3 inline mr-1" />Accent Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={currentAccentColor}
            onChange={(e) => setCurrentAccentColor(e.target.value)}
            onBlur={(e) => saveChange({ accent_color: e.target.value })}
            disabled={saving}
            className="w-10 h-10 rounded-lg cursor-pointer border"
            style={{ borderColor: theme.borderDefault }}
          />
          <span className="text-xs font-mono" style={{ color: theme.textSecondary }}>{currentAccentColor}</span>
        </div>
      </div>

      {/* Footer hint */}
      <p className="text-[9px] mt-4 text-center" style={{ color: theme.textTertiary }}>
        Changes apply immediately and save to your profile
      </p>
    </div>
  );
};

export default LiveCustomizePanel;

