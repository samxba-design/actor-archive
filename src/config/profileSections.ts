// Section Registry — defines which sections each profile type shows,
// their labels, icons, default order, and default theme.

export type SectionKey =
  | "hero"
  | "stats_bar"
  | "demo_reels"
  | "logline_showcase"
  | "script_library"
  | "credits"
  | "awards"
  | "achievements"
  | "press"
  | "testimonials"
  | "training"
  | "skills"
  | "services"
  | "gallery"
  | "events"
  | "representation"
  | "contact"
  | "availability"
  | "writing_samples"
  | "case_studies"
  | "client_logos"
  | "bookshelf"
  | "article_feed"
  | "publication_logos"
  | "production_history"
  | "staffing_info"
  | "diversity_programs"
  | "bio"
  | "results_wall"
  | "video_portfolio"
  | "campaign_timeline"
  | "published_work";

export interface SectionConfig {
  key: SectionKey;
  label: string;
  description: string;
}

export interface ProfileTypeConfig {
  key: string;
  label: string;
  description: string;
  icon: string; // lucide icon name
  defaultTheme: string;
  sections: SectionConfig[];
  projectTypes: string[]; // which project_type values this profile filters by
  ctas: string[];
}

export const PROFILE_TYPES: ProfileTypeConfig[] = [
  {
    key: "screenwriter",
    label: "Screenwriter",
    description: "Feature films, shorts, and original screenplays. Showcase your scripts, loglines, and produced credits.",
    icon: "PenTool",
    defaultTheme: "cinematic-dark",
    sections: [
      { key: "hero", label: "Hero", description: "Name, photo, tagline" },
      { key: "bio", label: "Bio", description: "Your story" },
      { key: "logline_showcase", label: "Logline Showcase", description: "Featured loglines" },
      { key: "script_library", label: "Script Library", description: "Your screenplays" },
      { key: "credits", label: "Produced Credits", description: "Films & shows with your name on them" },
      { key: "awards", label: "Awards & Fellowships", description: "Competitions, festivals, fellowships" },
      { key: "press", label: "Press & Reviews", description: "Coverage and features" },
      { key: "testimonials", label: "Testimonials", description: "What collaborators say" },
      { key: "client_logos", label: "Clients & Studios", description: "Companies you've worked with" },
      { key: "gallery", label: "Production Photos", description: "Behind the scenes & stills" },
      { key: "representation", label: "Representation", description: "Agent & manager info" },
      { key: "contact", label: "Contact", description: "Get in touch" },
    ],
    projectTypes: ["screenplay", "film", "tv_show", "other"],
    ctas: ["Read My Script", "Download Script", "Contact My Rep", "Commission Me"],
  },
  {
    key: "tv_writer",
    label: "TV Writer",
    description: "Original pilots, spec scripts, and writers room experience. Show your career progression from Staff Writer to Showrunner.",
    icon: "Tv",
    defaultTheme: "cinematic-dark",
    sections: [
      { key: "hero", label: "Hero", description: "Name, photo, tagline" },
      { key: "bio", label: "Bio", description: "Your story" },
      { key: "logline_showcase", label: "Pilot Showcase", description: "Original pilots & series bibles" },
      { key: "script_library", label: "Script Library", description: "Pilots, specs, packets" },
      { key: "credits", label: "Staff Credits", description: "Career progression timeline" },
      { key: "staffing_info", label: "Staffing Availability", description: "Current availability & preferences" },
      { key: "diversity_programs", label: "Programs & Fellowships", description: "Writers workshops & diversity programs" },
      { key: "awards", label: "Awards", description: "Competitions & nominations" },
      { key: "press", label: "Press", description: "Interviews & features" },
      { key: "client_logos", label: "Networks & Studios", description: "Companies you've worked with" },
      { key: "gallery", label: "Production Photos", description: "Behind the scenes & stills" },
      { key: "representation", label: "Representation", description: "Agent & manager info" },
      { key: "contact", label: "Contact", description: "Get in touch" },
    ],
    projectTypes: ["pilot", "spec_script", "series_bible", "comedy_packet", "tv_show", "other"],
    ctas: ["Read My Pilot", "Download Series Bible", "Staffing Inquiry", "Contact My Rep"],
  },
  {
    key: "playwright",
    label: "Playwright",
    description: "Stage plays, musicals, and theatrical works. Manage your play catalogue with cast sizes, rights status, and production history.",
    icon: "Theater",
    defaultTheme: "warm-luxury",
    sections: [
      { key: "hero", label: "Hero", description: "Name, photo, tagline" },
      { key: "bio", label: "Bio", description: "Your story" },
      { key: "script_library", label: "Play Catalogue", description: "Your plays with cast & rights info" },
      { key: "production_history", label: "Production History", description: "Where your plays have been staged" },
      { key: "credits", label: "Commissions", description: "Commissioned works" },
      { key: "awards", label: "Awards", description: "Competitions & nominations" },
      { key: "press", label: "Reviews & Press", description: "Critical reception" },
      { key: "testimonials", label: "Testimonials", description: "Director & producer quotes" },
      { key: "client_logos", label: "Theatres & Companies", description: "Theatres and companies you've worked with" },
      { key: "gallery", label: "Production Photos", description: "Behind the scenes & stills" },
      { key: "events", label: "Readings & Events", description: "Upcoming readings & performances" },
      { key: "representation", label: "Representation", description: "Agent info" },
      { key: "contact", label: "Contact", description: "Rights enquiries & commissions" },
    ],
    projectTypes: ["play", "other"],
    ctas: ["Enquire About Rights", "Commission a Play", "Request Script"],
  },
  {
    key: "author",
    label: "Author / Novelist",
    description: "Books, novels, short stories, and non-fiction. Beautiful bookshelf display with purchase links and tour dates.",
    icon: "BookOpen",
    defaultTheme: "warm-luxury",
    sections: [
      { key: "hero", label: "Hero", description: "Name, photo, tagline" },
      { key: "bio", label: "Bio", description: "Your story" },
      { key: "bookshelf", label: "Bookshelf", description: "Your published works" },
      { key: "credits", label: "Publications", description: "Short stories & essays" },
      { key: "awards", label: "Awards & Prizes", description: "Literary awards" },
      { key: "press", label: "Press & Reviews", description: "Book reviews & interviews" },
      { key: "testimonials", label: "Endorsements", description: "Blurbs & endorsements" },
      { key: "client_logos", label: "Publishers & Partners", description: "Publishers and brands you've worked with" },
      { key: "gallery", label: "Author Photos", description: "Author photos & book covers" },
      { key: "events", label: "Readings & Tours", description: "Book signings & speaking" },
      { key: "representation", label: "Representation", description: "Literary agent" },
      { key: "contact", label: "Contact", description: "Get in touch" },
    ],
    projectTypes: ["novel", "book", "short_story", "article", "other"],
    ctas: ["Buy My Book", "Book Me to Speak", "Request Review Copy", "Contact My Agent"],
  },
  {
    key: "journalist",
    label: "Journalist / Editorial",
    description: "Articles, features, investigations, and columns. Filterable article feed with publication logos and beats.",
    icon: "Newspaper",
    defaultTheme: "warm-luxury",
    sections: [
      { key: "hero", label: "Hero", description: "Name, photo, tagline" },
      { key: "bio", label: "Bio", description: "Your story" },
      { key: "article_feed", label: "Article Feed", description: "Your published articles" },
      { key: "published_work", label: "Published Work", description: "Featured articles & investigations" },
      { key: "publication_logos", label: "Publications", description: "Outlets you've written for" },
      { key: "skills", label: "Beats & Expertise", description: "Your areas of focus" },
      { key: "press", label: "Media Appearances", description: "Podcasts, TV, radio" },
      { key: "awards", label: "Awards", description: "Journalism awards" },
      { key: "client_logos", label: "Publications", description: "Outlets you've written for" },
      { key: "gallery", label: "Media & Photos", description: "Event photos & media appearances" },
      { key: "services", label: "Commissioning Info", description: "Rates & availability" },
      { key: "contact", label: "Contact", description: "Pitch or commission" },
    ],
    projectTypes: ["article", "other"],
    ctas: ["Commission an Article", "Pitch Me", "Subscribe to Newsletter", "Hire Me"],
  },
  {
    key: "copywriter",
    label: "Copywriter / Content Strategist",
    description: "Case studies, writing samples, and client work. Showcase results with metrics and before/after examples.",
    icon: "Type",
    defaultTheme: "frost",
    sections: [
      { key: "hero", label: "Hero", description: "Name, photo, tagline" },
      { key: "bio", label: "Bio", description: "Your story" },
      { key: "published_work", label: "Published Work", description: "Featured articles & writing pieces with PDF previews" },
      { key: "results_wall", label: "Impact Numbers", description: "Aggregated metrics across campaigns" },
      { key: "case_studies", label: "Case Studies", description: "Client work with results" },
      { key: "video_portfolio", label: "Video Portfolio", description: "Campaign videos & brand films" },
      { key: "writing_samples", label: "Writing Samples", description: "Headlines, long-form, email, UX" },
      { key: "skills", label: "Specializations", description: "Your areas of expertise" },
      { key: "client_logos", label: "Clients", description: "Brands you've worked with" },
      { key: "campaign_timeline", label: "Campaign Timeline", description: "Career progression with key campaigns" },
      { key: "testimonials", label: "Testimonials", description: "Client feedback" },
      { key: "services", label: "Services & Rates", description: "What you offer" },
      { key: "press", label: "Press & Features", description: "Coverage and features" },
      { key: "awards", label: "Awards & Recognition", description: "Industry recognition" },
      { key: "achievements", label: "Notable Achievements", description: "Key milestones and accomplishments" },
      { key: "gallery", label: "Campaign Gallery", description: "Campaign visuals & behind the scenes" },
      { key: "contact", label: "Contact", description: "Start a project" },
    ],
    projectTypes: ["case_study", "writing_sample", "campaign", "article", "other"],
    ctas: ["Get a Quote", "Start a Project", "Download Rate Card", "Book a Call"],
  },
  {
    key: "actor",
    label: "Actor",
    description: "Headshots, demo reels, credits, and physical stats. Optimised for casting directors — everything scannable in 15 seconds.",
    icon: "Clapperboard",
    defaultTheme: "cinematic-dark",
    sections: [
      { key: "hero", label: "Hero", description: "Primary headshot, name" },
      { key: "stats_bar", label: "Physical Stats", description: "Height, age range, unions, accents" },
      { key: "demo_reels", label: "Demo Reels", description: "Dramatic, comedy, commercial reels" },
      { key: "credits", label: "Credits", description: "Film, TV, Theatre, Commercial" },
      { key: "gallery", label: "Headshot Gallery", description: "Multiple looks" },
      { key: "training", label: "Training", description: "Schools & coaches" },
      { key: "skills", label: "Special Skills", description: "Combat, instruments, languages" },
      { key: "awards", label: "Awards", description: "Nominations & wins" },
      { key: "press", label: "Press & Reviews", description: "Reviews and features" },
      { key: "representation", label: "Representation", description: "Agent & manager" },
      { key: "availability", label: "Availability", description: "Casting availability & self-tape" },
      { key: "contact", label: "Contact", description: "Casting enquiries" },
    ],
    projectTypes: ["film", "tv_show", "play", "video", "other"],
    ctas: ["Request Headshots", "Request Reel", "Contact My Agent", "Self-Tape Available", "General Meeting", "Audition Me"],
  },
  {
    key: "director_producer",
    label: "Director / Producer",
    description: "Filmography, festival laurels, production company info. Showcase your vision with cinematic layouts.",
    icon: "Film",
    defaultTheme: "noir-classic",
    sections: [
      { key: "hero", label: "Hero", description: "Name, photo, tagline" },
      { key: "bio", label: "Bio", description: "Your vision" },
      { key: "credits", label: "Filmography", description: "Directed & produced works" },
      { key: "demo_reels", label: "Showreel", description: "Director's reel" },
      { key: "gallery", label: "Production Stills", description: "Behind the scenes" },
      { key: "awards", label: "Awards & Laurels", description: "Festival selections & wins" },
      { key: "press", label: "Press", description: "Interviews & reviews" },
      { key: "testimonials", label: "Testimonials", description: "Collaborator quotes" },
      { key: "services", label: "Available For", description: "Types of projects" },
      { key: "client_logos", label: "Studios & Partners", description: "Companies you've worked with" },
      { key: "representation", label: "Representation", description: "Agent & manager" },
      { key: "contact", label: "Contact", description: "Get in touch" },
    ],
    projectTypes: ["film", "tv_show", "video", "campaign", "other"],
    ctas: ["Watch My Reel", "View Filmography", "Contact My Rep", "Hire Me"],
  },
  {
    key: "corporate_video",
    label: "Corporate / Video Professional",
    description: "Client work, brand videos, and corporate content. Service-focused with client logos and case studies.",
    icon: "Video",
    defaultTheme: "frost",
    sections: [
      { key: "hero", label: "Hero", description: "Name, photo, tagline" },
      { key: "bio", label: "Bio", description: "Your expertise" },
      { key: "demo_reels", label: "Showreel", description: "Best work compilation" },
      { key: "case_studies", label: "Case Studies", description: "Client projects with results" },
      { key: "client_logos", label: "Clients", description: "Brands you've worked with" },
      { key: "services", label: "Services & Rates", description: "What you offer" },
      { key: "gallery", label: "Portfolio Gallery", description: "Production stills & screenshots" },
      { key: "testimonials", label: "Testimonials", description: "Client feedback" },
      { key: "awards", label: "Awards", description: "Industry recognition" },
      { key: "achievements", label: "Notable Achievements", description: "Key milestones and accomplishments" },
      { key: "press", label: "Press", description: "Features & coverage" },
      { key: "contact", label: "Contact", description: "Start a project" },
    ],
    projectTypes: ["video", "campaign", "case_study", "other"],
    ctas: ["Get a Quote", "Watch My Reel", "Start a Project", "Book a Call"],
  },
  {
    key: "multi_hyphenate",
    label: "Multi-Hyphenate / Custom",
    description: "You do it all. Select multiple creative disciplines and build a custom portfolio with exactly the sections you need.",
    icon: "Layers",
    defaultTheme: "modern-minimal",
    sections: [], // populated dynamically from selected types
    projectTypes: [], // all types available
    ctas: [],
  },
];

/**
 * Get merged sections for a multi-hyphenate profile.
 * Combines sections from primary + secondary types, deduplicating by key.
 */
export function getMergedSections(
  primaryType: string,
  secondaryTypes: string[] = []
): SectionConfig[] {
  const allTypes = [primaryType, ...secondaryTypes];
  const seen = new Set<SectionKey>();
  const merged: SectionConfig[] = [];

  for (const typeKey of allTypes) {
    const config = PROFILE_TYPES.find((pt) => pt.key === typeKey);
    if (!config) continue;
    for (const section of config.sections) {
      if (!seen.has(section.key)) {
        seen.add(section.key);
        merged.push(section);
      }
    }
  }

  return merged;
}

/**
 * Get the config for a specific profile type
 */
export function getProfileTypeConfig(typeKey: string): ProfileTypeConfig | undefined {
  return PROFILE_TYPES.find((pt) => pt.key === typeKey);
}
