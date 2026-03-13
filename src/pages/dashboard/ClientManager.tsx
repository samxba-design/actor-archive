import { useEffect, useState, useCallback } from "react";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Building2, Upload, GripVertical } from "lucide-react";
import { getCompanyLogoUrl } from "@/lib/companyLogos";
import ManagerHelpBanner from "@/components/dashboard/ManagerHelpBanner";
import { useProfileTypeContext } from "@/contexts/ProfileTypeContext";
import CompanyLogoLibrary from "@/components/dashboard/CompanyLogoLibrary";

interface ClientLogo {
  id: string;
  company_name: string;
  logo_url: string | null;
  website_url: string | null;
  display_order: number | null;
}

const ClientManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { slug } = useProfileTypeContext();
  const [items, setItems] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ClientLogo | null>(null);
  const [form, setForm] = useState({ company_name: "", website_url: "", logo_url: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const fetchItems = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("client_logos_profile")
      .select("*")
      .eq("profile_id", user.id)
      .order("display_order");
    setItems((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [user]);

  const openAdd = () => {
    setEditing(null);
    setForm({ company_name: "", website_url: "", logo_url: "" });
    setDialogOpen(true);
  };

  const openEdit = (item: ClientLogo) => {
    setEditing(item);
    setForm({
      company_name: item.company_name,
      website_url: item.website_url || "",
      logo_url: item.logo_url || "",
    });
    setDialogOpen(true);
  };

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from("logos").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);
      setForm(f => ({ ...f, logo_url: urlData.publicUrl }));
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!user || !form.company_name.trim()) return;
    setSaving(true);
    // Auto-fill logo from Clearbit if no custom logo
    const logoUrl = form.logo_url || getCompanyLogoUrl(form.company_name.trim());
    const payload = {
      profile_id: user.id,
      company_name: form.company_name.trim(),
      website_url: form.website_url || null,
      logo_url: logoUrl,
    };
    const { error } = editing
      ? await supabase.from("client_logos_profile").update(payload).eq("id", editing.id)
      : await supabase.from("client_logos_profile").insert(payload);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Updated" : "Client added" }); setDialogOpen(false); fetchItems(); }
    setSaving(false);
  };

  const performDelete = useCallback(async (id: string) => {
    await supabase.from("client_logos_profile").delete().eq("id", id);
    fetchItems();
  }, [user]);

  const { requestDelete, DeleteConfirmDialog } = useDeleteConfirmation(performDelete, {
    title: "Remove this client?",
    description: "This client logo will be removed from your portfolio.",
  });

  const handleAddFromLibrary = async (companyName: string, logoUrl: string) => {
    if (!user) return;
    await supabase.from("client_logos_profile").insert({
      profile_id: user.id,
      company_name: companyName,
      logo_url: logoUrl,
      display_order: items.length,
    });
    fetchItems();
    toast({ title: "Added", description: `${companyName} added to your clients.` });
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Clients"
          description="Add the brands and companies you've worked with. Logos are auto-fetched, or you can upload your own."
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLibraryOpen(true)}>Browse Library</Button>
          <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Client</Button>
        </div>
      </div>
      <ManagerHelpBanner id="clients" title="Logos show in your Clients section" description="Add brands you've worked with — logos are auto-fetched. You can hide this section in Settings." learnMoreRoute="/dashboard/settings" previewText="Displayed as a scrolling logo bar on your portfolio" demoUrl="/demo/copywriter" portfolioSlug={slug || undefined} />

      {items.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No clients yet"
          description="Add the brands you've worked with — logos will auto-populate from our library of 200+ companies, or upload your own."
          actionLabel="Add Client"
          onAction={openAdd}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map(item => (
            <Card key={item.id}>
              <CardContent className="py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded flex items-center justify-center bg-muted shrink-0 overflow-hidden">
                  {item.logo_url ? (
                    <img
                      src={item.logo_url}
                      alt={item.company_name}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.company_name}</p>
                  {item.website_url && (
                    <p className="text-xs text-muted-foreground truncate">{item.website_url}</p>
                  )}
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
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "Add"} Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Company Name *</Label>
              <Input
                value={form.company_name}
                onChange={(e) => setForm(f => ({ ...f, company_name: e.target.value }))}
                placeholder="e.g. Microsoft, SoFi, Deloitte"
              />
              <p className="text-xs text-muted-foreground mt-1">We'll auto-fetch the logo if we recognize the company</p>
            </div>
            <div>
              <Label>Website URL</Label>
              <Input
                value={form.website_url}
                onChange={(e) => setForm(f => ({ ...f, website_url: e.target.value }))}
                placeholder="https://company.com"
              />
            </div>
            <div>
              <Label>Custom Logo (optional)</Label>
              <div className="flex items-center gap-3 mt-1">
                {form.logo_url && (
                  <div className="w-12 h-12 rounded border bg-white flex items-center justify-center overflow-hidden">
                    <img src={form.logo_url} alt="" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input type="file" className="hidden" accept="image/*" onChange={handleUploadLogo} />
                  <Button variant="outline" size="sm" asChild disabled={uploading}>
                    <span>
                      {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                      {uploading ? "Uploading…" : "Upload Logo"}
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.company_name.trim()}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Update" : "Add Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog />
    </div>
  );
};

export default ClientManager;
