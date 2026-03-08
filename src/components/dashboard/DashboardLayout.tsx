import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Outlet } from "react-router-dom";
import DashboardTour from "./DashboardTour";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" style={{ background: "hsl(var(--landing-bg))", color: "hsl(var(--landing-fg))" }}>
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b px-4 shrink-0" style={{ borderColor: "hsl(var(--landing-border))", background: "hsl(var(--landing-bg) / 0.9)", backdropFilter: "blur(12px)" }}>
            <SidebarTrigger className="text-current" />
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
            <DashboardTour />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
