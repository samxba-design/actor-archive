import type { OnboardingData, StepMeta } from "@/pages/Onboarding";
import { Search, Briefcase, Megaphone, Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const GOALS = [
  {
    key: "seeking_representation",
    label: "Finding Representation",
    description: "I'm looking for an agent or manager to represent me",
    icon: Search,
  },
  {
    key: "getting_hired",
    label: "Getting Hired",
    description: "I want to attract work and job opportunities",
    icon: Briefcase,
  },
  {
    key: "pitching_projects",
    label: "Pitching Projects",
    description: "I want to sell, option, or pitch my material",
    icon: Megaphone,
  },
  {
    key: "professional_presence",
    label: "Professional Presence",
    description: "I want a polished portfolio to share with the industry",
    icon: Globe,
  },
] as const;

interface Props {
  data: OnboardingData;
  updateData: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  stepMeta: StepMeta;
}

const StepGoal = ({ data, updateData, onNext, onBack, stepMeta }: Props) => {
  const handleSelect = (key: string) => {
    updateData({ primaryGoal: key });
  };

  return (
    <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Step {stepMeta.stepNumber} of {stepMeta.totalSteps}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          What's your main goal?
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          This helps us tailor your profile to make the right impression. You can change this anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GOALS.map((goal, idx) => {
          const Icon = goal.icon;
          const isSelected = data.primaryGoal === goal.key;

          return (
            <button
              key={goal.key}
              onClick={() => handleSelect(goal.key)}
              className={`relative group text-left p-5 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40 bg-card"
              }`}
              style={{
                animationName: "fade-in",
                animationDuration: "0.4s",
                animationTimingFunction: "ease-out",
                animationFillMode: "backwards",
                animationDelay: `${idx * 60}ms`,
              }}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 p-2 rounded-md transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">{goal.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {goal.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-3">
        <Button variant="ghost" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={!data.primaryGoal}
          className="min-w-[200px]"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StepGoal;
