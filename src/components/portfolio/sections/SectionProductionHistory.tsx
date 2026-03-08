import { Theater } from "lucide-react";

interface Props {
  items: any[];
}

const SectionProductionHistory = ({ items }: Props) => (
  <div className="space-y-4">
    {items.map((prod) => (
      <div
        key={prod.id}
        className="flex items-start gap-4 p-4"
        style={{
          backgroundColor: "hsl(var(--portfolio-card))",
          border: "1px solid hsl(var(--portfolio-border))",
          borderRadius: "var(--portfolio-radius)",
        }}
      >
        <Theater className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--portfolio-accent))" }} />
        <div className="flex-1">
          <p className="font-semibold text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>
            {prod.theatre_name || "Production"}
          </p>
          <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
            {[prod.director ? `Dir. ${prod.director}` : null, prod.city, prod.country, prod.year].filter(Boolean).join(" · ")}
          </p>
          {prod.run_dates && (
            <p className="text-xs mt-1" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{prod.run_dates}</p>
          )}
          {prod.cast_names?.length > 0 && (
            <p className="text-xs mt-1" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
              Cast: {prod.cast_names.join(", ")}
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default SectionProductionHistory;
