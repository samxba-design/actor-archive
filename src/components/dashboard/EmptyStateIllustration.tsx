import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FolderOpen, Image, MessageSquare, Award, Link2, FileText,
  Users, Film, Sparkles, type LucideIcon
} from "lucide-react";

interface EmptyStateIllustrationProps {
  type: "projects" | "gallery" | "testimonials" | "awards" | "social" | "scripts" | "clients" | "reels" | "generic";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EMPTY_STATES: Record<string, { icon: LucideIcon; title: string; description: string; color: string }> = {
  projects: {
    icon: FolderOpen,
    title: "No projects yet",
    description: "Your creative work deserves a showcase. Add your first project to get started.",
    color: "from-blue-500/20 to-indigo-500/20",
  },
  gallery: {
    icon: Image,
    title: "Your gallery is empty",
    description: "Upload headshots, production stills, or behind-the-scenes photos.",
    color: "from-amber-500/20 to-orange-500/20",
  },
  testimonials: {
    icon: MessageSquare,
    title: "No testimonials yet",
    description: "Social proof builds trust. Add quotes from collaborators and clients.",
    color: "from-green-500/20 to-emerald-500/20",
  },
  awards: {
    icon: Award,
    title: "No awards added",
    description: "Festivals, fellowships, nominations—they all build credibility.",
    color: "from-yellow-500/20 to-amber-500/20",
  },
  social: {
    icon: Link2,
    title: "No social links",
    description: "Connect your IMDb, LinkedIn, or portfolio sites for visibility.",
    color: "from-purple-500/20 to-violet-500/20",
  },
  scripts: {
    icon: FileText,
    title: "No scripts uploaded",
    description: "Share your screenplays, pilots, or spec scripts securely.",
    color: "from-cyan-500/20 to-blue-500/20",
  },
  clients: {
    icon: Users,
    title: "No clients listed",
    description: "Showcase the brands and companies you've worked with.",
    color: "from-pink-500/20 to-rose-500/20",
  },
  reels: {
    icon: Film,
    title: "No demo reels",
    description: "Upload or link your showreel to let your work speak for itself.",
    color: "from-red-500/20 to-orange-500/20",
  },
  generic: {
    icon: Sparkles,
    title: "Nothing here yet",
    description: "Get started by adding your first item.",
    color: "from-primary/20 to-primary/10",
  },
};

const EmptyStateIllustration = ({
  type,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateIllustrationProps) => {
  const state = EMPTY_STATES[type] || EMPTY_STATES.generic;
  const Icon = state.icon;

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      {/* Animated illustration */}
      <div className="relative mb-6">
        {/* Background glow */}
        <div className={cn(
          "absolute inset-0 rounded-full blur-2xl opacity-60 animate-pulse-soft",
          `bg-gradient-to-br ${state.color}`
        )} />
        
        {/* Icon container */}
        <div className={cn(
          "relative flex h-20 w-20 items-center justify-center rounded-2xl",
          "bg-gradient-to-br from-muted/80 to-muted/40 border border-border/50",
          "shadow-lg transition-transform duration-500 hover:scale-105"
        )}>
          <Icon className="h-10 w-10 text-muted-foreground/70" strokeWidth={1.5} />
        </div>
        
        {/* Decorative dots */}
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary/30 animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="absolute -bottom-2 -left-2 h-2 w-2 rounded-full bg-primary/20 animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="absolute top-1/2 -right-3 h-1.5 w-1.5 rounded-full bg-primary/25 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>

      {/* Text content */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title || state.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        {description || state.description}
      </p>

      {/* Action button */}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="gap-2">
          <Icon className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyStateIllustration;
