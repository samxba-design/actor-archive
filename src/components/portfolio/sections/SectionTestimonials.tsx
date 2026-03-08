import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Props {
  items: any[];
}

const SectionTestimonials = ({ items }: Props) => {
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
      <div className="relative max-w-2xl mx-auto text-center py-8">
        {/* Large decorative quote mark */}
        <span
          className="block text-7xl sm:text-8xl font-serif leading-none select-none mb-2"
          style={{ color: "hsl(var(--portfolio-accent) / 0.15)", fontFamily: "Georgia, serif" }}
          aria-hidden="true"
        >
          "
        </span>
        <p
          className="text-lg sm:text-xl italic leading-relaxed mb-8 transition-opacity duration-300"
          style={{ color: "hsl(var(--portfolio-card-fg))", fontFamily: "var(--portfolio-heading-font)" }}
          key={active}
        >
          {t.quote}
        </p>
        <div className="flex items-center justify-center gap-3 mb-6">
          {t.author_photo_url && (
            <img src={t.author_photo_url} alt={t.author_name} className="w-12 h-12 rounded-full object-cover ring-2" style={{ ringColor: "hsl(var(--portfolio-accent) / 0.3)" }} />
          )}
          <div className="text-left">
            <p className="text-sm font-semibold" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{t.author_name}</p>
            <p className="text-xs" style={{ color: "hsl(var(--portfolio-accent))" }}>
              {[t.author_role, t.author_company].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button onClick={prev} className="p-2 rounded-full transition-colors" style={{ color: "hsl(var(--portfolio-muted-fg))", backgroundColor: "hsl(var(--portfolio-muted))" }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === active ? "hsl(var(--portfolio-accent))" : "hsl(var(--portfolio-muted))",
                  transform: i === active ? "scale(1.4)" : "scale(1)",
                }}
              />
            ))}
          </div>
          <button onClick={next} className="p-2 rounded-full transition-colors" style={{ color: "hsl(var(--portfolio-muted-fg))", backgroundColor: "hsl(var(--portfolio-muted))" }}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((t) => (
        <div
          key={t.id}
          className="p-6 space-y-4 relative"
          style={{
            backgroundColor: "hsl(var(--portfolio-card))",
            border: "1px solid hsl(var(--portfolio-border))",
            borderRadius: "var(--portfolio-radius)",
          }}
        >
          <span
            className="text-5xl font-serif leading-none select-none absolute top-3 left-4"
            style={{ color: "hsl(var(--portfolio-accent) / 0.15)", fontFamily: "Georgia, serif" }}
            aria-hidden="true"
          >
            "
          </span>
          <p className="text-sm italic leading-relaxed pt-6" style={{ color: "hsl(var(--portfolio-card-fg))" }}>
            {t.quote}
          </p>
          <div className="flex items-center gap-3">
            {t.author_photo_url && (
              <img src={t.author_photo_url} alt={t.author_name} className="w-10 h-10 rounded-full object-cover" />
            )}
            <div>
              <p className="text-sm font-semibold" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{t.author_name}</p>
              <p className="text-xs" style={{ color: "hsl(var(--portfolio-accent))" }}>
                {[t.author_role, t.author_company].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionTestimonials;
