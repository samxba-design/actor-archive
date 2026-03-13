import type { OnboardingData, StepMeta } from "@/pages/Onboarding";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { getProfileTypeConfig } from "@/config/profileSections";
import { portfolioThemes, portfolioThemeList, resolveThemeId } from "@/themes/themes";
import type { PortfolioTheme } from "@/themes/theme-types";

interface Props {
  data: OnboardingData;
  updateData: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  stepMeta: StepMeta;
}

const StepTheme = ({ data, updateData, onNext, onBack, stepMeta }: Props) => {
  const typeConfig = data.profileType ? getProfileTypeConfig(data.profileType) : null;
  const suggestedThemeRaw = typeConfig?.defaultTheme || "cinematic-dark";
  const suggestedTheme = resolveThemeId(suggestedThemeRaw);
  const suggestedLabel = portfolioThemes[suggestedTheme]?.name || suggestedTheme;

  return (
    <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Step {stepMeta.stepNumber} of {stepMeta.totalSteps}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Choose your look</h1>
        <p className="text-muted-foreground">
          You can customise colours, fonts, and layout later.
          {suggestedTheme && (
            <span className="block mt-1">
              We recommend <button onClick={() => updateData({ theme: suggestedTheme })} className="font-medium text-foreground underline underline-offset-2">{suggestedLabel}</button> for your profile type.
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {portfolioThemeList.map((theme, idx) => {
          const isSelected = data.theme === theme.id;
          const colors = theme.previewColors || [theme.bgPrimary, theme.textPrimary, theme.accentPrimary, theme.bgSecondary, theme.textSecondary];

          return (
            <button
              key={theme.id}
              onClick={() => updateData({ theme: theme.id })}
              className={`relative group text-left rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                isSelected ? "border-primary shadow-md scale-[1.02]" : "border-border hover:border-primary/40"
              }`}
              style={{
                animationName: "fade-in",
                animationDuration: "0.4s",
                animationTimingFunction: "ease-out",
                animationFillMode: "backwards",
                animationDelay: `${idx * 50}ms`,
              }}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              {/* Color preview */}
              <div className="p-4 h-[80px] flex flex-col justify-between" style={{ backgroundColor: colors[0] || '#0D0D0D' }}>
                <div className="flex items-center gap-1.5">
                  {colors.map((c, i) => (
                    <div key={i} className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div>
                  <div className="h-1.5 w-16 rounded-full" style={{ backgroundColor: colors[1] || '#fff', opacity: 0.8 }} />
                  <div className="h-1 w-10 rounded-full mt-1" style={{ backgroundColor: colors[4] || colors[1] || '#aaa', opacity: 0.4 }} />
                </div>
              </div>
              <div className="p-3 bg-card">
                <h3 className="font-semibold text-foreground text-xs">{theme.name}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{theme.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onNext}>Skip for now</Button>
          <Button onClick={onNext} className="min-w-[120px]">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepTheme;
