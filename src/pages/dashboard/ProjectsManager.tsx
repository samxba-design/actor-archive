import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2, Plus, Pencil, Trash2, Search, X, ChevronDown, Settings2 } from "lucide-react";
import { Constants } from "@/integrations/supabase/types";
import type { Tables } from "@/integrations/supabase/types";
import { GlossaryTooltip } from "@/components/ui/glossary-tooltip";
import { WritingAssistant } from "@/components/dashboard/WritingAssistant";
import { searchBooks, type BookResult } from "@/lib/googleBooks";
import { useSubscription, FREE_PROJECT_LIMIT } from "@/hooks/useSubscription";

type Project = Tables<"projects">;

const PROJECT_TYPES = Constants.public.Enums.project_type;
const BOOK_TYPES = ["novel", "book", "short_story"];

interface PurchaseLink {
  label: string;
  url: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

const ProjectsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isPro } = useSubscription();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  const atProjectLimit = !isPro && projects.length >= FREE_PROJECT_LIMIT;

  // Google Books search state
  const [bookSearching, setBookSearching] = useState(false);
  const [bookResults, setBookResults] = useState<BookResult[]>([]);
  const [showBookResults, setShowBookResults] = useState(false);

  const [form, setForm] = useState({
    title: "",
    project_type: "screenplay" as string,
    project_slug: "",
    logline: "",
    description: "",
    genre: "",
    year: "",
    director: "",
    role_name: "",
    status: "",
    video_url: "",
    poster_url: "",
    publisher: "",
    isbn: "",
    page_count: "",
    purchase_links: [] as PurchaseLink[],
    // Advanced fields
    imdb_link: "",
    network_or_studio: "",
    is_featured: false,
    custom_image_url: "",
    backdrop_url: "",
    role_type: "",
    format: "",
    production_company: "",
  });

  const isBookType = BOOK_TYPES.includes(form.project_type);

  const fetchProjects = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("profile_id", user.id)
      .order("display_order", { ascending: true });
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, [user]);

  const resetForm = () => {
    setForm({ title: "", project_type: "screenplay", project_slug: "", logline: "", description: "", genre: "", year: "", director: "", role_name: "", status: "", video_url: "", poster_url: "", publisher: "", isbn: "", page_count: "", purchase_links: [], imdb_link: "", network_or_studio: "", is_featured: false, custom_image_url: "", backdrop_url: "", role_type: "", format: "", production_company: "" });
    setEditing(null);
    setBookResults([]);
    setShowBookResults(false);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    const links = Array.isArray(p.purchase_links) ? (p.purchase_links as unknown as PurchaseLink[]) : [];
    setForm({
      title: p.title,
      project_type: p.project_type,
      project_slug: p.project_slug || "",
      logline: p.logline || "",
      description: p.description || "",
      genre: (p.genre || []).join(", "),
      year: p.year?.toString() || "",
      director: p.director || "",
      role_name: p.role_name || "",
      status: p.status || "",
      video_url: p.video_url || "",
      poster_url: p.poster_url || "",
      publisher: p.publisher || "",
      isbn: p.isbn || "",
      page_count: p.page_count?.toString() || "",
      purchase_links: links,
      imdb_link: p.imdb_link || "",
      network_or_studio: p.network_or_studio || "",
      is_featured: p.is_featured || false,
      custom_image_url: p.custom_image_url || "",
      backdrop_url: p.backdrop_url || "",
      role_type: p.role_type || "",
      format: p.format || "",
      production_company: p.production_company || "",
    });
    setDialogOpen(true);
  };

  const handleTitleChange = (value: string) => {
    setForm((f) => ({
      ...f,
      title: value,
      project_slug: !editing && (!f.project_slug || f.project_slug === generateSlug(f.title))
        ? generateSlug(value)
        : f.project_slug,
    }));
  };

  const handleBookSearch = async () => {
    if (!form.title.trim()) return;
    setBookSearching(true);
    const results = await searchBooks(form.title);
    setBookResults(results);
    setShowBookResults(true);
    setBookSearching(false);
  };

  const applyBookResult = (book: BookResult) => {
    setForm((f) => ({
      ...f,
      publisher: book.publisher || f.publisher,
      isbn: book.isbn || f.isbn,
      page_count: book.pageCount?.toString() || f.page_count,
      poster_url: book.coverUrl || f.poster_url,
      year: book.publishedDate ? book.publishedDate.slice(0, 4) : f.year,
      description: book.description || f.description,
    }));
    setShowBookResults(false);
    toast({ title: "Book data applied", description: `Filled metadata from "${book.title}"` });
  };

  const addPurchaseLink = () => {
    setForm((f) => ({ ...f, purchase_links: [...f.purchase_links, { label: "", url: "" }] }));
  };

  const updatePurchaseLink = (idx: number, field: "label" | "url", value: string) => {
    setForm((f) => {
      const links = [...f.purchase_links];
      links[idx] = { ...links[idx], [field]: value };
      return { ...f, purchase_links: links };
    });
  };

  const removePurchaseLink = (idx: number) => {
    setForm((f) => ({ ...f, purchase_links: f.purchase_links.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!user || !form.title.trim()) return;
    setSaving(true);

    const payload: Record<string, any> = {
      profile_id: user.id,
      title: form.title,
      project_type: form.project_type,
      project_slug: form.project_slug || generateSlug(form.title),
      logline: form.logline || null,
      description: form.description || null,
      genre: form.genre ? form.genre.split(",").map((g) => g.trim()).filter(Boolean) : null,
      year: form.year ? parseInt(form.year) : null,
      status: form.status || null,
      poster_url: form.poster_url || null,
      role_name: form.role_name || null,
    };

    if (isBookType) {
      payload.publisher = form.publisher || null;
      payload.isbn = form.isbn || null;
      payload.page_count = form.page_count ? parseInt(form.page_count) : null;
      payload.purchase_links = form.purchase_links.filter((l) => l.url.trim());
    } else {
      payload.director = form.director || null;
      payload.video_url = form.video_url || null;
    }

    let error;
    if (editing) {
      ({ error } = await supabase.from("projects").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("projects").insert({ ...payload, display_order: projects.length } as any));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editing ? "Updated" : "Created", description: `${form.title} saved.` });
      setDialogOpen(false);
      resetForm();
      fetchProjects();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      fetchProjects();
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Projects</h1>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button disabled={atProjectLimit}>
              <Plus className="mr-2 h-4 w-4" />
              {atProjectLimit ? `Limit reached (${FREE_PROJECT_LIMIT})` : "Add Project"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Project" : "New Project"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={form.project_type} onValueChange={(v) => setForm((f) => ({ ...f, project_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Project Slug</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground shrink-0">/p/you/</span>
                  <Input
                    value={form.project_slug}
                    onChange={(e) => setForm((f) => ({ ...f, project_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                    placeholder="my-project"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Used for the project pitch page URL</p>
              </div>

              {/* Google Books search for book types */}
              {isBookType && (
                <div className="rounded-md border border-border p-3 space-y-2 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Auto-fill from Google Books</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleBookSearch}
                      disabled={bookSearching || !form.title.trim()}
                    >
                      {bookSearching ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Search className="h-3 w-3 mr-1" />}
                      Search
                    </Button>
                  </div>
                  {showBookResults && bookResults.length > 0 && (
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {bookResults.map((b) => (
                        <button
                          key={b.googleBooksId}
                          onClick={() => applyBookResult(b)}
                          className="w-full flex items-center gap-2 p-2 rounded hover:bg-muted/60 text-left transition-colors"
                        >
                          {b.coverUrl && <img src={b.coverUrl} alt="" className="w-8 h-11 object-cover rounded" />}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium truncate">{b.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{b.authors.join(", ")} {b.publishedDate ? `(${b.publishedDate.slice(0, 4)})` : ""}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {showBookResults && bookResults.length === 0 && !bookSearching && (
                    <p className="text-xs text-muted-foreground">No results found.</p>
                  )}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <Label>{isBookType ? "Synopsis" : "Logline"} <GlossaryTooltip term="logline" /></Label>
                  <WritingAssistant
                    text={form.logline}
                    field="logline"
                    title={form.title}
                    genre={form.genre ? form.genre.split(",").map(g => g.trim()).filter(Boolean) : undefined}
                    format={form.project_type}
                    onApply={(t) => setForm((f) => ({ ...f, logline: t }))}
                  />
                </div>
                <Textarea value={form.logline} onChange={(e) => setForm((f) => ({ ...f, logline: e.target.value }))} rows={2} />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>{isBookType ? "Book Description" : "Description"} <GlossaryTooltip term="description" /></Label>
                  <WritingAssistant
                    text={form.description}
                    field="description"
                    title={form.title}
                    genre={form.genre ? form.genre.split(",").map(g => g.trim()).filter(Boolean) : undefined}
                    format={form.project_type}
                    onApply={(t) => setForm((f) => ({ ...f, description: t }))}
                  />
                </div>
                <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{isBookType ? "Publication Year" : "Year"} <GlossaryTooltip term="year" /></Label><Input value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} type="number" /></div>
                <div><Label>Status <GlossaryTooltip term="status" /></Label><Input value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} placeholder={isBookType ? "e.g. Published, In Progress" : "e.g. In Development"} /></div>
              </div>
              <div><Label>Genre <GlossaryTooltip term="genre" /></Label><Input value={form.genre} onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))} placeholder={isBookType ? "Literary Fiction, Memoir" : "Drama, Thriller"} /></div>

              {/* Book-specific fields */}
              {isBookType && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Publisher</Label><Input value={form.publisher} onChange={(e) => setForm((f) => ({ ...f, publisher: e.target.value }))} placeholder="e.g. Penguin Random House" /></div>
                    <div><Label>Page Count</Label><Input value={form.page_count} onChange={(e) => setForm((f) => ({ ...f, page_count: e.target.value }))} type="number" /></div>
                  </div>
                  <div><Label>ISBN</Label><Input value={form.isbn} onChange={(e) => setForm((f) => ({ ...f, isbn: e.target.value }))} placeholder="978-..." /></div>

                  {/* Purchase links editor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Purchase Links</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addPurchaseLink}>
                        <Plus className="h-3 w-3 mr-1" /> Add Link
                      </Button>
                    </div>
                    {form.purchase_links.map((link, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          value={link.label}
                          onChange={(e) => updatePurchaseLink(i, "label", e.target.value)}
                          placeholder="Amazon"
                          className="w-28"
                        />
                        <Input
                          value={link.url}
                          onChange={(e) => updatePurchaseLink(i, "url", e.target.value)}
                          placeholder="https://..."
                          className="flex-1"
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removePurchaseLink(i)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {form.purchase_links.length === 0 && (
                      <p className="text-xs text-muted-foreground">Add links to Amazon, Bookshop.org, etc.</p>
                    )}
                  </div>
                </>
              )}

              {/* Non-book fields */}
              {!isBookType && (
                <>
                  <div><Label>Director <GlossaryTooltip term="director" /></Label><Input value={form.director} onChange={(e) => setForm((f) => ({ ...f, director: e.target.value }))} /></div>
                  <div><Label>Video URL <GlossaryTooltip term="video_url" /></Label><Input value={form.video_url} onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))} placeholder="YouTube or Vimeo link" /></div>
                </>
              )}

              <div><Label>Role / Credit <GlossaryTooltip term="role_name" /></Label><Input value={form.role_name} onChange={(e) => setForm((f) => ({ ...f, role_name: e.target.value }))} placeholder={isBookType ? "e.g. Author, Co-Author" : "e.g. Writer, Lead Actor"} /></div>
              <div><Label>{isBookType ? "Cover Image URL" : "Poster URL"} <GlossaryTooltip term="poster_url" /></Label><Input value={form.poster_url} onChange={(e) => setForm((f) => ({ ...f, poster_url: e.target.value }))} /></div>
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Update" : "Create"} Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No projects yet. Click "Add Project" to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <Card key={p.id} className="group">
              <CardContent className="flex items-center gap-4 py-4">
                {p.poster_url ? (
                  <img src={p.poster_url} alt={p.title} className="w-12 h-16 object-cover rounded" />
                ) : (
                  <div className="w-12 h-16 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                    {p.project_type.slice(0, 3)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{p.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{p.project_type.replace(/_/g, " ")}</Badge>
                    {p.year && <span className="text-xs text-muted-foreground">{p.year}</span>}
                    {p.project_slug && <span className="text-xs text-muted-foreground">/{p.project_slug}</span>}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
