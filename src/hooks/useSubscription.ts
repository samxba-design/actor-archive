import { useEffect, useState, useCallback } from "react";
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
  | "remove_badge"
  | "pitch_email";

const PRO_FEATURES: ProFeature[] = [
  "themes", "font_pairing", "layout_density", "custom_css", "custom_domain",
  "auto_responder", "ai_writing", "coverage_sim", "comp_matcher",
  "profile_insights", "full_analytics", "pipeline_tracker", "smart_followup",
  "endorsements", "case_study_builder", "embed_widget", "advanced_access_levels",
  "unlimited_projects", "unlimited_gallery", "remove_badge", "pitch_email",
];

export const FREE_PROJECT_LIMIT = 8;
export const FREE_GALLERY_LIMIT = 5;

export const STRIPE_PRICES = {
  monthly: "price_1T8g3PB29RCAwSicV1KU7nqk",
  yearly: "price_1T8g3QB29RCAwSicE3lOeV4T",
} as const;

export function useSubscription() {
  const { user } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [loading, setLoading] = useState(true);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      
      const t = (data?.tier as SubscriptionTier) || "free";
      setTier(t === "pro" ? "pro" : "free");
      setSubscriptionEnd(data?.subscription_end || null);
    } catch {
      // Fallback: read from profiles table
      const { data } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .single();
      const t = (data?.subscription_tier as SubscriptionTier) || "free";
      setTier(t === "pro" ? "pro" : "free");
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  const isPro = tier === "pro";

  const canAccess = (feature: ProFeature): boolean => {
    if (isPro) return true;
    return !PRO_FEATURES.includes(feature);
  };

  return { tier, isPro, canAccess, loading, subscriptionEnd, refreshSubscription: checkSubscription };
}
