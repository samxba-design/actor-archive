import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setOnboardingCompleted(data?.onboarding_completed ?? false);
        setOnboardingChecked(true);
      });
  }, [user]);

  if (loading || (user && !onboardingChecked)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--landing-bg))" }}>
        <div className="h-8 w-8 rounded-full border-2 animate-spin" style={{ borderColor: "hsl(var(--landing-accent))", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isOnboarding = location.pathname === "/onboarding";

  // If onboarding not completed and not on onboarding page, redirect there
  if (!onboardingCompleted && !isOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // If onboarding completed and on onboarding page, redirect to dashboard
  if (onboardingCompleted && isOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
