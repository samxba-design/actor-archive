import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check, X, Crown, ArrowRight, Sparkles,
  Palette, Wand2, BarChart3, GitBranch, Shield,
  Globe, Code2, PenTool, FileText, Bell, Heart
} from "lucide-react";

const MONTHLY_PRICE = 19.99;
const YEARLY_PRICE = 191.88;
const YEARLY_MONTHLY = 15.99;

const freeFeatures = [
  "1 published portfolio",
  "Custom slug (/p/your-name)",
  "Up to 8 projects",
  "Up to 5 gallery images",
  "Minimal theme",
  "Basic contact form",
  "Unlimited social links",
  "Total page view count",
  "All content sections",
  "\"Powered by CreativeSlate\" badge",
];

const proFeatures = [
  { text: "Everything in Free", icon: Check },
  { text: "Unlimited projects & gallery", icon: Sparkles },
  { text: "10+ stunning themes", icon: Palette },
  { text: "Font pairing selector", icon: Palette },
  { text: "Layout density control", icon: Palette },
  { text: "Custom CSS editor", icon: Code2 },
  { text: "Custom domain", icon: Globe },
  { text: "AI Writing Assistant", icon: Wand2 },
  { text: "AI Coverage Simulator", icon: FileText },
  { text: "Comp Title Matcher", icon: Sparkles },
  { text: "Profile Insights (AI)", icon: Sparkles },
  { text: "Full analytics breakdown", icon: BarChart3 },
  { text: "Auto-responder", icon: Bell },
  { text: "Pipeline tracker", icon: GitBranch },
  { text: "Smart follow-up", icon: Bell },
  { text: "Endorsement requests", icon: Heart },
  { text: "Case study builder", icon: PenTool },
  { text: "Embed widget & iframe", icon: Code2 },
  { text: "Advanced access levels", icon: Shield },
  { text: "Download tracking", icon: FileText },
  { text: "Remove branding badge", icon: X },
];

const Pricing = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--landing-bg))", color: "hsl(var(--landing-fg))" }}>
      {/* Nav */}
      <nav className="border-b" style={{ borderColor: "hsl(var(--landing-border))", background: "hsl(var(--landing-bg) / 0.85)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight" style={{ color: "hsl(var(--landing-fg))" }}>CreativeSlate</Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hover:bg-white/10" style={{ color: "hsl(var(--landing-fg) / 0.7)" }}>
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild className="font-semibold border-0 text-white"
              style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }}>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-20 pb-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" style={{ color: "hsl(var(--landing-fg))" }}>
            Simple, transparent pricing
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "hsl(var(--landing-muted))" }}>
            Start free. Upgrade when you're ready for the full creative toolkit.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <button
            onClick={() => setYearly(false)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: !yearly ? "hsl(var(--landing-accent))" : "transparent",
              color: !yearly ? "white" : "hsl(var(--landing-muted))",
              border: !yearly ? "none" : "1px solid hsl(var(--landing-border))",
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2"
            style={{
              background: yearly ? "hsl(var(--landing-accent))" : "transparent",
              color: yearly ? "white" : "hsl(var(--landing-muted))",
              border: yearly ? "none" : "1px solid hsl(var(--landing-border))",
            }}
          >
            Yearly
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: "hsl(120 40% 45% / 0.2)", color: "hsl(120 50% 65%)" }}>
              Save 20%
            </span>
          </button>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Free */}
          <div className="rounded-2xl p-8 border" style={{ background: "hsl(var(--landing-card))", borderColor: "hsl(var(--landing-border))" }}>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1" style={{ color: "hsl(var(--landing-fg))" }}>Free</h2>
              <p className="text-sm" style={{ color: "hsl(var(--landing-muted))" }}>Everything you need to get started</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold" style={{ color: "hsl(var(--landing-fg))" }}>$0</span>
              <span className="text-sm ml-1" style={{ color: "hsl(var(--landing-muted))" }}>forever</span>
            </div>
            <Button size="lg" variant="outline" asChild className="w-full mb-8 text-base"
              style={{ borderColor: "hsl(var(--landing-fg) / 0.15)", color: "hsl(var(--landing-fg) / 0.8)" }}>
              <Link to="/signup">Get Started</Link>
            </Button>
            <ul className="space-y-3">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "hsl(var(--landing-muted))" }}>
                  <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "hsl(var(--landing-champagne))" }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="rounded-2xl p-8 border-2 relative" style={{ background: "hsl(var(--landing-card))", borderColor: "hsl(var(--landing-accent) / 0.5)" }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="px-3 py-1 text-xs font-bold border-0 text-white" style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }}>
                <Crown className="h-3 w-3 mr-1" /> MOST POPULAR
              </Badge>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1" style={{ color: "hsl(var(--landing-fg))" }}>Pro</h2>
              <p className="text-sm" style={{ color: "hsl(var(--landing-muted))" }}>The full creative toolkit</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold" style={{ color: "hsl(var(--landing-fg))" }}>
                ${yearly ? YEARLY_MONTHLY.toFixed(2) : MONTHLY_PRICE.toFixed(2)}
              </span>
              <span className="text-sm ml-1" style={{ color: "hsl(var(--landing-muted))" }}>/month</span>
              {yearly && (
                <p className="text-xs mt-1" style={{ color: "hsl(var(--landing-champagne))" }}>
                  Billed annually at ${YEARLY_PRICE.toFixed(2)}/year
                </p>
              )}
            </div>
            <Button size="lg" asChild className="w-full mb-8 text-base font-semibold border-0 text-white"
              style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))", boxShadow: "0 8px 30px -8px hsl(var(--landing-accent) / 0.3)" }}>
              <Link to="/signup">
                Upgrade to Pro <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <ul className="space-y-3">
              {proFeatures.map((f) => (
                <li key={f.text} className="flex items-start gap-2.5 text-sm" style={{ color: "hsl(var(--landing-fg) / 0.85)" }}>
                  <f.icon className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "hsl(var(--landing-champagne))" }} />
                  {f.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ or footer note */}
        <div className="text-center mt-16">
          <p className="text-sm" style={{ color: "hsl(var(--landing-muted))" }}>
            Questions? <Link to="/" className="underline hover:no-underline" style={{ color: "hsl(var(--landing-champagne))" }}>Get in touch</Link>. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
