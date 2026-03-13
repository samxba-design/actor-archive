import { useEffect, useState, useCallback } from "react";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Pencil, Trash2, Users } from "lucide-react";
import ManagerHelpBanner from "@/components/dashboard/ManagerHelpBanner";

interface Rep {
  id: string;
  rep_type: string;
  name: string | null;
  company: string | null;
  department: string | null;
  email: string | null;
  phone: string | null;
  market: string | null;
  is_primary: boolean | null;
  display_order: number | null;
}

const RepresentationManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<Rep[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Rep | null>(null);
  const [form, setForm] = useState({ rep_type: "agent", name: "", company: "", department: "", email: "", phone: "", market: "", is_primary: false });
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    if (!user) return;
    const { data } = await supabase.from("representation").select("*").eq("profile_id", user.id).order("display_order");
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [user]);

  const openAdd = () => { setEditing(null); setForm({ rep_type: "agent", name: "", company: "", department: "", email: "", phone: "", market: "", is_primary: false }); setDialogOpen(true); };
  const openEdit = (item: Rep) => { setEditing(item); setForm({ rep_type: item.rep_type, name: item.name || "", company: item.company || "", department: item.department || "", email: item.email || "", phone: item.phone || "", market: item.market || "", is_primary: item.is_primary || false }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!user || !form.rep_type) return;
    setSaving(true);
    const payload = { profile_id: user.id, rep_type: form.rep_type, name: form.name || null, company: form.company || null, department: form.department || null, email: form.email || null, phone: form.phone || null, market: form.market || null, is_primary: form.is_primary };
    const { error } = editing ? await supabase.from("representation").update(payload).eq("id", editing.id) : await supabase.from("representation").insert(payload);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Updated" : "Added" }); setDialogOpen(false); fetchItems(); }
    setSaving(false);
  };

  const performDelete = useCallback(async (id: string) => { await supabase.from("representation").delete().eq("id", id); fetchItems(); }, [user]);
  const { requestDelete, DeleteConfirmDialog } = useDeleteConfirmation(performDelete, { title: "Remove this representative?", description: "This representative will be permanently removed." });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Representation</h1>
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Rep</Button>
      </div>
      {items.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No representation listed yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}><CardContent className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Users className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground capitalize">{item.rep_type}</span>
                    {item.is_primary && <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">Primary</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{[item.name, item.company, item.market].filter(Boolean).join(" · ")}</p>
                  {item.email && <p className="text-sm text-muted-foreground">{item.email}</p>}
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
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Representation</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Type *</Label>
              <Select value={form.rep_type} onValueChange={(v) => setForm(f => ({ ...f, rep_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="lawyer">Lawyer</SelectItem>
                  <SelectItem value="publicist">Publicist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. John Smith" /></div>
              <div><Label>Company</Label><Input value={form.company} onChange={(e) => setForm(f => ({ ...f, company: e.target.value }))} placeholder="e.g. CAA" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Department</Label><Input value={form.department} onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))} placeholder="e.g. Literary" /></div>
              <div><Label>Market</Label><Input value={form.market} onChange={(e) => setForm(f => ({ ...f, market: e.target.value }))} placeholder="e.g. LA, London" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="agent@agency.com" /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555 0123" /></div>
            </div>
            <div className="flex items-center justify-between"><Label>Primary Rep</Label><Switch checked={form.is_primary} onCheckedChange={(v) => setForm(f => ({ ...f, is_primary: v }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog />
    </div>
  );
};

export default RepresentationManager;
