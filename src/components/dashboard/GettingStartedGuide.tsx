import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, ArrowLeft, Sparkles, FolderOpen, Eye, Palette, GripVertical, Layout, EyeOff } from "lucide-react";
import { useProfileTypeContext } from "@/contexts/ProfileTypeContext";

interface GuideStep {
  title: string;
  description: string;
  icon: any;
  highlight?: string;
}

const getSteps = (profileType: string | null): GuideStep[] => {
  const typeLabel = profileType === "actor" ? "headshots & reels"
    : profileType === "screenwriter" ? "scripts & credits"
    : profileType === "copywriter" ? "case studies & samples"
    : "projects & work";

  return [
    {
      title: "Welcome to your creative command center",
      description: "Everything you need to build, manage, and share your professional portfolio — all in one place. Let's get you set up.",
      icon: Sparkles,
    },
    {
      title: "Add your best work",
      description: `Start by adding your ${typeLabel}. This is the heart of your portfolio — what visitors see first and remember most.`,
      icon: FolderOpen,
      highlight: "Use the sidebar to navigate to each content area.",
    },
    {
      title: "Everything is customizable",
      description: "Every section on your portfolio can be hidden, reordered, renamed, or styled differently. Nothing is permanent — experiment freely.",
      icon: Palette,
      highlight: "Head to Settings to control section order & visibility.",
    },
    {
      title: "Drag, drop, toggle",
      description: "On your live portfolio, enter Edit Mode to drag sections into any order, toggle them on/off with the eye icon, and see changes instantly.",
      icon: GripVertical,
      highlight: "Look for the 'Customize' button on your portfolio page.",
    },
    {
      title: "Sections you don't need? Hide them",
      description: "Don't offer services? Hide the Services section. No awards yet? Toggle it off. Your portfolio only shows what you choose — no empty states visible to visitors.",
      icon: EyeOff,
    },
    {
      title: "Choose your layout & theme",
      description: "Pick from 10+ layout presets and multiple themes. Switch between Cinematic, Bento, Magazine, Timeline, and more — each one transforms your entire portfolio.",
      icon: Layout,
    },
    {
      title: "Preview & publish",
      description: "Use the 'Preview' button in the header to see your portfolio exactly as visitors will. When you're ready, flip the Published toggle in Settings.",
      icon: Eye,
      highlight: "Your portfolio URL is shown in Settings → URL Slug.",
    },
  ];
};

const TOUR_KEY = "cs_dashboard_tour_seen";

export default function GettingStartedGuide() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const { profileType } = useProfileTypeContext();

  const steps = getSteps(profileType);

  useEffect(() => {
    const seen = localStorage.getItem(TOUR_KEY);
    if (!seen) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(TOUR_KEY, "true");
  };

  const next = () => {
    if (step < steps.length - 1) setStep(s => s + 1);
    else dismiss();
  };

  const prev = () => setStep(s => Math.max(0, s - 1));

  if (!visible) return null;

  const current = steps[step];
  const Icon = current.icon;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" onClick={dismiss} />

      {/* Card */}
      <div className="fixed z-[100] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
        <div className="rounded-2xl border border-border bg-background p-6 shadow-2xl relative overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out rounded-r-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Close */}
          <button onClick={dismiss} className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mt-2">
            <Icon className="h-6 w-6 text-primary" />
          </div>

          {/* Content */}
          <h3 className="text-lg font-bold text-foreground mb-2">{current.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>

          {current.highlight && (
            <div className="mt-3 px-3 py-2 rounded-md bg-primary/5 border border-primary/10">
              <p className="text-xs text-primary font-medium">💡 {current.highlight}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button variant="ghost" size="sm" onClick={dismiss} className="text-muted-foreground">
              Skip
            </Button>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <Button variant="outline" size="sm" onClick={prev}>
                  <ArrowLeft className="mr-1 h-3 w-3" /> Back
                </Button>
              )}
              <Button size="sm" onClick={next}>
                {step === steps.length - 1 ? "Let's go! 🚀" : "Next"}
                {step < steps.length - 1 && <ArrowRight className="ml-1 h-3 w-3" />}
              </Button>
            </div>
          </div>

          {/* Step counter */}
          <p className="text-[10px] text-muted-foreground text-center mt-4">
            {step + 1} of {steps.length}
          </p>
        </div>
      </div>
    </>
  );
}
