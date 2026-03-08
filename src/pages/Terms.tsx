import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";

const Terms = () => (
  <div className="min-h-screen landing-page" style={{ background: "hsl(var(--landing-bg))", color: "hsl(var(--landing-fg))" }}>
    <div className="gradient-mesh">
      <div className="gradient-mesh-orb gradient-mesh-orb--1" />
      <div className="gradient-mesh-orb gradient-mesh-orb--2" />
      <div className="gradient-mesh-orb gradient-mesh-orb--3" />
    </div>
    <div className="cinema-vignette" />
    <MarketingNav />
    <div className="max-w-3xl mx-auto px-6 pt-20 pb-24 relative z-10">
      <h1 className="text-4xl font-bold tracking-tight mb-8" style={{ color: "hsl(var(--landing-fg))" }}>Terms of Service</h1>
      <div className="space-y-6 text-sm leading-relaxed" style={{ color: "hsl(var(--landing-muted))" }}>
        <p><strong style={{ color: "hsl(var(--landing-fg))" }}>Last updated:</strong> March 8, 2026</p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>1. Acceptance of Terms</h2>
          <p>By accessing or using CreativeSlate, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>2. Account Responsibilities</h2>
          <p>You are responsible for maintaining the security of your account credentials and for all activity under your account. You must provide accurate information during registration.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>3. Content Ownership</h2>
          <p>You retain all rights to content you upload to CreativeSlate. By publishing content, you grant us a limited license to display and distribute that content as part of your portfolio. You may remove your content at any time.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>4. Acceptable Use</h2>
          <p>You agree not to use CreativeSlate for unlawful purposes, to upload content that infringes on others' rights, or to attempt to interfere with the platform's operation.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>5. Subscriptions & Billing</h2>
          <p>Free accounts have feature limitations as described on our Pricing page. Pro subscriptions are billed monthly or annually and may be cancelled at any time. Refunds are handled on a case-by-case basis.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>6. Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time through your settings.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>7. Limitation of Liability</h2>
          <p>CreativeSlate is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform, including loss of data or revenue.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--landing-fg))" }}>8. Changes to Terms</h2>
          <p>We may update these terms from time to time. Continued use of CreativeSlate after changes constitutes acceptance of the updated terms.</p>
        </section>
      </div>
    </div>
    <MarketingFooter />
  </div>
);

export default Terms;
