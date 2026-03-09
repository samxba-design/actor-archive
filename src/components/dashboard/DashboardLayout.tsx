import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Outlet } from "react-router-dom";
import DashboardTour from "./DashboardTour";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";
import { Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const shortcuts = useKeyboardShortcuts(true);

  // Add ? shortcut to show help
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
      const target = e.target as HTMLElement;
      if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
        e.preventDefault();
        setShowShortcuts(true);
      }
    }
  };

  useState(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" style={{ background: "hsl(var(--landing-bg))", color: "hsl(var(--landing-fg))" }}>
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b px-4 shrink-0" style={{ borderColor: "hsl(var(--landing-border))", background: "hsl(var(--landing-bg) / 0.9)", backdropFilter: "blur(12px)" }}>
            <SidebarTrigger className="text-current" />
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowShortcuts(true)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Keyboard shortcuts (?)"
              >
                <Keyboard className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
            <DashboardTour />
          </main>
        </div>
      </div>
      <KeyboardShortcutsHelp open={showShortcuts} onOpenChange={setShowShortcuts} shortcuts={shortcuts} />
    </SidebarProvider>
  );
}
