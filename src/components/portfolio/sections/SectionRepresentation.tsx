import { Building2, Mail, Phone } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
}

const repTypeLabels: Record<string, string> = {
  agent: "Agent",
  manager: "Manager",
  lawyer: "Entertainment Lawyer",
  publicist: "Publicist",
  other: "Representative",
};

const SectionRepresentation = ({ items }: Props) => {
  const theme = usePortfolioTheme();

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
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: theme.accentPrimary }}
              >
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
