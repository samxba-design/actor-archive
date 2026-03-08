import { useState, useEffect, useRef } from "react";
import { MapPin, ArrowRight, Calendar, Mail, ChevronDown, ChevronUp } from "lucide-react";
import BookingModal from "./BookingModal";
import PortfolioCTA from "./PortfolioCTA";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { renderSimpleMarkdown } from "@/lib/simpleMarkdown";

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
  representation?: any[];
  featuredProject?: any;
  stats?: { scripts: number; developing: number; awards: number };
}

const platformIcons: Record<string, string> = {
  imdb: "🎬", instagram: "📸", twitter: "𝕏", x: "𝕏",
  linkedin: "in", youtube: "▶", vimeo: "▷", tiktok: "♪",
  website: "🌐", spotlight: "★",
};

const PortfolioHero = ({ profile, socialLinks: socialLinksProp, representation, featuredProject, stats }: Props) => {
  const theme = usePortfolioTheme();
  const name = profile.display_name || [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Untitled";
  const [bookingOpen, setBookingOpen] = useState(false);
  const [fetchedLinks, setFetchedLinks] = useState<any[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const socialLinks = socialLinksProp || fetchedLinks;

  useEffect(() => { setLoaded(true); }, []);

  useEffect(() => {
    if (socialLinksProp || !profile.id) return;
    supabase.from("social_links").select("*").eq("profile_id", profile.id).order("display_order")
      .then(({ data }) => setFetchedLinks(data || []));
  }, [profile.id, socialLinksProp]);

  useEffect(() => {
    if (!theme.enableParallax || !profile.banner_url) return;
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [theme.enableParallax, profile.banner_url]);

  const handleCta = () => {
    const type = profile.cta_type || "contact_form";
    if (type === "contact_form") {
      document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
    } else if (type === "calendar" && (profile.booking_url || profile.cta_url)) {
      setBookingOpen(true);
    } else if (type === "email" && profile.cta_url) {
      window.location.href = profile.cta_url.startsWith("mailto:") ? profile.cta_url : `mailto:${profile.cta_url}`;
    } else if (type === "custom_url" && profile.cta_url) {
      window.open(profile.cta_url, "_blank");
    }
  };

  const ctaLabel = profile.cta_label || (profile.available_for_hire ? "Hire Me" : "Get in Touch");
  const showCta = profile.available_for_hire || profile.cta_label;

  const bioText = profile.bio || "";
  const bioTruncLen = 250;
  const bioIsTruncatable = bioText.length > bioTruncLen;
  const displayBio = bioIsTruncatable && !bioExpanded ? `${bioText.slice(0, bioTruncLen)}...` : bioText;

  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  // Stagger delays
  const stagger = (i: number) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(15px)',
    transition: `opacity 0.7s ease-out ${i * 0.15}s, transform 0.7s ease-out ${i * 0.15}s`,
  });

  // Primary rep
  const primaryRep = representation?.find(r => r.is_primary) || representation?.[0];

  return (
    <header className="relative overflow-hidden" style={{ minHeight: theme.heroHeight }}>
      {/* Background image + overlay */}
      {profile.banner_url ? (
        <>
          <div className="absolute inset-0">
            <img
              src={profile.banner_url}
              alt=""
              className="w-full h-full object-cover"
              style={{
                transform: theme.enableParallax ? `translateY(${scrollY * theme.parallaxIntensity}px)` : undefined,
                opacity: loaded ? 1 : 0.7,
                transition: 'opacity 0.8s ease-out',
              }}
            />
          </div>
          <div className="absolute inset-0" style={{ background: theme.heroOverlayGradient, mixBlendMode: theme.heroOverlayBlend as any }} />
        </>
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${theme.bgHero} 0%, ${theme.bgSecondary} 100%)` }} />
      )}

      {/* Hero content — positioned in bottom portion */}
      <div className="relative z-10 flex flex-col justify-end h-full" style={{ minHeight: theme.heroHeight }}>
        <div className="max-w-[1080px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
          {/* Two-column: left identity, right featured project */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-end">
            {/* LEFT: Identity */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* Representation line */}
              {primaryRep && (
                <div style={stagger(0)}>
                  <span
                    className="text-[11px] font-medium uppercase tracking-widest"
                    style={{ color: theme.textTertiary }}
                  >
                    Repped by {primaryRep.company}
                    {primaryRep.name && ` · ${primaryRep.name}`}
                  </span>
                </div>
              )}

              {/* Photo + name row */}
              <div className="flex items-center gap-5" style={stagger(1)}>
                {profile.profile_photo_url ? (
                  <img
                    src={profile.profile_photo_url}
                    alt={name}
                    className="rounded-full object-cover shrink-0 transition-transform duration-300 hover:scale-[1.03]"
                    style={{
                      width: theme.profilePhotoSize,
                      height: theme.profilePhotoSize,
                      border: theme.profilePhotoBorder,
                      boxShadow: theme.profilePhotoShadow,
                    }}
                  />
                ) : (
                  <div
                    className="rounded-full flex items-center justify-center shrink-0 text-2xl font-bold"
                    style={{
                      width: theme.profilePhotoSize,
                      height: theme.profilePhotoSize,
                      backgroundColor: theme.accentPrimary,
                      color: theme.textOnAccent,
                      border: theme.profilePhotoBorder,
                    }}
                  >
                    {initials}
                  </div>
                )}

                <div className="min-w-0">
                  <h1
                    className="tracking-tight leading-tight"
                    style={{
                      fontFamily: theme.fontDisplay,
                      fontWeight: theme.nameWeight,
                      fontSize: 'clamp(32px, 5vw, 48px)',
                      color: profile.banner_url ? '#F5F0EB' : theme.textPrimary,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {name}
                  </h1>
                  {/* Tagline */}
                  {profile.tagline && (
                    <p
                      className="text-base sm:text-lg mt-1"
                      style={{
                        fontFamily: theme.fontBody,
                        color: profile.banner_url ? 'rgba(245,240,235,0.7)' : theme.textSecondary,
                        letterSpacing: '0.01em',
                      }}
                    >
                      {profile.tagline}
                    </p>
                  )}
                </div>
              </div>

              {/* Credential signals */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5" style={stagger(2)}>
                {profile.location && (
                  <span className="inline-flex items-center gap-1 text-[13px] uppercase tracking-widest" style={{ color: profile.banner_url ? 'rgba(245,240,235,0.5)' : theme.textSecondary }}>
                    <MapPin className="w-3 h-3" />
                    {profile.location}
                  </span>
                )}
                {profile.available_for_hire && (
                  <span className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-widest" style={{ color: theme.statusAvailable }}>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-30" style={{ backgroundColor: theme.statusAvailable }} />
                      <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: theme.statusAvailable }} />
                    </span>
                    Available
                  </span>
                )}
              </div>

              {/* Social links — icon only */}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-3" style={stagger(3)}>
                  {socialLinks.map(link => {
                    const icon = platformIcons[link.platform?.toLowerCase()] || "🔗";
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base transition-colors duration-200"
                        style={{ color: profile.banner_url ? 'rgba(245,240,235,0.4)' : theme.textTertiary }}
                        onMouseEnter={e => (e.currentTarget.style.color = theme.accentPrimary)}
                        onMouseLeave={e => (e.currentTarget.style.color = profile.banner_url ? 'rgba(245,240,235,0.4)' : theme.textTertiary)}
                        title={link.label || link.platform}
                      >
                        {icon}
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Bio — compact */}
              {bioText && (
                <div style={stagger(3)} className="max-w-xl">
                  <div
                    className="text-[15px] leading-[1.7] overflow-hidden transition-all duration-400"
                    style={{
                      color: profile.banner_url ? 'rgba(245,240,235,0.75)' : theme.textPrimary,
                      fontFamily: theme.fontBody,
                      maxHeight: bioIsTruncatable && !bioExpanded ? '4.5em' : '100em',
                    }}
                    dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(displayBio) }}
                  />
                  {bioIsTruncatable && (
                    <button
                      onClick={() => setBioExpanded(!bioExpanded)}
                      className="mt-1 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                      style={{ color: theme.accentPrimary }}
                    >
                      {bioExpanded ? <>Read less <ChevronUp className="w-3.5 h-3.5" /></> : <>Read more <ChevronDown className="w-3.5 h-3.5" /></>}
                    </button>
                  )}
                </div>
              )}

              {/* CTA */}
              {showCta && (
                <div style={stagger(4)}>
                  <PortfolioCTA label={ctaLabel} onClick={handleCta} />
                </div>
              )}
            </div>

            {/* RIGHT: Featured project card */}
            {featuredProject && (
              <div
                className="w-full lg:w-[380px] shrink-0"
                style={stagger(3)}
              >
                <div
                  className="overflow-hidden transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
                    backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
                    WebkitBackdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
                    border: theme.glassEnabled ? theme.glassBorder : `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
                    borderRadius: theme.cardRadius,
                    boxShadow: theme.cardShadow,
                  }}
                >
                  {/* Project image */}
                  {(featuredProject.poster_url || featuredProject.backdrop_url || featuredProject.custom_image_url) && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={featuredProject.backdrop_url || featuredProject.poster_url || featuredProject.custom_image_url}
                        alt={featuredProject.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5 space-y-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.accentPrimary }}>
                      Featured Project
                    </p>
                    <h3
                      className="text-lg font-semibold leading-tight"
                      style={{ fontFamily: theme.fontDisplay, fontWeight: theme.headingWeight, color: profile.banner_url ? '#F5F0EB' : theme.textPrimary }}
                    >
                      {featuredProject.title}
                    </h3>
                    {featuredProject.genre && featuredProject.genre.length > 0 && (
                      <div className="flex gap-1.5">
                        {featuredProject.genre.slice(0, 3).map((g: string) => (
                          <span
                            key={g}
                            className="text-[10px] uppercase tracking-wide px-2 py-0.5"
                            style={{
                              backgroundColor: theme.bgElevated,
                              border: `1px solid ${theme.borderDefault}`,
                              color: theme.textSecondary,
                              borderRadius: '4px',
                            }}
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
                    {featuredProject.logline && (
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          fontFamily: theme.fontLogline,
                          fontStyle: theme.loglineStyle,
                          color: profile.banner_url ? 'rgba(245,240,235,0.8)' : theme.textPrimary,
                        }}
                      >
                        \u201C{featuredProject.logline}\u201D
                      </p>
                    )}
                    <PortfolioCTA label="Read Script" href={featuredProject.script_pdf_url || "#"} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats bar */}
          {stats && (stats.scripts > 0 || stats.developing > 0 || stats.awards > 0) && (
            <div
              className="flex items-center gap-6 sm:gap-10 mt-8 pt-6"
              style={{ borderTop: `1px solid ${theme.borderDefault}`, ...stagger(5) }}
            >
              {[
                { n: stats.scripts, label: 'Scripts Available' },
                { n: stats.developing, label: 'In Development' },
                { n: stats.awards, label: 'Awards' },
              ].filter(s => s.n > 0).map(s => (
                <div key={s.label} className="text-center sm:text-left">
                  <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: theme.fontDisplay, color: theme.accentPrimary }}>{s.n}</p>
                  <p className="text-[11px] uppercase tracking-widest mt-0.5" style={{ color: profile.banner_url ? 'rgba(245,240,235,0.5)' : theme.textSecondary }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          )}
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
