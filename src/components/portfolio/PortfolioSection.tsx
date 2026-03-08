import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { getProfileTypeConfig } from "@/config/profileSections";

interface Props {
  sectionKey: string;
  profileId: string;
  profileType: string | null;
  profileSlug?: string;
  sectionIndex?: number;
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

const PortfolioSection = ({ sectionKey, profileId, profileType, profileSlug, sectionIndex }: Props) => {
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
        case "projects": {
          const { data } = await supabase.from("projects").select("*").eq("profile_id", profileId).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "credits": {
          const { data } = await supabase.from("projects").select("*").eq("profile_id", profileId).in("project_type", ["film", "tv_show"]).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "gallery": {
          const { data } = await supabase.from("gallery_images").select("*").eq("profile_id", profileId).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "awards": {
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
          const { data } = await supabase.from("representation").select("*").eq("profile_id", profileId).order("display_order", orderOpts);
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
          const { data } = await supabase.from("projects").select("*").eq("profile_id", profileId).not("video_url", "is", null).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "logline_showcase": {
          const { data } = await supabase.from("projects").select("*").eq("profile_id", profileId).not("logline", "is", null).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "script_library": {
          const { data } = await supabase.from("projects").select("*").eq("profile_id", profileId).in("project_type", ["screenplay", "pilot", "spec_script", "play", "series_bible", "comedy_packet"]).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "bookshelf": {
          const { data } = await supabase.from("projects").select("*").eq("profile_id", profileId).in("project_type", ["novel", "book", "short_story"]).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "article_feed": {
          const { data } = await supabase.from("projects").select("*").eq("profile_id", profileId).in("project_type", ["article"]).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "case_studies": {
          const { data } = await supabase.from("projects").select("*").eq("profile_id", profileId).in("project_type", ["case_study"]).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "writing_samples": {
          const { data } = await supabase.from("projects").select("*").eq("profile_id", profileId).in("project_type", ["writing_sample"]).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "production_history": {
          const { data } = await supabase.from("production_history").select("*").eq("profile_id", profileId).order("created_at", orderOpts);
          rows = data || [];
          break;
        }
        case "results_wall": {
          const { data } = await supabase.from("projects").select("*").eq("profile_id", profileId).in("project_type", ["case_study"]).not("metric_callouts", "is", null).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "video_portfolio": {
          const { data } = await supabase.from("projects").select("*").eq("profile_id", profileId).in("project_type", ["campaign", "video"]).not("video_url", "is", null).order("display_order", orderOpts);
          rows = data || [];
          break;
        }
        case "campaign_timeline": {
          const { data } = await supabase.from("projects").select("*").eq("profile_id", profileId).in("project_type", ["campaign", "case_study"]).order("year", { ascending: false });
          rows = data || [];
          break;
        }
        case "client_logos": {
          const { data } = await supabase.from("client_logos_profile").select("*").eq("profile_id", profileId).order("display_order", orderOpts);
          rows = data || [];
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

  if (loading) return null;

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
        return <SectionClientLogos items={data} />;
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
