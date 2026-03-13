import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Globe, ExternalLink } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import ManagerHelpBanner from "@/components/dashboard/ManagerHelpBanner";

type SocialLink = Tables<"social_links">;

const PLATFORMS = [
  "IMDb", "Instagram", "Twitter/X", "LinkedIn", "YouTube", "Vimeo",
  "TikTok", "Spotlight", "Backstage", "Website", "Letterboxd", "Threads", "Other"
];

const SocialLinksManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ platform: "IMDb", url: "", label: "" });

  const fetchLinks = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("social_links")
      .select("*")
      .eq("profile_id", user.id)
      .order("display_order", { ascending: true });
    setLinks(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLinks(); }, [user]);

  const resetForm = () => { setForm({ platform: "IMDb", url: "", label: "" }); setEditing(null); };

  const openEdit = (l: SocialLink) => {
    setEditing(l);
    setForm({ platform: l.platform, url: l.url, label: l.label || "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user || !form.url.trim()) return;
    setSaving(true);
    const payload = {
      profile_id: user.id,
      platform: form.platform,
      url: form.url,
      label: form.label || null,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from("social_links").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("social_links").insert({ ...payload, display_order: links.length }));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editing ? "Updated" : "Added", description: `${form.platform} link saved.` });
      setDialogOpen(false);
      resetForm();
      fetchLinks();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (!error) fetchLinks();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Social Links</h1>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
      </div>
      <ManagerHelpBanner id="social-links" title="Links appear as icons on your portfolio" description="Add your IMDb, Instagram, website, and other profiles. They show on your public page." learnMoreRoute="/dashboard/settings" />
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Link</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Link" : "New Link"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Platform</Label>
                <Select value={form.platform} onValueChange={(v) => setForm((f) => ({ ...f, platform: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>URL *</Label><Input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="https://..." /></div>
              <div><Label>Display Label</Label><Input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="Optional custom label" /></div>
              <Button onClick={handleSave} disabled={saving || !form.url.trim()} className="w-full">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Update" : "Add"} Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {links.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No social links yet. Add your IMDb, Instagram, or website.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {links.map((l) => (
            <Card key={l.id} className="group">
              <CardContent className="flex items-center gap-3 py-3">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{l.label || l.platform}</p>
                  <p className="text-xs text-muted-foreground truncate">{l.url}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => window.open(l.url, "_blank")}><ExternalLink className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(l)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialLinksManager;
