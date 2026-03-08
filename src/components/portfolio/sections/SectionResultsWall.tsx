import { TrendingUp } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[]; // case_study projects with metric_callouts
}

const SectionResultsWall = ({ items }: Props) => {
  const theme = usePortfolioTheme();

  // Aggregate all metrics across case studies
  const allMetrics = items
    .filter(cs => Array.isArray(cs.metric_callouts) && cs.metric_callouts.length > 0)
    .flatMap(cs =>
      cs.metric_callouts.map((m: any) => ({
        value: m.value,
        label: m.label,
        client: cs.client || cs.title,
      }))
    );

  if (allMetrics.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {allMetrics.slice(0, 12).map((m, i) => (
          <div
            key={i}
            className="group p-5 text-center transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
              border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
              borderRadius: theme.cardRadius,
              boxShadow: theme.cardShadow,
            }}
          >
            <TrendingUp
              className="w-4 h-4 mx-auto mb-2 opacity-40 group-hover:opacity-100 transition-opacity"
              style={{ color: theme.accentPrimary }}
            />
            <p
              className="text-2xl sm:text-3xl font-bold tabular-nums"
              style={{ fontFamily: theme.fontDisplay, color: theme.accentPrimary }}
            >
              {m.value}
            </p>
            <p className="text-[11px] uppercase tracking-wider mt-1.5 font-medium" style={{ color: theme.textSecondary }}>
              {m.label}
            </p>
            <p className="text-[9px] uppercase tracking-widest mt-1 truncate" style={{ color: theme.textTertiary }}>
              {m.client}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionResultsWall;
