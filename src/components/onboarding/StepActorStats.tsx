import type { OnboardingData, StepMeta } from "@/pages/Onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

interface Props {
  data: OnboardingData;
  updateData: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  stepMeta: StepMeta;
}

const UNION_OPTIONS = ["SAG-AFTRA", "Equity (UK)", "Equity (US)", "ACTRA", "Non-Union", "Fi-Core"];
const HAIR_OPTIONS = ["Black", "Brown", "Blonde", "Red", "Auburn", "Grey", "White", "Bald", "Other"];
const EYE_OPTIONS = ["Brown", "Blue", "Green", "Hazel", "Grey", "Amber", "Other"];
const GENDER_OPTIONS = ["Male", "Female", "Non-Binary", "Transgender Male", "Transgender Female", "Gender Fluid", "Prefer Not to Say", "Other"];

const StepActorStats = ({ data, updateData, onNext, onBack, stepMeta }: Props) => {
  const toggleUnion = (u: string) => {
    updateData({
      unionStatus: data.unionStatus.includes(u)
        ? data.unionStatus.filter((s) => s !== u)
        : [...data.unionStatus, u],
    });
  };

  const ageMinNum = data.ageRangeMin ? parseInt(data.ageRangeMin) : null;
  const ageMaxNum = data.ageRangeMax ? parseInt(data.ageRangeMax) : null;
  const ageError = ageMinNum && ageMaxNum && ageMinNum >= ageMaxNum;

  return (
    <div className="w-full max-w-lg space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Step {stepMeta.stepNumber} of {stepMeta.totalSteps}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Physical stats & basics</h1>
        <p className="text-muted-foreground">Casting directors need this info upfront. You can add more detail later in your dashboard.</p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              value={data.heightDisplay}
              onChange={(e) => updateData({ heightDisplay: e.target.value })}
              placeholder={`5'10" or 178cm`}
            />
            <p className="text-xs text-muted-foreground">e.g. 5'10" or 178cm</p>
          </div>
          <div className="space-y-2">
            <Label>Playable age range</Label>
            <div className="flex items-center gap-2">
              <Input
                value={data.ageRangeMin}
                onChange={(e) => updateData({ ageRangeMin: e.target.value })}
                placeholder="25"
                className="w-20"
                type="number"
                min={1}
                max={99}
              />
              <span className="text-muted-foreground">–</span>
              <Input
                value={data.ageRangeMax}
                onChange={(e) => updateData({ ageRangeMax: e.target.value })}
                placeholder="35"
                className="w-20"
                type="number"
                min={1}
                max={99}
              />
            </div>
            {ageError && (
              <p className="text-xs text-destructive">Min must be less than max</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Gender identity</Label>
          <div className="flex flex-wrap gap-2">
            {GENDER_OPTIONS.map((g) => (
              <button
                key={g}
                onClick={() => updateData({ genderIdentity: g })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  data.genderIdentity === g
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Hair colour</Label>
            <div className="flex flex-wrap gap-1.5">
              {HAIR_OPTIONS.map((h) => (
                <button
                  key={h}
                  onClick={() => updateData({ hairColor: h })}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    data.hairColor === h
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Eye colour</Label>
            <div className="flex flex-wrap gap-1.5">
              {EYE_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => updateData({ eyeColor: e })}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    data.eyeColor === e
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Union status</Label>
          <div className="flex flex-wrap gap-2">
            {UNION_OPTIONS.map((u) => (
              <button
                key={u}
                onClick={() => toggleUnion(u)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  data.unionStatus.includes(u)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="basedIn">Based in</Label>
          <Input
            id="basedIn"
            value={data.basedInPrimary}
            onChange={(e) => updateData({ basedInPrimary: e.target.value })}
            placeholder="London / Los Angeles"
          />
        </div>
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

export default StepActorStats;
