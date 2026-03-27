import {
  Home, User, FolderOpen, Image, BarChart3, Settings, Eye, LogOut, Link2, Inbox,
  Briefcase, Trophy, GraduationCap, CalendarDays, Newspaper, Quote, Zap, Users, Lightbulb,
  FileText, Sparkles, PenTool, Heart, Compass, GitBranch, Bell, Share2, Crown, Building2, Shield,
  Tv, Theater, BookOpen, Type, Clapperboard, Film, Video, Layers, ChevronRight, ChevronDown, Copy, Check,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PROFILE_TYPES } from "@/config/profileSections";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSubscription } from "@/hooks/useSubscription";
import { useProfileTypeContext } from "@/contexts/ProfileTypeContext";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  title: string;
  url: string;
  icon: any;
  visibleTo?: string[];
  countTable?: string;
  countUnread?: boolean;
}

const mainNav: NavItem[] = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Profile", url: "/dashboard/profile", icon: User },
  { title: "Projects", url: "/dashboard/projects", icon: FolderOpen, countTable: "projects" },
  { title: "Scripts & Docs", url: "/dashboard/scripts", icon: FileText },
  { title: "Gallery", url: "/dashboard/gallery", icon: Image, countTable: "gallery_images" },
  { title: "Demo Reels", url: "/dashboard/reels", icon: Video },
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
  { title: "Published Work", url: "/dashboard/published-work", icon: FileText, visibleTo: ["copywriter", "journalist", "multi_hyphenate"] },
  { title: "Collections", url: "/dashboard/collections", icon: FolderOpen, visibleTo: ["copywriter", "journalist", "multi_hyphenate"] },
  { title: "Representation", url: "/dashboard/representation", icon: Users, visibleTo: ["actor", "screenwriter", "tv_writer", "playwright", "director_producer", "multi_hyphenate"], countTable: "representation" },
  { title: "Custom Sections", url: "/dashboard/custom-sections", icon: Sparkles },
];

const toolsNav: NavItem[] = [
  { title: "Coverage Simulator", url: "/dashboard/coverage", icon: FileText, visibleTo: ["screenwriter", "tv_writer", "playwright", "multi_hyphenate"] },
  { title: "Comp Matcher", url: "/dashboard/comps", icon: Sparkles, visibleTo: ["screenwriter", "tv_writer", "director_producer", "multi_hyphenate"] },
  { title: "Case Study Builder", url: "/dashboard/case-study", icon: PenTool, visibleTo: ["copywriter", "corporate_video", "journalist", "multi_hyphenate"] },
  { title: "Pitch Email", url: "/dashboard/pitch-email", icon: FileText },
  { title: "Endorsements", url: "/dashboard/endorsements", icon: Heart },
  { title: "Industry Tools", url: "/dashboard/industry", icon: Compass },
];

const trackingNav: NavItem[] = [
  { title: "Pipeline Tracker", url: "/dashboard/pipeline", icon: GitBranch },
  { title: "Smart Follow-Up", url: "/dashboard/follow-up", icon: Bell },
  { title: "Embed & Share", url: "/dashboard/embed", icon: Share2 },
];

const systemNav: NavItem[] = [
  { title: "Inbox", url: "/dashboard/inbox", icon: Inbox, countTable: "contact_submissions", countUnread: true },
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
  const { profileType, slug } = useProfileTypeContext();
  const navigate = useNavigate();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileData, setProfileData] = useState<{ display_name: string | null; profile_photo_url: string | null } | null>(null);
  const [copied, setCopied] = useState(false);

  // Collapsible group state — auto-open groups that have populated items
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Portfolio: true,
    Content: true,
    "Smart Tools": false,
    Tracking: false,
    System: true,
  });

  useEffect(() => {
    if (!user) return;
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
      const countsObj = Object.fromEntries(results);
      setCounts(countsObj);

      // Auto-expand groups that have content
      const contentHasItems = contentNav.some(i => i.countTable && (countsObj[i.countTable] || 0) > 0);
      const toolsHasItems = toolsNav.length > 0; // always visible but collapsed by default
      setOpenGroups(prev => ({
        ...prev,
        Content: contentHasItems || prev.Content,
      }));
    };
    fetchCounts();

    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", user.id)
      .eq("is_read", false)
      .then(({ count }) => setUnreadCount(count || 0));

    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" })
      .then(({ data }) => setIsAdmin(data === true));

    supabase
      .from("profiles")
      .select("display_name, profile_photo_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => { if (data) setProfileData(data); });
  }, [user]);

  const filterItems = (items: NavItem[]) =>
    items.filter((item) => {
      if (!item.visibleTo || !profileType) return true;
      return item.visibleTo.includes(profileType);
    });

  const renderNavItems = (items: NavItem[]) =>
    items.map((item) => (
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
                {item.countUnread && unreadCount > 0 ? (
                  <span
                    className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "hsl(var(--primary))",
                      color: "hsl(var(--primary-foreground))",
                    }}
                    aria-label={`${unreadCount} unread`}
                  >
                    {unreadCount}
                  </span>
                ) : item.countTable && counts[item.countTable] !== undefined ? (
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
                ) : null}
              </>
            )}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  const renderCollapsibleGroup = (label: string, items: NavItem[]) => {
    const filtered = filterItems(items);
    if (filtered.length === 0) return null;
    const isOpen = openGroups[label] ?? true;

    if (collapsed) {
      return (
        <SidebarGroup key={label}>
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(filtered)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      );
    }

    return (
      <Collapsible
        key={label}
        open={isOpen}
        onOpenChange={(open) => setOpenGroups(prev => ({ ...prev, [label]: open }))}
      >
        <SidebarGroup>
          <CollapsibleTrigger asChild>
            <SidebarGroupLabel className="cursor-pointer select-none flex items-center justify-between group/label hover:text-foreground transition-colors">
              <span>{label}</span>
              <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`} />
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>{renderNavItems(filtered)}</SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    );
  };

  // Portfolio group is always expanded (main nav)
  const renderMainGroup = (label: string, items: NavItem[]) => {
    const filtered = filterItems(items);
    if (filtered.length === 0) return null;
    return (
      <SidebarGroup key={label}>
        <SidebarGroupLabel>{!collapsed && label}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>{renderNavItems(filtered)}</SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  const SIDEBAR_ICON_MAP: Record<string, React.ElementType> = {
    PenTool, Tv, Theater, BookOpen, Newspaper, Type,
    Clapperboard, Film, Video, Layers,
  };

  const currentTypeConfig = PROFILE_TYPES.find(pt => pt.key === profileType);
  const TypeIcon = currentTypeConfig ? (SIDEBAR_ICON_MAP[currentTypeConfig.icon] || PenTool) : null;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* User Identity */}
        {profileData && (
          <div className={`px-2 pt-3 pb-1 ${collapsed ? "flex justify-center" : ""}`}>
            <div className={`flex items-center gap-2.5 ${collapsed ? "" : "px-2"}`}>
              {profileData.profile_photo_url ? (
                <img
                  src={profileData.profile_photo_url}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover shrink-0 ring-2 ring-primary/20"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 ring-2 ring-primary/20">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {profileData.display_name || user?.email?.split("@")[0] || "Your Profile"}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Portfolio — promoted */}
        {slug && (
          <div className="px-2 pt-1 pb-1">
            <Button
              size="sm"
              className={`w-full font-semibold border-0 text-white hover:shadow-lg hover:scale-[1.01] ${collapsed ? "px-2" : ""}`}
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))" }}
              onClick={() => window.open(`/p/${slug}`, "_blank")}
            >
              <Eye className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="ml-2">View Portfolio</span>}
            </Button>
          </div>
        )}

        {/* Profile Type Badge */}
        {currentTypeConfig && (
          <div className="px-2 pt-1 pb-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate("/dashboard/settings")}
                  className={`w-full flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 transition-all hover:bg-primary/10 hover:border-primary/40 group ${collapsed ? "justify-center px-2" : ""}`}
                >
                  {TypeIcon && <TypeIcon className="h-4 w-4 shrink-0 text-primary" />}
                  {!collapsed && (
                    <>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{currentTypeConfig.label}</p>
                        <p className="text-[10px] text-muted-foreground truncate">Purpose-built portfolio</p>
                      </div>
                      <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                    </>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs">Your sections, labels, and tools are tailored for <strong>{currentTypeConfig.label}</strong></p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Click to switch type</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {renderMainGroup("Portfolio", mainNav)}
        {renderCollapsibleGroup("Content", contentNav)}
        {renderCollapsibleGroup("Smart Tools", toolsNav)}
        {renderCollapsibleGroup("Tracking", trackingNav)}
        {renderMainGroup("System", systemNav)}
      </SidebarContent>

      <SidebarFooter className="p-2 space-y-1">
        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start border-destructive/30 text-destructive hover:bg-destructive/10"
            asChild
          >
            <Link to="/admin">
              <Shield className="mr-2 h-4 w-4 shrink-0" />
              {!collapsed && <span>Admin Panel</span>}
            </Link>
          </Button>
        )}
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
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={() => {
              const url = `${window.location.origin}/p/${slug}`;
              navigator.clipboard.writeText(url).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              });
            }}
          >
            {copied ? (
              <Check className="mr-2 h-4 w-4 shrink-0 text-green-500" />
            ) : (
              <Copy className="mr-2 h-4 w-4 shrink-0" />
            )}
            {!collapsed && <span>{copied ? "Copied!" : "Copy portfolio link"}</span>}
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
        </Button>      </SidebarFooter>
    </Sidebar>
  );
}
