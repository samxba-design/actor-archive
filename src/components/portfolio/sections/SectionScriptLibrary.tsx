import { useState } from "react";
import { FileText, Lock, ArrowRight } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
}

const FILTERS = ["All", "Feature", "Series", "Pilot", "Other"];

const SectionScriptLibrary = ({ items }: Props) => {
  const theme = usePortfolioTheme();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? items : items.filter(p => {
    const format = (p.format || p.project_type || "").toLowerCase();
    const filter = activeFilter.toLowerCase();
    return format.includes(filter);
  });

  // Separate featured
  const featured = filtered.find(p => p.is_featured || p.is_notable);
  const rest = filtered.filter(p => p !== featured);

  return (
    <div className="space-y-6">
      {/* Filter pills */}
      {items.length > 2 && (
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full transition-all duration-200"
              style={{
                backgroundColor: f === activeFilter ? theme.accentPrimary : 'transparent',
                color: f === activeFilter ? theme.textOnAccent : theme.textSecondary,
                border: `1px solid ${f === activeFilter ? theme.accentPrimary : theme.borderDefault}`,
                fontWeight: f === activeFilter ? 600 : 400,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Featured card — full width */}
      {featured && (
        <ScriptCard item={featured} theme={theme} isFeatured />
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rest.map(p => (
          <ScriptCard key={p.id} item={p} theme={theme} />
        ))}
      </div>
    </div>
  );
};

const ScriptCard = ({ item: p, theme, isFeatured }: { item: any; theme: any; isFeatured?: boolean }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`transition-all ${isFeatured ? 'sm:col-span-2 lg:col-span-3' : ''}`}
      style={{
        backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
        backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
        WebkitBackdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
        border: `${theme.cardBorderWidth} solid ${hovered ? theme.borderHover : theme.borderDefault}`,
        borderRadius: theme.cardRadius,
        borderLeft: isFeatured ? `3px solid ${theme.accentPrimary}` : undefined,
        padding: isFeatured ? '32px' : '24px',
        boxShadow: hovered ? theme.cardHoverShadow : theme.cardShadow,
        transform: hovered ? theme.cardHoverTransform : 'none',
        transitionDuration: theme.hoverTransitionDuration,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="space-y-2.5">
        {/* Icon + Title */}
        <div className="flex items-start gap-2.5">
          <FileText className="w-4 h-4 mt-0.5 shrink-0" style={{ color: theme.textTertiary }} />
          <h4
            className="leading-tight transition-colors duration-200"
            style={{
              fontFamily: theme.fontDisplay,
              fontWeight: theme.headingWeight,
              fontSize: isFeatured ? '22px' : '16px',
              color: hovered ? theme.accentPrimary : theme.textPrimary,
            }}
          >
            {p.title}
          </h4>
        </div>

        {/* Format line */}
        <p
          className="uppercase tracking-widest"
          style={{ fontSize: '12px', color: theme.textSecondary, letterSpacing: '0.06em' }}
        >
          {[p.format || p.project_type, p.genre?.join(", "), p.page_count ? `${p.page_count} pages` : null, p.year].filter(Boolean).join(" · ")}
        </p>

        {/* Logline */}
        {p.logline && (
          <p
            className="leading-relaxed line-clamp-2"
            style={{
              fontSize: isFeatured ? '16px' : '14px',
              fontFamily: isFeatured ? theme.fontLogline : theme.fontBody,
              fontStyle: isFeatured ? theme.loglineStyle : 'normal',
              color: theme.textPrimary,
              lineHeight: '1.6',
            }}
          >
            {isFeatured ? `\u201C${p.logline}\u201D` : p.logline}
          </p>
        )}

        {/* Coverage (featured only) */}
        {isFeatured && p.coverage_excerpt && (
          <p className="text-sm italic" style={{ color: theme.textSecondary }}>
            {p.coverage_excerpt}
          </p>
        )}

        {/* Bottom row: CTA + status */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {p.access_level === "public" && p.script_pdf_url ? (
            <a
              href={p.script_pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] uppercase tracking-widest font-medium transition-colors group"
              style={{ color: theme.accentPrimary, letterSpacing: '0.06em' }}
            >
              Read Script
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </a>
          ) : p.script_pdf_url ? (
            <span
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest px-3 py-1"
              style={{ border: `1px solid ${theme.borderDefault}`, color: theme.textSecondary, borderRadius: '4px' }}
            >
              <Lock className="w-3 h-3" /> Request Access
            </span>
          ) : null}

          {p.status && (
            <span
              className="text-[11px] uppercase tracking-widest px-2.5 py-1"
              style={{
                border: `1px solid ${theme.borderDefault}`,
                color: theme.textSecondary,
                borderRadius: '4px',
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
