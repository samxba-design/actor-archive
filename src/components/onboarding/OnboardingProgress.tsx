import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

const OnboardingProgress = ({ currentStep, totalSteps, stepLabels }: Props) => {
  const labels = stepLabels || Array.from({ length: totalSteps }, (_, i) => `Step ${i + 1}`);
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      {/* Main progress bar */}
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 transition-all duration-700 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
        {/* Animated shimmer */}
        <div
          className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"
          style={{ left: `${Math.min(progress - 10, 90)}%` }}
        />
      </div>

      {/* Step indicators - show on larger screens */}
      <div className="hidden sm:flex justify-between mt-3 px-1">
        {labels.slice(0, Math.min(totalSteps, 8)).map((label, i) => {
          const stepNum = i + 1;
          const isComplete = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={i}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300",
                isComplete ? "opacity-100" : isCurrent ? "opacity-100" : "opacity-40"
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all duration-300 border",
                  isComplete
                    ? "bg-primary border-primary text-primary-foreground scale-90"
                    : isCurrent
                    ? "bg-primary/10 border-primary text-primary scale-110"
                    : "bg-muted border-border text-muted-foreground"
                )}
              >
                {isComplete ? <Check className="w-3 h-3" /> : stepNum}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium max-w-[60px] text-center leading-tight truncate",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile: Simple fraction */}
      <div className="sm:hidden flex justify-center mt-2">
        <span className="text-xs font-medium text-muted-foreground">
          {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );
};

export default OnboardingProgress;