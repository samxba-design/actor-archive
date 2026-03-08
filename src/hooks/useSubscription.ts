import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionTier = "free" | "pro";

export type ProFeature =
  | "themes"
  | "font_pairing"
  | "layout_density"
  | "custom_css"
  | "custom_domain"
  | "auto_responder"
  | "ai_writing"
  | "coverage_sim"
  | "comp_matcher"
  | "profile_insights"
  | "full_analytics"
  | "pipeline_tracker"
  | "smart_followup"
  | "endorsements"
  | "case_study_builder"
  | "embed_widget"
  | "advanced_access_levels"
  | "unlimited_projects"
  | "unlimited_gallery"
  | "remove_badge";

const PRO_FEATURES: ProFeature[] = [
  "themes",
  "font_pairing",
  "layout_density",
  "custom_css",
  "custom_domain",
  "auto_responder",
  "ai_writing",
  "coverage_sim",
  "comp_matcher",
  "profile_insights",
  "full_analytics",
  "pipeline_tracker",
  "smart_followup",
  "endorsements",
  "case_study_builder",
  "embed_widget",
  "advanced_access_levels",
  "unlimited_projects",
  "unlimited_gallery",
  "remove_badge",
];

export const FREE_PROJECT_LIMIT = 8;
export const FREE_GALLERY_LIMIT = 5;

export function useSubscription() {
  const { user } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        const t = (data?.subscription_tier as SubscriptionTier) || "free";
        setTier(t === "pro" ? "pro" : "free");
        setLoading(false);
      });
  }, [user]);

  const isPro = tier === "pro";

  const canAccess = (feature: ProFeature): boolean => {
    if (isPro) return true;
    // Free users cannot access any pro feature
    return !PRO_FEATURES.includes(feature);
  };

  return { tier, isPro, canAccess, loading };
}
