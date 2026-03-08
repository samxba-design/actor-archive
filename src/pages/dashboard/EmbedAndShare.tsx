import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, CheckCircle2, QrCode, Code2, ExternalLink } from "lucide-react";
import { UpgradeGate } from "@/components/UpgradeGate";

const EmbedAndShare = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [slug, setSlug] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("slug, display_name, first_name").eq("id", user.id).single()
      .then(({ data }) => {
        setSlug(data?.slug || "");
        setDisplayName(data?.display_name || data?.first_name || "");
        setLoading(false);
      });
  }, [user]);

  const portfolioUrl = `${window.location.origin}/p/${slug}`;

  const embedCode = `<!-- ${displayName}'s Portfolio -->
<iframe
  src="${portfolioUrl}?embed=true"
  width="100%"
  height="600"
  style="border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
  title="${displayName} — Portfolio"
></iframe>`;

  const badgeCode = `<a href="${portfolioUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:#1a1a1a;color:#fff;border-radius:6px;font-family:system-ui;font-size:14px;text-decoration:none;">
  ✦ View Portfolio — ${displayName}
</a>`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(portfolioUrl)}&bgcolor=ffffff&color=000000&format=png`;

  const copyToClipboard = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    toast({ title: "Copied!" });
    setTimeout(() => setter(false), 2000);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  if (!slug) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-4">Embed & Share</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Set up your portfolio slug first in Settings to generate share tools.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Embed & Share</h1>
        <p className="text-muted-foreground mt-1">Widgets, badges, and QR codes to share your portfolio everywhere.</p>
      </div>

      {/* Quick Link */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Your Portfolio Link</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={portfolioUrl} readOnly className="font-mono text-sm" />
            <Button variant="outline" onClick={() => copyToClipboard(portfolioUrl, setCopiedLink)}>
              {copiedLink ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="outline" asChild>
              <a href={portfolioUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QR Code */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><QrCode className="h-5 w-5 text-primary" /> Event QR Code</CardTitle>
          <CardDescription>Print this for networking events, business cards, or festival badges.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <img src={qrUrl} alt="Portfolio QR Code" className="w-48 h-48" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Scan to visit <strong>{displayName}</strong>'s portfolio</p>
            <Button variant="outline" size="sm" asChild>
              <a href={qrUrl} download={`${slug}-qr-code.png`}>Download QR Code</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Embed Widget */}
      <UpgradeGate feature="embed_widget" label="Embed Widget">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Code2 className="h-5 w-5 text-primary" /> Embed Widget</CardTitle>
          <CardDescription>Add your portfolio to any website or blog.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea value={embedCode} readOnly rows={6} className="font-mono text-xs" />
          <Button variant="outline" onClick={() => copyToClipboard(embedCode, setCopiedEmbed)} className="w-full">
            {copiedEmbed ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Copied!</> : <><Copy className="mr-2 h-4 w-4" /> Copy Embed Code</>}
          </Button>
        </CardContent>
      </Card>
      </UpgradeGate>
      {/* Badge / Button */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Portfolio Badge</CardTitle>
          <CardDescription>A styled link button for your website or email signature.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-center py-3">
            <a href={portfolioUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
              ✦ View Portfolio — {displayName}
            </a>
          </div>
          <Textarea value={badgeCode} readOnly rows={3} className="font-mono text-xs" />
          <Button variant="outline" onClick={() => copyToClipboard(badgeCode, setCopiedBadge)} className="w-full">
            {copiedBadge ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Copied!</> : <><Copy className="mr-2 h-4 w-4" /> Copy Badge Code</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmbedAndShare;
