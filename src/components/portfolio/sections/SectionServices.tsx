import { CheckCircle, Star } from "lucide-react";

interface Props {
  items: any[];
}

const SectionServices = ({ items }: Props) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {items.map((s) => (
      <div
        key={s.id}
        className="relative p-5 space-y-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        style={{
          backgroundColor: "hsl(var(--portfolio-card))",
          border: s.is_featured ? "2px solid hsl(var(--portfolio-accent))" : "1px solid hsl(var(--portfolio-border))",
          borderRadius: "var(--portfolio-radius)",
          boxShadow: s.is_featured ? "0 4px 20px -6px hsl(var(--portfolio-accent) / 0.2)" : undefined,
        }}
      >
        {/* Popular badge for featured */}
        {s.is_featured && (
          <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1"
            style={{ backgroundColor: "hsl(var(--portfolio-accent))", color: "hsl(var(--portfolio-accent-fg))" }}>
            <Star className="w-2.5 h-2.5" /> Popular
          </div>
        )}

        <div className="flex items-baseline justify-between">
          <h4 className="font-semibold text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{s.name}</h4>
          {s.starting_price && (
            <span className="text-sm font-medium" style={{ color: "hsl(var(--portfolio-accent))" }}>
              From {s.starting_price}
            </span>
          )}
        </div>
        {s.description && (
          <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{s.description}</p>
        )}
        {s.deliverables && s.deliverables.length > 0 && (
          <ul className="space-y-1 pt-1">
            {s.deliverables.map((d: string, i: number) => (
              <li key={i} className="flex items-center gap-1.5 text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
                <CheckCircle className="w-3 h-3" style={{ color: "hsl(var(--portfolio-accent))" }} />
                {d}
              </li>
            ))}
          </ul>
        )}
        {s.turnaround && (
          <p className="text-[10px] pt-1" style={{ color: "hsl(var(--portfolio-muted-fg) / 0.7)" }}>
            Turnaround: {s.turnaround}
          </p>
        )}
      </div>
    ))}
  </div>
);

export default SectionServices;
