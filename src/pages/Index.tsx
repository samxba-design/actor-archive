import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/useInView";
import { themes } from "@/lib/themes";
import {
  Film, Pen, Mic2, Camera, ArrowRight, Sparkles,
  BarChart3, Palette, Shield, Zap, Globe, Users,
  Eye, MessageSquare, FolderOpen
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

const showcaseThemes = ["noir", "editorial", "spotlight", "midnight"] as const;

/* ── components ── */

const FeatureCard = ({ icon: Icon, title, desc, index }: { icon: any; title: string; desc: string; index: number }) => {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className="group relative p-6 rounded-xl border transition-all duration-500"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${index * 80}ms`,
        background: "hsl(220 20% 8% / 0.6)",
        borderColor: "hsl(220 15% 18%)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* hover glow */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1px hsl(40 80% 60% / 0.3), 0 0 30px -10px hsl(40 80% 60% / 0.15)" }}
      />
      <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-4"
        style={{ background: "hsl(40 80% 60% / 0.12)" }}>
        <Icon className="h-5 w-5" style={{ color: "hsl(40 80% 60%)" }} />
      </div>
      <h3 className="font-semibold mb-1.5 text-white">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "hsl(220 10% 55%)" }}>{desc}</p>
    </div>
  );
};

const StatItem = ({ icon: Icon, value, label, index }: { icon: any; value: string; label: string; index: number }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="text-center transition-all duration-500"
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(16px)", transitionDelay: `${index * 120}ms` }}>
      <Icon className="h-5 w-5 mx-auto mb-2" style={{ color: "hsl(40 80% 60%)" }} />
      <div className="text-2xl sm:text-3xl font-bold text-white">{value}</div>
      <div className="text-xs mt-1" style={{ color: "hsl(220 10% 45%)" }}>{label}</div>
    </div>
  );
};

const ThemeShowcase = () => {
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
                background: active === i ? "hsl(40 80% 60%)" : "hsl(220 15% 15%)",
                color: active === i ? "hsl(220 20% 6%)" : "hsl(220 10% 55%)",
              }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Mock browser frame */}
      <div className="relative max-w-3xl mx-auto rounded-xl overflow-hidden border"
        style={{ borderColor: "hsl(220 15% 18%)", background: "hsl(220 20% 6%)" }}>
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid hsl(220 15% 15%)" }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(0 60% 50%)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(40 60% 50%)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(120 40% 45%)" }} />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[10px] px-3 py-1 rounded-md" style={{ background: "hsl(220 15% 12%)", color: "hsl(220 10% 45%)" }}>
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
};

/* ── page ── */
const Index = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);

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
    <div ref={spotlightRef} className="min-h-screen landing-page"
      style={{ background: "hsl(220 20% 4%)", color: "hsl(220 10% 85%)" }}>

      {/* Film grain overlay */}
      <div className="film-grain" />

      {/* Spotlight that follows mouse */}
      <div className="spotlight-follow" />

      {/* Nav */}
      <nav className="relative z-50 border-b" style={{ borderColor: "hsl(220 15% 12%)", background: "hsl(220 20% 4% / 0.85)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight text-white">CreativeSlate</span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-white hover:bg-white/10">
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold border-0">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, hsl(40 80% 50% / 0.06) 0%, transparent 70%)" }} />

        <div className="max-w-4xl mx-auto px-6 pt-28 pb-24 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-8 animate-fade-in"
            style={{ border: "1px solid hsl(40 80% 60% / 0.3)", color: "hsl(40 80% 60%)", background: "hsl(40 80% 60% / 0.06)" }}>
            <Sparkles className="h-3 w-3" />
            Portfolio platform for entertainment professionals
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            <span className="hero-word inline-block" style={{ animationDelay: "0ms" }}>Your </span>
            <span className="hero-word inline-block" style={{ animationDelay: "80ms" }}>work </span>
            <span className="hero-word inline-block" style={{ animationDelay: "160ms" }}>deserves</span>
            <br />
            <span className="hero-word inline-block text-gradient-gold" style={{ animationDelay: "300ms" }}>a better showcase</span>
          </h1>

          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-10 animate-fade-in"
            style={{ color: "hsl(220 10% 55%)", animationDelay: "500ms", animationFillMode: "backwards" }}>
            Build a stunning portfolio in minutes. Showcase screenplays, reels, headshots, and credits —
            all in one professional page designed for the entertainment industry.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in"
            style={{ animationDelay: "650ms", animationFillMode: "backwards" }}>
            <Button size="lg" asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold border-0 shadow-lg shadow-amber-500/20 text-base px-8">
              <Link to="/signup">
                Create Your Portfolio <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-white/15 text-white/80 hover:bg-white/5 hover:text-white text-base px-8">
              <Link to="/signup">See Examples</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Built for marquee */}
      <section className="border-y overflow-hidden" style={{ borderColor: "hsl(220 15% 12%)", background: "hsl(220 20% 5%)" }}>
        <div className="py-6 relative">
          <div className="marquee-fade-edges" />
          <div className="marquee-track">
            {[...profileTypes, ...profileTypes, ...profileTypes].map((t, i) => (
              <div key={i} className="flex items-center gap-2 mx-8 shrink-0" style={{ color: "hsl(220 10% 50%)" }}>
                <t.icon className="h-4 w-4" />
                <span className="text-sm font-medium whitespace-nowrap">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <StatItem key={i} icon={s.icon} value={s.value} label={s.label} index={i} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-white">Everything you need</h2>
          <p style={{ color: "hsl(220 10% 50%)" }}>Professional tools without the complexity.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </section>

      {/* Theme showcase */}
      <section className="py-24 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-white">Themes that match your voice</h2>
          <p style={{ color: "hsl(220 10% 50%)" }}>10 handcrafted themes designed for the entertainment industry. Preview them live.</p>
        </div>
        <ThemeShowcase />
      </section>

      {/* CTA */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, hsl(40 80% 50% / 0.08) 0%, transparent 60%)" }} />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white">Ready to stand out?</h2>
          <p className="mb-10" style={{ color: "hsl(220 10% 50%)" }}>
            Join creators who've ditched generic websites for a portfolio built for the industry.
          </p>
          <div className="relative inline-block">
            <div className="absolute -inset-1 rounded-lg opacity-60 blur-lg animate-pulse"
              style={{ background: "linear-gradient(135deg, hsl(40 80% 55%), hsl(20 80% 55%))" }} />
            <Button size="lg" asChild className="relative bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold border-0 text-base px-8">
              <Link to="/signup">Get Started — It's Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: "hsl(220 15% 10%)", background: "hsl(220 20% 3%)" }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
          style={{ color: "hsl(220 10% 35%)" }}>
          <span>© {new Date().getFullYear()} CreativeSlate</span>
          <div className="flex gap-6">
            <Link to="/login" className="hover:text-white transition-colors">Log in</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
