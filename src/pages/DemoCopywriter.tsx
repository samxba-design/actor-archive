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
import { ArrowRight, ChevronDown, ChevronUp, TrendingUp, Eye, FileText, Award } from "lucide-react";
import {
  SectionVariantsCtx, defaultVariants,
  type SectionVariants, WithToggle,
  KnownForWithToggle, CreditsWithToggle, AwardsWithToggle,
  TestimonialsWithToggle, PressWithToggle, ServicesWithToggle,
  ClientLogosWithToggle, EducationWithToggle, SkillsWithToggle,
  CaseStudiesWithToggle,
  AmbientGlow, MidScrollCTA, CTA_LABELS,
} from "@/components/demo/DemoShared";

/* ══════════════════════ COPYWRITER MOCK DATA ══════════════════════ */

const mockProfile = {
  id: "demo-copywriter",
  display_name: "Priya Sharma",
  first_name: "Priya",
  last_name: "Sharma",
  tagline: "Brand Strategist & Conversion Copywriter · B2B SaaS · DTC",
  bio: "I help ambitious brands find their voice and turn it into revenue. Over the past 8 years, I've written for 60+ companies — from Y Combinator startups to Fortune 500 brands — across landing pages, email sequences, ad campaigns, and brand messaging.\n\nMy work has generated over $12M in attributable revenue. I combine direct-response technique with brand-level craft, because copy that converts shouldn't sound like it was written by a robot.",
  location: "Brooklyn, NY",
  profile_photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
  banner_url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600&h=500&fit=crop",
  profile_type: "copywriter",
  available_for_hire: true,
  seeking_representation: false,
  cta_label: "Get a Quote",
  cta_url: "#",
  cta_type: "custom_url",
  booking_url: null,
  show_contact_form: true,
};

const mockSocialLinks = [
  { id: "s1", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com", display_order: 1 },
  { id: "s2", platform: "x", label: "X / Twitter", url: "https://x.com", display_order: 2 },
  { id: "s3", platform: "website", label: "Blog", url: "https://blog.example.com", display_order: 3 },
  { id: "s4", platform: "substack", label: "Newsletter", url: "https://substack.com", display_order: 4 },
];

const mockCaseStudies = [
  {
    id: "cs1", title: "Finova Landing Page Overhaul", client: "Finova", project_type: "case_study",
    challenge: "Finova's landing page had a 1.2% conversion rate and high bounce — visitors didn't understand the product value within 5 seconds.",
    solution: "Rewrote the hero, restructured the page around customer pain points, added social proof blocks, and created urgency with a limited beta CTA.",
    results: "Conversion rate jumped from 1.2% to 4.8% in 6 weeks. CAC dropped 34%.",
    metric_callouts: [{ value: "4.8%", label: "Conv. Rate" }, { value: "-34%", label: "CAC" }, { value: "$1.2M", label: "Pipeline" }],
    tags: ["SaaS", "Landing Page", "B2B"], is_featured: true, year: 2024,
    poster_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
  {
    id: "cs2", title: "Bloom & Birch Email Sequence", client: "Bloom & Birch", project_type: "case_study",
    challenge: "The DTC skincare brand's welcome sequence had a 12% open rate and almost zero revenue attribution.",
    solution: "Designed a 7-email welcome flow with storytelling, social proof, and progressive offers. A/B tested subject lines and CTA placement.",
    results: "Open rate increased to 48%. Welcome flow now generates $180K/year in attributed revenue.",
    metric_callouts: [{ value: "48%", label: "Open Rate" }, { value: "$180K", label: "Annual Rev" }, { value: "4x", label: "Click Rate" }],
    tags: ["DTC", "Email", "Ecommerce"], is_featured: true, year: 2024,
    poster_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  },
  {
    id: "cs3", title: "Meridian Health Brand Voice", client: "Meridian Health", project_type: "case_study",
    challenge: "Meridian's messaging felt clinical and generic — indistinguishable from competitors in the crowded telehealth space.",
    solution: "Developed a comprehensive brand voice guide, tagline system, and rewrote all patient-facing copy across web, app, and marketing materials.",
    results: "Brand recall increased 62% in post-campaign surveys. NPS improved by 18 points.",
    metric_callouts: [{ value: "+62%", label: "Brand Recall" }, { value: "+18", label: "NPS" }, { value: "40+", label: "Pages" }],
    tags: ["Healthcare", "Brand Voice", "UX Copy"], is_featured: false, year: 2023,
  },
  {
    id: "cs4", title: "Torque Fitness Meta Ad Campaign", client: "Torque Fitness", project_type: "case_study",
    challenge: "Paid social ROAS was below 2x. Ad creative was product-focused with no emotional hook.",
    solution: "Wrote 24 ad variations using pain-agitate-solve framework. Focused on transformation narratives and user testimonials.",
    results: "ROAS increased from 1.8x to 5.2x. Best-performing ad generated $420K in 90 days.",
    metric_callouts: [{ value: "5.2x", label: "ROAS" }, { value: "$420K", label: "Revenue" }, { value: "24", label: "Ad Variants" }],
    tags: ["DTC", "Paid Social", "Meta Ads"], is_featured: false, year: 2023,
  },
];

const mockServices = [
  { id: "sv1", name: "Landing Page Copy", description: "High-converting landing page copy with headline testing, benefit blocks, social proof, and CTA strategy.", starting_price: "$3,500", deliverables: ["Full page copy", "3 headline variants", "CTA strategy doc", "One revision round"], turnaround: "5-7 business days", is_featured: true },
  { id: "sv2", name: "Email Sequence", description: "Welcome flows, nurture sequences, and launch campaigns that drive opens, clicks, and revenue.", starting_price: "$2,000", deliverables: ["5-7 email sequence", "Subject line variants", "Segmentation strategy"], turnaround: "7-10 business days", is_featured: true },
  { id: "sv3", name: "Brand Voice Development", description: "Comprehensive brand voice guide with tone spectrum, do/don't examples, and messaging hierarchy.", starting_price: "$5,000", deliverables: ["Voice guide document", "Tagline options", "Sample rewrites", "Team workshop"], turnaround: "2-3 weeks", is_featured: false },
  { id: "sv4", name: "Ad Copy Package", description: "Performance-focused ad copy for Meta, Google, and LinkedIn. Includes multiple hooks and variants.", starting_price: "$1,500", deliverables: ["12-24 ad variants", "Audience-specific angles", "Performance notes"], turnaround: "3-5 business days", is_featured: false },
];

const mockTestimonials = [
  { id: "t1", quote: "Priya rewrote our landing page and conversion rate nearly quadrupled. She has an uncanny ability to find the exact words that make people click.", author_name: "Alex Chen", author_role: "CEO", author_company: "Finova", author_photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { id: "t2", quote: "Our email welcome sequence went from an afterthought to our #1 revenue channel. Priya doesn't just write — she engineers outcomes.", author_name: "Sarah Mitchell", author_role: "Head of Growth", author_company: "Bloom & Birch", author_photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { id: "t3", quote: "We've worked with a dozen copywriters. Priya is the first one who actually took time to understand our customers before writing a single word.", author_name: "James Wright", author_role: "VP Marketing", author_company: "Meridian Health", author_photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
];

const mockClients = ["Finova", "Bloom & Birch", "Meridian Health", "Torque Fitness", "Notion", "Stripe", "Webflow", "Linear"];

const mockSkills = [
  { id: "sk1", name: "Conversion Copywriting", category: "Core", proficiency: "expert" },
  { id: "sk2", name: "Brand Messaging", category: "Core", proficiency: "expert" },
  { id: "sk3", name: "Email Marketing", category: "Channels", proficiency: "expert" },
  { id: "sk4", name: "Landing Pages", category: "Channels", proficiency: "expert" },
  { id: "sk5", name: "Ad Copy (Meta/Google)", category: "Channels", proficiency: "advanced" },
  { id: "sk6", name: "UX Writing", category: "Specialty", proficiency: "advanced" },
  { id: "sk7", name: "SEO Content Strategy", category: "Specialty", proficiency: "advanced" },
  { id: "sk8", name: "A/B Testing", category: "Analytics", proficiency: "advanced" },
  { id: "sk9", name: "Customer Research", category: "Strategy", proficiency: "expert" },
  { id: "sk10", name: "Figma (for copy context)", category: "Tools", proficiency: "intermediate" },
];

const mockAwards = [
  { id: "a1", name: "Content Marketing Award", category: "Best Email Campaign — DTC", organization: "Content Marketing Institute", year: 2024, result: "Gold" },
  { id: "a2", name: "AWAI Copywriter of the Year", category: "Direct Response", organization: "AWAI", year: 2023, result: "Finalist" },
  { id: "a3", name: "MarketingProfs B2B Award", category: "Best Landing Page Copy", organization: "MarketingProfs", year: 2023, result: "Winner" },
];

const mockPress = [
  { id: "p1", title: "The Copy Formula Behind a $12M Portfolio", publication: "Marketing Brew", date: "January 2024", pull_quote: "Sharma's approach combines direct-response fundamentals with a storyteller's instinct.", article_url: "#", press_type: "feature", star_rating: null },
  { id: "p2", title: "10 Copywriters Redefining Brand Voice in 2024", publication: "Adweek", date: "March 2024", pull_quote: null, article_url: "#", press_type: "list", star_rating: null },
  { id: "p3", title: "Why Your SaaS Landing Page Isn't Converting (and How to Fix It)", publication: "First Round Review", date: "November 2023", pull_quote: null, article_url: "#", press_type: "guest_post", star_rating: null },
];

const mockEducation = [
  { id: "ed1", institution: "CXL Institute", degree_or_certificate: "Conversion Copywriting Certification", education_type: "Certification", year_start: 2019, year_end: 2019, teacher_name: null, description: "Advanced course in data-driven copywriting and A/B testing.", is_ongoing: false },
  { id: "ed2", institution: "Columbia University", degree_or_certificate: "BA, English & Creative Writing", field_of_study: "English", education_type: "Undergraduate", year_start: 2012, year_end: 2016, teacher_name: null, description: null, is_ongoing: false },
  { id: "ed3", institution: "Copyhackers 10x Emails", degree_or_certificate: "Email Copywriting Masterclass", education_type: "Workshop", year_start: 2020, year_end: null, teacher_name: "Joanna Wiebe", description: "Intensive email copy program.", is_ongoing: false },
];

const mockKnownFor = mockCaseStudies.filter(cs => cs.is_featured).map(cs => ({
  ...cs,
  poster_url: cs.poster_url,
  network_or_studio: cs.client,
  role_name: cs.tags?.[0],
}));

const featuredProject = {
  ...mockCaseStudies[0],
  network_or_studio: mockCaseStudies[0].client,
  role_name: "Lead Copywriter",
  backdrop_url: mockCaseStudies[0].poster_url,
};

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
