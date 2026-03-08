import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { applyThemeToElement } from "@/lib/themes";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioFooter from "@/components/portfolio/PortfolioFooter";
import SectionLoglineShowcase from "@/components/portfolio/sections/SectionLoglineShowcase";
import SectionScriptLibrary from "@/components/portfolio/sections/SectionScriptLibrary";
import SectionProjects from "@/components/portfolio/sections/SectionProjects";
import SectionAwards from "@/components/portfolio/sections/SectionAwards";
import SectionPress from "@/components/portfolio/sections/SectionPress";
import SectionTestimonials from "@/components/portfolio/sections/SectionTestimonials";
import SectionRepresentation from "@/components/portfolio/sections/SectionRepresentation";
import SectionServices from "@/components/portfolio/sections/SectionServices";
import { ArrowRight, Sparkles } from "lucide-react";

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

const mockLoglines = [
  {
    id: "l1",
    title: "The Last Station",
    logline: "A disgraced NASA engineer discovers that the space station she helped build is receiving transmissions from a civilization that went extinct 10,000 years ago — and the messages are addressed to her.",
    genre: ["Sci-Fi", "Thriller", "Drama"],
    format: "Feature",
    page_count: 118,
    status: "Optioned",
  },
  {
    id: "l2",
    title: "Bloodlines",
    logline: "When a true-crime podcaster discovers that her birth mother was the unidentified accomplice in a notorious 1990s kidnapping, she must choose between breaking the story or protecting the family she never knew.",
    genre: ["Thriller", "Drama"],
    format: "Limited Series",
    page_count: null,
    status: "In Development",
  },
  {
    id: "l3",
    title: "Sundown Protocol",
    logline: "In a near-future Los Angeles where memories can be subpoenaed as evidence, a public defender fights to protect her client's right to forget — even as her own memories are being targeted.",
    genre: ["Sci-Fi", "Legal Drama"],
    format: "Pilot",
    page_count: 62,
    status: "Spec",
  },
];

const mockScripts = [
  {
    id: "sc1",
    title: "The Last Station",
    format: "Feature Screenplay",
    genre: ["Sci-Fi", "Thriller"],
    page_count: 118,
    year: 2024,
    logline: "A disgraced NASA engineer discovers transmissions from an extinct civilization — addressed to her.",
    coverage_excerpt: "\"Exceptional world-building with deeply human stakes. A contained sci-fi that feels epic.\" — Coverage Ink",
    access_level: "public",
    script_pdf_url: "#",
    status: "Optioned",
    project_type: "screenplay",
  },
  {
    id: "sc2",
    title: "Bloodlines",
    format: "Limited Series Bible + Pilot",
    genre: ["Thriller", "Drama"],
    page_count: 68,
    year: 2024,
    logline: null,
    coverage_excerpt: null,
    access_level: "gated",
    script_pdf_url: "#",
    status: "In Development",
    project_type: "pilot",
  },
  {
    id: "sc3",
    title: "Sundown Protocol",
    format: "Pilot Script",
    genre: ["Sci-Fi", "Legal Drama"],
    page_count: 62,
    year: 2023,
    logline: "In a world where memories can be subpoenaed, a public defender fights for the right to forget.",
    coverage_excerpt: null,
    access_level: "public",
    script_pdf_url: "#",
    status: "Spec",
    project_type: "pilot",
  },
  {
    id: "sc4",
    title: "Midnight Country",
    format: "Feature Screenplay",
    genre: ["Western", "Drama"],
    page_count: 105,
    year: 2022,
    logline: "A Comanche translator in 1870s Texas uncovers a conspiracy between the US Army and a railroad baron.",
    coverage_excerpt: "\"A fresh take on the revisionist western. Lyrical prose and razor-sharp dialogue.\" — The Black List",
    access_level: "public",
    script_pdf_url: "#",
    status: "Nicholl Semifinalist",
    project_type: "screenplay",
  },
];

const mockCredits = [
  {
    id: "c1",
    title: "The Arrangement",
    project_type: "tv_show",
    year: 2023,
    poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    backdrop_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=500&fit=crop",
    genre: ["Drama", "Thriller"],
    logline: "An elite political fixer discovers the biggest threat to her client is the truth she's been hired to bury.",
    role_name: "Staff Writer",
    role_type: "Season 2",
    network_or_studio: "HBO",
    is_featured: true,
    imdb_link: "https://imdb.com",
    display_order: 1,
  },
  {
    id: "c2",
    title: "Glass Houses",
    project_type: "film",
    year: 2022,
    poster_url: "https://images.unsplash.com/photo-1518676590747-1e3dcf5a860f?w=400&h=600&fit=crop",
    genre: ["Drama"],
    logline: "A Silicon Valley whistleblower seeks refuge with estranged family in rural Oregon.",
    role_name: "Co-Writer",
    network_or_studio: "A24 / Plan B",
    is_featured: false,
    display_order: 2,
  },
  {
    id: "c3",
    title: "Borderline",
    project_type: "tv_show",
    year: 2021,
    poster_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    genre: ["Crime", "Drama"],
    logline: "A DEA agent goes undercover on both sides of the US-Mexico border.",
    role_name: "Story Editor",
    role_type: "Season 1",
    network_or_studio: "FX",
    is_featured: false,
    display_order: 3,
  },
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
  {
    id: "p1",
    title: "Jordan Avery on Writing the New Wave of Sci-Fi TV",
    publication: "Deadline",
    date: "March 2024",
    pull_quote: "I'm interested in the stories we tell ourselves to survive — and what happens when those stories stop working.",
    article_url: "#",
    press_type: "interview",
    star_rating: null,
  },
  {
    id: "p2",
    title: "'The Arrangement' Season 2: How the Writers Room Reinvented the Political Thriller",
    publication: "Variety",
    date: "January 2024",
    pull_quote: null,
    article_url: "#",
    press_type: "feature",
    star_rating: null,
  },
  {
    id: "p3",
    title: "Review: 'Glass Houses' Is a Quietly Devastating Portrait of American Ambition",
    publication: "IndieWire",
    date: "September 2022",
    pull_quote: "Avery's screenplay finds poetry in the mundane and menace in the manicured.",
    article_url: "#",
    press_type: "review",
    star_rating: 4,
  },
];

const mockTestimonials = [
  {
    id: "t1",
    quote: "Jordan is the rare writer who can hold a massive mythology in their head while writing the most intimate, human scenes. Every draft is better than the last.",
    author_name: "Sarah Chen",
    author_role: "Executive Producer",
    author_company: "HBO",
    author_photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "t2",
    quote: "One of the most original voices in the room. Jordan brought a specificity to the world-building that elevated the entire show.",
    author_name: "Marcus Rivera",
    author_role: "Showrunner",
    author_company: "FX Networks",
    author_photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "t3",
    quote: "I've read hundreds of sci-fi specs. Jordan's 'The Last Station' is in a different category entirely — grounded, surprising, and emotionally devastating.",
    author_name: "David Park",
    author_role: "Literary Manager",
    author_company: "Management 360",
    author_photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
];

const mockRepresentation = [
  {
    id: "r1",
    rep_type: "agent",
    company: "Creative Artists Agency (CAA)",
    name: "Michelle Torres",
    email: "mtorres@caa.com",
    phone: null,
    department: "Motion Picture Literary",
    market: "Los Angeles",
    is_primary: true,
  },
  {
    id: "r2",
    rep_type: "manager",
    company: "Management 360",
    name: "David Park",
    email: "dpark@management360.com",
    phone: null,
    department: "Literary",
    market: "Los Angeles",
    is_primary: false,
  },
];

const mockServices = [
  {
    id: "sv1",
    name: "Feature Script Polish",
    description: "Full dialogue and structural polish pass on feature-length screenplays. Includes detailed notes document.",
    starting_price: "$5,000",
    deliverables: ["Full script polish", "10-page notes document", "One revision pass", "Follow-up call"],
    turnaround: "3-4 weeks",
    is_featured: true,
  },
  {
    id: "sv2",
    name: "Pilot Script Consultation",
    description: "In-depth creative consultation on pilot scripts with focus on voice, structure, and marketability.",
    starting_price: "$2,500",
    deliverables: ["Written evaluation", "60-min video call", "Market positioning notes"],
    turnaround: "2 weeks",
    is_featured: false,
  },
];

/* ── section wrapper ── */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="animate-fade-in">
    <h2
      className="text-2xl font-bold mb-6 tracking-tight"
      style={{ fontFamily: "var(--portfolio-heading-font)" }}
    >
      {title}
    </h2>
    {children}
  </section>
);

/* ── page ── */
const DemoScreenwriter = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      applyThemeToElement(containerRef.current, "ink");
    }
    // Load Google Font for ink theme
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Serif+4:wght@400;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(var(--portfolio-bg))", color: "hsl(var(--portfolio-fg))" }}
    >
      {/* Floating "Build Your Own" banner */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in" style={{ animationDelay: "2s", animationFillMode: "backwards" }}>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-2xl transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, hsl(30 60% 40%), hsl(20 70% 50%))",
            color: "#fff",
            boxShadow: "0 8px 32px -8px hsl(30 60% 40% / 0.5)",
          }}
        >
          <Sparkles className="w-4 h-4" />
          Build Your Own Portfolio
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Demo banner */}
      <div
        className="text-center py-2 text-xs font-medium"
        style={{
          background: "hsl(var(--portfolio-accent) / 0.1)",
          color: "hsl(var(--portfolio-accent))",
          borderBottom: "1px solid hsl(var(--portfolio-border))",
        }}
      >
        ✨ This is a demo portfolio — <Link to="/signup" className="underline font-semibold">Create yours free →</Link>
      </div>

      {/* Hero */}
      <PortfolioHero profile={mockProfile} socialLinks={mockSocialLinks} />

      {/* Sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <Section title="Logline Showcase">
          <SectionLoglineShowcase items={mockLoglines} />
        </Section>

        <Section title="Script Library">
          <SectionScriptLibrary items={mockScripts} />
        </Section>

        <Section title="Produced Credits">
          <SectionProjects items={mockCredits} profileType="screenwriter" isCredits />
        </Section>

        <Section title="Awards & Recognition">
          <SectionAwards items={mockAwards} />
        </Section>

        <Section title="Press & Reviews">
          <SectionPress items={mockPress} />
        </Section>

        <Section title="Testimonials">
          <SectionTestimonials items={mockTestimonials} />
        </Section>

        <Section title="Services">
          <SectionServices items={mockServices} />
        </Section>

        <Section title="Representation">
          <SectionRepresentation items={mockRepresentation} />
        </Section>
      </div>

      {/* Footer */}
      <PortfolioFooter
        profile={mockProfile}
        showContact={true}
        socialLinks={mockSocialLinks}
      />
    </div>
  );
};

export default DemoScreenwriter;
