import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { Settings2 } from "lucide-react";

interface Option {
  key: string;
  label: string;
}

interface Props {
  sectionName: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

const SectionOptionsBar = ({ sectionName, options, value, onChange }: Props) => {
  const theme = usePortfolioTheme();

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 mb-2 rounded-lg"
      style={{
        backgroundColor: `${theme.accentPrimary}0a`,
        border: `1px dashed ${theme.accentPrimary}30`,
      }}
    >
      <Settings2 className="w-3 h-3 shrink-0" style={{ color: theme.accentPrimary }} />
      <span className="text-[10px] uppercase tracking-widest shrink-0" style={{ color: theme.textTertiary }}>
        {sectionName}
      </span>
      <div className="flex items-center gap-1 ml-1">
        {options.map(opt => (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className="text-[10px] px-2 py-0.5 rounded-full transition-all duration-200"
            style={{
              backgroundColor: value === opt.key ? theme.accentPrimary : 'transparent',
              color: value === opt.key ? theme.textOnAccent : theme.textSecondary,
              border: `1px solid ${value === opt.key ? theme.accentPrimary : theme.borderDefault}`,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <span className="text-[9px] ml-auto hidden sm:block" style={{ color: theme.textTertiary }}>
        Customize in profile settings
      </span>
    </div>
  );
};

export default SectionOptionsBar;
