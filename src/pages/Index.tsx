import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Film, Pen, Mic2, Camera, ArrowRight, Sparkles, 
  BarChart3, Palette, Shield, Zap, Globe, Users 
} from "lucide-react";

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

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">CreativeSlate</span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground mb-6">
            <Sparkles className="h-3 w-3" />
            Portfolio platform for entertainment professionals
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Your work deserves<br />
            <span className="text-primary">a better showcase</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Build a stunning portfolio in minutes. Showcase screenplays, reels, headshots, and credits — 
            all in one professional page designed for the entertainment industry.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/signup">
                Create Your Portfolio <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/signup">See Examples</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-y border-border/50 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <p className="text-center text-sm text-muted-foreground mb-6 uppercase tracking-wider font-medium">Built for</p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {profileTypes.map((t) => (
              <div key={t.label} className="flex items-center gap-2 text-muted-foreground">
                <t.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Everything you need</h2>
          <p className="text-muted-foreground">Professional tools without the complexity.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="group">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50">
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to stand out?</h2>
          <p className="text-muted-foreground mb-8">
            Join creators who've ditched generic websites for a portfolio built for the industry.
          </p>
          <Button size="lg" asChild>
            <Link to="/signup">Get Started — It's Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} CreativeSlate</span>
          <div className="flex gap-6">
            <Link to="/login" className="hover:text-foreground transition-colors">Log in</Link>
            <Link to="/signup" className="hover:text-foreground transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
