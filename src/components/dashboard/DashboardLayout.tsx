import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Outlet, useLocation } from "react-router-dom";
import GettingStartedGuide from "./GettingStartedGuide";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";
import { Keyboard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { ProfileTypeProvider, useProfileTypeContext } from "@/contexts/ProfileTypeContext";
import NotificationBell from "./NotificationBell";
import CommandPalette from "./CommandPalette";

function DashboardLayoutInner() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const shortcuts = useKeyboardShortcuts(true);
  const { slug } = useProfileTypeContext();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Add ? shortcut to show help
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          setShowShortcuts(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <SidebarProvider>
      <div className="dashboard-shell min-h-screen flex w-full bg-background text-foreground">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border px-4 shrink-0 bg-background/90 backdrop-blur-xl">
            <SidebarTrigger className="text-foreground" />
            <div className="ml-auto flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        if (slug) {
                          window.open(`/p/${slug}`, "_blank");
                        }
                      }}
                      disabled={!slug}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Live Edit
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {slug ? `Open live profile /p/${slug} in new tab` : "Set your URL slug in Settings first"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <NotificationBell />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowShortcuts(true)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Keyboard shortcuts (?)"
              >
                <Keyboard className="h-4 w-4" />
              </Button>
              {/* ⌘K hint */}
              <span className="hidden lg:inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded border text-muted-foreground/60 border-border/50 select-none cursor-default">
                <span className="font-mono">⌘K</span>
              </span>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
            <GettingStartedGuide />
          </main>
        </div>
      </div>
      <KeyboardShortcutsHelp open={showShortcuts} onOpenChange={setShowShortcuts} shortcuts={shortcuts} />
      <CommandPalette />
    </SidebarProvider>
  );
}

export default function DashboardLayout() {
  return (
    <ProfileTypeProvider>
      <DashboardLayoutInner />
    </ProfileTypeProvider>
  );
}
