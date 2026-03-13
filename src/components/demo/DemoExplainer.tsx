import { useState } from "react";
import { X, HelpCircle, Palette, GripVertical, EyeOff, Layers } from "lucide-react";

const STORAGE_KEY = "demo_explainer_dismissed";

const DemoExplainer = () => {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(STORAGE_KEY) === "true");
  const [showHelp, setShowHelp] = useState(false);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  };

  // Persistent help button (always visible after dismiss)
  const helpButton = dismissed ? (
    <button
      onClick={() => { setDismissed(false); setShowHelp(true); }}
      className="fixed top-20 right-4 z-50 w-8 h-8 rounded-full flex items-center justify-center shadow-lg backdrop-blur-xl transition-all hover:scale-110"
      style={{
        background: "hsl(var(--portfolio-card, var(--card)) / 0.85)",
        color: "hsl(var(--portfolio-fg, var(--foreground)))",
        border: "1px solid hsl(var(--portfolio-border, var(--border)) / 0.5)",
      }}
      title="How this demo works"
    >
      <HelpCircle className="h-4 w-4" />
    </button>
  ) : null;

  if (dismissed && !showHelp) return helpButton;

  const features = [
    { icon: Palette, text: "Switch themes & layouts using the floating controls" },
    { icon: GripVertical, text: "Drag sections to reorder them in Classic layout" },
    { icon: EyeOff, text: "Toggle any section on/off — nothing is required" },
    { icon: Layers, text: "Click variant pills on each section to change its style" },
  ];

  return (
    <>
      {helpButton}
      <div className="fixed inset-0 z-[80] flex items-start justify-center pt-24 px-4 pointer-events-none">
        <div
          className="pointer-events-auto rounded-2xl border p-5 shadow-2xl backdrop-blur-xl max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-500"
          style={{
            background: "hsl(var(--portfolio-card, var(--card)) / 0.92)",
            borderColor: "hsl(var(--portfolio-border, var(--border)) / 0.5)",
            color: "hsl(var(--portfolio-fg, var(--foreground)))",
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-base font-bold">You're viewing a fully customizable portfolio</h3>
              <p className="text-xs mt-1 opacity-70">Every element you see can be customized or removed entirely</p>
            </div>
            <button
              onClick={() => { dismiss(); setShowHelp(false); }}
              className="shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "hsl(var(--portfolio-accent, var(--primary)) / 0.12)" }}>
                  <f.icon className="h-3.5 w-3.5" style={{ color: "hsl(var(--portfolio-accent, var(--primary)))" }} />
                </div>
                <p className="text-sm opacity-90">{f.text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => { dismiss(); setShowHelp(false); }}
            className="mt-4 w-full py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: "hsl(var(--portfolio-accent, var(--primary)))",
              color: "hsl(var(--portfolio-accent-fg, var(--primary-foreground)))",
            }}
          >
            Got it — let me explore
          </button>
        </div>
      </div>
    </>
  );
};

export default DemoExplainer;
