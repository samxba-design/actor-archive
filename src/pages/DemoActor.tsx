import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PortfolioThemeProvider, usePortfolioTheme } from "@/themes/ThemeProvider";
import { getAllThemeFontsUrl } from "@/themes/themes";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioFooter from "@/components/portfolio/PortfolioFooter";
import PortfolioSectionWrapper from "@/components/portfolio/PortfolioSectionWrapper";
import ThemeSwitcher from "@/components/portfolio/ThemeSwitcher";
import LayoutSwitcher, { type LayoutPreset } from "@/components/portfolio/LayoutSwitcher";
import SectionActorStats from "@/components/portfolio/sections/SectionActorStats";
import GlassCard from "@/components/portfolio/GlassCard";
import DemoProfileTabs from "@/components/demo/DemoProfileTabs";
import DemoInteractiveLayout from "@/components/demo/DemoInteractiveLayout";
import { ArrowRight, ChevronDown, ChevronUp, TrendingUp, Eye, FileText, Award } from "lucide-react";
import {
  SectionVariantsCtx, defaultVariants,
  type SectionVariants, WithToggle,
  KnownForWithToggle, CreditsWithToggle, AwardsWithToggle,
  TestimonialsWithToggle, PressWithToggle, ServicesWithToggle,
  ClientLogosWithToggle, EducationWithToggle, GalleryWithToggle,
  DemoReelsWithToggle, RepresentationWithToggle, SkillsWithToggle,
  EventsWithToggle, ProductionsWithToggle,
  AmbientGlow, MidScrollCTA, CTA_LABELS,
} from "@/components/demo/DemoShared";
import {
  mockProfile, mockSocialLinks, mockRepresentation, mockActorStats,
  mockCredits, mockDemoReels, mockAwards, mockPress, mockTestimonials,
  mockGallery, mockEducation, mockSkills, mockEvents, mockClients,
  mockKnownFor, featuredProject,
} from "@/data/demoActorData";

/* ══════════════════════ ACTOR-SPECIFIC DEFAULTS ══════════════════════ */

const actorDefaultVariants: SectionVariants = {
  ...defaultVariants,
  demoReels: 'featured',
  credits: 'poster',
  gallery: 'grid',
  heroLayout: 'classic',
  heroRightContent: 'showreel',
  ctaPreset: 'contact',
  heroKnownFor: 'strip',
  heroBgType: 'gradient',
  knownForPosition: 'hero_above_name',
};

/* ══════════════════════ LAYOUT COMPONENTS ══════════════════════ */

const ClassicLayout = () => {
  const demoSections = [
    { id: "stats", title: "Physical Stats", content: <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} /> },
    { id: "demoreels", title: "Demo Reels", content: <DemoReelsWithToggle items={mockDemoReels} /> },
    { id: "knownfor", title: "Known For", content: <KnownForWithToggle items={mockKnownFor} /> },
    { id: "credits", title: "Credits", content: <CreditsWithToggle items={mockCredits} profileType="actor" /> },
    { id: "gallery", title: "Headshots & Gallery", content: <GalleryWithToggle items={mockGallery} /> },
    { id: "training", title: "Training", content: <EducationWithToggle items={mockEducation} /> },
    { id: "skills", title: "Special Skills", content: <SkillsWithToggle items={mockSkills} /> },
    { id: "awards", title: "Awards & Recognition", content: <AwardsWithToggle items={mockAwards} /> },
    { id: "press", title: "Press & Reviews", content: <PressWithToggle items={mockPress} /> },
    { id: "testimonials", title: "Testimonials", content: <TestimonialsWithToggle items={mockTestimonials} /> },
    { id: "representation", title: "Representation", content: <RepresentationWithToggle items={mockRepresentation} /> },
    { id: "clients", title: "Worked With", content: <ClientLogosWithToggle companies={mockClients} /> },
    { id: "events", title: "Events & Appearances", content: <EventsWithToggle items={mockEvents} /> },
  ];

  return <DemoInteractiveLayout sections={demoSections} />;
};

const StandardLayout = () => (
  <>
    <div className="mb-10">
      <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} />
    </div>
    <div className="mb-10">
      <ClientLogosWithToggle companies={mockClients} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-10">
      <PortfolioSectionWrapper title="Demo Reels" index={0}>
        <DemoReelsWithToggle items={mockDemoReels} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Representation" index={1}>
        <RepresentationWithToggle items={mockRepresentation} />
      </PortfolioSectionWrapper>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mb-10">
      <PortfolioSectionWrapper title="Credits" index={2}>
        <CreditsWithToggle items={mockCredits} profileType="actor" />
      </PortfolioSectionWrapper>
      <div className="space-y-6">
        <PortfolioSectionWrapper title="Awards" index={3}>
          <AwardsWithToggle items={mockAwards} />
        </PortfolioSectionWrapper>
        <PortfolioSectionWrapper title="Training" index={4}>
          <EducationWithToggle items={mockEducation} />
        </PortfolioSectionWrapper>
      </div>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Headshots & Gallery" index={5}>
        <GalleryWithToggle items={mockGallery} />
      </PortfolioSectionWrapper>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PortfolioSectionWrapper title="Testimonials" index={6}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Press" index={7}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
    </div>
  </>
);

const CinematicLayout = () => (
  <>
    <div className="mb-12">
      <PortfolioSectionWrapper title="Demo Reels" index={0}>
        <DemoReelsWithToggle items={mockDemoReels} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} />
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Known For" index={-1}>
        <KnownForWithToggle items={mockKnownFor} display="image" />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Credits" index={1}>
        <CreditsWithToggle items={mockCredits} profileType="actor" />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Headshots & Gallery" index={2}>
        <GalleryWithToggle items={mockGallery} />
      </PortfolioSectionWrapper>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <PortfolioSectionWrapper title="Awards" index={3}>
        <AwardsWithToggle items={mockAwards} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Press" index={4}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Testimonials" index={5}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
  </>
);

const CompactLayout = () => (
  <>
    <div className="mb-8">
      <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <PortfolioSectionWrapper title="Demo Reels" index={0}>
        <DemoReelsWithToggle items={mockDemoReels} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Credits" index={1}>
        <CreditsWithToggle items={mockCredits} profileType="actor" />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-6">
      <ClientLogosWithToggle companies={mockClients} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <PortfolioSectionWrapper title="Awards" index={2}>
        <AwardsWithToggle items={mockAwards} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Press" index={3}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Gallery" index={4}>
        <GalleryWithToggle items={mockGallery} />
      </PortfolioSectionWrapper>
    </div>
  </>
);

const MagazineLayout = () => (
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
    <div className="space-y-10">
      <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} />
      <PortfolioSectionWrapper title="Demo Reels" index={0}>
        <DemoReelsWithToggle items={mockDemoReels} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Credits" index={1}>
        <CreditsWithToggle items={mockCredits} profileType="actor" />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Headshots & Gallery" index={2}>
        <GalleryWithToggle items={mockGallery} />
      </PortfolioSectionWrapper>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <PortfolioSectionWrapper title="Awards" index={3}>
          <AwardsWithToggle items={mockAwards} />
        </PortfolioSectionWrapper>
        <PortfolioSectionWrapper title="Press" index={4}>
          <PressWithToggle items={mockPress} />
        </PortfolioSectionWrapper>
      </div>
    </div>
    <div className="space-y-8">
      <PortfolioSectionWrapper title="Representation" index={5}>
        <RepresentationWithToggle items={mockRepresentation} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Training" index={6}>
        <EducationWithToggle items={mockEducation} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Special Skills" index={7}>
        <SkillsWithToggle items={mockSkills} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Testimonials" index={8}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
  </div>
);

const SpotlightLayout = () => {
  const theme = usePortfolioTheme();
  const [openSection, setOpenSection] = useState<string>("reels");

  const sections = [
    { key: "stats", title: "Physical Stats", content: <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} /> },
    { key: "reels", title: "Demo Reels", content: <DemoReelsWithToggle items={mockDemoReels} /> },
    { key: "credits", title: "Credits", content: <CreditsWithToggle items={mockCredits} profileType="actor" /> },
    { key: "gallery", title: "Headshots & Gallery", content: <GalleryWithToggle items={mockGallery} /> },
    { key: "awards", title: "Awards & Recognition", content: <AwardsWithToggle items={mockAwards} /> },
    { key: "testimonials", title: "Testimonials", content: <TestimonialsWithToggle items={mockTestimonials} /> },
    { key: "press", title: "Press & Reviews", content: <PressWithToggle items={mockPress} /> },
    { key: "training", title: "Training", content: <EducationWithToggle items={mockEducation} /> },
  ];

  return (
    <div className="space-y-2">
      {sections.map(s => {
        const isOpen = openSection === s.key;
        return (
          <GlassCard key={s.key} className="overflow-hidden">
            <button onClick={() => setOpenSection(isOpen ? "" : s.key)} className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors">
              <h3 className="text-base font-semibold" style={{ fontFamily: theme.fontDisplay, color: isOpen ? theme.accentPrimary : theme.textPrimary }}>{s.title}</h3>
              {isOpen ? <ChevronUp className="w-4 h-4" style={{ color: theme.textTertiary }} /> : <ChevronDown className="w-4 h-4" style={{ color: theme.textTertiary }} />}
            </button>
            <div className="overflow-hidden transition-all duration-500" style={{ maxHeight: isOpen ? '2000px' : '0', opacity: isOpen ? 1 : 0 }}>
              <div className="px-5 pb-5">{s.content}</div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};

const TimelineLayout = () => {
  const theme = usePortfolioTheme();
  const timelineItems = [
    { year: 2024, title: "The Vigil & SAG Nomination", content: <CreditsWithToggle items={mockCredits.filter(c => c.year >= 2024)} profileType="actor" /> },
    { year: 2023, title: "Ember & Breakthrough Awards", content: (
      <div className="space-y-4">
        <CreditsWithToggle items={mockCredits.filter(c => c.year === 2023)} profileType="actor" />
        <AwardsWithToggle items={mockAwards.filter(a => a.year === 2023)} />
      </div>
    )},
    { year: 2022, title: "Quiet Hours & Early Recognition", content: (
      <div className="space-y-4">
        <CreditsWithToggle items={mockCredits.filter(c => c.year === 2022)} profileType="actor" />
        <AwardsWithToggle items={mockAwards.filter(a => a.year === 2022)} />
      </div>
    )},
    { year: 2021, title: "Early Credits", content: <CreditsWithToggle items={mockCredits.filter(c => c.year <= 2021)} profileType="actor" /> },
  ];

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px" style={{ backgroundColor: theme.borderDefault }} />
      <div className="space-y-10">
        {timelineItems.map(item => (
          <div key={item.year} className="relative pl-12">
            <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full" style={{ backgroundColor: theme.accentPrimary, boxShadow: `0 0 8px ${theme.accentGlow}` }} />
            <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: theme.accentPrimary }}>{item.year}</span>
            <h3 className="text-lg font-semibold mt-1 mb-3" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{item.title}</h3>
            {item.content}
          </div>
        ))}
      </div>
      <div className="mt-12 pl-12 space-y-8">
        <PortfolioSectionWrapper title="Testimonials" index={5}>
          <TestimonialsWithToggle items={mockTestimonials} />
        </PortfolioSectionWrapper>
        <PortfolioSectionWrapper title="Press" index={6}>
          <PressWithToggle items={mockPress} />
        </PortfolioSectionWrapper>
        <ClientLogosWithToggle companies={mockClients} />
      </div>
    </div>
  );
};

const BentoLayout = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
    <div className="sm:col-span-2 lg:col-span-3">
      <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} />
    </div>
    <div className="sm:col-span-2">
      <PortfolioSectionWrapper title="Demo Reels" index={0}>
        <DemoReelsWithToggle items={mockDemoReels} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Representation" index={1}>
        <RepresentationWithToggle items={mockRepresentation} />
      </PortfolioSectionWrapper>
    </div>
    <div className="sm:col-span-2 lg:col-span-3">
      <PortfolioSectionWrapper title="Credits" index={2}>
        <CreditsWithToggle items={mockCredits} profileType="actor" />
      </PortfolioSectionWrapper>
    </div>
    <div className="sm:col-span-2">
      <PortfolioSectionWrapper title="Headshots & Gallery" index={3}>
        <GalleryWithToggle items={mockGallery} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Awards" index={4}>
        <AwardsWithToggle items={mockAwards} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Press" index={5}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
    </div>
    <div className="sm:col-span-2">
      <PortfolioSectionWrapper title="Testimonials" index={6}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
  </div>
);

const MinimalLayout = () => (
  <div className="max-w-2xl mx-auto space-y-16">
    <div>
      <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} />
    </div>
    <div>
      <PortfolioSectionWrapper title="Reels" index={0}>
        <DemoReelsWithToggle items={mockDemoReels} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Credits" index={1}>
        <CreditsWithToggle items={mockCredits} profileType="actor" />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Recognition" index={2}>
        <AwardsWithToggle items={mockAwards} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Words" index={3}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
  </div>
);

const DashboardLayoutComponent = () => {
  const theme = usePortfolioTheme();
  const statCards = [
    { icon: Eye, label: "Credits", value: mockCredits.length.toString(), sub: "Film & TV" },
    { icon: Award, label: "Awards", value: mockAwards.length.toString(), sub: "Nominations & wins" },
    { icon: FileText, label: "Reels", value: mockDemoReels.length.toString(), sub: "Demo reels" },
    { icon: TrendingUp, label: "Status", value: "Available", sub: "Pilot season" },
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {statCards.map(s => (
          <GlassCard key={s.label} className="p-4 text-center">
            <s.icon className="w-5 h-5 mx-auto mb-2" style={{ color: theme.accentPrimary }} />
            <p className="text-2xl font-bold tabular-nums" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{s.value}</p>
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: theme.textSecondary }}>{s.label}</p>
            <p className="text-[10px]" style={{ color: theme.textTertiary }}>{s.sub}</p>
          </GlassCard>
        ))}
      </div>
      <div className="mb-8">
        <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Demo Reels</h3>
          <DemoReelsWithToggle items={mockDemoReels} />
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Credits</h3>
          <CreditsWithToggle items={mockCredits} profileType="actor" />
        </GlassCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-4">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Awards</h3>
          <AwardsWithToggle items={mockAwards} />
        </GlassCard>
        <GlassCard className="p-4">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Press</h3>
          <PressWithToggle items={mockPress} />
        </GlassCard>
        <GlassCard className="p-4">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Testimonials</h3>
          <TestimonialsWithToggle items={mockTestimonials} />
        </GlassCard>
      </div>
    </>
  );
};

/* ══════════════════════ MAIN PAGE ══════════════════════ */

const LAYOUT_MAP: Record<LayoutPreset, React.ComponentType> = {
  classic: ClassicLayout,
  standard: StandardLayout,
  cinematic: CinematicLayout,
  compact: CompactLayout,
  magazine: MagazineLayout,
  spotlight: SpotlightLayout,
  timeline: TimelineLayout,
  bento: BentoLayout,
  minimal: MinimalLayout,
  dashboard: DashboardLayoutComponent,
};

const DemoActor = () => {
  const [themeId, setThemeId] = useState("cinematic-dark");
  const [layoutPreset, setLayoutPreset] = useState<LayoutPreset>("classic");
  const [variants, setVariants] = useState<SectionVariants>(actorDefaultVariants);

  const setVariant = <K extends keyof SectionVariants>(key: K, value: SectionVariants[K]) => {
    setVariants(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const url = getAllThemeFontsUrl();
    if (!url) return;
    const id = "demo-all-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id; link.rel = "stylesheet"; link.href = url;
    document.head.appendChild(link);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const dynamicProfile = {
    ...mockProfile,
    cta_label: CTA_LABELS[variants.ctaPreset] || mockProfile.cta_label,
  };

  const LayoutComponent = LAYOUT_MAP[layoutPreset];

  return (
    <SectionVariantsCtx.Provider value={{ variants, setVariant }}>
    <PortfolioThemeProvider themeId={themeId} className="min-h-screen relative">
      {/* Demo banner */}
      <div
        className="text-center py-1.5 text-[11px] font-medium relative z-20"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <span style={{ color: 'rgba(255,255,255,0.6)' }}>
          Demo portfolio —{" "}
          <Link to="/signup" className="underline font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>Create yours free →</Link>
        </span>
      </div>

      {/* Profile type tabs */}
      <DemoProfileTabs />

      {/* Hero */}
      <PortfolioHero
        profile={dynamicProfile}
        socialLinks={mockSocialLinks}
        representation={mockRepresentation}
        featuredProject={featuredProject}
        stats={{ scripts: 0, developing: 0, awards: mockAwards.length }}
        knownFor={mockKnownFor}
        heroLayout={variants.heroLayout}
        heroRightContent={variants.heroRightContent}
        heroKnownFor={variants.heroKnownFor}
        services={[]}
        testimonials={mockTestimonials}
        demoReels={mockDemoReels}
        imageAnimation={variants.imageAnimation}
        heroBgType={variants.heroBgType}
        knownForPosition={variants.knownForPosition}
      />

      {/* Hero & image customize bars */}
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 relative z-20 space-y-1">
        <WithToggle sectionKey="heroLayout" sectionName="Hero Layout">
          {() => null}
        </WithToggle>
        <WithToggle sectionKey="heroRightContent" sectionName="Hero Right">
          {() => null}
        </WithToggle>
        <WithToggle sectionKey="ctaPreset" sectionName="CTA Button">
          {() => null}
        </WithToggle>
        <WithToggle sectionKey="heroKnownFor" sectionName="Known For Style">
          {() => null}
        </WithToggle>
        <WithToggle sectionKey="imageAnimation" sectionName="Image Effects">
          {() => null}
        </WithToggle>
        <WithToggle sectionKey="heroBgType" sectionName="Background">
          {() => null}
        </WithToggle>
      </div>

      {/* Body */}
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <AmbientGlow />
        <LayoutComponent />
      </div>

      {/* Platform CTA */}
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="pt-12 text-center space-y-2">
          <div className="mx-auto w-16 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--portfolio-border-default), transparent)' }} />
          <p className="text-[13px] mt-6" style={{ color: 'var(--portfolio-text-secondary)' }}>
            Create your own actor portfolio
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-[13px] font-medium transition-all group"
            style={{ color: 'var(--portfolio-accent-primary)' }}
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <PortfolioFooter
        profile={{ ...mockProfile, subscription_tier: "free" }}
        showContact={true}
        socialLinks={mockSocialLinks}
      />

      <div id="tour-switchers" className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <span className="sr-only">Layout and theme switchers</span>
      </div>
      <LayoutSwitcher currentLayout={layoutPreset} onLayoutChange={setLayoutPreset} />
      <ThemeSwitcher currentThemeId={themeId} onThemeChange={setThemeId} />

      <MidScrollCTA />
    </PortfolioThemeProvider>
    </SectionVariantsCtx.Provider>
  );
};

export default DemoActor;
