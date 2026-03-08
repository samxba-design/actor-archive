import { CheckCircle, Star } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
}

const SectionServices = ({ items }: Props) => {
  const theme = usePortfolioTheme();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((s) => (
        <div
          key={s.id}
          className="relative p-4 space-y-2 transition-all"
          style={{
            backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
            backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
            border: s.is_featured
              ? `1px solid ${theme.accentPrimary}40`
              : `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
            borderRadius: theme.cardRadius,
            boxShadow: s.is_featured ? `0 0 20px ${theme.accentGlow}` : theme.cardShadow,
            transitionDuration: theme.hoverTransitionDuration,
          }}
        >
          {s.is_featured && (
            <div
              className="absolute -top-2 left-3 px-2 py-px rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"
              style={{ backgroundColor: theme.accentPrimary, color: theme.textOnAccent }}
            >
              <Star className="w-2 h-2" /> Popular
            </div>
          )}
          <div className="flex items-baseline justify-between">
            <h4 className="font-semibold text-[13px]" style={{ color: theme.textPrimary }}>{s.name}</h4>
            {s.starting_price && (
              <span className="text-[13px] font-bold" style={{ color: theme.accentPrimary }}>From {s.starting_price}</span>
            )}
          </div>
          {s.description && <p className="text-[12px] leading-relaxed" style={{ color: theme.textSecondary }}>{s.description}</p>}
          {s.deliverables?.length > 0 && (
            <ul className="space-y-0.5">
              {s.deliverables.map((d: string, i: number) => (
                <li key={i} className="flex items-center gap-1.5 text-[11px]" style={{ color: theme.textSecondary }}>
                  <CheckCircle className="w-3 h-3 shrink-0" style={{ color: theme.accentPrimary }} />
                  {d}
                </li>
              ))}
            </ul>
          )}
          {s.turnaround && (
            <p className="text-[10px]" style={{ color: theme.textTertiary }}>Turnaround: {s.turnaround}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default SectionServices;
