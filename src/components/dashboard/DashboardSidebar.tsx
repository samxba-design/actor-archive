import {
  Home, User, FolderOpen, Image, BarChart3, Settings, Eye, LogOut, Link2, Inbox,
  Briefcase, Trophy, GraduationCap, CalendarDays, Newspaper, Quote, Zap, Users, Lightbulb,
  FileText, Sparkles, PenTool, Heart, Compass, GitBranch, Bell, Share2
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
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
}

const mainNav: NavItem[] = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Profile", url: "/dashboard/profile", icon: User },
  { title: "Projects", url: "/dashboard/projects", icon: FolderOpen },
  { title: "Gallery", url: "/dashboard/gallery", icon: Image },
  { title: "Services", url: "/dashboard/services", icon: Briefcase },
  { title: "Social Links", url: "/dashboard/social", icon: Link2 },
];

const contentNav: NavItem[] = [
  { title: "Awards", url: "/dashboard/awards", icon: Trophy },
  { title: "Education", url: "/dashboard/education", icon: GraduationCap },
  { title: "Events", url: "/dashboard/events", icon: CalendarDays },
  { title: "Press", url: "/dashboard/press", icon: Newspaper },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: Quote },
  { title: "Skills", url: "/dashboard/skills", icon: Zap },
  { title: "Representation", url: "/dashboard/representation", icon: Users, visibleTo: ["actor", "screenwriter", "tv_writer", "playwright", "director_producer", "multi_hyphenate"] },
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
  { title: "Inbox", url: "/dashboard/inbox", icon: Inbox },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Insights", url: "/dashboard/insights", icon: Lightbulb },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [slug, setSlug] = useState<string | null>(null);
  const [profileType, setProfileType] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("slug, profile_type")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setSlug(data?.slug || null);
        setProfileType(data?.profile_type || null);
      });
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
                    {!collapsed && <span>{item.title}</span>}
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
