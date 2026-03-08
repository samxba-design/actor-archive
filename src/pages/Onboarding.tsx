import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import StepProfileType from "@/components/onboarding/StepProfileType";
import StepBasicInfo from "@/components/onboarding/StepBasicInfo";
import StepSlug from "@/components/onboarding/StepSlug";
import StepActorStats from "@/components/onboarding/StepActorStats";
import StepTheme from "@/components/onboarding/StepTheme";
import StepServices from "@/components/onboarding/StepServices";
import StepComplete from "@/components/onboarding/StepComplete";
import type { Database } from "@/integrations/supabase/types";

type ProfileType = Database["public"]["Enums"]["profile_type"];

export interface OnboardingData {
  profileType: ProfileType | null;
  secondaryTypes: string[];
  displayName: string;
  firstName: string;
  lastName: string;
  tagline: string;
  location: string;
  slug: string;
  theme: string;
  // Actor-specific
  heightDisplay: string;
  ageRangeMin: string;
  ageRangeMax: string;
  hairColor: string;
  eyeColor: string;
  genderIdentity: string;
  unionStatus: string[];
  basedInPrimary: string;
  // Services
  selectedServices: { name: string; description: string }[];
  availableForHire: boolean;
}

const INITIAL_DATA: OnboardingData = {
  profileType: null,
  secondaryTypes: [],
  displayName: "",
  firstName: "",
  lastName: "",
  tagline: "",
  location: "",
  slug: "",
  theme: "minimal",
  heightDisplay: "",
  ageRangeMin: "",
  ageRangeMax: "",
  hairColor: "",
  eyeColor: "",
  genderIdentity: "",
  unionStatus: [],
  basedInPrimary: "",
  selectedServices: [],
  availableForHire: false,
};

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [saving, setSaving] = useState(false);

  const updateData = (partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const isActorType =
    data.profileType === "actor" ||
    data.secondaryTypes.includes("actor");

  // Steps: 0=type, 1=basic, 2=slug, 3=actor(conditional), 4=theme, 5=services, 6=complete
  const totalSteps = isActorType ? 7 : 6;

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const profileType = data.profileType === "multi_hyphenate"
        ? "multi_hyphenate" as ProfileType
        : data.profileType;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          profile_type: profileType,
          secondary_types: data.secondaryTypes.length > 0 ? data.secondaryTypes : null,
          display_name: data.displayName || null,
          first_name: data.firstName || null,
          last_name: data.lastName || null,
          tagline: data.tagline || null,
          location: data.location || null,
          slug: data.slug || null,
          theme: data.theme,
          available_for_hire: data.availableForHire,
          onboarding_completed: true,
          is_draft: false,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Save actor stats if applicable
      if (isActorType) {
        const { error: actorError } = await supabase
          .from("actor_stats")
          .upsert({
            profile_id: user.id,
            height_display: data.heightDisplay || null,
            age_range_min: data.ageRangeMin ? parseInt(data.ageRangeMin) : null,
            age_range_max: data.ageRangeMax ? parseInt(data.ageRangeMax) : null,
            hair_color: data.hairColor || null,
            eye_color: data.eyeColor || null,
            gender_identity: data.genderIdentity || null,
            union_status: data.unionStatus.length > 0 ? data.unionStatus : null,
            based_in_primary: data.basedInPrimary || null,
          });

        if (actorError) throw actorError;
      }

      // Save selected services
      if (data.selectedServices.length > 0) {
        const serviceRows = data.selectedServices.map((s, i) => ({
          profile_id: user.id,
          name: s.name,
          description: s.description,
          display_order: i,
        }));
        const { error: servicesError } = await supabase.from("services").insert(serviceRows);
        if (servicesError) throw servicesError;
      }

      toast({ title: "Profile created!", description: "Welcome to CreativeSlate." });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Error saving profile", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepProfileType data={data} updateData={updateData} onNext={handleNext} />;
      case 1:
        return <StepBasicInfo data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <StepSlug data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} />;
      case 3:
        if (isActorType) {
          return <StepActorStats data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} />;
        }
        return <StepTheme data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} />;
      case 4:
        if (isActorType) {
          return <StepTheme data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} />;
        }
        return <StepServices data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} />;
      case 5:
        if (isActorType) {
          return <StepServices data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} />;
        }
        return <StepComplete data={data} onComplete={handleComplete} onBack={handleBack} saving={saving} />;
      case 6:
        return <StepComplete data={data} onComplete={handleComplete} onBack={handleBack} saving={saving} />;
      default:
        return null;
    }
  };

  // Progress indicator
  const currentProgress = Math.min(step + 1, totalSteps);

  return (
    <div className="min-h-screen bg-background">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(currentProgress / totalSteps) * 100}%` }}
        />
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
