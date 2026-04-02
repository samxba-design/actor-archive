import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify the authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !userData.user) throw new Error("Unauthorized");

    const { submission_id, reply_message } = await req.json();
    if (!submission_id || !reply_message) throw new Error("Missing submission_id or reply_message");

    // Get the contact submission
    const { data: submission, error: subError } = await supabaseAdmin
      .from("contact_submissions")
      .select("id, sender_email, sender_name, subject, profile_id")
      .eq("id", submission_id)
      .single();

    if (subError || !submission) throw new Error("Submission not found");

    // Verify the user owns this submission's profile
    if (submission.profile_id !== userData.user.id) throw new Error("Forbidden");

    // Get the profile owner's display name
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("display_name")
      .eq("id", userData.user.id)
      .single();

    const senderName = profile?.display_name || userData.user.email || "Portfolio Owner";

    // Log the reply (when email service is connected, this sends the actual email)
    console.log(`[CONTACT-REPLY] Reply from ${senderName} to ${submission.sender_email}`);
    console.log(`[CONTACT-REPLY] Subject: Re: ${submission.subject || "(No subject)"}`);
    console.log(`[CONTACT-REPLY] Message: ${reply_message.substring(0, 500)}`);

    // Mark reply_sent on the submission
    await supabaseAdmin
      .from("contact_submissions")
      .update({ reply_sent: true })
      .eq("id", submission_id);

    return new Response(JSON.stringify({ 
      sent: true, 
      to: submission.sender_email,
      note: "Reply logged. Connect an email service to send actual emails."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[CONTACT-REPLY] Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
