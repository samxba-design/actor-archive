import { FileText, ExternalLink } from "lucide-react";

interface Props {
  items: any[];
}

const SectionWritingSamples = ({ items }: Props) => {
  // Group by writing_samples_category
  const grouped = items.reduce((acc: Record<string, any[]>, item) => {
    const cat = item.writing_samples_category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, samples]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
            {category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {samples.map((sample: any) => (
              <a
                key={sample.id}
                href={sample.article_url || sample.script_pdf_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 group"
                style={{
                  backgroundColor: "hsl(var(--portfolio-card))",
                  border: "1px solid hsl(var(--portfolio-border))",
                  borderRadius: "var(--portfolio-radius)",
                }}
              >
                <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--portfolio-accent))" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:underline" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{sample.title}</p>
                  <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
                    {[sample.client || sample.publication, sample.year].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100" style={{ color: "hsl(var(--portfolio-muted-fg))" }} />
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionWritingSamples;
