import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertCircle, XCircle, Loader2 } from "lucide-react";

type StatusVariant = "success" | "warning" | "error" | "pending" | "loading" | "info";

interface StatusBadgeProps {
  variant: StatusVariant;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

const variantConfig: Record<StatusVariant, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  warning: { icon: AlertCircle, className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  error: { icon: XCircle, className: "bg-red-500/10 text-red-600 border-red-500/20" },
  pending: { icon: Clock, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  loading: { icon: Loader2, className: "bg-muted text-muted-foreground border-border" },
  info: { icon: AlertCircle, className: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
};

export function StatusBadge({ variant, label, className, size = "md" }: StatusBadgeProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  const isLoading = variant === "loading";

  const sizeClasses = size === "sm" 
    ? "text-xs px-1.5 py-0.5 gap-1" 
    : "text-sm px-2 py-1 gap-1.5";

  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        config.className,
        sizeClasses,
        className
      )}
    >
      <Icon className={cn(iconSize, isLoading && "animate-spin")} />
      {label && <span>{label}</span>}
    </span>
  );
}

// Quick status indicators
export function StatusDot({ variant, className }: { variant: StatusVariant; className?: string }) {
  const colors: Record<StatusVariant, string> = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
    pending: "bg-blue-500",
    loading: "bg-muted-foreground animate-pulse",
    info: "bg-sky-500",
  };

  return (
    <span className={cn("inline-block h-2 w-2 rounded-full", colors[variant], className)} />
  );
}
