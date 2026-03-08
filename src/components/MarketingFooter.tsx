import { Link } from "react-router-dom";
import { Film } from "lucide-react";

export default function MarketingFooter() {
  return (
    <footer className="border-t relative z-10" style={{ borderColor: "hsl(345 15% 10%)", background: "hsl(345 25% 5%)" }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="sm:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4" style={{ color: "hsl(var(--landing-champagne))" }} />
              <span className="font-bold" style={{ color: "hsl(var(--landing-fg))" }}>CreativeSlate</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--landing-muted) / 0.7)" }}>
              The portfolio platform built for the entertainment industry.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(var(--landing-fg) / 0.6)" }}>Product</h4>
            <div className="flex flex-col gap-2">
              <Link to="/how-it-works" className="text-sm transition-colors hover:underline" style={{ color: "hsl(var(--landing-muted))" }}>How It Works</Link>
              <Link to="/pricing" className="text-sm transition-colors hover:underline" style={{ color: "hsl(var(--landing-muted))" }}>Pricing</Link>
              <Link to="/demo/screenwriter" className="text-sm transition-colors hover:underline" style={{ color: "hsl(var(--landing-muted))" }}>Live Demo</Link>
            </div>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(var(--landing-fg) / 0.6)" }}>Account</h4>
            <div className="flex flex-col gap-2">
              <Link to="/signup" className="text-sm transition-colors hover:underline" style={{ color: "hsl(var(--landing-muted))" }}>Sign Up</Link>
              <Link to="/login" className="text-sm transition-colors hover:underline" style={{ color: "hsl(var(--landing-muted))" }}>Log In</Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(var(--landing-fg) / 0.6)" }}>Legal</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm" style={{ color: "hsl(var(--landing-muted) / 0.5)" }}>Privacy Policy</span>
              <span className="text-sm" style={{ color: "hsl(var(--landing-muted) / 0.5)" }}>Terms of Service</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ borderColor: "hsl(345 15% 12%)", color: "hsl(var(--landing-muted) / 0.5)" }}>
          <span>© {new Date().getFullYear()} CreativeSlate. All rights reserved.</span>
          <span>Made for creatives, by creatives.</span>
        </div>
      </div>
    </footer>
  );
}
