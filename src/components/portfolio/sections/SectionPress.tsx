import { ExternalLink, Star } from "lucide-react";

interface Props {
  items: any[];
}

const SectionPress = ({ items }: Props) => (
  <div className="space-y-4">
    {items.map((p) => (
      <div
        key={p.id}
        className="flex gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        style={{
          backgroundColor: "hsl(var(--portfolio-card))",
          border: "1px solid hsl(var(--portfolio-border))",
          borderRadius: "var(--portfolio-radius)",
        }}
      >
        {p.publication_logo_url && (
          <img src={p.publication_logo_url} alt={p.publication || ""} className="w-14 h-14 object-contain flex-shrink-0 grayscale" />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{p.title}</p>
          <div className="flex items-center gap-2 mt-1">
            {p.publication && (
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "hsl(var(--portfolio-accent))" }}>
                {p.publication}
              </span>
            )}
            {p.date && (
              <span className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{p.date}</span>
            )}
          </div>
          {p.pull_quote && (
            <blockquote
              className="mt-3 text-sm italic leading-relaxed pl-4 relative"
              style={{ color: "hsl(var(--portfolio-fg) / 0.85)" }}
            >
              <span
                className="absolute left-0 top-0 text-2xl font-serif leading-none"
                style={{ color: "hsl(var(--portfolio-accent) / 0.4)" }}
              >
                "
              </span>
              {p.pull_quote}
            </blockquote>
          )}
          {p.star_rating && (
            <div className="flex gap-0.5 mt-2">
              {Array.from({ length: p.star_rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" style={{ color: "hsl(var(--portfolio-accent))" }} />
              ))}
            </div>
          )}
          {p.article_url && (
            <a href={p.article_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs mt-2 font-medium hover:opacity-80 transition-opacity" style={{ color: "hsl(var(--portfolio-accent))" }}>
              <ExternalLink className="w-3.5 h-3.5" /> Read Article
            </a>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default SectionPress;
