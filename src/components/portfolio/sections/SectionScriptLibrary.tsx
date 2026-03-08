import { useState } from "react";
import { FileText, Lock, ArrowRight, Shield, Mail, Eye } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
}

const FILTERS = ["All", "Feature", "Series", "Pilot"];

const ACCESS_CONFIG: Record<string, { icon: any; label: string; color: string }> = {
  public: { icon: Eye, label: 'Read Script', color: '' },
  gated: { icon: Mail, label: 'Request Access', color: '' },
  password_protected: { icon: Lock, label: 'Password Required', color: '' },
  private: { icon: Shield, label: 'By Request', color: '' },
  nda_required: { icon: Shield, label: 'NDA Required', color: '' },
};

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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {featured && <ScriptCard item={featured} theme={theme} isFeatured />}
        {rest.map(p => <ScriptCard key={p.id} item={p} theme={theme} />)}
      </div>
    </div>
  );
};

const ScriptCard = ({ item: p, theme, isFeatured }: { item: any; theme: any; isFeatured?: boolean }) => {
  const [hovered, setHovered] = useState(false);
  const accessLevel = p.access_level || 'public';
  const accessInfo = ACCESS_CONFIG[accessLevel] || ACCESS_CONFIG.public;
  const AccessIcon = accessInfo.icon;

  // Color-code access levels
  const accessColor = accessLevel === 'public' ? '#4A9E6B' 
    : accessLevel === 'gated' ? '#6B9FD4'
    : accessLevel === 'password_protected' ? '#C9A96E'
    : '#C41E1E';

  return (
    <div
      className={`transition-all ${isFeatured ? 'sm:col-span-2' : ''}`}
      style={{
        backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
        backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
        WebkitBackdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
        border: `${theme.cardBorderWidth} solid ${hovered ? theme.borderHover : theme.borderDefault}`,
        borderRadius: theme.cardRadius,
        borderLeftWidth: isFeatured ? '3px' : undefined,
        borderLeftColor: isFeatured ? theme.accentPrimary : undefined,
        borderLeftStyle: isFeatured ? 'solid' : undefined,
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
          <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${accessColor}18` }}>
            <FileText className="w-3.5 h-3.5" style={{ color: accessColor }} />
          </div>
          <h4
            className="leading-tight transition-colors duration-200 flex-1"
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

        {/* Bottom row — color-coded access */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {p.script_pdf_url ? (
            <a
              href={accessLevel === 'public' ? p.script_pdf_url : undefined}
              onClick={accessLevel !== 'public' ? (e: React.MouseEvent) => e.preventDefault() : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-medium transition-colors group"
              style={{ color: accessColor }}
            >
              <AccessIcon className="w-3 h-3" />
              {accessInfo.label}
              {accessLevel === 'public' && <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />}
            </a>
          ) : null}

          {p.status && (
            <span
              className="text-[9px] uppercase tracking-widest px-2 py-0.5"
              style={{
                backgroundColor: theme.bgElevated,
                color: theme.textSecondary,
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
