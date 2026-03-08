import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";

const Privacy = () => (
  <div className="min-h-screen landing-page" style={{ background: "hsl(var(--landing-bg))", color: "hsl(var(--landing-fg))" }}>
    <div className="gradient-mesh">
      <div className="gradient-mesh-orb gradient-mesh-orb--1" />
      <div className="gradient-mesh-orb gradient-mesh-orb--2" />
      <div className="gradient-mesh-orb gradient-mesh-orb--3" />
    </div>
    <div className="cinema-vignette" />
    <MarketingNav />
    <div className="max-w-3xl mx-auto px-6 pt-20 pb-24 relative z-10">
      <h1 className="text-4xl font-bold tracking-tight mb-8" style={{ color: "hsl(var(--landing-fg))" }}>Privacy Policy</h1>
      <div className="space-y-6 text-sm leading-relaxed" style={{ color: "hsl(var(--landing-muted))" }}>
        <p><strong style={{ color: "hsl(var(--landing-fg))" }}>Last updated:</strong> March 8, 2026</p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>1. Information We Collect</h2>
          <p>We collect information you provide when creating an account (name, email, password), profile content you publish (bio, headshots, credits, etc.), and usage data such as page views, device type, and referrer information.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>2. How We Use Your Information</h2>
          <p>We use your information to provide and improve the CreativeSlate platform, display your public portfolio, send account-related communications, and generate aggregate analytics visible in your dashboard.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>3. Data Sharing</h2>
          <p>We do not sell your personal data. We may share information with service providers who help us operate the platform (hosting, email delivery, payment processing). Your public portfolio content is visible to anyone with the link.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>4. Data Security</h2>
          <p>We implement industry-standard security measures including encryption in transit and at rest, secure authentication, and row-level security policies on all database tables.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>5. Your Rights</h2>
          <p>You may access, update, or delete your personal data at any time through your dashboard settings. You may also request a full data export or account deletion by contacting us.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>6. Cookies</h2>
          <p>We use essential cookies for authentication and session management. We do not use third-party tracking cookies or advertising pixels.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>7. Contact</h2>
          <p>For privacy-related inquiries, please reach out through the contact form on our website.</p>
        </section>
      </div>
    </div>
    <MarketingFooter />
  </div>
);

export default Privacy;
