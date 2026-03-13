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
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";
import { ServiceDescriptionAI } from "@/components/dashboard/ServiceDescriptionAI";
import { getTypeAwareLabels } from "@/lib/typeAwareLabels";
import { useProfileTypeContext } from "@/contexts/ProfileTypeContext";
import ManagerHelpBanner from "@/components/dashboard/ManagerHelpBanner";

interface Service {
  id: string;
  name: string;
  description: string | null;
  starting_price: string | null;
  currency: string | null;
  turnaround: string | null;
  deliverables: string[] | null;
  is_featured: boolean | null;
  display_order: number | null;
}

const EMPTY: Omit<Service, "id"> = {
  name: "",
  description: null,
  starting_price: null,
  currency: "USD",
  turnaround: null,
  deliverables: null,
  is_featured: false,
  display_order: 0,
};

const ServicesManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { profileType } = useProfileTypeContext();
  const labels = getTypeAwareLabels(profileType);
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deliverablesText, setDeliverablesText] = useState("");

  const fetch = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("profile_id", user.id)
      .order("display_order");
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [user]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setDeliverablesText("");
    setDialogOpen(true);
  };

  const openEdit = (item: Service) => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      starting_price: item.starting_price,
      currency: item.currency || "USD",
      turnaround: item.turnaround,
      deliverables: item.deliverables,
      is_featured: item.is_featured,
      display_order: item.display_order,
    });
    setDeliverablesText((item.deliverables || []).join("\n"));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user || !form.name.trim()) return;
    setSaving(true);
    const deliverables = deliverablesText.split("\n").map(s => s.trim()).filter(Boolean);
    const payload = {
      profile_id: user.id,
      name: form.name.trim(),
      description: form.description || null,
      starting_price: form.starting_price || null,
      currency: form.currency || "USD",
      turnaround: form.turnaround || null,
      deliverables: deliverables.length > 0 ? deliverables : null,
      is_featured: form.is_featured || false,
      display_order: form.display_order || 0,
    };

    const { error } = editing
      ? await supabase.from("services").update(payload).eq("id", editing.id)
      : await supabase.from("services").insert(payload);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editing ? "Updated" : "Added" });
      setDialogOpen(false);
      fetch();
    }
    setSaving(false);
  };

  const performDelete = useCallback(async (id: string) => {
    await supabase.from("services").delete().eq("id", id);
    fetch();
  }, [user]);
  const { requestDelete, DeleteConfirmDialog } = useDeleteConfirmation(performDelete, { title: "Delete this service?", description: "This service will be permanently removed." });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={labels.servicesTitle}
          description={labels.servicesDescription}
        />
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Service</Button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Star} title="No services yet" description="Add your first service to let visitors know what you offer and how to hire you." actionLabel="Add Service" onAction={openAdd} />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{item.name}</span>
                    {item.is_featured && <Star className="h-3.5 w-3.5 text-primary fill-primary" />}
                  </div>
                  {item.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>}
                  <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                    {item.starting_price && <span>From {item.currency === "USD" ? "$" : item.currency}{item.starting_price}</span>}
                    {item.turnaround && <span>• {item.turnaround}</span>}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => requestDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Service" : "Add Service"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Script Coverage" /></div>
            <div>
              <div className="flex items-center justify-between">
                <Label>Description</Label>
                <ServiceDescriptionAI
                  serviceName={form.name}
                  currentDescription={form.description || undefined}
                  onApply={(result) => {
                    setForm(f => ({
                      ...f,
                      description: result.description,
                      turnaround: result.turnaround || f.turnaround,
                    }));
                    if (result.deliverables.length > 0) {
                      setDeliverablesText(result.deliverables.join("\n"));
                    }
                  }}
                />
              </div>
              <Textarea value={form.description || ""} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What does this service include?" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Starting Price</Label><Input value={form.starting_price || ""} onChange={(e) => setForm(f => ({ ...f, starting_price: e.target.value }))} placeholder="e.g. 150" /></div>
              <div><Label>Turnaround</Label><Input value={form.turnaround || ""} onChange={(e) => setForm(f => ({ ...f, turnaround: e.target.value }))} placeholder="e.g. 3-5 days" /></div>
            </div>
            <div><Label>Deliverables (one per line)</Label><Textarea value={deliverablesText} onChange={(e) => setDeliverablesText(e.target.value)} placeholder="Written report\nDetailed notes\nFollow-up call" rows={3} /></div>
            <div className="flex items-center justify-between">
              <Label>Featured Service</Label>
              <Switch checked={form.is_featured || false} onCheckedChange={(v) => setForm(f => ({ ...f, is_featured: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim()}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog />
    </div>
  );
};

export default ServicesManager;
