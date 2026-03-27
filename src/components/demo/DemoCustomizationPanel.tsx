import { useState } from "react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { useSectionVariants, VARIANT_OPTIONS, type SectionVariants, STOCK_HERO_IMAGES } from "./DemoShared";
import { ChevronDown, ChevronUp, Settings2, Eye, EyeOff, FileDown } from "lucide-react";

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
