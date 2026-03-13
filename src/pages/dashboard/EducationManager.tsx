import { useEffect, useState, useCallback } from "react";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import ManagerHelpBanner from "@/components/dashboard/ManagerHelpBanner";
import { useProfileTypeContext } from "@/contexts/ProfileTypeContext";

interface Education {
  id: string;
  institution: string;
  degree_or_certificate: string | null;
  field_of_study: string | null;
  year_start: number | null;
  year_end: number | null;
  is_ongoing: boolean | null;
  description: string | null;
  teacher_name: string | null;
  display_order: number | null;
}

const EducationManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { slug } = useProfileTypeContext();
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState({ institution: "", degree_or_certificate: "", field_of_study: "", year_start: "", year_end: "", is_ongoing: false, description: "", teacher_name: "" });
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    if (!user) return;
    const { data } = await supabase.from("education").select("*").eq("profile_id", user.id).order("display_order");
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [user]);

  const openAdd = () => { setEditing(null); setForm({ institution: "", degree_or_certificate: "", field_of_study: "", year_start: "", year_end: "", is_ongoing: false, description: "", teacher_name: "" }); setDialogOpen(true); };
  const openEdit = (item: Education) => { setEditing(item); setForm({ institution: item.institution, degree_or_certificate: item.degree_or_certificate || "", field_of_study: item.field_of_study || "", year_start: item.year_start?.toString() || "", year_end: item.year_end?.toString() || "", is_ongoing: item.is_ongoing || false, description: item.description || "", teacher_name: item.teacher_name || "" }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!user || !form.institution.trim()) return;
    setSaving(true);
    const payload = { profile_id: user.id, institution: form.institution.trim(), degree_or_certificate: form.degree_or_certificate || null, field_of_study: form.field_of_study || null, year_start: form.year_start ? parseInt(form.year_start) : null, year_end: form.year_end ? parseInt(form.year_end) : null, is_ongoing: form.is_ongoing, description: form.description || null, teacher_name: form.teacher_name || null };
    const { error } = editing ? await supabase.from("education").update(payload).eq("id", editing.id) : await supabase.from("education").insert(payload);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Updated" : "Added" }); setDialogOpen(false); fetchItems(); }
    setSaving(false);
  };

  const performDelete = useCallback(async (id: string) => { await supabase.from("education").delete().eq("id", id); fetchItems(); }, [user]);
  const { requestDelete, DeleteConfirmDialog } = useDeleteConfirmation(performDelete, { title: "Delete this entry?", description: "This education entry will be permanently removed." });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Education & Training"
          description="List your degrees, workshops, conservatory training, and mentorships. Training credentials help establish your professional foundation."
        />
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add</Button>
      </div>
      <ManagerHelpBanner id="education" title="Training appears in your Education section" description="List degrees, workshops, and mentorships. You can hide this section in Settings." learnMoreRoute="/dashboard/settings" previewText="Shown as a timeline with institution name, degree, and year range" demoUrl="/demo/actor" />
      {items.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No education entries yet" description="Add schools, workshops, masterclasses, or private coaching to show your training background." actionLabel="Add Education" onAction={openAdd} />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}><CardContent className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <GraduationCap className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <span className="font-medium text-foreground">{item.institution}</span>
                  <p className="text-sm text-muted-foreground">{[item.degree_or_certificate, item.field_of_study, item.is_ongoing ? "Ongoing" : item.year_end].filter(Boolean).join(" · ")}</p>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => requestDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Education</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Institution *</Label><Input value={form.institution} onChange={(e) => setForm(f => ({ ...f, institution: e.target.value }))} placeholder="e.g. NYU Tisch School of the Arts" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Degree / Certificate</Label><Input value={form.degree_or_certificate} onChange={(e) => setForm(f => ({ ...f, degree_or_certificate: e.target.value }))} placeholder="e.g. MFA" /></div>
              <div><Label>Field of Study</Label><Input value={form.field_of_study} onChange={(e) => setForm(f => ({ ...f, field_of_study: e.target.value }))} placeholder="e.g. Dramatic Writing" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Year Start</Label><Input value={form.year_start} onChange={(e) => setForm(f => ({ ...f, year_start: e.target.value }))} type="number" placeholder="2018" /></div>
              <div><Label>Year End</Label><Input value={form.year_end} onChange={(e) => setForm(f => ({ ...f, year_end: e.target.value }))} type="number" placeholder="2020" disabled={form.is_ongoing} /></div>
            </div>
            <div className="flex items-center justify-between"><Label>Currently Attending</Label><Switch checked={form.is_ongoing} onCheckedChange={(v) => setForm(f => ({ ...f, is_ongoing: v }))} /></div>
            <div><Label>Teacher / Mentor</Label><Input value={form.teacher_name} onChange={(e) => setForm(f => ({ ...f, teacher_name: e.target.value }))} placeholder="e.g. David Mamet" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Notable achievements, coursework, etc." /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.institution.trim()}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog />
    </div>
  );
};

export default EducationManager;
