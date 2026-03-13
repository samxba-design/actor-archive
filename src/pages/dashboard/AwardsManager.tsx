import { useEffect, useState, useCallback } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Pencil, Trash2, Trophy } from "lucide-react";
import { getTypeAwareLabels } from "@/lib/typeAwareLabels";
import { useProfileTypeContext } from "@/contexts/ProfileTypeContext";

interface Award {
  id: string;
  name: string;
  organization: string | null;
  category: string | null;
  year: number | null;
  result: string | null;
  display_order: number | null;
}

const AwardsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { profileType } = useProfileTypeContext();
  const labels = getTypeAwareLabels(profileType);
  const [items, setItems] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Award | null>(null);
  const [form, setForm] = useState({ name: "", organization: "", category: "", year: "", result: "nominated" });
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    if (!user) return;
    const { data } = await supabase.from("awards").select("*").eq("profile_id", user.id).order("display_order");
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [user]);

  const openAdd = () => { setEditing(null); setForm({ name: "", organization: "", category: "", year: "", result: "nominated" }); setDialogOpen(true); };
  const openEdit = (item: Award) => { setEditing(item); setForm({ name: item.name, organization: item.organization || "", category: item.category || "", year: item.year?.toString() || "", result: item.result || "nominated" }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!user || !form.name.trim()) return;
    setSaving(true);
    const payload = { profile_id: user.id, name: form.name.trim(), organization: form.organization || null, category: form.category || null, year: form.year ? parseInt(form.year) : null, result: form.result || null };
    const { error } = editing ? await supabase.from("awards").update(payload).eq("id", editing.id) : await supabase.from("awards").insert(payload);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Updated" : "Added" }); setDialogOpen(false); fetchItems(); }
    setSaving(false);
  };

  const performDelete = useCallback(async (id: string) => { await supabase.from("awards").delete().eq("id", id); fetchItems(); }, [user]);
  const { requestDelete, DeleteConfirmDialog } = useDeleteConfirmation(performDelete, { title: "Delete this award?", description: "This award will be permanently removed from your portfolio." });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={labels.awardsTitle}
          description={labels.awardsDescription}
        />
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Award</Button>
      </div>
      {items.length === 0 ? (
        <EmptyState icon={Trophy} title="No awards yet" description="Add festival selections, competition wins, or fellowships to build credibility with visitors." actionLabel="Add Award" onAction={openAdd} />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}><CardContent className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Trophy className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <span className="font-medium text-foreground">{item.name}</span>
                  <p className="text-sm text-muted-foreground">{[item.organization, item.category, item.year, item.result?.charAt(0).toUpperCase()! + item.result?.slice(1)].filter(Boolean).join(" · ")}</p>
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
          <DialogHeader><DialogTitle>{editing ? "Edit Award" : "Add Award"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Award Name *</Label><Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Best Screenplay" /></div>
            <div><Label>Organization</Label><Input value={form.organization} onChange={(e) => setForm(f => ({ ...f, organization: e.target.value }))} placeholder="e.g. Sundance Film Festival" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Short Film" /></div>
              <div><Label>Year</Label><Input value={form.year} onChange={(e) => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2024" type="number" /></div>
            </div>
            <div><Label>Result</Label>
              <Select value={form.result} onValueChange={(v) => setForm(f => ({ ...f, result: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="nominated">Nominated</SelectItem>
                  <SelectItem value="finalist">Finalist</SelectItem>
                  <SelectItem value="semi-finalist">Semi-Finalist</SelectItem>
                  <SelectItem value="official_selection">Official Selection</SelectItem>
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

export default AwardsManager;
