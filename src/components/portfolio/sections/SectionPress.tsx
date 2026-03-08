import { ExternalLink, Star } from "lucide-react";

interface Props {
  items: any[];
}

const SectionPress = ({ items }: Props) => (
  <div className="space-y-4">
    {items.map((p) => (
      <div
        key={p.id}
        className="flex gap-4 p-4"
        style={{
          backgroundColor: "hsl(var(--portfolio-card))",
          border: "1px solid hsl(var(--portfolio-border))",
          borderRadius: "var(--portfolio-radius)",
        }}
      >
        {p.publication_logo_url && (
          <img src={p.publication_logo_url} alt={p.publication || ""} className="w-12 h-12 object-contain flex-shrink-0 grayscale" />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{p.title}</p>
          <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
            {[p.publication, p.date].filter(Boolean).join(" · ")}
          </p>
          {p.pull_quote && (
            <blockquote className="mt-2 text-sm italic border-l-2 pl-3" style={{ borderColor: "hsl(var(--portfolio-accent))", color: "hsl(var(--portfolio-fg) / 0.8)" }}>
              "{p.pull_quote}"
            </blockquote>
          )}
          {p.star_rating && (
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: p.star_rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: "hsl(var(--portfolio-accent))" }} />
              ))}
            </div>
          )}
          {p.article_url && (
            <a href={p.article_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs mt-2 hover:opacity-80" style={{ color: "hsl(var(--portfolio-accent))" }}>
              <ExternalLink className="w-3 h-3" /> Read
            </a>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default SectionPress;
