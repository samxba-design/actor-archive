import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { Target, Mic2, Shield, TrendingUp, Mail, Search, PenTool, MessageSquare, Megaphone, Globe } from "lucide-react";

interface Props {
  items: any[];
  variant?: 'tags' | 'bars' | 'grouped' | 'specializations';
}

const proficiencyWidth: Record<string, string> = {
  beginner: '25%',
  intermediate: '50%',
  advanced: '75%',
  expert: '100%',
};

const SPECIALIZATION_ICONS: Record<string, any> = {
  "Leadership Speeches": Mic2,
  "Crisis Communications": Shield,
  "Crisis Management": Shield,
  "Content Strategy": TrendingUp,
  "Email Marketing": Mail,
  "SEO": Search,
  "UX Writing": PenTool,
  "Brand Voice": MessageSquare,
  "Paid Ads": Megaphone,
  "Social Media": Globe,
  "Technical Writing": PenTool,
  "Copywriting": PenTool,
};

const SectionSkills = ({ items, variant = 'tags' }: Props) => {
  const theme = usePortfolioTheme();

  const grouped = items.reduce<Record<string, any[]>>((acc, s) => {
    const cat = s.category || "General";
    (acc[cat] = acc[cat] || []).push(s);
    return acc;
  }, {});

  if (variant === 'specializations') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((s: any) => {
          const Icon = SPECIALIZATION_ICONS[s.name] || Target;
          return (
            <div
              key={s.id}
              className="group p-5 transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
                border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
                borderRadius: theme.cardRadius,
                boxShadow: theme.cardShadow,
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors"
                style={{ backgroundColor: `${theme.accentPrimary}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: theme.accentPrimary }} />
              </div>
              <h4
                className="text-sm font-bold"
                style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}
              >
                {s.name}
              </h4>
              {s.category && (
                <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: theme.textTertiary }}>
                  {s.category}
                </p>
              )}
              {s.proficiency && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: theme.bgElevated }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: proficiencyWidth[s.proficiency] || '60%',
                        backgroundColor: theme.accentPrimary,
                      }}
                    />
                  </div>
                  <span className="text-[9px] uppercase tracking-wider shrink-0" style={{ color: theme.textTertiary }}>
                    {s.proficiency}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

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
