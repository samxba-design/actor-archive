import { useState, useEffect, useRef } from "react";
import { MapPin, ArrowRight, ChevronDown, ChevronUp, Building2 } from "lucide-react";
import BookingModal from "./BookingModal";
import PortfolioCTA from "./PortfolioCTA";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { renderSimpleMarkdown } from "@/lib/simpleMarkdown";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CompanyLogo from "@/components/CompanyLogo";

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
    professional_status?: string | null;
    cta_label: string | null;
    cta_url: string | null;
    cta_type: string | null;
    booking_url: string | null;
  };
  socialLinks?: any[];
  representation?: any[];
  featuredProject?: any;
  stats?: { scripts: number; developing: number; awards: number };
  knownFor?: any[];
}

const platformIcons: Record<string, string> = {
  imdb: "🎬", instagram: "📸", twitter: "𝕏", x: "𝕏",
  linkedin: "in", youtube: "▶", vimeo: "▷", tiktok: "♪",
  website: "🌐", spotlight: "★",
};

const PortfolioHero = ({ profile, socialLinks: socialLinksProp, representation, featuredProject, stats, knownFor }: Props) => {
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
  const bioTruncLen = 220;
  const bioIsTruncatable = bioText.length > bioTruncLen;
  const displayBio = bioIsTruncatable && !bioExpanded ? `${bioText.slice(0, bioTruncLen)}...` : bioText;

  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const stagger = (i: number) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(12px)',
    transition: `opacity 0.7s ease-out ${i * 0.12}s, transform 0.7s ease-out ${i * 0.12}s`,
  });

  const primaryRep = representation?.find(r => r.is_primary) || representation?.[0];
  const hasMultipleReps = representation && representation.length > 1;

  // Hero text colors — always light on hero images
  const heroText = profile.banner_url ? '#F5F0EB' : theme.textPrimary;
  const heroTextMuted = profile.banner_url ? 'rgba(245,240,235,0.65)' : theme.textSecondary;
  const heroTextFaint = profile.banner_url ? 'rgba(245,240,235,0.4)' : theme.textTertiary;

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
                transform: theme.enableParallax ? `translateY(${scrollY * theme.parallaxIntensity}px) scale(1.05)` : 'scale(1.05)',
                opacity: loaded ? 1 : 0.6,
                transition: 'opacity 1s ease-out',
              }}
            />
          </div>
          <div className="absolute inset-0" style={{ background: theme.heroOverlayGradient, mixBlendMode: theme.heroOverlayBlend as any }} />
          {/* Extra bottom fade for content legibility */}
          <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: `linear-gradient(to top, ${theme.bgPrimary} 0%, transparent 100%)` }} />
        </>
      ) : (
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 20%, ${theme.accentGlow} 0%, transparent 60%), linear-gradient(135deg, ${theme.bgHero} 0%, ${theme.bgPrimary} 100%)` }} />
      )}

      {/* Hero content */}
      <div className="relative z-10 flex flex-col justify-end h-full" style={{ minHeight: theme.heroHeight }}>
        <div className="max-w-[1080px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
          {/* Known For — prominent carousel above identity */}
          {knownFor && knownFor.length > 0 && (
            <div className="mb-6" style={stagger(0)}>
              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
                {knownFor.slice(0, 6).map((item: any) => {
                  const card = (
                    <div
                      key={item.id}
                      className="group/kf shrink-0 overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-1"
                      style={{
                        width: '70px',
                        borderRadius: '6px',
                        border: `1px solid rgba(255,255,255,0.12)`,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                      }}
                    >
                      <div className="aspect-[2/3] overflow-hidden relative">
                        {item.poster_url ? (
                          <img src={item.poster_url} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: theme.bgElevated }}>
                            <span className="text-xs" style={{ color: theme.textTertiary }}>🎬</span>
                          </div>
                        )}
                      </div>
                      <div className="px-1.5 py-1" style={{ backgroundColor: theme.bgSecondary }}>
                        <p className="text-[8px] font-semibold leading-tight truncate" style={{ color: heroText, fontFamily: theme.fontDisplay }}>{item.title}</p>
                        {item.role_name && <p className="text-[7px] uppercase tracking-wider truncate" style={{ color: theme.accentPrimary }}>{item.role_name}</p>}
                      </div>
                    </div>
                  );
                  return item.imdb_link ? (
                    <a key={item.id} href={item.imdb_link} target="_blank" rel="noopener noreferrer" className="no-underline shrink-0">{card}</a>
                  ) : <div key={item.id} className="shrink-0">{card}</div>;
                })}
              </div>
            </div>
          )}

          {/* Two-column: left identity, right featured project */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-end">
            {/* LEFT: Identity */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Photo + name + rep inline */}
              <div className="flex items-end gap-4" style={stagger(1)}>
                {profile.profile_photo_url ? (
                  <img
                    src={profile.profile_photo_url}
                    alt={name}
                    className="rounded-full object-cover shrink-0"
                    style={{
                      width: theme.profilePhotoSize,
                      height: theme.profilePhotoSize,
                      border: theme.profilePhotoBorder,
                      boxShadow: theme.profilePhotoShadow,
                    }}
                  />
                ) : (
                  <div
                    className="rounded-full flex items-center justify-center shrink-0 text-xl font-bold"
                    style={{
                      width: theme.profilePhotoSize,
                      height: theme.profilePhotoSize,
                      backgroundColor: theme.accentSubtle,
                      color: theme.accentPrimary,
                      border: theme.profilePhotoBorder,
                    }}
                  >
                    {initials}
                  </div>
                )}

                <div className="min-w-0 pb-1">
                  <h1
                    className="tracking-tight leading-[1.1]"
                    style={{
                      fontFamily: theme.fontDisplay,
                      fontWeight: theme.nameWeight,
                      fontSize: 'clamp(28px, 4.5vw, 44px)',
                      color: heroText,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {name}
                  </h1>

                  {/* Representation — compact inline with popover */}
                  {primaryRep && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[12px] tracking-wide" style={{ color: heroTextMuted }}>
                        Repped by
                      </span>
                      {hasMultipleReps ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="inline-flex items-center gap-1 text-[12px] font-medium tracking-wide transition-colors hover:opacity-80" style={{ color: theme.accentPrimary }}>
                              {representation!.map(r => r.company?.split('(')[0]?.trim() || r.name).join(' · ')}
                              <ChevronDown className="w-3 h-3 opacity-60" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-72 p-0"
                            style={{
                              backgroundColor: theme.bgElevated,
                              border: `1px solid ${theme.borderDefault}`,
                              borderRadius: theme.cardRadius,
                            }}
                          >
                            <div className="p-3 space-y-2.5">
                              {representation!.map(rep => (
                                <div key={rep.id} className="flex items-center gap-2.5">
                                  <CompanyLogo companyName={rep.company || rep.name || ''} size={24} grayscale={false} />
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium" style={{ color: theme.textPrimary }}>{rep.company || rep.name}</p>
                                    <p className="text-[10px]" style={{ color: theme.textSecondary }}>
                                      {rep.name && rep.company ? `${rep.name} · ` : ''}{rep.department || rep.rep_type}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span className="text-[12px] font-medium tracking-wide" style={{ color: theme.accentPrimary }}>
                          {primaryRep.company?.split('(')[0]?.trim() || primaryRep.name}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tagline */}
              {profile.tagline && (
                <p
                  className="text-[15px] sm:text-base"
                  style={{ ...stagger(1), fontFamily: theme.fontBody, color: heroTextMuted, letterSpacing: '0.01em' }}
                >
                  {profile.tagline}
                </p>
              )}

              {/* Credential signals + social row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5" style={stagger(2)}>
                {profile.location && (
                  <span className="inline-flex items-center gap-1 text-[12px] uppercase tracking-widest" style={{ color: heroTextFaint }}>
                    <MapPin className="w-3 h-3" />
                    {profile.location}
                  </span>
                )}
                {profile.professional_status && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest" style={{ color: theme.statusAvailable }}>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-30" style={{ backgroundColor: theme.statusAvailable }} />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: theme.statusAvailable }} />
                    </span>
                    {profile.professional_status}
                  </span>
                )}
                {/* Social links inline */}
                {socialLinks.length > 0 && (
                  <>
                    <span className="w-px h-3" style={{ backgroundColor: heroTextFaint }} />
                    {socialLinks.map(link => {
                      const icon = platformIcons[link.platform?.toLowerCase()] || "🔗";
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm transition-colors duration-200"
                          style={{ color: heroTextFaint }}
                          onMouseEnter={e => (e.currentTarget.style.color = theme.accentPrimary)}
                          onMouseLeave={e => (e.currentTarget.style.color = heroTextFaint)}
                          title={link.label || link.platform}
                        >
                          {icon}
                        </a>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Bio — compact */}
              {bioText && (
                <div style={stagger(3)} className="max-w-lg">
                  <div
                    className="text-[14px] leading-[1.65] overflow-hidden transition-all duration-500"
                    style={{
                      color: heroTextMuted,
                      fontFamily: theme.fontBody,
                      maxHeight: bioIsTruncatable && !bioExpanded ? '3.5em' : '100em',
                    }}
                    dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(displayBio) }}
                  />
                  {bioIsTruncatable && (
                    <button
                      onClick={() => setBioExpanded(!bioExpanded)}
                      className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-medium transition-colors"
                      style={{ color: theme.accentPrimary }}
                    >
                      {bioExpanded ? <>Less <ChevronUp className="w-3 h-3" /></> : <>More <ChevronDown className="w-3 h-3" /></>}
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

            {/* RIGHT: Featured project card — horizontal poster + info */}
            {featuredProject && (
              <div className="w-full lg:w-[380px] shrink-0" style={stagger(3)}>
                <div
                  className="overflow-hidden transition-all duration-300 flex group/feat"
                  style={{
                    backgroundColor: theme.bgSecondary,
                    border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
                    borderRadius: theme.cardRadius,
                    boxShadow: theme.cardShadow,
                  }}
                >
                  {/* Poster (2:3) on left */}
                  {(featuredProject.poster_url || featuredProject.backdrop_url || featuredProject.custom_image_url) && (
                    featuredProject.imdb_link ? (
                      <a href={featuredProject.imdb_link} target="_blank" rel="noopener noreferrer" className="w-[110px] shrink-0 overflow-hidden block">
                        <img
                          src={featuredProject.poster_url || featuredProject.custom_image_url || featuredProject.backdrop_url}
                          alt={featuredProject.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/feat:scale-105"
                          style={{ minHeight: '165px' }}
                        />
                      </a>
                    ) : (
                      <div className="w-[110px] shrink-0 overflow-hidden">
                        <img
                          src={featuredProject.poster_url || featuredProject.custom_image_url || featuredProject.backdrop_url}
                          alt={featuredProject.title}
                          className="w-full h-full object-cover"
                          style={{ minHeight: '165px' }}
                        />
                      </div>
                    )
                  )}

                  {/* Info on right — solid bg, always readable */}
                  <div className="flex-1 p-4 space-y-2 min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: theme.accentPrimary }}>
                      Featured Project
                    </p>
                    <h3
                      className="text-[15px] font-semibold leading-tight"
                      style={{ fontFamily: theme.fontDisplay, fontWeight: theme.headingWeight, color: theme.textPrimary }}
                    >
                      {featuredProject.title}
                    </h3>
                    {featuredProject.genre?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {featuredProject.genre.slice(0, 3).map((g: string) => (
                          <span
                            key={g}
                            className="text-[9px] uppercase tracking-wide px-1.5 py-0.5"
                            style={{
                              backgroundColor: theme.accentSubtle,
                              color: theme.textSecondary,
                              borderRadius: '3px',
                            }}
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
                    {featuredProject.logline && (
                      <p
                        className="text-[12px] leading-relaxed line-clamp-3"
                        style={{
                          fontFamily: theme.fontBody,
                          fontStyle: 'normal',
                          color: theme.textSecondary,
                        }}
                      >
                        "{featuredProject.logline}"
                      </p>
                    )}
                    {featuredProject.imdb_link ? (
                      <a href={featuredProject.imdb_link} target="_blank" rel="noopener noreferrer">
                        <PortfolioCTA label="View on IMDb" />
                      </a>
                    ) : featuredProject.script_pdf_url ? (
                      <PortfolioCTA label="Read Script" href={featuredProject.script_pdf_url} />
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats bar */}
          {stats && (stats.scripts > 0 || stats.developing > 0 || stats.awards > 0) && (
            <div
              className="flex items-center gap-8 sm:gap-10 mt-6 pt-5"
              style={{ borderTop: `1px solid rgba(255,255,255,0.06)`, ...stagger(6) }}
            >
              {[
                { n: stats.scripts, label: 'Scripts Available' },
                { n: stats.developing, label: 'In Development' },
                { n: stats.awards, label: 'Awards' },
              ].filter(s => s.n > 0).map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-bold tabular-nums" style={{ fontFamily: theme.fontDisplay, color: theme.accentPrimary }}>{s.n}</p>
                  <p className="text-[10px] uppercase tracking-[0.1em] mt-0.5" style={{ color: heroTextMuted }}>{s.label}</p>
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
