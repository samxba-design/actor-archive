import type { OnboardingData, StepMeta } from "@/pages/Onboarding";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Star } from "lucide-react";
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
    <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Step {stepMeta.stepNumber} of {stepMeta.totalSteps}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Choose your visual style</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Pick a theme that matches your brand. You can change it anytime later, and customize colors, fonts, and layouts.
        </p>
      </div>

      {/* Recommended badge */}
      {suggestedTheme && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
          <p className="text-sm">
            <Star className="w-4 h-4 inline mr-2 text-primary" />
            <strong>Recommended for {data.profileType}:</strong>{" "}
            <button
              onClick={() => updateData({ theme: suggestedTheme })}
              className="font-semibold text-primary hover:underline"
            >
              {suggestedLabel}
            </button>
          </p>
        </div>
      )}

      {/* Theme grid with browser-frame previews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolioThemeList.map((theme, idx) => {
          const isSelected = data.theme === theme.id;
          const isRecommended = theme.id === suggestedTheme;

          return (
            <button
              key={theme.id}
              onClick={() => updateData({ theme: theme.id })}
              className={`relative group text-left rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                isSelected
                  ? "border-primary shadow-lg scale-105 ring-2 ring-primary/30"
                  : isRecommended
                  ? "border-primary/40 hover:border-primary/60 shadow-md"
                  : "border-border hover:border-primary/40"
              }`}
              style={{
                animationName: "fade-in",
                animationDuration: "0.4s",
                animationTimingFunction: "ease-out",
                animationFillMode: "backwards",
                animationDelay: `${idx * 30}ms`,
              }}
            >
              {/* Browser chrome */}
              <div className="flex flex-col h-full bg-card">
                {/* Browser header */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/30">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400/70" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400/70" />
                    <div className="w-2 h-2 rounded-full bg-green-400/70" />
                  </div>
                  <div className="flex-1 h-1 bg-border/50 rounded" />
                </div>

                {/* Portfolio preview */}
                <div
                  className="flex-1 p-3 flex flex-col items-center justify-center relative min-h-[140px]"
                  style={{ backgroundColor: theme.bgPrimary }}
                >
                  {/* Fake hero section */}
                  <div
                    className="w-full h-12 rounded-lg mb-2 flex items-center justify-center gap-2 relative overflow-hidden"
                    style={{ backgroundColor: `${theme.accentPrimary}20`, border: `1px solid ${theme.accentPrimary}40` }}
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: theme.accentPrimary, opacity: 0.7 }}
                    />
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="h-1.5 rounded w-12" style={{ backgroundColor: theme.textPrimary, opacity: 0.8 }} />
                      <div className="h-1 rounded w-8" style={{ backgroundColor: theme.textSecondary, opacity: 0.5 }} />
                    </div>
                  </div>

                  {/* Fake section */}
                  <div className="w-full space-y-1.5">
                    <div className="h-1 rounded w-16" style={{ backgroundColor: theme.textPrimary }} />
                    <div className="grid grid-cols-2 gap-1.5">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-6 rounded"
                          style={{ backgroundColor: `${theme.accentPrimary}30` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Theme info overlay */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-5 h-5 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Theme name and description */}
                <div className="p-3 bg-muted/50 border-t border-border/50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm leading-tight">{theme.name}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{theme.description}</p>
                    </div>
                    {isRecommended && (
                      <Star className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    )}
                  </div>
                </div>
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
          <Button variant="ghost" onClick={onNext}>
            Skip for now
          </Button>
          <Button onClick={onNext} className="min-w-[120px]">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepTheme;
