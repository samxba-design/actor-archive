import { useEffect, useState } from "react";
import { sanitizeCSS } from "@/lib/sanitizeCSS";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PortfolioThemeProvider } from "@/themes/ThemeProvider";
import { resolveThemeId } from "@/themes/themes";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioFooter from "@/components/portfolio/PortfolioFooter";
import { EditModeProvider } from "@/components/portfolio/EditModeProvider";
import EditModeToolbar from "@/components/portfolio/EditModeToolbar";
import SortableSectionList from "@/components/portfolio/SortableSectionList";
import { ArrowUp, MessageSquare } from "lucide-react";
import ProfileSkeleton from "@/components/portfolio/ProfileSkeleton";
import { getProfileTypeConfig } from "@/config/profileSections";

interface ProfileData {
  id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  headline: string | null;
  tagline: string | null;
  bio: string | null;
  location: string | null;
  profile_photo_url: string | null;
  banner_url: string | null;
  profile_type: string | null;
  secondary_types: string[] | null;
  theme: string | null;
  accent_color: string | null;
  section_order: string[] | null;
  sections_visible: Record<string, boolean> | null;
  show_contact_form: boolean | null;
  available_for_hire: boolean | null;
  seeking_representation: boolean | null;
  slug: string | null;
  cta_label: string | null;
  cta_url: string | null;
  cta_type: string | null;
  booking_url: string | null;
  font_pairing: string | null;
  layout_density: string | null;
  custom_css: string | null;
  subscription_tier?: string | null;
  hero_style?: string | null;
  hero_background_preset?: string | null;
  hero_bg_type?: string | null;
  hero_bg_solid_color?: string | null;
  hero_bg_video_url?: string | null;
}

const DEFAULT_SECTION_ORDER = [
  "projects", "credits", "gallery", "awards", "press",
  "education", "skills", "services", "testimonials", "events", "contact",
];

const PublicProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
      if (error || !data) { setNotFound(true); } else { setProfile(data as unknown as ProfileData); }
      setLoading(false);
    };
    fetchProfile();
  }, [slug]);

  useEffect(() => {
    if (profile?.id) {
      supabase.from("page_views").insert({
        profile_id: profile.id, path: `/${slug}`, referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        device_type: window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop",
      });
    }
  }, [profile?.id, slug]);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!profile) return;
    const name = profile.display_name || [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Portfolio";
    const desc = profile.tagline || profile.bio?.slice(0, 155) || `${name}'s creative portfolio`;
    document.title = `${name} — Portfolio`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) { metaDesc = document.createElement("meta"); metaDesc.setAttribute("name", "description"); document.head.appendChild(metaDesc); }
    metaDesc.setAttribute("content", desc);
    const ogTags: Record<string, string> = { "og:title": `${name} — Portfolio`, "og:description": desc, "og:type": "profile", "og:url": window.location.href };
    if (profile.profile_photo_url) ogTags["og:image"] = profile.profile_photo_url;
    Object.entries(ogTags).forEach(([prop, content]) => {
      let tag = document.querySelector(`meta[property="${prop}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("property", prop); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    });
    const jsonLd = { "@context": "https://schema.org", "@type": "Person", name, ...(profile.tagline && { description: profile.tagline }), ...(profile.location && { address: { "@type": "PostalAddress", addressLocality: profile.location } }), ...(profile.profile_photo_url && { image: profile.profile_photo_url }), url: window.location.href };
    let script = document.getElementById("portfolio-jsonld");
    if (!script) { script = document.createElement("script"); script.id = "portfolio-jsonld"; script.setAttribute("type", "application/ld+json"); document.head.appendChild(script); }
    script.textContent = JSON.stringify(jsonLd);
    return () => { document.title = "CreativeSlate"; const el = document.getElementById("portfolio-jsonld"); if (el) el.remove(); };
  }, [profile]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-muted-foreground">This portfolio doesn't exist or isn't published yet.</p>
      </div>
    );
  }

  const previewTheme = searchParams.get("preview_theme");
  const themeId = resolveThemeId(previewTheme || profile.theme);

  let sectionOrder = profile.section_order;
  const typeConfig = profile.profile_type ? getProfileTypeConfig(profile.profile_type) : null;
  if (!sectionOrder || sectionOrder.length === 0) {
    if (typeConfig && typeConfig.sections.length > 0) {
      sectionOrder = typeConfig.sections.map((s) => s.key).filter((k) => k !== "hero");
    } else {
      sectionOrder = DEFAULT_SECTION_ORDER;
    }
  }

  const sectionsVisible = (profile.sections_visible || {}) as Record<string, boolean>;
  const showContact = profile.show_contact_form !== false;

  // Build section label map from profile type config
  const allSections = typeConfig
    ? typeConfig.sections.filter((s) => s.key !== "hero").map((s) => ({ key: s.key, label: s.label }))
    : sectionOrder.filter((k) => k !== "hero" && k !== "contact").map((k) => ({ key: k, label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) }));

  const scrollToContact = () => {
    const el = document.getElementById("portfolio-contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PortfolioThemeProvider themeId={themeId} className="min-h-screen relative">
      {profile.custom_css && <style dangerouslySetInnerHTML={{ __html: sanitizeCSS(profile.custom_css) }} />}

      <EditModeProvider
        profileId={profile.id}
        initialSectionOrder={sectionOrder}
        initialSectionsVisible={sectionsVisible}
      >
        <PortfolioHero
          profile={profile}
          heroBgType={(profile.hero_bg_type as any) || 'preset'}
          heroBgSolidColor={profile.hero_bg_solid_color || undefined}
          heroBgVideoUrl={profile.hero_bg_video_url || undefined}
        />

        <main className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
          <SortableSectionList
            allSections={allSections}
            profileId={profile.id}
            profileType={profile.profile_type}
            profileSlug={profile.slug || undefined}
          />
        </main>

        <div id="portfolio-contact">
          <PortfolioFooter
            profile={{ ...profile, auto_responder_enabled: (profile as any).auto_responder_enabled, auto_responder_message: (profile as any).auto_responder_message, subscription_tier: (profile as any).subscription_tier }}
            showContact={showContact}
          />
        </div>

        <EditModeToolbar />

      {/* Floating Contact CTA */}
      {showContact && (
        <button
          onClick={scrollToContact}
          className="fixed bottom-20 right-6 z-40 rounded-full p-3 shadow-lg transition-all hover:scale-105"
          style={{
            background: "hsl(var(--portfolio-accent, var(--primary)))",
            color: "hsl(var(--portfolio-accent-fg, var(--primary-foreground)))",
          }}
          aria-label="Contact me"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      )}

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 rounded-full p-3 shadow-lg transition-all hover:scale-105 border"
          style={{
            background: "hsl(var(--portfolio-card, var(--card)))",
            color: "hsl(var(--portfolio-fg, var(--foreground)))",
            borderColor: "hsl(var(--portfolio-border, var(--border)))",
          }}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      </EditModeProvider>
    </PortfolioThemeProvider>
  );
};

export default PublicProfile;
