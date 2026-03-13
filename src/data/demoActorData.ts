export const mockProfile = {
  id: "demo-actor",
  display_name: "Mia Torres",
  first_name: "Mia",
  last_name: "Torres",
  tagline: "SAG-AFTRA · Drama & Comedy · Los Angeles / New York",
  bio: "SAG-AFTRA actor with credits spanning premium television, independent film, and theatre. Known for grounded, emotionally complex performances in character-driven dramas. Training includes the Yale School of Drama MFA program and Upright Citizens Brigade.\n\nCurrently recurring on a critically acclaimed streaming series, and available for pilot season. Represented by WME and Untitled Entertainment.",
  location: "Los Angeles, CA",
  profile_photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
  banner_url: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=1600&h=500&fit=crop",
  profile_type: "actor",
  available_for_hire: true,
  seeking_representation: false,
  cta_label: "Contact My Agent",
  cta_url: "#",
  cta_type: "custom_url",
  booking_url: null,
  show_contact_form: true,
};

export const mockSocialLinks = [
  { id: "s1", platform: "imdb", label: "IMDb", url: "https://imdb.com", display_order: 1 },
  { id: "s2", platform: "instagram", label: "Instagram", url: "https://instagram.com", display_order: 2 },
  { id: "s3", platform: "x", label: "X / Twitter", url: "https://x.com", display_order: 3 },
  { id: "s4", platform: "vimeo", label: "Vimeo", url: "https://vimeo.com", display_order: 4 },
];

export const mockRepresentation = [
  { id: "r1", rep_type: "agent", company: "William Morris Endeavor (WME)", name: "Rachel Kim", email: "rkim@wme.com", phone: null, department: "Talent", market: "Los Angeles", is_primary: true, logo_url: null },
  { id: "r2", rep_type: "manager", company: "Untitled Entertainment", name: "Jason Park", email: "jpark@untitledent.com", phone: null, department: "Talent Management", market: "Los Angeles / New York", is_primary: false, logo_url: null },
];

export const mockActorStats = {
  height_display: "5'7\"",
  weight_range: "125-130 lbs",
  age_range_min: 24,
  age_range_max: 32,
  gender_identity: "Female",
  hair_color: "Dark Brown",
  eye_color: "Brown",
  body_type: "Athletic",
  ethnicity: ["Latina", "Mixed"],
  union_status: ["SAG-AFTRA"],
  accents: ["Standard American", "RP British", "Southern", "New York"],
  vocal_range: "Mezzo-Soprano",
  dance_styles: ["Contemporary", "Jazz", "Salsa"],
  special_skills: ["Stage Combat (SAFD Certified)", "Horseback Riding", "Gymnastics", "Piano", "Kickboxing", "Swimming"],
  languages: [
    { language: "English", level: "Native" },
    { language: "Spanish", level: "Fluent" },
    { language: "French", level: "Conversational" },
  ],
  based_in_primary: "Los Angeles, CA",
  passport_countries: ["United States", "Colombia"],
  willing_to_travel: true,
  casting_availability: "Available for Pilot Season",
  self_tape_turnaround: "24 hours",
  availability_note: "Available immediately for auditions and self-tapes.",
};

export const mockCredits = [
  { id: "c1", title: "The Vigil", project_type: "tv_show", year: 2024, poster_url: "https://image.tmdb.org/t/p/w500/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg", backdrop_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=500&fit=crop", genre: ["Drama", "Thriller"], logline: "A detective's obsession with an unsolved case leads her down a dangerous path.", role_name: "Elena Vasquez", role_type: "Series Regular", network_or_studio: "HBO", is_featured: true, imdb_link: "https://imdb.com", display_order: 1 },
  { id: "c2", title: "Ember", project_type: "film", year: 2023, poster_url: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", genre: ["Drama", "Romance"], logline: "Two strangers find connection during a California wildfire evacuation.", role_name: "Sofia", role_type: "Lead", network_or_studio: "A24", is_featured: true, imdb_link: "https://imdb.com", display_order: 2 },
  { id: "c3", title: "City on Fire", project_type: "tv_show", year: 2023, poster_url: "https://image.tmdb.org/t/p/w500/6kbAMLteGO8yyewYau6bJ683sw7.jpg", genre: ["Crime", "Drama"], logline: "An ensemble drama set against NYC's punk scene in the early 2000s.", role_name: "Det. Rosa Alvarez", role_type: "Recurring", network_or_studio: "Apple TV+", is_featured: false, display_order: 3 },
  { id: "c4", title: "Quiet Hours", project_type: "film", year: 2022, poster_url: "https://image.tmdb.org/t/p/w500/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg", genre: ["Horror", "Drama"], logline: "A night shift nurse in a rural hospital discovers her patients share the same terrifying dream.", role_name: "Nurse Maria", role_type: "Lead", network_or_studio: "Blumhouse", is_featured: false, display_order: 4 },
  { id: "c5", title: "The Last Summer", project_type: "film", year: 2021, poster_url: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", genre: ["Coming-of-Age", "Drama"], logline: "Three friends face an uncertain future during their last summer before college.", role_name: "Ana", role_type: "Supporting", network_or_studio: "Searchlight", is_featured: false, display_order: 5 },
  { id: "c6", title: "Station 19", project_type: "tv_show", year: 2020, poster_url: "https://image.tmdb.org/t/p/w500/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg", genre: ["Drama"], logline: null, role_name: "Paramedic Lucia Reyes", role_type: "Guest Star (3 eps)", network_or_studio: "ABC", is_featured: false, display_order: 6 },
];

export const mockDemoReels = [
  { id: "dr1", title: "Dramatic Reel 2024", description: "Scenes from The Vigil (HBO), Ember (A24), and City on Fire (Apple TV+).", video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", chapters: [{ time: "0:00", label: "The Vigil" }, { time: "1:12", label: "Ember" }, { time: "2:30", label: "City on Fire" }] },
  { id: "dr2", title: "Comedy Reel", description: "UCB showcase + comedy guest spots.", video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", chapters: [] },
  { id: "dr3", title: "Commercial Reel", description: "National spots for Nike, Toyota, and Apple.", video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", chapters: [] },
];

export const mockAwards = [
  { id: "a1", name: "SAG Award Nomination", category: "Outstanding Performance — Female Actor in a Drama Series", organization: "Screen Actors Guild", year: 2024, result: "Nominated" },
  { id: "a2", name: "Independent Spirit Award Nomination", category: "Best Female Lead", organization: "Film Independent", year: 2023, result: "Nominated" },
  { id: "a3", name: "Gotham Award", category: "Breakthrough Actor", organization: "Gotham Film & Media Institute", year: 2023, result: "Winner" },
  { id: "a4", name: "SXSW Grand Jury Prize", category: "Narrative Feature (Ensemble)", organization: "SXSW", year: 2022, result: "Winner" },
];

export const mockPress = [
  { id: "p1", title: "Mia Torres: '10 Actors to Watch'", publication: "Variety", date: "January 2024", pull_quote: "Torres brings a raw vulnerability that's impossible to look away from.", article_url: "#", press_type: "feature", star_rating: null },
  { id: "p2", title: "Review: 'Ember' Burns Bright at Sundance", publication: "IndieWire", date: "February 2023", pull_quote: "Torres delivers the kind of performance that announces a star.", article_url: "#", press_type: "review", star_rating: 5 },
  { id: "p3", title: "'The Vigil' Season 2: Mia Torres on Finding Elena", publication: "Deadline", date: "March 2024", pull_quote: null, article_url: "#", press_type: "interview", star_rating: null },
];

export const mockTestimonials = [
  { id: "t1", quote: "Mia is one of those rare actors who makes everyone in the scene better. She comes prepared, she takes risks, and she always finds the truth in the moment.", author_name: "James Nakamura", author_role: "Director", author_company: "'Ember'", author_photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { id: "t2", quote: "I've cast hundreds of actors. Mia walked in and owned the room. Her audition for Elena is still the best I've ever seen.", author_name: "Patricia Vega", author_role: "Casting Director", author_company: "HBO", author_photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { id: "t3", quote: "Working with Mia was a privilege. She brings humanity to every role — you believe every word.", author_name: "Robert Chen", author_role: "Showrunner", author_company: "'The Vigil'", author_photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
];

export const mockGallery = [
  { id: "g1", image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&crop=face", caption: "Theatrical Headshot", photographer_credit: "Peter Hurley", image_type: "headshot" },
  { id: "g2", image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop&crop=face", caption: "Commercial Look", photographer_credit: "Peter Hurley", image_type: "headshot" },
  { id: "g3", image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop&crop=face", caption: "Dramatic / Dark", photographer_credit: null, image_type: "headshot" },
  { id: "g4", image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop&crop=face", caption: "Lifestyle", photographer_credit: null, image_type: "headshot" },
  { id: "g5", image_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=600&fit=crop", caption: "On set — 'The Vigil'", photographer_credit: "HBO", image_type: "production" },
  { id: "g6", image_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=600&fit=crop", caption: "Sundance Film Festival 2023", photographer_credit: "Getty Images", image_type: "event" },
];

export const mockEducation = [
  { id: "ed1", institution: "Yale School of Drama", degree_or_certificate: "MFA, Acting", field_of_study: "Acting", education_type: "Graduate", year_start: 2017, year_end: 2020, teacher_name: null, description: "Thesis performance in 'Hedda Gabler' earned departmental honors.", is_ongoing: false },
  { id: "ed2", institution: "Upright Citizens Brigade", degree_or_certificate: "Advanced Improv & Sketch", education_type: "Workshop", year_start: 2020, year_end: 2021, teacher_name: null, description: "Completed all levels. Performed on Harold team.", is_ongoing: false },
  { id: "ed3", institution: "Meisner Studio NYC", degree_or_certificate: "Two-Year Meisner Technique", education_type: "Conservatory", year_start: 2015, year_end: 2017, teacher_name: "William Esper", description: null, is_ongoing: false },
  { id: "ed4", institution: "SAFD Stage Combat", degree_or_certificate: "Certified Combatant", education_type: "Certification", year_start: 2019, year_end: null, teacher_name: null, description: "Rapier & dagger, unarmed, single sword.", is_ongoing: false },
];

export const mockSkills = [
  { id: "sk1", name: "Stage Combat (SAFD Certified)", category: "Physical", proficiency: "expert" },
  { id: "sk2", name: "Horseback Riding", category: "Physical", proficiency: "advanced" },
  { id: "sk3", name: "Gymnastics", category: "Physical", proficiency: "advanced" },
  { id: "sk4", name: "Piano", category: "Musical", proficiency: "advanced" },
  { id: "sk5", name: "Kickboxing", category: "Physical", proficiency: "intermediate" },
  { id: "sk6", name: "Swimming (Distance)", category: "Physical", proficiency: "advanced" },
  { id: "sk7", name: "Improv (UCB)", category: "Performance", proficiency: "expert" },
  { id: "sk8", name: "Dialect Work", category: "Performance", proficiency: "expert" },
];

export const mockEvents = [
  { id: "ev1", title: "SAG Awards Ceremony", venue: "Shrine Auditorium", city: "Los Angeles", country: "US", date: "2024-02-24", is_upcoming: false, description: "Nominated — Outstanding Female Actor in a Drama Series.", ticket_url: null, event_type: "awards" },
  { id: "ev2", title: "Sundance Film Festival — 'Ember' Premiere", venue: "Eccles Theatre", city: "Park City", country: "US", date: "2024-01-20", is_upcoming: false, description: "World premiere screening + Q&A.", ticket_url: null, event_type: "festival" },
];

export const mockClients = ["Warner Bros", "Universal", "Disney", "Amazon Studios", "HBO", "Apple TV+", "Netflix", "Searchlight"];

export const mockKnownFor = mockCredits;
export const featuredProject = mockCredits[0];
