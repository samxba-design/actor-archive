import {
  Home, User, FolderOpen, Image, BarChart3, Settings, Eye, LogOut, Link2, Inbox,
  Briefcase, Trophy, GraduationCap, CalendarDays, Newspaper, Quote, Zap, Users, Lightbulb,
  FileText, Sparkles, PenTool, Heart, Compass, GitBranch, Bell, Share2, Crown, Building2
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NavItem {
  title: string;
  url: string;
  icon: any;
  /** Profile types that should see this item. Undefined = all types see it. */
  visibleTo?: string[];
  /** Table name to count items for badge. */
  countTable?: string;
}

const mainNav: NavItem[] = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Profile", url: "/dashboard/profile", icon: User },
  { title: "Projects", url: "/dashboard/projects", icon: FolderOpen, countTable: "projects" },
  { title: "Scripts & Docs", url: "/dashboard/scripts", icon: FileText },
  { title: "Gallery", url: "/dashboard/gallery", icon: Image, countTable: "gallery_images" },
  { title: "Services", url: "/dashboard/services", icon: Briefcase, countTable: "services" },
  { title: "Social Links", url: "/dashboard/social", icon: Link2, countTable: "social_links" },
  { title: "Clients", url: "/dashboard/clients", icon: Building2, countTable: "client_logos_profile" },
];

const contentNav: NavItem[] = [
  { title: "Awards", url: "/dashboard/awards", icon: Trophy, countTable: "awards" },
  { title: "Education", url: "/dashboard/education", icon: GraduationCap, countTable: "education" },
  { title: "Events", url: "/dashboard/events", icon: CalendarDays, countTable: "events" },
  { title: "Press", url: "/dashboard/press", icon: Newspaper, countTable: "press" },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: Quote, countTable: "testimonials" },
  { title: "Skills", url: "/dashboard/skills", icon: Zap, countTable: "skills" },
  { title: "Representation", url: "/dashboard/representation", icon: Users, visibleTo: ["actor", "screenwriter", "tv_writer", "playwright", "director_producer", "multi_hyphenate"], countTable: "representation" },
];

const toolsNav: NavItem[] = [
  { title: "Coverage Simulator", url: "/dashboard/coverage", icon: FileText, visibleTo: ["screenwriter", "tv_writer", "playwright", "multi_hyphenate"] },
  { title: "Comp Matcher", url: "/dashboard/comps", icon: Sparkles, visibleTo: ["screenwriter", "tv_writer", "director_producer", "multi_hyphenate"] },
  { title: "Case Study Builder", url: "/dashboard/case-study", icon: PenTool, visibleTo: ["copywriter", "corporate_video", "journalist", "multi_hyphenate"] },
  { title: "Endorsements", url: "/dashboard/endorsements", icon: Heart },
  { title: "Industry Tools", url: "/dashboard/industry", icon: Compass },
];

const trackingNav: NavItem[] = [
  { title: "Pipeline Tracker", url: "/dashboard/pipeline", icon: GitBranch },
  { title: "Smart Follow-Up", url: "/dashboard/follow-up", icon: Bell },
  { title: "Embed & Share", url: "/dashboard/embed", icon: Share2 },
];

const systemNav: NavItem[] = [
  { title: "Inbox", url: "/dashboard/inbox", icon: Inbox, countTable: "contact_submissions" },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Insights", url: "/dashboard/insights", icon: Lightbulb },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const COUNTABLE_TABLES = [
  "projects", "gallery_images", "services", "social_links",
  "awards", "education", "events", "press", "testimonials",
  "skills", "representation", "contact_submissions", "client_logos_profile",
] as const;

type CountableTable = typeof COUNTABLE_TABLES[number];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, signOut } = useAuth();
  const { isPro, tier } = useSubscription();
  const navigate = useNavigate();
  const [slug, setSlug] = useState<string | null>(null);
  const [profileType, setProfileType] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) return;

    // Fetch profile info
    supabase
      .from("profiles")
      .select("slug, profile_type")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setSlug(data?.slug || null);
        setProfileType(data?.profile_type || null);
      });

    // Fetch counts for all countable tables in parallel
    const fetchCounts = async () => {
      const results = await Promise.all(
        COUNTABLE_TABLES.map(table =>
          supabase
            .from(table)
            .select("id", { count: "exact", head: true })
            .eq("profile_id", user.id)
            .then(res => [table, res.count || 0] as [string, number])
        )
      );
      setCounts(Object.fromEntries(results));
    };
    fetchCounts();
  }, [user]);

  const filterItems = (items: NavItem[]) =>
    items.filter((item) => {
      if (!item.visibleTo || !profileType) return true;
      return item.visibleTo.includes(profileType);
    });

  const renderGroup = (label: string, items: NavItem[]) => {
    const filtered = filterItems(items);
    if (filtered.length === 0) return null;
    return (
      <SidebarGroup key={label}>
        <SidebarGroupLabel>{!collapsed && label}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {filtered.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.url}
                    end={item.url === "/dashboard"}
                    className="hover:bg-accent/50"
                    activeClassName="bg-accent text-accent-foreground font-medium"
                  >
                    <item.icon className="mr-2 h-4 w-4 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.countTable && counts[item.countTable] !== undefined && (
                          <span
                            className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                            style={{
                              background: counts[item.countTable] === 0
                                ? "hsl(var(--destructive) / 0.15)"
                                : "hsl(var(--muted))",
                              color: counts[item.countTable] === 0
                                ? "hsl(var(--destructive))"
                                : "hsl(var(--muted-foreground))",
                            }}
                          >
                            {counts[item.countTable]}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {renderGroup("Portfolio", mainNav)}
        {renderGroup("Content", contentNav)}
        {renderGroup("Smart Tools", toolsNav)}
        {renderGroup("Tracking", trackingNav)}
        {renderGroup("System", systemNav)}
      </SidebarContent>

      <SidebarFooter className="p-2 space-y-1">
        {!isPro && (
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start border-primary/30 text-primary hover:bg-primary/10"
            asChild
          >
            <Link to="/pricing">
              <Crown className="mr-2 h-4 w-4 shrink-0" />
              {!collapsed && <span>Upgrade to Pro</span>}
            </Link>
          </Button>
        )}
        {isPro && !collapsed && (
          <div className="px-2 py-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
              <Crown className="h-2.5 w-2.5" /> PRO
            </span>
          </div>
        )}
        {slug && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => window.open(`/p/${slug}`, "_blank")}
          >
            <Eye className="mr-2 h-4 w-4 shrink-0" />
            {!collapsed && <span>View Portfolio</span>}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
