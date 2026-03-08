import { Award, Trophy } from "lucide-react";

interface Props {
  items: any[];
}

const resultColors: Record<string, { bg: string; fg: string }> = {
  Winner: { bg: "hsl(var(--portfolio-accent))", fg: "hsl(var(--portfolio-accent-fg))" },
  Gold: { bg: "hsl(var(--portfolio-accent))", fg: "hsl(var(--portfolio-accent-fg))" },
  Nominated: { bg: "hsl(var(--portfolio-accent) / 0.15)", fg: "hsl(var(--portfolio-accent))" },
  Featured: { bg: "hsl(var(--portfolio-accent) / 0.15)", fg: "hsl(var(--portfolio-accent))" },
};

const SectionAwards = ({ items }: Props) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {items.map((a) => {
      const colors = resultColors[a.result] || { bg: "hsl(var(--portfolio-muted))", fg: "hsl(var(--portfolio-muted-fg))" };
      return (
        <div
          key={a.id}
          className="flex items-start gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          style={{
            backgroundColor: "hsl(var(--portfolio-card))",
            border: "1px solid hsl(var(--portfolio-border))",
            borderRadius: "var(--portfolio-radius)",
          }}
        >
          {a.laurel_image_url ? (
            <img src={a.laurel_image_url} alt="" className="w-14 h-14 object-contain flex-shrink-0" />
          ) : (
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "hsl(var(--portfolio-accent) / 0.12)" }}
            >
              {a.result === "Winner" || a.result === "Gold" ? (
                <Trophy className="w-5 h-5" style={{ color: "hsl(var(--portfolio-accent))" }} />
              ) : (
                <Award className="w-5 h-5" style={{ color: "hsl(var(--portfolio-accent))" }} />
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>
                {a.name}
              </p>
              {a.result && (
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors.bg, color: colors.fg }}
                >
                  {a.result}
                </span>
              )}
            </div>
            {a.category && (
              <p className="text-xs mt-0.5" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{a.category}</p>
            )}
            <p className="text-xs mt-0.5" style={{ color: "hsl(var(--portfolio-muted-fg) / 0.7)" }}>
              {[a.organization, a.year].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
      );
    })}
  </div>
);

export default SectionAwards;
