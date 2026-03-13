import { createContext, useContext, useState, useEffect, forwardRef } from "react";
import { Link } from "react-router-dom";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import SectionOptionsBar from "@/components/portfolio/SectionOptionsBar";
import SectionLoglineShowcase from "@/components/portfolio/sections/SectionLoglineShowcase";
import SectionScriptLibrary from "@/components/portfolio/sections/SectionScriptLibrary";
import SectionProjects from "@/components/portfolio/sections/SectionProjects";
import SectionAwards from "@/components/portfolio/sections/SectionAwards";
import SectionPress from "@/components/portfolio/sections/SectionPress";
import SectionTestimonials from "@/components/portfolio/sections/SectionTestimonials";
import SectionServices from "@/components/portfolio/sections/SectionServices";
import SectionKnownFor, { type KnownForVariant } from "@/components/portfolio/sections/SectionKnownFor";
import SectionClientLogos from "@/components/portfolio/sections/SectionClientLogos";
import SectionEducation from "@/components/portfolio/sections/SectionEducation";
import SectionGallery from "@/components/portfolio/sections/SectionGallery";
import SectionDemoReels from "@/components/portfolio/sections/SectionDemoReels";
import SectionRepresentation from "@/components/portfolio/sections/SectionRepresentation";
import SectionSkills from "@/components/portfolio/sections/SectionSkills";
import SectionEvents from "@/components/portfolio/sections/SectionEvents";
import SectionProductionHistory from "@/components/portfolio/sections/SectionProductionHistory";
import SectionActorStats from "@/components/portfolio/sections/SectionActorStats";
import SectionCaseStudies from "@/components/portfolio/sections/SectionCaseStudies";
import SectionCampaignTimeline from "@/components/portfolio/sections/SectionCampaignTimeline";
import SectionPublishedWork from "@/components/portfolio/sections/SectionPublishedWork";
import GlassCard from "@/components/portfolio/GlassCard";
import { ExternalLink } from "lucide-react";
import type { HeroLayout, HeroRightContent, HeroKnownForStyle } from "@/components/portfolio/PortfolioHero";

/* ── Unified section variants context ── */
export type HeroBgType = 'preset' | 'solid' | 'bokeh' | 'video' | 'gradient';

export interface SectionVariants {
  knownFor: KnownForVariant;
  loglines: 'editorial' | 'cards' | 'minimal';
  scripts: 'detailed' | 'grid' | 'compact';
  credits: 'poster' | 'table' | 'grid';
  awards: 'list' | 'grid' | 'laurels';
  testimonials: 'carousel' | 'cards' | 'wall' | 'single';
  press: 'feed' | 'cards' | 'quotes';
  services: 'full' | 'compact' | 'pricing';
  clientLogos: 'bar' | 'grid' | 'marquee';
  clientLogosColor: 'original' | 'grayscale' | 'white' | 'dark' | 'theme';
  clientLogosSize: 'sm' | 'md' | 'lg' | 'xl';
  education: 'list' | 'cards' | 'timeline';
  gallery: 'grid' | 'masonry' | 'carousel';
  demoReels: 'grid' | 'featured' | 'list';
  representation: 'cards' | 'compact' | 'inline';
  skills: 'tags' | 'bars' | 'grouped';
  events: 'list' | 'calendar' | 'cards';
  productions: 'list' | 'cards' | 'timeline';
  imageAnimation: 'none' | 'pulse' | 'drift' | 'glass' | 'shine' | 'fade' | 'tilt';
  caseStudies: 'stack' | 'magazine' | 'grid' | 'metrics';
  publishedWork: 'magazine' | 'grid' | 'list';
  campaigns: 'timeline';
  heroLayout: HeroLayout;
  heroRightContent: HeroRightContent;
  ctaPreset: 'script' | 'hire' | 'contact' | 'reel' | 'book' | 'custom';
  heroKnownFor: HeroKnownForStyle;
  heroBgType: HeroBgType;
  knownForPosition: 'hero_above_name' | 'hero_below_cta' | 'hero_beside_photo' | 'below_hero' | 'body_section' | 'hidden';
}

export const defaultVariants: SectionVariants = {
  knownFor: 'strip',
  loglines: 'editorial',
  scripts: 'detailed',
  credits: 'poster',
  awards: 'list',
  testimonials: 'carousel',
  press: 'feed',
  services: 'full',
  clientLogos: 'bar',
  education: 'list',
  gallery: 'grid',
  demoReels: 'grid',
  representation: 'cards',
  skills: 'tags',
  events: 'list',
  productions: 'list',
  imageAnimation: 'none',
  caseStudies: 'stack',
  publishedWork: 'magazine',
  campaigns: 'timeline',
  heroLayout: 'classic',
  heroRightContent: 'featured',
  ctaPreset: 'script',
  heroKnownFor: 'strip',
  heroBgType: 'preset',
  knownForPosition: 'hero_above_name',
};

export const SectionVariantsCtx = createContext<{
  variants: SectionVariants;
  setVariant: <K extends keyof SectionVariants>(key: K, value: SectionVariants[K]) => void;
}>({ variants: defaultVariants, setVariant: () => {} });

export const useSectionVariants = () => useContext(SectionVariantsCtx);

/* ── Option definitions ── */
export const VARIANT_OPTIONS: Record<keyof SectionVariants, { key: string; label: string }[]> = {
  knownFor: [
    { key: 'strip', label: 'Strip' }, { key: 'scroll', label: 'Scroll' }, { key: 'grid', label: 'Grid' },
    { key: 'stack', label: 'Stack' }, { key: 'spotlight', label: 'Spotlight' },
  ],
  loglines: [
    { key: 'editorial', label: 'Editorial' }, { key: 'cards', label: 'Cards' }, { key: 'minimal', label: 'Minimal' },
  ],
  scripts: [
    { key: 'detailed', label: 'Detailed' }, { key: 'grid', label: 'Grid' }, { key: 'compact', label: 'Compact' },
  ],
  credits: [
    { key: 'poster', label: 'Poster' }, { key: 'table', label: 'Table' }, { key: 'grid', label: 'Grid' },
  ],
  awards: [
    { key: 'list', label: 'List' }, { key: 'grid', label: 'Grid' }, { key: 'laurels', label: 'Laurels' },
  ],
  testimonials: [
    { key: 'carousel', label: 'Carousel' }, { key: 'cards', label: 'Cards' }, { key: 'wall', label: 'Wall' }, { key: 'single', label: 'Featured' },
  ],
  press: [
    { key: 'feed', label: 'Feed' }, { key: 'cards', label: 'Cards' }, { key: 'quotes', label: 'Quotes' },
  ],
  services: [
    { key: 'full', label: 'Full' }, { key: 'compact', label: 'Compact' }, { key: 'pricing', label: 'Pricing' },
  ],
  clientLogos: [
    { key: 'bar', label: 'Bar' }, { key: 'grid', label: 'Grid' }, { key: 'marquee', label: 'Marquee' },
  ],
  education: [
    { key: 'list', label: 'List' }, { key: 'cards', label: 'Cards' }, { key: 'timeline', label: 'Timeline' },
  ],
  gallery: [
    { key: 'grid', label: 'Grid' }, { key: 'masonry', label: 'Masonry' }, { key: 'carousel', label: 'Carousel' },
  ],
  demoReels: [
    { key: 'grid', label: 'Grid' }, { key: 'featured', label: 'Featured' }, { key: 'list', label: 'List' },
  ],
  representation: [
    { key: 'cards', label: 'Cards' }, { key: 'compact', label: 'Compact' }, { key: 'inline', label: 'Inline' },
  ],
  skills: [
    { key: 'tags', label: 'Tags' }, { key: 'bars', label: 'Bars' }, { key: 'grouped', label: 'Grouped' },
  ],
  events: [
    { key: 'list', label: 'List' }, { key: 'calendar', label: 'Calendar' }, { key: 'cards', label: 'Cards' },
  ],
  productions: [
    { key: 'list', label: 'List' }, { key: 'cards', label: 'Cards' }, { key: 'timeline', label: 'Timeline' },
  ],
  imageAnimation: [
    { key: 'none', label: 'None' }, { key: 'pulse', label: 'Pulse' }, { key: 'drift', label: 'Drift' },
    { key: 'glass', label: 'Glass' }, { key: 'shine', label: 'Shine' }, { key: 'fade', label: 'Fade' }, { key: 'tilt', label: 'Tilt' },
  ],
  caseStudies: [
    { key: 'stack', label: 'Stack' }, { key: 'magazine', label: 'Magazine' }, { key: 'grid', label: 'Grid' }, { key: 'metrics', label: 'Metrics' },
  ],
  publishedWork: [
    { key: 'magazine', label: 'Magazine' }, { key: 'grid', label: 'Grid' }, { key: 'list', label: 'List' },
  ],
  campaigns: [
    { key: 'timeline', label: 'Timeline' },
  ],
  heroLayout: [
    { key: 'classic', label: 'Classic' }, { key: 'centered', label: 'Centered' }, { key: 'split', label: 'Split' },
    { key: 'minimal', label: 'Minimal' }, { key: 'banner', label: 'Banner' }, { key: 'sidebar', label: 'Sidebar' },
    { key: 'editorial', label: 'Editorial' }, { key: 'card', label: 'Card' }, { key: 'stacked', label: 'Stacked' },
    { key: 'cinematic', label: 'Cinematic' }, { key: 'compact', label: 'Compact' },
  ],
  heroRightContent: [
    { key: 'featured', label: 'Featured' }, { key: 'services', label: 'Services' },
    { key: 'stats', label: 'Stats' }, { key: 'testimonial', label: 'Testimonial' },
    { key: 'showreel', label: 'Showreel' }, { key: 'none', label: 'None' },
  ],
  ctaPreset: [
    { key: 'script', label: 'Read Script' }, { key: 'hire', label: 'Hire Me' },
    { key: 'contact', label: 'Get in Touch' }, { key: 'reel', label: 'Watch Reel' },
    { key: 'book', label: 'Book Consult' }, { key: 'custom', label: 'View Work' },
  ],
  heroKnownFor: [
    { key: 'strip', label: 'Strip' }, { key: 'large', label: 'Large' },
    { key: 'text', label: 'Text' }, { key: 'hidden', label: 'Hidden' },
  ],
  heroBgType: [
    { key: 'preset', label: 'Preset' }, { key: 'solid', label: 'Solid Color' },
    { key: 'bokeh', label: 'Bokeh' }, { key: 'video', label: 'Video Loop' },
    { key: 'gradient', label: 'Gradient' },
  ],
  knownForPosition: [
    { key: 'hero_above_name', label: 'Above Name' },
    { key: 'hero_below_cta', label: 'Below CTA' },
    { key: 'hero_beside_photo', label: 'Beside Photo' },
    { key: 'below_hero', label: 'Below Hero' },
    { key: 'body_section', label: 'Body Section' },
    { key: 'hidden', label: 'Hidden' },
  ],
};

/* ── Toggle wrapper components ── */
export const WithToggle = <K extends keyof SectionVariants>({ sectionKey, sectionName, children }: { sectionKey: K; sectionName: string; children: (variant: SectionVariants[K]) => React.ReactNode }) => {
  const { variants, setVariant } = useSectionVariants();
  return (
    <>
      <SectionOptionsBar
        sectionName={sectionName}
        options={VARIANT_OPTIONS[sectionKey]}
        value={variants[sectionKey]}
        onChange={(v) => setVariant(sectionKey, v as SectionVariants[K])}
      />
      {children(variants[sectionKey])}
    </>
  );
};

export const KnownForWithToggle = ({ items, display }: { items: any[]; display?: 'both' | 'image' | 'text' }) => (
  <WithToggle sectionKey="knownFor" sectionName="Known For">
    {(variant) => <SectionKnownFor items={items} variant={variant} display={display} />}
  </WithToggle>
);

export const LoglinesWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="loglines" sectionName="Loglines">
    {(variant) => <SectionLoglineShowcase items={items} variant={variant} />}
  </WithToggle>
);

export const ScriptsWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="scripts" sectionName="Scripts">
    {(variant) => <SectionScriptLibrary items={items} variant={variant} />}
  </WithToggle>
);

export const CreditsWithToggle = ({ items, profileType = "screenwriter" }: { items: any[]; profileType?: string }) => {
  const { variants } = useSectionVariants();
  return (
    <WithToggle sectionKey="credits" sectionName="Credits">
      {(variant) => <SectionProjects items={items} profileType={profileType} layout={variant} imageAnimation={variants.imageAnimation} />}
    </WithToggle>
  );
};

export const AwardsWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="awards" sectionName="Awards">
    {(variant) => <SectionAwards items={items} variant={variant} />}
  </WithToggle>
);

export const TestimonialsWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="testimonials" sectionName="Testimonials">
    {(variant) => <SectionTestimonials items={items} variant={variant} />}
  </WithToggle>
);

export const PressWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="press" sectionName="Press">
    {(variant) => <SectionPress items={items} variant={variant} />}
  </WithToggle>
);

export const ServicesWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="services" sectionName="Services">
    {(variant) => <SectionServices items={items} variant={variant} />}
  </WithToggle>
);

export const ClientLogosWithToggle = ({ companies }: { companies: string[] }) => (
  <WithToggle sectionKey="clientLogos" sectionName="Client Logos">
    {(variant) => <SectionClientLogos companies={companies} variant={variant} />}
  </WithToggle>
);

export const EducationWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="education" sectionName="Education">
    {(variant) => <SectionEducation items={items} variant={variant} />}
  </WithToggle>
);

export const GalleryWithToggle = ({ items }: { items: any[] }) => {
  const { variants } = useSectionVariants();
  return (
    <WithToggle sectionKey="gallery" sectionName="Gallery">
      {(variant) => <SectionGallery items={items} variant={variant} imageAnimation={variants.imageAnimation} />}
    </WithToggle>
  );
};

export const DemoReelsWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="demoReels" sectionName="Demo Reels">
    {(variant) => <SectionDemoReels items={items} variant={variant} />}
  </WithToggle>
);

export const RepresentationWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="representation" sectionName="Representation">
    {(variant) => <SectionRepresentation items={items} variant={variant} />}
  </WithToggle>
);

export const SkillsWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="skills" sectionName="Skills">
    {(variant) => <SectionSkills items={items} variant={variant} />}
  </WithToggle>
);

export const EventsWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="events" sectionName="Events">
    {(variant) => <SectionEvents items={items} variant={variant} />}
  </WithToggle>
);

export const ProductionsWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="productions" sectionName="Productions">
    {(variant) => <SectionProductionHistory items={items} variant={variant} />}
  </WithToggle>
);

export const ActorStatsWithToggle = ({ stats, profilePhoto, displayName, representation }: { stats: any; profilePhoto?: string | null; displayName?: string | null; representation?: any[] }) => (
  <SectionActorStats stats={stats} profilePhoto={profilePhoto} displayName={displayName} representation={representation} />
);

export const CaseStudiesWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="caseStudies" sectionName="Case Studies">
    {(variant) => <SectionCaseStudies items={items} variant={variant} />}
  </WithToggle>
);

export const CampaignTimelineWithToggle = ({ items }: { items: any[] }) => (
  <SectionCampaignTimeline items={items} />
);

export const PublishedWorkWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="publishedWork" sectionName="Published Work">
    {(variant) => <SectionPublishedWork items={items} variant={variant} />}
  </WithToggle>
);

/* ── Ambient Glow ── */
export const AmbientGlow = () => {
  const theme = usePortfolioTheme();
  const isDark = theme.bgPrimary.startsWith('#0') || theme.bgPrimary.startsWith('#1') || theme.bgPrimary.startsWith('#2');
  if (!isDark) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute w-[60vw] h-[40vh] rounded-full" style={{ top: '20%', left: '10%', background: `radial-gradient(circle, ${theme.accentPrimary}08 0%, transparent 70%)`, filter: 'blur(80px)', animation: 'ambient-drift 18s ease-in-out infinite' }} />
      <div className="absolute w-[50vw] h-[35vh] rounded-full" style={{ bottom: '10%', right: '5%', background: `radial-gradient(circle, ${theme.accentPrimary}05 0%, transparent 70%)`, filter: 'blur(100px)', animation: 'ambient-drift 24s ease-in-out infinite reverse' }} />
    </div>
  );
};

/* ── Mid-scroll CTA ── */
export const MidScrollCTA = forwardRef<HTMLDivElement>((_, _ref) => {
  const theme = usePortfolioTheme();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.35 && scrollPercent < 0.85) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl border"
        style={{ background: theme.bgElevated, borderColor: theme.borderDefault, backdropFilter: 'blur(16px)' }}>
        <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>Like what you see?</span>
        <Link to="/signup" className="text-sm font-semibold px-3 py-1 rounded-full text-white no-underline"
          style={{ background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentPrimary}dd)` }}>
          Create yours free
        </Link>
        <button onClick={() => setDismissed(true)} className="text-xs ml-1" style={{ color: theme.textTertiary }}>✕</button>
      </div>
    </div>
  );
});
MidScrollCTA.displayName = "MidScrollCTA";

/* ── Credit Hero Card ── */
export const CreditHeroCard = ({ project }: { project: any }) => {
  const theme = usePortfolioTheme();
  const card = (
    <GlassCard featured className="overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={project.backdrop_url || project.poster_url}
          alt={project.title}
          className="w-full aspect-[2.4/1] object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {project.imdb_link && (
          <div className="absolute top-3 right-3 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: `${theme.bgPrimary}cc`, color: theme.accentPrimary }}>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
      <div className="p-5 space-y-1.5" style={{ backgroundColor: theme.bgSecondary }}>
        {project.network_or_studio && (
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded inline-block" style={{ backgroundColor: theme.accentPrimary, color: theme.textOnAccent }}>
            {project.network_or_studio}
          </span>
        )}
        <h3 className="text-xl font-bold" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>
          {project.title}
          <span className="text-sm font-normal ml-2" style={{ color: theme.textTertiary }}>{project.year}</span>
        </h3>
        {project.role_name && (
          <p className="text-[13px] font-medium" style={{ color: theme.accentPrimary }}>
            {project.role_name}{project.role_type ? ` · ${project.role_type}` : ''}
          </p>
        )}
        {project.logline && (
          <p className="text-[13px] leading-relaxed max-w-xl" style={{ fontFamily: theme.fontBody, color: theme.textSecondary }}>
            {project.logline}
          </p>
        )}
      </div>
    </GlassCard>
  );

  return project.imdb_link ? (
    <a href={project.imdb_link} target="_blank" rel="noopener noreferrer" className="no-underline block">
      {card}
    </a>
  ) : card;
};

/* ── CTA Labels map ── */
export const CTA_LABELS: Record<string, string> = {
  script: 'Read My Latest Script',
  hire: 'Hire Me',
  contact: 'Get in Touch',
  reel: 'Watch My Reel',
  book: 'Book a Consultation',
  custom: 'View My Work',
};
