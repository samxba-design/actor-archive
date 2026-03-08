import type { OnboardingData } from "@/pages/Onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

interface Props {
  data: OnboardingData;
  updateData: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepBasicInfo = ({ data, updateData, onNext, onBack }: Props) => {
  const canContinue = data.displayName.trim().length > 0;

  return (
    <div className="w-full max-w-lg space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Step 2</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tell us about yourself</h1>
        <p className="text-muted-foreground">This is how you'll appear on your public portfolio.</p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => updateData({ firstName: e.target.value })}
              placeholder="Sam"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => updateData({ lastName: e.target.value })}
              placeholder="Smith"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName">Display name <span className="text-destructive">*</span></Label>
          <Input
            id="displayName"
            value={data.displayName}
            onChange={(e) => updateData({ displayName: e.target.value })}
            placeholder="Sam Smith"
          />
          <p className="text-xs text-muted-foreground">The name shown on your portfolio page.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={data.tagline}
            onChange={(e) => updateData({ tagline: e.target.value })}
            placeholder="Award-winning screenwriter & director"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Based in</Label>
          <Input
            id="location"
            value={data.location}
            onChange={(e) => updateData({ location: e.target.value })}
            placeholder="Los Angeles, CA"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={onNext} disabled={!canContinue} className="min-w-[120px]">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StepBasicInfo;
