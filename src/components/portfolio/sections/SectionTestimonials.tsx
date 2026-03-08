import { Quote } from "lucide-react";

interface Props {
  items: any[];
}

const SectionTestimonials = ({ items }: Props) => (
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

export default SectionTestimonials;
