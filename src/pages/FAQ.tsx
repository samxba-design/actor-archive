import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, HelpCircle } from "lucide-react";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { CinematicBackground } from "@/components/CinematicBackground";
import SEOHead from "@/components/SEOHead";
import { useRef, useEffect, useState } from "react";

const faqCategories = [
  {
    title: "Getting Started",
    items: [
      { q: "Is CreativeSlate really free?", a: "Yes! The free tier includes everything you need to build and publish a professional portfolio — a custom URL, all core sections, contact form, and analytics. Pro unlocks premium themes, custom fonts, auto-responder, and more." },
      { q: "What types of creatives is this for?", a: "CreativeSlate is built for screenwriters, directors, producers, actors, copywriters, authors, journalists, and multi-hyphenates. Each profile type comes with tailored sections — like script libraries for writers or headshot galleries for actors." },
      { q: "Do I need any coding or design skills?", a: "Not at all. Choose a theme, add your work, and publish. Everything is point-and-click. Power users can add custom CSS, but it's entirely optional." },
      { q: "How long does it take to set up?", a: "Most users have a published portfolio in under 10 minutes. The onboarding wizard walks you through profile type selection, basic info, theme choice, and your first content." },
    ],
  },
  {
    title: "Features & Content",
    items: [
      { q: "Can I import my credits from TMDB/IMDb?", a: "Yes! Search any film or TV show by title and we'll auto-import the poster, backdrop, cast, director, genre, runtime, and more. You just pick your role and add any custom details." },
      { q: "How does script access control work?", a: "Each script or document can have one of 5 access levels: Public (anyone can view), Gated (requires email to download), Password-protected, NDA-required, or Private (only you can see it). All downloads are tracked in your analytics." },
      { q: "Can I reorder and hide sections?", a: "Absolutely. In Settings, you can drag sections into any order and toggle each one on or off. Hidden sections are invisible to visitors — no empty states will ever show." },
      { q: "Does it work on mobile?", a: "Every portfolio and theme is fully responsive. Your visitors get a great experience whether they're on a phone, tablet, or desktop." },
    ],
  },
  {
    title: "Plans & Billing",
    items: [
      { q: "What's included in the Pro plan?", a: "Pro unlocks all 17 themes, custom font pairings, auto-responder for contact submissions, custom CSS injection, Google Analytics integration, and priority support. Check the Pricing page for full details." },
      { q: "Can I switch between plans?", a: "Yes, you can upgrade to Pro at any time. If you downgrade, your portfolio stays intact — Pro-only features simply become inactive until you re-subscribe." },
      { q: "Is there a refund policy?", a: "We offer a 14-day money-back guarantee on Pro subscriptions. If you're not satisfied, contact support and we'll process a full refund." },
      { q: "Do I keep my data if I cancel?", a: "Yes. Your portfolio, projects, contacts, and all data remain in your account even after canceling. You can re-subscribe at any time to regain access to Pro features." },
    ],
  },
  {
    title: "Privacy & Security",
    items: [
      { q: "Can I export my data?", a: "Yes. You can export all your portfolio data (projects, testimonials, contacts) from the Settings page in your dashboard." },
      { q: "Is my portfolio indexed by search engines?", a: "By default, portfolios are noindex (private link only). You can opt into search engine indexing from Settings → SEO to appear in Google results." },
      { q: "Can I delete my account?", a: "Yes. Go to Settings → Danger Zone. Account deletion permanently removes all your data, including your portfolio, projects, and contacts. This action cannot be undone." },
      { q: "How is my contact form protected from spam?", a: "We use client-side rate limiting and honeypot fields to prevent automated spam. Your contact form submissions are private and only visible to you." },
    ],
  },
];

const FAQ = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [glassMode, setGlassMode] = useState(() => {
    try { return localStorage.getItem("glass-mode") !== "false"; } catch { return true; }
  });

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
        title="FAQ — Frequently Asked Questions"
        description="Get answers to common questions about CreativeSlate — plans, features, privacy, and how to get started."
        path="/faq"
      />
      <CinematicBackground bokehCount={6} />
      <div className="spotlight-follow" />
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 pt-28 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6 glass-card"
            style={{ border: "1px solid hsl(var(--landing-accent) / 0.3)", color: "hsl(var(--landing-champagne))", background: "hsl(var(--landing-accent) / 0.06)" }}>
            <HelpCircle className="h-3 w-3" /> FAQ
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" style={{ color: "hsl(var(--landing-fg))" }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: "hsl(var(--landing-muted))" }}>
            Everything you need to know about building your portfolio with CreativeSlate.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="max-w-3xl mx-auto px-6 pb-24 relative z-10">
        <div className="space-y-10">
          {faqCategories.map((cat) => (
            <div key={cat.title}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "hsl(var(--landing-champagne))" }}>{cat.title}</h2>
              <div className="rounded-xl border glass-card overflow-hidden"
                style={{ borderColor: "hsl(var(--landing-border))", background: "hsl(var(--landing-card) / 0.5)" }}>
                <Accordion type="single" collapsible>
                  {cat.items.map((item, i) => (
                    <AccordionItem key={i} value={`${cat.title}-${i}`} className="border-b last:border-b-0" style={{ borderColor: "hsl(var(--landing-border) / 0.5)" }}>
                      <AccordionTrigger className="px-5 py-4 text-sm font-medium text-left hover:no-underline" style={{ color: "hsl(var(--landing-fg))" }}>
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-4">
                        <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--landing-muted))" }}>{item.a}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-16 text-center">
          <p className="text-sm mb-4" style={{ color: "hsl(var(--landing-muted))" }}>Still have questions?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild className="font-semibold border-0 text-white"
              style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }}>
              <a href="mailto:hello@creativeslate.app">Contact Support</a>
            </Button>
            <Button variant="outline" asChild className="glass-card"
              style={{ borderColor: "hsl(var(--landing-fg) / 0.15)", color: "hsl(var(--landing-fg) / 0.8)" }}>
              <Link to="/pricing">View Pricing <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
};

export default FAQ;
