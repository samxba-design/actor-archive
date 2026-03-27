import React from "react";
import { useEditMode } from "./EditModeProvider";
import SortableSectionList from "./SortableSectionList";
import PortfolioSection from "./PortfolioSection";

interface SectionItem {
  key: string;
  label: string;
}

interface Props {
  allSections: SectionItem[];
  sectionOrder: string[];
  sectionsVisible: Record<string, boolean>;
  profileId: string;
  profileType: string | null;
  profileSlug?: string;
  bio?: string | null;
  layoutPreset?: string;
}

/**
 * ProfileLayoutRenderer handles different layout presets for portfolio sections.
 * In edit mode, always uses single-column vertical layout.
 * In view mode, renders the chosen layout preset.
 */
const ProfileLayoutRenderer = ({
  allSections,
  sectionOrder,
  sectionsVisible,
  profileId,
  profileType,
  profileSlug,
  bio,
  layoutPreset = "classic",
}: Props) => {
  const { editMode } = useEditMode();

  // In edit mode, always use single-column draggable layout
  if (editMode) {
    return (
      <SortableSectionList
        allSections={allSections}
        profileId={profileId}
        profileType={profileType}
        profileSlug={profileSlug}
        bio={bio}
      />
    );
  }

  // Get visible sections in order
  const visibleSections = sectionOrder.filter((key) => sectionsVisible[key] !== false);

  // Classic: single column (default behavior)
  if (layoutPreset === "classic" || layoutPreset === "standard" || layoutPreset === "compact") {
    return (
      <div className="space-y-12">
        {visibleSections.map((key, idx) => (
          <PortfolioSection
            key={key}
            sectionKey={key}
            profileId={profileId}
            profileType={profileType}
            profileSlug={profileSlug}
            sectionIndex={idx}
            bio={key === "bio" ? bio : undefined}
          />
        ))}
      </div>
    );
  }

  // Magazine: two-column (main + sidebar)
  if (layoutPreset === "magazine") {
    const sidebarSections = ["stats_bar", "representation", "skills", "education", "awards", "social_links"];
    const mainSections = visibleSections.filter((s) => !sidebarSections.includes(s));
    const activeSidebarSections = visibleSections.filter((s) => sidebarSections.includes(s));

    return (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-12">
          {mainSections.map((key, idx) => (
            <PortfolioSection
              key={key}
              sectionKey={key}
              profileId={profileId}
              profileType={profileType}
              profileSlug={profileSlug}
              sectionIndex={idx}
              bio={key === "bio" ? bio : undefined}
            />
          ))}
        </div>
        <div className="space-y-8">
          {activeSidebarSections.map((key) => (
            <PortfolioSection
              key={key}
              sectionKey={key}
              profileId={profileId}
              profileType={profileType}
              profileSlug={profileSlug}
              bio={key === "bio" ? bio : undefined}
            />
          ))}
        </div>
      </div>
    );
  }

  // Bento: CSS grid with auto-layout
  if (layoutPreset === "bento") {
    const wideItems = ["credits", "projects", "demo_reels", "gallery", "case_studies", "campaign_timeline"];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
        {visibleSections.map((key, idx) => {
          const isWide = wideItems.includes(key);
          return (
            <div key={key} className={isWide ? "sm:col-span-2 lg:col-span-3" : ""}>
              <PortfolioSection
                sectionKey={key}
                profileId={profileId}
                profileType={profileType}
                profileSlug={profileSlug}
                sectionIndex={idx}
                bio={key === "bio" ? bio : undefined}
              />
            </div>
          );
        })}
      </div>
    );
  }

  // Spotlight: Accordion-style (not implemented yet, fallback to classic)
  if (layoutPreset === "spotlight") {
    return (
      <div className="space-y-12">
        {visibleSections.map((key, idx) => (
          <PortfolioSection
            key={key}
            sectionKey={key}
            profileId={profileId}
            profileType={profileType}
            profileSlug={profileSlug}
            sectionIndex={idx}
            bio={key === "bio" ? bio : undefined}
          />
        ))}
      </div>
    );
  }

  // Minimal: Extra whitespace, centered
  if (layoutPreset === "minimal") {
    return (
      <div className="max-w-2xl mx-auto space-y-20">
        {visibleSections.map((key, idx) => (
          <PortfolioSection
            key={key}
            sectionKey={key}
            profileId={profileId}
            profileType={profileType}
            profileSlug={profileSlug}
            sectionIndex={idx}
            bio={key === "bio" ? bio : undefined}
          />
        ))}
      </div>
    );
  }

  // Dashboard: Stats grid at top, then 2-column grid for sections (not implemented yet, fallback to classic)
  if (layoutPreset === "dashboard") {
    return (
      <div className="space-y-12">
        {visibleSections.map((key, idx) => (
          <PortfolioSection
            key={key}
            sectionKey={key}
            profileId={profileId}
            profileType={profileType}
            profileSlug={profileSlug}
            sectionIndex={idx}
            bio={key === "bio" ? bio : undefined}
          />
        ))}
      </div>
    );
  }

  // Timeline: Chronological (not implemented yet, fallback to classic)
  if (layoutPreset === "timeline") {
    return (
      <div className="space-y-12">
        {visibleSections.map((key, idx) => (
          <PortfolioSection
            key={key}
            sectionKey={key}
            profileId={profileId}
            profileType={profileType}
            profileSlug={profileSlug}
            sectionIndex={idx}
            bio={key === "bio" ? bio : undefined}
          />
        ))}
      </div>
    );
  }

  // Default fallback
  return (
    <div className="space-y-12">
      {visibleSections.map((key, idx) => (
        <PortfolioSection
          key={key}
          sectionKey={key}
          profileId={profileId}
          profileType={profileType}
          profileSlug={profileSlug}
          sectionIndex={idx}
          bio={key === "bio" ? bio : undefined}
        />
      ))}
    </div>
  );
};

export default ProfileLayoutRenderer;
