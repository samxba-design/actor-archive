import { useEffect, useState } from "react";
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

interface Props {
  sectionKey: string;
  profileId: string;
  profileType: string | null;
}

const sectionLabels: Record<string, string> = {
  projects: "Projects",
  credits: "Credits",
  gallery: "Gallery",
  awards: "Awards & Recognition",
  press: "Press & Reviews",
  education: "Education & Training",
  skills: "Skills",
  services: "Services",
  testimonials: "Testimonials",
  events: "Events",
  contact: "Contact",
};

const PortfolioSection = ({ sectionKey, profileId, profileType }: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        case "education": {
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
        default:
          break;
      }

      setData(rows);
      setLoading(false);
    };

    fetchData();
  }, [sectionKey, profileId]);

  if (loading) return null;
  if (data.length === 0 && sectionKey !== "contact") return null;

  const label = sectionLabels[sectionKey] || sectionKey;

  const renderSection = () => {
    switch (sectionKey) {
      case "projects":
        return <SectionProjects items={data} profileType={profileType} />;
      case "credits":
        return <SectionProjects items={data} profileType={profileType} isCredits />;
      case "gallery":
        return <SectionGallery items={data} />;
      case "awards":
        return <SectionAwards items={data} />;
      case "press":
        return <SectionPress items={data} />;
      case "education":
        return <SectionEducation items={data} />;
      case "skills":
        return <SectionSkills items={data} />;
      case "services":
        return <SectionServices items={data} />;
      case "testimonials":
        return <SectionTestimonials items={data} />;
      case "events":
        return <SectionEvents items={data} />;
      default:
        return null;
    }
  };

  return (
    <section>
      <h2
        className="text-2xl font-bold mb-6 tracking-tight"
        style={{ fontFamily: "var(--portfolio-heading-font)" }}
      >
        {label}
      </h2>
      {renderSection()}
    </section>
  );
};

export default PortfolioSection;
