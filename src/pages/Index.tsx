import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/useInView";
import { themes } from "@/lib/themes";
import {
  Film, Pen, Mic2, Camera, ArrowRight, Sparkles,
  BarChart3, Palette, Shield, Zap, Globe, Users,
  Eye, MessageSquare, FolderOpen, Diamond, Quote, PenTool
} from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { CinematicBackground } from "@/components/CinematicBackground";
import SEOHead from "@/components/SEOHead";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import SocialProofToast from "@/components/SocialProofToast";

/* ── data ── */
const features = [
  { icon: Palette, title: "10+ Stunning Themes", desc: "From minimal to brutalist — pick a look that matches your creative voice." },
  { icon: Film, title: "TMDB Integration", desc: "Auto-fill film & TV credits with posters, cast, and metadata from TMDB." },
  { icon: BarChart3, title: "Built-in Analytics", desc: "Track page views, referrers, and device breakdowns in your dashboard." },
  { icon: Shield, title: "Access Control", desc: "Password-protect scripts, gate content behind email capture, or keep it public." },
  { icon: Zap, title: "Instant Publishing", desc: "Go live in seconds with your custom slug. Update anytime from the dashboard." },
  { icon: Globe, title: "Custom Domains", desc: "Connect your own domain for a fully branded portfolio experience." },
];

const profileTypes = [
  { icon: Pen, label: "Screenwriters" },
  { icon: Film, label: "Directors" },
  { icon: Mic2, label: "Actors" },
  { icon: Camera, label: "Creators" },
  { icon: Users, label: "Multi-Hyphenates" },
];

const stats = [
  { icon: FolderOpen, value: "2,400+", label: "Portfolios Created" },
  { icon: Eye, value: "1.2M", label: "Portfolio Views" },
  { icon: MessageSquare, value: "18K", label: "Contact Messages" },
];

const showcaseThemes = ["noir", "editorial", "spotlight", "midnight", "minimal", "gallery"] as const;

const testimonials = [
  { quote: "CreativeSlate finally gave my scripts the showcase they deserve. I booked two generals in the first week.", author: "Maya Chen", role: "Screenwriter", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" },
  { quote: "I booked two roles directly from agents who found my portfolio. The headshot gallery and stats page are game changers.", author: "Damon Brooks", role: "Actor", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" },
  { quote: "The best portfolio platform I've seen for the entertainment industry. Period.", author: "Sofia Ortiz", role: "Director", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" },
];

/* ── JSON-LD ── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CreativeSlate",
  description: "Professional portfolio platform for creative professionals in film, TV, and media.",
  url: "https://actor-archive.lovable.app",
  applicationCategory: "BusinessApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const FeatureCard = forwardRef<HTMLDivElement, { icon: any; title: string; desc: string; index: number }>(({ icon: Icon, title, desc, index }, _ref) => {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className="group relative p-6 rounded-xl border transition-all duration-500 glass-card"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${index * 80}ms`,
        background: "hsl(var(--landing-card) / 0.6)",
        borderColor: "hsl(var(--landing-border))",
      }}
    >
      {/* hover glow */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1px hsl(var(--landing-accent) / 0.3), 0 0 30px -10px hsl(var(--landing-accent) / 0.15)" }}
      />
      <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-4"
        style={{ background: "hsl(var(--landing-accent) / 0.12)" }}>
        <Icon className="h-5 w-5" style={{ color: "hsl(var(--landing-champagne))" }} />
      </div>
      <h3 className="font-semibold mb-1.5" style={{ color: "hsl(var(--landing-fg))" }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--landing-muted))" }}>{desc}</p>
    </div>
  );
});
FeatureCard.displayName = "FeatureCard";

const TestimonialCard = forwardRef<HTMLDivElement, { quote: string; author: string; role: string; photo: string; index: number }>(({ quote, author, role, photo, index }, _fRef) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="relative p-6 rounded-xl border glass-card"
      style={{
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `all 0.6s ease ${index * 100}ms`,
        background: "hsl(var(--landing-card) / 0.6)", borderColor: "hsl(var(--landing-border))",
      }}>
      <Quote className="h-5 w-5 mb-3" style={{ color: "hsl(var(--landing-accent) / 0.4)" }} />
      <p className="text-sm leading-relaxed mb-4" style={{ color: "hsl(var(--landing-fg) / 0.85)" }}>"{quote}"</p>
      <div className="flex items-center gap-3">
        <img src={photo} alt={author} className="w-9 h-9 rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>{author}</p>
          <p className="text-xs" style={{ color: "hsl(var(--landing-muted))" }}>{role}</p>
        </div>
      </div>
    </div>
  );
});
TestimonialCard.displayName = "TestimonialCard";

const StatItem = forwardRef<HTMLDivElement, { icon: any; value: string; label: string; index: number }>(({ icon: Icon, value, label, index }, _fRef) => {
  const { ref, inView } = useInView();
  const [displayed, setDisplayed] = useState(value);
  
  useEffect(() => {
    if (!inView) return;
    // Parse the numeric part
    const match = value.match(/^([\d,.]+)(\D*)$/);
    if (!match) return;
    const target = parseFloat(match[1].replace(/,/g, ''));
    const suffix = match[2] || '';
    const isDecimal = match[1].includes('.');
    const hasCommas = match[1].includes(',');
    const duration = 1800;
    const startTime = performance.now();
    
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = target * eased;
      
      let formatted: string;
      if (isDecimal) {
        formatted = current.toFixed(1);
      } else if (hasCommas) {
        formatted = Math.round(current).toLocaleString();
      } else {
        formatted = Math.round(current).toString();
      }
      
      setDisplayed(formatted + suffix);
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center transition-all duration-500 glass-stat"
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(16px)", transitionDelay: `${index * 120}ms` }}>
      <Icon className="h-5 w-5 mx-auto mb-2" style={{ color: "hsl(var(--landing-champagne))" }} />
      <div className="text-2xl sm:text-3xl font-bold tabular-nums" style={{ color: "hsl(var(--landing-fg))" }}>{displayed}</div>
      <div className="text-xs mt-1" style={{ color: "hsl(var(--landing-muted))" }}>{label}</div>
    </div>
  );
});
StatItem.displayName = "StatItem";

const ThemeShowcase = forwardRef<HTMLDivElement>((_, _ref) => {
  const [active, setActive] = useState(0);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => setActive(i => (i + 1) % showcaseThemes.length), 3500);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <div ref={ref} className="space-y-8">
      {/* Theme pills */}
      <div className="flex justify-center gap-2">
        {showcaseThemes.map((key, i) => {
          const t = themes[key];
          return (
            <button key={key} onClick={() => setActive(i)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
              style={{
                background: active === i ? "hsl(var(--landing-accent))" : "hsl(var(--landing-card))",
                color: active === i ? "hsl(var(--landing-bg))" : "hsl(var(--landing-muted))",
              }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Mock browser frame */}
      <div className="relative max-w-3xl mx-auto rounded-xl overflow-hidden border glass-card glass-browser"
        style={{ borderColor: "hsl(var(--landing-border))", background: "hsl(345 25% 6%)" }}>
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid hsl(var(--landing-border))" }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(0 60% 50%)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(40 60% 50%)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(120 40% 45%)" }} />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[10px] px-3 py-1 rounded-md" style={{ background: "hsl(var(--landing-card))", color: "hsl(var(--landing-muted))" }}>
              creativeslate.com/alex-rivera
            </span>
          </div>
        </div>

        {/* Theme preview cards */}
        <div className="relative h-72 sm:h-80 overflow-hidden">
          {showcaseThemes.map((key, i) => {
            const t = themes[key];
            const v = t.variables;
            return (
              <div key={key}
                className="absolute inset-0 p-6 sm:p-8 transition-all duration-700 ease-in-out"
                style={{
                  opacity: active === i ? 1 : 0,
                  transform: active === i ? "scale(1)" : "scale(0.97)",
                  backgroundColor: `hsl(${v["--portfolio-bg"]})`,
                  color: `hsl(${v["--portfolio-fg"]})`,
                  fontFamily: v["--portfolio-body-font"],
                }}>
                {/* Mock hero */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: `hsl(${v["--portfolio-accent"]})`, color: `hsl(${v["--portfolio-accent-fg"]})` }}>
                    A
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold" style={{ fontFamily: v["--portfolio-heading-font"] }}>Alex Rivera</h3>
                    <p className="text-sm" style={{ color: `hsl(${v["--portfolio-muted-fg"]})` }}>Screenwriter & Director — Los Angeles</p>
                  </div>
                </div>
                {/* Mock cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="space-y-2 p-3 rounded-lg"
                      style={{ backgroundColor: `hsl(${v["--portfolio-card"]})`, border: `1px solid hsl(${v["--portfolio-border"]})` }}>
                      <div className="h-16 rounded" style={{ backgroundColor: `hsl(${v["--portfolio-muted"]})` }} />
                      <div className="h-2 rounded-full w-3/4" style={{ backgroundColor: `hsl(${v["--portfolio-muted"]})` }} />
                      <div className="h-2 rounded-full w-1/2" style={{ backgroundColor: `hsl(${v["--portfolio-muted"]})` }} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
ThemeShowcase.displayName = "ThemeShowcase";

/* ── page ── */
const Index = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [glassMode, setGlassMode] = useState(() => {
    try { return localStorage.getItem("glass-mode") !== "false"; } catch { return true; }
  });

  const toggleGlass = () => {
    setGlassMode(prev => {
      const next = !prev;
      try { localStorage.setItem("glass-mode", String(next)); } catch {}
      return next;
    });
  };

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!spotlightRef.current) return;
      spotlightRef.current.style.setProperty("--mx", `${e.clientX}px`);
      spotlightRef.current.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div ref={spotlightRef} className={`min-h-screen landing-page ${glassMode ? "glass-active" : ""}`}
      style={{ background: "hsl(var(--landing-bg))", color: "hsl(var(--landing-fg))" }}>

      <SEOHead
        title="CreativeSlate — Professional Portfolios for Film & TV"
        description="Build a stunning portfolio in minutes. Showcase scripts, reels, credits, and headshots with 10+ premium themes. Free forever."
        path="/"
        jsonLd={jsonLd}
      />
      {/* Cinematic background layers */}
      <CinematicBackground />


      {/* Spotlight that follows mouse */}
      <div className="spotlight-follow" />

      <MarketingNav showGlassToggle glassMode={glassMode} onToggleGlass={toggleGlass} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, hsl(var(--landing-accent) / 0.06) 0%, transparent 70%)" }} />

        <div className="max-w-4xl mx-auto px-6 pt-28 pb-24 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-8 animate-fade-in glass-card"
            style={{ border: "1px solid hsl(var(--landing-accent) / 0.3)", color: "hsl(var(--landing-champagne))", background: "hsl(var(--landing-accent) / 0.06)" }}>
            <Sparkles className="h-3 w-3" />
            Portfolio platform for entertainment professionals
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6" style={{ textShadow: '0 2px 20px hsl(var(--landing-bg) / 0.7), 0 0 40px hsl(var(--landing-bg) / 0.5)' }}>
            <span className="block">
              <span className="hero-word inline-block" style={{ animationDelay: "0ms", color: "hsl(var(--landing-fg))" }}>Your&nbsp;</span>
              <span className="hero-word inline-block" style={{ animationDelay: "80ms", color: "hsl(var(--landing-fg))" }}>work&nbsp;</span>
              <span className="hero-word inline-block" style={{ animationDelay: "160ms", color: "hsl(var(--landing-fg))" }}>deserves</span>
            </span>
            <span className="hero-word inline-block text-gradient-gold" style={{ animationDelay: "300ms" }}>a better showcase</span>
          </h1>

          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-10 animate-fade-in"
            style={{ color: "hsl(var(--landing-muted))", animationDelay: "500ms", animationFillMode: "backwards", textShadow: '0 1px 12px hsl(var(--landing-bg) / 0.6)' }}>
            Build a stunning portfolio in minutes. Showcase screenplays, reels, headshots, and credits —
            all in one professional page designed for the entertainment industry.
          </p>

          {/* Trust signal */}
          <p className="text-xs tracking-wide animate-fade-in" style={{ color: "hsl(var(--landing-muted) / 0.7)", animationDelay: "600ms", animationFillMode: "backwards" }}>
            Trusted by 2,400+ screenwriters, actors & directors
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in"
            style={{ animationDelay: "700ms", animationFillMode: "backwards" }}>
            <Button size="lg" asChild
              className="font-semibold border-0 text-white text-base px-8"
              style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))", boxShadow: "0 8px 30px -8px hsl(var(--landing-accent) / 0.3)" }}>
              <Link to="/signup">
                Create Your Portfolio <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-base px-8 glass-card"
              style={{ borderColor: "hsl(var(--landing-fg) / 0.15)", color: "hsl(var(--landing-fg) / 0.8)" }}>
              <Link to="/demo/actor">See Examples</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Built for marquee */}
      <section className="border-y overflow-hidden" style={{ borderColor: "hsl(var(--landing-border))", background: "hsl(345 25% 7%)" }}>
        <div className="py-6 relative">
          <div className="marquee-fade-edges" />
          <div className="marquee-track">
            {[...profileTypes, ...profileTypes, ...profileTypes].map((t, i) => (
              <div key={i} className="flex items-center gap-2 mx-8 shrink-0" style={{ color: "hsl(var(--landing-muted))" }}>
                <t.icon className="h-4 w-4" />
                <span className="text-sm font-medium whitespace-nowrap">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <StatItem key={i} icon={s.icon} value={s.value} label={s.label} index={i} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "hsl(var(--landing-fg))" }}>Everything you need</h2>
          <p style={{ color: "hsl(var(--landing-muted))" }}>Professional tools without the complexity.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </section>

      {/* Live Demo CTA */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl glass-card"
            style={{ border: "1px solid hsl(var(--landing-accent) / 0.3)", background: "hsl(var(--landing-card) / 0.5)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 30% 50%, hsl(var(--landing-accent) / 0.08) 0%, transparent 60%)" }} />
            <div className="relative flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs"
                  style={{ background: "hsl(var(--landing-accent) / 0.1)", color: "hsl(var(--landing-champagne))" }}>
                  <Sparkles className="h-3 w-3" /> Live Examples
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "hsl(var(--landing-fg))" }}>
                  See what a finished portfolio looks like
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--landing-muted))" }}>
                  Explore fully fleshed-out demo portfolios for different creative professions — with all customization options live.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Screenwriter", path: "/demo/screenwriter", icon: Pen },
                    { label: "Actor", path: "/demo/actor", icon: Mic2 },
                    { label: "Copywriter", path: "/demo/copywriter", icon: PenTool },
                  ].map(demo => (
                    <Link
                      key={demo.path}
                      to={demo.path}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02] no-underline"
                      style={{
                        background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))",
                        color: "white",
                        boxShadow: "0 4px 20px -6px hsl(var(--landing-accent) / 0.3)",
                      }}
                    >
                      <demo.icon className="h-3.5 w-3.5" />
                      {demo.label} Demo
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ))}
                </div>
              </div>
              {/* Mini preview card */}
              <div className="w-full md:w-64 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl"
                style={{ border: "1px solid hsl(var(--landing-border))" }}>
                <div className="aspect-[3/4] relative" style={{ background: "hsl(40 30% 96%)" }}>
                  <img
                    src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=200&fit=crop"
                    alt="Demo portfolio preview"
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-800" />
                      <div>
                        <div className="h-2 w-20 rounded-full" style={{ background: "hsl(30 15% 25%)" }} />
                        <div className="h-1.5 w-14 rounded-full mt-1" style={{ background: "hsl(30 10% 70%)" }} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {[1,2,3].map(n => (
                        <div key={n} className="h-8 rounded" style={{ background: "hsl(40 25% 93%)", border: "1px solid hsl(40 18% 82%)" }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme showcase */}
      <section className="py-24 px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "hsl(var(--landing-fg))" }}>Themes that match your voice</h2>
          <p style={{ color: "hsl(var(--landing-muted))" }}>10 handcrafted themes designed for the entertainment industry. Preview them live.</p>
        </div>
        <ThemeShowcase />
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 relative z-10" style={{ borderTop: "1px solid hsl(var(--landing-border))" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "hsl(var(--landing-fg))" }}>Loved by creatives</h2>
            <p style={{ color: "hsl(var(--landing-muted))" }}>Hear from entertainment professionals who switched to CreativeSlate.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 px-6 overflow-hidden z-10">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, hsl(var(--landing-accent) / 0.08) 0%, transparent 60%)" }} />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: "hsl(var(--landing-fg))" }}>Ready to stand out?</h2>
          <p className="mb-10" style={{ color: "hsl(var(--landing-muted))" }}>
            Join creators who've ditched generic websites for a portfolio built for the industry.
          </p>
          <div className="relative inline-block">
            <div className="absolute -inset-1 rounded-lg opacity-60 blur-lg animate-pulse"
              style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }} />
            <Button size="lg" asChild
              className="relative font-semibold border-0 text-white text-base px-8"
              style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }}>
              <Link to="/signup">Get Started — It's Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
};

export default Index;
