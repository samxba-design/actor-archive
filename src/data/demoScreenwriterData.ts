export const mockProfile = {
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
  status_badge_color: "green",
  status_badge_animation: "pulse",
  cta_label: "Read My Latest Script",
  cta_url: "#",
  cta_type: "custom_url",
  booking_url: null,
  show_contact_form: true,
};

export const mockSocialLinks = [
  { id: "s1", platform: "imdb", label: "IMDb", url: "https://imdb.com", display_order: 1 },
  { id: "s2", platform: "x", label: "X / Twitter", url: "https://x.com", display_order: 2 },
  { id: "s3", platform: "instagram", label: "Instagram", url: "https://instagram.com", display_order: 3 },
  { id: "s4", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com", display_order: 4 },
];

export const mockRepresentation = [
  { id: "r1", rep_type: "agent", company: "Creative Artists Agency (CAA)", name: "Michelle Torres", email: "mtorres@caa.com", phone: null, department: "Motion Picture Literary", market: "Los Angeles", is_primary: true, logo_url: null },
  { id: "r2", rep_type: "manager", company: "Management 360", name: "David Park", email: "dpark@management360.com", phone: null, department: "Literary", market: "Los Angeles", is_primary: false, logo_url: null },
];

export const mockLoglines = [
  { id: "l1", title: "The Last Station", logline: "A disgraced NASA engineer discovers that the space station she helped build is receiving transmissions from a civilization that went extinct 10,000 years ago — and the messages are addressed to her.", genre: ["Sci-Fi", "Thriller", "Drama"], format: "Feature", page_count: 118, status: "Optioned", is_featured: true },
  { id: "l2", title: "Bloodlines", logline: "When a true-crime podcaster discovers that her birth mother was the unidentified accomplice in a notorious 1990s kidnapping, she must choose between breaking the story or protecting the family she never knew.", genre: ["Thriller", "Drama"], format: "Limited Series", page_count: null, status: "In Development" },
  { id: "l3", title: "Sundown Protocol", logline: "In a near-future Los Angeles where memories can be subpoenaed as evidence, a public defender fights to protect her client's right to forget — even as her own memories are being targeted.", genre: ["Sci-Fi", "Legal Drama"], format: "Pilot", page_count: 62, status: "Spec" },
];

export const mockScripts = [
  { id: "sc1", title: "The Last Station", format: "Feature Screenplay", genre: ["Sci-Fi", "Thriller"], page_count: 118, year: 2024, logline: "A disgraced NASA engineer discovers transmissions from an extinct civilization — addressed to her.", coverage_excerpt: "\"Exceptional world-building with deeply human stakes.\" — Coverage Ink", access_level: "public", script_pdf_url: "#", status: "Optioned", project_type: "screenplay", is_featured: true },
  { id: "sc2", title: "Bloodlines", format: "Limited Series Bible + Pilot", genre: ["Thriller", "Drama"], page_count: 68, year: 2024, logline: null, coverage_excerpt: null, access_level: "gated", script_pdf_url: "#", status: "In Development", project_type: "pilot" },
  { id: "sc3", title: "Sundown Protocol", format: "Pilot Script", genre: ["Sci-Fi", "Legal Drama"], page_count: 62, year: 2023, logline: "In a world where memories can be subpoenaed, a public defender fights for the right to forget.", coverage_excerpt: null, access_level: "public", script_pdf_url: "#", status: "Spec", project_type: "pilot" },
  { id: "sc4", title: "Midnight Country", format: "Feature Screenplay", genre: ["Western", "Drama"], page_count: 105, year: 2022, logline: "A Comanche translator in 1870s Texas uncovers a conspiracy between the US Army and a railroad baron.", coverage_excerpt: "\"A fresh take on the revisionist western.\" — The Black List", access_level: "public", script_pdf_url: "#", status: "Nicholl Semifinalist", project_type: "screenplay" },
];

export const mockCredits = [
  { id: "c1", title: "The Arrangement", project_type: "tv_show", year: 2023, poster_url: "https://image.tmdb.org/t/p/w500/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg", backdrop_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=500&fit=crop", genre: ["Drama", "Thriller"], logline: "An elite political fixer discovers the biggest threat to her client is the truth she's been hired to bury.", role_name: "Staff Writer", role_type: "Season 2", network_or_studio: "HBO", is_featured: true, imdb_link: "https://imdb.com", display_order: 1 },
  { id: "c2", title: "Glass Houses", project_type: "film", year: 2022, poster_url: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", genre: ["Drama"], logline: "A Silicon Valley whistleblower seeks refuge with estranged family in rural Oregon.", role_name: "Co-Writer", network_or_studio: "A24 / Plan B", is_featured: false, display_order: 2 },
  { id: "c3", title: "Borderline", project_type: "tv_show", year: 2021, poster_url: "https://image.tmdb.org/t/p/w500/6kbAMLteGO8yyewYau6bJ683sw7.jpg", genre: ["Crime", "Drama"], logline: "A DEA agent goes undercover on both sides of the US-Mexico border.", role_name: "Story Editor", role_type: "Season 1", network_or_studio: "FX", is_featured: false, display_order: 3 },
  { id: "c4", title: "Night Shift", project_type: "tv_show", year: 2020, poster_url: "https://image.tmdb.org/t/p/w500/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg", genre: ["Thriller"], logline: "An ER nurse discovers her hospital is at the center of a pharmaceutical conspiracy.", role_name: "Staff Writer", role_type: "Season 3", network_or_studio: "NBC", is_featured: false, display_order: 4 },
];

export const mockAwards = [
  { id: "a1", name: "Nicholl Fellowship", category: "Semifinalist", organization: "Academy of Motion Picture Arts & Sciences", year: 2023, result: "Semifinalist" },
  { id: "a2", name: "Austin Film Festival", category: "Second Rounder — Drama", organization: "Austin Film Festival", year: 2023, result: "Winner" },
  { id: "a3", name: "Emmy Nomination", category: "Outstanding Writing for a Drama Series", organization: "Television Academy", year: 2023, result: "Nominated" },
  { id: "a4", name: "Emmy Nomination", category: "Outstanding Writing for a Limited Series", organization: "Television Academy", year: 2022, result: "Nominated" },
  { id: "a5", name: "PAGE International", category: "Gold Prize — TV Pilot", organization: "PAGE Awards", year: 2021, result: "Gold" },
  { id: "a6", name: "The Black List", category: "Annual List", organization: "The Black List", year: 2021, result: "Featured" },
];

export const mockPress = [
  { id: "p1", title: "Jordan Avery on Writing the New Wave of Sci-Fi TV", publication: "Deadline", date: "March 2024", pull_quote: "I'm interested in the stories we tell ourselves to survive — and what happens when those stories stop working.", article_url: "#", press_type: "interview", star_rating: null },
  { id: "p2", title: "'The Arrangement' Season 2: How the Writers Room Reinvented the Political Thriller", publication: "Variety", date: "January 2024", pull_quote: null, article_url: "#", press_type: "feature", star_rating: null },
  { id: "p3", title: "Review: 'Glass Houses' Is a Quietly Devastating Portrait of American Ambition", publication: "IndieWire", date: "September 2022", pull_quote: "Avery's screenplay finds poetry in the mundane and menace in the manicured.", article_url: "#", press_type: "review", star_rating: 4 },
];

export const mockTestimonials = [
  { id: "t1", quote: "Jordan is the rare writer who can hold a massive mythology in their head while writing the most intimate, human scenes. Every draft is better than the last.", author_name: "Sarah Chen", author_role: "Executive Producer", author_company: "HBO", author_photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { id: "t2", quote: "One of the most original voices in the room. Jordan brought a specificity to the world-building that elevated the entire show.", author_name: "Marcus Rivera", author_role: "Showrunner", author_company: "FX Networks", author_photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { id: "t3", quote: "I've read hundreds of sci-fi specs. Jordan's 'The Last Station' is in a different category entirely — grounded, surprising, and emotionally devastating.", author_name: "David Park", author_role: "Literary Manager", author_company: "Management 360", author_photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
];

export const mockServices = [
  { id: "sv1", name: "Feature Script Polish", description: "Full dialogue and structural polish pass on feature-length screenplays.", starting_price: "$5,000", deliverables: ["Full script polish", "10-page notes document", "One revision pass", "Follow-up call"], turnaround: "3-4 weeks", is_featured: true },
  { id: "sv2", name: "Pilot Script Consultation", description: "In-depth creative consultation on pilot scripts with focus on voice, structure, and marketability.", starting_price: "$2,500", deliverables: ["Written evaluation", "60-min video call", "Market positioning notes"], turnaround: "2 weeks", is_featured: false },
];

export const featuredProject = mockCredits[0];
export const mockKnownFor = mockCredits;
export const mockClients = ["Universal", "Disney", "Amazon Studios", "HBO", "Netflix", "A24", "Paramount", "Apple TV+"];

export const mockEducation = [
  { id: "ed1", institution: "UCLA School of Theater, Film and Television", degree_or_certificate: "MFA, Screenwriting", field_of_study: "Screenwriting", education_type: "Graduate", year_start: 2015, year_end: 2017, teacher_name: null, description: "Thesis screenplay selected for university showcase.", is_ongoing: false },
  { id: "ed2", institution: "Sundance Screenwriters Lab", degree_or_certificate: "Fellow", education_type: "Workshop", year_start: 2019, year_end: null, teacher_name: "Mentor: Scott Frank", description: "Selected for January Lab with feature 'The Last Station'.", is_ongoing: false },
  { id: "ed3", institution: "University of Michigan", degree_or_certificate: "BA, English & Creative Writing", field_of_study: "English", education_type: "Undergraduate", year_start: 2011, year_end: 2015, teacher_name: null, description: null, is_ongoing: false },
];

export const mockGallery = [
  { id: "g1", image_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=600&fit=crop", caption: "On set — 'The Arrangement' Season 2", photographer_credit: "Alex Rivera", image_type: "production" },
  { id: "g2", image_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=600&fit=crop", caption: "Writers room, HBO", photographer_credit: null, image_type: "behind_the_scenes" },
  { id: "g3", image_url: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=600&h=600&fit=crop", caption: "Austin Film Festival panel", photographer_credit: null, image_type: "event" },
  { id: "g4", image_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=600&fit=crop", caption: "Emmy nomination night", photographer_credit: "Getty Images", image_type: "event" },
  { id: "g5", image_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=600&fit=crop", caption: "'Glass Houses' premiere", photographer_credit: null, image_type: "premiere" },
  { id: "g6", image_url: "https://images.unsplash.com/photo-1505533542167-8c89838bb19e?w=600&h=600&fit=crop", caption: "Writing retreat, Big Sur", photographer_credit: null, image_type: "personal" },
];

export const mockDemoReels = [
  { id: "dr1", title: "Screenwriting Sizzle Reel 2024", description: "Clips from produced credits with behind-the-scenes footage.", video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", chapters: [{ time: "0:00", label: "Intro" }, { time: "0:45", label: "The Arrangement" }, { time: "1:30", label: "Glass Houses" }] },
  { id: "dr2", title: "Panel: Writing Sci-Fi for TV", description: "Austin Film Festival 2023 panel discussion.", video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", chapters: [] },
];

export const mockSkills = [
  { id: "sk1", name: "Feature Screenwriting", category: "Writing", proficiency: "expert" },
  { id: "sk2", name: "TV Pilot Development", category: "Writing", proficiency: "expert" },
  { id: "sk3", name: "Series Bible Creation", category: "Writing", proficiency: "advanced" },
  { id: "sk4", name: "Script Coverage", category: "Industry", proficiency: "advanced" },
  { id: "sk5", name: "Writers Room Collaboration", category: "Industry", proficiency: "expert" },
  { id: "sk6", name: "Final Draft", category: "Software", proficiency: "expert" },
  { id: "sk7", name: "Highland 2", category: "Software", proficiency: "advanced" },
  { id: "sk8", name: "Story Structure", category: "Craft", proficiency: "expert" },
];

export const mockEvents = [
  { id: "ev1", title: "WGA Panel: The Future of AI in Screenwriting", venue: "Writers Guild Theater", city: "Los Angeles", country: "US", date: "2024-06-15", is_upcoming: true, description: "Panelist discussion on AI tools and writers' rights.", ticket_url: "#", event_type: "panel" },
  { id: "ev2", title: "Austin Film Festival", venue: "Driskill Hotel", city: "Austin", country: "US", date: "2024-10-24", is_upcoming: true, description: "Attending as invited panelist and second rounder.", ticket_url: "#", event_type: "festival" },
  { id: "ev3", title: "Sundance Film Festival", venue: "Various", city: "Park City", country: "US", date: "2024-01-18", is_upcoming: false, description: "Attending in support of lab project.", ticket_url: null, event_type: "festival" },
];

export const mockProductions = [
  { id: "ph1", theatre_name: "Geffen Playhouse", director: "Sarah Ramirez", city: "Los Angeles", country: "US", year: 2023, run_dates: "Mar 2023 – Apr 2023", cast_names: ["David Oyelowo", "Zazie Beetz"], production_photos: [] },
  { id: "ph2", theatre_name: "Public Theater", director: "Oskar Eustis", city: "New York", country: "US", year: 2021, run_dates: "Sep 2021 – Nov 2021", cast_names: ["André Holland"], production_photos: [] },
];
