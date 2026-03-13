import { Users, Flag, BarChart3, Settings, Home, LogOut, Shield, History, UserCog, Palette } from "lucide-react";
import { NavLink } from "@/components/NavLink";
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

const adminNav = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "User Management", url: "/admin/users", icon: Users },
  { title: "Role Management", url: "/admin/roles", icon: UserCog },
  { title: "Content Moderation", url: "/admin/moderation", icon: Flag },
  { title: "Audit Logs", url: "/admin/audit-logs", icon: History },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Demo Profiles", url: "/admin/demo-profiles", icon: Palette },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-destructive/20">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-destructive">
            {!collapsed && (
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Panel
              </span>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
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
      </SidebarContent>
      <SidebarFooter className="p-2 space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => window.location.href = "/dashboard"}
        >
          <Home className="mr-2 h-4 w-4 shrink-0" />
          {!collapsed && <span>Back to Dashboard</span>}
        </Button>
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
