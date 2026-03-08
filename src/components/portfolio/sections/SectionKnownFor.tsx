import { ExternalLink } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface KnownForItem {
  id: string;
  title: string;
  poster_url?: string | null;
  role_name?: string | null;
  imdb_link?: string | null;
  year?: number | null;
  network_or_studio?: string | null;
}

interface Props {
  items: KnownForItem[];
  variant?: 'strip' | 'grid';
}

const SectionKnownFor = ({ items, variant = 'strip' }: Props) => {
  const theme = usePortfolioTheme();

  if (!items.length) return null;

  const Card = ({ item }: { item: KnownForItem }) => {
    const inner = (
      <div
        className="group/kf overflow-hidden transition-all duration-300 shrink-0"
        style={{
          width: variant === 'strip' ? '120px' : undefined,
          borderRadius: theme.cardRadius,
          backgroundColor: theme.bgSecondary,
          border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
          boxShadow: theme.cardShadow,
        }}
      >
        {/* Poster */}
        <div className="aspect-[2/3] overflow-hidden relative" style={{ backgroundColor: theme.bgElevated }}>
          {item.poster_url ? (
            <img
              src={item.poster_url}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/kf:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-lg" style={{ color: theme.textTertiary }}>🎬</span>
            </div>
          )}
          {item.imdb_link && (
            <div className="absolute top-1.5 right-1.5 p-1 rounded-full opacity-0 group-hover/kf:opacity-100 transition-opacity" style={{ backgroundColor: `${theme.bgPrimary}cc` }}>
              <ExternalLink className="w-2.5 h-2.5" style={{ color: theme.accentPrimary }} />
            </div>
          )}
        </div>
        {/* Info */}
        <div className="p-2 space-y-0.5">
          <h4 className="text-[11px] font-semibold leading-tight truncate" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>
            {item.title}
          </h4>
          {item.role_name && (
            <p className="text-[9px] uppercase tracking-wider" style={{ color: theme.accentPrimary }}>
              {item.role_name}
            </p>
          )}
          {item.network_or_studio && (
            <p className="text-[8px] uppercase tracking-widest" style={{ color: theme.textTertiary }}>
              {item.network_or_studio}
            </p>
          )}
        </div>
      </div>
    );

    return item.imdb_link ? (
      <a href={item.imdb_link} target="_blank" rel="noopener noreferrer" className="no-underline">
        {inner}
      </a>
    ) : inner;
  };

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {items.slice(0, 6).map(item => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-none -mx-1 px-1">
      <div className="flex gap-3">
        {items.slice(0, 6).map(item => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default SectionKnownFor;
