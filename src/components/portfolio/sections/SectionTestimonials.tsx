import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Props {
  items: any[];
}

const SectionTestimonials = ({ items }: Props) => {
  const useCarousel = items.length > 2;
  const [active, setActive] = useState(0);

  const next = useCallback(() => setActive(i => (i + 1) % items.length), [items.length]);
  const prev = useCallback(() => setActive(i => (i - 1 + items.length) % items.length), [items.length]);

  // Auto-advance carousel
  useEffect(() => {
    if (!useCarousel) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [useCarousel, next]);

  if (useCarousel) {
    const t = items[active];
    return (
      <div className="relative max-w-2xl mx-auto text-center">
        <Quote className="w-8 h-8 mx-auto mb-4" style={{ color: "hsl(var(--portfolio-accent) / 0.3)" }} />
        <p
          className="text-lg sm:text-xl italic leading-relaxed mb-6 transition-opacity duration-300"
          style={{ color: "hsl(var(--portfolio-card-fg))", fontFamily: "var(--portfolio-heading-font)" }}
          key={active}
        >
          "{t.quote}"
        </p>
        <div className="flex items-center justify-center gap-3 mb-6">
          {t.author_photo_url && (
            <img src={t.author_photo_url} alt={t.author_name} className="w-10 h-10 rounded-full object-cover" />
          )}
          <div className="text-left">
            <p className="text-sm font-semibold" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{t.author_name}</p>
            <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
              {[t.author_role, t.author_company].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={prev} className="p-1.5 rounded-full transition-colors hover:bg-black/10"
            style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-1.5">
            {items.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ backgroundColor: i === active ? "hsl(var(--portfolio-accent))" : "hsl(var(--portfolio-muted))" }} />
            ))}
          </div>
          <button onClick={next} className="p-1.5 rounded-full transition-colors hover:bg-black/10"
            style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Grid for 1-2 testimonials
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((t) => (
        <div
          key={t.id}
          className="p-5 space-y-3"
          style={{
            backgroundColor: "hsl(var(--portfolio-card))",
            border: "1px solid hsl(var(--portfolio-border))",
            borderRadius: "var(--portfolio-radius)",
          }}
        >
          <Quote className="w-5 h-5" style={{ color: "hsl(var(--portfolio-accent) / 0.4)" }} />
          <p className="text-sm italic leading-relaxed" style={{ color: "hsl(var(--portfolio-card-fg))" }}>
            "{t.quote}"
          </p>
          <div className="flex items-center gap-2">
            {t.author_photo_url && (
              <img src={t.author_photo_url} alt={t.author_name} className="w-8 h-8 rounded-full object-cover" />
            )}
            <div>
              <p className="text-xs font-semibold" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{t.author_name}</p>
              <p className="text-[10px]" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
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
