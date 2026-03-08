import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PortfolioThemeProvider, usePortfolioTheme } from "@/themes/ThemeProvider";
import { getAllThemeFontsUrl } from "@/themes/themes";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioFooter from "@/components/portfolio/PortfolioFooter";
import PortfolioSectionWrapper from "@/components/portfolio/PortfolioSectionWrapper";
import ThemeSwitcher, { LayoutPreset } from "@/components/portfolio/ThemeSwitcher";
import SectionLoglineShowcase from "@/components/portfolio/sections/SectionLoglineShowcase";
import SectionScriptLibrary from "@/components/portfolio/sections/SectionScriptLibrary";
import SectionProjects from "@/components/portfolio/sections/SectionProjects";
import SectionAwards from "@/components/portfolio/sections/SectionAwards";
import SectionPress from "@/components/portfolio/sections/SectionPress";
import SectionTestimonials from "@/components/portfolio/sections/SectionTestimonials";
import SectionServices from "@/components/portfolio/sections/SectionServices";
import { ArrowRight } from "lucide-react";

/* ── mock data ── */
const mockProfile = {
  id: "demo-screenwriter",
  display_name: "Jordan Avery",
  first_name: "Jordan",
  last_name: "Avery",
  tagline: "Emmy-nominated screenwriter · Features & Limited Series",
  bio: "Two-time Emmy-nominated screenwriter with credits spanning premium cable and studio features. Known for grounded character work in high-concept settings. Currently developing an original limited series for a major streamer and an untitled feature with A24.\n\nPreviously staffed on critically acclaimed series at HBO and FX. Nicholl Fellowship finalist. Represented by CAA and Management 360.",
  location: "Los Angeles, CA",
  profile_photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  banner_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600&h=500&fit=crop",
  profile_type: "screenwriter",
  available_for_hire: true,
  seeking_representation: false,
  professional_status: "Seeking Representation",
  cta_label: "Read My Latest Script",
  cta_url: "#",
  cta_type: "custom_url",
  booking_url: null,
  show_contact_form: true,
};

const mockSocialLinks = [
  { id: "s1", platform: "imdb", label: "IMDb", url: "https://imdb.com", display_order: 1 },
  { id: "s2", platform: "x", label: "X / Twitter", url: "https://x.com", display_order: 2 },
  { id: "s3", platform: "instagram", label: "Instagram", url: "https://instagram.com", display_order: 3 },
  { id: "s4", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com", display_order: 4 },
];

const mockRepresentation = [
  { id: "r1", rep_type: "agent", company: "Creative Artists Agency (CAA)", name: "Michelle Torres", email: "mtorres@caa.com", phone: null, department: "Motion Picture Literary", market: "Los Angeles", is_primary: true, logo_url: null },
  { id: "r2", rep_type: "manager", company: "Management 360", name: "David Park", email: "dpark@management360.com", phone: null, department: "Literary", market: "Los Angeles", is_primary: false, logo_url: null },
];

const mockLoglines = [
  { id: "l1", title: "The Last Station", logline: "A disgraced NASA engineer discovers that the space station she helped build is receiving transmissions from a civilization that went extinct 10,000 years ago — and the messages are addressed to her.", genre: ["Sci-Fi", "Thriller", "Drama"], format: "Feature", page_count: 118, status: "Optioned", is_featured: true },
  { id: "l2", title: "Bloodlines", logline: "When a true-crime podcaster discovers that her birth mother was the unidentified accomplice in a notorious 1990s kidnapping, she must choose between breaking the story or protecting the family she never knew.", genre: ["Thriller", "Drama"], format: "Limited Series", page_count: null, status: "In Development" },
  { id: "l3", title: "Sundown Protocol", logline: "In a near-future Los Angeles where memories can be subpoenaed as evidence, a public defender fights to protect her client's right to forget — even as her own memories are being targeted.", genre: ["Sci-Fi", "Legal Drama"], format: "Pilot", page_count: 62, status: "Spec" },
];

const mockScripts = [
  { id: "sc1", title: "The Last Station", format: "Feature Screenplay", genre: ["Sci-Fi", "Thriller"], page_count: 118, year: 2024, logline: "A disgraced NASA engineer discovers transmissions from an extinct civilization — addressed to her.", coverage_excerpt: "\"Exceptional world-building with deeply human stakes.\" — Coverage Ink", access_level: "public", script_pdf_url: "#", status: "Optioned", project_type: "screenplay", is_featured: true },
  { id: "sc2", title: "Bloodlines", format: "Limited Series Bible + Pilot", genre: ["Thriller", "Drama"], page_count: 68, year: 2024, logline: null, coverage_excerpt: null, access_level: "gated", script_pdf_url: "#", status: "In Development", project_type: "pilot" },
  { id: "sc3", title: "Sundown Protocol", format: "Pilot Script", genre: ["Sci-Fi", "Legal Drama"], page_count: 62, year: 2023, logline: "In a world where memories can be subpoenaed, a public defender fights for the right to forget.", coverage_excerpt: null, access_level: "public", script_pdf_url: "#", status: "Spec", project_type: "pilot" },
  { id: "sc4", title: "Midnight Country", format: "Feature Screenplay", genre: ["Western", "Drama"], page_count: 105, year: 2022, logline: "A Comanche translator in 1870s Texas uncovers a conspiracy between the US Army and a railroad baron.", coverage_excerpt: "\"A fresh take on the revisionist western.\" — The Black List", access_level: "public", script_pdf_url: "#", status: "Nicholl Semifinalist", project_type: "screenplay" },
];

const mockCredits = [
  { id: "c1", title: "The Arrangement", project_type: "tv_show", year: 2023, poster_url: "https://image.tmdb.org/t/p/w500/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg", backdrop_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=500&fit=crop", genre: ["Drama", "Thriller"], logline: "An elite political fixer discovers the biggest threat to her client is the truth she's been hired to bury.", role_name: "Staff Writer", role_type: "Season 2", network_or_studio: "HBO", is_featured: true, imdb_link: "https://imdb.com", display_order: 1 },
  { id: "c2", title: "Glass Houses", project_type: "film", year: 2022, poster_url: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", genre: ["Drama"], logline: "A Silicon Valley whistleblower seeks refuge with estranged family in rural Oregon.", role_name: "Co-Writer", network_or_studio: "A24 / Plan B", is_featured: false, display_order: 2 },
  { id: "c3", title: "Borderline", project_type: "tv_show", year: 2021, poster_url: "https://image.tmdb.org/t/p/w500/6kbAMLteGO8yyewYau6bJ683sw7.jpg", genre: ["Crime", "Drama"], logline: "A DEA agent goes undercover on both sides of the US-Mexico border.", role_name: "Story Editor", role_type: "Season 1", network_or_studio: "FX", is_featured: false, display_order: 3 },
  { id: "c4", title: "Night Shift", project_type: "tv_show", year: 2020, poster_url: "https://image.tmdb.org/t/p/w500/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg", genre: ["Thriller"], logline: "An ER nurse discovers her hospital is at the center of a pharmaceutical conspiracy.", role_name: "Staff Writer", role_type: "Season 3", network_or_studio: "NBC", is_featured: false, display_order: 4 },
];

const mockAwards = [
  { id: "a1", name: "Nicholl Fellowship", category: "Semifinalist", organization: "Academy of Motion Picture Arts & Sciences", year: 2023, result: "Semifinalist" },
  { id: "a2", name: "Austin Film Festival", category: "Second Rounder — Drama", organization: "Austin Film Festival", year: 2023, result: "Winner" },
  { id: "a3", name: "Emmy Nomination", category: "Outstanding Writing for a Drama Series", organization: "Television Academy", year: 2023, result: "Nominated" },
  { id: "a4", name: "Emmy Nomination", category: "Outstanding Writing for a Limited Series", organization: "Television Academy", year: 2022, result: "Nominated" },
  { id: "a5", name: "PAGE International", category: "Gold Prize — TV Pilot", organization: "PAGE Awards", year: 2021, result: "Gold" },
  { id: "a6", name: "The Black List", category: "Annual List", organization: "The Black List", year: 2021, result: "Featured" },
];

const mockPress = [
  { id: "p1", title: "Jordan Avery on Writing the New Wave of Sci-Fi TV", publication: "Deadline", date: "March 2024", pull_quote: "I'm interested in the stories we tell ourselves to survive — and what happens when those stories stop working.", article_url: "#", press_type: "interview", star_rating: null },
  { id: "p2", title: "'The Arrangement' Season 2: How the Writers Room Reinvented the Political Thriller", publication: "Variety", date: "January 2024", pull_quote: null, article_url: "#", press_type: "feature", star_rating: null },
  { id: "p3", title: "Review: 'Glass Houses' Is a Quietly Devastating Portrait of American Ambition", publication: "IndieWire", date: "September 2022", pull_quote: "Avery's screenplay finds poetry in the mundane and menace in the manicured.", article_url: "#", press_type: "review", star_rating: 4 },
];

const mockTestimonials = [
  { id: "t1", quote: "Jordan is the rare writer who can hold a massive mythology in their head while writing the most intimate, human scenes. Every draft is better than the last.", author_name: "Sarah Chen", author_role: "Executive Producer", author_company: "HBO", author_photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { id: "t2", quote: "One of the most original voices in the room. Jordan brought a specificity to the world-building that elevated the entire show.", author_name: "Marcus Rivera", author_role: "Showrunner", author_company: "FX Networks", author_photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { id: "t3", quote: "I've read hundreds of sci-fi specs. Jordan's 'The Last Station' is in a different category entirely — grounded, surprising, and emotionally devastating.", author_name: "David Park", author_role: "Literary Manager", author_company: "Management 360", author_photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
];

const mockServices = [
  { id: "sv1", name: "Feature Script Polish", description: "Full dialogue and structural polish pass on feature-length screenplays.", starting_price: "$5,000", deliverables: ["Full script polish", "10-page notes document", "One revision pass", "Follow-up call"], turnaround: "3-4 weeks", is_featured: true },
  { id: "sv2", name: "Pilot Script Consultation", description: "In-depth creative consultation on pilot scripts with focus on voice, structure, and marketability.", starting_price: "$2,500", deliverables: ["Written evaluation", "60-min video call", "Market positioning notes"], turnaround: "2 weeks", is_featured: false },
];

const featuredProject = mockCredits[0];

/* ── Ambient Background Glow ── */
const AmbientGlow = () => {
  const theme = usePortfolioTheme();
  const isDark = theme.bgPrimary.startsWith('#0') || theme.bgPrimary.startsWith('#1') || theme.bgPrimary.startsWith('#2');
  if (!isDark) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div
        className="absolute w-[60vw] h-[40vh] rounded-full"
        style={{
          top: '20%',
          left: '10%',
          background: `radial-gradient(circle, ${theme.accentPrimary}08 0%, transparent 70%)`,
          filter: 'blur(80px)',
          animation: 'ambient-drift 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[50vw] h-[35vh] rounded-full"
        style={{
          bottom: '10%',
          right: '5%',
          background: `radial-gradient(circle, ${theme.accentPrimary}05 0%, transparent 70%)`,
          filter: 'blur(100px)',
          animation: 'ambient-drift 24s ease-in-out infinite reverse',
        }}
      />
    </div>
  );
};

/* ── Layout renderers ── */

const StandardLayout = () => {
  const theme = usePortfolioTheme();
  return (
    <>
      {/* Row 1: Loglines (main) + Services (sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-10">
        <PortfolioSectionWrapper title="Original Work" index={0}>
          <SectionLoglineShowcase items={mockLoglines} />
        </PortfolioSectionWrapper>
        <PortfolioSectionWrapper title="Services" index={1}>
          <SectionServices items={mockServices} compact />
        </PortfolioSectionWrapper>
      </div>

      {/* Row 2: Script Library full width */}
      <div className="mb-10">
        <PortfolioSectionWrapper title="Script Library" index={2}>
          <SectionScriptLibrary items={mockScripts} />
        </PortfolioSectionWrapper>
      </div>

      {/* Row 3: Credits (poster) + Testimonials (sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mb-10">
        <PortfolioSectionWrapper title="Produced Credits" index={3}>
          <SectionProjects items={mockCredits} profileType="screenwriter" layout="poster" />
        </PortfolioSectionWrapper>
        <PortfolioSectionWrapper title="Testimonials" index={4}>
          <SectionTestimonials items={mockTestimonials} />
        </PortfolioSectionWrapper>
      </div>

      {/* Row 4: Awards + Press side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioSectionWrapper title="Awards & Recognition" index={5}>
          <SectionAwards items={mockAwards} />
        </PortfolioSectionWrapper>
        <PortfolioSectionWrapper title="Press & Reviews" index={6}>
          <SectionPress items={mockPress} />
        </PortfolioSectionWrapper>
      </div>
    </>
  );
};

const CinematicLayout = () => (
  <>
    {/* Full-width loglines */}
    <div className="mb-12">
      <PortfolioSectionWrapper title="Original Work" index={0}>
        <SectionLoglineShowcase items={mockLoglines} />
      </PortfolioSectionWrapper>
    </div>

    {/* Full-width poster credits */}
    <div className="mb-12">
      <PortfolioSectionWrapper title="Produced Credits" index={1}>
        <SectionProjects items={mockCredits} profileType="screenwriter" layout="poster" />
      </PortfolioSectionWrapper>
    </div>

    {/* Full-width script library */}
    <div className="mb-12">
      <PortfolioSectionWrapper title="Script Library" index={2}>
        <SectionScriptLibrary items={mockScripts} />
      </PortfolioSectionWrapper>
    </div>

    {/* Testimonials full width */}
    <div className="mb-12">
      <PortfolioSectionWrapper title="Testimonials" index={3}>
        <SectionTestimonials items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>

    {/* Awards + Press + Services in row */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <PortfolioSectionWrapper title="Awards & Recognition" index={4}>
        <SectionAwards items={mockAwards} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Press & Reviews" index={5}>
        <SectionPress items={mockPress} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Services" index={6}>
        <SectionServices items={mockServices} compact />
      </PortfolioSectionWrapper>
    </div>
  </>
);

const CompactLayout = () => (
  <>
    {/* Row 1: Loglines + Services */}
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4 mb-6">
      <PortfolioSectionWrapper title="Original Work" index={0}>
        <SectionLoglineShowcase items={mockLoglines} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Services" index={1}>
        <SectionServices items={mockServices} compact />
      </PortfolioSectionWrapper>
    </div>

    {/* Row 2: Script Library + Credits table side by side */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <PortfolioSectionWrapper title="Script Library" index={2}>
        <SectionScriptLibrary items={mockScripts} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Produced Credits" index={3}>
        <SectionProjects items={mockCredits} profileType="screenwriter" layout="table" />
      </PortfolioSectionWrapper>
    </div>

    {/* Row 3: Awards + Press + Testimonials */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <PortfolioSectionWrapper title="Awards" index={4}>
        <SectionAwards items={mockAwards} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Press" index={5}>
        <SectionPress items={mockPress} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Testimonials" index={6}>
        <SectionTestimonials items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
  </>
);

const MagazineLayout = () => (
  <>
    {/* Two-column editorial: main content left, sidebar right */}
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      {/* Main column */}
      <div className="space-y-10">
        <PortfolioSectionWrapper title="Original Work" index={0}>
          <SectionLoglineShowcase items={mockLoglines} />
        </PortfolioSectionWrapper>

        <PortfolioSectionWrapper title="Produced Credits" index={1}>
          <SectionProjects items={mockCredits} profileType="screenwriter" layout="poster" />
        </PortfolioSectionWrapper>

        <PortfolioSectionWrapper title="Script Library" index={2}>
          <SectionScriptLibrary items={mockScripts} />
        </PortfolioSectionWrapper>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <PortfolioSectionWrapper title="Awards & Recognition" index={4}>
            <SectionAwards items={mockAwards} />
          </PortfolioSectionWrapper>
          <PortfolioSectionWrapper title="Press & Reviews" index={5}>
            <SectionPress items={mockPress} />
          </PortfolioSectionWrapper>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-8">
        <PortfolioSectionWrapper title="Services" index={3}>
          <SectionServices items={mockServices} compact />
        </PortfolioSectionWrapper>

        <PortfolioSectionWrapper title="Testimonials" index={6}>
          <SectionTestimonials items={mockTestimonials} />
        </PortfolioSectionWrapper>
      </div>
    </div>
  </>
);

const DemoScreenwriter = () => {
  const [themeId, setThemeId] = useState("cinematic-dark");
  const [layoutPreset, setLayoutPreset] = useState<LayoutPreset>("standard");

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

  return (
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

      {/* Hero */}
      <PortfolioHero
        profile={mockProfile}
        socialLinks={mockSocialLinks}
        representation={mockRepresentation}
        featuredProject={featuredProject}
        stats={stats}
      />

      {/* Body */}
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <AmbientGlow />

        {layoutPreset === 'standard' && <StandardLayout />}
        {layoutPreset === 'cinematic' && <CinematicLayout />}
        {layoutPreset === 'compact' && <CompactLayout />}
        {layoutPreset === 'magazine' && <MagazineLayout />}
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

      {/* Theme & Layout Switcher */}
      <ThemeSwitcher
        currentThemeId={themeId}
        onThemeChange={setThemeId}
        currentLayout={layoutPreset}
        onLayoutChange={setLayoutPreset}
      />
    </PortfolioThemeProvider>
  );
};

export default DemoScreenwriter;
