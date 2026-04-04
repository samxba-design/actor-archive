import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { sanitizeCSS } from "@/lib/sanitizeCSS";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PortfolioThemeProvider } from "@/themes/ThemeProvider";
import { resolveThemeId } from "@/themes/themes";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioFooter from "@/components/portfolio/PortfolioFooter";
import { EditModeProvider } from "@/components/portfolio/EditModeProvider";
import EditModeToolbar from "@/components/portfolio/EditModeToolbar";
import ProfileLayoutRenderer from "@/components/portfolio/ProfileLayoutRenderer";
import SectionKnownFor from "@/components/portfolio/sections/SectionKnownFor";
import type { KnownForItem } from "@/components/portfolio/sections/SectionKnownFor";
import PortfolioSectionWrapper from "@/components/portfolio/PortfolioSectionWrapper";
import type { KnownForPosition, HeroBgType } from "@/components/portfolio/PortfolioHero";
import { ArrowUp, MessageSquare, FileDown, Share2 } from "lucide-react";
import { trackInteraction } from "@/lib/trackInteraction";
import ProfileSkeleton from "@/components/portfolio/ProfileSkeleton";
import SectionClientLogos from "@/components/portfolio/sections/SectionClientLogos";
import { getProfileTypeConfig } from "@/config/profileSections";
import { getTypeAwareLabels } from "@/lib/typeAwareLabels";
import ShareButtons from "@/components/portfolio/ShareButtons";
import DarkModeToggle from "@/components/portfolio/DarkModeToggle";
import PDFExportModal from "@/components/portfolio/PDFExportModal";
import ShareModal from "@/components/portfolio/ShareModal";
import MobilePortfolioNav from "@/components/portfolio/MobilePortfolioNav";

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
  hero_bg_image_url?: string | null;
  seo_indexable?: boolean | null;
  contact_mode?: string | null;
  known_for_position?: string | null;
  auto_responder_enabled?: boolean | null;
  auto_responder_message?: string | null;
  cta_style?: string | null;
  professional_status?: string | null;
  status_badge_color?: string | null;
  status_badge_animation?: string | null;
  client_logos_position?: string | null;
  headshot_style?: string | null;
  ga_measurement_id?: string | null;
  
}

const DEFAULT_SECTION_ORDER = [
  "projects", "credits", "gallery", "awards", "press",
  "education", "skills", "services", "testimonials", "events", "contact",
];

// Client logos below hero helper
const ClientLogosBelow = ({ profileId }: { profileId: string }) => {
  const [logos, setLogos] = useState<{ company_name: string; logo_url?: string | null; website_url?: string | null }[]>([]);
  useEffect(() => {
    supabase.from("client_logos_profile").select("company_name, logo_url, website_url").eq("profile_id", profileId).order("display_order").then(({ data }) => setLogos(data || []));
  }, [profileId]);
  if (!logos.length) return null;
  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <SectionClientLogos items={logos} variant="bar" />
    </div>
  );
};

const PublicProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showPdfExport, setShowPdfExport] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
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

  // Inject custom CSS if provided and user is Pro
  useEffect(() => {
    if (profile?.custom_css && profile?.subscription_tier === "pro") {
      const styleId = `custom-portfolio-css-${profile.id}`;
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();

      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = profile.custom_css;
      document.head.appendChild(style);

      return () => {
        const el = document.getElementById(styleId);
        if (el) el.remove();
      };
    }
  }, [profile?.custom_css, profile?.subscription_tier, profile?.id]);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Inject custom CSS if provided and user is Pro (keep this as is)
  useEffect(() => {
    if (!profile) return;
    if (profile?.custom_css && profile?.subscription_tier === "pro") {
      const styleId = `custom-portfolio-css-${profile.id}`;
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();

      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = profile.custom_css;
      document.head.appendChild(style);

      return () => {
        const el = document.getElementById(styleId);
        if (el) el.remove();
      };
    }
  }, [profile?.custom_css, profile?.subscription_tier, profile?.id]);

  // Google Analytics injection (keep this as is)
  useEffect(() => {
    if (!profile?.ga_measurement_id) return;
    if (!/^G-[A-Z0-9]+$/i.test(profile.ga_measurement_id)) return;

    const gaId = profile.ga_measurement_id;
    if (!document.getElementById("ga-script")) {
      const gaScript = document.createElement("script");
      gaScript.id = "ga-script";
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(gaScript);

      const gaInit = document.createElement("script");
      gaInit.id = "ga-init";
      gaInit.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
      document.head.appendChild(gaInit);
    }

    return () => {
      const gaS = document.getElementById("ga-script");
      if (gaS) gaS.remove();
      const gaI = document.getElementById("ga-init");
      if (gaI) gaI.remove();
    };
  }, [profile?.ga_measurement_id]);

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
  const liveEditEnabled = searchParams.get("edit") === "1";
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
  const profileDesc = profile.tagline || profile.bio?.slice(0, 155) || `${profileName}'s creative portfolio`;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profileName,
    ...(profile.tagline && { description: profile.tagline }),
    ...(profile.location && { address: { "@type": "PostalAddress", addressLocality: profile.location } }),
    ...(profile.profile_photo_url && { image: profile.profile_photo_url }),
    url: profileUrl,
  };

  return (
    <>
      <Helmet>
        <title>{profileName} — Portfolio</title>
        <meta name="description" content={profileDesc} />
        <meta name="robots" content={profile.seo_indexable ? "index, follow" : "noindex, nofollow"} />
        <link rel="canonical" href={profileUrl} />
        
        {/* OpenGraph tags */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={`${profileName} — Portfolio`} />
        <meta property="og:description" content={profileDesc} />
        <meta property="og:url" content={profileUrl} />
        {profile.profile_photo_url && <meta property="og:image" content={profile.profile_photo_url} />}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content={profile.profile_photo_url ? "summary_large_image" : "summary"} />
        <meta name="twitter:title" content={`${profileName} — Portfolio`} />
        <meta name="twitter:description" content={profileDesc} />
        {profile.profile_photo_url && <meta name="twitter:image" content={profile.profile_photo_url} />}
        
        {/* JSON-LD structured data */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
    <PortfolioThemeProvider themeId={themeId} ctaStyleOverride={profile.cta_style || undefined} accentColorOverride={profile.accent_color || undefined} fontPairingOverride={profile.font_pairing || undefined} className="min-h-screen relative">
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
          heroBgImageUrl={profile.hero_bg_image_url || undefined}
          knownForPosition={(profile.known_for_position as KnownForPosition) || 'hero_above_name'}
          heroLayout={(profile.hero_style as any) || 'classic'}
          
        />

        {/* Client logos below hero */}
        {profile.client_logos_position === 'below_hero' && <ClientLogosBelow profileId={profile.id} />}

        {liveEditEnabled && <EditModeToolbar profileId={profile.id} />}

        <main
          id="portfolio-main"
          className={`max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 ${
            profile.layout_density === "compact" ? "py-6 space-y-8" :
            profile.layout_density === "dense" ? "py-16 space-y-20" :
            "py-12 space-y-14" // spacious (default)
          }`}
          role="main"
        >
          {/* Known For below hero or as body section */}
          {knownFor.length > 0 && (profile.known_for_position === 'below_hero' || profile.known_for_position === 'body_section') && (
            <PortfolioSectionWrapper title={getTypeAwareLabels(profile.profile_type).knownForTitle} index={-1}>
              <SectionKnownFor items={knownFor} variant="strip" />
            </PortfolioSectionWrapper>
          )}
          <ProfileLayoutRenderer
            allSections={allSections}
            sectionOrder={sectionOrder}
            sectionsVisible={sectionsVisible}
            profileId={profile.id}
            profileType={profile.profile_type}
            profileSlug={profile.slug || undefined}
            bio={profile.bio}
            layoutPreset={profile.layout_preset || "classic"}
          />
        </main>

        <div id="portfolio-contact">
          <PortfolioFooter
            profile={{ ...profile, auto_responder_enabled: profile.auto_responder_enabled, auto_responder_message: profile.auto_responder_message, subscription_tier: profile.subscription_tier, contact_mode: profile.contact_mode }}
            showContact={showContact}
          />
        </div>

        <MobilePortfolioNav sectionOrder={sectionOrder} sectionsVisible={sectionsVisible} />

      {/* Floating toolbar: dark mode, share, PDF, contact */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2">
        <DarkModeToggle />
        <ShareButtons url={profileUrl} title={profileName} description={profile.tagline || undefined} />
        <button
          onClick={() => setShareOpen(true)}
          className="rounded-full p-2.5 shadow-lg transition-all hover:scale-105 border"
          style={{
            background: "hsl(var(--portfolio-card, var(--card)))",
            color: "hsl(var(--portfolio-fg, var(--foreground)))",
            borderColor: "hsl(var(--portfolio-border, var(--border)))",
          }}
          aria-label="Share portfolio"
        >
          <Share2 className="h-4 w-4" />
        </button>
        {/* Share portfolio modal button */}
        <button
          onClick={() => setShareOpen(true)}
          className="rounded-full p-2.5 shadow-lg transition-all hover:scale-105 border"
          title="Share portfolio"
          style={{
            background: "hsl(var(--portfolio-card, var(--card)))",
            borderColor: "hsl(var(--portfolio-border-default, var(--border)))",
            color: "hsl(var(--portfolio-accent, var(--primary)))",
          }}
        >
          <Share2 className="w-4 h-4" />
        </button>
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

      {/* Share Modal */}
      <ShareModal
        url={window.location.href}
        name={profileName}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />
      </EditModeProvider>
    </PortfolioThemeProvider>
    </>
  );
};

export default PublicProfile;
