import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PortfolioThemeProvider, usePortfolioTheme } from "@/themes/ThemeProvider";
import { getAllThemeFontsUrl } from "@/themes/themes";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioFooter from "@/components/portfolio/PortfolioFooter";
import PortfolioSectionWrapper from "@/components/portfolio/PortfolioSectionWrapper";
import ThemeSwitcher from "@/components/portfolio/ThemeSwitcher";
import LayoutSwitcher, { type LayoutPreset } from "@/components/portfolio/LayoutSwitcher";
import SectionActorStats from "@/components/portfolio/sections/SectionActorStats";
import GlassCard from "@/components/portfolio/GlassCard";
import DemoProfileTabs from "@/components/demo/DemoProfileTabs";
import { ArrowRight, ChevronDown, ChevronUp, TrendingUp, Eye, FileText, Award } from "lucide-react";
import {
  SectionVariantsCtx, defaultVariants,
  type SectionVariants, WithToggle,
  KnownForWithToggle, CreditsWithToggle, AwardsWithToggle,
  TestimonialsWithToggle, PressWithToggle, ServicesWithToggle,
  ClientLogosWithToggle, EducationWithToggle, GalleryWithToggle,
  DemoReelsWithToggle, RepresentationWithToggle, SkillsWithToggle,
  EventsWithToggle, ProductionsWithToggle,
  AmbientGlow, MidScrollCTA, CTA_LABELS,
} from "@/components/demo/DemoShared";

/* ══════════════════════ ACTOR MOCK DATA ══════════════════════ */

const mockProfile = {
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

const mockSocialLinks = [
  { id: "s1", platform: "imdb", label: "IMDb", url: "https://imdb.com", display_order: 1 },
  { id: "s2", platform: "instagram", label: "Instagram", url: "https://instagram.com", display_order: 2 },
  { id: "s3", platform: "x", label: "X / Twitter", url: "https://x.com", display_order: 3 },
  { id: "s4", platform: "vimeo", label: "Vimeo", url: "https://vimeo.com", display_order: 4 },
];

const mockRepresentation = [
  { id: "r1", rep_type: "agent", company: "William Morris Endeavor (WME)", name: "Rachel Kim", email: "rkim@wme.com", phone: null, department: "Talent", market: "Los Angeles", is_primary: true, logo_url: null },
  { id: "r2", rep_type: "manager", company: "Untitled Entertainment", name: "Jason Park", email: "jpark@untitledent.com", phone: null, department: "Talent Management", market: "Los Angeles / New York", is_primary: false, logo_url: null },
];

const mockActorStats = {
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

const mockCredits = [
  { id: "c1", title: "The Vigil", project_type: "tv_show", year: 2024, poster_url: "https://image.tmdb.org/t/p/w500/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg", backdrop_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=500&fit=crop", genre: ["Drama", "Thriller"], logline: "A detective's obsession with an unsolved case leads her down a dangerous path.", role_name: "Elena Vasquez", role_type: "Series Regular", network_or_studio: "HBO", is_featured: true, imdb_link: "https://imdb.com", display_order: 1 },
  { id: "c2", title: "Ember", project_type: "film", year: 2023, poster_url: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", genre: ["Drama", "Romance"], logline: "Two strangers find connection during a California wildfire evacuation.", role_name: "Sofia", role_type: "Lead", network_or_studio: "A24", is_featured: true, imdb_link: "https://imdb.com", display_order: 2 },
  { id: "c3", title: "City on Fire", project_type: "tv_show", year: 2023, poster_url: "https://image.tmdb.org/t/p/w500/6kbAMLteGO8yyewYau6bJ683sw7.jpg", genre: ["Crime", "Drama"], logline: "An ensemble drama set against NYC's punk scene in the early 2000s.", role_name: "Det. Rosa Alvarez", role_type: "Recurring", network_or_studio: "Apple TV+", is_featured: false, display_order: 3 },
  { id: "c4", title: "Quiet Hours", project_type: "film", year: 2022, poster_url: "https://image.tmdb.org/t/p/w500/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg", genre: ["Horror", "Drama"], logline: "A night shift nurse in a rural hospital discovers her patients share the same terrifying dream.", role_name: "Nurse Maria", role_type: "Lead", network_or_studio: "Blumhouse", is_featured: false, display_order: 4 },
  { id: "c5", title: "The Last Summer", project_type: "film", year: 2021, poster_url: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", genre: ["Coming-of-Age", "Drama"], logline: "Three friends face an uncertain future during their last summer before college.", role_name: "Ana", role_type: "Supporting", network_or_studio: "Searchlight", is_featured: false, display_order: 5 },
  { id: "c6", title: "Station 19", project_type: "tv_show", year: 2020, poster_url: "https://image.tmdb.org/t/p/w500/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg", genre: ["Drama"], logline: null, role_name: "Paramedic Lucia Reyes", role_type: "Guest Star (3 eps)", network_or_studio: "ABC", is_featured: false, display_order: 6 },
];

const mockDemoReels = [
  { id: "dr1", title: "Dramatic Reel 2024", description: "Scenes from The Vigil (HBO), Ember (A24), and City on Fire (Apple TV+).", video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", chapters: [{ time: "0:00", label: "The Vigil" }, { time: "1:12", label: "Ember" }, { time: "2:30", label: "City on Fire" }] },
  { id: "dr2", title: "Comedy Reel", description: "UCB showcase + comedy guest spots.", video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", chapters: [] },
  { id: "dr3", title: "Commercial Reel", description: "National spots for Nike, Toyota, and Apple.", video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", chapters: [] },
];

const mockAwards = [
  { id: "a1", name: "SAG Award Nomination", category: "Outstanding Performance — Female Actor in a Drama Series", organization: "Screen Actors Guild", year: 2024, result: "Nominated" },
  { id: "a2", name: "Independent Spirit Award Nomination", category: "Best Female Lead", organization: "Film Independent", year: 2023, result: "Nominated" },
  { id: "a3", name: "Gotham Award", category: "Breakthrough Actor", organization: "Gotham Film & Media Institute", year: 2023, result: "Winner" },
  { id: "a4", name: "SXSW Grand Jury Prize", category: "Narrative Feature (Ensemble)", organization: "SXSW", year: 2022, result: "Winner" },
];

const mockPress = [
  { id: "p1", title: "Mia Torres: '10 Actors to Watch'", publication: "Variety", date: "January 2024", pull_quote: "Torres brings a raw vulnerability that's impossible to look away from.", article_url: "#", press_type: "feature", star_rating: null },
  { id: "p2", title: "Review: 'Ember' Burns Bright at Sundance", publication: "IndieWire", date: "February 2023", pull_quote: "Torres delivers the kind of performance that announces a star.", article_url: "#", press_type: "review", star_rating: 5 },
  { id: "p3", title: "'The Vigil' Season 2: Mia Torres on Finding Elena", publication: "Deadline", date: "March 2024", pull_quote: null, article_url: "#", press_type: "interview", star_rating: null },
];

const mockTestimonials = [
  { id: "t1", quote: "Mia is one of those rare actors who makes everyone in the scene better. She comes prepared, she takes risks, and she always finds the truth in the moment.", author_name: "James Nakamura", author_role: "Director", author_company: "'Ember'", author_photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { id: "t2", quote: "I've cast hundreds of actors. Mia walked in and owned the room. Her audition for Elena is still the best I've ever seen.", author_name: "Patricia Vega", author_role: "Casting Director", author_company: "HBO", author_photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { id: "t3", quote: "Working with Mia was a privilege. She brings humanity to every role — you believe every word.", author_name: "Robert Chen", author_role: "Showrunner", author_company: "'The Vigil'", author_photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
];

const mockGallery = [
  { id: "g1", image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&crop=face", caption: "Theatrical Headshot", photographer_credit: "Peter Hurley", image_type: "headshot" },
  { id: "g2", image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop&crop=face", caption: "Commercial Look", photographer_credit: "Peter Hurley", image_type: "headshot" },
  { id: "g3", image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop&crop=face", caption: "Dramatic / Dark", photographer_credit: null, image_type: "headshot" },
  { id: "g4", image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop&crop=face", caption: "Lifestyle", photographer_credit: null, image_type: "headshot" },
  { id: "g5", image_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=600&fit=crop", caption: "On set — 'The Vigil'", photographer_credit: "HBO", image_type: "production" },
  { id: "g6", image_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=600&fit=crop", caption: "Sundance Film Festival 2023", photographer_credit: "Getty Images", image_type: "event" },
];

const mockEducation = [
  { id: "ed1", institution: "Yale School of Drama", degree_or_certificate: "MFA, Acting", field_of_study: "Acting", education_type: "Graduate", year_start: 2017, year_end: 2020, teacher_name: null, description: "Thesis performance in 'Hedda Gabler' earned departmental honors.", is_ongoing: false },
  { id: "ed2", institution: "Upright Citizens Brigade", degree_or_certificate: "Advanced Improv & Sketch", education_type: "Workshop", year_start: 2020, year_end: 2021, teacher_name: null, description: "Completed all levels. Performed on Harold team.", is_ongoing: false },
  { id: "ed3", institution: "Meisner Studio NYC", degree_or_certificate: "Two-Year Meisner Technique", education_type: "Conservatory", year_start: 2015, year_end: 2017, teacher_name: "William Esper", description: null, is_ongoing: false },
  { id: "ed4", institution: "SAFD Stage Combat", degree_or_certificate: "Certified Combatant", education_type: "Certification", year_start: 2019, year_end: null, teacher_name: null, description: "Rapier & dagger, unarmed, single sword.", is_ongoing: false },
];

const mockSkills = [
  { id: "sk1", name: "Stage Combat (SAFD Certified)", category: "Physical", proficiency: "expert" },
  { id: "sk2", name: "Horseback Riding", category: "Physical", proficiency: "advanced" },
  { id: "sk3", name: "Gymnastics", category: "Physical", proficiency: "advanced" },
  { id: "sk4", name: "Piano", category: "Musical", proficiency: "advanced" },
  { id: "sk5", name: "Kickboxing", category: "Physical", proficiency: "intermediate" },
  { id: "sk6", name: "Swimming (Distance)", category: "Physical", proficiency: "advanced" },
  { id: "sk7", name: "Improv (UCB)", category: "Performance", proficiency: "expert" },
  { id: "sk8", name: "Dialect Work", category: "Performance", proficiency: "expert" },
];

const mockEvents = [
  { id: "ev1", title: "SAG Awards Ceremony", venue: "Shrine Auditorium", city: "Los Angeles", country: "US", date: "2024-02-24", is_upcoming: false, description: "Nominated — Outstanding Female Actor in a Drama Series.", ticket_url: null, event_type: "awards" },
  { id: "ev2", title: "Sundance Film Festival — 'Ember' Premiere", venue: "Eccles Theatre", city: "Park City", country: "US", date: "2024-01-20", is_upcoming: false, description: "World premiere screening + Q&A.", ticket_url: null, event_type: "festival" },
];

const mockClients = ["HBO", "A24", "Apple TV+", "Blumhouse", "Searchlight", "ABC"];

const mockKnownFor = mockCredits;
const featuredProject = mockCredits[0];

/* ══════════════════════ ACTOR-SPECIFIC DEFAULTS ══════════════════════ */

const actorDefaultVariants: SectionVariants = {
  ...defaultVariants,
  demoReels: 'featured',
  credits: 'poster',
  gallery: 'grid',
  heroLayout: 'classic',
  heroRightContent: 'showreel',
  ctaPreset: 'contact',
  heroKnownFor: 'strip',
};

/* ══════════════════════ LAYOUT COMPONENTS ══════════════════════ */

const ClassicLayout = () => (
  <>
    <div className="mb-10">
      <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} />
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Demo Reels" index={0}>
        <DemoReelsWithToggle items={mockDemoReels} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Known For" index={-1}>
        <KnownForWithToggle items={mockKnownFor} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Credits" index={1}>
        <CreditsWithToggle items={mockCredits} profileType="actor" />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Headshots & Gallery" index={2}>
        <GalleryWithToggle items={mockGallery} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Training" index={3}>
        <EducationWithToggle items={mockEducation} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Special Skills" index={4}>
        <SkillsWithToggle items={mockSkills} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Awards & Recognition" index={5}>
        <AwardsWithToggle items={mockAwards} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Press & Reviews" index={6}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Testimonials" index={7}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Representation" index={8}>
        <RepresentationWithToggle items={mockRepresentation} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Worked With" index={9}>
        <ClientLogosWithToggle companies={mockClients} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Events & Appearances" index={10}>
        <EventsWithToggle items={mockEvents} />
      </PortfolioSectionWrapper>
    </div>
  </>
);

const StandardLayout = () => (
  <>
    <div className="mb-10">
      <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} />
    </div>
    <div className="mb-10">
      <ClientLogosWithToggle companies={mockClients} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-10">
      <PortfolioSectionWrapper title="Demo Reels" index={0}>
        <DemoReelsWithToggle items={mockDemoReels} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Representation" index={1}>
        <RepresentationWithToggle items={mockRepresentation} />
      </PortfolioSectionWrapper>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mb-10">
      <PortfolioSectionWrapper title="Credits" index={2}>
        <CreditsWithToggle items={mockCredits} profileType="actor" />
      </PortfolioSectionWrapper>
      <div className="space-y-6">
        <PortfolioSectionWrapper title="Awards" index={3}>
          <AwardsWithToggle items={mockAwards} />
        </PortfolioSectionWrapper>
        <PortfolioSectionWrapper title="Training" index={4}>
          <EducationWithToggle items={mockEducation} />
        </PortfolioSectionWrapper>
      </div>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Headshots & Gallery" index={5}>
        <GalleryWithToggle items={mockGallery} />
      </PortfolioSectionWrapper>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PortfolioSectionWrapper title="Testimonials" index={6}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Press" index={7}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
    </div>
  </>
);

const CinematicLayout = () => (
  <>
    <div className="mb-12">
      <PortfolioSectionWrapper title="Demo Reels" index={0}>
        <DemoReelsWithToggle items={mockDemoReels} />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} />
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Known For" index={-1}>
        <KnownForWithToggle items={mockKnownFor} display="image" />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Credits" index={1}>
        <CreditsWithToggle items={mockCredits} profileType="actor" />
      </PortfolioSectionWrapper>
    </div>
    <div className="mb-10">
      <PortfolioSectionWrapper title="Headshots & Gallery" index={2}>
        <GalleryWithToggle items={mockGallery} />
      </PortfolioSectionWrapper>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <PortfolioSectionWrapper title="Awards" index={3}>
        <AwardsWithToggle items={mockAwards} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Press" index={4}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Testimonials" index={5}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
  </>
);

const CompactLayout = () => (
  <>
    <div className="mb-8">
      <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <PortfolioSectionWrapper title="Demo Reels" index={0}>
        <DemoReelsWithToggle items={mockDemoReels} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Credits" index={1}>
        <CreditsWithToggle items={mockCredits} profileType="actor" />
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
      <PortfolioSectionWrapper title="Gallery" index={4}>
        <GalleryWithToggle items={mockGallery} />
      </PortfolioSectionWrapper>
    </div>
  </>
);

const MagazineLayout = () => (
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
    <div className="space-y-10">
      <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} />
      <PortfolioSectionWrapper title="Demo Reels" index={0}>
        <DemoReelsWithToggle items={mockDemoReels} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Credits" index={1}>
        <CreditsWithToggle items={mockCredits} profileType="actor" />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Headshots & Gallery" index={2}>
        <GalleryWithToggle items={mockGallery} />
      </PortfolioSectionWrapper>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <PortfolioSectionWrapper title="Awards" index={3}>
          <AwardsWithToggle items={mockAwards} />
        </PortfolioSectionWrapper>
        <PortfolioSectionWrapper title="Press" index={4}>
          <PressWithToggle items={mockPress} />
        </PortfolioSectionWrapper>
      </div>
    </div>
    <div className="space-y-8">
      <PortfolioSectionWrapper title="Representation" index={5}>
        <RepresentationWithToggle items={mockRepresentation} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Training" index={6}>
        <EducationWithToggle items={mockEducation} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Special Skills" index={7}>
        <SkillsWithToggle items={mockSkills} />
      </PortfolioSectionWrapper>
      <PortfolioSectionWrapper title="Testimonials" index={8}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
  </div>
);

const SpotlightLayout = () => {
  const theme = usePortfolioTheme();
  const [openSection, setOpenSection] = useState<string>("reels");

  const sections = [
    { key: "stats", title: "Physical Stats", content: <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} /> },
    { key: "reels", title: "Demo Reels", content: <DemoReelsWithToggle items={mockDemoReels} /> },
    { key: "credits", title: "Credits", content: <CreditsWithToggle items={mockCredits} profileType="actor" /> },
    { key: "gallery", title: "Headshots & Gallery", content: <GalleryWithToggle items={mockGallery} /> },
    { key: "awards", title: "Awards & Recognition", content: <AwardsWithToggle items={mockAwards} /> },
    { key: "testimonials", title: "Testimonials", content: <TestimonialsWithToggle items={mockTestimonials} /> },
    { key: "press", title: "Press & Reviews", content: <PressWithToggle items={mockPress} /> },
    { key: "training", title: "Training", content: <EducationWithToggle items={mockEducation} /> },
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
    { year: 2024, title: "The Vigil & SAG Nomination", content: <CreditsWithToggle items={mockCredits.filter(c => c.year >= 2024)} profileType="actor" /> },
    { year: 2023, title: "Ember & Breakthrough Awards", content: (
      <div className="space-y-4">
        <CreditsWithToggle items={mockCredits.filter(c => c.year === 2023)} profileType="actor" />
        <AwardsWithToggle items={mockAwards.filter(a => a.year === 2023)} />
      </div>
    )},
    { year: 2022, title: "Quiet Hours & Early Recognition", content: (
      <div className="space-y-4">
        <CreditsWithToggle items={mockCredits.filter(c => c.year === 2022)} profileType="actor" />
        <AwardsWithToggle items={mockAwards.filter(a => a.year === 2022)} />
      </div>
    )},
    { year: 2021, title: "Early Credits", content: <CreditsWithToggle items={mockCredits.filter(c => c.year <= 2021)} profileType="actor" /> },
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
      <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} />
    </div>
    <div className="sm:col-span-2">
      <PortfolioSectionWrapper title="Demo Reels" index={0}>
        <DemoReelsWithToggle items={mockDemoReels} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Representation" index={1}>
        <RepresentationWithToggle items={mockRepresentation} />
      </PortfolioSectionWrapper>
    </div>
    <div className="sm:col-span-2 lg:col-span-3">
      <PortfolioSectionWrapper title="Credits" index={2}>
        <CreditsWithToggle items={mockCredits} profileType="actor" />
      </PortfolioSectionWrapper>
    </div>
    <div className="sm:col-span-2">
      <PortfolioSectionWrapper title="Headshots & Gallery" index={3}>
        <GalleryWithToggle items={mockGallery} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Awards" index={4}>
        <AwardsWithToggle items={mockAwards} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Press" index={5}>
        <PressWithToggle items={mockPress} />
      </PortfolioSectionWrapper>
    </div>
    <div className="sm:col-span-2">
      <PortfolioSectionWrapper title="Testimonials" index={6}>
        <TestimonialsWithToggle items={mockTestimonials} />
      </PortfolioSectionWrapper>
    </div>
  </div>
);

const MinimalLayout = () => (
  <div className="max-w-2xl mx-auto space-y-16">
    <div>
      <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} />
    </div>
    <div>
      <PortfolioSectionWrapper title="Reels" index={0}>
        <DemoReelsWithToggle items={mockDemoReels} />
      </PortfolioSectionWrapper>
    </div>
    <div>
      <PortfolioSectionWrapper title="Credits" index={1}>
        <CreditsWithToggle items={mockCredits} profileType="actor" />
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

const DashboardLayoutComponent = () => {
  const theme = usePortfolioTheme();
  const statCards = [
    { icon: Eye, label: "Credits", value: mockCredits.length.toString(), sub: "Film & TV" },
    { icon: Award, label: "Awards", value: mockAwards.length.toString(), sub: "Nominations & wins" },
    { icon: FileText, label: "Reels", value: mockDemoReels.length.toString(), sub: "Demo reels" },
    { icon: TrendingUp, label: "Status", value: "Available", sub: "Pilot season" },
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
      <div className="mb-8">
        <SectionActorStats stats={mockActorStats} profilePhoto={mockProfile.profile_photo_url} displayName={mockProfile.display_name} representation={mockRepresentation} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Demo Reels</h3>
          <DemoReelsWithToggle items={mockDemoReels} />
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Credits</h3>
          <CreditsWithToggle items={mockCredits} profileType="actor" />
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
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: theme.textSecondary }}>Testimonials</h3>
          <TestimonialsWithToggle items={mockTestimonials} />
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

const DemoActor = () => {
  const [themeId, setThemeId] = useState("cinematic-dark");
  const [layoutPreset, setLayoutPreset] = useState<LayoutPreset>("classic");
  const [variants, setVariants] = useState<SectionVariants>(actorDefaultVariants);

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
        representation={mockRepresentation}
        featuredProject={featuredProject}
        stats={{ scripts: 0, developing: 0, awards: mockAwards.length }}
        knownFor={mockKnownFor}
        heroLayout={variants.heroLayout}
        heroRightContent={variants.heroRightContent}
        heroKnownFor={variants.heroKnownFor}
        services={[]}
        testimonials={mockTestimonials}
        demoReels={mockDemoReels}
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
            Create your own actor portfolio
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

export default DemoActor;
