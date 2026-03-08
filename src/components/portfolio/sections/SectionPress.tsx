import { ExternalLink, Star, ArrowRight } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
}

const SectionPress = ({ items }: Props) => {
  const theme = usePortfolioTheme();

  return (
    <div className="space-y-3">
      {items.map((p) => (
        <div
          key={p.id}
          className="flex gap-4 p-4 transition-all"
          style={{
            backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
            backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
            border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
            borderRadius: theme.cardRadius,
            transitionDuration: theme.hoverTransitionDuration,
          }}
        >
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight" style={{ color: theme.textPrimary }}>{p.title}</p>
            <div className="flex items-center gap-2 mt-1">
              {p.publication && (
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.accentPrimary }}>
                  {p.publication}
                </span>
              )}
              {p.date && <span className="text-xs" style={{ color: theme.textTertiary }}>{p.date}</span>}
            </div>
            {p.pull_quote && (
              <blockquote
                className="mt-3 text-sm italic leading-relaxed pl-4"
                style={{
                  color: theme.textPrimary,
                  borderLeft: `2px solid ${theme.accentPrimary}40`,
                  fontFamily: theme.fontLogline,
                }}
              >
                \u201C{p.pull_quote}\u201D
              </blockquote>
            )}
            {p.star_rating && (
              <div className="flex gap-0.5 mt-2">
                {Array.from({ length: p.star_rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: theme.accentPrimary }} />
                ))}
              </div>
            )}
            {p.article_url && (
              <a
                href={p.article_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] uppercase tracking-widest font-medium mt-2 transition-colors group"
                style={{ color: theme.accentPrimary, letterSpacing: '0.06em' }}
              >
                Read Article
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionPress;
