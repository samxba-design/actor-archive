import { useEffect, useState, useCallback } from "react";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Pencil, Trash2, Zap } from "lucide-react";
import { useAuth as useAuthHook } from "@/hooks/useAuth";
import { getTypeAwareLabels } from "@/lib/typeAwareLabels";
import { useProfileTypeContext } from "@/contexts/ProfileTypeContext";

interface Skill {
  id: string;
  name: string;
  category: string | null;
  proficiency: string | null;
  display_order: number | null;
}

const COPYWRITER_CATEGORIES = [
  "Content Strategy", "Paid Ads", "Email Marketing", "SEO", "UX Writing",
  "Brand Voice", "Social Media", "Technical Writing", "Leadership Speeches",
  "Crisis Communications", "Thought Leadership", "Product Marketing",
];

const SkillsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { profileType } = useProfileTypeContext();
  const labels = getTypeAwareLabels(profileType);
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState({ name: "", category: "", proficiency: "proficient" });
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    if (!user) return;
    const { data } = await supabase.from("skills").select("*").eq("profile_id", user.id).order("display_order");
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [user]);

  const openAdd = () => { setEditing(null); setForm({ name: "", category: "", proficiency: "proficient" }); setDialogOpen(true); };
  const openEdit = (item: Skill) => { setEditing(item); setForm({ name: item.name, category: item.category || "", proficiency: item.proficiency || "proficient" }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!user || !form.name.trim()) return;
    setSaving(true);
    const payload = { profile_id: user.id, name: form.name.trim(), category: form.category || null, proficiency: form.proficiency || null };
    const { error } = editing ? await supabase.from("skills").update(payload).eq("id", editing.id) : await supabase.from("skills").insert(payload);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Updated" : "Added" }); setDialogOpen(false); fetchItems(); }
    setSaving(false);
  };

  const performDelete = useCallback(async (id: string) => { await supabase.from("skills").delete().eq("id", id); fetchItems(); }, [user]);
  const { requestDelete, DeleteConfirmDialog } = useDeleteConfirmation(performDelete, { title: "Delete this skill?", description: "This skill will be permanently removed." });

  // Group by category
  const grouped = items.reduce((acc, item) => {
    const cat = item.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={labels.skillsTitle}
          description={labels.skillsDescription}
        />
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Skill</Button>
      </div>
      {items.length === 0 ? (
        <EmptyState icon={Zap} title="No skills yet" description="Add your key abilities — software, languages, instruments, combat training, etc. Group by category for a polished look." actionLabel="Add Skill" onAction={openAdd} />
      ) : (
        Object.entries(grouped).map(([cat, skills]) => (
          <div key={cat} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{cat}</h3>
            <div className="space-y-2">
              {skills.map((item) => (
                <Card key={item.id}><CardContent className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Zap className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-medium text-foreground">{item.name}</span>
                    {item.proficiency && <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">{item.proficiency}</span>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => requestDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          </div>
        ))
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Skill</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Skill Name *</Label><Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Final Draft" /></div>
            <div><Label>Category</Label>
              <Input value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Software, Languages, Genres" />
              {profileType === "copywriter" && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {COPYWRITER_CATEGORIES.filter(c => c !== form.category).slice(0, 6).map(cat => (
                    <button key={cat} type="button" onClick={() => setForm(f => ({ ...f, category: cat }))}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div><Label>Proficiency</Label>
              <Select value={form.proficiency} onValueChange={(v) => setForm(f => ({ ...f, proficiency: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="proficient">Proficient</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim()}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog />
    </div>
  );
};

export default SkillsManager;
