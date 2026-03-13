import { supabase } from "@/integrations/supabase/client";

type InteractionType =
  | "reel_played"
  | "contact_clicked"
  | "cta_clicked"
  | "cv_downloaded"
  | "headshot_clicked"
  | "social_link_clicked"
  | "credit_clicked";

/**
 * Track visitor interactions on a public portfolio beyond basic page views.
 * Events are stored in the page_views table via a lightweight insert.
 * We use `path` to encode the interaction type for analytics aggregation.
 */
export function trackInteraction(profileId: string, type: InteractionType, detail?: string) {
  // Fire-and-forget — don't block the UI
  supabase.from("page_views").insert({
    profile_id: profileId,
    path: `/_interaction/${type}${detail ? `/${detail}` : ""}`,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent,
    device_type: window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop",
  }).then(() => {});
}
