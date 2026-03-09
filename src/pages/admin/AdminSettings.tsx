import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, RefreshCw } from "lucide-react";

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

  const updateValue = (key: string, value: any) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }));
  };

  const renderSettingInput = (setting: Setting) => {
    const value = editedValues[setting.key];
    const isBoolean = value === "true" || value === "false" || typeof value === "boolean";
    const isNumber = !isNaN(Number(value)) && typeof value !== "boolean";

    if (isBoolean) {
      const boolValue = value === "true" || value === true;
      return (
        <Switch
          checked={boolValue}
          onCheckedChange={(checked) => updateValue(setting.key, checked ? "true" : "false")}
        />
      );
    }

    return (
      <Input
        type={isNumber ? "number" : "text"}
        value={typeof value === "string" ? value.replace(/^"|"$/g, "") : value}
        onChange={(e) => {
          const newValue = isNumber ? e.target.value : `"${e.target.value}"`;
          updateValue(setting.key, newValue);
        }}
      />
    );
  };

  const categories = [...new Set(settings.map((s) => s.category))];

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
          <Button variant="outline" onClick={fetchSettings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

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
                      <div className="w-48">
                        {renderSettingInput(setting)}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
