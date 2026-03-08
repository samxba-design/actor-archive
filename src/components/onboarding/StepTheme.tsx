import type { OnboardingData } from "@/pages/Onboarding";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { getProfileTypeConfig } from "@/config/profileSections";

interface Props {
  data: OnboardingData;
  updateData: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const THEMES = [
  { key: "screenplay", label: "Screenplay", desc: "Clean, script-inspired. Off-white with red accents.", colors: ["#FAF8F5", "#1A1A1A", "#C41E3A"] },
  { key: "noir", label: "Noir", desc: "Dark & cinematic. Deep black with gold.", colors: ["#0A0A0A", "#F5F0E8", "#D4AF37"] },
  { key: "editorial", label: "Editorial", desc: "Magazine-style grid. White, charcoal, thin rules.", colors: ["#FFFFFF", "#333333", "#666666"] },
  { key: "brutalist", label: "Brutalist", desc: "Stark, bold, asymmetric. Extreme typography.", colors: ["#FFFFFF", "#000000", "#00FF41"] },
  { key: "minimal", label: "Minimal", desc: "Pure Swiss design. White, black, single accent.", colors: ["#FFFFFF", "#000000", "#3B82F6"] },
  { key: "indie", label: "Indie", desc: "Warm & organic. Cream, brown, terracotta.", colors: ["#FDF6EC", "#2C1810", "#C05746"] },
  { key: "corporate", label: "Corporate", desc: "Professional & polished. Navy, white, teal.", colors: ["#0F1B2D", "#FFFFFF", "#0D9488"] },
  { key: "cinematic", label: "Cinematic", desc: "Full-bleed visuals. Dark with bold imagery.", colors: ["#0D0D0D", "#FFFFFF", "#E11D48"] },
  { key: "retro", label: "Retro", desc: "Vintage & nostalgic. Parchment, sepia tones.", colors: ["#F4ECD8", "#3C2415", "#8B6914"] },
  { key: "neon", label: "Neon", desc: "Electric & bold. Dark with glowing accents.", colors: ["#0D0D0D", "#FFFFFF", "#06B6D4"] },
];

const StepTheme = ({ data, updateData, onNext, onBack }: Props) => {
  // Suggest default theme based on profile type
  const typeConfig = data.profileType ? getProfileTypeConfig(data.profileType) : null;
  const suggestedTheme = typeConfig?.defaultTheme || "minimal";

  return (
    <div className="w-full max-w-3xl space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Theme</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Choose your look</h1>
        <p className="text-muted-foreground">
          You can customise colours, fonts, and layout later. 
          {suggestedTheme && (
            <span className="block mt-1">
              We recommend <button onClick={() => updateData({ theme: suggestedTheme })} className="font-medium text-foreground underline underline-offset-2">{THEMES.find(t => t.key === suggestedTheme)?.label}</button> for your profile type.
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {THEMES.map((theme) => (
          <button
            key={theme.key}
            onClick={() => updateData({ theme: theme.key })}
            className={`relative group text-left p-3 rounded-lg border-2 transition-all duration-200 ${
              data.theme === theme.key
                ? "border-primary shadow-sm"
                : "border-border hover:border-primary/40"
            }`}
          >
            {data.theme === theme.key && (
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-primary-foreground" />
              </div>
            )}
            {/* Color preview */}
            <div className="flex gap-1 mb-2">
              {theme.colors.map((c, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-sm border border-border/50"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <h3 className="font-semibold text-foreground text-xs">{theme.label}</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{theme.desc}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={onNext} className="min-w-[120px]">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StepTheme;
