import { Award, Trophy } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
}

const SectionAwards = ({ items }: Props) => {
  const theme = usePortfolioTheme();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((a) => {
        const isWinner = a.result === "Winner" || a.result === "Gold";
        return (
          <div
            key={a.id}
            className="flex items-start gap-3 p-4 transition-all"
            style={{
              backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
              backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
              border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
              borderRadius: theme.cardRadius,
              transitionDuration: theme.hoverTransitionDuration,
            }}
          >
            {a.laurel_image_url ? (
              <img src={a.laurel_image_url} alt="" className="w-12 h-12 object-contain shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: theme.accentSubtle }}>
                {isWinner ? (
                  <Trophy className="w-4 h-4" style={{ color: theme.accentPrimary }} />
                ) : (
                  <Award className="w-4 h-4" style={{ color: theme.accentPrimary }} />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm" style={{ color: theme.textPrimary }}>{a.name}</p>
                {a.result && (
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: isWinner ? theme.accentPrimary : theme.accentSubtle,
                      color: isWinner ? theme.textOnAccent : theme.accentPrimary,
                    }}
                  >
                    {a.result}
                  </span>
                )}
              </div>
              {a.category && <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>{a.category}</p>}
              <p className="text-xs mt-0.5" style={{ color: theme.textTertiary }}>
                {[a.organization, a.year].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SectionAwards;
