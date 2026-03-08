import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, GripVertical, Sparkles, BookOpen, HelpCircle, Quote, Lightbulb, List } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";

const PREDEFINED_TEMPLATES = [
  { title: "Fun Facts", icon: "Sparkles", content: "" },
  { title: "My Process", icon: "List", content: "" },
  { title: "Philosophy", icon: "Lightbulb", content: "" },
  { title: "FAQ", icon: "HelpCircle", content: "" },
  { title: "Influences", icon: "BookOpen", content: "" },
  { title: "Colophon", icon: "Quote", content: "" },
];

const ICON_OPTIONS = [
  { value: "Sparkles", label: "Sparkles" },
  { value: "BookOpen", label: "Book" },
  { value: "HelpCircle", label: "Help" },
  { value: "Quote", label: "Quote" },
  { value: "Lightbulb", label: "Lightbulb" },
  { value: "List", label: "List" },
];

interface CustomSection {
  id: string;
  profile_id: string;
  title: string;
  content: string | null;
  section_type: string;
  icon: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

const CustomSectionsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sections, setSections] = useState<CustomSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const { confirmDelete, DeleteDialog } = useDeleteConfirmation();

  const fetchSections = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("custom_sections" as any)
      .select("*")
      .eq("profile_id", user.id)
      .order("display_order");
    setSections((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchSections(); }, [user]);

  const addSection = async (template?: { title: string; icon: string; content: string }) => {
    if (!user) return;
    const { error } = await supabase.from("custom_sections" as any).insert({
      profile_id: user.id,
      title: template?.title || "New Section",
      content: template?.content || "",
      icon: template?.icon || "Sparkles",
      display_order: sections.length,
    } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Section added" });
      fetchSections();
    }
    setShowTemplates(false);
  };

  const updateSection = async (id: string, updates: Partial<CustomSection>) => {
    setSaving(id);
    await supabase.from("custom_sections" as any).update(updates as any).eq("id", id);
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    setSaving(null);
  };

  const deleteSection = async (id: string) => {
    const confirmed = await confirmDelete("Delete this section? This cannot be undone.");
    if (!confirmed) return;
    await supabase.from("custom_sections" as any).delete().eq("id", id);
    setSections(prev => prev.filter(s => s.id !== id));
    toast({ title: "Section deleted" });
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      <DeleteDialog />
      <PageHeader
        title="Custom Sections"
        subtitle="Add unique content blocks to your portfolio — Fun Facts, Process, FAQ, or anything you want."
      />

      {sections.length === 0 && !showTemplates && (
        <EmptyState
          icon="Sparkles"
          title="No custom sections yet"
          description="Add predefined templates or create your own free-text sections to make your portfolio unique."
          actionLabel="Add Section"
          onAction={() => setShowTemplates(true)}
        />
      )}

      {/* Template picker */}
      {showTemplates && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Choose a Template or Start Blank</CardTitle>
            <CardDescription>Pick a starting point or create something entirely custom</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PREDEFINED_TEMPLATES.map(t => (
                <button
                  key={t.title}
                  onClick={() => addSection(t)}
                  className="flex items-center gap-2 p-3 rounded-lg border border-border text-left hover:bg-accent/50 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-medium">{t.title}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t border-border">
              <Button size="sm" onClick={() => addSection()} variant="outline">
                <Plus className="w-3 h-3 mr-1" /> Blank Section
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowTemplates(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section list */}
      {sections.map((section) => (
        <Card key={section.id}>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <Select value={section.icon} onValueChange={(v) => updateSection(section.id, { icon: v })}>
                    <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map(i => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input
                    value={section.title}
                    onChange={(e) => setSections(prev => prev.map(s => s.id === section.id ? { ...s, title: e.target.value } : s))}
                    onBlur={() => updateSection(section.id, { title: section.title })}
                    className="font-semibold"
                    placeholder="Section Title"
                  />
                </div>
                <Textarea
                  value={section.content || ""}
                  onChange={(e) => setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: e.target.value } : s))}
                  onBlur={() => updateSection(section.id, { content: section.content })}
                  rows={4}
                  placeholder="Write your content here... Supports **bold**, *italic*, and [links](url)"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Switch
                  checked={section.is_visible}
                  onCheckedChange={(v) => updateSection(section.id, { is_visible: v })}
                />
                <Button variant="ghost" size="icon" onClick={() => deleteSection(section.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {sections.length > 0 && (
        <Button onClick={() => setShowTemplates(true)} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Another Section
        </Button>
      )}
    </div>
  );
};

export default CustomSectionsManager;
