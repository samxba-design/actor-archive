import { Award, Trophy, Medal, Star } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
  variant?: 'list' | 'grid' | 'laurels';
}

const RESULT_COLORS: Record<string, { bg: string; fg: string }> = {
  Winner: { bg: 'rgba(201, 169, 110, 0.18)', fg: '#C9A96E' },
  Gold: { bg: 'rgba(201, 169, 110, 0.18)', fg: '#C9A96E' },
  Nominated: { bg: 'rgba(107, 159, 212, 0.15)', fg: '#6B9FD4' },
  Semifinalist: { bg: 'rgba(74, 158, 107, 0.15)', fg: '#4A9E6B' },
  Featured: { bg: 'rgba(184, 92, 60, 0.15)', fg: '#B85C3C' },
};

const getIcon = (result: string) => {
  const isWinner = result === "Winner" || result === "Gold";
  if (isWinner) return Trophy;
  if (result === "Nominated") return Star;
  if (result === "Semifinalist") return Medal;
  return Award;
};

const SectionAwards = ({ items, variant = 'list' }: Props) => {
  const theme = usePortfolioTheme();

  if (variant === 'grid') return <GridVariant items={items} theme={theme} />;
  if (variant === 'laurels') return <LaurelsVariant items={items} theme={theme} />;

  return (
    <div className="space-y-1.5">
      {items.map((a) => {
        const resultColor = RESULT_COLORS[a.result] || { bg: theme.bgElevated, fg: theme.textSecondary };
        const Icon = getIcon(a.result);
        return (
          <div key={a.id} className="flex items-center gap-3 py-2.5 px-3 transition-all rounded-sm group" style={{ transitionDuration: theme.hoverTransitionDuration }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: resultColor.bg }}>
              <Icon className="w-4 h-4" style={{ color: resultColor.fg }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="font-medium text-[13px] truncate" style={{ color: theme.textPrimary }}>{a.name}</p>
                {a.result && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: resultColor.bg, color: resultColor.fg }}>
                    {a.result}
                  </span>
                )}
              </div>
              <p className="text-[11px]" style={{ color: theme.textTertiary }}>
                {[a.category, a.organization, a.year].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── Grid variant: card per award ── */
const GridVariant = ({ items, theme }: { items: any[]; theme: any }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
    {items.map((a) => {
      const resultColor = RESULT_COLORS[a.result] || { bg: theme.bgElevated, fg: theme.textSecondary };
      const Icon = getIcon(a.result);
      return (
        <div
          key={a.id}
          className="p-4 text-center space-y-2 transition-all duration-200"
          style={{
            backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
            backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
            border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
            borderRadius: theme.cardRadius,
          }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto" style={{ backgroundColor: resultColor.bg }}>
            <Icon className="w-6 h-6" style={{ color: resultColor.fg }} />
          </div>
          {a.result && (
            <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ backgroundColor: resultColor.bg, color: resultColor.fg }}>
              {a.result}
            </span>
          )}
          <p className="font-semibold text-[13px] leading-tight" style={{ color: theme.textPrimary, fontFamily: theme.fontDisplay }}>{a.name}</p>
          <p className="text-[10px]" style={{ color: theme.textTertiary }}>
            {[a.category, a.year].filter(Boolean).join(" · ")}
          </p>
          {a.organization && <p className="text-[9px] uppercase tracking-wider" style={{ color: theme.textTertiary }}>{a.organization}</p>}
        </div>
      );
    })}
  </div>
);

/* ── Laurels variant: horizontal scroll of circular badges ── */
const LaurelsVariant = ({ items, theme }: { items: any[]; theme: any }) => (
  <div className="flex gap-6 overflow-x-auto pb-3 scrollbar-hide">
    {items.map((a) => {
      const resultColor = RESULT_COLORS[a.result] || { bg: theme.bgElevated, fg: theme.textSecondary };
      const Icon = getIcon(a.result);
      return (
        <div key={a.id} className="flex flex-col items-center gap-2 shrink-0 min-w-[100px]">
          {/* Laurel circle */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center relative"
            style={{
              border: `2px solid ${resultColor.fg}40`,
              background: `radial-gradient(circle, ${resultColor.bg}, transparent 70%)`,
            }}
          >
            <Icon className="w-7 h-7" style={{ color: resultColor.fg }} />
            {/* Laurel leaf decoration */}
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 text-lg opacity-40" style={{ color: resultColor.fg }}>🌿</div>
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 text-lg opacity-40 -scale-x-100" style={{ color: resultColor.fg }}>🌿</div>
          </div>
          <div className="text-center">
            <p className="text-[11px] font-semibold leading-tight" style={{ color: theme.textPrimary }}>{a.name}</p>
            {a.result && <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: resultColor.fg }}>{a.result}</p>}
            {a.year && <p className="text-[9px]" style={{ color: theme.textTertiary }}>{a.year}</p>}
          </div>
        </div>
      );
    })}
  </div>
);

export default SectionAwards;
