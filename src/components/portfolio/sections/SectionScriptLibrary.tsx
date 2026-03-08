import { useState } from "react";
import { FileText, Lock, ArrowRight } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
}

const FILTERS = ["All", "Feature", "Series", "Pilot"];

const SectionScriptLibrary = ({ items }: Props) => {
  const theme = usePortfolioTheme();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? items : items.filter(p => {
    const format = (p.format || p.project_type || "").toLowerCase();
    const filter = activeFilter.toLowerCase();
    return format.includes(filter);
  });

  const featured = filtered.find(p => p.is_featured || p.is_notable);
  const rest = filtered.filter(p => p !== featured);

  return (
    <div className="space-y-4">
      {/* Filter pills */}
      {items.length > 2 && (
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="text-[10px] uppercase tracking-[0.1em] px-3 py-1 rounded-full transition-all duration-200"
              style={{
                backgroundColor: f === activeFilter ? theme.accentPrimary : 'transparent',
                color: f === activeFilter ? theme.textOnAccent : theme.textTertiary,
                border: `1px solid ${f === activeFilter ? theme.accentPrimary : theme.borderDefault}`,
                fontWeight: f === activeFilter ? 600 : 400,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Grid — 2x2 with featured spanning */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {featured && <ScriptCard item={featured} theme={theme} isFeatured />}
        {rest.map(p => <ScriptCard key={p.id} item={p} theme={theme} />)}
      </div>
    </div>
  );
};

const ScriptCard = ({ item: p, theme, isFeatured }: { item: any; theme: any; isFeatured?: boolean }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`transition-all ${isFeatured ? 'sm:col-span-2' : ''}`}
      style={{
        backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
        backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
        WebkitBackdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
        border: `${theme.cardBorderWidth} solid ${hovered ? theme.borderHover : theme.borderDefault}`,
        borderRadius: theme.cardRadius,
        borderLeft: isFeatured ? `3px solid ${theme.accentPrimary}` : undefined,
        padding: isFeatured ? '20px 24px' : '16px 20px',
        boxShadow: hovered ? theme.cardHoverShadow : theme.cardShadow,
        transform: hovered ? theme.cardHoverTransform : 'none',
        transitionDuration: theme.hoverTransitionDuration,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="space-y-1.5">
        {/* Icon + Title */}
        <div className="flex items-start gap-2">
          <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: theme.textTertiary }} />
          <h4
            className="leading-tight transition-colors duration-200"
            style={{
              fontFamily: theme.fontDisplay,
              fontWeight: theme.headingWeight,
              fontSize: isFeatured ? '18px' : '14px',
              color: hovered ? theme.accentPrimary : theme.textPrimary,
            }}
          >
            {p.title}
          </h4>
        </div>

        {/* Format line */}
        <p className="uppercase tracking-widest" style={{ fontSize: '10px', color: theme.textTertiary, letterSpacing: '0.08em' }}>
          {[p.format || p.project_type, p.page_count ? `${p.page_count}pp` : null, p.year].filter(Boolean).join(" · ")}
        </p>

        {/* Logline — only on featured */}
        {isFeatured && p.logline && (
          <p
            className="leading-relaxed line-clamp-2 text-[13px]"
            style={{
              fontFamily: theme.fontLogline,
              fontStyle: theme.loglineStyle,
              color: theme.textSecondary,
            }}
          >
            "{p.logline}"
          </p>
        )}

        {/* Coverage (featured only) */}
        {isFeatured && p.coverage_excerpt && (
          <p className="text-[12px] italic" style={{ color: theme.textTertiary }}>
            {p.coverage_excerpt}
          </p>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          {p.access_level === "public" && p.script_pdf_url ? (
            <a
              href={p.script_pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest font-medium transition-colors group"
              style={{ color: theme.accentPrimary }}
            >
              Read Script
              <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          ) : p.script_pdf_url ? (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest" style={{ color: theme.textTertiary }}>
              <Lock className="w-2.5 h-2.5" /> Request
            </span>
          ) : null}

          {p.status && (
            <span
              className="text-[9px] uppercase tracking-widest px-2 py-0.5"
              style={{
                border: `1px solid ${theme.borderDefault}`,
                color: theme.textTertiary,
                borderRadius: '3px',
              }}
            >
              {p.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionScriptLibrary;
