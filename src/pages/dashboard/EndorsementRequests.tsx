import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Copy, CheckCircle2, ExternalLink, Quote } from "lucide-react";

const EndorsementRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [slug, setSlug] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("profiles").select("slug, display_name, first_name").eq("id", user.id).single(),
      supabase.from("testimonials").select("*").eq("profile_id", user.id).order("created_at", { ascending: false }),
    ]).then(([profileRes, testRes]) => {
      setSlug(profileRes.data?.slug || "");
      setDisplayName(profileRes.data?.display_name || profileRes.data?.first_name || "");
      setTestimonials(testRes.data || []);
      setLoading(false);
    });
  }, [user]);

  const endorsementUrl = `${window.location.origin}/p/${slug}?endorse=true`;

  const defaultMessage = `Hi ${recipientName || "[Name]"},

I'm building my professional portfolio and would love to include a testimonial from you about our work together.

It would mean a lot — even just 2-3 sentences about the experience.

You can submit it here: ${endorsementUrl}

Thank you!
${displayName}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage || defaultMessage);
    setCopied(true);
    toast({ title: "Copied!", description: "Message copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMailto = () => {
    if (!recipientEmail) {
      toast({ title: "Enter an email", variant: "destructive" });
      return;
    }
    const subject = encodeURIComponent(`Quick favor — testimonial for ${displayName}'s portfolio`);
    const body = encodeURIComponent(customMessage || defaultMessage);
    window.open(`mailto:${recipientEmail}?subject=${subject}&body=${body}`, "_blank");
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Request Endorsements</h1>
        <p className="text-muted-foreground mt-1">Ask colleagues for testimonials — they submit through your public contact form.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Compose Request</CardTitle>
          <CardDescription>Fill in their details and we'll generate a message you can send.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Their Name</Label><Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="e.g. Jane Smith" /></div>
            <div><Label>Their Email</Label><Input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="jane@example.com" /></div>
          </div>

          <div>
            <Label>Message Preview</Label>
            <Textarea
              value={customMessage || defaultMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={8}
              className="mt-1 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy} className="flex-1">
              {copied ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? "Copied!" : "Copy Message"}
            </Button>
            <Button onClick={handleMailto} className="flex-1">
              <Send className="mr-2 h-4 w-4" /> Open in Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing testimonials */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Received Testimonials</CardTitle>
          <CardDescription>{testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""} on your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {testimonials.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No testimonials yet. Send some requests!</p>
          ) : (
            testimonials.map((t) => (
              <div key={t.id} className="p-3 rounded-md border bg-muted/30">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm italic">"{t.quote}"</p>
                    <p className="text-xs text-muted-foreground mt-1">— {t.author_name}{t.author_role ? `, ${t.author_role}` : ""}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EndorsementRequests;
