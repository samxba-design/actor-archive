import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { format, subDays, startOfDay } from "date-fns";

interface DailyStats {
  date: string;
  signups: number;
  pageViews: number;
  contacts: number;
}

interface ProfileTypeStats {
  type: string;
  count: number;
}

interface TierStats {
  tier: string;
  count: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

export default function AdminAnalytics() {
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [profileTypeStats, setProfileTypeStats] = useState<ProfileTypeStats[]>([]);
  const [tierStats, setTierStats] = useState<TierStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Get last 30 days of data
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

      // Fetch signups per day
      const { data: profiles } = await supabase
        .from("profiles")
        .select("created_at, profile_type, subscription_tier")
        .gte("created_at", thirtyDaysAgo);

      // Fetch page views per day
      const { data: pageViews } = await supabase
        .from("page_views")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo);

      // Fetch contacts per day
      const { data: contacts } = await supabase
        .from("contact_submissions")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo);

      // Aggregate daily stats
      const dailyMap = new Map<string, DailyStats>();
      for (let i = 0; i < 30; i++) {
        const date = format(subDays(new Date(), i), "yyyy-MM-dd");
        dailyMap.set(date, { date, signups: 0, pageViews: 0, contacts: 0 });
      }

      profiles?.forEach((p) => {
        const date = format(new Date(p.created_at!), "yyyy-MM-dd");
        const stat = dailyMap.get(date);
        if (stat) stat.signups++;
      });

      pageViews?.forEach((pv) => {
        const date = format(new Date(pv.created_at!), "yyyy-MM-dd");
        const stat = dailyMap.get(date);
        if (stat) stat.pageViews++;
      });

      contacts?.forEach((c) => {
        const date = format(new Date(c.created_at!), "yyyy-MM-dd");
        const stat = dailyMap.get(date);
        if (stat) stat.contacts++;
      });

      setDailyStats(Array.from(dailyMap.values()).reverse());

      // Aggregate profile type stats (from all profiles, not just last 30 days)
      const { data: allProfiles } = await supabase
        .from("profiles")
        .select("profile_type, subscription_tier");

      const typeMap = new Map<string, number>();
      const tierMap = new Map<string, number>();

      allProfiles?.forEach((p) => {
        const type = p.profile_type || "unknown";
        const tier = p.subscription_tier || "free";
        typeMap.set(type, (typeMap.get(type) || 0) + 1);
        tierMap.set(tier, (tierMap.get(tier) || 0) + 1);
      });

      setProfileTypeStats(Array.from(typeMap.entries()).map(([type, count]) => ({ type, count })));
      setTierStats(Array.from(tierMap.entries()).map(([tier, count]) => ({ tier, count })));

      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground">Platform-wide metrics and trends</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity (Last 30 Days)</CardTitle>
              <CardDescription>Signups, page views, and contact submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(v) => format(new Date(v), "MMM d")} />
                    <YAxis />
                    <Tooltip labelFormatter={(v) => format(new Date(v), "MMM d, yyyy")} />
                    <Line type="monotone" dataKey="signups" stroke="#0088FE" name="Signups" />
                    <Line type="monotone" dataKey="pageViews" stroke="#00C49F" name="Page Views" />
                    <Line type="monotone" dataKey="contacts" stroke="#FFBB28" name="Contacts" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Users by Profile Type</CardTitle>
                <CardDescription>Distribution of user categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={profileTypeStats}
                        dataKey="count"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ type, count }) => `${type}: ${count}`}
                      >
                        {profileTypeStats.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Users by Subscription Tier</CardTitle>
                <CardDescription>Free vs paid distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tierStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tier" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884D8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Signups</CardTitle>
              <CardDescription>New user registrations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(v) => format(new Date(v), "MMM d")} />
                    <YAxis />
                    <Tooltip labelFormatter={(v) => format(new Date(v), "MMM d, yyyy")} />
                    <Bar dataKey="signups" fill="#0088FE" name="Signups" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
