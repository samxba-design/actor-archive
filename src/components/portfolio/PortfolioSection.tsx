import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// All project columns EXCEPT password_hash (security: never expose to public)
const SAFE_PROJECT_COLS = "id,profile_id,title,project_type,description,logline,genre,format,status,year,display_order,is_featured,is_notable,poster_url,backdrop_url,custom_image_url,thumbnail_url,video_url,video_type,video_thumbnail_url,role_name,role_type,director,notable_cast,network_or_studio,production_company,runtime_minutes,synopsis,network,show_role,credit_medium,cast_size_notation,duration,set_requirements,rights_status,publisher,isbn,publication,article_url,beat,client,challenge,solution,results,writing_samples_category,tags,page_count,access_level,project_slug,imdb_link,season_number,episode_count,coverage_excerpt,script_pdf_url,series_bible_url,nda_url,comparable_titles,metric_callouts,purchase_links,chapters,created_at,updated_at,tmdb_id";
import SectionProjects from "./sections/SectionProjects";
import SectionGallery from "./sections/SectionGallery";
import SectionAwards from "./sections/SectionAwards";
import SectionPress from "./sections/SectionPress";
import SectionEducation from "./sections/SectionEducation";
import SectionSkills from "./sections/SectionSkills";
import SectionServices from "./sections/SectionServices";
import SectionTestimonials from "./sections/SectionTestimonials";
import SectionEvents from "./sections/SectionEvents";
import SectionRepresentation from "./sections/SectionRepresentation";
import SectionActorStats from "./sections/SectionActorStats";
import SectionDemoReels from "./sections/SectionDemoReels";
import SectionScriptLibrary from "./sections/SectionScriptLibrary";
import SectionLoglineShowcase from "./sections/SectionLoglineShowcase";
import SectionBookshelf from "./sections/SectionBookshelf";
import SectionArticleFeed from "./sections/SectionArticleFeed";
import SectionCaseStudies from "./sections/SectionCaseStudies";
import SectionProductionHistory from "./sections/SectionProductionHistory";
import SectionWritingSamples from "./sections/SectionWritingSamples";
import SectionResultsWall from "./sections/SectionResultsWall";
import SectionVideoPortfolio from "./sections/SectionVideoPortfolio";
import SectionCampaignTimeline from "./sections/SectionCampaignTimeline";
import SectionClientLogos from "./sections/SectionClientLogos";
import SectionPublishedWork from "./sections/SectionPublishedWork";
import SectionCollections from "./sections/SectionCollections";
import SectionCustom from "./sections/SectionCustom";
import SectionBio from "./sections/SectionBio";
import SectionSocialLinks from "./sections/SectionSocialLinks";
import SectionAvailability from "./sections/SectionAvailability";
import { getProfileTypeConfig } from "@/config/profileSections";

interface Props {
  sectionKey: string;
  profileId: string;
  profileType: string | null;
  profileSlug?: string;
  sectionIndex?: number;
  /** Pass bio text for the bio section */
  bio?: string | null;
}

const defaultSectionLabels: Record<string, string> = {
  projects: "Projects",
  credits: "Credits",
  gallery: "Gallery",
  awards: "Awards & Recognition",
  press: "Press & Reviews",
  education: "Education & Training",
  training: "Training",
  skills: "Skills",
  services: "Services",
  testimonials: "Testimonials",
  events: "Events",
  contact: "Contact",
  representation: "Representation",
  stats_bar: "Stats",
  demo_reels: "Demo Reels",
  logline_showcase: "Logline Showcase",
  script_library: "Script Library",
  bookshelf: "Bookshelf",
  article_feed: "Articles",
  case_studies: "Case Studies",
  client_logos: "Clients",
  production_history: "Production History",
  writing_samples: "Writing Samples",
  results_wall: "Impact Numbers",
  video_portfolio: "Video Portfolio",
  campaign_timeline: "Campaign Timeline",
  published_work: "Published Work",
  custom_sections: "Custom Sections",
  bio: "About",
  achievements: "Notable Achievements",
  social_links: "Connect",
  availability: "Availability",
  staffing_info: "Staffing",
  diversity_programs: "Programs & Fellowships",
  publication_logos: "Publications",
};

function getContextualLabel(sectionKey: string, profileType: string | null): string {
  if (profileType) {
    const config = getProfileTypeConfig(profileType);
    if (config) {
      const section = config.sections.find((s) => s.key === sectionKey);
      if (section) return section.label;
    }
  }
  return defaultSectionLabels[sectionKey] || sectionKey;
}

const PortfolioSection = ({ sectionKey, profileId, profileType, profileSlug, sectionIndex, bio }: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [singleData, setSingleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(el); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      let rows: any[] = [];
      const orderOpts = { ascending: true } as const;

      switch (sectionKey) {
        case "bio": {
          // Bio uses profile-level data, no table fetch needed
          setData([]);
          setLoading(false);
          return;
        }
        case "social_links": {
          const { data } = await supabase.from("social_links").select("*").eq("profile_id", profileId).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "availability": {
          const { data } = await supabase.from("actor_stats").select("*").eq("profile_id", profileId).maybeSingle();
          setSingleData(data);
          setData([]);
          setLoading(false);
          return;
        }
        case "staffing_info":
        case "diversity_programs":
        case "publication_logos": {
          // These use client_logos_profile table as a fallback (publication logos = client logos for journalists)
          if (sectionKey === "publication_logos") {
            const { data } = await supabase.from("client_logos_profile").select("*").eq("profile_id", profileId).order("display_order", orderOpts);
            rows = data || [];
          } else {
            // staffing_info and diversity_programs are text-based — render from custom_sections
            const { data } = await supabase.from("custom_sections").select("*").eq("profile_id", profileId).eq("section_type", sectionKey).eq("is_visible", true).order("display_order", orderOpts);
            rows = data || [];
          }
          break;
        }
        case "projects": {
          const { data } = await supabase.from("projects").select(SAFE_PROJECT_COLS).eq("profile_id", profileId).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "credits": {
          const { data } = await supabase.from("projects").select(SAFE_PROJECT_COLS).eq("profile_id", profileId).in("project_type", ["film", "tv_show"]).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "gallery": {
          const { data } = await supabase.from("gallery_images").select("*").eq("profile_id", profileId).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "awards":
        case "achievements": {
          const { data } = await supabase.from("awards").select("*").eq("profile_id", profileId).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "press": {
          const { data } = await supabase.from("press").select("*").eq("profile_id", profileId).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "education":
        case "training": {
          const { data } = await supabase.from("education").select("*").eq("profile_id", profileId).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "skills": {
          const { data } = await supabase.from("skills").select("*").eq("profile_id", profileId).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "services": {
          const { data } = await supabase.from("services").select("*").eq("profile_id", profileId).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "testimonials": {
          const { data } = await supabase.from("testimonials").select("*").eq("profile_id", profileId).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "events": {
          const { data } = await supabase.from("events").select("*").eq("profile_id", profileId).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "representation": {
          const { data } = await supabase.from("representation").select("id,profile_id,rep_type,name,company,department,market,logo_url,display_order,is_primary,email,phone,created_at,updated_at").eq("profile_id", profileId).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "stats_bar": {
          const { data } = await supabase.from("actor_stats").select("*").eq("profile_id", profileId).maybeSingle();
          setSingleData(data);
          setData([]);
          setLoading(false);
          return;
        }
        case "demo_reels": {
          const { data } = await supabase.from("projects").select(SAFE_PROJECT_COLS).eq("profile_id", profileId).not("video_url", "is", null).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "logline_showcase": {
          const { data } = await supabase.from("projects").select(SAFE_PROJECT_COLS).eq("profile_id", profileId).not("logline", "is", null).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "script_library": {
          const { data } = await supabase.from("projects").select(SAFE_PROJECT_COLS).eq("profile_id", profileId).in("project_type", ["screenplay", "pilot", "spec_script", "play", "series_bible", "comedy_packet"]).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "bookshelf": {
          const { data } = await supabase.from("projects").select(SAFE_PROJECT_COLS).eq("profile_id", profileId).in("project_type", ["novel", "book", "short_story"]).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "article_feed": {
          const { data } = await supabase.from("projects").select(SAFE_PROJECT_COLS).eq("profile_id", profileId).in("project_type", ["article"]).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "case_studies": {
          const { data } = await supabase.from("projects").select(SAFE_PROJECT_COLS).eq("profile_id", profileId).in("project_type", ["case_study"]).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "writing_samples": {
          const { data } = await supabase.from("projects").select(SAFE_PROJECT_COLS).eq("profile_id", profileId).in("project_type", ["writing_sample"]).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "production_history": {
          const { data } = await supabase.from("production_history").select("*").eq("profile_id", profileId).order("created_at", orderOpts);
          rows = data || [];
          break;
        }
        case "results_wall": {
          const { data } = await supabase.from("projects").select(SAFE_PROJECT_COLS).eq("profile_id", profileId).in("project_type", ["case_study"]).not("metric_callouts", "is", null).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "video_portfolio": {
          const { data } = await supabase.from("projects").select(SAFE_PROJECT_COLS).eq("profile_id", profileId).in("project_type", ["campaign", "video"]).not("video_url", "is", null).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "campaign_timeline": {
          const { data } = await supabase.from("projects").select(SAFE_PROJECT_COLS).eq("profile_id", profileId).in("project_type", ["campaign", "case_study"]).order("year", { ascending: false });
          rows = data || [];
          break;
        }
        case "client_logos": {
          const { data } = await supabase.from("client_logos_profile").select("*").eq("profile_id", profileId).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "published_work": {
          const [{ data: pwData }, { data: colData }] = await Promise.all([
            supabase.from("published_works").select("*").eq("profile_id", profileId).order("display_order", orderOpts),
            supabase.from("work_collections").select("*").eq("profile_id", profileId).order("display_order", orderOpts),
          ]);
          rows = pwData || [];
          // Store collections in singleData for the renderer
          setSingleData(colData || []);
          break;
        }
        case "custom_sections": {
          const { data } = await supabase.from("custom_sections").select("*").eq("profile_id", profileId).eq("is_visible", true).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "collections": {
          const [{ data: colData }, { data: pwData }] = await Promise.all([
            supabase.from("work_collections").select("*").eq("profile_id", profileId).order("display_order", orderOpts),
            supabase.from("published_works").select("*").eq("profile_id", profileId).order("display_order", orderOpts),
          ]);
          rows = pwData || [];
          setSingleData(colData || []);
          break;
        }
        default:
          break;
      }

      setData(rows);
      setLoading(false);
    };

    fetchData();
  }, [sectionKey, profileId]);

  if (loading) {
    return (
      <section ref={sectionRef} className="animate-pulse space-y-4">
        <div className="h-6 rounded w-32" style={{ backgroundColor: "hsl(var(--portfolio-accent) / 0.08)" }} />
        <div className="h-2 rounded w-24" style={{ backgroundColor: "hsl(var(--portfolio-accent) / 0.05)" }} />
        <div className="h-20 rounded" style={{ backgroundColor: "hsl(var(--portfolio-accent) / 0.04)" }} />
      </section>
    );
  }

  // Bio section — special handling
  if (sectionKey === "bio") {
    if (!bio) return null;
    const label = getContextualLabel(sectionKey, profileType);
    const indexNum = sectionIndex !== undefined ? String(sectionIndex + 1).padStart(2, "0") : null;
    return (
      <section
        ref={sectionRef}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        }}
      >
        <div className="flex items-baseline gap-3 mb-2">
          {indexNum && (
            <span className="text-xs font-mono tracking-widest" style={{ color: "hsl(var(--portfolio-accent) / 0.4)" }}>
              {indexNum}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--portfolio-heading-font)", color: "hsl(var(--portfolio-fg))" }}>
            {label}
          </h2>
        </div>
        <div className="mb-8" style={{ height: "2px", background: "linear-gradient(to right, hsl(var(--portfolio-accent) / 0.5), hsl(var(--portfolio-accent) / 0.05))", maxWidth: "120px" }} />
        <SectionBio bio={bio} />
      </section>
    );
  }

  // Availability section — uses singleData
  if (sectionKey === "availability") {
    if (!singleData) return null;
    const label = getContextualLabel(sectionKey, profileType);
    const indexNum = sectionIndex !== undefined ? String(sectionIndex + 1).padStart(2, "0") : null;
    return (
      <section
        ref={sectionRef}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        }}
      >
        <div className="flex items-baseline gap-3 mb-2">
          {indexNum && (
            <span className="text-xs font-mono tracking-widest" style={{ color: "hsl(var(--portfolio-accent) / 0.4)" }}>
              {indexNum}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--portfolio-heading-font)", color: "hsl(var(--portfolio-fg))" }}>
            {label}
          </h2>
        </div>
        <div className="mb-8" style={{ height: "2px", background: "linear-gradient(to right, hsl(var(--portfolio-accent) / 0.5), hsl(var(--portfolio-accent) / 0.05))", maxWidth: "120px" }} />
        <SectionAvailability stats={singleData} />
      </section>
    );
  }

  // stats_bar is special: uses singleData, not array
  if (sectionKey === "stats_bar") {
    if (!singleData) return null;
    return (
      <section
        ref={sectionRef}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        }}
      >
        <SectionActorStats stats={singleData} />
      </section>
    );
  }

  if (data.length === 0 && sectionKey !== "contact") return null;

  const label = getContextualLabel(sectionKey, profileType);
  const indexNum = sectionIndex !== undefined ? String(sectionIndex + 1).padStart(2, "0") : null;

  const renderSection = () => {
    switch (sectionKey) {
      case "projects":
        return <SectionProjects items={data} profileType={profileType} profileSlug={profileSlug} />;
      case "credits":
        return <SectionProjects items={data} profileType={profileType} profileSlug={profileSlug} isCredits />;
      case "gallery":
        return <SectionGallery items={data} />;
      case "awards":
      case "achievements":
        return <SectionAwards items={data} />;
      case "press":
        return <SectionPress items={data} />;
      case "education":
      case "training":
        return <SectionEducation items={data} />;
      case "skills":
        return <SectionSkills items={data} />;
      case "services":
        return <SectionServices items={data} />;
      case "testimonials":
        return <SectionTestimonials items={data} />;
      case "events":
        return <SectionEvents items={data} />;
      case "representation":
        return <SectionRepresentation items={data} />;
      case "demo_reels":
        return <SectionDemoReels items={data} />;
      case "logline_showcase":
        return <SectionLoglineShowcase items={data} />;
      case "script_library":
        return <SectionScriptLibrary items={data} />;
      case "bookshelf":
        return <SectionBookshelf items={data} />;
      case "article_feed":
        return <SectionArticleFeed items={data} />;
      case "case_studies":
        return <SectionCaseStudies items={data} />;
      case "writing_samples":
        return <SectionWritingSamples items={data} />;
      case "production_history":
        return <SectionProductionHistory items={data} />;
      case "results_wall":
        return <SectionResultsWall items={data} />;
      case "video_portfolio":
        return <SectionVideoPortfolio items={data} />;
      case "campaign_timeline":
        return <SectionCampaignTimeline items={data} />;
      case "client_logos":
      case "publication_logos":
        return <SectionClientLogos items={data} variant="bar" colorMode="original" logoSize="md" />;
      case "published_work": {
        const collections = (singleData as any[]) || [];
        if (collections.length > 0) {
          return <SectionCollections collections={collections} works={data} />;
        }
        return <SectionPublishedWork items={data} />;
      }
      case "custom_sections":
      case "staffing_info":
      case "diversity_programs":
        return <SectionCustom sections={data} />;
      case "social_links":
        return <SectionSocialLinks items={data} />;
      default:
        return null;
    }
  };

  return (
    <section
      ref={sectionRef}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}
    >
      {/* Section heading with number + accent rule */}
      <div className="flex items-baseline gap-3 mb-2">
        {indexNum && (
          <span
            className="text-xs font-mono tracking-widest"
            style={{ color: "hsl(var(--portfolio-accent) / 0.4)" }}
          >
            {indexNum}
          </span>
        )}
        <h2
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--portfolio-heading-font)", color: "hsl(var(--portfolio-fg))" }}
        >
          {label}
        </h2>
      </div>
      <div
        className="mb-8"
        style={{
          height: "2px",
          background: "linear-gradient(to right, hsl(var(--portfolio-accent) / 0.5), hsl(var(--portfolio-accent) / 0.05))",
          maxWidth: "120px",
        }}
      />
      {renderSection()}
    </section>
  );
};

export default PortfolioSection;
