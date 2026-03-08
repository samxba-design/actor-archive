import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, Globe, Monitor, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradeGate } from "@/components/UpgradeGate";
import { format } from "date-fns";

const COLORS = ["hsl(var(--primary))", "hsl(var(--muted-foreground))", "hsl(var(--accent))", "hsl(var(--destructive))", "hsl(var(--secondary))"];

const AnalyticsOverview = () => {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [dailyViews, setDailyViews] = useState<{ date: string; views: number }[]>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<{ name: string; value: number }[]>([]);
  const [topReferrers, setTopReferrers] = useState<{ referrer: string; count: number }[]>([]);
  const [topCountries, setTopCountries] = useState<{ country: string; count: number }[]>([]);
  const [topCities, setTopCities] = useState<{ city: string; count: number }[]>([]);
  const [downloads, setDownloads] = useState<{ downloader_name: string | null; downloader_email: string | null; document_url: string | null; created_at: string | null }[]>([]);
  const [totalDownloads, setTotalDownloads] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchAnalytics = async () => {
      const { data: views } = await supabase
        .from("page_views")
        .select("created_at, device_type, referrer, country, city")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1000);

      if (!views) { setLoading(false); return; }

      setTotalViews(views.length);

      // Daily views (last 30 days)
      const dailyMap: Record<string, number> = {};
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dailyMap[d.toISOString().split("T")[0]] = 0;
      }
      views.forEach((v) => {
        const day = v.created_at?.split("T")[0];
        if (day && dailyMap[day] !== undefined) dailyMap[day]++;
      });
      setDailyViews(Object.entries(dailyMap).map(([date, views]) => ({
        date: new Date(date).toLocaleDateString("en", { month: "short", day: "numeric" }),
        views,
      })));

      // Device breakdown
      const devices: Record<string, number> = {};
      views.forEach((v) => {
        const d = v.device_type || "unknown";
        devices[d] = (devices[d] || 0) + 1;
      });
      setDeviceBreakdown(Object.entries(devices).map(([name, value]) => ({ name, value })));

      // Top referrers
      const refs: Record<string, number> = {};
      views.forEach((v) => {
        const r = v.referrer || "Direct";
        try {
          const host = r === "Direct" ? r : new URL(r).hostname;
          refs[host] = (refs[host] || 0) + 1;
        } catch {
          refs[r] = (refs[r] || 0) + 1;
        }
      });
      setTopReferrers(
        Object.entries(refs)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([referrer, count]) => ({ referrer, count }))
      );

      // Geographic breakdown
      const countries: Record<string, number> = {};
      const cities: Record<string, number> = {};
      views.forEach((v) => {
        const c = v.country || "Unknown";
        countries[c] = (countries[c] || 0) + 1;
        const city = v.city || "Unknown";
        if (city !== "Unknown") cities[city] = (cities[city] || 0) + 1;
      });
      setTopCountries(
        Object.entries(countries)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([country, count]) => ({ country, count }))
      );
      setTopCities(
        Object.entries(cities)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([city, count]) => ({ city, count }))
      );

      // Fetch download logs
      const { data: dlData } = await supabase
        .from("download_logs")
        .select("downloader_name, downloader_email, document_url, created_at")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      setDownloads(dlData || []);
      setTotalDownloads(dlData?.length || 0);

      setLoading(false);
    };
    fetchAnalytics();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Eye className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{totalViews}</p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Globe className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{topReferrers[0]?.referrer || "—"}</p>
              <p className="text-sm text-muted-foreground">Top Referrer</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Monitor className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {deviceBreakdown.sort((a, b) => b.value - a.value)[0]?.name || "—"}
              </p>
              <p className="text-sm text-muted-foreground">Top Device</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <UpgradeGate feature="full_analytics" label="Full Analytics">
      <Card>
        <CardHeader><CardTitle>Views (Last 30 Days)</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyViews}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Devices</CardTitle></CardHeader>
          <CardContent>
            {deviceBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet</p>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={deviceBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {deviceBreakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Referrers</CardTitle></CardHeader>
          <CardContent>
            {topReferrers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet</p>
            ) : (
              <div className="space-y-3">
                {topReferrers.map((r) => (
                  <div key={r.referrer} className="flex items-center justify-between">
                    <span className="text-sm text-foreground truncate">{r.referrer}</span>
                    <span className="text-sm font-medium text-muted-foreground">{r.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Top Countries</CardTitle></CardHeader>
          <CardContent>
            {topCountries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No geographic data yet</p>
            ) : (
              <div className="space-y-3">
                {topCountries.map((c) => (
                  <div key={c.country} className="flex items-center justify-between">
                    <span className="text-sm text-foreground truncate">{c.country}</span>
                    <span className="text-sm font-medium text-muted-foreground">{c.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Cities</CardTitle></CardHeader>
          <CardContent>
            {topCities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No city data yet</p>
            ) : (
              <div className="space-y-3">
                {topCities.map((c) => (
                  <div key={c.city} className="flex items-center justify-between">
                    <span className="text-sm text-foreground truncate">{c.city}</span>
                    <span className="text-sm font-medium text-muted-foreground">{c.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </UpgradeGate>
    </div>
  );
};

export default AnalyticsOverview;
