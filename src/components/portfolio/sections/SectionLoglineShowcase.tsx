import { Sparkles } from "lucide-react";

interface Props {
  items: any[];
}

const SectionLoglineShowcase = ({ items }: Props) => {
  const withLoglines = items.filter((p) => p.logline);
  if (withLoglines.length === 0) return null;

  return (
    <div className="space-y-4">
      {withLoglines.map((p) => (
        <div
          key={p.id}
          className="p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          style={{
            backgroundColor: "hsl(var(--portfolio-card))",
            borderRadius: "var(--portfolio-radius)",
            borderLeft: "3px solid hsl(var(--portfolio-accent))",
            borderTop: "1px solid hsl(var(--portfolio-border))",
            borderRight: "1px solid hsl(var(--portfolio-border))",
            borderBottom: "1px solid hsl(var(--portfolio-border))",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" style={{ color: "hsl(var(--portfolio-accent))" }} />
            <span className="font-semibold text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{p.title}</span>
            {p.genre?.length > 0 && (
              <div className="flex gap-1 ml-auto">
                {p.genre.slice(0, 3).map((g: string) => (
                  <span key={g} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "hsl(var(--portfolio-muted))", color: "hsl(var(--portfolio-muted-fg))" }}>
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
          <p className="text-sm italic leading-relaxed" style={{ color: "hsl(var(--portfolio-fg))" }}>
            "{p.logline}"
          </p>
          <p className="text-xs mt-2" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
            {[p.format, p.page_count ? `${p.page_count} pages` : null, p.status].filter(Boolean).join(" · ")}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SectionLoglineShowcase;
