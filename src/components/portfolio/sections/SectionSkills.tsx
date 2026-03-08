import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
  variant?: 'tags' | 'bars' | 'grouped';
}

const proficiencyWidth: Record<string, string> = {
  beginner: '25%',
  intermediate: '50%',
  advanced: '75%',
  expert: '100%',
};

const SectionSkills = ({ items, variant = 'tags' }: Props) => {
  const theme = usePortfolioTheme();

  const grouped = items.reduce<Record<string, any[]>>((acc, s) => {
    const cat = s.category || "General";
    (acc[cat] = acc[cat] || []).push(s);
    return acc;
  }, {});

  if (variant === 'bars') {
    return (
      <div className="space-y-4">
        {Object.entries(grouped).map(([cat, skills]) => (
          <div key={cat}>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.textTertiary }}>{cat}</h4>
            <div className="space-y-2">
              {skills.map((s: any) => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="text-xs font-medium w-24 shrink-0 truncate" style={{ color: theme.textPrimary }}>{s.name}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.bgElevated }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: proficiencyWidth[s.proficiency] || '60%',
                        backgroundColor: theme.accentPrimary,
                      }}
                    />
                  </div>
                  {s.proficiency && (
                    <span className="text-[9px] uppercase tracking-wider shrink-0" style={{ color: theme.textTertiary }}>{s.proficiency}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'grouped') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(grouped).map(([cat, skills]) => (
          <div
            key={cat}
            className="p-4 space-y-2"
            style={{
              backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
              border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
              borderRadius: theme.cardRadius,
            }}
          >
            <h4 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.accentPrimary }}>{cat}</h4>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s: any) => (
                <span
                  key={s.id}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: theme.accentSubtle,
                    color: theme.textSecondary,
                  }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: tags
  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([cat, skills]) => (
        <div key={cat}>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.textTertiary }}>{cat}</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((s: any) => (
              <span
                key={s.id}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: `${theme.accentPrimary}1a`,
                  color: theme.accentPrimary,
                }}
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionSkills;
