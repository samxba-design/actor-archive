import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <Button variant="outline" onClick={signOut}>Sign out</Button>
        </div>
        <p className="text-muted-foreground">Welcome, {user?.email}. Dashboard coming in Phase 5.</p>
      </div>
    </div>
  );
};

export default Dashboard;
