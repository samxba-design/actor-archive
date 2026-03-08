import { usePortfolioTheme } from "@/themes/ThemeProvider";
import CompanyLogo from "@/components/CompanyLogo";
import { TrendingUp } from "lucide-react";

interface Props {
  items: any[]; // projects sorted by year desc
}

const SectionCampaignTimeline = ({ items }: Props) => {
  const theme = usePortfolioTheme();
  const sorted = [...items].sort((a, b) => (b.year || 0) - (a.year || 0));

  if (sorted.length === 0) return null;

  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div
        className="absolute left-2 top-0 bottom-0 w-px"
        style={{ backgroundColor: theme.borderDefault }}
      />

      <div className="space-y-6">
        {sorted.map((item, i) => {
          const metrics = Array.isArray(item.metric_callouts) ? item.metric_callouts : [];
          return (
            <div key={item.id} className="relative">
              {/* Dot */}
              <div
                className="absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor: theme.accentPrimary,
                  backgroundColor: i === 0 ? theme.accentPrimary : theme.bgPrimary,
                }}
              >
                {i === 0 && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.textOnAccent }} />}
              </div>

              <div
                className="p-4 transition-all"
                style={{
                  backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
                  border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
                  borderRadius: theme.cardRadius,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {item.year && (
                        <span className="text-[10px] font-bold uppercase tracking-widest tabular-nums" style={{ color: theme.accentPrimary }}>
                          {item.year}
                        </span>
                      )}
                      {item.client && (
                        <span className="text-[10px] uppercase tracking-wider" style={{ color: theme.textTertiary }}>
                          {item.client}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>
                      {item.title}
                    </p>
                    {item.results && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <TrendingUp className="w-3 h-3" style={{ color: theme.accentPrimary }} />
                        <p className="text-xs" style={{ color: theme.textSecondary }}>{item.results}</p>
                      </div>
                    )}
                  </div>
                  {item.client && (
                    <CompanyLogo companyName={item.client} size={24} grayscale />
                  )}
                </div>

                {metrics.length > 0 && (
                  <div className="flex gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${theme.borderDefault}` }}>
                    {metrics.slice(0, 3).map((m: any, j: number) => (
                      <div key={j} className="text-center flex-1">
                        <p className="text-sm font-bold tabular-nums" style={{ color: theme.accentPrimary }}>{m.value}</p>
                        <p className="text-[9px] uppercase tracking-wider" style={{ color: theme.textTertiary }}>{m.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionCampaignTimeline;
