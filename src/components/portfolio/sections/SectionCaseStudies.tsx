import { TrendingUp } from "lucide-react";

interface Props {
  items: any[];
}

const SectionCaseStudies = ({ items }: Props) => (
  <div className="space-y-6">
    {items.map((cs) => (
      <div
        key={cs.id}
        className="p-6 space-y-4"
        style={{
          backgroundColor: "hsl(var(--portfolio-card))",
          border: "1px solid hsl(var(--portfolio-border))",
          borderRadius: "var(--portfolio-radius)",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-bold text-lg" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{cs.title}</p>
            {cs.client && <p className="text-sm" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>Client: {cs.client}</p>}
          </div>
          {(cs.poster_url || cs.custom_image_url) && (
            <img src={cs.poster_url || cs.custom_image_url} alt="" className="w-16 h-16 object-cover rounded flex-shrink-0" />
          )}
        </div>

        {cs.challenge && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "hsl(var(--portfolio-accent))" }}>Challenge</p>
            <p className="text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{cs.challenge}</p>
          </div>
        )}
        {cs.solution && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "hsl(var(--portfolio-accent))" }}>Solution</p>
            <p className="text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{cs.solution}</p>
          </div>
        )}
        {cs.results && (
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--portfolio-accent))" }} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "hsl(var(--portfolio-accent))" }}>Results</p>
              <p className="text-sm font-medium" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{cs.results}</p>
            </div>
          </div>
        )}

        {cs.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {cs.tags.map((tag: string) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "hsl(var(--portfolio-muted))", color: "hsl(var(--portfolio-muted-fg))" }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

export default SectionCaseStudies;
