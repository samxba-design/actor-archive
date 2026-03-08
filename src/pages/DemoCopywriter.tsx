import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PortfolioThemeProvider, usePortfolioTheme } from "@/themes/ThemeProvider";
import { getAllThemeFontsUrl } from "@/themes/themes";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioFooter from "@/components/portfolio/PortfolioFooter";
import PortfolioSectionWrapper from "@/components/portfolio/PortfolioSectionWrapper";
import ThemeSwitcher from "@/components/portfolio/ThemeSwitcher";
import LayoutSwitcher, { type LayoutPreset } from "@/components/portfolio/LayoutSwitcher";
import SectionResultsWall from "@/components/portfolio/sections/SectionResultsWall";
import GlassCard from "@/components/portfolio/GlassCard";
import DemoProfileTabs from "@/components/demo/DemoProfileTabs";
import { ArrowRight, ChevronDown, ChevronUp, TrendingUp, Eye, FileText, Award, BookOpen } from "lucide-react";
import {
  SectionVariantsCtx, defaultVariants,
  type SectionVariants, WithToggle,
  KnownForWithToggle, CreditsWithToggle, AwardsWithToggle,
  TestimonialsWithToggle, PressWithToggle, ServicesWithToggle,
  ClientLogosWithToggle, EducationWithToggle, SkillsWithToggle,
  CaseStudiesWithToggle,
  AmbientGlow, MidScrollCTA, CTA_LABELS,
  PublishedWorkWithToggle,
} from "@/components/demo/DemoShared";
import {
  mockProfile, mockSocialLinks, mockCaseStudies, mockServices,
  mockTestimonials, mockClients, mockSkills, mockAwards, mockPress,
  mockEducation, mockKnownFor, featuredProject, mockPublishedWork,
} from "@/data/demoCopywriterData";

/* ══════════════════════ COPYWRITER-SPECIFIC DEFAULTS ══════════════════════ */

const copywriterDefaultVariants: SectionVariants = {
  ...defaultVariants,
  caseStudies: 'magazine',
  credits: 'grid',
  services: 'pricing',
  heroLayout: 'classic',
  heroRightContent: 'services',
  ctaPreset: 'book',
  heroKnownFor: 'strip',
  clientLogos: 'marquee',
  testimonials: 'carousel',
};

/* ══════════════════════ LAYOUT COMPONENTS ══════════════════════ */

const ClassicLayout = () => (
  <>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Results" index={-1}>
        <SectionResultsWall items={mockCaseStudies} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Case Studies" index={0}>
        <CaseStudiesWithToggle items={mockCaseStudies} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Clients" index={1}>
        <ClientLogosWithToggle companies={mockClients} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Services & Pricing" index={2}>
        <ServicesWithToggle items={mockServices} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Testimonials" index={3}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Awards" index={4}>
        <AwardsWithToggle items={mockAwards} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Press & Features" index={5}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Skills & Expertise" index={6}>
        <SkillsWithToggle items={mockSkills} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Education & Certifications" index={7}>
        <EducationWithToggle items={mockEducation} />
      </PortfolioSectionWrapper>
    </div>
  </>
);

const StandardLayout = () => (
  <>
    <div className="mb-10">
      <ClientLogosWithToggle companies={mockClients} />
    </div>
    <div className="mb-10">
      <SectionResultsWall items={mockCaseStudies} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-10">
      <PortfolioSectionWrapper title="Case Studies" index={0}>
        <CaseStudiesWithToggle items={mockCaseStudies} />
      </PortfolioSectionWrapper>
      <div className="space-y-6">
        <PortfolioSectionWrapper title="Skills" index={1}>
          <SkillsWithToggle items={mockSkills} />
        </PortfolioSectionWrapper>
        <PortfolioSectionWrapper title="Education" index={2}>
          <EducationWithToggle items={mockEducation} />
        </PortfolioSectionWrapper>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mb-10">
      <PortfolioSectionWrapper title="Services" index={3}>
        <ServicesWithToggle items={mockServices} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Testimonials" index={4}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PortfolioSectionWrapper title="Awards" index={5}>
        <AwardsWithToggle items={mockAwards} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Press" index={6}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
    </div>
  </>
);

const CinematicLayout = () => (
  <>
    <div className="mb-12">
      <SectionResultsWall items={mockCaseStudies} />
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Known For" index={-1}>
        <KnownForWithToggle items={mockKnownFor} display="image" />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Case Studies" index={0}>
        <CaseStudiesWithToggle items={mockCaseStudies} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Services" index={1}>
        <ServicesWithToggle items={mockServices} />
      </PortfolioSectionWrapper>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <PortfolioSectionWrapper title="Awards" index={2}>
        <AwardsWithToggle items={mockAwards} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Press" index={3}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Testimonials" index={4}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
  </>
);

const CompactLayout = () => (
  <>
    <div className="mb-8">
      <SectionResultsWall items={mockCaseStudies} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <PortfolioSectionWrapper title="Case Studies" index={0}>
        <CaseStudiesWithToggle items={mockCaseStudies} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Services" index={1}>
        <ServicesWithToggle items={mockServices} />
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
      <PortfolioSectionWrapper title="Testimonials" index={4}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
  </>
);

const MagazineLayout = () => (
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
    <div className="space-y-10">
      <SectionResultsWall items={mockCaseStudies} />
      <PortfolioSectionWrapper title="Case Studies" index={0}>
        <CaseStudiesWithToggle items={mockCaseStudies} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Services" index={1}>
        <ServicesWithToggle items={mockServices} />
      </PortfolioSectionWrapper>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <PortfolioSectionWrapper title="Awards" index={2}>
          <AwardsWithToggle items={mockAwards} />
        </PortfolioSectionWrapper>
        <PortfolioSectionWrapper title="Press" index={3}>
          <PressWithToggle items={mockPress} />
        </PortfolioSectionWrapper>
      </div>
    </div>
    <div className="space-y-8">
      <PortfolioSectionWrapper title="Clients" index={4}>
        <ClientLogosWithToggle companies={mockClients} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Testimonials" index={5}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Skills" index={6}>
        <SkillsWithToggle items={mockSkills} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Education" index={7}>
        <EducationWithToggle items={mockEducation} />
      </PortfolioSectionWrapper>
    </div>
  </div>
);

const SpotlightLayout = () => {
  const theme = usePortfolioTheme();
  const [openSection, setOpenSection] = useState<string>("cases");

  const sections = [
    { key: "results", title: "Results at a Glance", content: <SectionResultsWall items={mockCaseStudies} /> },
    { key: "cases", title: "Case Studies", content: <CaseStudiesWithToggle items={mockCaseStudies} /> },
    { key: "services", title: "Services & Pricing", content: <ServicesWithToggle items={mockServices} /> },
    { key: "testimonials", title: "Testimonials", content: <TestimonialsWithToggle items={mockTestimonials} /> },
    { key: "awards", title: "Awards", content: <AwardsWithToggle items={mockAwards} /> },
    { key: "press", title: "Press & Features", content: <PressWithToggle items={mockPress} /> },
    { key: "skills", title: "Skills & Expertise", content: <SkillsWithToggle items={mockSkills} /> },
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
    { year: 2024, title: "Finova & Bloom & Birch", content: <CaseStudiesWithToggle items={mockCaseStudies.filter(c => c.year === 2024)} /> },
    { year: 2023, title: "Meridian Health & Torque Fitness", content: <CaseStudiesWithToggle items={mockCaseStudies.filter(c => c.year === 2023)} /> },
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
      <SectionResultsWall items={mockCaseStudies} />
    </div>
    <div className="sm:col-span-2">
      <PortfolioSectionWrapper title="Case Studies" index={0}>
        <CaseStudiesWithToggle items={mockCaseStudies} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Clients" index={1}>
        <ClientLogosWithToggle companies={mockClients} />
      </PortfolioSectionWrapper>
    </div>
    <div className="sm:col-span-2 lg:col-span-3">
      <PortfolioSectionWrapper title="Services" index={2}>
        <ServicesWithToggle items={mockServices} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Awards" index={3}>
        <AwardsWithToggle items={mockAwards} />
      </PortfolioSectionWrapper>
    </div>
    <div className="sm:col-span-2">
      <PortfolioSectionWrapper title="Testimonials" index={4}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Press" index={5}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
    </div>
    <div className="sm:col-span-2">
      <PortfolioSectionWrapper title="Skills" index={6}>
        <SkillsWithToggle items={mockSkills} />
      </PortfolioSectionWrapper>
    </div>
  </div>
);

const MinimalLayout = () => (
  <div className="max-w-2xl mx-auto space-y-16">
    <div>
      <SectionResultsWall items={mockCaseStudies} />
    </div>
    <div>
      <PortfolioSectionWrapper title="Work" index={0}>
        <CaseStudiesWithToggle items={mockCaseStudies} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Services" index={1}>
        <ServicesWithToggle items={mockServices} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Words" index={2}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
  </div>
);

const DashboardLayoutComponent = () => {
  const theme = usePortfolioTheme();
  const statCards = [
    { icon: TrendingUp, label: "Revenue", value: "$12M+", sub: "Attributed revenue" },
    { icon: FileText, label: "Projects", value: mockCaseStudies.length.toString(), sub: "Case studies" },
    { icon: Award, label: "Awards", value: mockAwards.length.toString(), sub: "Industry recognition" },
    { icon: Eye, label: "Clients", value: "60+", sub: "Companies served" },
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Case Studies</h3>
          <CaseStudiesWithToggle items={mockCaseStudies} />
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Services</h3>
          <ServicesWithToggle items={mockServices} />
        </GlassCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mb-8">
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Clients</h3>
          <ClientLogosWithToggle companies={mockClients} />
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Testimonials</h3>
          <TestimonialsWithToggle items={mockTestimonials} />
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
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Skills</h3>
          <SkillsWithToggle items={mockSkills} />
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

const DemoCopywriter = () => {
  const [themeId, setThemeId] = useState("cinematic-dark");
  const [layoutPreset, setLayoutPreset] = useState<LayoutPreset>("classic");
  const [variants, setVariants] = useState<SectionVariants>(copywriterDefaultVariants);

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
        representation={[]}
        featuredProject={featuredProject}
        stats={{ scripts: 0, developing: 0, awards: mockAwards.length }}
        knownFor={mockKnownFor}
        heroLayout={variants.heroLayout}
        heroRightContent={variants.heroRightContent}
        heroKnownFor={variants.heroKnownFor}
        services={mockServices}
        testimonials={mockTestimonials}
        imageAnimation={variants.imageAnimation}
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
            Create your own copywriter portfolio
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

export default DemoCopywriter;
