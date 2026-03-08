import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, ArrowLeft, Sparkles, FolderOpen, BarChart3, Settings, Eye } from "lucide-react";

interface TourStep {
  title: string;
  description: string;
  icon: any;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to your Dashboard!",
    description: "This is your creative command center. We'll walk you through the key areas to get you started.",
    icon: Sparkles,
  },
  {
    title: "Add Your Work",
    description: "Head to Projects to add scripts, films, case studies, or whatever you create. This is the heart of your portfolio.",
    icon: FolderOpen,
  },
  {
    title: "Track Performance",
    description: "The Analytics page shows who's viewing your portfolio — page views, referrers, and device breakdowns.",
    icon: BarChart3,
  },
  {
    title: "Preview & Publish",
    description: "Use the 'View Portfolio' button in the sidebar to see how visitors experience your page. Publish when you're ready!",
    icon: Eye,
  },
  {
    title: "Customize Everything",
    description: "In Settings, reorder sections, change themes, set up your CTA, and connect a custom domain.",
    icon: Settings,
  },
];

const TOUR_KEY = "cs_dashboard_tour_seen";

export default function DashboardTour() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(TOUR_KEY);
    if (!seen) {
      // Small delay so dashboard renders first
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(TOUR_KEY, "true");
  };

  const next = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      dismiss();
    }
  };

  const prev = () => setStep(s => Math.max(0, s - 1));

  if (!visible) return null;

  const current = TOUR_STEPS[step];
  const Icon = current.icon;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" onClick={dismiss} />

      {/* Card */}
      <div className="fixed z-[100] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div
          className="rounded-2xl border p-6 shadow-2xl relative"
          style={{
            background: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
          }}
        >
          {/* Close */}
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mb-6">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === step ? 24 : 8,
                  background: i <= step ? "hsl(var(--primary))" : "hsl(var(--muted))",
                }}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Icon className="h-6 w-6 text-primary" />
          </div>

          {/* Content */}
          <h3 className="text-lg font-bold text-foreground mb-2">{current.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{current.description}</p>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={dismiss} className="text-muted-foreground">
              Skip tour
            </Button>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <Button variant="outline" size="sm" onClick={prev}>
                  <ArrowLeft className="mr-1 h-3 w-3" /> Back
                </Button>
              )}
              <Button size="sm" onClick={next}>
                {step === TOUR_STEPS.length - 1 ? "Get Started" : "Next"}
                {step < TOUR_STEPS.length - 1 && <ArrowRight className="ml-1 h-3 w-3" />}
              </Button>
            </div>
          </div>

          {/* Step counter */}
          <p className="text-[10px] text-muted-foreground text-center mt-4">
            {step + 1} of {TOUR_STEPS.length}
          </p>
        </div>
      </div>
    </>
  );
}
