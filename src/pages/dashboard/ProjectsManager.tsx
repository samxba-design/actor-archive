import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Constants } from "@/integrations/supabase/types";
import type { Tables } from "@/integrations/supabase/types";
import { GlossaryTooltip } from "@/components/ui/glossary-tooltip";
import { WritingAssistant } from "@/components/dashboard/WritingAssistant";

type Project = Tables<"projects">;

const PROJECT_TYPES = Constants.public.Enums.project_type;

const ProjectsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    project_type: "screenplay" as string,
    logline: "",
    description: "",
    genre: "",
    year: "",
    director: "",
    role_name: "",
    status: "",
    video_url: "",
    poster_url: "",
  });

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
    setForm({ title: "", project_type: "screenplay", logline: "", description: "", genre: "", year: "", director: "", role_name: "", status: "", video_url: "", poster_url: "" });
    setEditing(null);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      project_type: p.project_type,
      logline: p.logline || "",
      description: p.description || "",
      genre: (p.genre || []).join(", "),
      year: p.year?.toString() || "",
      director: p.director || "",
      role_name: p.role_name || "",
      status: p.status || "",
      video_url: p.video_url || "",
      poster_url: p.poster_url || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user || !form.title.trim()) return;
    setSaving(true);

    const payload = {
      profile_id: user.id,
      title: form.title,
      project_type: form.project_type as any,
      logline: form.logline || null,
      description: form.description || null,
      genre: form.genre ? form.genre.split(",").map((g) => g.trim()).filter(Boolean) : null,
      year: form.year ? parseInt(form.year) : null,
      director: form.director || null,
      role_name: form.role_name || null,
      status: form.status || null,
      video_url: form.video_url || null,
      poster_url: form.poster_url || null,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from("projects").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("projects").insert({ ...payload, display_order: projects.length }));
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
            <Button><Plus className="mr-2 h-4 w-4" />Add Project</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Project" : "New Project"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div>
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
                <div className="flex items-center justify-between">
                  <Label>Logline <GlossaryTooltip term="logline" /></Label>
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
                  <Label>Description <GlossaryTooltip term="description" /></Label>
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
                <div><Label>Year <GlossaryTooltip term="year" /></Label><Input value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} type="number" /></div>
                <div><Label>Status <GlossaryTooltip term="status" /></Label><Input value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} placeholder="e.g. In Development" /></div>
              </div>
              <div><Label>Genre <GlossaryTooltip term="genre" /></Label><Input value={form.genre} onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))} placeholder="Drama, Thriller" /></div>
              <div><Label>Director <GlossaryTooltip term="director" /></Label><Input value={form.director} onChange={(e) => setForm((f) => ({ ...f, director: e.target.value }))} /></div>
              <div><Label>Role / Credit <GlossaryTooltip term="role_name" /></Label><Input value={form.role_name} onChange={(e) => setForm((f) => ({ ...f, role_name: e.target.value }))} placeholder="e.g. Writer, Lead Actor" /></div>
              <div><Label>Video URL <GlossaryTooltip term="video_url" /></Label><Input value={form.video_url} onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))} placeholder="YouTube or Vimeo link" /></div>
              <div><Label>Poster URL <GlossaryTooltip term="poster_url" /></Label><Input value={form.poster_url} onChange={(e) => setForm((f) => ({ ...f, poster_url: e.target.value }))} /></div>
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
