import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, RefreshCw, Plus, Trash2 } from "lucide-react";

interface Setting {
  id: string;
  key: string;
  value: any;
  description: string | null;
  category: string;
}

export default function AdminSettings() {
  const { user: adminUser } = useAdmin();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, any>>({});
  const [addDialog, setAddDialog] = useState(false);
  const [newSetting, setNewSetting] = useState({ key: "", value: "", description: "", category: "general", type: "string" });

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("platform_settings")
      .select("*")
      .order("category", { ascending: true });

    if (error) {
      toast.error("Failed to fetch settings");
    } else {
      setSettings(data || []);
      const values: Record<string, any> = {};
      data?.forEach((s) => {
        values[s.key] = s.value;
      });
      setEditedValues(values);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!adminUser) return;
    setSaving(true);

    for (const setting of settings) {
      if (editedValues[setting.key] !== setting.value) {
        const { error } = await supabase
          .from("platform_settings")
          .update({
            value: editedValues[setting.key],
            updated_by: adminUser.id,
          })
          .eq("key", setting.key);

        if (error) {
          toast.error(`Failed to save ${setting.key}`);
          setSaving(false);
          return;
        }

        await supabase.from("admin_audit_logs").insert({
          admin_id: adminUser.id,
          action_type: "setting_change",
          target_type: "setting",
          details: {
            key: setting.key,
            old_value: setting.value,
            new_value: editedValues[setting.key],
          },
        });
      }
    }

    toast.success("Settings saved");
    fetchSettings();
    setSaving(false);
  };

  const handleAddSetting = async () => {
    if (!adminUser || !newSetting.key) return;

    let value: any = newSetting.value;
    if (newSetting.type === "boolean") {
      value = newSetting.value === "true";
    } else if (newSetting.type === "number") {
      value = Number(newSetting.value);
    }

    const { error } = await supabase
      .from("platform_settings")
      .insert({
        key: newSetting.key,
        value: value,
        description: newSetting.description || null,
        category: newSetting.category,
        updated_by: adminUser.id,
      });

    if (error) {
      if (error.code === "23505") {
        toast.error("Setting key already exists");
      } else {
        toast.error("Failed to add setting");
      }
    } else {
      toast.success("Setting added");
      setAddDialog(false);
      setNewSetting({ key: "", value: "", description: "", category: "general", type: "string" });
      fetchSettings();
    }
  };

  const handleDeleteSetting = async (setting: Setting) => {
    if (!adminUser) return;

    const { error } = await supabase
      .from("platform_settings")
      .delete()
      .eq("id", setting.id);

    if (error) {
      toast.error("Failed to delete setting");
    } else {
      await supabase.from("admin_audit_logs").insert({
        admin_id: adminUser.id,
        action_type: "setting_delete",
        target_type: "setting",
        details: { key: setting.key },
      });

      toast.success("Setting deleted");
      fetchSettings();
    }
  };

  const updateValue = (key: string, value: any) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }));
  };

  const renderSettingInput = (setting: Setting) => {
    const value = editedValues[setting.key];
    const isBoolean = value === true || value === false || value === "true" || value === "false";
    const isNumber = typeof value === "number" || (!isBoolean && !isNaN(Number(value)) && value !== "");

    if (isBoolean) {
      const boolValue = value === "true" || value === true;
      return (
        <Switch
          checked={boolValue}
          onCheckedChange={(checked) => updateValue(setting.key, checked)}
        />
      );
    }

    return (
      <Input
        type={isNumber ? "number" : "text"}
        value={value ?? ""}
        onChange={(e) => {
          const newValue = isNumber ? Number(e.target.value) : e.target.value;
          updateValue(setting.key, newValue);
        }}
      />
    );
  };

  const categories = [...new Set(settings.map((s) => s.category))];
  const hasChanges = settings.some(s => editedValues[s.key] !== s.value);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground">Configure platform-wide settings and limits</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Setting
          </Button>
          <Button variant="outline" onClick={fetchSettings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={saving || !hasChanges}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No settings configured. Click "Add Setting" to create one.
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={categories[0]}>
          <TabsList>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{category} Settings</CardTitle>
                  <CardDescription>
                    Configure {category} related settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {settings
                    .filter((s) => s.category === category)
                    .map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between space-x-4">
                        <div className="flex-1">
                          <Label htmlFor={setting.key} className="font-medium">
                            {setting.key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Label>
                          {setting.description && (
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-48">
                            {renderSettingInput(setting)}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSetting(setting)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Add Setting Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Setting</DialogTitle>
            <DialogDescription>
              Create a new platform configuration setting.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Key</Label>
              <Input
                placeholder="setting_key"
                value={newSetting.key}
                onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value.toLowerCase().replace(/\s/g, "_") }))}
              />
            </div>

            <div>
              <Label>Type</Label>
              <Select value={newSetting.type} onValueChange={(v) => setNewSetting(prev => ({ ...prev, type: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Value</Label>
              {newSetting.type === "boolean" ? (
                <Select value={newSetting.value} onValueChange={(v) => setNewSetting(prev => ({ ...prev, value: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={newSetting.type === "number" ? "number" : "text"}
                  placeholder="Enter value"
                  value={newSetting.value}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                />
              )}
            </div>

            <div>
              <Label>Category</Label>
              <Select value={newSetting.category} onValueChange={(v) => setNewSetting(prev => ({ ...prev, category: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="limits">Limits</SelectItem>
                  <SelectItem value="features">Features</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description (optional)</Label>
              <Input
                placeholder="Describe this setting..."
                value={newSetting.description}
                onChange={(e) => setNewSetting(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSetting} disabled={!newSetting.key}>
              Add Setting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
