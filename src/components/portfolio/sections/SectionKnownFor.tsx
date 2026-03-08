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
  variant?: 'strip' | 'grid' | 'inline';
  display?: 'both' | 'image' | 'text';
}

const SectionKnownFor = ({ items, variant = 'strip', display = 'both' }: Props) => {
  const theme = usePortfolioTheme();

  if (!items.length) return null;

  /* ── Text-only card ── */
  const TextCard = ({ item }: { item: KnownForItem }) => {
    const inner = (
      <div
        className="group/kf px-3 py-2.5 transition-all duration-200 shrink-0"
        style={{
          borderRadius: theme.cardRadius,
          backgroundColor: theme.bgSecondary,
          border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
        }}
      >
        <h4 className="text-[13px] font-semibold leading-tight" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>
          {item.title}
        </h4>
        {item.role_name && (
          <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: theme.accentPrimary }}>
            {item.role_name}
          </p>
        )}
        <div className="flex items-center gap-2 mt-0.5">
          {item.network_or_studio && (
            <span className="text-[9px] uppercase tracking-widest" style={{ color: theme.textTertiary }}>
              {item.network_or_studio}
            </span>
          )}
          {item.year && (
            <span className="text-[9px] tabular-nums" style={{ color: theme.textTertiary }}>
              {item.year}
            </span>
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

  /* ── Image-only card ── */
  const ImageCard = ({ item, width }: { item: KnownForItem; width: string }) => {
    const inner = (
      <div
        className="group/kf overflow-hidden transition-all duration-300 shrink-0"
        style={{
          width,
          borderRadius: theme.cardRadius,
          border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
          boxShadow: theme.cardShadow,
        }}
      >
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
      </div>
    );
    return item.imdb_link ? (
      <a href={item.imdb_link} target="_blank" rel="noopener noreferrer" className="no-underline">
        {inner}
      </a>
    ) : inner;
  };

  /* ── Full card (image + text) ── */
  const FullCard = ({ item, width }: { item: KnownForItem; width: string }) => {
    const inner = (
      <div
        className="group/kf overflow-hidden transition-all duration-300 shrink-0"
        style={{
          width,
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

  const renderCard = (item: KnownForItem, width: string) => {
    if (display === 'text') return <TextCard key={item.id} item={item} />;
    if (display === 'image') return <ImageCard key={item.id} item={item} width={width} />;
    return <FullCard key={item.id} item={item} width={width} />;
  };

  /* ── Inline variant: horizontal row alongside other content ── */
  if (variant === 'inline') {
    const cardWidth = display === 'text' ? 'auto' : '90px';
    return (
      <div className="flex gap-2 flex-wrap">
        {items.slice(0, 6).map(item => renderCard(item, cardWidth))}
      </div>
    );
  }

  /* ── Grid variant ── */
  if (variant === 'grid') {
    if (display === 'text') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {items.slice(0, 6).map(item => <TextCard key={item.id} item={item} />)}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.slice(0, 6).map(item => renderCard(item, '100%'))}
      </div>
    );
  }

  /* ── Strip variant (default): horizontal scroll ── */
  const cardWidth = display === 'text' ? 'auto' : '120px';
  return (
    <div className="overflow-x-auto scrollbar-none -mx-1 px-1">
      <div className="flex gap-3">
        {items.slice(0, 6).map(item => renderCard(item, cardWidth))}
      </div>
    </div>
  );
};

export default SectionKnownFor;
