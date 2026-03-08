import { useState } from "react";
import { portfolioThemeList } from "@/themes/themes";
import { LayoutGrid, Palette } from "lucide-react";

export type LayoutPreset = 'standard' | 'cinematic' | 'compact' | 'magazine';

const LAYOUT_PRESETS: { id: LayoutPreset; name: string; description: string }[] = [
  { id: 'standard', name: 'Standard', description: 'Dense grid, sidebar modules' },
  { id: 'cinematic', name: 'Cinematic', description: 'Full-width, poster credits' },
  { id: 'compact', name: 'Compact', description: 'Maximum density, table credits' },
  { id: 'magazine', name: 'Magazine', description: 'Editorial two-column' },
];

interface Props {
  currentThemeId: string;
  onThemeChange: (themeId: string) => void;
  currentLayout?: LayoutPreset;
  onLayoutChange?: (layout: LayoutPreset) => void;
}

const ThemeSwitcher = ({ currentThemeId, onThemeChange, currentLayout, onLayoutChange }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<'theme' | 'layout'>('theme');
  const current = portfolioThemeList.find(t => t.id === currentThemeId);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded panel */}
      {expanded && (
        <div
          className="mb-3 p-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            minWidth: '240px',
          }}
        >
          {/* Tabs */}
          {onLayoutChange && (
            <div className="flex gap-1 mb-3 p-0.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
              <button
                onClick={() => setTab('theme')}
                className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] uppercase tracking-widest font-medium transition-all"
                style={{
                  backgroundColor: tab === 'theme' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: tab === 'theme' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                }}
              >
                <Palette className="w-3 h-3" /> Theme
              </button>
              <button
                onClick={() => setTab('layout')}
                className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] uppercase tracking-widest font-medium transition-all"
                style={{
                  backgroundColor: tab === 'layout' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: tab === 'layout' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                }}
              >
                <LayoutGrid className="w-3 h-3" /> Layout
              </button>
            </div>
          )}

          {tab === 'theme' ? (
            <>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3 font-medium">Portfolio Theme</p>
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                {portfolioThemeList.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => { onThemeChange(theme.id); setExpanded(false); }}
                    className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all text-left"
                    style={{
                      backgroundColor: theme.id === currentThemeId ? 'rgba(255,255,255,0.1)' : 'transparent',
                    }}
                  >
                    <div className="flex gap-1 shrink-0">
                      {theme.previewColors.slice(0, 3).map((c, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: c,
                            border: '1px solid rgba(255,255,255,0.15)',
                          }}
                        />
                      ))}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white/90 truncate">{theme.name}</p>
                      <p className="text-[10px] text-white/40 truncate">{theme.description}</p>
                    </div>
                    {theme.id === currentThemeId && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3 font-medium">Layout Preset</p>
              <div className="space-y-1.5">
                {LAYOUT_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => { onLayoutChange?.(preset.id); setExpanded(false); }}
                    className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-all text-left"
                    style={{
                      backgroundColor: preset.id === currentLayout ? 'rgba(255,255,255,0.1)' : 'transparent',
                    }}
                  >
                    <LayoutMiniPreview layout={preset.id} isActive={preset.id === currentLayout} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white/90">{preset.name}</p>
                      <p className="text-[10px] text-white/40">{preset.description}</p>
                    </div>
                    {preset.id === currentLayout && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-xl transition-all hover:scale-105"
        style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <div className="flex gap-1">
          {(current?.previewColors || []).slice(0, 3).map((c, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: c,
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
        <span className="text-[11px] font-medium text-white/70">
          {current?.name || 'Theme'}
        </span>
      </button>
    </div>
  );
};

/* Mini grid previews for layout presets */
const LayoutMiniPreview = ({ layout, isActive }: { layout: LayoutPreset; isActive?: boolean }) => {
  const accent = isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)';
  const bg = isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)';

  const layouts: Record<LayoutPreset, React.ReactNode> = {
    standard: (
      <div className="w-8 h-6 flex flex-col gap-[1px]">
        <div className="flex gap-[1px] flex-1">
          <div className="flex-1 rounded-[1px]" style={{ backgroundColor: accent }} />
          <div className="w-2 rounded-[1px]" style={{ backgroundColor: bg }} />
        </div>
        <div className="h-1.5 rounded-[1px]" style={{ backgroundColor: bg }} />
        <div className="flex gap-[1px] flex-1">
          <div className="flex-1 rounded-[1px]" style={{ backgroundColor: bg }} />
          <div className="w-2.5 rounded-[1px]" style={{ backgroundColor: bg }} />
        </div>
      </div>
    ),
    cinematic: (
      <div className="w-8 h-6 flex flex-col gap-[1px]">
        <div className="h-2 rounded-[1px]" style={{ backgroundColor: accent }} />
        <div className="flex-1 rounded-[1px]" style={{ backgroundColor: bg }} />
        <div className="h-1.5 rounded-[1px]" style={{ backgroundColor: bg }} />
      </div>
    ),
    compact: (
      <div className="w-8 h-6 flex flex-col gap-[1px]">
        {[0,1,2,3].map(i => (
          <div key={i} className="flex-1 rounded-[1px]" style={{ backgroundColor: i === 0 ? accent : bg }} />
        ))}
      </div>
    ),
    magazine: (
      <div className="w-8 h-6 flex gap-[1px]">
        <div className="flex-1 flex flex-col gap-[1px]">
          <div className="flex-1 rounded-[1px]" style={{ backgroundColor: accent }} />
          <div className="h-1.5 rounded-[1px]" style={{ backgroundColor: bg }} />
        </div>
        <div className="w-3 flex flex-col gap-[1px]">
          <div className="h-2 rounded-[1px]" style={{ backgroundColor: bg }} />
          <div className="flex-1 rounded-[1px]" style={{ backgroundColor: bg }} />
        </div>
      </div>
    ),
  };

  return <div className="shrink-0">{layouts[layout]}</div>;
};

export default ThemeSwitcher;
