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
import { Loader2, Plus, Pencil, Trash2, Newspaper } from "lucide-react";
import { getTypeAwareLabels } from "@/lib/typeAwareLabels";
import { useProfileTypeContext } from "@/contexts/ProfileTypeContext";
import ManagerHelpBanner from "@/components/dashboard/ManagerHelpBanner";

interface Press {
  id: string;
  title: string;
  publication: string | null;
  date: string | null;
  article_url: string | null;
  pull_quote: string | null;
  excerpt: string | null;
  star_rating: number | null;
  is_featured: boolean | null;
  display_order: number | null;
}

const PressManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { profileType, slug } = useProfileTypeContext();
  const labels = getTypeAwareLabels(profileType);
  const [items, setItems] = useState<Press[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Press | null>(null);
  const [form, setForm] = useState({ title: "", publication: "", date: "", article_url: "", pull_quote: "", excerpt: "", star_rating: "", is_featured: false, project_id: "" });
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);

  const fetchItems = async () => {
    if (!user) return;
    const { data } = await supabase.from("press").select("*").eq("profile_id", user.id).order("display_order");
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [user]);

  const openAdd = () => { setEditing(null); setForm({ title: "", publication: "", date: "", article_url: "", pull_quote: "", excerpt: "", star_rating: "", is_featured: false }); setDialogOpen(true); };
  const openEdit = (item: Press) => { setEditing(item); setForm({ title: item.title, publication: item.publication || "", date: item.date || "", article_url: item.article_url || "", pull_quote: item.pull_quote || "", excerpt: item.excerpt || "", star_rating: item.star_rating?.toString() || "", is_featured: item.is_featured || false }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!user || !form.title.trim()) return;
    setSaving(true);
    const payload = { profile_id: user.id, title: form.title.trim(), publication: form.publication || null, date: form.date || null, article_url: form.article_url || null, pull_quote: form.pull_quote || null, excerpt: form.excerpt || null, star_rating: form.star_rating ? parseInt(form.star_rating) : null, is_featured: form.is_featured };
    const { error } = editing ? await supabase.from("press").update(payload).eq("id", editing.id) : await supabase.from("press").insert(payload);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Updated" : "Added" }); setDialogOpen(false); fetchItems(); }
    setSaving(false);
  };

  const performDelete = useCallback(async (id: string) => { await supabase.from("press").delete().eq("id", id); fetchItems(); }, [user]);
  const { requestDelete, DeleteConfirmDialog } = useDeleteConfirmation(performDelete, { title: "Delete this press entry?", description: "This press item will be permanently removed." });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={labels.pressTitle}
          description={labels.pressDescription}
        />
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Press</Button>
      </div>
      <ManagerHelpBanner id="press" title="Press items show in your Press section" description="Add reviews, interviews, and media mentions. You can hide this section in Settings." learnMoreRoute="/dashboard/settings" previewText="Shown as cards with publication logos, star ratings, and pull quotes" demoUrl="/demo/screenwriter" />
      {items.length === 0 ? (
        <EmptyState icon={Newspaper} title="No press entries yet" description="Add reviews, interviews, or media coverage to show visitors your public profile and credibility." actionLabel="Add Press" onAction={openAdd} />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}><CardContent className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Newspaper className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <span className="font-medium text-foreground">{item.title}</span>
                  <p className="text-sm text-muted-foreground">{[item.publication, item.date].filter(Boolean).join(" · ")}</p>
                  {item.pull_quote && <p className="text-sm italic text-muted-foreground mt-1">"{item.pull_quote}"</p>}
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
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Press</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Review: My Film" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Publication</Label><Input value={form.publication} onChange={(e) => setForm(f => ({ ...f, publication: e.target.value }))} placeholder="e.g. Variety" /></div>
              <div><Label>Date</Label><Input value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} type="date" /></div>
            </div>
            <div><Label>Article URL</Label><Input value={form.article_url} onChange={(e) => setForm(f => ({ ...f, article_url: e.target.value }))} placeholder="https://..." /></div>
            <div><Label>Pull Quote</Label><Input value={form.pull_quote} onChange={(e) => setForm(f => ({ ...f, pull_quote: e.target.value }))} placeholder="A standout quote from the review" /></div>
            <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Brief excerpt from the article" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Star Rating (1-5)</Label><Input value={form.star_rating} onChange={(e) => setForm(f => ({ ...f, star_rating: e.target.value }))} type="number" min="1" max="5" /></div>
              <div className="flex items-center justify-between pt-6"><Label>Featured</Label><Switch checked={form.is_featured} onCheckedChange={(v) => setForm(f => ({ ...f, is_featured: v }))} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.title.trim()}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog />
    </div>
  );
};

export default PressManager;
