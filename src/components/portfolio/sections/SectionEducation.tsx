import { GraduationCap, Calendar } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
  variant?: 'list' | 'cards' | 'timeline';
}

const SectionEducation = ({ items, variant = 'list' }: Props) => {
  const theme = usePortfolioTheme();

  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((e) => (
          <div
            key={e.id}
            className="p-4 space-y-2 transition-all"
            style={{
              backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
              backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
              border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
              borderRadius: theme.cardRadius,
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: theme.accentSubtle }}>
                <GraduationCap className="w-4 h-4" style={{ color: theme.accentPrimary }} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{e.institution}</p>
                {e.education_type && (
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: theme.accentPrimary }}>
                    {e.education_type}
                  </span>
                )}
              </div>
            </div>
            {e.degree_or_certificate && (
              <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>{e.degree_or_certificate}</p>
            )}
            {e.field_of_study && (
              <p className="text-xs" style={{ color: theme.textTertiary }}>{e.field_of_study}</p>
            )}
            {e.teacher_name && (
              <p className="text-xs italic" style={{ color: theme.textTertiary }}>with {e.teacher_name}</p>
            )}
            {e.description && (
              <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>{e.description}</p>
            )}
            <p className="text-[10px] font-medium tabular-nums" style={{ color: theme.textTertiary }}>
              {e.year_start}{e.year_end ? `–${e.year_end}` : e.is_ongoing ? "–Present" : ""}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'timeline') {
    return (
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px" style={{ backgroundColor: theme.borderDefault }} />
        <div className="space-y-4">
          {items.map((e) => (
            <div key={e.id} className="relative pl-10">
              <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full" style={{ backgroundColor: theme.accentPrimary, boxShadow: `0 0 6px ${theme.accentGlow}` }} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.accentPrimary }}>
                {e.year_start}{e.year_end ? `–${e.year_end}` : e.is_ongoing ? "–Present" : ""}
              </span>
              <p className="font-semibold text-sm mt-0.5" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{e.institution}</p>
              {e.degree_or_certificate && (
                <p className="text-xs" style={{ color: theme.textSecondary }}>{e.degree_or_certificate}</p>
              )}
              {e.teacher_name && (
                <p className="text-xs italic" style={{ color: theme.textTertiary }}>with {e.teacher_name}</p>
              )}
              {e.description && (
                <p className="text-xs mt-1 leading-relaxed" style={{ color: theme.textTertiary }}>{e.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: list
  return (
    <div className="space-y-3">
      {items.map((e) => (
        <div
          key={e.id}
          className="flex items-start gap-3 p-4"
          style={{
            backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
            backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
            border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
            borderRadius: theme.cardRadius,
          }}
        >
          <GraduationCap className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: theme.accentPrimary }} />
          <div>
            <p className="font-semibold text-sm" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{e.institution}</p>
            {e.degree_or_certificate && (
              <p className="text-xs" style={{ color: theme.textSecondary }}>{e.degree_or_certificate}</p>
            )}
            {e.teacher_name && (
              <p className="text-xs" style={{ color: theme.textTertiary }}>with {e.teacher_name}</p>
            )}
            <p className="text-xs" style={{ color: theme.textTertiary }}>
              {e.year_start}{e.year_end ? `–${e.year_end}` : e.is_ongoing ? "–Present" : ""}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionEducation;
