import { useState, forwardRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { portfolioThemeList } from "@/themes/themes";
import { Palette, Check } from "lucide-react";

interface Props {
  currentThemeId: string;
  onThemeChange: (themeId: string) => void;
}

const ThemeSwitcher = forwardRef<HTMLDivElement, Props>(({ currentThemeId, onThemeChange }, ref) => {
  const [expanded, setExpanded] = useState(false);
  const current = portfolioThemeList.find(t => t.id === currentThemeId);
  const isMobile = useIsMobile();

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 max-sm:right-3 max-sm:bottom-3">
      {expanded && (
        <div
          className="mb-3 p-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            minWidth: isMobile ? '260px' : '300px',
          }}
        >
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3 font-medium">Choose Theme</p>
          <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
            {portfolioThemeList.map(theme => {
              const isActive = theme.id === currentThemeId;
              return (
                <button
                  key={theme.id}
                  onClick={() => { onThemeChange(theme.id); setExpanded(false); }}
                  className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg transition-all text-left group"
                  style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent' }}
                >
                  {/* Mini graphical preview */}
                  <div
                    className="shrink-0 rounded-md overflow-hidden relative"
                    style={{
                      width: '56px',
                      height: '36px',
                      backgroundColor: theme.bgPrimary,
                      border: `1px solid ${theme.borderDefault}`,
                    }}
                  >
                    {/* Accent bar */}
                    <div
                      className="absolute top-0 left-0 right-0"
                      style={{ height: '3px', backgroundColor: theme.accentPrimary }}
                    />
                    {/* Text preview lines */}
                    <div className="absolute left-1.5 top-[8px] space-y-[3px]">
                      <div
                        className="rounded-full"
                        style={{ width: '24px', height: '3px', backgroundColor: theme.textPrimary, opacity: 0.7 }}
                      />
                      <div
                        className="rounded-full"
                        style={{ width: '18px', height: '2px', backgroundColor: theme.textSecondary, opacity: 0.5 }}
                      />
                      <div
                        className="rounded-full"
                        style={{ width: '14px', height: '2px', backgroundColor: theme.textSecondary, opacity: 0.3 }}
                      />
                    </div>
                    {/* Accent dot */}
                    <div
                      className="absolute bottom-1.5 right-1.5 rounded-full"
                      style={{ width: '6px', height: '6px', backgroundColor: theme.accentPrimary }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-medium text-white/90 truncate">{theme.name}</p>
                      {isActive && <Check className="w-3 h-3 text-white/70 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-white/40 truncate">{theme.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-xl transition-all hover:scale-105"
        style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        <Palette className="w-3.5 h-3.5 text-white/50" />
        {/* Mini preview of current theme */}
        <div
          className="rounded overflow-hidden relative"
          style={{
            width: '24px',
            height: '16px',
            backgroundColor: current?.bgPrimary || '#0D0D0D',
            border: `1px solid ${current?.borderDefault || '#2A2825'}`,
          }}
        >
          <div
            className="absolute top-0 left-0 right-0"
            style={{ height: '2px', backgroundColor: current?.accentPrimary || '#C9A96E' }}
          />
        </div>
        {!isMobile && <span className="text-[11px] font-medium text-white/70">{current?.name || 'Theme'}</span>}
      </button>
    </div>
  );
});
ThemeSwitcher.displayName = "ThemeSwitcher";

export default ThemeSwitcher;
