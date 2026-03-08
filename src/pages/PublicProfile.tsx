import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { applyThemeToElement, getTheme } from "@/lib/themes";
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

  // Apply theme
  useEffect(() => {
    if (profile && containerRef.current) {
      applyThemeToElement(
        containerRef.current,
        profile.theme || "minimal",
        profile.accent_color || undefined
      );
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
      className="min-h-screen"
      style={{
        backgroundColor: "hsl(var(--portfolio-bg))",
        color: "hsl(var(--portfolio-fg))",
        fontFamily: "var(--portfolio-body-font)",
      }}
    >
      <PortfolioHero profile={profile} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {sectionOrder
          .filter((key) => sectionsVisible[key] !== false && key !== "hero" && key !== "contact")
          .map((sectionKey) => (
            <PortfolioSection
              key={sectionKey}
              sectionKey={sectionKey}
              profileId={profile.id}
              profileType={profile.profile_type}
            />
          ))}
      </main>

      <PortfolioFooter
        profile={profile}
        showContact={profile.show_contact_form !== false}
      />
    </div>
  );
};

export default PublicProfile;
