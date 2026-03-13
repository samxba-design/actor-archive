import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";

interface ExitIntentPopupProps {
  /** Key for localStorage to track if dismissed */
  storageKey?: string;
  /** Delay before enabling detection (ms) */
  delay?: number;
  /** Only show once per session */
  oncePerSession?: boolean;
  /** Custom title */
  title?: string;
  /** Custom description */
  description?: string;
  /** CTA button text */
  ctaText?: string;
  /** CTA action */
  onCtaClick?: () => void;
}

const ExitIntentPopup = ({
  storageKey = "exit_intent_dismissed",
  delay = 5000,
  oncePerSession = true,
  title = "Wait! Before you go...",
  description = "Your portfolio is almost ready to shine. Complete your profile to get discovered by industry professionals.",
  ctaText = "Complete My Profile",
  onCtaClick,
}: ExitIntentPopupProps) => {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // Check if already dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey);
    if (dismissed) {
      setHasShown(true);
    }
    
    // Enable after delay
    const timer = setTimeout(() => setEnabled(true), delay);
    return () => clearTimeout(timer);
  }, [storageKey, delay]);

  const handleExitIntent = useCallback((e: MouseEvent) => {
    // Detect when mouse leaves viewport at top (exit intent)
    if (
      e.clientY <= 0 &&
      enabled &&
      !hasShown &&
      !open
    ) {
      setOpen(true);
      if (oncePerSession) {
        setHasShown(true);
      }
    }
  }, [enabled, hasShown, open, oncePerSession]);

  useEffect(() => {
    document.addEventListener("mouseout", handleExitIntent);
    return () => document.removeEventListener("mouseout", handleExitIntent);
  }, [handleExitIntent]);

  const handleDismiss = () => {
    setOpen(false);
    localStorage.setItem(storageKey, "true");
  };

  const handleCta = () => {
    setOpen(false);
    localStorage.setItem(storageKey, "true");
    onCtaClick?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-md border shadow-2xl"
        style={{
          borderColor: "hsl(var(--landing-border))",
          background: "hsl(var(--landing-card))",
          color: "hsl(var(--landing-fg))",
        }}
      >
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
          style={{ color: "hsl(var(--landing-muted))" }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "hsl(var(--landing-accent) / 0.1)" }}>
            <Sparkles className="h-6 w-6 animate-pulse" style={{ color: "hsl(var(--landing-champagne))" }} />
          </div>
          <DialogTitle className="text-xl" style={{ color: "hsl(var(--landing-fg))" }}>{title}</DialogTitle>
          <DialogDescription className="text-base pt-2" style={{ color: "hsl(var(--landing-muted))" }}>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={handleCta} className="w-full font-semibold border-0 text-white"
            style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }}>
            {ctaText}
          </Button>
          <Button variant="ghost" onClick={handleDismiss} className="w-full" style={{ color: "hsl(var(--landing-muted))" }}>
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
