import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

import * as screenwriterDefaults from "@/data/demoScreenwriterData";
import * as actorDefaults from "@/data/demoActorData";
import * as copywriterDefaults from "@/data/demoCopywriterData";

const HARDCODED: Record<string, any> = {
  screenwriter: screenwriterDefaults,
  actor: actorDefaults,
  copywriter: copywriterDefaults,
};

const SETTING_KEYS: Record<string, string> = {
  screenwriter: "demo_screenwriter",
  actor: "demo_actor",
  copywriter: "demo_copywriter",
};

function deepMerge(defaults: any, overrides: any): any {
  if (!overrides) return defaults;
  if (Array.isArray(defaults) && Array.isArray(overrides)) return overrides;
  if (typeof defaults === "object" && typeof overrides === "object" && defaults !== null && overrides !== null) {
    const result = { ...defaults };
    for (const key of Object.keys(overrides)) {
      if (overrides[key] !== undefined && overrides[key] !== null) {
        result[key] = deepMerge(defaults[key], overrides[key]);
      }
    }
    return result;
  }
  return overrides;
}

export function useDemoData(profileType: "screenwriter" | "actor" | "copywriter") {
  const [adminOverride, setAdminOverride] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = SETTING_KEYS[profileType];
    supabase
      .from("platform_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setAdminOverride(data.value);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [profileType]);

  const merged = useMemo(() => {
    const defaults = HARDCODED[profileType];
    if (!adminOverride) return defaults;
    return deepMerge(defaults, adminOverride);
  }, [profileType, adminOverride]);

  return { data: merged, loading, hasOverride: !!adminOverride };
}

/** Save admin overrides to platform_settings */
export async function saveDemoOverride(
  profileType: "screenwriter" | "actor" | "copywriter",
  overrides: any
) {
  const key = SETTING_KEYS[profileType];

  // Check if exists
  const { data: existing } = await supabase
    .from("platform_settings")
    .select("id")
    .eq("key", key)
    .maybeSingle();

  if (existing) {
    return supabase
      .from("platform_settings")
      .update({ value: overrides, updated_at: new Date().toISOString() })
      .eq("key", key);
  } else {
    return supabase.from("platform_settings").insert({
      key,
      value: overrides,
      category: "demo",
      description: `Demo profile overrides for ${profileType}`,
    });
  }
}

/** Delete admin overrides (revert to defaults) */
export async function resetDemoOverride(profileType: "screenwriter" | "actor" | "copywriter") {
  const key = SETTING_KEYS[profileType];
  return supabase.from("platform_settings").delete().eq("key", key);
}
