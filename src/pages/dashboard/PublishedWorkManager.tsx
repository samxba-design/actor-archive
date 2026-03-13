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
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Upload, FileText, Image, Star, GripVertical } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";
import ManagerHelpBanner from "@/components/dashboard/ManagerHelpBanner";
import { useProfileTypeContext } from "@/contexts/ProfileTypeContext";
import { generatePdfThumbnail, dataUrlToFile } from "@/lib/pdfThumbnail";

interface PublishedWork {
  id: string;
  profile_id: string;
  title: string;
  summary: string | null;
  category: string | null;
  publication: string | null;
  date: string | null;
  read_time: string | null;
  cover_image_url: string | null;
  pdf_thumbnail_url: string | null;
  pdf_url: string | null;
  article_url: string | null;
  is_featured: boolean | null;
  show_text_overlay: boolean | null;
  display_order: number | null;
  created_at: string | null;
}

const CATEGORIES = [
  "Blog Post", "White Paper", "Case Study", "Newsletter", "Long-form",
  "Ad Copy", "Email", "Landing Page", "UX Copy", "Technical", "Opinion", "Other",
];

const PublishedWorkManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { slug } = useProfileTypeContext();
  const [items, setItems] = useState<PublishedWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PublishedWork | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);

  const [form, setForm] = useState({
    title: "",
    summary: "",
    category: "",
    publication: "",
    date: "",
    read_time: "",
    cover_image_url: "",
    pdf_thumbnail_url: "",
    pdf_url: "",
    article_url: "",
    is_featured: false,
    show_text_overlay: true,
    collection_id: "",
  });

  const fetchItems = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("published_works")
      .select("*")
      .eq("profile_id", user.id)
      .order("display_order", { ascending: true });
    setItems((data as PublishedWork[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [user]);

  useEffect(() => {
    if (!user) return;
    supabase.from("work_collections").select("id, name").eq("profile_id", user.id).order("display_order").then(({ data }) => setCollections((data as any) || []));
  }, [user]);

  const resetForm = () => {
    setForm({ title: "", summary: "", category: "", publication: "", date: "", read_time: "", cover_image_url: "", pdf_thumbnail_url: "", pdf_url: "", article_url: "", is_featured: false, show_text_overlay: true, collection_id: "" });
    setEditing(null);
  };

  const openEdit = (item: PublishedWork) => {
    setEditing(item);
    setForm({
      title: item.title,
      summary: item.summary || "",
      category: item.category || "",
      publication: item.publication || "",
      date: item.date || "",
      read_time: item.read_time || "",
      cover_image_url: item.cover_image_url || "",
      pdf_thumbnail_url: item.pdf_thumbnail_url || "",
      pdf_url: item.pdf_url || "",
      article_url: item.article_url || "",
      is_featured: item.is_featured || false,
      show_text_overlay: item.show_text_overlay !== false,
      collection_id: (item as any).collection_id || "",
    });
    setDialogOpen(true);
  };

  const handleUploadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingPdf(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("documents").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploadingPdf(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);
    setForm((f) => ({ ...f, pdf_url: urlData.publicUrl }));
    toast({ title: "PDF uploaded" });

    // Auto-generate thumbnail from first page
    try {
      const localUrl = URL.createObjectURL(file);
      const thumbDataUrl = await generatePdfThumbnail(localUrl);
      URL.revokeObjectURL(localUrl);
      if (thumbDataUrl) {
        const thumbFile = dataUrlToFile(thumbDataUrl, `thumb-${Date.now()}.png`);
        const thumbPath = `${user.id}/pdf-thumbs/${Date.now()}.png`;
        const { error: thumbErr } = await supabase.storage.from("thumbnails").upload(thumbPath, thumbFile);
        if (!thumbErr) {
          const { data: thumbUrl } = supabase.storage.from("thumbnails").getPublicUrl(thumbPath);
          setForm((f) => ({ ...f, pdf_thumbnail_url: thumbUrl.publicUrl }));
          toast({ title: "PDF thumbnail generated" });
        }
      }
    } catch {
      // Thumbnail generation is best-effort
    }

    setUploadingPdf(false);
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingCover(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/covers/${Date.now()}.${ext}`;
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
    if (!user || !form.title.trim()) return;
    setSaving(true);

    const payload = {
      profile_id: user.id,
      title: form.title.trim(),
      summary: form.summary || null,
      category: form.category || null,
      publication: form.publication || null,
      date: form.date || null,
      read_time: form.read_time || null,
      cover_image_url: form.cover_image_url || null,
      pdf_thumbnail_url: form.pdf_thumbnail_url || null,
      pdf_url: form.pdf_url || null,
      article_url: form.article_url || null,
      is_featured: form.is_featured,
      show_text_overlay: form.show_text_overlay,
      collection_id: form.collection_id || null,
    };

    if (editing) {
      const { error } = await supabase.from("published_works").update(payload).eq("id", editing.id);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Updated" });
    } else {
      const { error } = await supabase.from("published_works").insert({ ...payload, display_order: items.length });
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Added" });
    }

    setSaving(false);
    setDialogOpen(false);
    resetForm();
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("published_works").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchItems(); }
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
        title="Published Work"
        description="Manage your published articles, PDFs, and writing pieces that appear on your portfolio."
      />
      <ManagerHelpBanner id="published-work" title="Published work appears in its own section" description="Manage articles, PDFs, and writing pieces on your portfolio. You can hide this section in Settings." learnMoreRoute="/dashboard/settings" previewText="Displayed as article cards with cover images, publication names, and read times" portfolioSlug={slug || undefined} />

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Published Work
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "Add"} Published Work</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. The Future of AI in Marketing" />
            </div>
            <div>
              <Label>Summary</Label>
              <Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Brief description..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. White Paper" list="categories" />
                <datalist id="categories">
                  {CATEGORIES.map((c) => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div>
                <Label>Publication</Label>
                <Input value={form.publication} onChange={(e) => setForm({ ...form, publication: e.target.value })} placeholder="e.g. Forbes" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date</Label>
                <Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. Mar 2024" />
              </div>
              <div>
                <Label>Read Time</Label>
                <Input value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })} placeholder="e.g. 8 min read" />
              </div>
            </div>

            {/* PDF Upload */}
            <div>
              <Label>PDF Document</Label>
              <input ref={pdfInputRef} type="file" accept=".pdf" className="hidden" onChange={handleUploadPdf} />
              <div className="flex items-center gap-2 mt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => pdfInputRef.current?.click()} disabled={uploadingPdf}>
                  {uploadingPdf ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Upload className="h-3 w-3 mr-1" />}
                  Upload PDF
                </Button>
                {form.pdf_url && <span className="text-xs text-muted-foreground flex items-center gap-1"><FileText className="h-3 w-3" /> Uploaded</span>}
              </div>
              <Input value={form.pdf_url} onChange={(e) => setForm({ ...form, pdf_url: e.target.value })} placeholder="Or paste PDF URL" className="mt-1.5" />
            </div>

            {/* Article URL */}
            <div>
              <Label>Article URL (alternative to PDF)</Label>
              <Input value={form.article_url} onChange={(e) => setForm({ ...form, article_url: e.target.value })} placeholder="https://..." />
            </div>

            {/* Cover Image */}
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

            {/* Toggles */}
            <div className="flex items-center justify-between">
              <Label className="cursor-pointer">Featured</Label>
              <Switch checked={form.is_featured} onCheckedChange={(c) => setForm({ ...form, is_featured: c })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="cursor-pointer">Show title overlay on image</Label>
              <Switch checked={form.show_text_overlay} onCheckedChange={(c) => setForm({ ...form, show_text_overlay: c })} />
            </div>

            <Button onClick={handleSave} disabled={saving || !form.title.trim()} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editing ? "Update" : "Add"} Published Work
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {items.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No published work yet"
          description="Add your articles, white papers, and writing pieces to showcase on your portfolio."
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
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                    {item.is_featured && <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {[item.category, item.publication, item.date].filter(Boolean).join(" · ")}
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

export default PublishedWorkManager;
