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
import ManagerErrorState from "@/components/dashboard/ManagerErrorState";
import ManagerHelpBanner from "@/components/dashboard/ManagerHelpBanner";

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
  const { profileType, slug } = useProfileTypeContext();
  const labels = getTypeAwareLabels(profileType);
  const [items, setItems] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Award | null>(null);
  const [form, setForm] = useState({ name: "", organization: "", category: "", year: "", result: "nominated", project_id: "" });
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);

  const fetchItems = async () => {
    if (!user) return;
    setError(null);
    const { data, error: fetchError } = await supabase.from("awards").select("*").eq("profile_id", user.id).order("display_order");
    if (fetchError) setError(fetchError.message);
    else setItems(data || []);
    setLoading(false);
  };

  const fetchProjects = async () => {
    if (!user) return;
    const { data } = await supabase.from("projects").select("id, title").eq("profile_id", user.id).order("title");
    setProjects(data || []);
  };

  useEffect(() => { fetchItems(); fetchProjects(); }, [user]);

  const openAdd = () => { setEditing(null); setForm({ name: "", organization: "", category: "", year: "", result: "nominated", project_id: "" }); setDialogOpen(true); };
  const openEdit = (item: Award) => { setEditing(item); setForm({ name: item.name, organization: item.organization || "", category: item.category || "", year: item.year?.toString() || "", result: item.result || "nominated", project_id: (item as any).project_id || "" }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!user || !form.name.trim()) return;
    setSaving(true);
    const payload = { profile_id: user.id, name: form.name.trim(), organization: form.organization || null, category: form.category || null, year: form.year ? parseInt(form.year) : null, result: form.result || null, project_id: form.project_id || null };
    const { error } = editing ? await supabase.from("awards").update(payload).eq("id", editing.id) : await supabase.from("awards").insert(payload);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Updated" : "Added" }); setDialogOpen(false); fetchItems(); }
    setSaving(false);
  };

  const performDelete = useCallback(async (id: string) => {
    const item = items.find(i => i.id === id);
    const { error } = await supabase.from("awards").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Award deleted",
      description: "This action can be undone.",
      action: (
        <button
          className="text-xs font-semibold text-primary hover:underline px-2 py-1"
          onClick={async () => {
            if (item) await supabase.from("awards").insert(item as any);
            fetchItems();
          }}
        >
          Undo
        </button>
      ),
    });
    fetchItems();
  }, [user, items]);
  const { requestDelete, DeleteConfirmDialog } = useDeleteConfirmation(performDelete, { title: "Delete this award?", description: "This award will be permanently removed from your portfolio." });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  if (error) return <div className="max-w-3xl"><ManagerErrorState message={`Could not load awards: ${error}`} onRetry={fetchItems} /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={labels.awardsTitle}
          description={labels.awardsDescription}
        />
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Award</Button>
      </div>
      <ManagerHelpBanner id="awards" title="Awards display in your Awards section" description="Add festival selections, wins, and nominations. You can link each award to a project." learnMoreRoute="/dashboard/settings" previewText="Displayed as laurel badges with year, category, and result" demoUrl="/demo/screenwriter" portfolioSlug={slug || undefined} />
      {items.length === 0 ? (
        <EmptyState icon={Trophy} title="No awards yet" description="Add festival selections, competition wins, or fellowships to build credibility with visitors." actionLabel="Add Award" onAction={openAdd} profileType={profileType} />
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
            <div>
              <Label>Link to Project</Label>
              <Select value={form.project_id} onValueChange={(v) => setForm(f => ({ ...f, project_id: v === "none" ? "" : v }))}>
                <SelectTrigger><SelectValue placeholder="None (optional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Link to a project to show them together on your portfolio</p>
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
