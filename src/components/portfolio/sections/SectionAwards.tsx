import { Award } from "lucide-react";

interface Props {
  items: any[];
}

const SectionAwards = ({ items }: Props) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {items.map((a) => (
      <div
        key={a.id}
        className="flex items-start gap-3 p-4"
        style={{
          backgroundColor: "hsl(var(--portfolio-card))",
          border: "1px solid hsl(var(--portfolio-border))",
          borderRadius: "var(--portfolio-radius)",
        }}
      >
        {a.laurel_image_url ? (
          <img src={a.laurel_image_url} alt="" className="w-12 h-12 object-contain flex-shrink-0" />
        ) : (
          <Award className="w-6 h-6 flex-shrink-0" style={{ color: "hsl(var(--portfolio-accent))" }} />
        )}
        <div>
          <p className="font-semibold text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>
            {a.name}
          </p>
          {a.category && (
            <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{a.category}</p>
          )}
          <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
            {[a.organization, a.year, a.result].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default SectionAwards;
