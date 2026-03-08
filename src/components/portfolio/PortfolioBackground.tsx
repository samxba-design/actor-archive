import { useState, useEffect } from "react";
import { Film } from "lucide-react";

const PortfolioBackground = () => {
  const [enabled, setEnabled] = useState(() => {
    const stored = localStorage.getItem("portfolio-bg-fx");
    return stored !== null ? stored === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("portfolio-bg-fx", String(enabled));
  }, [enabled]);

  return (
    <>
      {enabled && (
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
          {/* Film grain overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              opacity: 0.03,
              mixBlendMode: "overlay",
              animation: "grain 8s steps(10) infinite",
            }}
          />

          {/* Light leak — warm glow drifting */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 40% at 20% 50%, hsl(var(--portfolio-accent) / 0.06) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 80% 30%, hsl(var(--portfolio-accent) / 0.04) 0%, transparent 60%)",
              animation: "lightLeak 20s ease-in-out infinite alternate",
            }}
          />

          {/* Bokeh circles */}
          <div
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(var(--portfolio-accent) / 0.04) 0%, transparent 70%)",
              top: "15%",
              right: "10%",
              animation: "bokehFloat 25s ease-in-out infinite",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute w-48 h-48 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(var(--portfolio-accent) / 0.03) 0%, transparent 70%)",
              bottom: "20%",
              left: "5%",
              animation: "bokehFloat 30s ease-in-out infinite reverse",
              filter: "blur(50px)",
            }}
          />
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setEnabled((v) => !v)}
        className="fixed bottom-4 right-4 z-50 p-2 rounded-full transition-all duration-300 hover:scale-110"
        style={{
          backgroundColor: enabled
            ? "hsl(var(--portfolio-accent) / 0.15)"
            : "hsl(var(--portfolio-muted))",
          color: enabled
            ? "hsl(var(--portfolio-accent))"
            : "hsl(var(--portfolio-muted-fg))",
          border: "1px solid hsl(var(--portfolio-border))",
          backdropFilter: "blur(8px)",
        }}
        title={enabled ? "Disable atmosphere" : "Enable atmosphere"}
        aria-label={enabled ? "Disable background effects" : "Enable background effects"}
      >
        <Film className="w-4 h-4" />
      </button>

      {/* Keyframe animations */}
      <style>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }
        @keyframes lightLeak {
          0% { opacity: 1; transform: translateX(0) scale(1); }
          100% { opacity: 0.7; transform: translateX(5%) scale(1.05); }
        }
        @keyframes bokehFloat {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
      `}</style>
    </>
  );
};

export default PortfolioBackground;
