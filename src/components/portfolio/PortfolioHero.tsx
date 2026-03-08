import { useState, useEffect, useRef } from "react";
import { MapPin, Briefcase, Star, Calendar, Mail, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import BookingModal from "./BookingModal";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  profile: {
    id?: string;
    display_name: string | null;
    first_name: string | null;
    last_name: string | null;
    headline?: string | null;
    tagline: string | null;
    bio: string | null;
    location: string | null;
    profile_photo_url: string | null;
    banner_url: string | null;
    profile_type: string | null;
    available_for_hire: boolean | null;
    seeking_representation: boolean | null;
    cta_label: string | null;
    cta_url: string | null;
    cta_type: string | null;
    booking_url: string | null;
  };
  socialLinks?: any[];
}

const typeLabels: Record<string, string> = {
  screenwriter: "Screenwriter",
  tv_writer: "TV Writer",
  playwright: "Playwright",
  author: "Author",
  journalist: "Journalist",
  copywriter: "Copywriter",
  actor: "Actor",
  director_producer: "Director / Producer",
  corporate_video: "Corporate Video",
  multi_hyphenate: "Multi-Hyphenate",
};

const platformIcons: Record<string, string> = {
  imdb: "🎬",
  instagram: "📸",
  twitter: "𝕏",
  x: "𝕏",
  linkedin: "in",
  youtube: "▶",
  vimeo: "▷",
  tiktok: "♪",
  website: "🌐",
  spotlight: "★",
};

const PortfolioHero = ({ profile, socialLinks: socialLinksProp }: Props) => {
  const name = profile.display_name || [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Untitled";
  const [bookingOpen, setBookingOpen] = useState(false);
  const [fetchedLinks, setFetchedLinks] = useState<any[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [bioExpanded, setBioExpanded] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  const socialLinks = socialLinksProp || fetchedLinks;

  useEffect(() => {
    if (socialLinksProp || !profile.id) return;
    supabase
      .from("social_links")
      .select("*")
      .eq("profile_id", profile.id)
      .order("display_order")
      .then(({ data }) => setFetchedLinks(data || []));
  }, [profile.id, socialLinksProp]);

  useEffect(() => {
    if (!profile.banner_url) return;
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [profile.banner_url]);

  const handleCta = () => {
    const type = profile.cta_type || "contact_form";
    if (type === "contact_form") {
      document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
    } else if (type === "calendar" && (profile.booking_url || profile.cta_url)) {
      const url = profile.booking_url || profile.cta_url!;
      if (url.includes("calendly.com") || url.includes("cal.com")) {
        setBookingOpen(true);
      } else {
        window.open(url, "_blank");
      }
    } else if (type === "email" && profile.cta_url) {
      window.location.href = profile.cta_url.startsWith("mailto:") ? profile.cta_url : `mailto:${profile.cta_url}`;
    } else if (type === "custom_url" && profile.cta_url) {
      window.open(profile.cta_url, "_blank");
    }
  };

  const ctaLabel = profile.cta_label || (profile.available_for_hire ? "Hire Me" : "Get in Touch");
  const showCta = profile.available_for_hire || profile.cta_label;

  const ctaIcon = () => {
    const type = profile.cta_type || "contact_form";
    if (type === "calendar") return <Calendar className="w-4 h-4" />;
    if (type === "email") return <Mail className="w-4 h-4" />;
    return <ArrowRight className="w-4 h-4" />;
  };

  const bioTruncateLen = 200;
  const bioText = profile.bio || "";
  const bioIsTruncatable = bioText.length > bioTruncateLen;
  const displayBio = bioIsTruncatable && !bioExpanded ? `${bioText.slice(0, bioTruncateLen)}...` : bioText;

  return (
    <header className="relative">
      {profile.banner_url ? (
        <div ref={bannerRef} className="h-56 sm:h-72 md:h-80 w-full overflow-hidden relative">
          <img
            src={profile.banner_url}
            alt=""
            className="w-full h-full object-cover"
            style={{ transform: `translateY(${scrollY * 0.25}px)`, transition: "transform 0.05s linear" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, hsl(var(--portfolio-bg)) 100%)" }} />
        </div>
      ) : (
        <div className="h-32 sm:h-40 w-full" style={{ backgroundColor: "hsl(var(--portfolio-muted))" }} />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {profile.profile_photo_url ? (
            <img
              src={profile.profile_photo_url}
              alt={name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 shadow-lg"
              style={{ borderColor: "hsl(var(--portfolio-bg))", animation: "word-reveal 0.6s ease-out both" }}
            />
          ) : (
            <div
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg border-4"
              style={{
                backgroundColor: "hsl(var(--portfolio-accent))",
                color: "hsl(var(--portfolio-accent-fg))",
                borderColor: "hsl(var(--portfolio-bg))",
              }}
            >
              {name.charAt(0)}
            </div>
          )}

          <div className="flex-1 pt-2 sm:pt-6 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h1
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                style={{
                  fontFamily: "var(--portfolio-heading-font)",
                  animation: "word-reveal 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both",
                }}
              >
                {name}
              </h1>
              {showCta && (
                <button
                  onClick={handleCta}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-[1.03] hover:shadow-lg shrink-0"
                  style={{
                    backgroundColor: "hsl(var(--portfolio-accent))",
                    color: "hsl(var(--portfolio-accent-fg))",
                    boxShadow: "0 4px 14px -4px hsl(var(--portfolio-accent) / 0.4)",
                  }}
                >
                  {ctaIcon()}
                  {ctaLabel}
                </button>
              )}
            </div>

            {/* Headline — prominent pitch line */}
            {profile.headline && (
              <p
                className="text-lg font-semibold"
                style={{ color: "hsl(var(--portfolio-fg))", animation: "word-reveal 0.6s ease-out 0.15s both" }}
              >
                {profile.headline}
              </p>
            )}

            {profile.tagline && (
              <p className="text-base" style={{ color: "hsl(var(--portfolio-muted-fg))", animation: "word-reveal 0.6s ease-out 0.2s both" }}>
                {profile.tagline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
              {profile.profile_type && (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  {typeLabels[profile.profile_type] || profile.profile_type}
                </span>
              )}
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.location}
                </span>
              )}
              {profile.available_for_hire && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: "hsl(var(--portfolio-accent) / 0.15)", color: "hsl(var(--portfolio-accent))" }}
                >
                  <Star className="w-3 h-3" /> Available
                </span>
              )}
              {profile.seeking_representation && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: "hsl(var(--portfolio-accent) / 0.10)", color: "hsl(var(--portfolio-accent))" }}
                >
                  Seeking Representation
                </span>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {socialLinks.map((link) => {
                  const icon = platformIcons[link.platform?.toLowerCase()] || "🔗";
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:scale-105"
                      style={{
                        backgroundColor: "hsl(var(--portfolio-muted))",
                        color: "hsl(var(--portfolio-muted-fg))",
                        border: "1px solid hsl(var(--portfolio-border))",
                      }}
                    >
                      <span>{icon}</span>
                      {link.label || link.platform}
                    </a>
                  );
                })}
              </div>
            )}

            {bioText && (
              <div className="mt-4 max-w-2xl">
                <p
                  className="leading-relaxed whitespace-pre-line"
                  style={{ color: "hsl(var(--portfolio-fg) / 0.85)" }}
                >
                  {displayBio}
                </p>
                {bioIsTruncatable && (
                  <button
                    onClick={() => setBioExpanded(!bioExpanded)}
                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: "hsl(var(--portfolio-accent))" }}
                  >
                    {bioExpanded ? (
                      <>Read less <ChevronUp className="w-3.5 h-3.5" /></>
                    ) : (
                      <>Read more <ChevronDown className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {(profile.booking_url || profile.cta_url) && (
        <BookingModal
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          bookingUrl={profile.booking_url || profile.cta_url || ""}
          name={name}
        />
      )}
    </header>
  );
};

export default PortfolioHero;
