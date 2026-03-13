import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import StepProfileType from "@/components/onboarding/StepProfileType";
import StepGoal from "@/components/onboarding/StepGoal";
import StepBasicInfo from "@/components/onboarding/StepBasicInfo";
import StepSlug from "@/components/onboarding/StepSlug";
import StepActorStats from "@/components/onboarding/StepActorStats";
import StepTheme from "@/components/onboarding/StepTheme";
import StepServices from "@/components/onboarding/StepServices";
import StepComplete from "@/components/onboarding/StepComplete";
import StepSpecializations from "@/components/onboarding/StepSpecializations";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import type { Database } from "@/integrations/supabase/types";

type ProfileType = Database["public"]["Enums"]["profile_type"];

export interface OnboardingData {
  profileType: ProfileType | null;
  secondaryTypes: string[];
  primaryGoal: string;
  displayName: string;
  firstName: string;
  lastName: string;
  tagline: string;
  location: string;
  slug: string;
  theme: string;
  heightDisplay: string;
  ageRangeMin: string;
  ageRangeMax: string;
  hairColor: string;
  eyeColor: string;
  genderIdentity: string;
  unionStatus: string[];
  basedInPrimary: string;
  selectedServices: { name: string; description: string }[];
  availableForHire: boolean;
  specializations?: string[];
}

const INITIAL_DATA: OnboardingData = {
  profileType: null,
  secondaryTypes: [],
  primaryGoal: "",
  displayName: "",
  firstName: "",
  lastName: "",
  tagline: "",
  location: "",
  slug: "",
  theme: "cinematic-dark",
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

export interface StepMeta {
  stepNumber: number;
  totalSteps: number;
}

const STORAGE_KEY = "creativeslate_onboarding";

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s).step || 0 : 0; } catch { return 0; }
  });
  const [data, setData] = useState<OnboardingData>(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? { ...INITIAL_DATA, ...JSON.parse(s).data } : INITIAL_DATA; } catch { return INITIAL_DATA; }
  });
  const [saving, setSaving] = useState(false);
  const [skipping, setSkipping] = useState(false);

  // Persist to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data })); } catch {}
  }, [step, data]);

  const updateData = (partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const isActorType =
    data.profileType === "actor" ||
    data.secondaryTypes.includes("actor");

  const isCopywriterType =
    data.profileType === "copywriter" ||
    data.secondaryTypes.includes("copywriter");

  const isSimpleGoal = data.primaryGoal === "simple_presence";

  const stepKeys: string[] = ["type", "goal", "basic", "slug"];
  if (isActorType && !isSimpleGoal) stepKeys.push("actor");
  if (isCopywriterType && !isSimpleGoal) stepKeys.push("specializations");
  if (!isSimpleGoal) stepKeys.push("theme", "services");
  stepKeys.push("complete");

  const totalSteps = stepKeys.length;

  // Persist draft to profiles after each step transition
  const persistDraft = useCallback(async () => {
    if (!user) return;
    const profileType = data.profileType === "multi_hyphenate"
      ? "multi_hyphenate" as ProfileType
      : data.profileType;

    await supabase
      .from("profiles")
      .update({
        profile_type: profileType,
        secondary_types: data.secondaryTypes.length > 0 ? data.secondaryTypes : null,
        primary_goal: data.primaryGoal || null,
        display_name: data.displayName || null,
        first_name: data.firstName || null,
        last_name: data.lastName || null,
        tagline: data.tagline || null,
        location: data.location || null,
        slug: data.slug || null,
        theme: data.theme,
        available_for_hire: data.availableForHire,
      })
      .eq("id", user.id);
  }, [user, data]);

  const handleNext = () => {
    persistDraft();
    setStep((s) => s + 1);
  };
  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const stepMeta: StepMeta = { stepNumber: step + 1, totalSteps };

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const profileType = data.profileType === "multi_hyphenate"
        ? "multi_hyphenate" as ProfileType
        : data.profileType;

      // Build default section_order from profile type config
      let defaultSectionOrder: string[] = [];
      let defaultSectionsVisible: Record<string, boolean> = {};
      if (profileType) {
        const { getProfileTypeConfig, getMergedSections } = await import("@/config/profileSections");
        const sectionConfigs = profileType === "multi_hyphenate"
          ? getMergedSections(profileType, data.secondaryTypes)
          : (getProfileTypeConfig(profileType)?.sections || []);
        defaultSectionOrder = sectionConfigs
          .filter(s => s.key !== "hero" && s.key !== "contact")
          .map(s => s.key);
        defaultSectionsVisible = Object.fromEntries(defaultSectionOrder.map(k => [k, true]));
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          profile_type: profileType,
          secondary_types: data.secondaryTypes.length > 0 ? data.secondaryTypes : null,
          primary_goal: data.primaryGoal || null,
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
          section_order: defaultSectionOrder.length > 0 ? defaultSectionOrder : null,
          sections_visible: Object.keys(defaultSectionsVisible).length > 0 ? (defaultSectionsVisible as Record<string, boolean>) : null,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

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

      // Save specializations as skills for copywriters
      const specializations = data.specializations;
      if (specializations && specializations.length > 0) {
        const skillRows = specializations.map((name, i) => ({
          profile_id: user.id,
          name,
          category: "Specialization",
          proficiency: "expert",
          display_order: i,
        }));
        await supabase.from("skills").insert(skillRows);
      }

      toast({ title: "Profile created!", description: "Welcome to CreativeSlate." });
      // Clear onboarding localStorage
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Error saving profile", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    const currentKey = stepKeys[step];
    switch (currentKey) {
      case "type":
        return <StepProfileType data={data} updateData={updateData} onNext={handleNext} stepMeta={stepMeta} />;
      case "goal":
        return <StepGoal data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} stepMeta={stepMeta} />;
      case "basic":
        return <StepBasicInfo data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} stepMeta={stepMeta} />;
      case "slug":
        return <StepSlug data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} stepMeta={stepMeta} />;
      case "actor":
        return <StepActorStats data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} stepMeta={stepMeta} />;
      case "specializations":
        return <StepSpecializations data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} stepMeta={stepMeta} />;
      case "theme":
        return <StepTheme data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} stepMeta={stepMeta} />;
      case "services":
        return <StepServices data={data} updateData={updateData} onNext={handleNext} onBack={handleBack} stepMeta={stepMeta} />;
      case "complete":
        return <StepComplete data={data} onComplete={handleComplete} onBack={handleBack} saving={saving} />;
      default:
        return null;
    }
  };

  const currentProgress = Math.min(step + 1, totalSteps);

  // Generate step labels for progress bar
  const stepLabels = stepKeys.map(key => {
    switch (key) {
      case "type": return "Role";
      case "goal": return "Goal";
      case "basic": return "Info";
      case "slug": return "URL";
      case "actor": return "Stats";
      case "specializations": return "Skills";
      case "theme": return "Theme";
      case "services": return "Services";
      case "complete": return "Launch";
      default: return key;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 pb-2 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <OnboardingProgress
                currentStep={currentProgress}
                totalSteps={totalSteps}
                stepLabels={stepLabels}
              />
            </div>
            {/* Skip button — hidden on first 2 steps (type + goal are required) and complete step */}
            {stepKeys[step] !== "complete" && step >= 2 && (
              <button
                disabled={skipping}
                onClick={async () => {
                  if (skipping) return;
                  setSkipping(true);
                  try {
                    // Save partial data before skipping
                    const pt = data.profileType === "multi_hyphenate" ? "multi_hyphenate" as ProfileType : data.profileType;
                    await supabase
                      .from("profiles")
                      .update({
                        onboarding_completed: true, is_draft: false,
                        ...(pt && { profile_type: pt }),
                        ...(data.displayName && { display_name: data.displayName }),
                        ...(data.firstName && { first_name: data.firstName }),
                        ...(data.lastName && { last_name: data.lastName }),
                        ...(data.slug && { slug: data.slug }),
                        ...(data.tagline && { tagline: data.tagline }),
                        ...(data.location && { location: data.location }),
                        ...(data.theme && { theme: data.theme }),
                      })
                      .eq("id", user!.id);
                    localStorage.removeItem(STORAGE_KEY);
                    navigate("/dashboard", { replace: true });
                  } catch (e) {
                    setSkipping(false);
                  }
                }}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap rounded-full border border-border hover:border-foreground/20 disabled:opacity-50"
              >
                {skipping ? "Skipping..." : "Skip →"}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
        {stepKeys[step] === "type" && (
          <div className="w-full max-w-4xl mb-4">
            <Link to="/" className="text-xs hover:underline" style={{ color: "hsl(var(--muted-foreground))" }}>
              ← Back to home
            </Link>
          </div>
        )}
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
