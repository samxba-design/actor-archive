import { useState } from "react";
import { CheckCircle, Star, ChevronDown, ChevronUp, Clock, DollarSign, Sparkles, Check } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import GlassCard from "@/components/portfolio/GlassCard";

interface Props {
  items: any[];
  compact?: boolean;
  variant?: 'full' | 'compact' | 'pricing';
}

const SERVICE_COLORS = [
  { bg: 'rgba(201, 169, 110, 0.15)', fg: '#C9A96E' },
  { bg: 'rgba(107, 159, 212, 0.15)', fg: '#6B9FD4' },
  { bg: 'rgba(184, 92, 60, 0.15)', fg: '#B85C3C' },
  { bg: 'rgba(74, 158, 107, 0.15)', fg: '#4A9E6B' },
  { bg: 'rgba(196, 30, 30, 0.12)', fg: '#C41E1E' },
  { bg: 'rgba(139, 105, 20, 0.12)', fg: '#8B6914' },
];

const SectionServices = ({ items, compact, variant }: Props) => {
  const theme = usePortfolioTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Determine effective variant
  const effectiveVariant = variant || (compact ? 'compact' : 'full');

  if (effectiveVariant === 'pricing') return <PricingVariant items={items} theme={theme} />;

  if (effectiveVariant === 'compact') {
    return (
      <div className="space-y-2">
        {items.map((s, idx) => {
          const isExpanded = expandedId === s.id;
          const color = SERVICE_COLORS[idx % SERVICE_COLORS.length];
          return (
            <GlassCard key={s.id} featured={s.is_featured} className="overflow-hidden">
              <button onClick={() => setExpandedId(isExpanded ? null : s.id)} className="w-full flex items-center gap-3 px-3.5 py-3 text-left">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: color.bg }}>
                  {s.is_featured ? <Sparkles className="w-3.5 h-3.5" style={{ color: color.fg }} /> : <DollarSign className="w-3.5 h-3.5" style={{ color: color.fg }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold truncate" style={{ color: theme.textPrimary }}>{s.name}</span>
                    {s.is_featured && <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0" style={{ backgroundColor: theme.accentPrimary, color: theme.textOnAccent }}>Popular</span>}
                  </div>
                  {s.starting_price && <span className="text-[11px] font-bold" style={{ color: color.fg }}>From {s.starting_price}</span>}
                </div>
                <div className="shrink-0">
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" style={{ color: theme.textTertiary }} /> : <ChevronDown className="w-3.5 h-3.5" style={{ color: theme.textTertiary }} />}
                </div>
              </button>
              {isExpanded && (
                <div className="px-3.5 pb-3.5 space-y-2.5 animate-fade-in">
                  {s.description && <p className="text-[12px] leading-relaxed" style={{ color: theme.textSecondary }}>{s.description}</p>}
                  {s.deliverables?.length > 0 && (
                    <ul className="space-y-1">
                      {s.deliverables.map((d: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-[11px]" style={{ color: theme.textSecondary }}>
                          <CheckCircle className="w-3 h-3 shrink-0" style={{ color: color.fg }} />{d}
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.turnaround && (
                    <div className="flex items-center gap-1.5 text-[11px]" style={{ color: theme.textTertiary }}>
                      <Clock className="w-3 h-3" style={{ color: color.fg }} />{s.turnaround}
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    );
  }

  // Full mode
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((s, idx) => {
        const color = SERVICE_COLORS[idx % SERVICE_COLORS.length];
        return (
          <GlassCard key={s.id} featured={s.is_featured} className="relative overflow-hidden">
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color.fg}, ${color.fg}66)` }} />
            <div className="p-5 space-y-3">
              {s.is_featured && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                  style={{ backgroundColor: theme.accentPrimary, color: theme.textOnAccent }}>
                  <Star className="w-2.5 h-2.5" /> Popular
                </span>
              )}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color.bg }}>
                  {s.is_featured ? <Sparkles className="w-5 h-5" style={{ color: color.fg }} /> : <DollarSign className="w-5 h-5" style={{ color: color.fg }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[15px] leading-tight" style={{ color: theme.textPrimary, fontFamily: theme.fontDisplay }}>{s.name}</h4>
                  {s.starting_price && <span className="text-[14px] font-bold" style={{ color: color.fg }}>From {s.starting_price}</span>}
                </div>
              </div>
              {s.description && <p className="text-[13px] leading-relaxed" style={{ color: theme.textSecondary }}>{s.description}</p>}
              {s.deliverables?.length > 0 && (
                <ul className="space-y-1.5">
                  {s.deliverables.map((d: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-[12px]" style={{ color: theme.textSecondary }}>
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: color.fg }} />{d}
                    </li>
                  ))}
                </ul>
              )}
              {s.turnaround && (
                <div className="flex items-center gap-2 pt-1" style={{ borderTop: `1px solid ${theme.borderDefault}` }}>
                  <Clock className="w-3.5 h-3.5" style={{ color: color.fg }} />
                  <span className="text-[11px] font-medium" style={{ color: theme.textTertiary }}>Turnaround: {s.turnaround}</span>
                </div>
              )}
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};

/* ── Pricing variant: side-by-side comparison ── */
const PricingVariant = ({ items, theme }: { items: any[]; theme: any }) => {
  // Collect all unique deliverables
  const allDeliverables = Array.from(new Set(items.flatMap(s => s.deliverables || [])));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((s, idx) => {
        const color = SERVICE_COLORS[idx % SERVICE_COLORS.length];
        return (
          <div key={s.id} className="overflow-hidden" style={{
            backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
            backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
            border: s.is_featured ? `2px solid ${theme.accentPrimary}` : `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
            borderRadius: theme.cardRadius,
          }}>
            {s.is_featured && (
              <div className="text-center py-1.5 text-[9px] font-bold uppercase tracking-widest" style={{ backgroundColor: theme.accentPrimary, color: theme.textOnAccent }}>
                Most Popular
              </div>
            )}
            <div className="p-5 space-y-4">
              <div className="text-center">
                <h4 className="font-semibold text-[16px]" style={{ color: theme.textPrimary, fontFamily: theme.fontDisplay }}>{s.name}</h4>
                {s.starting_price && <p className="text-2xl font-bold mt-1" style={{ color: color.fg }}>{s.starting_price}</p>}
                {s.turnaround && <p className="text-[11px] mt-1" style={{ color: theme.textTertiary }}>{s.turnaround}</p>}
              </div>
              {s.description && <p className="text-[12px] text-center leading-relaxed" style={{ color: theme.textSecondary }}>{s.description}</p>}
              <div className="space-y-2 pt-2" style={{ borderTop: `1px solid ${theme.borderDefault}` }}>
                {allDeliverables.map((d, i) => {
                  const has = (s.deliverables || []).includes(d);
                  return (
                    <div key={i} className="flex items-center gap-2 text-[12px]" style={{ color: has ? theme.textSecondary : theme.textTertiary, opacity: has ? 1 : 0.4 }}>
                      <Check className="w-3.5 h-3.5 shrink-0" style={{ color: has ? color.fg : theme.textTertiary }} />
                      <span className={has ? '' : 'line-through'}>{d}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SectionServices;
