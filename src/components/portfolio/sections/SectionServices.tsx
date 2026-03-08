import { useState } from "react";
import { CheckCircle, Star, ChevronDown, ChevronUp } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import GlassCard from "@/components/portfolio/GlassCard";

interface Props {
  items: any[];
  compact?: boolean;
}

const SectionServices = ({ items, compact }: Props) => {
  const theme = usePortfolioTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (compact) {
    return (
      <div className="space-y-1.5">
        {items.map((s) => {
          const isExpanded = expandedId === s.id;
          return (
            <GlassCard key={s.id} featured={s.is_featured} className="overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : s.id)}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {s.is_featured && <Star className="w-3 h-3 shrink-0" style={{ color: theme.accentPrimary }} />}
                  <span className="text-[13px] font-semibold truncate" style={{ color: theme.textPrimary }}>{s.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {s.starting_price && (
                    <span className="text-[12px] font-bold" style={{ color: theme.accentPrimary }}>{s.starting_price}</span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" style={{ color: theme.textTertiary }} />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" style={{ color: theme.textTertiary }} />
                  )}
                </div>
              </button>
              {isExpanded && (
                <div className="px-3.5 pb-3 space-y-2 animate-fade-in">
                  {s.description && (
                    <p className="text-[11px] leading-relaxed" style={{ color: theme.textSecondary }}>{s.description}</p>
                  )}
                  {s.deliverables?.length > 0 && (
                    <ul className="space-y-0.5">
                      {s.deliverables.map((d: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5 text-[10px]" style={{ color: theme.textSecondary }}>
                          <CheckCircle className="w-2.5 h-2.5 shrink-0" style={{ color: theme.accentPrimary }} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.turnaround && (
                    <p className="text-[10px]" style={{ color: theme.textTertiary }}>⏱ {s.turnaround}</p>
                  )}
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    );
  }

  // Full mode — grid cards
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((s) => (
        <GlassCard key={s.id} featured={s.is_featured} className="relative p-4 space-y-2">
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
        </GlassCard>
      ))}
    </div>
  );
};

export default SectionServices;
