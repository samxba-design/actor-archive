import { FileText, ExternalLink, Mail, Globe, MessageSquare, Megaphone, PenTool, Mic2 } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
  variant?: 'compact' | 'cards';
}

const CATEGORY_ICONS: Record<string, any> = {
  "Email": Mail,
  "Email Marketing": Mail,
  "Landing Page": Globe,
  "Landing Pages": Globe,
  "Social": MessageSquare,
  "Social Media": MessageSquare,
  "Blog": PenTool,
  "Blog Posts": PenTool,
  "Ad Copy": Megaphone,
  "Paid Ads": Megaphone,
  "Speech": Mic2,
  "Speeches": Mic2,
  "Leadership Speeches": Mic2,
};

const SectionWritingSamples = ({ items, variant = 'cards' }: Props) => {
  const theme = usePortfolioTheme();

  // Group by writing_samples_category
  const grouped = items.reduce((acc: Record<string, any[]>, item) => {
    const cat = item.writing_samples_category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  if (variant === 'compact') {
    return (
      <div className="space-y-6">
        {Object.entries(grouped).map(([category, samples]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: theme.textTertiary }}>
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(samples as any[]).map((sample: any) => (
                <a
                  key={sample.id}
                  href={sample.article_url || sample.script_pdf_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 group transition-all"
                  style={{
                    backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
                    border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
                    borderRadius: theme.cardRadius,
                  }}
                >
                  <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: theme.accentPrimary }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium group-hover:underline" style={{ color: theme.textPrimary }}>{sample.title}</p>
                    <p className="text-xs" style={{ color: theme.textTertiary }}>
                      {[sample.client || sample.publication, sample.year].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100" style={{ color: theme.textTertiary }} />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: cards — richer layout with excerpts, icons, thumbnails
  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, samples]) => {
        const CatIcon = CATEGORY_ICONS[category] || FileText;
        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              <CatIcon className="w-4 h-4" style={{ color: theme.accentPrimary }} />
              <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: theme.textTertiary }}>
                {category}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(samples as any[]).map((sample: any) => {
                const image = sample.poster_url || sample.custom_image_url;
                const excerpt = sample.description?.slice(0, 160);
                const isFeatured = sample.is_featured;

                return (
                  <a
                    key={sample.id}
                    href={sample.article_url || sample.script_pdf_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group block overflow-hidden transition-all hover:shadow-md ${isFeatured ? 'sm:col-span-2' : ''}`}
                    style={{
                      backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
                      border: `${theme.cardBorderWidth} solid ${isFeatured ? theme.accentPrimary + '40' : theme.borderDefault}`,
                      borderRadius: theme.cardRadius,
                      boxShadow: theme.cardShadow,
                    }}
                  >
                    {image && isFeatured && (
                      <div className="aspect-[3/1] overflow-hidden">
                        <img src={image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      </div>
                    )}
                    <div className={`p-4 ${isFeatured ? 'flex gap-4' : ''}`}>
                      {image && !isFeatured && (
                        <div className="w-12 h-12 rounded overflow-hidden shrink-0 mb-2" style={{ backgroundColor: theme.bgElevated }}>
                          <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold group-hover:underline ${isFeatured ? 'text-base' : 'text-sm'}`} style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>
                          {sample.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: theme.textTertiary }}>
                          {[sample.client || sample.publication, sample.year].filter(Boolean).join(" · ")}
                        </p>
                        {excerpt && (
                          <p className="text-xs mt-2 line-clamp-2" style={{ color: theme.textSecondary }}>
                            {excerpt}{sample.description?.length > 160 ? '…' : ''}
                          </p>
                        )}
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" style={{ color: theme.textTertiary }} />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SectionWritingSamples;
