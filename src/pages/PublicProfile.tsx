import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { applyThemeToElement, getTheme } from "@/lib/themes";
import { getFontPairing, getFontGoogleUrl } from "@/lib/fontPairings";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioSection from "@/components/portfolio/PortfolioSection";
import PortfolioFooter from "@/components/portfolio/PortfolioFooter";
import { Loader2 } from "lucide-react";
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
}

const DEFAULT_SECTION_ORDER = [
  "projects",
  "credits",
  "gallery",
  "awards",
  "press",
  "education",
  "skills",
  "services",
  "testimonials",
  "events",
  "contact",
];

/** Extract unique Google Fonts from a theme definition's font variables */
function getGoogleFontFamilies(themeKey: string): string[] {
  const theme = getTheme(themeKey);
  const fontVars = [theme.variables["--portfolio-heading-font"], theme.variables["--portfolio-body-font"]];
  const families = new Set<string>();
  for (const v of fontVars) {
    if (!v) continue;
    // Extract first font name from "'Font Name', fallback"
    const match = v.match(/'([^']+)'/);
    if (match) {
      const name = match[1];
      // Skip system fonts
      if (!["Inter", "Courier New"].includes(name)) {
        families.add(name);
      }
    }
  }
  return Array.from(families);
}

const PublicProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Fetch profile by slug
  useEffect(() => {
    if (!slug) return;
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setProfile(data as unknown as ProfileData);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [slug]);

  // Apply theme + font pairing + layout density
  useEffect(() => {
    if (profile && containerRef.current) {
      applyThemeToElement(
        containerRef.current,
        profile.theme || "minimal",
        profile.accent_color || undefined
      );

      // Font pairing override
      const pairing = getFontPairing(profile.font_pairing || "default");
      if (pairing.headingFont) {
        containerRef.current.style.setProperty("--portfolio-heading-font", pairing.headingFont);
      }
      if (pairing.bodyFont) {
        containerRef.current.style.setProperty("--portfolio-body-font", pairing.bodyFont);
      }

      // Layout density
      const density = profile.layout_density || "spacious";
      const spacingMap: Record<string, string> = { compact: "0.6", default: "1", spacious: "1.4" };
      containerRef.current.style.setProperty("--portfolio-spacing", spacingMap[density] || "1");
    }
  }, [profile]);

  // Load Google Fonts for the theme
  useEffect(() => {
    if (!profile) return;
    const families = getGoogleFontFamilies(profile.theme || "minimal");
    if (families.length === 0) return;

    const id = "portfolio-google-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f.replace(/ /g, "+")}:wght@400;500;600;700`).join("&")}&display=swap`;
    document.head.appendChild(link);

    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [profile?.theme]);

  // Load Google Fonts for custom font pairing
  useEffect(() => {
    if (!profile) return;
    const pairing = getFontPairing(profile.font_pairing || "default");
    const fontUrl = getFontGoogleUrl(pairing);
    if (!fontUrl) return;

    const id = "portfolio-font-pairing";
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = fontUrl;
    document.head.appendChild(link);

    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [profile?.font_pairing]);

  // Log page view
  useEffect(() => {
    if (profile?.id) {
      supabase.from("page_views").insert({
        profile_id: profile.id,
        path: `/${slug}`,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        device_type: window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop",
      });
    }
  }, [profile?.id, slug]);

  // SEO: Set document title and meta tags
  useEffect(() => {
    if (!profile) return;
    const name = profile.display_name || [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Portfolio";
    const desc = profile.tagline || profile.bio?.slice(0, 155) || `${name}'s creative portfolio`;
    document.title = `${name} — Portfolio`;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", desc);

    const ogTags: Record<string, string> = {
      "og:title": `${name} — Portfolio`,
      "og:description": desc,
      "og:type": "profile",
      "og:url": window.location.href,
    };
    if (profile.profile_photo_url) ogTags["og:image"] = profile.profile_photo_url;
    
    Object.entries(ogTags).forEach(([prop, content]) => {
      let tag = document.querySelector(`meta[property="${prop}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", prop);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      name,
      ...(profile.tagline && { description: profile.tagline }),
      ...(profile.location && { address: { "@type": "PostalAddress", addressLocality: profile.location } }),
      ...(profile.profile_photo_url && { image: profile.profile_photo_url }),
      url: window.location.href,
    };
    let script = document.getElementById("portfolio-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "portfolio-jsonld";
      script.setAttribute("type", "application/ld+json");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);

    return () => {
      document.title = "CreativeSlate";
      const el = document.getElementById("portfolio-jsonld");
      if (el) el.remove();
    };
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-muted-foreground">This portfolio doesn't exist or isn't published yet.</p>
      </div>
    );
  }

  // Build section order: use profile's custom order, or derive from profile type config
  let sectionOrder = profile.section_order;
  if (!sectionOrder || sectionOrder.length === 0) {
    const typeConfig = profile.profile_type ? getProfileTypeConfig(profile.profile_type) : null;
    if (typeConfig && typeConfig.sections.length > 0) {
      sectionOrder = typeConfig.sections.map((s) => s.key).filter((k) => k !== "hero");
    } else {
      sectionOrder = DEFAULT_SECTION_ORDER;
    }
  }

  const sectionsVisible = (profile.sections_visible || {}) as Record<string, boolean>;

  return (
    <div
      ref={containerRef}
      className="min-h-screen portfolio-container"
      style={{
        backgroundColor: "hsl(var(--portfolio-bg))",
        color: "hsl(var(--portfolio-fg))",
        fontFamily: "var(--portfolio-body-font)",
      }}
    >
      {/* Inject custom CSS */}
      {profile.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: profile.custom_css }} />
      )}

      <PortfolioHero profile={profile} />

      <main
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          paddingTop: `calc(3rem * var(--portfolio-spacing, 1))`,
          paddingBottom: `calc(3rem * var(--portfolio-spacing, 1))`,
          gap: `calc(4rem * var(--portfolio-spacing, 1))`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {sectionOrder
          .filter((key) => sectionsVisible[key] !== false && key !== "hero" && key !== "contact")
          .map((sectionKey) => (
            <PortfolioSection
              key={sectionKey}
              sectionKey={sectionKey}
              profileId={profile.id}
              profileType={profile.profile_type}
              profileSlug={profile.slug || undefined}
            />
          ))}
      </main>

      <PortfolioFooter
        profile={{
          ...profile,
          auto_responder_enabled: (profile as any).auto_responder_enabled,
          auto_responder_message: (profile as any).auto_responder_message,
        }}
        showContact={profile.show_contact_form !== false}
      />
    </div>
  );
};

export default PublicProfile;
