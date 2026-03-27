/**
 * ProfileLayoutRenderer — renders portfolio sections using different layout presets.
 *
 * Layout presets:
 *  - 'classic'    : Single-column (delegates to SortableSectionList)
 *  - 'magazine'   : Two-column (main + sidebar)
 *  - 'bento'      : CSS grid auto-layout with varying column spans
 *  - 'spotlight'  : Accordion / collapsible sections
 *  - 'minimal'    : Extra whitespace, centered, narrow columns
 *  - 'dashboard'  : Stats cards at top, then 2-column grid
 *  - anything else: falls back to 'classic'
 */
import { useState } from "react";
import PortfolioSection from "./PortfolioSection";
import SortableSectionList from "./SortableSectionList";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEditMode } from "./EditModeProvider";

interface SectionItem {
  key: string;
  label: string;
}

interface Props {
  allSections: SectionItem[];
  profileId: string;
  profileType: string | null;
  /** layout_preset (snake_case) or layoutPreset (camelCase) are both accepted */
  layout_preset?: string | null;
  layoutPreset?: string | null;
  profileSlug?: string;
  bio?: string | null;
  /** Optional override for section order (if not using EditModeProvider's order) */
  sectionOrder?: string[];
  /** Optional override for sections visibility */
  sectionsVisible?: Record<string, boolean>;
}

// Sections that belong in the main (wider) column in magazine layout
const MAGAZINE_MAIN_SECTIONS = [
  "projects", "gallery", "credits", "demo_reels", "scripts",
  "published_works", "press", "case_studies", "events",
];

// Sections that span 2 columns in bento grid
const BENTO_WIDE_SECTIONS = [
  "projects", "gallery", "credits", "demo_reels", "press",
];

// Sections treated as stats/metrics at the top of the dashboard layout
const DASHBOARD_STATS_SECTIONS = ["stats_bar", "skills"];

// ─── Helper: get visible keys ──────────────────────────────────────────────────
function useVisibleKeys(props: Props): string[] {
  const editMode = useEditMode();
  const sectionOrder = props.sectionOrder ?? editMode.sectionOrder;
  const sectionsVisible = props.sectionsVisible ?? editMode.sectionsVisible;

  return sectionOrder.filter(
    (k) => k !== "hero" && k !== "contact" && sectionsVisible[k] !== false
  );
}

// ─── Classic (fallback) ────────────────────────────────────────────────────────
function ClassicLayout(props: Props) {
  return (
    <SortableSectionList
      allSections={props.allSections}
      profileId={props.profileId}
      profileType={props.profileType}
      profileSlug={props.profileSlug}
      bio={props.bio}
    />
  );
}

// ─── Magazine Layout ───────────────────────────────────────────────────────────
function MagazineLayout(props: Props) {
  const visibleKeys = useVisibleKeys(props);
  const { profileId, profileType, profileSlug, bio } = props;

  const mainKeys = visibleKeys.filter((k) => MAGAZINE_MAIN_SECTIONS.includes(k));
  const sidebarKeys = visibleKeys.filter((k) => !MAGAZINE_MAIN_SECTIONS.includes(k));

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Main column — ~65% */}
      <div className="flex-1 min-w-0 space-y-14">
        {mainKeys.map((sectionKey, idx) => (
          <PortfolioSection
            key={sectionKey}
            sectionKey={sectionKey}
            profileId={profileId}
            profileType={profileType}
            profileSlug={profileSlug}
            sectionIndex={idx}
            bio={bio}
          />
        ))}
      </div>
      {/* Sidebar — ~35% */}
      <aside className="w-full lg:w-80 shrink-0 space-y-10">
        {sidebarKeys.map((sectionKey, idx) => (
          <PortfolioSection
            key={sectionKey}
            sectionKey={sectionKey}
            profileId={profileId}
            profileType={profileType}
            profileSlug={profileSlug}
            sectionIndex={idx + mainKeys.length}
            bio={bio}
          />
        ))}
      </aside>
    </div>
  );
}

// ─── Bento Layout ─────────────────────────────────────────────────────────────
function BentoLayout(props: Props) {
  const visibleKeys = useVisibleKeys(props);
  const { profileId, profileType, profileSlug, bio } = props;

  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
    >
      {visibleKeys.map((sectionKey, idx) => {
        const isWide = BENTO_WIDE_SECTIONS.includes(sectionKey);
        return (
          <div key={sectionKey} style={{ gridColumn: isWide ? "1 / -1" : undefined }}>
            <PortfolioSection
              sectionKey={sectionKey}
              profileId={profileId}
              profileType={profileType}
              profileSlug={profileSlug}
              sectionIndex={idx}
              bio={bio}
            />
          </div>
        );
      })}
    </div>
  );
}

// ─── Spotlight (Accordion) Layout ─────────────────────────────────────────────
function SpotlightLayout(props: Props) {
  const visibleKeys = useVisibleKeys(props);
  const { allSections, profileId, profileType, profileSlug, bio } = props;
  const sectionLabelMap = Object.fromEntries(allSections.map((s) => [s.key, s.label]));

  // First section open by default
  const [openKeys, setOpenKeys] = useState<Set<string>>(
    () => new Set(visibleKeys.slice(0, 1))
  );

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-2">
      {visibleKeys.map((sectionKey, idx) => {
        const isOpen = openKeys.has(sectionKey);
        const label = sectionLabelMap[sectionKey] || sectionKey.replace(/_/g, " ");
        return (
          <div
            key={sectionKey}
            className="border rounded-xl overflow-hidden"
            style={{
              borderColor: "hsl(var(--portfolio-border-default, var(--border)))",
              background: "hsl(var(--portfolio-bg-elevated, var(--card)))",
            }}
          >
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:opacity-80"
              onClick={() => toggle(sectionKey)}
              aria-expanded={isOpen}
            >
              <span
                className="font-semibold text-base"
                style={{ color: "hsl(var(--portfolio-text-primary, var(--foreground)))" }}
              >
                {label}
              </span>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 shrink-0 opacity-60" />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
              )}
            </button>
            {isOpen && (
              <div className="px-5 pb-5">
                <PortfolioSection
                  sectionKey={sectionKey}
                  profileId={profileId}
                  profileType={profileType}
                  profileSlug={profileSlug}
                  sectionIndex={idx}
                  bio={bio}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Minimal Layout ────────────────────────────────────────────────────────────
function MinimalLayout(props: Props) {
  const visibleKeys = useVisibleKeys(props);
  const { profileId, profileType, profileSlug, bio } = props;

  return (
    <div className="max-w-2xl mx-auto space-y-20">
      {visibleKeys.map((sectionKey, idx) => (
        <PortfolioSection
          key={sectionKey}
          sectionKey={sectionKey}
          profileId={profileId}
          profileType={profileType}
          profileSlug={profileSlug}
          sectionIndex={idx}
          bio={bio}
        />
      ))}
    </div>
  );
}

// ─── Dashboard Layout ──────────────────────────────────────────────────────────
function DashboardLayout(props: Props) {
  const visibleKeys = useVisibleKeys(props);
  const { profileId, profileType, profileSlug, bio } = props;

  const statsKeys = visibleKeys.filter((k) => DASHBOARD_STATS_SECTIONS.includes(k));
  const restKeys = visibleKeys.filter((k) => !DASHBOARD_STATS_SECTIONS.includes(k));

  const leftCol = restKeys.filter((_, i) => i % 2 === 0);
  const rightCol = restKeys.filter((_, i) => i % 2 !== 0);

  return (
    <div className="space-y-10">
      {/* Stats row */}
      {statsKeys.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {statsKeys.map((sectionKey, idx) => (
            <PortfolioSection
              key={sectionKey}
              sectionKey={sectionKey}
              profileId={profileId}
              profileType={profileType}
              profileSlug={profileSlug}
              sectionIndex={idx}
              bio={bio}
            />
          ))}
        </div>
      )}
      {/* Two-column content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          {leftCol.map((sectionKey, idx) => (
            <PortfolioSection
              key={sectionKey}
              sectionKey={sectionKey}
              profileId={profileId}
              profileType={profileType}
              profileSlug={profileSlug}
              sectionIndex={statsKeys.length + idx * 2}
              bio={bio}
            />
          ))}
        </div>
        <div className="space-y-10">
          {rightCol.map((sectionKey, idx) => (
            <PortfolioSection
              key={sectionKey}
              sectionKey={sectionKey}
              profileId={profileId}
              profileType={profileType}
              profileSlug={profileSlug}
              sectionIndex={statsKeys.length + idx * 2 + 1}
              bio={bio}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Root component ────────────────────────────────────────────────────────────
const ProfileLayoutRenderer = (props: Props) => {
  // Accept both camelCase and snake_case prop names
  const preset = props.layoutPreset ?? props.layout_preset ?? "classic";

  switch (preset) {
    case "magazine":
      return <MagazineLayout {...props} />;
    case "bento":
      return <BentoLayout {...props} />;
    case "spotlight":
      return <SpotlightLayout {...props} />;
    case "minimal":
      return <MinimalLayout {...props} />;
    case "dashboard":
      return <DashboardLayout {...props} />;
    default:
      // classic, standard, cinematic, compact, timeline — all use classic single-column
      return <ClassicLayout {...props} />;
  }
};

export default ProfileLayoutRenderer;
