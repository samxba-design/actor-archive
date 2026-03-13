import { useState, useEffect, useCallback, useRef } from "react";
import { X, ArrowRight, Sparkles } from "lucide-react";

interface TourStep {
  targetId: string;
  title: string;
  description: string;
  profileTypes?: string[]; // If set, only show for these types
}

const getKnownForTitle = (profileType?: string): string => {
  if (!profileType) return "Known For";
  const map: Record<string, string> = {
    copywriter: "Highlights",
    corporate_video: "Highlights",
    journalist: "Featured Articles",
    author: "Featured Books",
  };
  return map[profileType] || "Known For";
};

const ALL_TOUR_STEPS: TourStep[] = [
  {
    targetId: "tour-identity",
    title: "Your Identity",
    description: "Customize your name, photo, tagline, and representation. This is the first thing visitors see.",
  },
  {
    targetId: "tour-known-for",
    title: "__KNOWN_FOR__", // replaced dynamically
    description: "Showcase up to 6 key credits with poster art. These auto-link to IMDb.",
    profileTypes: ["screenwriter", "tv_writer", "playwright", "actor", "director_producer", "copywriter", "corporate_video", "journalist", "author"],
  },
  {
    targetId: "tour-featured",
    title: "Featured Project",
    description: "Highlight a current project front and center. Links to IMDb, scripts, or custom URLs.",
  },
  {
    targetId: "tour-stats",
    title: "Stats Bar",
    description: "Auto-generated from your portfolio data — scripts, awards, and active projects.",
  },
  {
    targetId: "tour-switchers",
    title: "Layout & Theme",
    description: "Choose from 10 layouts and 7 visual themes. Every section can be rearranged and toggled.",
  },
];

const STORAGE_KEY = "portfolio-tour-seen";

interface PortfolioTourProps {
  profileType?: string;
}

const PortfolioTour = ({ profileType }: PortfolioTourProps) => {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; arrowSide: "top" | "bottom" }>({ top: 0, left: 0, arrowSide: "top" });
  const [fadeIn, setFadeIn] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Filter steps: only include steps whose target exists in the DOM and matches profile type
  const [availableSteps, setAvailableSteps] = useState<TourStep[]>([]);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => {
        // Filter to steps that exist in the DOM and match profile type
        const validSteps = ALL_TOUR_STEPS.filter((s) => {
          if (s.profileTypes && profileType && !s.profileTypes.includes(profileType)) return false;
          return document.getElementById(s.targetId) !== null;
        });
        if (validSteps.length === 0) return;
        setAvailableSteps(validSteps);
        setActive(true);
        setFadeIn(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [profileType]);

  const positionSpotlight = useCallback(() => {
    if (!active || availableSteps.length === 0) return;
    const currentStep = availableSteps[step];
    if (!currentStep) return;
    const el = document.getElementById(currentStep.targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setSpotlightRect(rect);

      const tooltipH = 160;
      const spaceBelow = window.innerHeight - rect.bottom;
      const below = spaceBelow > tooltipH + 20;

      setTooltipPos({
        top: below ? rect.bottom + 12 : rect.top - tooltipH - 12,
        left: Math.max(16, Math.min(rect.left + rect.width / 2 - 160, window.innerWidth - 336)),
        arrowSide: below ? "top" : "bottom",
      });
    } else {
      // Element no longer exists — skip to next
      if (step < availableSteps.length - 1) {
        setStep(s => s + 1);
      } else {
        dismiss();
      }
    }
  }, [active, step, availableSteps]);

  useEffect(() => {
    positionSpotlight();
    window.addEventListener("resize", positionSpotlight);
    window.addEventListener("scroll", positionSpotlight);
    return () => {
      window.removeEventListener("resize", positionSpotlight);
      window.removeEventListener("scroll", positionSpotlight);
    };
  }, [positionSpotlight]);

  const dismiss = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => {
      setActive(false);
      localStorage.setItem(STORAGE_KEY, "true");
    }, 300);
  }, []);

  const next = useCallback(() => {
    if (step < availableSteps.length - 1) {
      setFadeIn(false);
      setTimeout(() => {
        setStep(s => s + 1);
        setFadeIn(true);
        const nextEl = document.getElementById(availableSteps[step + 1].targetId);
        if (nextEl) {
          nextEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 250);
    } else {
      dismiss();
    }
  }, [step, dismiss, availableSteps]);

  if (!active || availableSteps.length === 0) return null;

  const currentStep = availableSteps[step];
  if (!currentStep) return null;
  const pad = 8;

  return (
    <div
      className="fixed inset-0 z-[9999] transition-opacity duration-300"
      style={{ opacity: fadeIn ? 1 : 0 }}
    >
      {/* Dark overlay with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
            {spotlightRect && (
              <rect
                x={spotlightRect.left - pad}
                y={spotlightRect.top - pad}
                width={spotlightRect.width + pad * 2}
                height={spotlightRect.height + pad * 2}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.65)"
          mask="url(#tour-mask)"
          style={{ pointerEvents: "all" }}
          onClick={dismiss}
        />
      </svg>

      {/* Spotlight ring */}
      {spotlightRect && (
        <div
          className="absolute rounded-lg pointer-events-none transition-all duration-500 ease-out"
          style={{
            left: spotlightRect.left - pad,
            top: spotlightRect.top - pad,
            width: spotlightRect.width + pad * 2,
            height: spotlightRect.height + pad * 2,
            boxShadow: `0 0 0 2px rgba(255,255,255,0.2), 0 0 24px rgba(255,255,255,0.08)`,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[10000] w-[320px] transition-all duration-500 ease-out"
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          transform: fadeIn ? "translateY(0)" : "translateY(8px)",
        }}
      >
        <div
          className="rounded-xl p-4 space-y-3"
          style={{
            backgroundColor: "rgba(20,20,24,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#f0c674" }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.45)" }}>
                {step + 1} of {availableSteps.length}
              </span>
            </div>
            <button type="button" onClick={dismiss} className="p-1 rounded-md transition-colors hover:bg-white/10">
              <X className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)" }} />
            </button>
          </div>

          <div>
            <h4 className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>{currentStep.title}</h4>
            <p className="text-[12px] leading-relaxed mt-1" style={{ color: "rgba(245,240,235,0.6)" }}>
              {currentStep.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={dismiss}
              className="text-[11px] transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Skip tour
            </button>
            <button
              onClick={next}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#F5F0EB",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {step < availableSteps.length - 1 ? (
                <>Next <ArrowRight className="w-3 h-3" /></>
              ) : (
                "Got it!"
              )}
            </button>
          </div>

          <div className="flex justify-center gap-1.5">
            {availableSteps.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === step ? "#f0c674" : "rgba(255,255,255,0.15)",
                  transform: i === step ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTour;
