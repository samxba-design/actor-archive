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
          className="relative p-5 space-y-2 transition-all"
          style={{
            backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
            backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
            border: s.is_featured
              ? `2px solid ${theme.accentPrimary}`
              : `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
            borderRadius: theme.cardRadius,
            boxShadow: s.is_featured ? theme.cardHoverShadow : theme.cardShadow,
            transitionDuration: theme.hoverTransitionDuration,
          }}
        >
          {s.is_featured && (
            <div
              className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
              style={{ backgroundColor: theme.accentPrimary, color: theme.textOnAccent }}
            >
              <Star className="w-2.5 h-2.5" /> Popular
            </div>
          )}
          <div className="flex items-baseline justify-between">
            <h4 className="font-semibold text-sm" style={{ color: theme.textPrimary }}>{s.name}</h4>
            {s.starting_price && (
              <span className="text-sm font-bold" style={{ color: theme.accentPrimary }}>From {s.starting_price}</span>
            )}
          </div>
          {s.description && <p className="text-xs" style={{ color: theme.textSecondary }}>{s.description}</p>}
          {s.deliverables?.length > 0 && (
            <ul className="space-y-1 pt-1">
              {s.deliverables.map((d: string, i: number) => (
                <li key={i} className="flex items-center gap-1.5 text-xs" style={{ color: theme.textSecondary }}>
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accentPrimary }} />
                  {d}
                </li>
              ))}
            </ul>
          )}
          {s.turnaround && (
            <p className="text-[10px] pt-1" style={{ color: theme.textTertiary }}>Turnaround: {s.turnaround}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default SectionServices;
