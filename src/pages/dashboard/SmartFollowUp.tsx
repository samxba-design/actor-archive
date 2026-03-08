import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, Download, Clock, MapPin, Monitor, Smartphone, Globe } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { UpgradeGate } from "@/components/UpgradeGate";

interface ViewEntry {
  id: string;
  path: string | null;
  referrer: string | null;
  device_type: string | null;
  city: string | null;
  country: string | null;
  created_at: string | null;
}

interface DownloadEntry {
  id: string;
  document_url: string | null;
  downloader_email: string | null;
  downloader_name: string | null;
  created_at: string | null;
}

const SmartFollowUp = () => {
  const { user } = useAuth();
  const [views, setViews] = useState<ViewEntry[]>([]);
  const [downloads, setDownloads] = useState<DownloadEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("page_views").select("*").eq("profile_id", user.id).order("created_at", { ascending: false }).limit(50),
      supabase.from("download_logs").select("*").eq("profile_id", user.id).order("created_at", { ascending: false }).limit(20),
    ]).then(([viewsRes, dlRes]) => {
      setViews(viewsRes.data || []);
      setDownloads(dlRes.data || []);
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  const recentViews = views.slice(0, 20);
  const viewsByDay = recentViews.reduce((acc, v) => {
    const day = v.created_at ? format(new Date(v.created_at), "MMM d, yyyy") : "Unknown";
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deviceIcon = (type: string | null) => {
    if (type === "mobile") return <Smartphone className="h-3 w-3" />;
    if (type === "desktop") return <Monitor className="h-3 w-3" />;
    return <Globe className="h-3 w-3" />;
  };

  return (
    <UpgradeGate feature="smart_followup" label="Smart Follow-Up">
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Smart Follow-Up</h1>
        <p className="text-muted-foreground mt-1">See who's viewing your portfolio and downloading your materials.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Eye className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{views.length}</p>
            <p className="text-xs text-muted-foreground">Recent Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Download className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{downloads.length}</p>
            <p className="text-xs text-muted-foreground">Downloads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{Object.keys(viewsByDay).length}</p>
            <p className="text-xs text-muted-foreground">Active Days</p>
          </CardContent>
        </Card>
      </div>

      {/* Downloads with contact info */}
      {downloads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Script Downloads
            </CardTitle>
            <CardDescription>People who downloaded your materials — follow up!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {downloads.map((dl) => (
              <div key={dl.id} className="flex items-center justify-between p-3 rounded-md border">
                <div>
                  <p className="text-sm font-medium">{dl.downloader_name || "Anonymous"}</p>
                  {dl.downloader_email && <p className="text-xs text-primary">{dl.downloader_email}</p>}
                  {dl.document_url && (
                    <p className="text-xs text-muted-foreground truncate max-w-[300px]">{dl.document_url.split("/").pop()}</p>
                  )}
                </div>
                <div className="text-right">
                  {dl.created_at && (
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(dl.created_at), { addSuffix: true })}</p>
                  )}
                  {dl.downloader_email && (
                    <a
                      href={`mailto:${dl.downloader_email}?subject=Following up on your download`}
                      className="text-xs text-primary hover:underline"
                    >
                      Send Follow-Up →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Views */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Recent Profile Views
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentViews.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No views recorded yet. Share your portfolio link!</p>
          ) : (
            recentViews.map((v) => (
              <div key={v.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-2">
                  {deviceIcon(v.device_type)}
                  <span className="text-sm">{v.path || "/"}</span>
                  {v.referrer && <Badge variant="outline" className="text-xs">{new URL(v.referrer).hostname}</Badge>}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {v.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{v.city}</span>}
                  {v.created_at && <span>{formatDistanceToNow(new Date(v.created_at), { addSuffix: true })}</span>}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
    </UpgradeGate>
  );
};

export default SmartFollowUp;
