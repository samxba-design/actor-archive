import { Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSubscription, type ProFeature } from "@/hooks/useSubscription";

interface UpgradeGateProps {
  feature: ProFeature;
  children: React.ReactNode;
  /** "overlay" blurs the whole section, "inline" shows a small badge/button */
  variant?: "overlay" | "inline";
  /** Label shown in the upgrade prompt */
  label?: string;
}

export function UpgradeGate({ feature, children, variant = "overlay", label }: UpgradeGateProps) {
  const { canAccess, loading } = useSubscription();

  if (loading) return <>{children}</>;
  if (canAccess(feature)) return <>{children}</>;

  if (variant === "inline") {
    return (
      <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/10">
        <Link to="/pricing">
          <Crown className="h-3 w-3" />
          {label || "Upgrade to Pro"}
        </Link>
      </Button>
    );
  }

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-[2px] opacity-50">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center space-y-3 p-6 rounded-xl bg-background/90 border border-border shadow-lg max-w-sm">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">
            {label || "Pro Feature"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Upgrade to Pro to unlock this feature and get unlimited access to all tools.
          </p>
          <Button asChild className="w-full">
            <Link to="/pricing">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Pro — $19.99/mo
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Small inline badge for locked options within a form */
export function ProBadge({ className }: { className?: string }) {
  return (
    <Link to="/pricing" className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors ${className || ""}`}>
      <Crown className="h-2.5 w-2.5" />
      PRO
    </Link>
  );
}
