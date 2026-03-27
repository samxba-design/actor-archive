import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Video, ExternalLink, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Reel {
  id: string;
  title: string;
  video_url: string | null;
  description: string | null;
  year: number | null;
  project_type: string | null;
  role_name: string | null;
  poster_url: string | null;
  is_featured: boolean | null;
}

const EMPTY_FORM = {
  title: "",
  video_url: "",
  description: "",
  year: "",
  role_name: "",
  is_featured: false,
};

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

function getVideoThumbnail(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  return null;
}

const ReelManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [previewReel, setPreviewReel] = useState<Reel | null>(null);

  const fetchReels = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("projects")
      .select("id, title, video_url, description, year, project_type, role_name, poster_url, is_featured")
      .eq("profile_id", user.id)
      .not("video_url", "is", null)
      .order("is_featured", { ascending: false })
      .order("year", { ascending: false });
    setReels((data as Reel[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchReels(); }, [user]);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (reel: Reel) => {
    setEditId(reel.id);
    setForm({
      title: reel.title || "",
      video_url: reel.video_url || "",
      description: reel.description || "",
      year: reel.year ? String(reel.year) : "",
      role_name: reel.role_name || "",
      is_featured: reel.is_featured || false,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user || !form.title.trim() || !form.video_url.trim()) {
      toast({ title: "Title and video URL are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      video_url: form.video_url.trim(),
      description: form.description.trim() || null,
      year: form.year ? parseInt(form.year) : null,
      role_name: form.role_name.trim() || null,
      is_featured: form.is_featured,
      project_type: "video" as const,
      profile_id: user.id,
    };

    if (editId) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Reel updated" }); }
    } else {
      const { error } = await supabase.from("projects").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      else { toast({ title: "Reel added" }); }
    }

    setSaving(false);
    setDialogOpen(false);
    fetchReels();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this reel?")) return;
    await supabase.from("projects").delete().eq("id", id);
    toast({ title: "Reel deleted" });
    fetchReels();
  };

  const toggleFeatured = async (reel: Reel) => {
    await supabase.from("projects").update({ is_featured: !reel.is_featured }).eq("id", reel.id);
    fetchReels();
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demo Reels</h1>
          <p className="text-muted-foreground mt-1">Manage your video reels and showreels. They appear in the Demo Reels section of your portfolio.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Reel
        </Button>
      </div>

      {reels.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="text-muted-foreground font-medium">No reels yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add a YouTube or Vimeo link to get started.</p>
            <Button className="mt-4" onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Add Your First Reel</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reels.map((reel) => {
            const thumbnail = reel.poster_url || getVideoThumbnail(reel.video_url || "");
            const embedUrl = getEmbedUrl(reel.video_url || "");
            return (
              <Card key={reel.id} className="overflow-hidden">
                <div className="flex gap-4 p-4">
                  {/* Thumbnail / Preview */}
                  <div
                    className="relative flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden bg-muted cursor-pointer group"
                    onClick={() => setPreviewReel(reel)}
                  >
                    {thumbnail ? (
                      <img src={thumbnail} alt={reel.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="h-8 w-8 text-muted-foreground opacity-40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground truncate">{reel.title}</h3>
                          {reel.is_featured && <Badge variant="default" className="text-xs">Featured</Badge>}
                        </div>
                        {reel.role_name && (
                          <p className="text-sm text-muted-foreground mt-0.5">{reel.role_name}{reel.year ? ` · ${reel.year}` : ""}</p>
                        )}
                        {reel.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{reel.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Button variant="outline" size="sm" onClick={() => toggleFeatured(reel)} className="text-xs h-7">
                        {reel.is_featured ? "Unfeature" : "Set Featured"}
                      </Button>
                      {reel.video_url && (
                        <Button variant="ghost" size="sm" className="text-xs h-7" asChild>
                          <a href={reel.video_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-3 w-3" /> Open
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-xs h-7 ml-auto" onClick={() => openEdit(reel)}>
                        <Pencil className="mr-1 h-3 w-3" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive hover:text-destructive" onClick={() => handleDelete(reel.id)}>
                        <Trash2 className="mr-1 h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Reel" : "Add Reel"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Demo Reel 2024, Short Film Compilation"
              />
            </div>
            <div>
              <Label>YouTube or Vimeo URL *</Label>
              <Input
                value={form.video_url}
                onChange={(e) => setForm(f => ({ ...f, video_url: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {form.video_url && getEmbedUrl(form.video_url) && (
                <p className="text-xs text-green-600 mt-1">✓ Valid video URL detected</p>
              )}
              {form.video_url && !getEmbedUrl(form.video_url) && (
                <p className="text-xs text-amber-600 mt-1">Paste a YouTube or Vimeo URL for best results</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Role / Credit</Label>
                <Input
                  value={form.role_name}
                  onChange={(e) => setForm(f => ({ ...f, role_name: e.target.value }))}
                  placeholder="e.g. Lead Actor"
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  value={form.year}
                  onChange={(e) => setForm(f => ({ ...f, year: e.target.value }))}
                  placeholder="2024"
                  type="number"
                  min="1900" max="2099"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Brief description of this reel or project..."
                rows={3}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                id="is_featured"
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                className="h-4 w-4 rounded border-border"
              />
              <Label htmlFor="is_featured" className="cursor-pointer">Feature this reel (shown prominently)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {editId ? "Save Changes" : "Add Reel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewReel} onOpenChange={(open) => { if (!open) setPreviewReel(null); }}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          {previewReel && (() => {
            const embed = getEmbedUrl(previewReel.video_url || "");
            return embed ? (
              <div className="aspect-video w-full">
                <iframe
                  src={embed}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={previewReel.title}
                />
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <p>Can't preview this URL directly.</p>
                <Button className="mt-4" asChild>
                  <a href={previewReel.video_url || ""} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Open in New Tab
                  </a>
                </Button>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReelManager;
