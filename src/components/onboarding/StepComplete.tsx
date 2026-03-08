import type { OnboardingData } from "@/pages/Onboarding";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getProfileTypeConfig, PROFILE_TYPES } from "@/config/profileSections";
import { useEffect, useState } from "react";

interface Props {
  data: OnboardingData;
  onComplete: () => void;
  onBack: () => void;
  saving: boolean;
}

// Simple confetti-like sparkle particles
const Particle = ({ delay, x }: { delay: number; x: number }) => (
  <div
    className="absolute w-1.5 h-1.5 rounded-full"
    style={{
      left: `${x}%`,
      top: "-4px",
      background: `hsl(${340 + Math.random() * 30} ${35 + Math.random() * 15}% ${55 + Math.random() * 20}%)`,
      animation: `confetti-fall 1.8s ease-out ${delay}s forwards`,
      opacity: 0,
    }}
  />
);

const StepComplete = ({ data, onComplete, onBack, saving }: Props) => {
  const [showParticles, setShowParticles] = useState(false);

  const typeLabel =
    data.profileType === "multi_hyphenate"
      ? data.secondaryTypes
          .map((t) => PROFILE_TYPES.find((pt) => pt.key === t)?.label)
          .filter(Boolean)
          .join(" + ")
      : getProfileTypeConfig(data.profileType || "")?.label || "Creative";

  useEffect(() => {
    const timer = setTimeout(() => setShowParticles(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-lg space-y-8 animate-in fade-in duration-500 relative">
      {/* Confetti particles */}
      {showParticles && (
        <div className="absolute inset-x-0 top-0 h-32 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <Particle key={i} delay={i * 0.08} x={10 + Math.random() * 80} />
          ))}
        </div>
      )}

      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, hsl(350 40% 58% / 0.15), hsl(20 35% 55% / 0.15))",
            animation: "word-reveal 0.6s ease-out both",
          }}>
          <Sparkles className="w-8 h-8" style={{ color: "hsl(35 30% 72%)" }} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">You're all set!</h1>
        <p className="text-muted-foreground">
          Here's a summary of your profile. You can change everything in your dashboard.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4"
        style={{
          boxShadow: "0 0 0 1px hsl(350 40% 58% / 0.1), 0 8px 30px -10px hsl(350 40% 58% / 0.08)",
        }}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Type</span>
          <span className="text-sm font-medium text-foreground">{typeLabel}</span>
        </div>
        <div className="border-t border-border" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Name</span>
          <span className="text-sm font-medium text-foreground">{data.displayName}</span>
        </div>
        {data.tagline && (
          <>
            <div className="border-t border-border" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tagline</span>
              <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{data.tagline}</span>
            </div>
          </>
        )}
        <div className="border-t border-border" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">URL</span>
          <span className="text-sm font-mono text-foreground">creativeslate.com/{data.slug}</span>
        </div>
        <div className="border-t border-border" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Theme</span>
          <span className="text-sm font-medium text-foreground capitalize">{data.theme}</span>
        </div>
        {data.selectedServices.length > 0 && (
          <>
            <div className="border-t border-border" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Services</span>
              <span className="text-sm font-medium text-foreground">{data.selectedServices.length} listed</span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={onComplete} disabled={saving} className="min-w-[180px]">
          {saving ? "Creating profile..." : "Launch my portfolio 🚀"}
        </Button>
      </div>
    </div>
  );
};

export default StepComplete;
