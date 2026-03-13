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
import SectionKnownFor from "@/components/portfolio/sections/SectionKnownFor";
import type { KnownForItem } from "@/components/portfolio/sections/SectionKnownFor";
import PortfolioSectionWrapper from "@/components/portfolio/PortfolioSectionWrapper";
import type { KnownForPosition, HeroBgType } from "@/components/portfolio/PortfolioHero";
import { ArrowUp, MessageSquare, FileDown } from "lucide-react";
import { trackInteraction } from "@/lib/trackInteraction";
import ProfileSkeleton from "@/components/portfolio/ProfileSkeleton";
import { getProfileTypeConfig } from "@/config/profileSections";
import ShareButtons from "@/components/portfolio/ShareButtons";
import DarkModeToggle from "@/components/portfolio/DarkModeToggle";
import PDFExportModal from "@/components/portfolio/PDFExportModal";

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
  layout_preset: string | null;
  custom_css: string | null;
  subscription_tier?: string | null;
  hero_style?: string | null;
  hero_background_preset?: string | null;
  hero_bg_type?: string | null;
  hero_bg_solid_color?: string | null;
  hero_bg_video_url?: string | null;
  seo_indexable?: boolean | null;
  contact_mode?: string | null;
  known_for_position?: string | null;
  auto_responder_enabled?: boolean | null;
  auto_responder_message?: string | null;
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
  const [showPdfExport, setShowPdfExport] = useState(false);
  const [knownFor, setKnownFor] = useState<KnownForItem[]>([]);
  const [exportData, setExportData] = useState<{
    projects: { title: string; project_type: string; role_name?: string | null; year?: number | null }[];
    awards: { name: string; organization?: string | null; result?: string | null; year?: number | null }[];
    skills: { name: string; category?: string | null }[];
    education: { institution: string; degree_or_certificate?: string | null; year_start?: number | null; year_end?: number | null }[];
  }>({ projects: [], awards: [], skills: [], education: [] });

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

      // Fetch notable projects for KnownFor strip
      supabase.from("projects")
        .select("id,title,poster_url,role_name,imdb_link,year,network_or_studio")
        .eq("profile_id", profile.id).eq("is_notable", true)
        .order("display_order").limit(6)
        .then(({ data }) => setKnownFor(data || []));

      // Prefetch export data for PDF
      Promise.all([
        supabase.from("projects").select("title, project_type, role_name, year").eq("profile_id", profile.id).order("display_order").limit(20),
        supabase.from("awards").select("name, organization, result, year").eq("profile_id", profile.id).limit(10),
        supabase.from("skills").select("name, category").eq("profile_id", profile.id).limit(25),
        supabase.from("education").select("institution, degree_or_certificate, year_start, year_end").eq("profile_id", profile.id).limit(6),
      ]).then(([p, a, s, e]) => {
        setExportData({ projects: p.data || [], awards: a.data || [], skills: s.data || [], education: e.data || [] });
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

    // Robots meta — noindex by default, indexable only if toggled on
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) { robotsMeta = document.createElement("meta"); robotsMeta.setAttribute("name", "robots"); document.head.appendChild(robotsMeta); }
    robotsMeta.setAttribute("content", profile.seo_indexable ? "index, follow" : "noindex, nofollow");

    // Canonical URL
    const canonicalUrl = `${window.location.origin}/p/${profile.slug}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", canonicalUrl);

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) { metaDesc = document.createElement("meta"); metaDesc.setAttribute("name", "description"); document.head.appendChild(metaDesc); }
    metaDesc.setAttribute("content", desc);

    // OpenGraph tags
    const ogTags: Record<string, string> = {
      "og:title": `${name} — Portfolio`,
      "og:description": desc,
      "og:type": "profile",
      "og:url": canonicalUrl,
    };
    if (profile.profile_photo_url) ogTags["og:image"] = profile.profile_photo_url;
    Object.entries(ogTags).forEach(([prop, content]) => {
      let tag = document.querySelector(`meta[property="${prop}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("property", prop); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    });

    // Twitter Card meta
    const twitterTags: Record<string, string> = {
      "twitter:card": profile.profile_photo_url ? "summary_large_image" : "summary",
      "twitter:title": `${name} — Portfolio`,
      "twitter:description": desc,
    };
    if (profile.profile_photo_url) twitterTags["twitter:image"] = profile.profile_photo_url;
    Object.entries(twitterTags).forEach(([tName, content]) => {
      let tag = document.querySelector(`meta[name="${tName}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("name", tName); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    });

    // JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      name,
      ...(profile.tagline && { description: profile.tagline }),
      ...(profile.location && { address: { "@type": "PostalAddress", addressLocality: profile.location } }),
      ...(profile.profile_photo_url && { image: profile.profile_photo_url }),
      url: canonicalUrl,
    };
    let script = document.getElementById("portfolio-jsonld");
    if (!script) { script = document.createElement("script"); script.id = "portfolio-jsonld"; script.setAttribute("type", "application/ld+json"); document.head.appendChild(script); }
    script.textContent = JSON.stringify(jsonLd);

    return () => {
      document.title = "CreativeSlate";
      const el = document.getElementById("portfolio-jsonld"); if (el) el.remove();
      const robots = document.querySelector('meta[name="robots"]'); if (robots) robots.remove();
      const can = document.querySelector('link[rel="canonical"]'); if (can) can.remove();
      ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'].forEach(n => {
        const t = document.querySelector(`meta[name="${n}"]`); if (t) t.remove();
      });
    };
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

  const profileUrl = `${window.location.origin}/p/${profile.slug}`;
  const profileName = profile.display_name || [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Portfolio";

  return (
    <PortfolioThemeProvider themeId={themeId} className="min-h-screen relative">
      {profile.custom_css && <style dangerouslySetInnerHTML={{ __html: sanitizeCSS(profile.custom_css) }} />}

      {/* Skip to content link for accessibility */}
      <a href="#portfolio-main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md focus:shadow-lg">
        Skip to content
      </a>

      <EditModeProvider
        profileId={profile.id}
        initialSectionOrder={sectionOrder}
        initialSectionsVisible={sectionsVisible}
      >
        <PortfolioHero
          profile={profile}
          knownFor={knownFor}
          heroBgType={(profile.hero_bg_type as HeroBgType) || 'preset'}
          heroBgSolidColor={profile.hero_bg_solid_color || undefined}
          heroBgVideoUrl={profile.hero_bg_video_url || undefined}
          knownForPosition={(profile.known_for_position as KnownForPosition) || 'hero_above_name'}
        />

        <main id="portfolio-main" className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14" role="main">
          {/* Known For below hero or as body section */}
          {knownFor.length > 0 && (profile.known_for_position === 'below_hero' || profile.known_for_position === 'body_section') && (
            <PortfolioSectionWrapper title="Known For" index={-1}>
              <SectionKnownFor items={knownFor} variant="strip" />
            </PortfolioSectionWrapper>
          )}
          <SortableSectionList
            allSections={allSections}
            profileId={profile.id}
            profileType={profile.profile_type}
            profileSlug={profile.slug || undefined}
            bio={profile.bio}
          />
        </main>

        <div id="portfolio-contact">
          <PortfolioFooter
            profile={{ ...profile, auto_responder_enabled: profile.auto_responder_enabled, auto_responder_message: profile.auto_responder_message, subscription_tier: profile.subscription_tier, contact_mode: profile.contact_mode }}
            showContact={showContact}
          />
        </div>

        <EditModeToolbar />

      {/* Floating toolbar: dark mode, share, PDF, contact */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2">
        <DarkModeToggle />
        <ShareButtons url={profileUrl} title={profileName} description={profile.tagline || undefined} />
        <button
          onClick={() => { setShowPdfExport(true); trackInteraction(profile.id, "cv_downloaded"); }}
          className="rounded-full p-2.5 shadow-lg transition-all hover:scale-105 border"
          style={{
            background: "hsl(var(--portfolio-card, var(--card)))",
            color: "hsl(var(--portfolio-fg, var(--foreground)))",
            borderColor: "hsl(var(--portfolio-border, var(--border)))",
          }}
          aria-label="Export as PDF"
        >
          <FileDown className="h-4 w-4" />
        </button>
        {showContact && (
          <button
            onClick={() => { scrollToContact(); trackInteraction(profile.id, "contact_clicked"); }}
            className="rounded-full p-3 shadow-lg transition-all hover:scale-105"
            style={{
              background: "hsl(var(--portfolio-accent, var(--primary)))",
              color: "hsl(var(--portfolio-accent-fg, var(--primary-foreground)))",
            }}
            aria-label="Contact me"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        )}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-full p-2.5 shadow-lg transition-all hover:scale-105 border"
            style={{
              background: "hsl(var(--portfolio-card, var(--card)))",
              color: "hsl(var(--portfolio-fg, var(--foreground)))",
              borderColor: "hsl(var(--portfolio-border, var(--border)))",
            }}
            aria-label="Back to top"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* PDF Export Modal */}
      {showPdfExport && (
        <PDFExportModal
          profile={profile}
          projects={exportData.projects}
          awards={exportData.awards}
          skills={exportData.skills}
          education={exportData.education}
          isPro={profile.subscription_tier === "pro" || profile.subscription_tier === "premium"}
          onClose={() => setShowPdfExport(false)}
        />
      )}
      </EditModeProvider>
    </PortfolioThemeProvider>
  );
};

export default PublicProfile;
