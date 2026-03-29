import { Star, ArrowUpRight, Newspaper, Mic, BookOpen, Quote } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
  variant?: "feed" | "cards" | "quotes";
}

const PRESS_TYPE_CONFIG: Record<string, { icon: any; color: string }> = {
  interview: { icon: Mic,      color: "#6B9FD4" },
  feature:   { icon: BookOpen, color: "#4A9E6B" },
  review:    { icon: Star,     color: "#C9A96E" },
  default:   { icon: Newspaper,color: "#888"    },
};

const StarRating = ({ count, color }: { count: number; color: string }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="w-3 h-3 fill-current" style={{ color }} />
    ))}
  </div>
);

const SectionPress = ({ items, variant = "feed" }: Props) => {
  const theme = usePortfolioTheme();

  // Auto-upgrade to quotes view if most items have pull quotes
  const itemsWithQuotes = items.filter(p => p.pull_quote);
  if (variant === "quotes" || (variant === "feed" && itemsWithQuotes.length >= items.length * 0.6)) {
    return <QuotesVariant items={items} theme={theme} />;
  }
  if (variant === "cards") return <CardsVariant items={items} theme={theme} />;
  return <FeedVariant items={items} theme={theme} />;
};

/* ─── Feed variant ─────────────────────────────────────────────────────────── */
const FeedVariant = ({ items, theme }: { items: any[]; theme: any }) => (
  <div className="divide-y" style={{ borderColor: theme.borderDefault }}>
    {items.map((p, idx) => {
      const typeConfig = PRESS_TYPE_CONFIG[p.press_type] || PRESS_TYPE_CONFIG.default;
      const TypeIcon = typeConfig.icon;
      const isFeatured = idx === 0;
      return (
        <div
          key={p.id}
          className="group py-4 first:pt-0 last:pb-0"
          style={{ borderColor: `${theme.borderDefault}` }}
        >
          <div className="flex gap-3">
            {/* Type badge */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: `${typeConfig.color}15` }}
            >
              <TypeIcon className="w-3.5 h-3.5" style={{ color: typeConfig.color }} />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              {/* Pub + date */}
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: theme.accentPrimary }}
                >
                  {p.publication}
                </span>
                {p.date && (
                  <span className="text-[10px] shrink-0" style={{ color: theme.textTertiary }}>
                    {p.date}
                  </span>
                )}
              </div>

              {/* Title */}
              <p
                className="font-semibold leading-snug"
                style={{
                  color: theme.textPrimary,
                  fontFamily: theme.fontDisplay,
                  fontSize: isFeatured ? "15px" : "13px",
                }}
              >
                {p.title}
              </p>

              {/* Pull quote */}
              {p.pull_quote && (
                <blockquote
                  className="text-[13px] italic leading-relaxed pl-3 mt-1.5"
                  style={{
                    color: theme.textSecondary,
                    borderLeft: `2px solid ${typeConfig.color}50`,
                    fontFamily: theme.fontLogline,
                  }}
                >
                  "{p.pull_quote}"
                </blockquote>
              )}

              {/* Footer row */}
              <div className="flex items-center gap-3 pt-0.5">
                {p.star_rating && <StarRating count={p.star_rating} color="#C9A96E" />}
                {p.article_url && (
                  <a
                    href={p.article_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest transition-opacity hover:opacity-70 ml-auto"
                    style={{ color: theme.accentPrimary }}
                  >
                    Read <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

/* ─── Cards variant ────────────────────────────────────────────────────────── */
const CardsVariant = ({ items, theme }: { items: any[]; theme: any }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {items.map((p) => {
      const typeConfig = PRESS_TYPE_CONFIG[p.press_type] || PRESS_TYPE_CONFIG.default;
      const TypeIcon = typeConfig.icon;
      return (
        <div
          key={p.id}
          className="p-4 space-y-2.5 overflow-hidden relative"
          style={{
            backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
            backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
            border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
            borderRadius: theme.cardRadius,
            borderTop: `2px solid ${typeConfig.color}`,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded flex items-center justify-center"
                style={{ backgroundColor: `${typeConfig.color}15` }}
              >
                <TypeIcon className="w-3 h-3" style={{ color: typeConfig.color }} />
              </div>
              {p.publication && (
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: theme.accentPrimary }}
                >
                  {p.publication}
                </span>
              )}
            </div>
            {p.date && (
              <span className="text-[10px]" style={{ color: theme.textTertiary }}>
                {p.date}
              </span>
            )}
          </div>

          <p
            className="font-semibold text-[14px] leading-snug"
            style={{ color: theme.textPrimary, fontFamily: theme.fontDisplay }}
          >
            {p.title}
          </p>

          {p.star_rating && <StarRating count={p.star_rating} color="#C9A96E" />}

          {p.article_url && (
            <a
              href={p.article_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest transition-opacity hover:opacity-70"
              style={{ color: theme.accentPrimary }}
            >
              Read article <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
        </div>
      );
    })}
  </div>
);

/* ─── Quotes variant ───────────────────────────────────────────────────────── */
const QuotesVariant = ({ items, theme }: { items: any[]; theme: any }) => {
  const withQuotes = items.filter(p => p.pull_quote);
  const withoutQuotes = items.filter(p => !p.pull_quote);
  return (
    <div className="space-y-8">
      {withQuotes.map((p, i) => {
        const typeConfig = PRESS_TYPE_CONFIG[p.press_type] || PRESS_TYPE_CONFIG.default;
        const isFeatured = i === 0;
        return (
          <div key={p.id} className="space-y-2.5">
            {/* Decorative quote mark */}
            <Quote
              className="w-7 h-7 opacity-20"
              style={{ color: theme.accentPrimary }}
            />
            <blockquote
              className="italic leading-relaxed pl-1"
              style={{
                color: theme.textPrimary,
                fontFamily: theme.fontLogline,
                fontSize: isFeatured ? "clamp(15px,2.2vw,19px)" : "clamp(13px,1.8vw,16px)",
                lineHeight: 1.65,
              }}
            >
              {p.pull_quote}
            </blockquote>

            <div className="flex items-center gap-3 pl-1">
              <div className="w-6 h-px" style={{ backgroundColor: theme.accentPrimary }} />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.15em]"
                style={{ color: theme.accentPrimary }}
              >
                {p.publication}
              </span>
              {p.star_rating && <StarRating count={p.star_rating} color="#C9A96E" />}
              {p.article_url && (
                <a
                  href={p.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-[10px] font-semibold uppercase tracking-widest transition-opacity hover:opacity-70"
                  style={{ color: theme.textTertiary }}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            {p.title && (
              <p className="text-[12px] pl-1" style={{ color: theme.textTertiary }}>
                {p.title}
              </p>
            )}
          </div>
        );
      })}
      {/* Render items without quotes as compact list */}
      {withoutQuotes.length > 0 && (
        <div className="pt-2">
          <FeedVariant items={withoutQuotes} theme={theme} />
        </div>
      )}
    </div>
  );
};

export default SectionPress;
