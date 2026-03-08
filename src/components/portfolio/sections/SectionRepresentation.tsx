import { Building2, Mail, Phone } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
  variant?: 'cards' | 'compact' | 'inline';
}

const repTypeLabels: Record<string, string> = {
  agent: "Agent",
  manager: "Manager",
  lawyer: "Entertainment Lawyer",
  publicist: "Publicist",
  other: "Representative",
};

const SectionRepresentation = ({ items, variant = 'cards' }: Props) => {
  const theme = usePortfolioTheme();

  if (variant === 'compact') {
    return (
      <div className="space-y-2">
        {items.map((rep) => (
          <div
            key={rep.id}
            className="flex items-center gap-3 px-3 py-2.5 transition-all"
            style={{
              backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
              border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
              borderRadius: theme.cardRadius,
            }}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: theme.accentSubtle }}>
              <Building2 className="w-3.5 h-3.5" style={{ color: theme.accentPrimary }} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>{rep.company || rep.name}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider ml-2" style={{ color: theme.accentPrimary }}>
                {repTypeLabels[rep.rep_type] || rep.rep_type}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {rep.email && (
                <a href={`mailto:${rep.email}`} style={{ color: theme.accentPrimary }}>
                  <Mail className="w-3.5 h-3.5" />
                </a>
              )}
              {rep.phone && (
                <a href={`tel:${rep.phone}`} style={{ color: theme.textTertiary }}>
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-4">
        {items.map((rep) => (
          <div key={rep.id} className="flex items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.accentSubtle, color: theme.accentPrimary }}>
              {repTypeLabels[rep.rep_type] || rep.rep_type}
            </span>
            <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>{rep.company || rep.name}</span>
            {rep.name && rep.company && (
              <span className="text-xs" style={{ color: theme.textTertiary }}>({rep.name})</span>
            )}
            {rep.email && (
              <a href={`mailto:${rep.email}`} className="text-xs" style={{ color: theme.accentPrimary }}>{rep.email}</a>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Default: cards
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((rep) => (
        <div
          key={rep.id}
          className="p-4 space-y-2 transition-all"
          style={{
            backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
            backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
            border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
            borderRadius: theme.cardRadius,
            transitionDuration: theme.hoverTransitionDuration,
          }}
        >
          <div className="flex items-center gap-3">
            {rep.logo_url ? (
              <img src={rep.logo_url} alt="" className="w-9 h-9 object-contain rounded" />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: theme.accentSubtle }}>
                <Building2 className="w-4 h-4" style={{ color: theme.accentPrimary }} />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-sm" style={{ color: theme.textPrimary }}>{rep.company || rep.name}</p>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.accentPrimary }}>
                {repTypeLabels[rep.rep_type] || rep.rep_type}
                {rep.department ? ` · ${rep.department}` : ""}
              </span>
            </div>
          </div>
          {rep.name && rep.company && (
            <p className="text-sm" style={{ color: theme.textPrimary }}>{rep.name}</p>
          )}
          <div className="flex flex-wrap gap-3 text-xs">
            {rep.email && (
              <a href={`mailto:${rep.email}`} className="flex items-center gap-1.5 transition-colors" style={{ color: theme.accentPrimary }}>
                <Mail className="w-3.5 h-3.5" /> {rep.email}
              </a>
            )}
            {rep.phone && (
              <a href={`tel:${rep.phone}`} className="flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                <Phone className="w-3.5 h-3.5" /> {rep.phone}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionRepresentation;
