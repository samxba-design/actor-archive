import { Award, Trophy, Medal, Star } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
}

const RESULT_COLORS: Record<string, { bg: string; fg: string }> = {
  Winner: { bg: 'rgba(201, 169, 110, 0.18)', fg: '#C9A96E' },
  Gold: { bg: 'rgba(201, 169, 110, 0.18)', fg: '#C9A96E' },
  Nominated: { bg: 'rgba(107, 159, 212, 0.15)', fg: '#6B9FD4' },
  Semifinalist: { bg: 'rgba(74, 158, 107, 0.15)', fg: '#4A9E6B' },
  Featured: { bg: 'rgba(184, 92, 60, 0.15)', fg: '#B85C3C' },
};

const SectionAwards = ({ items }: Props) => {
  const theme = usePortfolioTheme();

  return (
    <div className="space-y-1.5">
      {items.map((a) => {
        const isWinner = a.result === "Winner" || a.result === "Gold";
        const resultColor = RESULT_COLORS[a.result] || { bg: theme.bgElevated, fg: theme.textSecondary };
        return (
          <div
            key={a.id}
            className="flex items-center gap-3 py-2.5 px-3 transition-all rounded-sm group"
            style={{ transitionDuration: theme.hoverTransitionDuration }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: resultColor.bg }}>
              {isWinner ? (
                <Trophy className="w-4 h-4" style={{ color: resultColor.fg }} />
              ) : a.result === "Nominated" ? (
                <Star className="w-4 h-4" style={{ color: resultColor.fg }} />
              ) : a.result === "Semifinalist" ? (
                <Medal className="w-4 h-4" style={{ color: resultColor.fg }} />
              ) : (
                <Award className="w-4 h-4" style={{ color: resultColor.fg }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="font-medium text-[13px] truncate" style={{ color: theme.textPrimary }}>{a.name}</p>
                {a.result && (
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: resultColor.bg,
                      color: resultColor.fg,
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
