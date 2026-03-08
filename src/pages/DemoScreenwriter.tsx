import { useState, useEffect, createContext, useContext } from "react";
import { Link } from "react-router-dom";
import { PortfolioThemeProvider, usePortfolioTheme } from "@/themes/ThemeProvider";
import { getAllThemeFontsUrl } from "@/themes/themes";
import PortfolioHero, { type HeroLayout, type HeroRightContent, type HeroKnownForStyle } from "@/components/portfolio/PortfolioHero";
import PortfolioFooter from "@/components/portfolio/PortfolioFooter";
import PortfolioSectionWrapper from "@/components/portfolio/PortfolioSectionWrapper";
import ThemeSwitcher from "@/components/portfolio/ThemeSwitcher";
import LayoutSwitcher, { type LayoutPreset } from "@/components/portfolio/LayoutSwitcher";
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
import SectionOptionsBar from "@/components/portfolio/SectionOptionsBar";
import GlassCard from "@/components/portfolio/GlassCard";
import { ArrowRight, ExternalLink, ChevronDown, ChevronUp, TrendingUp, Eye, FileText, Award } from "lucide-react";

/* ── Unified section variants context ── */
interface SectionVariants {
  knownFor: KnownForVariant;
  loglines: 'editorial' | 'cards' | 'minimal';
  scripts: 'detailed' | 'grid' | 'compact';
  credits: 'poster' | 'table' | 'grid';
  awards: 'list' | 'grid' | 'laurels';
  testimonials: 'carousel' | 'cards' | 'wall' | 'single';
  press: 'feed' | 'cards' | 'quotes';
  services: 'full' | 'compact' | 'pricing';
  clientLogos: 'bar' | 'grid' | 'marquee';
  education: 'list' | 'cards' | 'timeline';
  gallery: 'grid' | 'masonry' | 'carousel';
  demoReels: 'grid' | 'featured' | 'list';
  representation: 'cards' | 'compact' | 'inline';
  skills: 'tags' | 'bars' | 'grouped';
  events: 'list' | 'calendar' | 'cards';
  productions: 'list' | 'cards' | 'timeline';
  imageAnimation: 'none' | 'pulse' | 'drift' | 'glass' | 'shine' | 'fade' | 'tilt';
  heroLayout: HeroLayout;
  heroRightContent: HeroRightContent;
  ctaPreset: 'script' | 'hire' | 'contact' | 'reel' | 'book' | 'custom';
  heroKnownFor: HeroKnownForStyle;
}

const defaultVariants: SectionVariants = {
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
  heroLayout: 'classic',
  heroRightContent: 'featured',
  ctaPreset: 'script',
  heroKnownFor: 'strip',
};

const SectionVariantsCtx = createContext<{
  variants: SectionVariants;
  setVariant: <K extends keyof SectionVariants>(key: K, value: SectionVariants[K]) => void;
}>({ variants: defaultVariants, setVariant: () => {} });
const useSectionVariants = () => useContext(SectionVariantsCtx);

/* ── Option definitions ── */
const VARIANT_OPTIONS: Record<keyof SectionVariants, { key: string; label: string }[]> = {
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
  heroLayout: [
    { key: 'classic', label: 'Classic' }, { key: 'centered', label: 'Centered' }, { key: 'split', label: 'Split' },
    { key: 'minimal', label: 'Minimal' }, { key: 'banner', label: 'Banner' }, { key: 'sidebar', label: 'Sidebar' },
    { key: 'editorial', label: 'Editorial' }, { key: 'card', label: 'Card' }, { key: 'stacked', label: 'Stacked' },
    { key: 'cinematic', label: 'Cinematic' }, { key: 'compact', label: 'Compact' },
  ],
  heroRightContent: [
    { key: 'featured', label: 'Featured' }, { key: 'services', label: 'Services' },
    { key: 'stats', label: 'Stats' }, { key: 'testimonial', label: 'Testimonial' }, { key: 'none', label: 'None' },
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
};

/* ── Toggle wrapper components ── */
const WithToggle = <K extends keyof SectionVariants>({ sectionKey, sectionName, children }: { sectionKey: K; sectionName: string; children: (variant: SectionVariants[K]) => React.ReactNode }) => {
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

const KnownForWithToggle = ({ items, display }: { items: any[]; display?: 'both' | 'image' | 'text' }) => (
  <WithToggle sectionKey="knownFor" sectionName="Known For">
    {(variant) => <SectionKnownFor items={items} variant={variant} display={display} />}
  </WithToggle>
);

const LoglinesWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="loglines" sectionName="Loglines">
    {(variant) => <SectionLoglineShowcase items={items} variant={variant} />}
  </WithToggle>
);

const ScriptsWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="scripts" sectionName="Scripts">
    {(variant) => <SectionScriptLibrary items={items} variant={variant} />}
  </WithToggle>
);

const CreditsWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="credits" sectionName="Credits">
    {(variant) => <SectionProjects items={items} profileType="screenwriter" layout={variant} />}
  </WithToggle>
);

const AwardsWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="awards" sectionName="Awards">
    {(variant) => <SectionAwards items={items} variant={variant} />}
  </WithToggle>
);

const TestimonialsWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="testimonials" sectionName="Testimonials">
    {(variant) => <SectionTestimonials items={items} variant={variant} />}
  </WithToggle>
);

const PressWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="press" sectionName="Press">
    {(variant) => <SectionPress items={items} variant={variant} />}
  </WithToggle>
);

const ServicesWithToggle = ({ items, compact }: { items: any[]; compact?: boolean }) => (
  <WithToggle sectionKey="services" sectionName="Services">
    {(variant) => <SectionServices items={items} variant={variant} />}
  </WithToggle>
);

const ClientLogosWithToggle = ({ companies }: { companies: string[] }) => (
  <WithToggle sectionKey="clientLogos" sectionName="Client Logos">
    {(variant) => <SectionClientLogos companies={companies} variant={variant} />}
  </WithToggle>
);

const EducationWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="education" sectionName="Education">
    {(variant) => <SectionEducation items={items} variant={variant} />}
  </WithToggle>
);

const GalleryWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="gallery" sectionName="Gallery">
    {(variant) => <SectionGallery items={items} variant={variant} />}
  </WithToggle>
);

const DemoReelsWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="demoReels" sectionName="Demo Reels">
    {(variant) => <SectionDemoReels items={items} variant={variant} />}
  </WithToggle>
);

const RepresentationWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="representation" sectionName="Representation">
    {(variant) => <SectionRepresentation items={items} variant={variant} />}
  </WithToggle>
);

const SkillsWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="skills" sectionName="Skills">
    {(variant) => <SectionSkills items={items} variant={variant} />}
  </WithToggle>
);

const EventsWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="events" sectionName="Events">
    {(variant) => <SectionEvents items={items} variant={variant} />}
  </WithToggle>
);

const ProductionsWithToggle = ({ items }: { items: any[] }) => (
  <WithToggle sectionKey="productions" sectionName="Productions">
    {(variant) => <SectionProductionHistory items={items} variant={variant} />}
  </WithToggle>
);


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

const mockKnownFor = mockCredits; // reuse credits as known-for items
const mockClients = ["HBO", "FX", "A24", "NBC", "Netflix", "Amazon Studios"];

const mockEducation = [
  { id: "ed1", institution: "UCLA School of Theater, Film and Television", degree_or_certificate: "MFA, Screenwriting", field_of_study: "Screenwriting", education_type: "Graduate", year_start: 2015, year_end: 2017, teacher_name: null, description: "Thesis screenplay selected for university showcase.", is_ongoing: false },
  { id: "ed2", institution: "Sundance Screenwriters Lab", degree_or_certificate: "Fellow", education_type: "Workshop", year_start: 2019, year_end: null, teacher_name: "Mentor: Scott Frank", description: "Selected for January Lab with feature 'The Last Station'.", is_ongoing: false },
  { id: "ed3", institution: "University of Michigan", degree_or_certificate: "BA, English & Creative Writing", field_of_study: "English", education_type: "Undergraduate", year_start: 2011, year_end: 2015, teacher_name: null, description: null, is_ongoing: false },
];

const mockGallery = [
  { id: "g1", image_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=600&fit=crop", caption: "On set — 'The Arrangement' Season 2", photographer_credit: "Alex Rivera", image_type: "production" },
  { id: "g2", image_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=600&fit=crop", caption: "Writers room, HBO", photographer_credit: null, image_type: "behind_the_scenes" },
  { id: "g3", image_url: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=600&h=600&fit=crop", caption: "Austin Film Festival panel", photographer_credit: null, image_type: "event" },
  { id: "g4", image_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=600&fit=crop", caption: "Emmy nomination night", photographer_credit: "Getty Images", image_type: "event" },
  { id: "g5", image_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=600&fit=crop", caption: "'Glass Houses' premiere", photographer_credit: null, image_type: "premiere" },
  { id: "g6", image_url: "https://images.unsplash.com/photo-1505533542167-8c89838bb19e?w=600&h=600&fit=crop", caption: "Writing retreat, Big Sur", photographer_credit: null, image_type: "personal" },
];

const mockDemoReels = [
  { id: "dr1", title: "Screenwriting Sizzle Reel 2024", description: "Clips from produced credits with behind-the-scenes footage.", video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", chapters: [{ time: "0:00", label: "Intro" }, { time: "0:45", label: "The Arrangement" }, { time: "1:30", label: "Glass Houses" }] },
  { id: "dr2", title: "Panel: Writing Sci-Fi for TV", description: "Austin Film Festival 2023 panel discussion.", video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", chapters: [] },
];

const mockSkills = [
  { id: "sk1", name: "Feature Screenwriting", category: "Writing", proficiency: "expert" },
  { id: "sk2", name: "TV Pilot Development", category: "Writing", proficiency: "expert" },
  { id: "sk3", name: "Series Bible Creation", category: "Writing", proficiency: "advanced" },
  { id: "sk4", name: "Script Coverage", category: "Industry", proficiency: "advanced" },
  { id: "sk5", name: "Writers Room Collaboration", category: "Industry", proficiency: "expert" },
  { id: "sk6", name: "Final Draft", category: "Software", proficiency: "expert" },
  { id: "sk7", name: "Highland 2", category: "Software", proficiency: "advanced" },
  { id: "sk8", name: "Story Structure", category: "Craft", proficiency: "expert" },
];

const mockEvents = [
  { id: "ev1", title: "WGA Panel: The Future of AI in Screenwriting", venue: "Writers Guild Theater", city: "Los Angeles", country: "US", date: "2024-06-15", is_upcoming: true, description: "Panelist discussion on AI tools and writers' rights.", ticket_url: "#", event_type: "panel" },
  { id: "ev2", title: "Austin Film Festival", venue: "Driskill Hotel", city: "Austin", country: "US", date: "2024-10-24", is_upcoming: true, description: "Attending as invited panelist and second rounder.", ticket_url: "#", event_type: "festival" },
  { id: "ev3", title: "Sundance Film Festival", venue: "Various", city: "Park City", country: "US", date: "2024-01-18", is_upcoming: false, description: "Attending in support of lab project.", ticket_url: null, event_type: "festival" },
];

const mockProductions = [
  { id: "ph1", theatre_name: "Geffen Playhouse", director: "Sarah Ramirez", city: "Los Angeles", country: "US", year: 2023, run_dates: "Mar 2023 – Apr 2023", cast_names: ["David Oyelowo", "Zazie Beetz"], production_photos: [] },
  { id: "ph2", theatre_name: "Public Theater", director: "Oskar Eustis", city: "New York", country: "US", year: 2021, run_dates: "Sep 2021 – Nov 2021", cast_names: ["André Holland"], production_photos: [] },
];

/* ══════════════════════ SHARED ══════════════════════ */

const AmbientGlow = () => {
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

/* Mid-scroll CTA that appears after scrolling 60% */
const MidScrollCTA = () => {
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
};

/* ══════════════════════ LAYOUT COMPONENTS ══════════════════════ */

/* 1. CLASSIC — Traditional vertical stack (matches original screenshot) */
const ClassicLayout = () => {
  const theme = usePortfolioTheme();
  return (
    <>
      <div className="mb-10">
        <PortfolioSectionWrapper title="Known For" index={-1}>
          <KnownForWithToggle items={mockKnownFor} />
        </PortfolioSectionWrapper>
      </div>
      <div className="mb-10">
        <PortfolioSectionWrapper title="Logline Showcase" index={0}>
          <LoglinesWithToggle items={mockLoglines} />
        </PortfolioSectionWrapper>
      </div>
      <div className="mb-10">
        <PortfolioSectionWrapper title="Script Library" index={1}>
          <ScriptsWithToggle items={mockScripts} />
        </PortfolioSectionWrapper>
      </div>
      <div className="mb-10">
        <PortfolioSectionWrapper title="Produced Credits" index={2}>
          <CreditsWithToggle items={mockCredits} />
        </PortfolioSectionWrapper>
      </div>
      <div className="mb-10">
        <PortfolioSectionWrapper title="Awards & Recognition" index={3}>
          <AwardsWithToggle items={mockAwards} />
        </PortfolioSectionWrapper>
      </div>
      <div className="mb-10">
        <PortfolioSectionWrapper title="Testimonials" index={4}>
          <TestimonialsWithToggle items={mockTestimonials} />
        </PortfolioSectionWrapper>
      </div>
      <div className="mb-10">
        <PortfolioSectionWrapper title="Press & Reviews" index={5}>
          <PressWithToggle items={mockPress} />
        </PortfolioSectionWrapper>
      </div>
      <div className="mb-10">
        <PortfolioSectionWrapper title="Written For" index={7}>
          <ClientLogosWithToggle companies={mockClients} />
        </PortfolioSectionWrapper>
      </div>
      <div className="mb-10">
        <PortfolioSectionWrapper title="Services" index={6}>
          <ServicesWithToggle items={mockServices} />
        </PortfolioSectionWrapper>
      </div>
      <div className="mb-10">
        <PortfolioSectionWrapper title="Representation" index={8}>
          <RepresentationWithToggle items={mockRepresentation} />
        </PortfolioSectionWrapper>
      </div>
      <div className="mb-10">
        <PortfolioSectionWrapper title="Education & Training" index={9}>
          <EducationWithToggle items={mockEducation} />
        </PortfolioSectionWrapper>
      </div>
      <div className="mb-10">
        <PortfolioSectionWrapper title="Skills" index={10}>
          <SkillsWithToggle items={mockSkills} />
        </PortfolioSectionWrapper>
      </div>
      <div className="mb-10">
        <PortfolioSectionWrapper title="Gallery" index={11}>
          <GalleryWithToggle items={mockGallery} />
        </PortfolioSectionWrapper>
      </div>
      <div className="mb-10">
        <PortfolioSectionWrapper title="Demo Reels" index={12}>
          <DemoReelsWithToggle items={mockDemoReels} />
        </PortfolioSectionWrapper>
      </div>
      <div className="mb-10">
        <PortfolioSectionWrapper title="Events & Appearances" index={13}>
          <EventsWithToggle items={mockEvents} />
        </PortfolioSectionWrapper>
      </div>
      <div>
        <PortfolioSectionWrapper title="Production History" index={14}>
          <ProductionsWithToggle items={mockProductions} />
        </PortfolioSectionWrapper>
      </div>
    </>
  );
};

/* Credit hero card for Classic layout — split: image top, info on solid bg below */
const CreditHeroCard = ({ project }: { project: any }) => {
  const theme = usePortfolioTheme();
  const card = (
    <GlassCard featured className="overflow-hidden group">
      {/* Backdrop image — clean, no text overlay */}
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
      {/* Info section — solid background for guaranteed readability */}
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

/* 2. STANDARD — Dense grid with sidebar modules */
const StandardLayout = () => (
  <>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Known For" index={-1}>
        <KnownForWithToggle items={mockKnownFor} display="image" />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <ClientLogosWithToggle companies={mockClients} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-10">
      <PortfolioSectionWrapper title="Original Work" index={0}>
        <LoglinesWithToggle items={mockLoglines} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Services" index={1}>
        <ServicesWithToggle items={mockServices} />
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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-10">
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
      <PortfolioSectionWrapper title="Known For" index={-1}>
        <KnownForWithToggle items={mockKnownFor} />
      </PortfolioSectionWrapper>
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
      <ClientLogosWithToggle companies={mockClients} />
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <PortfolioSectionWrapper title="Awards" index={4}>
        <AwardsWithToggle items={mockAwards} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Press" index={5}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Services" index={6}>
        <ServicesWithToggle items={mockServices} />
      </PortfolioSectionWrapper>
    </div>
  </>
);

/* 4. COMPACT — Maximum density, fixed spacing */
const CompactLayout = () => (
  <>
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 mb-8">
      <PortfolioSectionWrapper title="Original Work" index={0}>
        <LoglinesWithToggle items={mockLoglines} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Services" index={1}>
        <ServicesWithToggle items={mockServices} />
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
      <PortfolioSectionWrapper title="Known For" index={-1}>
        <KnownForWithToggle items={mockKnownFor} />
      </PortfolioSectionWrapper>
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
        <ServicesWithToggle items={mockServices} />
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
    { key: "knownfor", title: "Known For", content: <KnownForWithToggle items={mockKnownFor} display="image" /> },
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
    <div className="sm:col-span-2">
      <PortfolioSectionWrapper title="Known For" index={-1}>
        <KnownForWithToggle items={mockKnownFor} />
      </PortfolioSectionWrapper>
    </div>
    <div>
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
        <ServicesWithToggle items={mockServices} />
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
      <PortfolioSectionWrapper title="Known For" index={-1}>
        <KnownForWithToggle items={mockKnownFor} />
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
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Known For</h3>
          <KnownForWithToggle items={mockKnownFor} display="image" />
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Written For</h3>
          <ClientLogosWithToggle companies={mockClients} />
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
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Services</h3>
          <ServicesWithToggle items={mockServices} />
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
  const [themeId, setThemeId] = useState("cinematic-dark");
  const [layoutPreset, setLayoutPreset] = useState<LayoutPreset>("classic");
  const [variants, setVariants] = useState<SectionVariants>(defaultVariants);

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

  const CTA_LABELS: Record<string, string> = {
    script: 'Read My Latest Script',
    hire: 'Hire Me',
    contact: 'Get in Touch',
    reel: 'Watch My Reel',
    book: 'Book a Consultation',
    custom: 'View My Work',
  };

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

      {/* Hero toggle bars */}
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 relative z-20 space-y-1">
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
      />

      {/* Body */}
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <AmbientGlow />
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
    </PortfolioThemeProvider>
    </SectionVariantsCtx.Provider>
  );
};

export default DemoScreenwriter;
