import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PortfolioThemeProvider, usePortfolioTheme } from "@/themes/ThemeProvider";
import { getAllThemeFontsUrl } from "@/themes/themes";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioFooter from "@/components/portfolio/PortfolioFooter";
import PortfolioSectionWrapper from "@/components/portfolio/PortfolioSectionWrapper";
import ThemeSwitcher from "@/components/portfolio/ThemeSwitcher";
import LayoutSwitcher, { type LayoutPreset } from "@/components/portfolio/LayoutSwitcher";
import SectionLoglineShowcase from "@/components/portfolio/sections/SectionLoglineShowcase";
import SectionProjects from "@/components/portfolio/sections/SectionProjects";
import SectionAwards from "@/components/portfolio/sections/SectionAwards";
import SectionServices from "@/components/portfolio/sections/SectionServices";
import GlassCard from "@/components/portfolio/GlassCard";
import DemoProfileTabs from "@/components/demo/DemoProfileTabs";
import DemoInteractiveLayout from "@/components/demo/DemoInteractiveLayout";
import DemoExplainer from "@/components/demo/DemoExplainer";
import DemoCustomizationPanel from "@/components/demo/DemoCustomizationPanel";
import PDFExportModal from "@/components/portfolio/PDFExportModal";
import { ArrowRight, ExternalLink, ChevronDown, ChevronUp, TrendingUp, Eye, FileText, Award } from "lucide-react";
import DemoStyleBanner from "@/components/demo/DemoStyleBanner";
import {
  SectionVariantsCtx, defaultVariants,
  type SectionVariants, WithToggle,
  KnownForWithToggle, LoglinesWithToggle, ScriptsWithToggle,
  CreditsWithToggle, AwardsWithToggle, TestimonialsWithToggle,
  PressWithToggle, ServicesWithToggle, ClientLogosWithToggle,
  EducationWithToggle, GalleryWithToggle, DemoReelsWithToggle,
  RepresentationWithToggle, SkillsWithToggle, EventsWithToggle,
  ProductionsWithToggle, AmbientGlow, MidScrollCTA, CreditHeroCard, CTA_LABELS,
  STOCK_HERO_IMAGES,
} from "@/components/demo/DemoShared";
import {
  mockProfile, mockSocialLinks, mockRepresentation, mockLoglines,
  mockScripts, mockCredits, mockAwards, mockPress, mockTestimonials,
  mockServices, featuredProject, mockKnownFor, mockClients,
  mockEducation, mockGallery, mockDemoReels, mockSkills, mockEvents,
  mockProductions,
} from "@/data/demoScreenwriterData";

/* Shared components now imported from DemoShared */

/* ══════════════════════ LAYOUT COMPONENTS ══════════════════════ */

/* 1. CLASSIC — Interactive drag-and-drop demo */
const ClassicLayout = () => {
  const demoSections = [
    { id: "clients", title: "Written For", content: <ClientLogosWithToggle companies={mockClients} /> },
    { id: "loglines", title: "Logline Showcase", content: <LoglinesWithToggle items={mockLoglines} /> },
    { id: "scripts", title: "Script Library", content: <ScriptsWithToggle items={mockScripts} /> },
    { id: "credits", title: "Produced Credits", content: <CreditsWithToggle items={mockCredits} /> },
    { id: "awards", title: "Awards & Recognition", content: <AwardsWithToggle items={mockAwards} /> },
    { id: "testimonials", title: "Testimonials", content: <TestimonialsWithToggle items={mockTestimonials} /> },
    { id: "press", title: "Press & Reviews", content: <PressWithToggle items={mockPress} /> },
    { id: "services", title: "Services", content: <ServicesWithToggle items={mockServices} /> },
    { id: "representation", title: "Representation", content: <RepresentationWithToggle items={mockRepresentation} /> },
    { id: "education", title: "Education & Training", content: <EducationWithToggle items={mockEducation} /> },
    { id: "skills", title: "Skills", content: <SkillsWithToggle items={mockSkills} /> },
    { id: "gallery", title: "Gallery", content: <GalleryWithToggle items={mockGallery} /> },
    { id: "demoreels", title: "Demo Reels", content: <DemoReelsWithToggle items={mockDemoReels} /> },
    { id: "events", title: "Events & Appearances", content: <EventsWithToggle items={mockEvents} /> },
    { id: "productions", title: "Production History", content: <ProductionsWithToggle items={mockProductions} /> },
  ];

  return <DemoInteractiveLayout sections={demoSections} />;
};

/* CreditHeroCard imported from DemoShared */

/* 2. STANDARD — Dense grid with sidebar modules */
const StandardLayout = () => (
  <>
    <div className="mb-10">
      <ClientLogosWithToggle companies={mockClients} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 mb-10">
      <PortfolioSectionWrapper title="Original Work" index={0}>
        <LoglinesWithToggle items={mockLoglines} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Services" index={1}>
        <SectionServices items={mockServices} variant="compact" />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Script Library" index={2}>
        <ScriptsWithToggle items={mockScripts} />
      </PortfolioSectionWrapper>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mb-10">
      <PortfolioSectionWrapper title="Produced Credits" index={3}>
        <CreditsWithToggle items={mockCredits} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Testimonials" index={4}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      <PortfolioSectionWrapper title="Awards & Recognition" index={5}>
        <AwardsWithToggle items={mockAwards} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Press & Reviews" index={6}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mb-10">
      <PortfolioSectionWrapper title="Gallery" index={7}>
        <GalleryWithToggle items={mockGallery} />
      </PortfolioSectionWrapper>
      <div className="space-y-6">
        <PortfolioSectionWrapper title="Skills" index={8}>
          <SkillsWithToggle items={mockSkills} />
        </PortfolioSectionWrapper>
        <PortfolioSectionWrapper title="Education" index={9}>
          <EducationWithToggle items={mockEducation} />
        </PortfolioSectionWrapper>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      <PortfolioSectionWrapper title="Demo Reels" index={10}>
        <DemoReelsWithToggle items={mockDemoReels} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Events" index={11}>
        <EventsWithToggle items={mockEvents} />
      </PortfolioSectionWrapper>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PortfolioSectionWrapper title="Representation" index={12}>
        <RepresentationWithToggle items={mockRepresentation} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Production History" index={13}>
        <ProductionsWithToggle items={mockProductions} />
      </PortfolioSectionWrapper>
    </div>
  </>
);

/* 3. CINEMATIC — Full-width hero, poster gallery */
const CinematicLayout = () => (
  <>
    <div className="mb-12">
      <ClientLogosWithToggle companies={mockClients} />
    </div>
    <div className="mb-12">
      <PortfolioSectionWrapper title="Original Work" index={0}>
        <LoglinesWithToggle items={mockLoglines} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-12">
      <PortfolioSectionWrapper title="Produced Credits" index={1}>
        <CreditsWithToggle items={mockCredits} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-12">
      <PortfolioSectionWrapper title="Script Library" index={2}>
        <ScriptsWithToggle items={mockScripts} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-12">
      <PortfolioSectionWrapper title="Testimonials" index={3}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
      <PortfolioSectionWrapper title="Awards" index={4}>
        <AwardsWithToggle items={mockAwards} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Press" index={5}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
    </div>
    <PortfolioSectionWrapper title="Services" index={6}>
      <ServicesWithToggle items={mockServices} />
    </PortfolioSectionWrapper>
  </>
);

/* 4. COMPACT — Maximum density, fixed spacing */
const CompactLayout = () => (
  <>
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mb-8">
      <PortfolioSectionWrapper title="Original Work" index={0}>
        <LoglinesWithToggle items={mockLoglines} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Services" index={1}>
        <SectionServices items={mockServices} variant="compact" />
      </PortfolioSectionWrapper>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <PortfolioSectionWrapper title="Script Library" index={2}>
        <ScriptsWithToggle items={mockScripts} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Produced Credits" index={3}>
        <CreditsWithToggle items={mockCredits} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-6">
      <ClientLogosWithToggle companies={mockClients} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <PortfolioSectionWrapper title="Awards" index={4}>
        <AwardsWithToggle items={mockAwards} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Press" index={5}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Testimonials" index={6}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
  </>
);

/* 5. MAGAZINE — Editorial two-column */
const MagazineLayout = () => (
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
    <div className="space-y-10">
      <PortfolioSectionWrapper title="Original Work" index={0}>
        <LoglinesWithToggle items={mockLoglines} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Produced Credits" index={1}>
        <CreditsWithToggle items={mockCredits} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Script Library" index={2}>
        <ScriptsWithToggle items={mockScripts} />
      </PortfolioSectionWrapper>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <PortfolioSectionWrapper title="Awards" index={4}>
          <AwardsWithToggle items={mockAwards} />
        </PortfolioSectionWrapper>
        <PortfolioSectionWrapper title="Press" index={5}>
          <PressWithToggle items={mockPress} />
        </PortfolioSectionWrapper>
      </div>
    </div>
    <div className="space-y-8">
      <PortfolioSectionWrapper title="Written For" index={7}>
        <ClientLogosWithToggle companies={mockClients} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Services" index={3}>
        <SectionServices items={mockServices} variant="compact" />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Testimonials" index={6}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
  </div>
);

/* 6. SPOTLIGHT — Accordion, one section expanded at a time */
const SpotlightLayout = () => {
  const theme = usePortfolioTheme();
  const [openSection, setOpenSection] = useState<string>("loglines");

  const sections = [
    { key: "clients", title: "Written For", content: <ClientLogosWithToggle companies={mockClients} /> },
    { key: "loglines", title: "Original Work", content: <LoglinesWithToggle items={mockLoglines} /> },
    { key: "scripts", title: "Script Library", content: <ScriptsWithToggle items={mockScripts} /> },
    { key: "credits", title: "Produced Credits", content: <CreditsWithToggle items={mockCredits} /> },
    { key: "awards", title: "Awards & Recognition", content: <AwardsWithToggle items={mockAwards} /> },
    { key: "testimonials", title: "Testimonials", content: <TestimonialsWithToggle items={mockTestimonials} /> },
    { key: "press", title: "Press & Reviews", content: <PressWithToggle items={mockPress} /> },
    { key: "services", title: "Services", content: <ServicesWithToggle items={mockServices} /> },
  ];

  return (
    <div className="space-y-2">
      {sections.map(s => {
        const isOpen = openSection === s.key;
        return (
          <GlassCard key={s.key} className="overflow-hidden">
            <button
              onClick={() => setOpenSection(isOpen ? "" : s.key)}
              className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
            >
              <h3 className="text-base font-semibold" style={{ fontFamily: theme.fontDisplay, color: isOpen ? theme.accentPrimary : theme.textPrimary }}>
                {s.title}
              </h3>
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

/* 7. TIMELINE — Chronological vertical with line */
const TimelineLayout = () => {
  const theme = usePortfolioTheme();

  const timelineItems = [
    { year: 2024, title: "Current Projects", content: <SectionLoglineShowcase items={mockLoglines.filter(l => l.status === "Optioned" || l.status === "In Development")} /> },
    { year: 2023, title: "Emmy Nominations & The Arrangement", content: <SectionProjects items={mockCredits.filter(c => c.year >= 2023)} profileType="screenwriter" layout="poster" /> },
    { year: 2022, title: "Glass Houses & Awards", content: (
      <div className="space-y-4">
        <SectionProjects items={mockCredits.filter(c => c.year === 2022)} profileType="screenwriter" layout="poster" />
        <SectionAwards items={mockAwards.filter(a => a.year === 2022)} />
      </div>
    )},
    { year: 2021, title: "Borderline & Rising Recognition", content: (
      <div className="space-y-4">
        <SectionProjects items={mockCredits.filter(c => c.year <= 2021)} profileType="screenwriter" layout="poster" />
        <SectionAwards items={mockAwards.filter(a => a.year === 2021)} />
      </div>
    )},
  ];

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px" style={{ backgroundColor: theme.borderDefault }} />
      <div className="space-y-10">
        {timelineItems.map((item) => (
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
        <PortfolioSectionWrapper title="Press & Reviews" index={6}>
          <PressWithToggle items={mockPress} />
        </PortfolioSectionWrapper>
        <ClientLogosWithToggle companies={mockClients} />
      </div>
    </div>
  );
};

/* 8. BENTO — Asymmetric masonry-like grid */
const BentoLayout = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
    <div className="sm:col-span-2 lg:col-span-3">
      <PortfolioSectionWrapper title="Written For" index={7}>
        <ClientLogosWithToggle companies={mockClients} />
      </PortfolioSectionWrapper>
    </div>
    <div className="sm:col-span-2 lg:col-span-2">
      <PortfolioSectionWrapper title="Original Work" index={0}>
        <LoglinesWithToggle items={mockLoglines} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Services" index={1}>
        <SectionServices items={mockServices} variant="compact" />
      </PortfolioSectionWrapper>
    </div>
    <div className="sm:col-span-2 lg:col-span-3">
      <PortfolioSectionWrapper title="Produced Credits" index={2}>
        <CreditsWithToggle items={mockCredits} />
      </PortfolioSectionWrapper>
    </div>
    <div className="sm:col-span-2">
      <PortfolioSectionWrapper title="Script Library" index={3}>
        <ScriptsWithToggle items={mockScripts} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Testimonials" index={4}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Awards" index={5}>
        <AwardsWithToggle items={mockAwards} />
      </PortfolioSectionWrapper>
    </div>
    <div className="sm:col-span-2">
      <PortfolioSectionWrapper title="Press & Reviews" index={6}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
    </div>
  </div>
);

/* 9. MINIMAL — Maximum whitespace, essentials only */
const MinimalLayout = () => (
  <div className="max-w-2xl mx-auto space-y-16">
    <div>
      <PortfolioSectionWrapper title="Written For" index={-1}>
        <ClientLogosWithToggle companies={mockClients} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Work" index={0}>
        <LoglinesWithToggle items={mockLoglines} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Credits" index={1}>
        <CreditsWithToggle items={mockCredits} />
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

/* 10. DASHBOARD — Stats-forward, data cards */
const DashboardLayout = () => {
  const theme = usePortfolioTheme();

  const statCards = [
    { icon: FileText, label: "Scripts", value: mockScripts.length.toString(), sub: "Available to read" },
    { icon: Eye, label: "Credits", value: mockCredits.length.toString(), sub: "Produced works" },
    { icon: Award, label: "Awards", value: mockAwards.length.toString(), sub: "Industry recognition" },
    { icon: TrendingUp, label: "Status", value: mockLoglines.filter(l => l.status === "In Development").length.toString(), sub: "In development" },
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
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Written For</h3>
          <ClientLogosWithToggle companies={mockClients} />
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Services</h3>
          <SectionServices items={mockServices} variant="compact" />
        </GlassCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Active Projects</h3>
          <LoglinesWithToggle items={mockLoglines} />
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Script Library</h3>
          <ScriptsWithToggle items={mockScripts} />
        </GlassCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mb-8">
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Produced Credits</h3>
          <CreditsWithToggle items={mockCredits} />
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
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Education</h3>
          <EducationWithToggle items={mockEducation} />
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
  dashboard: DashboardLayout,
};

const DemoScreenwriter = () => {
  const [themeId, setThemeId] = useState("creative-rose");
  const [layoutPreset, setLayoutPreset] = useState<LayoutPreset>("classic");
  const [variants, setVariants] = useState<SectionVariants>(defaultVariants);
  const [showPDFModal, setShowPDFModal] = useState(false);

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

  const stats = {
    scripts: mockScripts.length,
    developing: mockScripts.filter(s => s.status === "In Development").length,
    awards: mockAwards.length,
  };

  const CTA_LABELS_LOCAL: Record<string, string> = {
    script: 'Read My Latest Script',
    hire: 'Hire Me',
    contact: 'Get in Touch',
    reel: 'Watch My Reel',
    book: 'Book a Consultation',
    custom: 'View My Work',
  };

  const dynamicProfile = {
    ...mockProfile,
    cta_label: CTA_LABELS_LOCAL[variants.ctaPreset] || mockProfile.cta_label,
    status_badge_color: variants.statusBadgeColor,
    status_badge_animation: variants.statusBadgeAnimation,
  };

  const LayoutComponent = LAYOUT_MAP[layoutPreset];

  return (
    <SectionVariantsCtx.Provider value={{ variants, setVariant }}>
    <PortfolioThemeProvider themeId={themeId} className="min-h-screen relative" ctaStyleOverride={variants.ctaStyle}>
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
        stats={stats}
        knownFor={mockKnownFor}
        heroLayout={variants.heroLayout}
        heroRightContent={variants.heroRightContent}
        heroKnownFor={variants.heroKnownFor}
        services={mockServices}
        testimonials={mockTestimonials}
        imageAnimation={variants.imageAnimation}
        heroBgType={variants.heroBgType}
        heroBgImageUrl={variants.heroBgType === 'image' ? (STOCK_HERO_IMAGES.find(i => i.key === variants.heroBgImage)?.url || '') : undefined}
        knownForPosition={variants.knownForPosition}
      />

      {/* Consolidated customization panel */}
      <DemoCustomizationPanel
        showCustomization={variants.showCustomization}
        onToggleCustomization={() => setVariant('showCustomization', !variants.showCustomization)}
        onExportPDF={() => setShowPDFModal(true)}
        knownForLabel="Known For"
      />

      {/* Client logos at below_hero position */}
      {variants.clientLogosPosition === 'below_hero' && (
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
          <ClientLogosWithToggle companies={mockClients} />
        </div>
      )}

      {/* Body */}
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <AmbientGlow />

        {/* Client logos at above_sections position */}
        {variants.clientLogosPosition === 'above_sections' && (
          <div className="mb-10">
            <ClientLogosWithToggle companies={mockClients} />
          </div>
        )}

        {(variants.knownForPosition === 'below_hero' || variants.knownForPosition === 'body_section') && mockKnownFor.length > 0 && (
          <div className="mb-10">
            <PortfolioSectionWrapper title="Known For" index={-1}>
              <KnownForWithToggle items={mockKnownFor} />
            </PortfolioSectionWrapper>
          </div>
        )}
        <LayoutComponent />
      </div>

      {/* Discreet platform CTA */}
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="pt-12 text-center space-y-2">
          <div className="mx-auto w-16 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--portfolio-border-default), transparent)' }} />
          <p className="text-[13px] mt-6" style={{ color: 'var(--portfolio-text-secondary)' }}>
            Create your own screenwriter portfolio
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

      {/* Separate switchers: Layout (left) + Theme (right) */}
      <div id="tour-switchers" className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <span className="sr-only">Layout and theme switchers</span>
      </div>
      <LayoutSwitcher currentLayout={layoutPreset} onLayoutChange={setLayoutPreset} />
      <ThemeSwitcher currentThemeId={themeId} onThemeChange={setThemeId} />

      {/* Mid-scroll CTA */}
      <MidScrollCTA />

      {/* Demo style shortcut */}
      <DemoStyleBanner theme={themeId} layoutPreset={layoutPreset} />

      {/* Demo Explainer */}
      <DemoExplainer />

      {/* PDF Export Modal */}
      {showPDFModal && (
        <PDFExportModal
          profile={dynamicProfile}
          projects={mockCredits}
          awards={mockAwards}
          skills={mockSkills}
          education={mockEducation}
          isPro={true}
          onClose={() => setShowPDFModal(false)}
        />
      )}
    </PortfolioThemeProvider>
    </SectionVariantsCtx.Provider>
  );
};

export default DemoScreenwriter;
