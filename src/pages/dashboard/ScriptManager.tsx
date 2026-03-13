import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Pencil, Trash2, Upload, FileText, Lock, Eye, Mail, Shield, Download } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { useSubscription } from "@/hooks/useSubscription";
import ManagerHelpBanner from "@/components/dashboard/ManagerHelpBanner";
import { useProfileTypeContext } from "@/contexts/ProfileTypeContext";

type Project = Tables<"projects">;

const ACCESS_LEVELS = [
  { value: "public", label: "Public", icon: Eye, description: "Anyone can download", color: "text-green-500" },
  { value: "gated", label: "Email Required", icon: Mail, description: "Visitor must provide email", color: "text-blue-500" },
  { value: "password_protected", label: "Password Protected", icon: Lock, description: "Requires a password", color: "text-amber-500" },
  { value: "private", label: "Private", icon: Shield, description: "Only visible to you", color: "text-red-500" },
  { value: "nda_required", label: "NDA Required", icon: Shield, description: "Requires signed NDA", color: "text-red-600" },
];

const ScriptManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isPro } = useSubscription();
  const [scripts, setScripts] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SCRIPT_TYPES = ["screenplay", "pilot", "spec_script", "play", "series_bible", "comedy_packet", "writing_sample"] as const;

  const [form, setForm] = useState({
    title: "",
    project_type: "screenplay" as string,
    format: "",
    logline: "",
    page_count: "",
    year: "",
    status: "",
    genre: "",
    access_level: "public" as string,
    password: "",
    script_pdf_url: "",
    coverage_excerpt: "",
    nda_url: "",
    is_featured: false,
  });

  const fetchScripts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("profile_id", user.id)
      .in("project_type", SCRIPT_TYPES)
      .order("display_order", { ascending: true });
    setScripts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchScripts(); }, [user]);

  const resetForm = () => {
    setForm({ title: "", project_type: "screenplay", format: "", logline: "", page_count: "", year: "", status: "", genre: "", access_level: "public", password: "", script_pdf_url: "", coverage_excerpt: "", nda_url: "", is_featured: false });
    setEditing(null);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      project_type: p.project_type,
      format: p.format || "",
      logline: p.logline || "",
      page_count: p.page_count?.toString() || "",
      year: p.year?.toString() || "",
      status: p.status || "",
      genre: (p.genre || []).join(", "),
      access_level: p.access_level || "public",
      password: "",
      script_pdf_url: p.script_pdf_url || "",
      coverage_excerpt: p.coverage_excerpt || "",
      nda_url: p.nda_url || "",
      is_featured: p.is_featured || false,
    });
    setDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 20MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop() || "pdf";
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("scripts").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      // scripts bucket is private, so we store the path and generate signed URLs
      setForm(f => ({ ...f, script_pdf_url: path }));
      toast({ title: "Uploaded", description: file.name });
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!user || !form.title.trim()) return;
    setSaving(true);

    const payload: Record<string, any> = {
      profile_id: user.id,
      title: form.title,
      project_type: form.project_type,
      format: form.format || null,
      logline: form.logline || null,
      page_count: form.page_count ? parseInt(form.page_count) : null,
      year: form.year ? parseInt(form.year) : null,
      status: form.status || null,
      genre: form.genre ? form.genre.split(",").map(g => g.trim()).filter(Boolean) : null,
      access_level: form.access_level,
      script_pdf_url: form.script_pdf_url || null,
      coverage_excerpt: form.coverage_excerpt || null,
      nda_url: form.nda_url || null,
      is_featured: form.is_featured,
    };

    // Hash password if provided
    if (form.access_level === "password_protected" && form.password) {
      // Simple hash for demo — in production use bcrypt via edge function
      const encoder = new TextEncoder();
      const data = encoder.encode(form.password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      payload.password_hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }

    let error;
    if (editing) {
      ({ error } = await supabase.from("projects").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("projects").insert({ ...payload, display_order: scripts.length } as any));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editing ? "Updated" : "Created", description: `${form.title} saved.` });
      setDialogOpen(false);
      resetForm();
      fetchScripts();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) fetchScripts();
  };

  const accessLabel = (level: string) => ACCESS_LEVELS.find(a => a.value === level) || ACCESS_LEVELS[0];

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Scripts & Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload PDFs and control who can access them</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Script</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Script" : "Upload Script"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Title *</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. The Last Draft" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select value={form.project_type} onValueChange={v => setForm(f => ({ ...f, project_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SCRIPT_TYPES.map(t => (
                        <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Format</Label>
                  <Input value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))} placeholder="e.g. Feature, Pilot" />
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Script PDF</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                  {form.script_pdf_url ? (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-foreground font-medium">File uploaded</span>
                      <Button variant="ghost" size="sm" onClick={() => setForm(f => ({ ...f, script_pdf_url: "" }))}>
                        Replace
                      </Button>
                    </div>
                  ) : (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.fdx,.fountain"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="script-upload"
                      />
                      <label htmlFor="script-upload" className="cursor-pointer">
                        {uploading ? (
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                        ) : (
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        )}
                        <p className="text-sm text-muted-foreground">
                          Click to upload PDF, DOCX, FDX, or Fountain
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Max 20MB</p>
                      </label>
                    </>
                  )}
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Or paste a URL</Label>
                  <Input
                    value={form.script_pdf_url}
                    onChange={e => setForm(f => ({ ...f, script_pdf_url: e.target.value }))}
                    placeholder="https://..."
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Access Level */}
              <div className="space-y-2">
                <Label>Access Level</Label>
                <Select value={form.access_level} onValueChange={v => setForm(f => ({ ...f, access_level: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ACCESS_LEVELS.map(a => {
                      const Icon = a.icon;
                      return (
                        <SelectItem key={a.value} value={a.value}>
                          <span className="flex items-center gap-2">
                            <Icon className={`h-3.5 w-3.5 ${a.color}`} />
                            {a.label}
                            <span className="text-xs text-muted-foreground">— {a.description}</span>
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Password field */}
              {form.access_level === "password_protected" && (
                <div>
                  <Label>Set Password</Label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder={editing ? "Leave blank to keep current" : "Enter access password"}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Visitors must enter this to view/download</p>
                </div>
              )}

              {/* NDA URL */}
              {form.access_level === "nda_required" && (
                <div>
                  <Label>NDA Document URL</Label>
                  <Input
                    value={form.nda_url}
                    onChange={e => setForm(f => ({ ...f, nda_url: e.target.value }))}
                    placeholder="Link to your NDA template (DocuSign, etc.)"
                  />
                </div>
              )}

              <div>
                <Label>Logline</Label>
                <Textarea value={form.logline} onChange={e => setForm(f => ({ ...f, logline: e.target.value }))} rows={2} placeholder="One-line summary..." />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div><Label>Pages</Label><Input type="number" value={form.page_count} onChange={e => setForm(f => ({ ...f, page_count: e.target.value }))} /></div>
                <div><Label>Year</Label><Input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} /></div>
                <div><Label>Status</Label><Input value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} placeholder="Draft, Final" /></div>
              </div>

              <div><Label>Genre</Label><Input value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} placeholder="Drama, Thriller" /></div>

              <div>
                <Label>Coverage Excerpt</Label>
                <Textarea value={form.coverage_excerpt} onChange={e => setForm(f => ({ ...f, coverage_excerpt: e.target.value }))} rows={2} placeholder="Pull a quote from coverage or feedback..." />
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Update" : "Create"} Script
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ManagerHelpBanner id="scripts" title="Scripts appear with optional password protection" description="Upload PDFs and control access levels. You can hide this section in Settings." learnMoreRoute="/dashboard/settings" previewText="Shown as downloadable cards with access control badges" demoUrl="/demo/screenwriter" />

      {scripts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No scripts uploaded yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Upload your screenplays, pilots, and writing samples with customizable access controls.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {scripts.map(p => {
            const access = accessLabel(p.access_level || "public");
            const AccessIcon = access.icon;
            return (
              <Card key={p.id} className="group">
                <CardContent className="flex items-center gap-4 py-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    p.access_level === "public" ? "bg-green-500/10" :
                    p.access_level === "gated" ? "bg-blue-500/10" :
                    p.access_level === "password_protected" ? "bg-amber-500/10" :
                    "bg-red-500/10"
                  }`}>
                    <FileText className={`h-5 w-5 ${access.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{p.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{p.project_type.replace(/_/g, " ")}</Badge>
                      <Badge variant="outline" className={`text-xs ${access.color}`}>
                        <AccessIcon className="h-3 w-3 mr-1" />
                        {access.label}
                      </Badge>
                      {p.page_count && <span className="text-xs text-muted-foreground">{p.page_count}pp</span>}
                      {p.year && <span className="text-xs text-muted-foreground">{p.year}</span>}
                      {p.script_pdf_url && (
                        <Badge variant="outline" className="text-xs text-green-600">
                          <Download className="h-3 w-3 mr-1" /> PDF
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScriptManager;
