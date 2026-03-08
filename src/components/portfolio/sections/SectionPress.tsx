import { Star, ArrowRight } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
}

const SectionPress = ({ items }: Props) => {
  const theme = usePortfolioTheme();

  return (
    <div className="space-y-2">
      {items.map((p) => (
        <div
          key={p.id}
          className="py-3 transition-all group"
          style={{
            borderBottom: `1px solid ${theme.borderDefault}`,
          }}
        >
          <div className="flex items-baseline gap-2 mb-1">
            {p.publication && (
              <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: theme.accentPrimary }}>
                {p.publication}
              </span>
            )}
            {p.date && <span className="text-[11px]" style={{ color: theme.textTertiary }}>{p.date}</span>}
          </div>
          <p className="font-medium text-[13px] leading-snug" style={{ color: theme.textPrimary }}>{p.title}</p>
          {p.pull_quote && (
            <blockquote
              className="mt-1.5 text-[13px] italic leading-relaxed pl-3"
              style={{
                color: theme.textSecondary,
                borderLeft: `2px solid ${theme.accentPrimary}30`,
                fontFamily: theme.fontLogline,
              }}
            >
              "{p.pull_quote}"
            </blockquote>
          )}
          <div className="flex items-center gap-3 mt-1.5">
            {p.star_rating && (
              <div className="flex gap-0.5">
                {Array.from({ length: p.star_rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" style={{ color: theme.accentPrimary }} />
                ))}
              </div>
            )}
            {p.article_url && (
              <a
                href={p.article_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest font-medium transition-colors"
                style={{ color: theme.accentPrimary }}
              >
                Read
                <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionPress;
