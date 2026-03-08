import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/useInView";
import {
  Film, Pen, Mic2, Camera, ArrowRight, Sparkles, X as XIcon,
  BarChart3, Palette, Shield, Zap, Globe, Users, Search,
  FileText, Bot, Mail, Layers, Lock, CheckCircle2, Diamond,
  AlertTriangle, Clock, Frown, Briefcase
} from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { CinematicBackground } from "@/components/CinematicBackground";
import SEOHead from "@/components/SEOHead";


/* ── Animated Section Wrapper ── */
const AnimatedSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={className}
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
};

/* ── Pain Point Card ── */
const PainCard = ({ icon: Icon, title, desc, index }: { icon: any; title: string; desc: string; index: number }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="relative p-5 rounded-xl border glass-card group"
      style={{
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `all 0.6s ease ${index * 100}ms`,
        background: "hsl(0 30% 12% / 0.4)", borderColor: "hsl(0 30% 25% / 0.3)",
      }}>
      <div className="h-9 w-9 rounded-lg flex items-center justify-center mb-3"
        style={{ background: "hsl(0 40% 40% / 0.15)" }}>
        <Icon className="h-4 w-4" style={{ color: "hsl(0 60% 65%)" }} />
      </div>
      <h3 className="font-semibold text-sm mb-1" style={{ color: "hsl(0 20% 85%)" }}>{title}</h3>
      <p className="text-xs leading-relaxed" style={{ color: "hsl(0 10% 60%)" }}>{desc}</p>
    </div>
  );
};

/* ── Step Card ── */
const StepCard = ({ number, title, desc, icon: Icon, index }: { number: number; title: string; desc: string; icon: any; index: number }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="relative text-center"
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `all 0.6s ease ${index * 150}ms` }}>
      <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }}>
        <span className="text-lg font-bold text-white">{number}</span>
      </div>
      <Icon className="h-5 w-5 mx-auto mb-2" style={{ color: "hsl(var(--landing-champagne))" }} />
      <h3 className="font-semibold mb-1" style={{ color: "hsl(var(--landing-fg))" }}>{title}</h3>
      <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "hsl(var(--landing-muted))" }}>{desc}</p>
    </div>
  );
};

/* ── Feature Deep Dive ── */
const FeatureDeepDive = ({ icon: Icon, title, desc, bullets, index, reverse }: {
  icon: any; title: string; desc: string; bullets: string[]; index: number; reverse?: boolean;
}) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : `translateX(${reverse ? "40px" : "-40px"})`, transition: `all 0.7s ease ${index * 80}ms` }}>
      {/* Mock UI */}
      <div className="flex-1 w-full">
        <div className="rounded-xl border p-6 glass-card" style={{ borderColor: "hsl(var(--landing-border))", background: "hsl(var(--landing-card) / 0.5)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center"
              style={{ background: "hsl(var(--landing-accent) / 0.12)" }}>
              <Icon className="h-5 w-5" style={{ color: "hsl(var(--landing-champagne))" }} />
            </div>
            <div>
              <div className="h-3 w-32 rounded-full" style={{ background: "hsl(var(--landing-fg) / 0.15)" }} />
              <div className="h-2 w-20 rounded-full mt-1.5" style={{ background: "hsl(var(--landing-fg) / 0.08)" }} />
            </div>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map(n => (
              <div key={n} className="flex items-center gap-2">
                <div className="h-8 w-8 rounded" style={{ background: "hsl(var(--landing-accent) / 0.08)" }} />
                <div className="flex-1 space-y-1">
                  <div className="h-2 rounded-full" style={{ background: "hsl(var(--landing-fg) / 0.1)", width: `${70 + n * 10}%` }} />
                  <div className="h-1.5 rounded-full w-1/2" style={{ background: "hsl(var(--landing-fg) / 0.05)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Text */}
      <div className="flex-1 space-y-3">
        <h3 className="text-xl font-bold" style={{ color: "hsl(var(--landing-fg))" }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--landing-muted))" }}>{desc}</p>
        <ul className="space-y-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "hsl(var(--landing-champagne) / 0.9)" }}>
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "hsl(140 40% 55%)" }} />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ── Profile Type Card ── */
const ProfileTypeCard = ({ icon: Icon, label, bullets, index }: { icon: any; label: string; bullets: string[]; index: number }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="p-5 rounded-xl border glass-card"
      style={{
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `all 0.6s ease ${index * 80}ms`,
        background: "hsl(var(--landing-card) / 0.6)", borderColor: "hsl(var(--landing-border))",
      }}>
      <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-3"
        style={{ background: "hsl(var(--landing-accent) / 0.12)" }}>
        <Icon className="h-5 w-5" style={{ color: "hsl(var(--landing-champagne))" }} />
      </div>
      <h3 className="font-semibold mb-2" style={{ color: "hsl(var(--landing-fg))" }}>{label}</h3>
      <ul className="space-y-1">
        {bullets.map((b, i) => (
          <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: "hsl(var(--landing-muted))" }}>
            <span style={{ color: "hsl(var(--landing-champagne))" }}>·</span> {b}
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ── Data ── */
const painPoints = [
  { icon: Frown, title: "Generic Site Builders Don't Get It", desc: "Squarespace wasn't built to showcase screenplays, loglines, or actor measurements. You end up hacking together something that looks amateur." },
  { icon: Layers, title: "Credits Scattered Everywhere", desc: "Your IMDb, LinkedIn, personal site, and Vimeo all tell different stories. There's no single source of truth for your body of work." },
  { icon: Lock, title: "No Way to Control Access", desc: "You can't password-protect a script, gate a reel behind an NDA, or track who's reading your work. You're flying blind." },
  { icon: Clock, title: "Hours Lost to Formatting", desc: "Every time you land a new credit, you're reformatting Word docs, updating three websites, and re-uploading PDFs. Time you should be creating." },
];

const steps = [
  { icon: Palette, title: "Pick Your Profile & Theme", desc: "Choose from 10 profile types and 10+ stunning themes designed for the entertainment industry. We auto-configure the right sections for your craft." },
  { icon: Film, title: "Add Your Work", desc: "Import credits from TMDB, upload scripts with access controls, add reels, headshots, awards, testimonials, and more. Everything auto-formats beautifully." },
  { icon: Globe, title: "Publish & Share", desc: "Go live instantly with your custom URL. Share it with agents, producers, and collaborators. Embed it on your existing site if you want." },
];

const featureDeepDives = [
  { icon: Search, title: "TMDB Auto-Fill", desc: "Search any film or TV show and instantly import poster art, cast, synopsis, genre, and metadata. No more manual data entry.", bullets: ["Auto-import poster & backdrop art", "Pre-fill director, cast, genre, runtime", "Works for films, TV series, and shorts"] },
  { icon: FileText, title: "Script Library with Access Control", desc: "Upload PDFs and control exactly who sees them. Password-protect, gate behind email capture, or require an NDA acknowledgment.", bullets: ["5 access levels: public, gated, password, private, NDA", "Track who downloads what", "Email capture integration built in"] },
  { icon: BarChart3, title: "Built-in Analytics Dashboard", desc: "See who's visiting your portfolio, where they come from, and what they're looking at — without installing any third-party scripts.", bullets: ["Page views, referrers, device breakdown", "Contact form submission tracking", "Script download audit log"] },
  { icon: Bot, title: "AI Writing Assistant & Coverage Simulator", desc: "Get help crafting your bio, loglines, and synopses. Run your screenplay through an AI coverage simulator to get studio-style feedback.", bullets: ["Bio & logline generation", "Script coverage simulation", "Comp title matching"] },
  { icon: Palette, title: "10+ Industry-Designed Themes", desc: "Every theme is purpose-built for entertainment professionals — not repurposed blog templates. Dark modes, editorial layouts, spotlight effects.", bullets: ["Custom accent colors & font pairings", "Layout density controls", "Custom CSS for power users"] },
  { icon: Mail, title: "Contact Form & Pipeline Tracker", desc: "Built-in contact form routes inquiries to your dashboard. Track submissions, meetings, and representation leads in a private pipeline.", bullets: ["Categorized submission types", "Star, archive, and reply tracking", "Auto-responder support"] },
];

const profileTypes = [
  { icon: Pen, label: "Screenwriters", bullets: ["Script library with gated access", "Coverage simulator & comp titles", "Logline showcase & writing samples"] },
  { icon: Film, label: "Directors & Producers", bullets: ["TMDB credit import with posters", "Demo reel showcase", "Production history timeline"] },
  { icon: Mic2, label: "Actors", bullets: ["Headshot gallery with types", "Physical stats & measurements", "Representation directory"] },
  { icon: Briefcase, label: "Authors & Journalists", bullets: ["Bookshelf with purchase links", "Article feed with publications", "Speaking event calendar"] },
  { icon: Camera, label: "Corporate & Video Creators", bullets: ["Case study builder with metrics", "Service packages with pricing", "Client testimonial carousel"] },
  { icon: Users, label: "Multi-Hyphenates", bullets: ["Combine any profile type's sections", "Custom section ordering", "Secondary type badges"] },
];

const comparisonRows = [
  { feature: "Industry-specific sections", us: true, generic: false, none: false },
  { feature: "TMDB credit import", us: true, generic: false, none: false },
  { feature: "Script access control (5 levels)", us: true, generic: false, none: false },
  { feature: "Built-in analytics", us: true, generic: "paid", none: false },
  { feature: "AI bio & logline writing", us: true, generic: false, none: false },
  { feature: "Coverage simulator", us: true, generic: false, none: false },
  { feature: "Contact form + pipeline tracker", us: true, generic: "plugin", none: false },
  { feature: "Custom themes & fonts", us: true, generic: true, none: false },
  { feature: "Custom domain support", us: true, generic: "paid", none: false },
  { feature: "Free tier", us: true, generic: "limited", none: true },
];

/* ── Page ── */
const HowItWorks = () => {
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
        title="How It Works — Build Your Portfolio in Minutes"
        description="Three simple steps to a professional portfolio. Choose your profile type, add your work, and go live with a custom URL."
        path="/how-it-works"
      />
      <CinematicBackground bokehCount={10} />
      <div className="spotlight-follow" />

      <MarketingNav showGlassToggle glassMode={glassMode} onToggleGlass={toggleGlass} />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, hsl(var(--landing-accent) / 0.06) 0%, transparent 70%)" }} />
        <div className="max-w-4xl mx-auto px-6 pt-28 pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-8 animate-fade-in glass-card"
            style={{ border: "1px solid hsl(var(--landing-accent) / 0.3)", color: "hsl(var(--landing-champagne))", background: "hsl(var(--landing-accent) / 0.06)" }}>
            <Sparkles className="h-3 w-3" />
            How CreativeSlate Works
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
            <span className="hero-word inline-block" style={{ animationDelay: "0ms", color: "hsl(var(--landing-fg))" }}>Built for </span>
            <span className="hero-word inline-block" style={{ animationDelay: "80ms", color: "hsl(var(--landing-fg))" }}>Creatives </span>
            <span className="hero-word inline-block" style={{ animationDelay: "160ms", color: "hsl(var(--landing-fg))" }}>Who Are</span>
            <br />
            <span className="hero-word inline-block text-gradient-gold" style={{ animationDelay: "300ms" }}>Tired of Being Invisible</span>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-10 animate-fade-in"
            style={{ color: "hsl(var(--landing-muted))", animationDelay: "500ms", animationFillMode: "backwards" }}>
            Generic website builders don't understand your industry. CreativeSlate was designed from scratch
            for screenwriters, directors, actors, and creators who need a professional portfolio that actually
            speaks the language of entertainment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in"
            style={{ animationDelay: "650ms", animationFillMode: "backwards" }}>
            <Button size="lg" asChild className="font-semibold border-0 text-white text-base px-8"
              style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))", boxShadow: "0 8px 30px -8px hsl(var(--landing-accent) / 0.3)" }}>
              <Link to="/signup">Start Building — It's Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-base px-8 glass-card"
              style={{ borderColor: "hsl(var(--landing-fg) / 0.15)", color: "hsl(var(--landing-fg) / 0.8)" }}>
              <Link to="/demo/actor">View Live Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ PAIN POINTS ═══ */}
      <section className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <AnimatedSection className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4"
            style={{ background: "hsl(0 40% 20% / 0.3)", color: "hsl(0 60% 70%)", border: "1px solid hsl(0 30% 25% / 0.3)" }}>
            <AlertTriangle className="h-3 w-3" /> The Problem
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "hsl(var(--landing-fg))" }}>
            Why most creative portfolios fail
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: "hsl(var(--landing-muted))" }}>
            Sound familiar? These are the problems every entertainment professional faces.
          </p>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 gap-4">
          {painPoints.map((p, i) => <PainCard key={p.title} {...p} index={i} />)}
        </div>
      </section>

      {/* ═══ HOW IT WORKS (3 Steps) ═══ */}
      <section className="py-24 px-6 relative z-10" style={{ borderTop: "1px solid hsl(var(--landing-border))", borderBottom: "1px solid hsl(var(--landing-border))" }}>
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "hsl(var(--landing-fg))" }}>
            Three steps to a stunning portfolio
          </h2>
          <p style={{ color: "hsl(var(--landing-muted))" }}>No coding, no design skills, no frustration.</p>
        </AnimatedSection>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10 relative">
          {/* Connector lines */}
          <div className="hidden md:block absolute top-7 left-[20%] right-[20%] h-px" style={{ background: "linear-gradient(90deg, hsl(var(--landing-accent) / 0.3), hsl(var(--landing-accent-warm) / 0.3))" }} />
          {steps.map((s, i) => <StepCard key={s.title} number={i + 1} {...s} index={i} />)}
        </div>
      </section>

      {/* ═══ FEATURE DEEP DIVES ═══ */}
      <section className="max-w-5xl mx-auto px-6 py-24 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4"
            style={{ background: "hsl(var(--landing-accent) / 0.08)", color: "hsl(var(--landing-champagne))", border: "1px solid hsl(var(--landing-accent) / 0.2)" }}>
            <Zap className="h-3 w-3" /> Feature Deep Dives
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "hsl(var(--landing-fg))" }}>
            Tools built for the way you work
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: "hsl(var(--landing-muted))" }}>
            Every feature was designed with entertainment professionals in mind. Not bloggers. Not e-commerce. You.
          </p>
        </AnimatedSection>
        <div className="space-y-16">
          {featureDeepDives.map((f, i) => (
            <FeatureDeepDive key={f.title} {...f} index={i} reverse={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* ═══ WHO IT'S FOR ═══ */}
      <section className="py-24 px-6 relative z-10" style={{ borderTop: "1px solid hsl(var(--landing-border))" }}>
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "hsl(var(--landing-fg))" }}>
              Built for every creative role
            </h2>
            <p style={{ color: "hsl(var(--landing-muted))" }}>Pick your profile type and get sections tailored to your craft.</p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profileTypes.map((p, i) => <ProfileTypeCard key={p.label} {...p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON TABLE ═══ */}
      <section className="py-24 px-6 relative z-10" style={{ borderTop: "1px solid hsl(var(--landing-border))" }}>
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "hsl(var(--landing-fg))" }}>
              How we compare
            </h2>
            <p style={{ color: "hsl(var(--landing-muted))" }}>CreativeSlate vs. generic website builders vs. no website at all.</p>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <div className="rounded-xl border overflow-hidden glass-card" style={{ borderColor: "hsl(var(--landing-border))", background: "hsl(var(--landing-card) / 0.5)" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid hsl(var(--landing-border))" }}>
                      <th className="text-left p-4 font-medium" style={{ color: "hsl(var(--landing-muted))" }}>Feature</th>
                      <th className="p-4 text-center font-semibold" style={{ color: "hsl(var(--landing-champagne))" }}>
                        <span className="text-gradient-gold">CreativeSlate</span>
                      </th>
                      <th className="p-4 text-center font-medium" style={{ color: "hsl(var(--landing-muted))" }}>Generic Builder</th>
                      <th className="p-4 text-center font-medium" style={{ color: "hsl(var(--landing-muted))" }}>No Website</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr key={i} style={{ borderBottom: i < comparisonRows.length - 1 ? "1px solid hsl(var(--landing-border) / 0.5)" : undefined }}>
                        <td className="p-4" style={{ color: "hsl(var(--landing-fg) / 0.9)" }}>{row.feature}</td>
                        <td className="p-4 text-center">
                          {row.us === true && <CheckCircle2 className="h-5 w-5 mx-auto" style={{ color: "hsl(140 50% 55%)" }} />}
                        </td>
                        <td className="p-4 text-center">
                          {row.generic === true && <CheckCircle2 className="h-5 w-5 mx-auto" style={{ color: "hsl(140 30% 45%)" }} />}
                          {row.generic === false && <XIcon className="h-5 w-5 mx-auto" style={{ color: "hsl(0 40% 50%)" }} />}
                          {typeof row.generic === "string" && (
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "hsl(40 40% 25% / 0.3)", color: "hsl(40 50% 65%)" }}>{row.generic}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {row.none === true && <CheckCircle2 className="h-5 w-5 mx-auto" style={{ color: "hsl(140 30% 45%)" }} />}
                          {row.none === false && <XIcon className="h-5 w-5 mx-auto" style={{ color: "hsl(0 40% 50%)" }} />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative py-28 px-6 overflow-hidden z-10">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, hsl(var(--landing-accent) / 0.08) 0%, transparent 60%)" }} />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: "hsl(var(--landing-fg))" }}>
            Start building your portfolio today
          </h2>
          <p className="mb-10" style={{ color: "hsl(var(--landing-muted))" }}>
            Free forever. No credit card required. Upgrade when you're ready.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="relative inline-block">
              <div className="absolute -inset-1 rounded-lg opacity-60 blur-lg animate-pulse"
                style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }} />
              <Button size="lg" asChild className="relative font-semibold border-0 text-white text-base px-8"
                style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }}>
                <Link to="/signup">Get Started — It's Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <Button variant="outline" size="lg" asChild className="text-base px-8 glass-card"
              style={{ borderColor: "hsl(var(--landing-fg) / 0.15)", color: "hsl(var(--landing-fg) / 0.8)" }}>
              <Link to="/demo/actor">View Live Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
};

export default HowItWorks;
