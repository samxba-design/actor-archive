import { useState } from "react";
import { portfolioThemeList } from "@/themes/themes";

interface Props {
  currentThemeId: string;
  onThemeChange: (themeId: string) => void;
}

const ThemeSwitcher = ({ currentThemeId, onThemeChange }: Props) => {
  const [expanded, setExpanded] = useState(false);
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
            minWidth: '220px',
          }}
        >
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3 font-medium">Portfolio Theme</p>
          <div className="space-y-1.5">
            {portfolioThemeList.map(theme => (
              <button
                key={theme.id}
                onClick={() => { onThemeChange(theme.id); setExpanded(false); }}
                className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all text-left"
                style={{
                  backgroundColor: theme.id === currentThemeId ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                {/* Color dots */}
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

export default ThemeSwitcher;
