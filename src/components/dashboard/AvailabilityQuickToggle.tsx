import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Zap } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "Available for Work", label: "Available for Work" },
  { value: "Open to Opportunities", label: "Open to Opportunities" },
  { value: "Available for Hire", label: "Available for Hire" },
  { value: "Seeking Representation", label: "Seeking Representation" },
  { value: "Actively Auditioning", label: "Actively Auditioning" },
  { value: "Booking Now", label: "Booking Now" },
  { value: "In Production", label: "In Production" },
  { value: "Unavailable", label: "Unavailable" },
];

const AvailabilityQuickToggle = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [statusText, setStatusText] = useState("Available for Work");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("available_for_hire, professional_status")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setEnabled(data.available_for_hire || false);
          setStatusText(data.professional_status || "Available for Work");
        }
        setLoading(false);
      });
  }, [user]);

  const handleToggle = async (value: boolean) => {
    setEnabled(value);
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        available_for_hire: value,
        professional_status: value ? statusText : null,
      } as any)
      .eq("id", user!.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: value ? "Status badge visible on portfolio" : "Status badge hidden" });
    }
  };

  const handleStatusChange = async (value: string) => {
    setStatusText(value);
    if (!enabled) return;
    setSaving(true);
    await supabase
      .from("profiles")
      .update({ professional_status: value } as any)
      .eq("id", user!.id);
    setSaving(false);
    toast({ title: "Status updated" });
  };

  if (loading) return null;

  return (
    <div className="rounded-xl border border-border p-5 bg-card/60 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-green-500/10 p-1.5">
            <Zap className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Availability Badge</p>
            <p className="text-xs text-muted-foreground">Shows on your public portfolio hero</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            id="availability-toggle"
            aria-label="Toggle availability badge"
          />
        </div>
      </div>

      {enabled && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Status text</Label>
          <Select value={statusText} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Badge is live on your portfolio
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityQuickToggle;
