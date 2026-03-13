import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { OnboardingData, StepMeta } from "@/pages/Onboarding";
import { Target, Mic2, Shield, TrendingUp, Mail, Search, PenTool, MessageSquare, Megaphone, Globe, ArrowRight } from "lucide-react";

interface Props {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  stepMeta: StepMeta;
}

const SPECIALIZATIONS = [
  { name: "Content Strategy", icon: TrendingUp },
  { name: "Paid Ads", icon: Megaphone },
  { name: "Email Marketing", icon: Mail },
  { name: "SEO", icon: Search },
  { name: "UX Writing", icon: PenTool },
  { name: "Brand Voice", icon: MessageSquare },
  { name: "Social Media", icon: Globe },
  { name: "Leadership Speeches", icon: Mic2 },
  { name: "Crisis Communications", icon: Shield },
  { name: "Technical Writing", icon: PenTool },
  { name: "Thought Leadership", icon: Target },
  { name: "Product Marketing", icon: Megaphone },
];

const StepSpecializations = ({ data, updateData, onNext, onBack, stepMeta }: Props) => {
  // Track selected specializations locally — will be saved to skills table on complete
  const [selected, setSelected] = useState<string[]>(
    data.specializations || []
  );

  const toggle = (name: string) => {
    setSelected(prev => {
      const next = prev.includes(name)
        ? prev.filter(s => s !== name)
        : [...prev, name];
      // Store on data for persistence
      updateData({ specializations: next });
      return next;
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Step {stepMeta.stepNumber} of {stepMeta.totalSteps}
        </p>
        <h2 className="text-2xl font-bold text-foreground">What do you specialize in?</h2>
        <p className="text-sm text-muted-foreground">
          Select your core areas of expertise — these will be showcased prominently on your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SPECIALIZATIONS.map(spec => {
          const Icon = spec.icon;
          const isSelected = selected.includes(spec.name);
          return (
            <button
              key={spec.name}
              onClick={() => toggle(spec.name)}
              className={`p-3 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                {spec.name}
              </p>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-xs text-center text-muted-foreground">
          {selected.length} selected — you can always edit these later
        </p>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>
          {selected.length === 0 ? "Skip" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default StepSpecializations;
