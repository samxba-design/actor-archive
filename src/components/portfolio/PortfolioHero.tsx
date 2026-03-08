import { useState, useEffect, useMemo } from "react";
import { MapPin, ExternalLink, ChevronDown, ChevronUp, Quote, Play } from "lucide-react";
import { extractYouTubeId, extractVimeoId, isYouTube, isVimeo } from "@/lib/videoEmbed";
import BookingModal from "./BookingModal";
import PortfolioCTA from "./PortfolioCTA";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { renderSimpleMarkdown } from "@/lib/simpleMarkdown";
import { getContrastTextColors, isLightColor } from "@/lib/contrastColor";
import { BokehField } from "@/components/CinematicBackground";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CompanyLogo from "@/components/CompanyLogo";
import { PosterCard } from "./sections/SectionKnownFor";

const PRESET_GRADIENTS: Record<string, string> = {
  "cinematic-dark": "linear-gradient(135deg, #1a0a0f 0%, #2d1520 40%, #0d0d1a 100%)",
  "noir-smoke": "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
  "golden-hour": "linear-gradient(135deg, #2d1b00 0%, #4a2c17 40%, #1a0e05 100%)",
  "ocean-deep": "linear-gradient(135deg, #0a192f 0%, #112240 50%, #0d1421 100%)",
  "forest-mist": "linear-gradient(135deg, #0b1a0b 0%, #1a2f1a 40%, #0d1a0d 100%)",
  "warm-clay": "linear-gradient(135deg, #2c1810 0%, #3d2419 40%, #1a0f0a 100%)",
  "arctic-light": "linear-gradient(135deg, #e8edf2 0%, #d4dce6 40%, #c2cdd9 100%)",
  "lavender-dusk": "linear-gradient(135deg, #1a0a2e 0%, #2d1548 40%, #0d0a1a 100%)",
};

export type HeroLayout = 'classic' | 'centered' | 'split' | 'minimal' | 'banner' | 'sidebar' | 'editorial' | 'card' | 'stacked' | 'cinematic' | 'compact';
export type HeroRightContent = 'featured' | 'services' | 'stats' | 'testimonial' | 'showreel' | 'none';
export type HeroKnownForStyle = 'strip' | 'large' | 'text' | 'hidden';
export type HeroBgType = 'preset' | 'solid' | 'bokeh' | 'video' | 'gradient';

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
    hero_style?: string | null;
    hero_background_preset?: string | null;
  };
  socialLinks?: any[];
  representation?: any[];
  featuredProject?: any;
  stats?: { scripts: number; developing: number; awards: number };
  knownFor?: any[];
  heroLayout?: HeroLayout;
  heroRightContent?: HeroRightContent;
  heroKnownFor?: HeroKnownForStyle;
  services?: any[];
  testimonials?: any[];
  demoReels?: any[];
  imageAnimation?: string;
  heroBgType?: HeroBgType;
  heroBgSolidColor?: string;
  heroBgVideoUrl?: string;
}

const platformIcons: Record<string, string> = {
  imdb: "🎬", instagram: "📸", twitter: "𝕏", x: "𝕏",
  linkedin: "in", youtube: "▶", vimeo: "▷", tiktok: "♪",
  website: "🌐", spotlight: "★",
};

const PortfolioHero = ({ profile, socialLinks: socialLinksProp, representation, featuredProject, stats, knownFor, heroLayout = 'classic', heroRightContent = 'featured', heroKnownFor = 'strip', services, testimonials, demoReels, imageAnimation = 'none', heroBgType = 'preset', heroBgSolidColor, heroBgVideoUrl }: Props) => {
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

  // Resolve background type
  const heroStyle = profile.hero_style || 'full';
  const presetGradient = profile.hero_background_preset ? PRESET_GRADIENTS[profile.hero_background_preset] : null;
  const hasBannerImage = heroBgType === 'preset' && !!profile.banner_url;
  const isCompact = heroLayout === 'compact' || heroStyle === 'compact';
  const heroHeight = isCompact ? '280px' : theme.heroHeight;

  // Determine if background is dark for text contrast
  // CRITICAL: Banner images always get a dark scrim, so force light text regardless of theme
  const isLightPreset = profile.hero_background_preset === 'arctic-light';
  const solidIsLight = heroBgType === 'solid' && heroBgSolidColor ? isLightColor(heroBgSolidColor) : false;
  const hasDarkBg = heroBgType === 'bokeh' || heroBgType === 'video' || heroBgType === 'gradient'
    || (heroBgType === 'preset' && hasBannerImage)
    || (heroBgType === 'preset' && !!presetGradient && !isLightPreset)
    || (heroBgType === 'solid' && !solidIsLight);

  let heroText: string, heroTextMuted: string, heroTextFaint: string;
  if (heroBgType === 'solid' && heroBgSolidColor) {
    const c = getContrastTextColors(heroBgSolidColor);
    heroText = c.text; heroTextMuted = c.muted; heroTextFaint = c.faint;
  } else if (hasDarkBg) {
    heroText = '#F5F0EB'; heroTextMuted = 'rgba(245,240,235,0.65)'; heroTextFaint = 'rgba(245,240,235,0.4)';
  } else if (isLightPreset) {
    heroText = '#1a1a1a'; heroTextMuted = 'rgba(26,26,26,0.7)'; heroTextFaint = 'rgba(26,26,26,0.45)';
  } else {
    heroText = theme.textPrimary; heroTextMuted = theme.textSecondary; heroTextFaint = theme.textTertiary;
  }

  const imgAnimClass = imageAnimation !== 'none' ? `img-anim-${imageAnimation}` : '';

  /* ── Shared sub-components ── */

  const PhotoEl = ({ size = theme.profilePhotoSize, className = '' }: { size?: string; className?: string }) => (
    profile.profile_photo_url ? (
      <img src={profile.profile_photo_url} alt={name}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: size, height: size, border: theme.profilePhotoBorder, boxShadow: theme.profilePhotoShadow }} />
    ) : (
      <div className={`rounded-full flex items-center justify-center shrink-0 text-xl font-bold ${className}`}
        style={{ width: size, height: size, backgroundColor: theme.accentSubtle, color: theme.accentPrimary, border: theme.profilePhotoBorder }}>
        {initials}
      </div>
    )
  );

  const NameEl = ({ fontSize = 'clamp(28px, 4.5vw, 44px)', className = '' }: { fontSize?: string; className?: string }) => (
    <h1 className={`tracking-tight leading-[1.1] ${className}`}
      style={{ fontFamily: theme.fontDisplay, fontWeight: theme.nameWeight, fontSize, color: heroText, letterSpacing: '-0.02em' }}>
      {name}
    </h1>
  );

  const RepLine = () => primaryRep ? (
    <div className="flex items-center gap-1.5 mt-1">
      <span className="text-[12px] tracking-wide" style={{ color: heroTextMuted }}>Repped by</span>
      {hasMultipleReps ? (
        <Popover>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center gap-1 text-[12px] font-medium tracking-wide transition-colors hover:opacity-80" style={{ color: theme.accentPrimary }}>
              {representation!.map(r => r.company?.split('(')[0]?.trim() || r.name).join(' · ')}
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" style={{ backgroundColor: theme.bgElevated, border: `1px solid ${theme.borderDefault}`, borderRadius: theme.cardRadius }}>
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
  ) : null;

  const TaglineEl = ({ style: s = {} }: { style?: React.CSSProperties }) => profile.tagline ? (
    <p className="text-[15px] sm:text-base" style={{ fontFamily: theme.fontBody, color: heroTextMuted, letterSpacing: '0.01em', ...s }}>
      {profile.tagline}
    </p>
  ) : null;

  const CredentialRow = ({ style: s = {} }: { style?: React.CSSProperties }) => (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5" style={s}>
      {profile.location && (
        <span className="inline-flex items-center gap-1 text-[12px] uppercase tracking-widest" style={{ color: heroTextFaint }}>
          <MapPin className="w-3 h-3" />{profile.location}
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
      {socialLinks.length > 0 && (
        <>
          <span className="w-px h-3" style={{ backgroundColor: heroTextFaint }} />
          {socialLinks.map(link => {
            const icon = platformIcons[link.platform?.toLowerCase()] || "🔗";
            return (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                className="text-sm transition-colors duration-200" style={{ color: heroTextFaint }}
                onMouseEnter={e => (e.currentTarget.style.color = theme.accentPrimary)}
                onMouseLeave={e => (e.currentTarget.style.color = heroTextFaint)}
                title={link.label || link.platform}>
                {icon}
              </a>
            );
          })}
        </>
      )}
    </div>
  );

  const BioEl = ({ maxW = 'max-w-lg', style: s = {} }: { maxW?: string; style?: React.CSSProperties }) => bioText ? (
    <div className={maxW} style={s}>
      <div className="text-[14px] leading-[1.65] overflow-hidden transition-all duration-500"
        style={{ color: heroTextMuted, fontFamily: theme.fontBody, maxHeight: bioIsTruncatable && !bioExpanded ? '3.5em' : '100em' }}
        dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(displayBio) }} />
      {bioIsTruncatable && (
        <button onClick={() => setBioExpanded(!bioExpanded)}
          className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-medium transition-colors"
          style={{ color: theme.accentPrimary }}>
          {bioExpanded ? <>Less <ChevronUp className="w-3 h-3" /></> : <>More <ChevronDown className="w-3 h-3" /></>}
        </button>
      )}
    </div>
  ) : null;

  const CtaEl = () => showCta ? <PortfolioCTA label={ctaLabel} onClick={handleCta} /> : null;

  const KnownForStrip = () => {
    if (!knownFor?.length || heroKnownFor === 'hidden') return null;
    const posterWidth = heroKnownFor === 'large' ? '120px' : '80px';
    const display = heroKnownFor === 'text' ? 'text' : 'image';
    return (
      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
        {knownFor.slice(0, 6).map((item: any) => (
          <div key={item.id} className={imgAnimClass}>
            <PosterCard item={item} width={posterWidth} display={display} />
          </div>
        ))}
      </div>
    );
  };

  const StatsBar = ({ style: s = {} }: { style?: React.CSSProperties }) => stats && (stats.scripts > 0 || stats.developing > 0 || stats.awards > 0) ? (
    <div className="flex items-center gap-8 sm:gap-10" style={s}>
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
  ) : null;

  /* ── Right column content ── */
  const RightContent = () => {
    if (heroRightContent === 'none') return null;

    if (heroRightContent === 'showreel' && demoReels?.length) {
      const reel = demoReels[0];
      const getReelEmbedUrl = (url: string) => {
        if (isYouTube(url)) { const yid = extractYouTubeId(url); if (yid) return `https://www.youtube.com/embed/${yid}`; }
        if (isVimeo(url)) { const vid = extractVimeoId(url); if (vid) return `https://player.vimeo.com/video/${vid}`; }
        return "";
      };
      const reelEmbedUrl = getReelEmbedUrl(reel.video_url);
      return (
        <div className="w-full lg:w-[420px] shrink-0" style={stagger(3)}>
          <div className="overflow-hidden" style={{ borderRadius: theme.cardRadius, border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`, boxShadow: theme.cardShadow }}>
            <div className="relative" style={{ aspectRatio: '16/9' }}>
              {reelEmbedUrl ? (
                <iframe src={reelEmbedUrl} title={reel.title} className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              ) : (
                <a href={reel.video_url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: theme.bgElevated }}>
                  <Play className="w-10 h-10" style={{ color: theme.accentPrimary }} />
                </a>
              )}
            </div>
            <div className="px-3 py-2" style={{ backgroundColor: theme.bgSecondary }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: theme.accentPrimary }}>Showreel</p>
              <p className="text-[13px] font-medium mt-0.5" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{reel.title}</p>
              {reel.description && <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: theme.textSecondary }}>{reel.description}</p>}
            </div>
          </div>
        </div>
      );
    }

    if (heroRightContent === 'services' && services?.length) {
      return (
        <div className="w-full lg:w-[360px] shrink-0 space-y-3" style={stagger(3)}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: theme.accentPrimary }}>Services</p>
          {services.slice(0, 2).map((svc: any) => (
            <div key={svc.id} className="p-3 rounded-lg" style={{ backgroundColor: theme.bgSecondary, border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`, borderRadius: theme.cardRadius }}>
              <h4 className="text-[14px] font-semibold" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{svc.name}</h4>
              {svc.starting_price && <p className="text-[12px] mt-1" style={{ color: theme.accentPrimary }}>From {svc.starting_price}</p>}
              {svc.description && <p className="text-[11px] mt-1 line-clamp-2" style={{ color: theme.textSecondary }}>{svc.description}</p>}
            </div>
          ))}
        </div>
      );
    }

    if (heroRightContent === 'stats') {
      return (
        <div className="w-full lg:w-[360px] shrink-0" style={stagger(3)}>
          <div className="p-5 rounded-lg" style={{ backgroundColor: theme.bgSecondary, border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`, borderRadius: theme.cardRadius }}>
            <StatsBar />
          </div>
        </div>
      );
    }

    if (heroRightContent === 'testimonial' && testimonials?.length) {
      const t = testimonials[0];
      return (
        <div className="w-full lg:w-[360px] shrink-0" style={stagger(3)}>
          <div className="p-4 rounded-lg" style={{ backgroundColor: theme.bgSecondary, border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`, borderRadius: theme.cardRadius }}>
            <Quote className="w-5 h-5 mb-2" style={{ color: theme.accentPrimary, opacity: 0.5 }} />
            <p className="text-[13px] italic leading-relaxed" style={{ color: theme.textPrimary, fontFamily: theme.fontBody }}>"{t.quote}"</p>
            <div className="flex items-center gap-2 mt-3">
              {t.author_photo_url && <img src={t.author_photo_url} alt="" className="w-7 h-7 rounded-full object-cover" />}
              <div>
                <p className="text-[11px] font-semibold" style={{ color: theme.textPrimary }}>{t.author_name}</p>
                <p className="text-[10px]" style={{ color: theme.textSecondary }}>{t.author_role}{t.author_company ? `, ${t.author_company}` : ''}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default: featured project
    if (!featuredProject) return null;
    const cardLink = featuredProject.imdb_link || featuredProject.script_pdf_url;
    const cardContent = (
      <div className="overflow-hidden transition-all duration-300 flex group/feat"
        style={{ backgroundColor: theme.bgSecondary, border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}>
        {(featuredProject.poster_url || featuredProject.backdrop_url || featuredProject.custom_image_url) && (
          <div className={`w-[100px] shrink-0 overflow-hidden relative ${imgAnimClass}`}>
            <img src={featuredProject.poster_url || featuredProject.custom_image_url || featuredProject.backdrop_url}
              alt={featuredProject.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/feat:scale-105"
              style={{ minHeight: '150px' }} />
            {cardLink && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/feat:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                <ExternalLink className="w-5 h-5" style={{ color: '#fff' }} />
              </div>
            )}
          </div>
        )}
        <div className="flex-1 p-3 space-y-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: theme.accentPrimary }}>Featured Project</p>
            {cardLink && (
              <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full ml-auto shrink-0"
                style={{ backgroundColor: theme.accentSubtle, color: theme.accentPrimary }}>
                <ExternalLink className="w-2.5 h-2.5" />{featuredProject.imdb_link ? 'IMDb' : 'Read'}
              </span>
            )}
          </div>
          <h3 className="text-[15px] font-semibold leading-tight" style={{ fontFamily: theme.fontDisplay, fontWeight: theme.headingWeight, color: theme.textPrimary }}>
            {featuredProject.title}
          </h3>
          {featuredProject.genre?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {featuredProject.genre.slice(0, 3).map((g: string) => (
                <span key={g} className="text-[9px] uppercase tracking-wide px-1.5 py-0.5" style={{ backgroundColor: theme.accentSubtle, color: theme.textSecondary, borderRadius: '3px' }}>{g}</span>
              ))}
            </div>
          )}
          {featuredProject.logline && (
            <p className="text-[12px] leading-relaxed line-clamp-3" style={{ fontFamily: theme.fontBody, color: theme.textSecondary }}>"{featuredProject.logline}"</p>
          )}
        </div>
      </div>
    );
    return (
      <div id="tour-featured" className="w-full lg:w-[360px] shrink-0" style={stagger(3)}>
        {cardLink ? <a href={cardLink} target="_blank" rel="noopener noreferrer" className="no-underline block hover:scale-[1.01] transition-transform duration-300">{cardContent}</a> : cardContent}
      </div>
    );
  };

  /* ══════════════════ LAYOUT RENDERERS ══════════════════ */

  const renderClassic = () => (
    <div className="relative z-10 flex flex-col justify-end h-full" style={{ minHeight: heroHeight }}>
      <div className="max-w-[1080px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        {knownFor && knownFor.length > 0 && heroKnownFor !== 'hidden' && (
          <div id="tour-known-for" className="mb-6" style={stagger(0)}><KnownForStrip /></div>
        )}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-end">
          <div id="tour-identity" className="flex-1 min-w-0 space-y-3">
            <div className="flex items-end gap-4" style={stagger(1)}>
              <PhotoEl />
              <div className="min-w-0 pb-1"><NameEl /><RepLine /></div>
            </div>
            <TaglineEl style={stagger(1)} />
            <CredentialRow style={stagger(2)} />
            <BioEl style={stagger(3)} />
            {showCta && <div style={stagger(4)}><CtaEl /></div>}
          </div>
          <RightContent />
        </div>
        {heroRightContent !== 'stats' && (
          <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${profile.banner_url ? 'rgba(255,255,255,0.06)' : theme.borderDefault}`, ...stagger(6) }}>
            <StatsBar />
          </div>
        )}
      </div>
    </div>
  );

  const renderCentered = () => (
    <div className="relative z-10 flex flex-col justify-end h-full" style={{ minHeight: heroHeight }}>
      <div className="max-w-[1080px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 text-center">
        {knownFor && knownFor.length > 0 && heroKnownFor !== 'hidden' && (
          <div className="flex justify-center mb-6" style={stagger(0)}><KnownForStrip /></div>
        )}
        <div className="flex flex-col items-center space-y-4">
          <div style={stagger(1)}><PhotoEl size="96px" /></div>
          <NameEl fontSize="clamp(32px, 5vw, 52px)" className="text-center" />
          <TaglineEl style={{ ...stagger(2), textAlign: 'center' }} />
          <CredentialRow style={{ ...stagger(3), justifyContent: 'center' }} />
          <BioEl maxW="max-w-xl" style={{ ...stagger(4), textAlign: 'center' }} />
          {showCta && <div style={stagger(5)}><CtaEl /></div>}
          <div style={stagger(6)}><StatsBar /></div>
        </div>
      </div>
    </div>
  );

  const renderSplit = () => (
    <div className="relative z-10 flex flex-col justify-end h-full" style={{ minHeight: heroHeight }}>
      <div className="max-w-[1080px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          <div className="space-y-3" style={stagger(1)}>
            <PhotoEl size="80px" />
            <NameEl />
            <RepLine />
            <CredentialRow />
          </div>
          <div className="space-y-4" style={stagger(2)}>
            <TaglineEl />
            <BioEl maxW="max-w-full" />
            {showCta && <CtaEl />}
            <StatsBar />
          </div>
        </div>
        {knownFor && knownFor.length > 0 && heroKnownFor !== 'hidden' && (
          <div className="mt-8" style={stagger(4)}><KnownForStrip /></div>
        )}
      </div>
    </div>
  );

  const renderMinimal = () => (
    <div className="relative z-10 flex flex-col justify-end h-full" style={{ minHeight: '200px' }}>
      <div className="max-w-[1080px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4" style={stagger(1)}>
          <NameEl fontSize="clamp(36px, 6vw, 64px)" />
          <TaglineEl />
          <CredentialRow style={stagger(2)} />
          {showCta && <div style={stagger(3)}><CtaEl /></div>}
        </div>
      </div>
    </div>
  );

  const renderBanner = () => (
    <div className="relative z-10 flex flex-col justify-end h-full" style={{ minHeight: heroHeight }}>
      <div className="max-w-[1080px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-end gap-6">
          <div style={stagger(1)}><PhotoEl size="100px" /></div>
          <div className="flex-1 space-y-2">
            <NameEl fontSize="clamp(32px, 5vw, 56px)" />
            <TaglineEl style={stagger(2)} />
            <CredentialRow style={stagger(3)} />
          </div>
        </div>
        <div className="mt-6 flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 space-y-3">
            <RepLine />
            <BioEl maxW="max-w-2xl" style={stagger(4)} />
            {showCta && <div style={stagger(5)}><CtaEl /></div>}
          </div>
          <RightContent />
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="relative z-10 flex flex-col justify-end h-full" style={{ minHeight: heroHeight }}>
      <div className="max-w-[1080px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[280px] shrink-0 space-y-4" style={stagger(1)}>
            <PhotoEl size="120px" />
            <NameEl fontSize="clamp(22px, 3vw, 28px)" />
            <RepLine />
            <TaglineEl />
            <CredentialRow />
            {showCta && <div className="[&_button]:text-[12px] [&_button]:px-4 [&_button]:truncate [&_button]:max-w-full"><CtaEl /></div>}
          </div>
          <div className="flex-1 space-y-4" style={stagger(2)}>
            <BioEl maxW="max-w-full" />
            <RightContent />
            {knownFor && knownFor.length > 0 && heroKnownFor !== 'hidden' && <KnownForStrip />}
            <StatsBar />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEditorial = () => (
    <div className="relative z-10 flex flex-col justify-end h-full" style={{ minHeight: heroHeight }}>
      <div className="max-w-[1080px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8">
        <div style={stagger(0)}>
          <NameEl fontSize="clamp(40px, 7vw, 72px)" />
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mt-6 items-start">
          <div className="flex items-center gap-4" style={stagger(1)}>
            <PhotoEl size="56px" />
            <div>
              <TaglineEl />
              <RepLine />
            </div>
          </div>
          <div className="flex-1" />
          <CredentialRow style={stagger(2)} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mt-6">
          <div className="space-y-3">
            <BioEl maxW="max-w-full" style={stagger(3)} />
            {showCta && <div style={stagger(4)}><CtaEl /></div>}
          </div>
          <RightContent />
        </div>
        {knownFor && knownFor.length > 0 && heroKnownFor !== 'hidden' && (
          <div className="mt-6" style={stagger(5)}><KnownForStrip /></div>
        )}
      </div>
    </div>
  );

  const renderCard = () => (
    <div className="relative z-10 flex items-end justify-center h-full" style={{ minHeight: heroHeight }}>
      <div className="max-w-[640px] w-full mx-4 mb-8 p-6 sm:p-8 rounded-2xl" style={{ ...stagger(1), backgroundColor: `${theme.bgSecondary}ee`, border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`, backdropFilter: 'blur(16px)', boxShadow: theme.cardShadow }}>
        <div className="flex items-center gap-4 mb-4">
          <PhotoEl size="72px" />
          <div>
            <NameEl fontSize="clamp(24px, 3.5vw, 36px)" />
            <RepLine />
          </div>
        </div>
        <TaglineEl />
        <CredentialRow style={{ marginTop: '8px' }} />
        <BioEl maxW="max-w-full" style={{ marginTop: '12px' }} />
        {showCta && <div className="mt-4"><CtaEl /></div>}
        <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${theme.borderDefault}` }}><StatsBar /></div>
      </div>
    </div>
  );

  const renderStacked = () => (
    <div className="relative z-10 flex flex-col justify-end h-full" style={{ minHeight: heroHeight }}>
      <div className="max-w-[1080px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 space-y-6">
        {knownFor && knownFor.length > 0 && heroKnownFor !== 'hidden' && (
          <div style={stagger(0)}><KnownForStrip /></div>
        )}
        <div style={stagger(1)}><NameEl fontSize="clamp(36px, 6vw, 56px)" /></div>
        <TaglineEl style={stagger(2)} />
        <div className="flex items-center gap-4" style={stagger(3)}>
          <PhotoEl size="64px" />
          <CredentialRow />
        </div>
        <RepLine />
        <BioEl maxW="max-w-2xl" style={stagger(4)} />
        {showCta && <div style={stagger(5)}><CtaEl /></div>}
        <div className="flex flex-col lg:flex-row gap-6 items-start" style={stagger(6)}>
          <RightContent />
          <StatsBar />
        </div>
      </div>
    </div>
  );

  const renderCinematic = () => (
    <div className="relative z-10 flex flex-col justify-end h-full" style={{ minHeight: heroHeight }}>
      {/* Large semi-transparent name behind */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <h1 className="text-[14vw] font-black leading-none whitespace-nowrap"
          style={{ fontFamily: theme.fontDisplay, color: heroText, opacity: 0.07, letterSpacing: '-0.05em', textTransform: 'uppercase' }}>
          {name}
        </h1>
      </div>
      <div className="max-w-[1080px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-end">
          <div className="flex-1 space-y-4">
            <div className="flex items-end gap-4" style={stagger(1)}>
              <PhotoEl size="88px" />
              <div>
                <NameEl fontSize="clamp(32px, 5vw, 48px)" />
                <RepLine />
              </div>
            </div>
            <TaglineEl style={stagger(2)} />
            <CredentialRow style={stagger(3)} />
            <BioEl style={stagger(4)} />
            {showCta && <div style={stagger(5)}><CtaEl /></div>}
          </div>
          <RightContent />
        </div>
        {knownFor && knownFor.length > 0 && heroKnownFor !== 'hidden' && (
          <div className="mt-8" style={stagger(6)}><KnownForStrip /></div>
        )}
        <div className="mt-6 pt-5" style={{ borderTop: `1px solid rgba(255,255,255,0.06)`, ...stagger(7) }}>
          <StatsBar />
        </div>
      </div>
    </div>
  );

  const renderCompact = () => (
    <div className="relative z-10 flex items-end h-full" style={{ minHeight: '280px' }}>
      <div className="max-w-[1080px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4" style={stagger(1)}>
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <PhotoEl size="56px" />
            <div className="min-w-0 flex-1">
              <NameEl fontSize="clamp(20px, 3vw, 28px)" />
              <div className="mt-1"><TaglineEl /></div>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <CredentialRow />
            {showCta && <CtaEl />}
          </div>
        </div>
      </div>
    </div>
  );

  const layoutRenderers: Record<HeroLayout, () => JSX.Element> = {
    classic: renderClassic,
    centered: renderCentered,
    split: renderSplit,
    minimal: renderMinimal,
    banner: renderBanner,
    sidebar: renderSidebar,
    editorial: renderEditorial,
    card: renderCard,
    stacked: renderStacked,
    cinematic: renderCinematic,
    compact: renderCompact,
  };

  /* ── Background renderer based on heroBgType ── */
  const renderBackground = () => {
    switch (heroBgType) {
      case 'solid':
        return (
          <div className="absolute inset-0" style={{ backgroundColor: heroBgSolidColor || theme.bgPrimary }} />
        );
      case 'bokeh':
        return (
          <>
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${theme.bgPrimary} 0%, ${theme.bgHero} 100%)` }} />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <BokehField count={18} />
              {/* Spotlight */}
              <div className="absolute" style={{
                width: '60%', height: '60%', top: '10%', left: '25%',
                background: `radial-gradient(ellipse, ${theme.accentPrimary}12 0%, transparent 70%)`,
                filter: 'blur(40px)',
              }} />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: `linear-gradient(to top, ${theme.bgPrimary} 0%, transparent 100%)` }} />
          </>
        );
      case 'video':
        return (
          <>
            <div className="absolute inset-0">
              <video
                src={heroBgVideoUrl || 'https://cdn.coverr.co/videos/coverr-los-angeles-at-night-4k-2539/1080p.mp4'}
                autoPlay muted loop playsInline
                className="w-full h-full object-cover"
                style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1s ease-out' }}
              />
            </div>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)' }} />
            <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: `linear-gradient(to top, ${theme.bgPrimary} 0%, transparent 100%)` }} />
          </>
        );
      case 'gradient':
        return (
          <>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0" style={{
                background: `linear-gradient(135deg, ${theme.bgPrimary} 0%, ${theme.bgHero} 50%, ${theme.accentPrimary}15 100%)`,
              }} />
              <div className="absolute w-[80vw] h-[80vh] rounded-full" style={{
                top: '-20%', left: '-10%',
                background: `radial-gradient(circle, ${theme.accentPrimary}10 0%, transparent 60%)`,
                filter: 'blur(60px)',
                animation: 'ambient-drift 20s ease-in-out infinite',
              }} />
              <div className="absolute w-[60vw] h-[60vh] rounded-full" style={{
                bottom: '-10%', right: '-5%',
                background: `radial-gradient(circle, ${theme.accentPrimary}08 0%, transparent 60%)`,
                filter: 'blur(80px)',
                animation: 'ambient-drift 28s ease-in-out infinite reverse',
              }} />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: `linear-gradient(to top, ${theme.bgPrimary} 0%, transparent 100%)` }} />
          </>
        );
      case 'preset':
      default:
        if (hasBannerImage) {
          return (
            <>
              <div className="absolute inset-0" style={{ bottom: '-1px' }}>
                <img src={profile.banner_url!} alt="" className="w-full h-full object-cover"
                  style={{
                    transform: theme.enableParallax ? `translateY(${scrollY * theme.parallaxIntensity}px) scale(1.1)` : 'scale(1.1)',
                    opacity: loaded ? 1 : 0.6, transition: 'opacity 1s ease-out',
                  }} />
              </div>
              {/* Dark scrim — ensures text readability on ALL themes including light ones */}
              <div className="absolute inset-0" style={{ bottom: '-1px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)' }} />
              <div className="absolute inset-0" style={{ bottom: '-1px', background: theme.heroOverlayGradient, mixBlendMode: theme.heroOverlayBlend as any }} />
              <div className="absolute inset-x-0 bottom-0 h-2/3" style={{ bottom: '-1px', background: `linear-gradient(to top, ${theme.bgPrimary} 2%, ${theme.bgPrimary}ee 8%, transparent 100%)` }} />
            </>
          );
        } else if (presetGradient) {
          return (
            <>
              <div className="absolute inset-0" style={{ background: presetGradient }} />
              <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: `linear-gradient(to top, ${theme.bgPrimary} 0%, transparent 100%)` }} />
            </>
          );
        } else {
          return (
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 20%, ${theme.accentGlow} 0%, transparent 60%), linear-gradient(135deg, ${theme.bgHero} 0%, ${theme.bgPrimary} 100%)` }} />
          );
        }
    }
  };

  return (
    <header className="relative overflow-hidden" style={{ minHeight: heroHeight }}>
      {/* Background */}
      {renderBackground()}

      {layoutRenderers[heroLayout]()}

      {(profile.booking_url || profile.cta_url) && (
        <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} bookingUrl={profile.booking_url || profile.cta_url || ""} name={name} />
      )}
    </header>
  );
};

export default PortfolioHero;
