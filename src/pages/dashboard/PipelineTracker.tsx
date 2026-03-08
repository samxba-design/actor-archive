import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { UpgradeGate } from "@/components/UpgradeGate";

interface Submission {
  id: string;
  profile_id: string;
  project_id: string | null;
  company_name: string;
  contact_name: string | null;
  contact_email: string | null;
  submission_type: string | null;
  status: string;
  submitted_at: string | null;
  response_at: string | null;
  notes: string | null;
  display_order: number | null;
  created_at: string | null;
  updated_at: string | null;
}

const STATUSES = [
  { value: "submitted", label: "Submitted", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "requested_material", label: "Requested Material", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "in_review", label: "In Review", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { value: "meeting", label: "Meeting Set", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "passed", label: "Passed", color: "bg-red-100 text-red-800 border-red-200" },
  { value: "signed", label: "Signed!", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
];

const SUB_TYPES = ["query", "referral", "pitch_fest", "cold_submission", "contest", "other"];

const PipelineTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    contact_email: "",
    submission_type: "query",
    project_id: "",
    notes: "",
  });

  const fetch = async () => {
    if (!user) return;
    const [subRes, projRes] = await Promise.all([
      supabase.from("pipeline_submissions").select("*").eq("profile_id", user.id).order("created_at", { ascending: false }),
      supabase.from("projects").select("id, title").eq("profile_id", user.id).order("title"),
    ]);
    setSubmissions((subRes.data as Submission[]) || []);
    setProjects(projRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [user]);

  const handleAdd = async () => {
    if (!user || !form.company_name) return;
    setSaving(true);
    const { error } = await supabase.from("pipeline_submissions").insert({
      profile_id: user.id,
      company_name: form.company_name,
      contact_name: form.contact_name || null,
      contact_email: form.contact_email || null,
      submission_type: form.submission_type,
      project_id: form.project_id || null,
      notes: form.notes || null,
    } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Added" });
      setForm({ company_name: "", contact_name: "", contact_email: "", submission_type: "query", project_id: "", notes: "" });
      setDialogOpen(false);
      fetch();
    }
    setSaving(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const updates: any = { status };
    if (status === "passed" || status === "signed") {
      updates.response_at = new Date().toISOString().split("T")[0];
    }
    await supabase.from("pipeline_submissions").update(updates).eq("id", id);
    fetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("pipeline_submissions").delete().eq("id", id);
    fetch();
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  const grouped = STATUSES.map((s) => ({
    ...s,
    items: submissions.filter((sub) => sub.status === s.value),
  }));

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <UpgradeGate feature="pipeline_tracker" label="Pipeline Tracker">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pipeline Tracker</h1>
          <p className="text-muted-foreground mt-1">Track where your scripts have been submitted.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Submission</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Submission</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Company / Agency</Label><Input value={form.company_name} onChange={update("company_name")} placeholder="e.g. CAA, WME, Manager X" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Contact Name</Label><Input value={form.contact_name} onChange={update("contact_name")} /></div>
                <div><Label>Email</Label><Input value={form.contact_email} onChange={update("contact_email")} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={form.submission_type} onValueChange={(v) => setForm((p) => ({ ...p, submission_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SUB_TYPES.map((t) => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Project</Label>
                  <Select value={form.project_id} onValueChange={(v) => setForm((p) => ({ ...p, project_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                    <SelectContent>
                      {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Notes</Label><Textarea value={form.notes} onChange={update("notes")} rows={2} /></div>
              <Button onClick={handleAdd} disabled={saving || !form.company_name} className="w-full">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grouped.map((col) => (
          <div key={col.value} className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={col.color}>{col.label}</Badge>
              <span className="text-xs text-muted-foreground">{col.items.length}</span>
            </div>
            {col.items.length === 0 && (
              <div className="border border-dashed rounded-md p-4 text-center text-xs text-muted-foreground">No submissions</div>
            )}
            {col.items.map((sub) => (
              <Card key={sub.id} className="text-sm">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{sub.company_name}</p>
                      {sub.contact_name && <p className="text-xs text-muted-foreground">{sub.contact_name}</p>}
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDelete(sub.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  {sub.submission_type && (
                    <Badge variant="secondary" className="text-xs">{sub.submission_type.replace(/_/g, " ")}</Badge>
                  )}
                  {sub.submitted_at && <p className="text-xs text-muted-foreground">Sent: {sub.submitted_at}</p>}
                  {sub.notes && <p className="text-xs text-muted-foreground italic">{sub.notes}</p>}
                  <Select value={sub.status} onValueChange={(v) => updateStatus(sub.id, v)}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
    </UpgradeGate>
  );
};

export default PipelineTracker;
