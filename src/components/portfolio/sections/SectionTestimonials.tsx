import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import CompanyLogo from "@/components/CompanyLogo";

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
      <div className="relative max-w-2xl mx-auto text-center py-4">
        <span
          className="block text-5xl leading-none select-none mb-1"
          style={{ color: `${theme.accentPrimary}20`, fontFamily: theme.fontDisplay }}
          aria-hidden="true"
        >
          "
        </span>
        <p
          className="text-base sm:text-lg italic leading-relaxed mb-4 transition-opacity duration-300"
          style={{ color: theme.textPrimary, fontFamily: theme.fontLogline }}
          key={active}
        >
          {t.quote}
        </p>
        <div className="flex items-center justify-center gap-3 mb-4">
          {t.author_photo_url && (
            <img
              src={t.author_photo_url}
              alt={t.author_name}
              className="w-9 h-9 rounded-full object-cover"
              style={{ boxShadow: `0 0 0 2px ${theme.accentPrimary}30` }}
            />
          )}
          <div className="text-left">
            <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{t.author_name}</p>
            <div className="flex items-center gap-2">
              <p className="text-[11px]" style={{ color: theme.textSecondary }}>
                {[t.author_role, t.author_company].filter(Boolean).join(", ")}
              </p>
              {t.author_company && <CompanyLogo companyName={t.author_company} size={16} grayscale={false} />}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button onClick={prev} className="p-1.5 rounded-full transition-colors" style={{ color: theme.textTertiary, backgroundColor: theme.bgElevated }}>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div className="flex gap-1.5">
            {items.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === active ? theme.accentPrimary : theme.borderDefault,
                  transform: i === active ? "scale(1.5)" : "scale(1)",
                }}
              />
            ))}
          </div>
          <button onClick={next} className="p-1.5 rounded-full transition-colors" style={{ color: theme.textTertiary, backgroundColor: theme.bgElevated }}>
            <ChevronRight className="w-3.5 h-3.5" />
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
          className="p-4 space-y-2.5 relative"
          style={{
            backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
            backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
            border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
            borderRadius: theme.cardRadius,
          }}
        >
          <span className="text-3xl leading-none select-none absolute top-2 left-3" style={{ color: `${theme.accentPrimary}15`, fontFamily: theme.fontDisplay }} aria-hidden="true">"</span>
          <p className="text-[13px] italic leading-relaxed pt-4" style={{ color: theme.textPrimary, fontFamily: theme.fontLogline }}>{t.quote}</p>
          <div className="flex items-center gap-2.5">
            {t.author_photo_url && (
              <img src={t.author_photo_url} alt={t.author_name} className="w-8 h-8 rounded-full object-cover" style={{ boxShadow: `0 0 0 1.5px ${theme.accentPrimary}30` }} />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold" style={{ color: theme.textPrimary }}>{t.author_name}</p>
              <p className="text-[11px]" style={{ color: theme.textSecondary }}>{[t.author_role, t.author_company].filter(Boolean).join(", ")}</p>
            </div>
            {t.author_company && <CompanyLogo companyName={t.author_company} size={18} grayscale />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionTestimonials;
