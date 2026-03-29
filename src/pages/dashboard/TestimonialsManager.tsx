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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Quote, Copy, Link2 } from "lucide-react";
import { getTypeAwareLabels } from "@/lib/typeAwareLabels";
import { useProfileTypeContext } from "@/contexts/ProfileTypeContext";
import ManagerErrorState from "@/components/dashboard/ManagerErrorState";
import ManagerHelpBanner from "@/components/dashboard/ManagerHelpBanner";

interface Testimonial {
  id: string;
  author_name: string;
  author_role: string | null;
  author_company: string | null;
  quote: string;
  is_featured: boolean | null;
  display_order: number | null;
}

const TestimonialsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { profileType, slug } = useProfileTypeContext();
  const labels = getTypeAwareLabels(profileType);
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ author_name: "", author_role: "", author_company: "", quote: "", is_featured: false });
  const [saving, setSaving] = useState(false);
  const [requestSlug, setRequestSlug] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchItems = async () => {
    if (!user) return;
    setError(null);
    const { data, error: fetchError } = await supabase.from("testimonials").select("*").eq("profile_id", user.id).order("display_order");
    if (fetchError) setError(fetchError.message);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [user]);

  // Load slug for request link
  useEffect(() => {
    if (!user) return;
    if (slug) {
      setRequestSlug(slug);
      return;
    }
    supabase.from("profiles").select("slug").eq("id", user.id).single().then(({ data }) => {
      if (data?.slug) setRequestSlug(data.slug);
    });
  }, [user, slug]);

  const openAdd = () => { setEditing(null); setForm({ author_name: "", author_role: "", author_company: "", quote: "", is_featured: false }); setDialogOpen(true); };
  const openEdit = (item: Testimonial) => { setEditing(item); setForm({ author_name: item.author_name, author_role: item.author_role || "", author_company: item.author_company || "", quote: item.quote, is_featured: item.is_featured || false }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!user || !form.author_name.trim() || !form.quote.trim()) return;
    setSaving(true);
    const payload = { profile_id: user.id, author_name: form.author_name.trim(), author_role: form.author_role || null, author_company: form.author_company || null, quote: form.quote.trim(), is_featured: form.is_featured };
    const { error } = editing ? await supabase.from("testimonials").update(payload).eq("id", editing.id) : await supabase.from("testimonials").insert(payload);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Updated" : "Added" }); setDialogOpen(false); fetchItems(); }
    setSaving(false);
  };

  const performDelete = useCallback(async (id: string) => {
    const item = items.find(i => i.id === id);
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    // Show undo toast
    toast({
      title: "Testimonial deleted",
      description: "This action can be undone.",
      action: (
        <button
          className="text-xs font-semibold text-primary hover:underline px-2 py-1"
          onClick={async () => {
            if (item) await supabase.from("testimonials").insert(item as any);
            fetchItems();
          }}
        >
          Undo
        </button>
      ),
    });
    fetchItems();
  }, [user, items]);
  const { requestDelete, DeleteConfirmDialog } = useDeleteConfirmation(performDelete, { title: "Delete this testimonial?", description: "This testimonial will be permanently removed." });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  if (error) return <div className="max-w-3xl"><ManagerErrorState message={`Could not load testimonials: ${error}`} onRetry={fetchItems} /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={labels.testimonialsTitle}
          description={labels.testimonialsDescription}
        />
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Testimonial</Button>
      </div>
      <ManagerHelpBanner id="testimonials" title="Quotes show in your Testimonials section" description="Add endorsements from collaborators or clients. You can hide this section in Settings." learnMoreRoute="/dashboard/settings" previewText="Displayed as styled quote cards with author photo, name, and role" demoUrl="/demo/copywriter" portfolioSlug={slug || undefined} />

      {/* Request Testimonials Card */}
      {requestSlug && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Request Testimonials
            </CardTitle>
            <CardDescription>Share this link with colleagues and collaborators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={`${window.location.origin}/t/${requestSlug}`}
                className="font-mono text-xs"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/t/${requestSlug}`);
                  setCopiedLink(true);
                  toast({ title: "Copied!", description: "Testimonial request link copied to clipboard." });
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
              >
                {copiedLink ? <span className="text-green-500">✓ Copied</span> : <><Copy className="h-3.5 w-3.5 mr-1.5" />Copy</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {items.length === 0 ? (
        <EmptyState icon={Quote} title="No testimonials yet" description="Ask a collaborator or client for a short quote about working with you. Even one testimonial significantly boosts trust." actionLabel="Add Testimonial" onAction={openAdd} profileType={profileType} />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}><CardContent className="py-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Quote className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm italic text-foreground line-clamp-2">"{item.quote}"</p>
                  <p className="text-sm text-muted-foreground mt-1">— {item.author_name}{item.author_role ? `, ${item.author_role}` : ""}{item.author_company ? ` at ${item.author_company}` : ""}</p>
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
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Testimonial</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Quote *</Label><Textarea value={form.quote} onChange={(e) => setForm(f => ({ ...f, quote: e.target.value }))} placeholder="What they said about working with you..." rows={4} /></div>
            <div><Label>Author Name *</Label><Input value={form.author_name} onChange={(e) => setForm(f => ({ ...f, author_name: e.target.value }))} placeholder="e.g. Jane Smith" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Role / Title</Label><Input value={form.author_role} onChange={(e) => setForm(f => ({ ...f, author_role: e.target.value }))} placeholder="e.g. Executive Producer" /></div>
              <div><Label>Company</Label><Input value={form.author_company} onChange={(e) => setForm(f => ({ ...f, author_company: e.target.value }))} placeholder="e.g. HBO" /></div>
            </div>
            <div className="flex items-center justify-between"><Label>Featured</Label><Switch checked={form.is_featured} onCheckedChange={(v) => setForm(f => ({ ...f, is_featured: v }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.author_name.trim() || !form.quote.trim()}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog />
    </div>
  );
};

export default TestimonialsManager;
