import { ExternalLink, Newspaper } from "lucide-react";

interface Props {
  items: any[];
}

const SectionArticleFeed = ({ items }: Props) => (
  <div className="space-y-3">
    {items.map((article) => (
      <a
        key={article.id}
        href={article.article_url || article.video_url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-4 p-4 group transition-colors"
        style={{
          backgroundColor: "hsl(var(--portfolio-card))",
          border: "1px solid hsl(var(--portfolio-border))",
          borderRadius: "var(--portfolio-radius)",
        }}
      >
        {(article.custom_image_url || article.thumbnail_url) ? (
          <img src={article.custom_image_url || article.thumbnail_url} alt="" className="w-20 h-14 object-cover rounded flex-shrink-0" />
        ) : (
          <div className="w-20 h-14 rounded flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "hsl(var(--portfolio-muted))" }}>
            <Newspaper className="w-5 h-5" style={{ color: "hsl(var(--portfolio-muted-fg))" }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm group-hover:underline" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{article.title}</p>
          <p className="text-xs mt-0.5" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
            {[article.publication || article.client, article.year].filter(Boolean).join(" · ")}
          </p>
          {article.description && (
            <p className="text-xs mt-1 line-clamp-2" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{article.description}</p>
          )}
        </div>
        <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "hsl(var(--portfolio-muted-fg))" }} />
      </a>
    ))}
  </div>
);

export default SectionArticleFeed;
