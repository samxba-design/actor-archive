import { PROFILE_TYPES } from "@/config/profileSections";
import type { OnboardingData, StepMeta } from "@/pages/Onboarding";
import type { Database } from "@/integrations/supabase/types";
type ProfileType = Database["public"]["Enums"]["profile_type"];
import {
  PenTool, Tv, Theater, BookOpen, Newspaper, Type,
  Clapperboard, Film, Video, Layers, Check
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const ICON_MAP: Record<string, React.ElementType> = {
  PenTool, Tv, Theater, BookOpen, Newspaper, Type,
  Clapperboard, Film, Video, Layers,
};

interface Props {
  data: OnboardingData;
  updateData: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
  stepMeta: StepMeta;
}

const StepProfileType = ({ data, updateData, onNext, stepMeta }: Props) => {
  const [selected, setSelected] = useState<string[]>(
    data.profileType
      ? [data.profileType, ...data.secondaryTypes]
      : []
  );

  const toggleType = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleContinue = () => {
    if (selected.length === 0) return;

    if (selected.length === 1) {
      updateData({
        profileType: selected[0] as ProfileType,
        secondaryTypes: [],
      });
    } else {
      updateData({
        profileType: "multi_hyphenate" as ProfileType,
        secondaryTypes: selected,
      });
    }
    onNext();
  };

  return (
    <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Step {stepMeta.stepNumber} of {stepMeta.totalSteps}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          You are a...
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Select your creative discipline. Pick more than one to build a multi-hyphenate profile
          — you can always customise and add sections later.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROFILE_TYPES.filter((pt) => pt.key !== "multi_hyphenate").map((pt, idx) => {
          const Icon = ICON_MAP[pt.icon] || PenTool;
          const isSelected = selected.includes(pt.key);

          return (
            <button
              key={pt.key}
              onClick={() => toggleType(pt.key)}
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
                animationDelay: `${idx * 50}ms`,
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
                  <h3 className="font-semibold text-foreground text-sm">{pt.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {pt.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selected.length > 1 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{selected.length} types selected</span>
            {" "}— you'll get a multi-hyphenate profile with sections from all selected disciplines.
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={selected.length === 0}
          className="min-w-[200px]"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StepProfileType;
