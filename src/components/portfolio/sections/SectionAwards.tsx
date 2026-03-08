import { Award, Trophy } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
}

const SectionAwards = ({ items }: Props) => {
  const theme = usePortfolioTheme();

  return (
    <div className="space-y-1.5">
      {items.map((a) => {
        const isWinner = a.result === "Winner" || a.result === "Gold";
        return (
          <div
            key={a.id}
            className="flex items-center gap-3 py-2.5 px-3 transition-all rounded-sm"
            style={{ transitionDuration: theme.hoverTransitionDuration }}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: theme.accentSubtle }}>
              {isWinner ? (
                <Trophy className="w-3.5 h-3.5" style={{ color: theme.accentPrimary }} />
              ) : (
                <Award className="w-3.5 h-3.5" style={{ color: theme.textTertiary }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="font-medium text-[13px] truncate" style={{ color: theme.textPrimary }}>{a.name}</p>
                {a.result && (
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: isWinner ? theme.accentPrimary : theme.bgElevated,
                      color: isWinner ? theme.textOnAccent : theme.textSecondary,
                      border: 'none',
                    }}
                  >
                    {a.result}
                  </span>
                )}
              </div>
              <p className="text-[11px]" style={{ color: theme.textTertiary }}>
                {[a.category, a.organization, a.year].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SectionAwards;
