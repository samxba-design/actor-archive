import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, Copy, Check, Lightbulb, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UpgradeGate } from "@/components/UpgradeGate";
import PageHeader from "@/components/dashboard/PageHeader";

interface PitchEmail {
  subject_line: string;
  body: string;
  tone: string;
  word_count: number;
}

const PITCH_TYPES = [
  { value: "query_letter", label: "Query Letter (Script/Book)" },
  { value: "cold_pitch", label: "Cold Pitch (Service/Commission)" },
  { value: "follow_up", label: "Follow-Up Email" },
  { value: "introduction", label: "Introduction / Networking" },
  { value: "job_application", label: "Job Application Cover" },
];

const PitchEmailGenerator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [emails, setEmails] = useState<PitchEmail[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [profileData, setProfileData] = useState<any>(null);

  const [form, setForm] = useState({
    pitchType: "query_letter",
    recipientName: "",
    recipientCompany: "",
    recipientRole: "",
    projectTitle: "",
    projectHook: "",
    whyThem: "",
    askAction: "",
  });

  useEffect(() => {
    if (!user) return;
    // Fetch profile context
    Promise.all([
      supabase.from("profiles").select("display_name, headline, profile_type, bio").eq("id", user.id).single(),
      supabase.from("projects").select("title, project_type, logline, genre, year").eq("profile_id", user.id).order("display_order").limit(5),
      supabase.from("awards").select("name, organization, result").eq("profile_id", user.id).limit(5),
    ]).then(([profileRes, projectsRes, awardsRes]) => {
      setProfileData({
        profile: profileRes.data,
        projects: projectsRes.data || [],
        awards: awardsRes.data || [],
      });
    });
  }, [user]);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const generate = async () => {
    if (!form.recipientCompany && !form.recipientName) {
      toast({ title: "Add a recipient", description: "Enter at least a company or contact name.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setEmails([]);
    setTips([]);
    try {
      const context = JSON.stringify({
        pitch_type: form.pitchType,
        sender: profileData?.profile || {},
        sender_projects: profileData?.projects || [],
        sender_awards: profileData?.awards || [],
        recipient: {
          name: form.recipientName,
          company: form.recipientCompany,
          role: form.recipientRole,
        },
        project_title: form.projectTitle,
        project_hook: form.projectHook,
        why_this_recipient: form.whyThem,
        desired_action: form.askAction,
      });

      const { data, error } = await supabase.functions.invoke("writing-assist", {
        body: { type: "generate_pitch_email", text: context },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setEmails(data.result?.emails || []);
      setTips(data.result?.tips || []);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const copyEmail = (email: PitchEmail, idx: number) => {
    const full = `Subject: ${email.subject_line}\n\n${email.body}`;
    navigator.clipboard.writeText(full);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <UpgradeGate feature="pitch_email" label="Pitch Email Generator">
      <div className="max-w-2xl space-y-6">
        <PageHeader
          title="Pitch Email Generator"
          description="Generate tailored query letters, pitch emails, and follow-ups powered by AI. Your profile, projects, and awards are automatically included as context."
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Email Type & Recipient</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Pitch Type</Label>
              <Select value={form.pitchType} onValueChange={(v) => setForm(prev => ({ ...prev, pitchType: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PITCH_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Recipient Name</Label>
                <Input value={form.recipientName} onChange={update("recipientName")} placeholder="e.g. Jane Smith" />
              </div>
              <div>
                <Label>Company / Publication</Label>
                <Input value={form.recipientCompany} onChange={update("recipientCompany")} placeholder="e.g. CAA, Penguin Random House" />
              </div>
            </div>
            <div>
              <Label>Their Role (optional)</Label>
              <Input value={form.recipientRole} onChange={update("recipientRole")} placeholder="e.g. Literary Agent, VP Marketing" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pitch Content</CardTitle>
            <CardDescription>What are you pitching and why?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Project / Service Title</Label>
              <Input value={form.projectTitle} onChange={update("projectTitle")} placeholder="e.g. My screenplay 'The Last Summer'" />
            </div>
            <div>
              <Label>Hook / Key Selling Point</Label>
              <Textarea value={form.projectHook} onChange={update("projectHook")} rows={2} placeholder="e.g. A coming-of-age thriller set in 1990s Tokyo — Shoplifters meets Parasite" />
            </div>
            <div>
              <Label>Why this specific recipient?</Label>
              <Input value={form.whyThem} onChange={update("whyThem")} placeholder="e.g. They recently acquired a similar project" />
            </div>
            <div>
              <Label>Desired action</Label>
              <Input value={form.askAction} onChange={update("askAction")} placeholder="e.g. Read my script, Schedule a call, Review my portfolio" />
            </div>
          </CardContent>
        </Card>

        <Button onClick={generate} disabled={loading} className="w-full" size="lg">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          Generate Pitch Emails
        </Button>

        {loading && (
          <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Crafting your pitch...
          </div>
        )}

        {emails.length > 0 && !loading && (
          <div className="space-y-4">
            {emails.map((email, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <Badge variant="secondary" className="text-[10px]">{email.tone}</Badge>
                      <span className="text-[10px] text-muted-foreground">{email.word_count} words</span>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => copyEmail(email, i)}>
                      {copiedIdx === i ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="bg-muted/50 rounded px-3 py-2">
                    <p className="text-xs text-muted-foreground">Subject</p>
                    <p className="text-sm font-medium">{email.subject_line}</p>
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{email.body}</div>
                </CardContent>
              </Card>
            ))}

            {tips.length > 0 && (
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Personalization Tips</span>
                  </div>
                  <ul className="space-y-1">
                    {tips.map((tip, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-primary shrink-0">→</span> {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </UpgradeGate>
  );
};

export default PitchEmailGenerator;
