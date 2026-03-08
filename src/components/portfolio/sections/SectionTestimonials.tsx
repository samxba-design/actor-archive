import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
}

const SectionTestimonials = ({ items }: Props) => {
  const theme = usePortfolioTheme();
  const useCarousel = items.length > 2;
  const [active, setActive] = useState(0);

  const next = useCallback(() => setActive(i => (i + 1) % items.length), [items.length]);
  const prev = useCallback(() => setActive(i => (i - 1 + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (!useCarousel) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [useCarousel, next]);

  if (useCarousel) {
    const t = items[active];
    return (
      <div className="relative max-w-2xl mx-auto text-center py-6">
        <span
          className="block text-7xl leading-none select-none mb-2"
          style={{ color: `${theme.accentPrimary}25`, fontFamily: theme.fontDisplay }}
          aria-hidden="true"
        >
          \u201C
        </span>
        <p
          className="text-lg sm:text-xl italic leading-relaxed mb-6 transition-opacity duration-300"
          style={{ color: theme.textPrimary, fontFamily: theme.fontLogline }}
          key={active}
        >
          {t.quote}
        </p>
        <div className="flex items-center justify-center gap-3 mb-5">
          {t.author_photo_url && (
            <img
              src={t.author_photo_url}
              alt={t.author_name}
              className="w-11 h-11 rounded-full object-cover"
              style={{ boxShadow: `0 0 0 2px ${theme.accentPrimary}50` }}
            />
          )}
          <div className="text-left">
            <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{t.author_name}</p>
            <p className="text-xs" style={{ color: theme.accentPrimary }}>
              {[t.author_role, t.author_company].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button onClick={prev} className="p-2 rounded-full transition-colors" style={{ color: theme.textSecondary, backgroundColor: theme.bgElevated }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === active ? theme.accentPrimary : theme.borderDefault,
                  transform: i === active ? "scale(1.4)" : "scale(1)",
                }}
              />
            ))}
          </div>
          <button onClick={next} className="p-2 rounded-full transition-colors" style={{ color: theme.textSecondary, backgroundColor: theme.bgElevated }}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((t) => (
        <div
          key={t.id}
          className="p-5 space-y-3 relative"
          style={{
            backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
            backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
            border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
            borderRadius: theme.cardRadius,
          }}
        >
          <span
            className="text-4xl leading-none select-none absolute top-3 left-4"
            style={{ color: `${theme.accentPrimary}20`, fontFamily: theme.fontDisplay }}
            aria-hidden="true"
          >
            \u201C
          </span>
          <p className="text-sm italic leading-relaxed pt-5" style={{ color: theme.textPrimary, fontFamily: theme.fontLogline }}>{t.quote}</p>
          <div className="flex items-center gap-3">
            {t.author_photo_url && (
              <img src={t.author_photo_url} alt={t.author_name} className="w-9 h-9 rounded-full object-cover" style={{ boxShadow: `0 0 0 2px ${theme.accentPrimary}40` }} />
            )}
            <div>
              <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{t.author_name}</p>
              <p className="text-xs" style={{ color: theme.accentPrimary }}>{[t.author_role, t.author_company].filter(Boolean).join(", ")}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionTestimonials;
