/**
 * Returns profile-type-aware labels for fields, sections, and guidance text.
 */

export interface TypeAwareLabels {
  logline: string;
  loglinePlaceholder: string;
  description: string;
  descriptionPlaceholder: string;
  project: string;
  projects: string;
  projectsDescription: string;
  credits: string;
  client: string;
  clientPlaceholder: string;
  roleLabel: string;
  rolePlaceholder: string;
  videoLabel: string;
  directorLabel: string;
  studioLabel: string;
  studioPlaceholder: string;
  awardsTitle: string;
  awardsDescription: string;
  eventsTitle: string;
  eventsDescription: string;
  galleryTitle: string;
  galleryDescription: string;
  pressTitle: string;
  pressDescription: string;
  servicesTitle: string;
  servicesDescription: string;
  testimonialsTitle: string;
  testimonialsDescription: string;
  skillsTitle: string;
  skillsDescription: string;
  showClientField: boolean;
  showVideoUrl: boolean;
}

const defaults: TypeAwareLabels = {
  logline: "Logline",
  loglinePlaceholder: "A one-sentence hook that sells your project",
  description: "Description",
  descriptionPlaceholder: "Expand on the story, concept, or scope of work",
  project: "Project",
  projects: "Projects",
  projectsDescription: "Add and manage the work that appears on your portfolio.",
  credits: "Credits",
  client: "Client / Company",
  clientPlaceholder: "e.g. Netflix, Saatchi & Saatchi",
  roleLabel: "Role / Credit",
  rolePlaceholder: "e.g. Writer, Lead Actor",
  videoLabel: "Video URL",
  directorLabel: "Director",
  studioLabel: "Network / Studio",
  studioPlaceholder: "e.g. HBO, A24, Netflix",
  awardsTitle: "Awards & Festivals",
  awardsDescription: "Showcase festival laurels, competition wins, and fellowships.",
  eventsTitle: "Events",
  eventsDescription: "List upcoming screenings, performances, festivals, or appearances.",
  galleryTitle: "Gallery",
  galleryDescription: "Upload photos, stills, and visual assets for your portfolio.",
  pressTitle: "Press & Reviews",
  pressDescription: "Add media coverage, interviews, and reviews about your work.",
  servicesTitle: "Services",
  servicesDescription: "List what you offer, with deliverables and pricing.",
  testimonialsTitle: "Testimonials",
  testimonialsDescription: "Collect quotes from collaborators and clients.",
  skillsTitle: "Skills",
  skillsDescription: "Highlight your areas of expertise and proficiency.",
  showClientField: false,
  showVideoUrl: true,
};

const typeOverrides: Record<string, Partial<TypeAwareLabels>> = {
  screenwriter: {
    logline: "Logline",
    loglinePlaceholder: "e.g. A disgraced teacher discovers her student is the city's most wanted hacker.",
    project: "Script",
    projects: "Scripts & Credits",
    projectsDescription: "Manage screenplays, produced credits, and writing samples.",
    roleLabel: "Credit",
    rolePlaceholder: "e.g. Writer, Co-Writer, Story By",
    studioLabel: "Studio / Network",
    studioPlaceholder: "e.g. A24, HBO, Netflix",
    awardsDescription: "Add competition wins, fellowships, and festival selections.",
  },
  tv_writer: {
    logline: "Logline",
    loglinePlaceholder: "e.g. When a local news team uncovers a conspiracy...",
    project: "Script",
    projects: "Scripts & Credits",
    projectsDescription: "Manage pilots, specs, and staff writing credits.",
    roleLabel: "Level / Credit",
    rolePlaceholder: "e.g. Staff Writer, Story Editor, Co-EP",
    studioLabel: "Network",
    studioPlaceholder: "e.g. Netflix, FX, BBC",
    awardsDescription: "Add fellowships, contests, and program acceptances.",
  },
  playwright: {
    logline: "Synopsis",
    loglinePlaceholder: "A brief synopsis of the play",
    project: "Play",
    projects: "Play Catalogue",
    projectsDescription: "Document your plays with cast sizes, rights status, and production history.",
    roleLabel: "Credit",
    rolePlaceholder: "e.g. Playwright, Adaptor, Lyricist",
    directorLabel: "Director",
    studioLabel: "Theatre / Company",
    studioPlaceholder: "e.g. National Theatre, Public Theater",
    eventsTitle: "Readings & Events",
    eventsDescription: "List upcoming readings, workshops, and performances.",
  },
  author: {
    logline: "Synopsis",
    loglinePlaceholder: "A compelling summary of the book",
    description: "Book Description",
    descriptionPlaceholder: "The back-cover copy or detailed synopsis",
    project: "Book",
    projects: "Books & Publications",
    projectsDescription: "Manage your published works — import from Google Books or add manually.",
    roleLabel: "Author Credit",
    rolePlaceholder: "e.g. Author, Co-Author, Editor",
    studioLabel: "Publisher",
    studioPlaceholder: "e.g. Penguin Random House",
    eventsTitle: "Readings & Tours",
    eventsDescription: "Book signings, readings, and speaking engagements.",
    pressTitle: "Reviews & Press",
    pressDescription: "Add book reviews, interviews, and media coverage.",
  },
  journalist: {
    logline: "Lede / Summary",
    loglinePlaceholder: "The hook or lede of your piece",
    description: "Article Description",
    descriptionPlaceholder: "What the piece covers and why it matters",
    project: "Article",
    projects: "Published Articles",
    projectsDescription: "Showcase your body of published work with links and publications.",
    roleLabel: "Byline",
    rolePlaceholder: "e.g. Staff Writer, Contributing Editor",
    client: "Publication",
    clientPlaceholder: "e.g. The New York Times, Wired",
    showClientField: true,
    studioLabel: "Publication",
    studioPlaceholder: "e.g. NYT, Atlantic, Guardian",
    skillsTitle: "Beats & Expertise",
    skillsDescription: "Define your areas of coverage and domain expertise.",
    servicesTitle: "Commissioning Info",
    servicesDescription: "Share your rates and availability for freelance commissions.",
  },
  copywriter: {
    logline: "Brief / Description",
    loglinePlaceholder: "The campaign brief or project objective",
    description: "Details",
    descriptionPlaceholder: "Describe the strategy, deliverables, and approach",
    project: "Work Sample",
    projects: "Client Work & Samples",
    projectsDescription: "Add case studies, writing samples, and campaign work. Tie each piece to a client.",
    roleLabel: "Your Role",
    rolePlaceholder: "e.g. Lead Copywriter, Content Strategist",
    client: "Client / Brand",
    clientPlaceholder: "e.g. Nike, Mailchimp, Shopify",
    showClientField: true,
    showVideoUrl: true,
    videoLabel: "Final Produced Piece URL",
    directorLabel: "Creative Director",
    studioLabel: "Agency / Company",
    studioPlaceholder: "e.g. Ogilvy, Wieden+Kennedy",
    awardsTitle: "Awards & Recognition",
    awardsDescription: "Industry awards like Cannes Lions, D&AD Pencils, Effies.",
    galleryTitle: "Campaign Gallery",
    galleryDescription: "Upload campaign visuals, ad screenshots, and creative assets.",
    servicesTitle: "Services & Rates",
    servicesDescription: "Clearly list your services, deliverables, and pricing tiers.",
    testimonialsTitle: "Client Testimonials",
    testimonialsDescription: "Client quotes and endorsements — your most powerful sales tool.",
    skillsTitle: "Specializations",
    skillsDescription: "Content strategy, UX writing, paid social, brand voice — list your niches.",
  },
  actor: {
    logline: "Role Description",
    loglinePlaceholder: "Describe your role in the project",
    project: "Credit",
    projects: "Credits & Roles",
    projectsDescription: "Build your acting résumé with film, TV, theatre, and commercial credits.",
    roleLabel: "Role",
    rolePlaceholder: "e.g. Lead, Supporting, Guest Star",
    directorLabel: "Director",
    studioLabel: "Network / Studio",
    studioPlaceholder: "e.g. HBO, A24, Netflix",
    galleryTitle: "Headshot Gallery",
    galleryDescription: "Upload multiple looks — commercial, theatrical, character shots.",
    skillsTitle: "Special Skills",
    skillsDescription: "List combat, accents, instruments, dialects, sports, and other skills.",
    eventsDescription: "Add upcoming auditions, performances, or appearances.",
    awardsDescription: "Add nominations, wins, and festival selections.",
  },
  director_producer: {
    logline: "Logline",
    loglinePlaceholder: "A one-sentence pitch for the project",
    project: "Production",
    projects: "Filmography",
    projectsDescription: "Build your filmography — import from TMDB or add manually.",
    roleLabel: "Credit",
    rolePlaceholder: "e.g. Director, Producer, EP",
    studioLabel: "Studio / Production Co.",
    studioPlaceholder: "e.g. A24, Plan B, Blumhouse",
    galleryTitle: "Production Stills",
    galleryDescription: "Behind-the-scenes photos and production stills.",
  },
  corporate_video: {
    logline: "Brief / Objective",
    loglinePlaceholder: "The business objective or campaign brief",
    project: "Production",
    projects: "Client Work",
    projectsDescription: "Showcase client video projects with results and metrics.",
    roleLabel: "Your Role",
    rolePlaceholder: "e.g. Director, DP, Editor",
    client: "Client / Brand",
    clientPlaceholder: "e.g. Microsoft, Salesforce",
    showClientField: true,
    videoLabel: "Final Video URL",
    studioLabel: "Production Company",
    studioPlaceholder: "e.g. Your company name",
    servicesTitle: "Services & Packages",
    servicesDescription: "List your video production packages and pricing.",
    testimonialsTitle: "Client Testimonials",
    testimonialsDescription: "Client feedback and endorsements.",
  },
};

export function getTypeAwareLabels(profileType: string | null | undefined): TypeAwareLabels {
  if (!profileType) return defaults;
  const overrides = typeOverrides[profileType];
  if (!overrides) return defaults;
  return { ...defaults, ...overrides };
}
