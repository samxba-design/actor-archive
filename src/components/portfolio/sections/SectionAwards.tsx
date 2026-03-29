import { Award, Trophy, Medal, Star } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
  variant?: "list" | "grid" | "laurels";
}

const RESULT_META: Record<string, { bg: string; fg: string; label: string }> = {
  Winner:      { bg: "rgba(201,169,110,0.15)", fg: "#C9A96E", label: "Winner" },
  Gold:        { bg: "rgba(201,169,110,0.15)", fg: "#C9A96E", label: "Gold" },
  Nominated:   { bg: "rgba(107,159,212,0.15)", fg: "#6B9FD4", label: "Nom." },
  Semifinalist:{ bg: "rgba(74,158,107,0.15)",  fg: "#4A9E6B", label: "Semi" },
  Featured:    { bg: "rgba(184,92,60,0.15)",   fg: "#B85C3C", label: "Feat." },
  Finalist:    { bg: "rgba(168,85,247,0.15)",  fg: "#a855f7", label: "Final" },
};

const getIcon = (result: string) => {
  if (result === "Winner" || result === "Gold") return Trophy;
  if (result === "Nominated") return Star;
  if (result === "Semifinalist" || result === "Finalist") return Medal;
  return Award;
};

const getResultMeta = (result: string, theme: any) =>
  RESULT_META[result] || { bg: theme.bgElevated, fg: theme.textSecondary, label: result };

const SectionAwards = ({ items, variant = "list" }: Props) => {
  const theme = usePortfolioTheme();
  if (variant === "grid")   return <GridVariant   items={items} theme={theme} />;
  if (variant === "laurels") return <LaurelsVariant items={items} theme={theme} />;
  return <ListVariant items={items} theme={theme} />;
};

/* ─── List variant ─────────────────────────────────────────────────────────── */
const ListVariant = ({ items, theme }: { items: any[]; theme: any }) => (
  <div className="space-y-px">
    {items.map((a) => {
      const meta = getResultMeta(a.result, theme);
      const Icon = getIcon(a.result);
      const isWin = a.result === "Winner" || a.result === "Gold";
      return (
        <div
          key={a.id}
          className="flex items-center gap-3 px-3 py-3 rounded-lg group transition-all"
          style={{
            borderLeft: isWin ? `3px solid ${meta.fg}` : `3px solid transparent`,
            background: isWin ? `${meta.bg}` : "transparent",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = `${theme.bgElevated}80`)}
          onMouseLeave={e => (e.currentTarget.style.background = isWin ? meta.bg : "transparent")}
        >
          {/* Icon badge */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: meta.bg }}
          >
            <Icon className="w-4 h-4" style={{ color: meta.fg }} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p
                className="font-medium text-[14px] leading-tight"
                style={{ color: theme.textPrimary }}
              >
                {a.name}
              </p>
              {a.result && (
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                  style={{ backgroundColor: meta.bg, color: meta.fg }}
                >
                  {a.result}
                </span>
              )}
            </div>
            <p className="text-[11px] mt-0.5" style={{ color: theme.textTertiary }}>
              {[a.category, a.organization, a.year].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
      );
    })}
  </div>
);

/* ─── Grid variant ─────────────────────────────────────────────────────────── */
const GridVariant = ({ items, theme }: { items: any[]; theme: any }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
    {items.map((a) => {
      const meta = getResultMeta(a.result, theme);
      const Icon = getIcon(a.result);
      return (
        <div
          key={a.id}
          className="p-4 text-center space-y-2 transition-all duration-200 hover:scale-[1.02]"
          style={{
            backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
            backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
            border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
            borderRadius: theme.cardRadius,
            borderTop: `3px solid ${meta.fg}`,
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto"
            style={{ backgroundColor: meta.bg }}
          >
            <Icon className="w-6 h-6" style={{ color: meta.fg }} />
          </div>
          {a.result && (
            <span
              className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ backgroundColor: meta.bg, color: meta.fg }}
            >
              {a.result}
            </span>
          )}
          <p
            className="font-semibold text-[13px] leading-tight"
            style={{ color: theme.textPrimary, fontFamily: theme.fontDisplay }}
          >
            {a.name}
          </p>
          <p className="text-[10px]" style={{ color: theme.textTertiary }}>
            {[a.category, a.year].filter(Boolean).join(" · ")}
          </p>
          {a.organization && (
            <p className="text-[9px] uppercase tracking-wider" style={{ color: theme.textTertiary }}>
              {a.organization}
            </p>
          )}
        </div>
      );
    })}
  </div>
);

/* ─── Laurels variant ──────────────────────────────────────────────────────── */
const LaurelsVariant = ({ items, theme }: { items: any[]; theme: any }) => (
  <div className="flex gap-8 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide">
    {items.map((a) => {
      const meta = getResultMeta(a.result, theme);
      const Icon = getIcon(a.result);
      return (
        <div key={a.id} className="flex flex-col items-center gap-2.5 shrink-0 min-w-[90px] max-w-[110px]">
          {/* Circular badge with laurel ring */}
          <div className="relative">
            {/* Outer glow ring */}
            <div
              className="w-[72px] h-[72px] rounded-full absolute inset-0 -m-1"
              style={{
                background: `conic-gradient(${meta.fg}25 0deg, transparent 90deg, ${meta.fg}25 180deg, transparent 270deg)`,
                transform: "rotate(-10deg)",
              }}
            />
            <div
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center relative"
              style={{
                border: `2px solid ${meta.fg}45`,
                background: `radial-gradient(circle at 40% 40%, ${meta.bg}, transparent 75%)`,
                boxShadow: `0 0 16px ${meta.fg}15`,
              }}
            >
              <Icon className="w-7 h-7" style={{ color: meta.fg }} />
            </div>
          </div>
          <div className="text-center space-y-0.5">
            <p
              className="text-[11px] font-semibold leading-tight"
              style={{ color: theme.textPrimary }}
            >
              {a.name}
            </p>
            {a.result && (
              <p
                className="text-[9px] font-bold uppercase tracking-widest"
                style={{ color: meta.fg }}
              >
                {a.result}
              </p>
            )}
            {a.year && (
              <p className="text-[9px]" style={{ color: theme.textTertiary }}>
                {a.year}
              </p>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

export default SectionAwards;
