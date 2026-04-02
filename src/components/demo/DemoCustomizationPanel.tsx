import { useEffect, useState } from "react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { useSectionVariants, VARIANT_OPTIONS, type SectionVariants, STOCK_HERO_IMAGES } from "./DemoShared";
import { ChevronDown, ChevronUp, Settings2, Eye, EyeOff, FileDown, Wand2, Sparkles } from "lucide-react";
import { GOAL_MODES, QUICK_RECIPES } from "./demoCustomizationPresets";

interface CategoryConfig {
  label: string;
  keys: { key: keyof SectionVariants; label: string }[];
}

const HERO_CATEGORY: CategoryConfig = {
  label: "Hero",
  keys: [
    { key: "heroLayout", label: "Layout" },
    { key: "heroRightContent", label: "Right Content" },
    { key: "heroBgType", label: "Background" },
    { key: "heroBgImage", label: "Image" },
    { key: "imageAnimation", label: "Image Effects" },
  ],
};

const KNOWN_FOR_CATEGORY: CategoryConfig = {
  label: "Known For",
  keys: [
    { key: "heroKnownFor", label: "Style" },
    { key: "knownForPosition", label: "Position" },
  ],
};

const CLIENT_LOGOS_CATEGORY: CategoryConfig = {
  label: "Client Logos",
  keys: [
    { key: "clientLogos", label: "Layout" },
    { key: "clientLogosColor", label: "Color" },
    { key: "clientLogosSize", label: "Size" },
    { key: "clientLogosPosition", label: "Position" },
  ],
};

const CTA_CATEGORY: CategoryConfig = {
  label: "CTA",
  keys: [
    { key: "ctaPreset", label: "Button" },
    { key: "ctaStyle", label: "Style" },
  ],
};

const STATUS_BADGE_CATEGORY: CategoryConfig = {
  label: "Status Badge",
  keys: [
    { key: "statusBadgeColor", label: "Color" },
    { key: "statusBadgeAnimation", label: "Effect" },
  ],
};

const SECTIONS_CATEGORY: CategoryConfig = {
  label: "Sections",
  keys: [
    { key: "publishedWork", label: "Published Work" },
    { key: "caseStudies", label: "Case Studies" },
    { key: "testimonials", label: "Testimonials" },
    { key: "awards", label: "Awards" },
    { key: "press", label: "Press" },
    { key: "services", label: "Services" },
    { key: "education", label: "Education" },
    { key: "skills", label: "Skills" },
  ],
};

const ALL_CATEGORIES = [HERO_CATEGORY, KNOWN_FOR_CATEGORY, CLIENT_LOGOS_CATEGORY, STATUS_BADGE_CATEGORY, CTA_CATEGORY, SECTIONS_CATEGORY];
const CUSTOMIZATION_MEMORY_KEY = "demo-customization-memory-v1";


// QUICK_RECIPES imported from demoCustomizationPresets

interface Props {
  showCustomization: boolean;
  onToggleCustomization: () => void;
  onExportPDF?: () => void;
  /** Override label for Known For category */
  knownForLabel?: string;
}

const OptionRow = ({ variantKey, label }: { variantKey: keyof SectionVariants; label: string }) => {
  const theme = usePortfolioTheme();
  const { variants, setVariant } = useSectionVariants();
  const options = VARIANT_OPTIONS[variantKey];
  if (!options || options.length === 0) return null;

  // Conditionally hide heroBgImage row when heroBgType is not 'image'
  if (variantKey === 'heroBgImage' && variants.heroBgType !== 'image') return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-1">
      <span className="text-[10px] font-medium uppercase tracking-wider w-20 shrink-0" style={{ color: theme.textTertiary }}>
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-1">
        {variantKey === 'heroBgImage' ? (
          // Render image thumbnails instead of text buttons
          STOCK_HERO_IMAGES.map(img => (
            <button
              key={img.key}
              onClick={() => setVariant(variantKey, img.key as SectionVariants[typeof variantKey])}
              className="relative w-12 h-8 rounded overflow-hidden transition-all duration-200"
              title={img.label}
              style={{
                border: `2px solid ${variants[variantKey] === img.key ? theme.accentPrimary : theme.borderDefault}`,
                opacity: variants[variantKey] === img.key ? 1 : 0.7,
              }}
            >
              <img src={`${img.url}&w=96&q=40`} alt={img.label} className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))
        ) : (
          options.map(opt => (
            <button
              key={opt.key}
              onClick={() => setVariant(variantKey, opt.key as SectionVariants[typeof variantKey])}
              className="text-[10px] px-2 py-0.5 rounded-full transition-all duration-200"
              style={{
                backgroundColor: variants[variantKey] === opt.key ? theme.accentPrimary : 'transparent',
                color: variants[variantKey] === opt.key ? theme.textOnAccent : theme.textSecondary,
                border: `1px solid ${variants[variantKey] === opt.key ? theme.accentPrimary : theme.borderDefault}`,
              }}
            >
              {opt.label}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

const CategorySection = ({ category, defaultOpen = false }: { category: CategoryConfig; defaultOpen?: boolean }) => {
  const theme = usePortfolioTheme();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-1.5 transition-colors"
      >
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: theme.accentPrimary }}>
          {category.label}
        </span>
        {open ? (
          <ChevronUp className="w-3 h-3" style={{ color: theme.textTertiary }} />
        ) : (
          <ChevronDown className="w-3 h-3" style={{ color: theme.textTertiary }} />
        )}
      </button>
      {open && (
        <div className="pb-2">
          {category.keys.map(k => (
            <OptionRow key={k.key} variantKey={k.key} label={k.label} />
          ))}
        </div>
      )}
    </div>
  );
};

const DemoCustomizationPanel = ({ showCustomization, onToggleCustomization, onExportPDF, knownForLabel }: Props) => {
  const theme = usePortfolioTheme();
  const { setVariant } = useSectionVariants();
  const [lastImpact, setLastImpact] = useState<string[]>([]);
  const [changeLog, setChangeLog] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CUSTOMIZATION_MEMORY_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { lastImpact?: string[]; changeLog?: string[] };
      if (Array.isArray(saved.lastImpact)) setLastImpact(saved.lastImpact.slice(0, 3));
      if (Array.isArray(saved.changeLog)) setChangeLog(saved.changeLog.slice(0, 3));
    } catch {
      // ignore malformed local memory
    }
  }, []);

  const persistMemory = (nextImpact: string[], nextLog: string[]) => {
    try {
      localStorage.setItem(CUSTOMIZATION_MEMORY_KEY, JSON.stringify({
        lastImpact: nextImpact,
        changeLog: nextLog,
      }));
    } catch {
      // localStorage may be blocked in some environments
    }
  };

  const applyRecipe = (recipe: Partial<SectionVariants>, impact?: string[], actionLabel?: string) => {
    Object.entries(recipe).forEach(([key, value]) => {
      setVariant(key as keyof SectionVariants, value as SectionVariants[keyof SectionVariants]);
    });
    const nextImpact = impact ?? [];
    if (impact) setLastImpact(nextImpact);
    if (actionLabel) {
      const logEntry = `${actionLabel} • ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
      const nextLog = [logEntry, ...changeLog].slice(0, 3);
      setChangeLog(nextLog);
      persistMemory(nextImpact, nextLog);
      return;
    }
    persistMemory(nextImpact, changeLog);
  };

  // If hidden, show a small floating button
  if (!showCustomization) {
    return (
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1 relative z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCustomization}
            className="flex items-center gap-1.5 text-[10px] font-medium px-3 py-1.5 rounded-full transition-all"
            style={{
              backgroundColor: `${theme.accentPrimary}15`,
              color: theme.accentPrimary,
              border: `1px solid ${theme.accentPrimary}30`,
            }}
          >
            <Eye className="w-3 h-3" />
            Show Customization
          </button>
          {onExportPDF && (
            <button
              onClick={onExportPDF}
              className="flex items-center gap-1.5 text-[10px] font-medium px-3 py-1.5 rounded-full transition-all"
              style={{
                backgroundColor: `${theme.accentPrimary}15`,
                color: theme.accentPrimary,
                border: `1px solid ${theme.accentPrimary}30`,
              }}
            >
              <FileDown className="w-3 h-3" />
              Export PDF
            </button>
          )}
        </div>
      </div>
    );
  }

  const categories = ALL_CATEGORIES.map(c => {
    if (c.label === "Known For" && knownForLabel) {
      return { ...c, label: knownForLabel };
    }
    return c;
  });

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 relative z-20">
      <div
        className="rounded-xl p-4 space-y-1 max-h-[60vh] sm:max-h-none overflow-y-auto sm:overflow-visible"
        style={{
          backgroundColor: `${theme.bgElevated}`,
          border: `1px solid ${theme.borderDefault}`,
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Settings2 className="w-3.5 h-3.5" style={{ color: theme.accentPrimary }} />
            <span className="text-xs font-semibold" style={{ color: theme.textPrimary }}>
              Customize Portfolio
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onExportPDF && (
              <button
                onClick={onExportPDF}
                className="flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full transition-all"
                style={{
                  backgroundColor: `${theme.accentPrimary}15`,
                  color: theme.accentPrimary,
                  border: `1px solid ${theme.accentPrimary}30`,
                }}
              >
                <FileDown className="w-3 h-3" />
                PDF
              </button>
            )}
            <button
              onClick={onToggleCustomization}
              className="flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full transition-all"
              style={{
                backgroundColor: `${theme.accentPrimary}15`,
                color: theme.accentPrimary,
                border: `1px solid ${theme.accentPrimary}30`,
              }}
            >
              <EyeOff className="w-3 h-3" />
              Hide
            </button>
          </div>
        </div>

        <div className="mb-3 rounded-lg p-2.5" style={{ background: `${theme.accentPrimary}10`, border: `1px solid ${theme.accentPrimary}25` }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Wand2 className="w-3 h-3" style={{ color: theme.accentPrimary }} />
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: theme.accentPrimary }}>Quick Presets</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 mb-2">
            {QUICK_RECIPES.map((recipe) => (
              <button
                key={recipe.label}
                onClick={() => applyRecipe(
                  recipe.apply,
                  [`Applied ${recipe.label} preset`, recipe.description, recipe.whyThisPreset],
                  `${recipe.label} preset`
                )}
                className="rounded-md border px-2 py-2 text-left transition-colors hover:bg-accent"
                style={{ border: `1px solid ${theme.borderDefault}`, color: theme.textPrimary, background: theme.bgElevated }}
                title={recipe.description}
              >
                <p className="text-[11px] font-semibold">{recipe.label}</p>
                <p className="text-[10px]" style={{ color: theme.textTertiary }}>{recipe.bestFor}</p>
                <p className="text-[10px] mt-1" style={{ color: theme.textSecondary }}>Why this preset: {recipe.whyThisPreset}</p>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <button
              onClick={() => {
                const autoOptimize: Partial<SectionVariants> = {
                  heroLayout: 'classic',
                  heroRightContent: 'featured',
                  ctaStyle: 'shine-sweep',
                  heroBgType: 'image',
                  heroBgImage: 'studio-light',
                  imageAnimation: 'none',
                  testimonials: 'cards',
                  services: 'pricing',
                  skills: 'grouped',
                };
                applyRecipe(autoOptimize, [
                  "Balanced hero/CTA hierarchy",
                  "Applied high-conversion service and skills layouts",
                  "Reduced visual noise for cleaner readability",
                ], "Auto-Arrange Best Profile");
              }}
              className="text-[10px] px-2.5 py-1 rounded-full transition-all font-semibold"
              style={{ border: `1px solid ${theme.accentPrimary}55`, color: theme.accentPrimary, background: `${theme.accentPrimary}14` }}
              title="Automatically apply the cleanest and best-converting setup"
            >
              <Sparkles className="w-3 h-3 inline mr-1" /> Auto-Arrange Best Profile
            </button>
          </div>
          <p className="text-[10px]" style={{ color: theme.textTertiary }}>One-click presets for fast setup, then fine-tune live below.</p>
        </div>

        <div className="mb-3 rounded-lg p-2.5" style={{ background: `${theme.bgElevated}`, border: `1px solid ${theme.borderDefault}` }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: theme.accentPrimary }}>Quick Actions Rail</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => applyRecipe({ heroLayout: "classic", heroRightContent: "featured", heroBgType: "image", imageAnimation: "none" }, ["Hero simplified for readability and first impression clarity"], "Improve Hero")}
              className="text-[10px] px-2.5 py-1 rounded-full transition-all"
              style={{ border: `1px solid ${theme.borderDefault}`, color: theme.textPrimary, background: theme.bgPrimary }}
            >
              Improve Hero
            </button>
            <button
              onClick={() => applyRecipe({ ctaPreset: "hire", ctaStyle: "filled-bold" }, ["CTA made more prominent and action-oriented"], "Fix CTA")}
              className="text-[10px] px-2.5 py-1 rounded-full transition-all"
              style={{ border: `1px solid ${theme.borderDefault}`, color: theme.textPrimary, background: theme.bgPrimary }}
            >
              Fix CTA
            </button>
            <button
              onClick={() => applyRecipe({ testimonials: "cards", awards: "laurels", press: "cards" }, ["Trust sections adjusted to appear stronger and easier to scan"], "Apply High-Trust Variant")}
              className="text-[10px] px-2.5 py-1 rounded-full transition-all"
              style={{ border: `1px solid ${theme.borderDefault}`, color: theme.textPrimary, background: theme.bgPrimary }}
            >
              Apply High-Trust Variant
            </button>
            <button
              onClick={() => applyRecipe({ services: "pricing", skills: "grouped", publishedWork: "card" }, ["Section presentation tuned for conversion and readability"], "Reorder for Conversion")}
              className="text-[10px] px-2.5 py-1 rounded-full transition-all"
              style={{ border: `1px solid ${theme.borderDefault}`, color: theme.textPrimary, background: theme.bgPrimary }}
            >
              Reorder for Conversion
            </button>
            <button
              onClick={() => applyRecipe({ heroBgType: "preset", imageAnimation: "none", statusBadgeAnimation: "none" }, ["Reduced animation and decorative effects for cleaner focus"], "Simplify Visual Noise")}
              className="text-[10px] px-2.5 py-1 rounded-full transition-all"
              style={{ border: `1px solid ${theme.borderDefault}`, color: theme.textPrimary, background: theme.bgPrimary }}
            >
              Simplify Visual Noise
            </button>
          </div>
        </div>

        <div className="mb-3 rounded-lg p-2.5" style={{ background: `${theme.bgElevated}`, border: `1px solid ${theme.borderDefault}` }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: theme.accentPrimary }}>Goal Modes</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {GOAL_MODES.map((goal) => (
              <button
                key={goal.label}
                onClick={() => applyRecipe(goal.apply, goal.impact, goal.label)}
                className="rounded-md border px-2 py-1.5 text-left transition-colors hover:bg-accent"
                style={{ borderColor: theme.borderDefault }}
                title={goal.description}
              >
                <p className="text-[11px] font-semibold" style={{ color: theme.textPrimary }}>{goal.label}</p>
                <p className="text-[10px]" style={{ color: theme.textTertiary }}>{goal.description}</p>
              </button>
            ))}
          </div>
          {lastImpact.length > 0 && (
            <div className="mt-2 space-y-2">
              <div className="text-[10px] px-2 py-1 rounded-md inline-block animate-pulse" style={{ color: theme.accentPrimary, background: `${theme.accentPrimary}15` }}>
                Preview updated
              </div>
              <ul className="text-[10px] space-y-0.5 list-disc pl-4" style={{ color: theme.textTertiary }}>
                {lastImpact.map((line) => <li key={line}>{line}</li>)}
              </ul>
              {changeLog.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: theme.textSecondary }}>Recent Changes</p>
                  <ul className="text-[10px] space-y-0.5 list-disc pl-4" style={{ color: theme.textTertiary }}>
                    {changeLog.map((line) => <li key={line}>{line}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="divide-y" style={{ borderColor: `${theme.borderDefault}50` }}>
          {categories.map((cat, i) => (
            <CategorySection key={cat.label} category={cat} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoCustomizationPanel;
