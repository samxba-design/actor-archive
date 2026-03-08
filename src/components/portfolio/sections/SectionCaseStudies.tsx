import { TrendingUp, BarChart3 } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
  variant?: 'stack' | 'magazine' | 'grid' | 'metrics';
}

const MetricCards = ({ metrics, theme }: { metrics: any[]; theme: any }) => {
  if (!metrics?.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
      {metrics.slice(0, 3).map((m: any, i: number) => (
        <div
          key={i}
          className="p-3 text-center"
          style={{
            backgroundColor: `${theme.accentPrimary}0d`,
            border: `1px solid ${theme.accentPrimary}25`,
            borderRadius: theme.cardRadius,
          }}
        >
          <p className="text-lg sm:text-xl font-bold tabular-nums" style={{ color: theme.accentPrimary }}>
            {m.value}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: theme.textTertiary }}>
            {m.label}
          </p>
        </div>
      ))}
    </div>
  );
};

const CaseCard = ({ cs, theme, showImage = false, large = false }: { cs: any; theme: any; showImage?: boolean; large?: boolean }) => {
  const metrics = Array.isArray(cs.metric_callouts) ? cs.metric_callouts : [];

  return (
    <div
      className={`${large ? 'p-6 sm:p-8' : 'p-5'} space-y-4 overflow-hidden`}
      style={{
        backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
        border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
        borderRadius: theme.cardRadius,
        boxShadow: theme.cardShadow,
      }}
    >
      {showImage && (cs.poster_url || cs.custom_image_url) && (
        <div className="aspect-video overflow-hidden -mx-5 -mt-5 sm:-mx-8 sm:-mt-8 mb-4" style={{ borderRadius: `${theme.cardRadius} ${theme.cardRadius} 0 0` }}>
          <img src={cs.poster_url || cs.custom_image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`font-bold ${large ? 'text-xl' : 'text-lg'}`} style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{cs.title}</p>
          {cs.client && <p className="text-sm mt-0.5" style={{ color: theme.textSecondary }}>Client: {cs.client}</p>}
        </div>
        {!showImage && (cs.poster_url || cs.custom_image_url) && (
          <img src={cs.poster_url || cs.custom_image_url} alt="" className="w-16 h-16 object-cover rounded flex-shrink-0" />
        )}
      </div>

      {/* Metrics first if available */}
      {metrics.length > 0 && <MetricCards metrics={metrics} theme={theme} />}

      {cs.challenge && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: theme.accentPrimary }}>Challenge</p>
          <p className="text-sm" style={{ color: theme.textSecondary }}>{cs.challenge}</p>
        </div>
      )}
      {cs.solution && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: theme.accentPrimary }}>Solution</p>
          <p className="text-sm" style={{ color: theme.textSecondary }}>{cs.solution}</p>
        </div>
      )}
      {cs.results && (
        <div className="flex items-start gap-2">
          <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: theme.accentPrimary }} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: theme.accentPrimary }}>Results</p>
            <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>{cs.results}</p>
          </div>
        </div>
      )}

      {cs.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {cs.tags.map((tag: string) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.bgElevated, color: theme.textTertiary }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const SectionCaseStudies = ({ items, variant = 'stack' }: Props) => {
  const theme = usePortfolioTheme();

  if (variant === 'magazine') {
    const featured = items.filter(cs => cs.is_featured);
    const rest = items.filter(cs => !cs.is_featured);
    return (
      <div className="space-y-6">
        {featured.map(cs => (
          <CaseCard key={cs.id} cs={cs} theme={theme} showImage large />
        ))}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rest.map(cs => (
              <CaseCard key={cs.id} cs={cs} theme={theme} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(cs => (
          <CaseCard key={cs.id} cs={cs} theme={theme} />
        ))}
      </div>
    );
  }

  if (variant === 'metrics') {
    // Metrics-first: large stat grid, then case study cards
    const allMetrics = items
      .filter(cs => Array.isArray(cs.metric_callouts) && cs.metric_callouts.length > 0)
      .flatMap(cs => cs.metric_callouts.map((m: any) => ({ ...m, client: cs.client || cs.title })));

    return (
      <div className="space-y-8">
        {allMetrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {allMetrics.slice(0, 8).map((m: any, i: number) => (
              <div
                key={i}
                className="p-4 text-center"
                style={{
                  backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
                  border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
                  borderRadius: theme.cardRadius,
                }}
              >
                <p className="text-2xl sm:text-3xl font-bold tabular-nums" style={{ color: theme.accentPrimary }}>
                  {m.value}
                </p>
                <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: theme.textTertiary }}>
                  {m.label}
                </p>
                <p className="text-[9px] mt-1 truncate" style={{ color: theme.textSecondary }}>
                  {m.client}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-4">
          {items.map(cs => (
            <CaseCard key={cs.id} cs={cs} theme={theme} />
          ))}
        </div>
      </div>
    );
  }

  // Default: stack
  return (
    <div className="space-y-6">
      {items.map(cs => (
        <CaseCard key={cs.id} cs={cs} theme={theme} />
      ))}
    </div>
  );
};

export default SectionCaseStudies;
