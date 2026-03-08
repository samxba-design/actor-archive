import { useEffect, useState } from "react";
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
import { Loader2, Plus, Pencil, Trash2, CalendarDays } from "lucide-react";

interface Event {
  id: string;
  title: string;
  event_type: string | null;
  venue: string | null;
  city: string | null;
  country: string | null;
  date: string | null;
  end_date: string | null;
  ticket_url: string | null;
  description: string | null;
  is_upcoming: boolean | null;
  display_order: number | null;
}

const EventsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState({ title: "", event_type: "", venue: "", city: "", country: "", date: "", end_date: "", ticket_url: "", description: "", is_upcoming: true });
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    if (!user) return;
    const { data } = await supabase.from("events").select("*").eq("profile_id", user.id).order("date", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [user]);

  const openAdd = () => { setEditing(null); setForm({ title: "", event_type: "", venue: "", city: "", country: "", date: "", end_date: "", ticket_url: "", description: "", is_upcoming: true }); setDialogOpen(true); };
  const openEdit = (item: Event) => { setEditing(item); setForm({ title: item.title, event_type: item.event_type || "", venue: item.venue || "", city: item.city || "", country: item.country || "", date: item.date || "", end_date: item.end_date || "", ticket_url: item.ticket_url || "", description: item.description || "", is_upcoming: item.is_upcoming ?? true }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!user || !form.title.trim()) return;
    setSaving(true);
    const payload = { profile_id: user.id, title: form.title.trim(), event_type: form.event_type || null, venue: form.venue || null, city: form.city || null, country: form.country || null, date: form.date || null, end_date: form.end_date || null, ticket_url: form.ticket_url || null, description: form.description || null, is_upcoming: form.is_upcoming };
    const { error } = editing ? await supabase.from("events").update(payload).eq("id", editing.id) : await supabase.from("events").insert(payload);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Updated" : "Added" }); setDialogOpen(false); fetchItems(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => { await supabase.from("events").delete().eq("id", id); fetchItems(); };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Events"
          description="List upcoming screenings, performances, festivals, or appearances. Upcoming events show a badge on your portfolio."
        />
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Event</Button>
      </div>
      {items.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No events yet" description="Add screenings, premieres, or speaking engagements to keep your portfolio current." actionLabel="Add Event" onAction={openAdd} />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}><CardContent className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <CalendarDays className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{item.title}</span>
                    {item.is_upcoming && <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">Upcoming</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{[item.venue, item.city, item.date].filter(Boolean).join(" · ")}</p>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Event</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. World Premiere" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Event Type</Label><Input value={form.event_type} onChange={(e) => setForm(f => ({ ...f, event_type: e.target.value }))} placeholder="e.g. Screening, Reading" /></div>
              <div><Label>Venue</Label><Input value={form.venue} onChange={(e) => setForm(f => ({ ...f, venue: e.target.value }))} placeholder="e.g. Lincoln Center" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))} placeholder="New York" /></div>
              <div><Label>Country</Label><Input value={form.country} onChange={(e) => setForm(f => ({ ...f, country: e.target.value }))} placeholder="USA" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Date</Label><Input value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} type="date" /></div>
              <div><Label>End Date</Label><Input value={form.end_date} onChange={(e) => setForm(f => ({ ...f, end_date: e.target.value }))} type="date" /></div>
            </div>
            <div><Label>Ticket URL</Label><Input value={form.ticket_url} onChange={(e) => setForm(f => ({ ...f, ticket_url: e.target.value }))} placeholder="https://..." /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div className="flex items-center justify-between"><Label>Upcoming Event</Label><Switch checked={form.is_upcoming} onCheckedChange={(v) => setForm(f => ({ ...f, is_upcoming: v }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.title.trim()}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsManager;
