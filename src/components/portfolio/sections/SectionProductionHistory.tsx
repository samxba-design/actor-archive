import { Theater } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
  variant?: 'list' | 'cards' | 'timeline';
}

const SectionProductionHistory = ({ items, variant = 'list' }: Props) => {
  const theme = usePortfolioTheme();

  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((prod) => (
          <div
            key={prod.id}
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
                <Theater className="w-4 h-4" style={{ color: theme.accentPrimary }} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{prod.theatre_name || "Production"}</p>
                {prod.year && <span className="text-[10px] tabular-nums" style={{ color: theme.textTertiary }}>{prod.year}</span>}
              </div>
            </div>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              {[prod.director ? `Dir. ${prod.director}` : null, prod.city, prod.country].filter(Boolean).join(" · ")}
            </p>
            {prod.run_dates && <p className="text-xs" style={{ color: theme.textTertiary }}>{prod.run_dates}</p>}
            {prod.cast_names?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {prod.cast_names.map((name: string, i: number) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.bgElevated, color: theme.textSecondary }}>{name}</span>
                ))}
              </div>
            )}
            {prod.production_photos?.length > 0 && (
              <div className="flex gap-1 overflow-hidden">
                {prod.production_photos.slice(0, 3).map((url: string, i: number) => (
                  <img key={i} src={url} alt="" className="w-16 h-12 object-cover rounded" />
                ))}
              </div>
            )}
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
          {items.map((prod) => (
            <div key={prod.id} className="relative pl-10">
              <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full" style={{ backgroundColor: theme.accentPrimary, boxShadow: `0 0 6px ${theme.accentGlow}` }} />
              {prod.year && <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.accentPrimary }}>{prod.year}</span>}
              <p className="font-semibold text-sm mt-0.5" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{prod.theatre_name || "Production"}</p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                {[prod.director ? `Dir. ${prod.director}` : null, prod.city, prod.country].filter(Boolean).join(" · ")}
              </p>
              {prod.run_dates && <p className="text-xs" style={{ color: theme.textTertiary }}>{prod.run_dates}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: list
  return (
    <div className="space-y-4">
      {items.map((prod) => (
        <div
          key={prod.id}
          className="flex items-start gap-4 p-4"
          style={{
            backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
            border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
            borderRadius: theme.cardRadius,
          }}
        >
          <Theater className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: theme.accentPrimary }} />
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: theme.textPrimary }}>{prod.theatre_name || "Production"}</p>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              {[prod.director ? `Dir. ${prod.director}` : null, prod.city, prod.country, prod.year].filter(Boolean).join(" · ")}
            </p>
            {prod.run_dates && <p className="text-xs mt-1" style={{ color: theme.textTertiary }}>{prod.run_dates}</p>}
            {prod.cast_names?.length > 0 && (
              <p className="text-xs mt-1" style={{ color: theme.textTertiary }}>Cast: {prod.cast_names.join(", ")}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionProductionHistory;
