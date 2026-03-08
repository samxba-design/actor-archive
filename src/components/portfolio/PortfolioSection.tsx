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

  const tableMap: Record<string, string> = {
    projects: "projects",
    credits: "projects",
    gallery: "gallery_images",
    awards: "awards",
    press: "press",
    education: "education",
    skills: "skills",
    services: "services",
    testimonials: "testimonials",
    events: "events",
  };

  useEffect(() => {
    const table = tableMap[sectionKey];
    if (!table) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      const query = supabase
        .from(table)
        .select("*")
        .eq("profile_id", profileId)
        .order("display_order", { ascending: true });

      // For credits section, filter to acting roles
      if (sectionKey === "credits") {
        query.in("project_type", ["film", "tv_show"]);
      }

      const { data: rows } = await query;
      setData(rows || []);
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
