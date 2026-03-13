import { useEffect, useState, useRef } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Upload, FolderOpen, GripVertical, Image, FileText } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";
import ManagerHelpBanner from "@/components/dashboard/ManagerHelpBanner";
import { useProfileTypeContext } from "@/contexts/ProfileTypeContext";

interface WorkCollection {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  display_order: number | null;
  is_expanded_default: boolean | null;
  created_at: string | null;
  piece_count?: number;
}

const CollectionsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { slug } = useProfileTypeContext();
  const [items, setItems] = useState<WorkCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WorkCollection | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    cover_image_url: "",
    is_expanded_default: false,
  });

  const fetchItems = async () => {
    if (!user) return;
    // Fetch collections with piece count
    const { data: collections } = await supabase
      .from("work_collections")
      .select("*")
      .eq("profile_id", user.id)
      .order("display_order", { ascending: true });

    if (collections) {
      // Get counts per collection
      const { data: works } = await supabase
        .from("published_works")
        .select("collection_id")
        .eq("profile_id", user.id)
        .not("collection_id", "is", null);

      const countMap: Record<string, number> = {};
      works?.forEach((w: any) => {
        if (w.collection_id) countMap[w.collection_id] = (countMap[w.collection_id] || 0) + 1;
      });

      setItems(collections.map((c: any) => ({ ...c, piece_count: countMap[c.id] || 0 })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [user]);

  const resetForm = () => {
    setForm({ name: "", description: "", cover_image_url: "", is_expanded_default: false });
    setEditing(null);
  };

  const openEdit = (item: WorkCollection) => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description || "",
      cover_image_url: item.cover_image_url || "",
      is_expanded_default: item.is_expanded_default || false,
    });
    setDialogOpen(true);
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingCover(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/collection-covers/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("thumbnails").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploadingCover(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("thumbnails").getPublicUrl(path);
    setForm((f) => ({ ...f, cover_image_url: urlData.publicUrl }));
    toast({ title: "Cover image uploaded" });
    setUploadingCover(false);
  };

  const handleSave = async () => {
    if (!user || !form.name.trim()) return;
    setSaving(true);

    const payload = {
      profile_id: user.id,
      name: form.name.trim(),
      description: form.description || null,
      cover_image_url: form.cover_image_url || null,
      is_expanded_default: form.is_expanded_default,
    };

    if (editing) {
      const { error } = await supabase.from("work_collections").update(payload).eq("id", editing.id);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Collection updated" });
    } else {
      const { error } = await supabase.from("work_collections").insert({ ...payload, display_order: items.length });
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Collection created" });
    }

    setSaving(false);
    setDialogOpen(false);
    resetForm();
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("work_collections").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Collection deleted" }); fetchItems(); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work Collections"
        description="Organize your published work into named folders — like &ldquo;Crypto Scripts&rdquo;, &ldquo;Email Campaigns&rdquo;, or &ldquo;SaaS Landing Pages&rdquo;."
      />
      <ManagerHelpBanner
        id="work-collections"
        title="Collections group your published work into browsable folders"
        description="Visitors can browse by collection on your portfolio. Create as many as you need and name them however you like."
        learnMoreRoute="/dashboard/published-work"
        previewText="Displayed as visual folder cards with cover images and piece counts"
        portfolioSlug={slug || undefined}
      />

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Collection
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "Create"} Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Crypto & Web3 Scripts" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of this collection..." rows={2} />
            </div>
            <div>
              <Label>Cover Image</Label>
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadCover} />
              <div className="flex items-center gap-2 mt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => coverInputRef.current?.click()} disabled={uploadingCover}>
                  {uploadingCover ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Image className="h-3 w-3 mr-1" />}
                  Upload Cover
                </Button>
                {form.cover_image_url && (
                  <img src={form.cover_image_url} alt="" className="h-10 w-10 rounded object-cover" />
                )}
              </div>
              <Input value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} placeholder="Or paste image URL" className="mt-1.5" />
            </div>
            <Button onClick={handleSave} disabled={saving || !form.name.trim()} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editing ? "Update" : "Create"} Collection
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {items.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No collections yet"
          description="Create collections to organize your published work into browsable folders on your portfolio."
        />
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                {item.cover_image_url ? (
                  <img src={item.cover_image_url} alt="" className="h-14 w-14 rounded object-cover shrink-0" />
                ) : (
                  <div className="h-14 w-14 rounded bg-muted flex items-center justify-center shrink-0">
                    <FolderOpen className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{item.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.piece_count || 0} piece{item.piece_count !== 1 ? "s" : ""}
                    {item.description ? ` · ${item.description}` : ""}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(item)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionsManager;
