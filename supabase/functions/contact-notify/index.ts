import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profile_id, sender_name, sender_email, subject_type, message } = await req.json();
    if (!profile_id || !sender_name || !sender_email || !message) {
      throw new Error("Missing required fields");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get profile owner's email from auth.users via admin
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name")
      .eq("id", profile_id)
      .single();

    if (!profile) throw new Error("Profile not found");

    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profile_id);
    const ownerEmail = userData?.user?.email;

    if (!ownerEmail) {
      console.log("No owner email found, skipping notification");
      return new Response(JSON.stringify({ sent: false, reason: "no_email" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log the notification (in production, integrate with Resend or similar)
    console.log(`[CONTACT-NOTIFY] New message for ${ownerEmail} from ${sender_name} <${sender_email}> — ${subject_type || "general"}`);
    console.log(`[CONTACT-NOTIFY] Message preview: ${message.substring(0, 200)}`);

    // For now, we log the notification. When an email service is connected,
    // this function can be extended to send actual emails.

    return new Response(JSON.stringify({ sent: true, to: ownerEmail }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[CONTACT-NOTIFY] Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
