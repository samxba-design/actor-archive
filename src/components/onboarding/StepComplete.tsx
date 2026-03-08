import type { OnboardingData } from "@/pages/Onboarding";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getProfileTypeConfig, PROFILE_TYPES } from "@/config/profileSections";

interface Props {
  data: OnboardingData;
  onComplete: () => void;
  onBack: () => void;
  saving: boolean;
}

const StepComplete = ({ data, onComplete, onBack, saving }: Props) => {
  const typeLabel =
    data.profileType === "multi_hyphenate"
      ? data.secondaryTypes
          .map((t) => PROFILE_TYPES.find((pt) => pt.key === t)?.label)
          .filter(Boolean)
          .join(" + ")
      : getProfileTypeConfig(data.profileType || "")?.label || "Creative";

  return (
    <div className="w-full max-w-lg space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">You're all set!</h1>
        <p className="text-muted-foreground">
          Here's a summary of your profile. You can change everything in your dashboard.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Type</span>
          <span className="text-sm font-medium text-foreground">{typeLabel}</span>
        </div>
        <div className="border-t border-border" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Name</span>
          <span className="text-sm font-medium text-foreground">{data.displayName}</span>
        </div>
        {data.tagline && (
          <>
            <div className="border-t border-border" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tagline</span>
              <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{data.tagline}</span>
            </div>
          </>
        )}
        <div className="border-t border-border" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">URL</span>
          <span className="text-sm font-mono text-foreground">creativeslate.com/{data.slug}</span>
        </div>
        <div className="border-t border-border" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Theme</span>
          <span className="text-sm font-medium text-foreground capitalize">{data.theme}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={onComplete} disabled={saving} className="min-w-[180px]">
          {saving ? "Creating profile..." : "Launch my portfolio"}
        </Button>
      </div>
    </div>
  );
};

export default StepComplete;
