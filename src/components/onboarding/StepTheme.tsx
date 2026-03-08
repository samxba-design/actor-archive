import type { OnboardingData, StepMeta } from "@/pages/Onboarding";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { getProfileTypeConfig } from "@/config/profileSections";
import { themes } from "@/lib/themes";

interface Props {
  data: OnboardingData;
  updateData: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  stepMeta: StepMeta;
}

const THEME_KEYS = ["minimal", "noir", "editorial", "brutalist", "spotlight", "ink", "modernist", "warm", "midnight", "gallery"] as const;

const StepTheme = ({ data, updateData, onNext, onBack, stepMeta }: Props) => {
  const typeConfig = data.profileType ? getProfileTypeConfig(data.profileType) : null;
  const suggestedTheme = typeConfig?.defaultTheme || "minimal";

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
              We recommend <button onClick={() => updateData({ theme: suggestedTheme })} className="font-medium text-foreground underline underline-offset-2">{themes[suggestedTheme]?.label}</button> for your profile type.
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {THEME_KEYS.map((key, idx) => {
          const t = themes[key];
          if (!t) return null;
          const v = t.variables;
          const isSelected = data.theme === key;

          return (
            <button
              key={key}
              onClick={() => updateData({ theme: key })}
              className={`relative group text-left rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                isSelected ? "border-primary shadow-md scale-[1.02]" : "border-border hover:border-primary/40"
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div className="p-3 h-[100px]" style={{ backgroundColor: `hsl(${v["--portfolio-bg"]})` }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: `hsl(${v["--portfolio-accent"]})` }} />
                  <div>
                    <div className="h-1.5 w-12 rounded-full" style={{ backgroundColor: `hsl(${v["--portfolio-fg"]})`, fontFamily: v["--portfolio-heading-font"] }} />
                    <div className="h-1 w-8 rounded-full mt-1" style={{ backgroundColor: `hsl(${v["--portfolio-muted-fg"]})` }} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="rounded" style={{
                      backgroundColor: `hsl(${v["--portfolio-card"]})`,
                      border: `1px solid hsl(${v["--portfolio-border"]})`,
                      height: 28,
                    }}>
                      <div className="h-3 m-1 rounded" style={{ backgroundColor: `hsl(${v["--portfolio-muted"]})` }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-2 bg-card">
                <h3 className="font-semibold text-foreground text-xs">{t.label}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{t.description}</p>
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
