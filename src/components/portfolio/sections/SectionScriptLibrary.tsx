import { FileText, Download, Lock } from "lucide-react";

interface Props {
  items: any[];
}

const SectionScriptLibrary = ({ items }: Props) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {items.map((p) => (
      <div
        key={p.id}
        className="p-5 space-y-3"
        style={{
          backgroundColor: "hsl(var(--portfolio-card))",
          border: "1px solid hsl(var(--portfolio-border))",
          borderRadius: "var(--portfolio-radius)",
        }}
      >
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--portfolio-accent))" }} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{p.title}</p>
            <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
              {[p.format, p.genre?.join(", "), p.page_count ? `${p.page_count} pages` : null, p.year].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        {p.logline && (
          <p className="text-sm italic" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>"{p.logline}"</p>
        )}
        {p.coverage_excerpt && (
          <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{p.coverage_excerpt}</p>
        )}
        <div className="flex items-center gap-2 pt-1">
          {p.access_level === "public" && p.script_pdf_url ? (
            <a
              href={p.script_pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md"
              style={{
                backgroundColor: "hsl(var(--portfolio-accent))",
                color: "hsl(var(--portfolio-accent-fg))",
              }}
            >
              <Download className="w-3 h-3" /> Read Script
            </a>
          ) : p.script_pdf_url ? (
            <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md" style={{ backgroundColor: "hsl(var(--portfolio-muted))", color: "hsl(var(--portfolio-muted-fg))" }}>
              <Lock className="w-3 h-3" /> Request Access
            </span>
          ) : null}
          {p.status && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "hsl(var(--portfolio-muted))", color: "hsl(var(--portfolio-muted-fg))" }}>
              {p.status}
            </span>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default SectionScriptLibrary;
