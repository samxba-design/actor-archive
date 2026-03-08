import { useAuth } from "@/hooks/useAuth";

const Onboarding = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Welcome to CreativeSlate</h1>
        <p className="text-muted-foreground">Onboarding wizard coming in Phase 2.</p>
      </div>
    </div>
  );
};

export default Onboarding;
