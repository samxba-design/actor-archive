import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { applyThemeToElement } from "@/lib/themes";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioSection from "@/components/portfolio/PortfolioSection";
import PortfolioFooter from "@/components/portfolio/PortfolioFooter";
import { Loader2 } from "lucide-react";

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

  const sectionOrder = profile.section_order || DEFAULT_SECTION_ORDER;
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
          .filter((key) => sectionsVisible[key] !== false)
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
