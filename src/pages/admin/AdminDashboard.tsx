import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderOpen, Flag, Eye, TrendingUp, AlertTriangle } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalProjects: number;
  totalPageViews: number;
  pendingFlags: number;
  suspendedUsers: number;
  recentSignups: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProjects: 0,
    totalPageViews: 0,
    pendingFlags: 0,
    suspendedUsers: 0,
    recentSignups: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: totalUsers },
        { count: totalProjects },
        { count: totalPageViews },
        { count: pendingFlags },
        { count: suspendedUsers },
        { count: recentSignups },
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("page_views").select("id", { count: "exact", head: true }),
        supabase.from("content_flags").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_suspended", true),
        supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      setStats({
        totalUsers: totalUsers || 0,
        totalProjects: totalProjects || 0,
        totalPageViews: totalPageViews || 0,
        pendingFlags: pendingFlags || 0,
        suspendedUsers: suspendedUsers || 0,
        recentSignups: recentSignups || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500" },
    { label: "Total Projects", value: stats.totalProjects, icon: FolderOpen, color: "text-green-500" },
    { label: "Page Views", value: stats.totalPageViews, icon: Eye, color: "text-purple-500" },
    { label: "Pending Flags", value: stats.pendingFlags, icon: Flag, color: "text-orange-500" },
    { label: "Suspended Users", value: stats.suspendedUsers, icon: AlertTriangle, color: "text-red-500" },
    { label: "Signups (7 days)", value: stats.recentSignups, icon: TrendingUp, color: "text-emerald-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and quick stats</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/admin/users" className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="font-medium">Manage Users</div>
              <div className="text-sm text-muted-foreground">View, edit, or suspend user accounts</div>
            </a>
            <a href="/admin/moderation" className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="font-medium">Review Flagged Content</div>
              <div className="text-sm text-muted-foreground">{stats.pendingFlags} items pending review</div>
            </a>
            <a href="/admin/settings" className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="font-medium">Platform Settings</div>
              <div className="text-sm text-muted-foreground">Configure limits, features, and more</div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Platform health indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <span className="text-sm text-green-500 font-medium">● Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Authentication</span>
              <span className="text-sm text-green-500 font-medium">● Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage</span>
              <span className="text-sm text-green-500 font-medium">● Available</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Edge Functions</span>
              <span className="text-sm text-green-500 font-medium">● Running</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
