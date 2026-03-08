import { useState, useEffect, useCallback } from "react";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

export interface KnownForItem {
  id: string;
  title: string;
  poster_url?: string | null;
  role_name?: string | null;
  imdb_link?: string | null;
  year?: number | null;
  network_or_studio?: string | null;
}

export type KnownForVariant = 'strip' | 'scroll' | 'grid' | 'stack' | 'spotlight';

interface Props {
  items: KnownForItem[];
  variant?: KnownForVariant;
  display?: 'both' | 'image' | 'text';
}

/* ── Link wrapper ── */
const MaybeLink = ({ href, children, className }: { href?: string | null; children: React.ReactNode; className?: string }) =>
  href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`no-underline ${className || ''}`}>
      {children}
    </a>
  ) : <div className={className}>{children}</div>;

/* ── Poster Card (shared by all variants) ── */
export const PosterCard = ({
  item,
  width,
  display = 'both',
  showHoverIcon = true,
}: {
  item: KnownForItem;
  width?: string;
  display?: 'both' | 'image' | 'text';
  showHoverIcon?: boolean;
}) => {
  const theme = usePortfolioTheme();

  if (display === 'text') {
    return (
      <MaybeLink href={item.imdb_link}>
        <div
          className="group/kf px-3 py-2.5 transition-all duration-200 shrink-0 hover:scale-[1.03]"
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
      </MaybeLink>
    );
  }

  return (
    <MaybeLink href={item.imdb_link}>
      <div
        className="group/kf overflow-hidden transition-all duration-300 shrink-0 hover:scale-[1.03] hover:shadow-lg"
        style={{
          width: width || '130px',
          borderRadius: theme.cardRadius,
          backgroundColor: theme.bgSecondary,
          border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
          boxShadow: theme.cardShadow,
        }}
      >
        <div className="aspect-[2/3] overflow-hidden relative" style={{ backgroundColor: theme.bgElevated }}>
          {item.poster_url ? (
            <img src={item.poster_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/kf:scale-105" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-lg" style={{ color: theme.textTertiary }}>🎬</span>
            </div>
          )}
          {showHoverIcon && item.imdb_link && (
            <div className="absolute top-1.5 right-1.5 p-1 rounded-full opacity-0 group-hover/kf:opacity-100 transition-opacity" style={{ backgroundColor: `${theme.bgPrimary}cc` }}>
              <ExternalLink className="w-2.5 h-2.5" style={{ color: theme.accentPrimary }} />
            </div>
          )}
        </div>
        {display === 'both' && (
          <div className="p-2.5 space-y-0.5">
            <h4 className="text-[11px] font-semibold leading-tight line-clamp-2" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>
              {item.title}
            </h4>
            {item.role_name && (
              <p className="text-[9px] uppercase tracking-wider truncate" style={{ color: theme.accentPrimary }}>
                {item.role_name}
              </p>
            )}
            {item.network_or_studio && (
              <p className="text-[8px] uppercase tracking-widest truncate" style={{ color: theme.textTertiary }}>
                {item.network_or_studio}
              </p>
            )}
          </div>
        )}
        {display === 'image' && (
          <div className="px-2 py-1.5">
            <p className="text-[10px] font-semibold leading-tight truncate" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{item.title}</p>
            {item.role_name && <p className="text-[8px] uppercase tracking-wider truncate" style={{ color: theme.accentPrimary }}>{item.role_name}</p>}
          </div>
        )}
      </div>
    </MaybeLink>
  );
};

/* ════════════════════ VARIANTS ════════════════════ */

/* Strip — static left-aligned horizontal row */
const StripVariant = ({ items, display }: { items: KnownForItem[]; display: Props['display'] }) => {
  const cardWidth = display === 'text' ? undefined : '130px';
  return (
    <div className="overflow-x-auto scrollbar-none -mx-1 px-1">
      <div className="flex gap-3">
        {items.slice(0, 6).map(item => (
          <PosterCard key={item.id} item={item} width={cardWidth} display={display} />
        ))}
      </div>
    </div>
  );
};

/* Scroll — CSS marquee auto-scroll */
const ScrollVariant = ({ items, display }: { items: KnownForItem[]; display: Props['display'] }) => {
  const theme = usePortfolioTheme();
  const cardWidth = display === 'text' ? undefined : '100px';
  const displayItems = items.slice(0, 6);
  // Duplicate for seamless loop
  const allItems = [...displayItems, ...displayItems];

  return (
    <div className="relative overflow-hidden group/marquee">
      <style>{`
        @keyframes kf-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="flex gap-3"
        style={{
          animation: 'kf-scroll 25s linear infinite',
          width: 'max-content',
        }}
        onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {allItems.map((item, i) => (
          <PosterCard key={`${item.id}-${i}`} item={item} width={cardWidth} display={display} />
        ))}
      </div>
      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-8 pointer-events-none" style={{ background: `linear-gradient(to right, ${theme.bgPrimary}, transparent)` }} />
      <div className="absolute inset-y-0 right-0 w-8 pointer-events-none" style={{ background: `linear-gradient(to left, ${theme.bgPrimary}, transparent)` }} />
    </div>
  );
};

/* Grid — static poster grid */
const GridVariant = ({ items, display }: { items: KnownForItem[]; display: Props['display'] }) => {
  if (display === 'text') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.slice(0, 6).map(item => (
          <PosterCard key={item.id} item={item} display="text" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
      {items.slice(0, 6).map(item => (
        <PosterCard key={item.id} item={item} width="100%" display={display} />
      ))}
    </div>
  );
};

/* Stack — overlapping deck of cards */
const StackVariant = ({ items, display }: { items: KnownForItem[]; display: Props['display'] }) => {
  const theme = usePortfolioTheme();
  const [activeIdx, setActiveIdx] = useState(0);
  const displayItems = items.slice(0, 6);

  return (
    <div className="relative" style={{ height: '260px', width: '100%' }}>
      {displayItems.map((item, i) => {
        const isActive = i === activeIdx;
        const offset = (i - activeIdx);
        const absOffset = Math.abs(offset);

        return (
          <div
            key={item.id}
            className="absolute transition-all duration-500 cursor-pointer"
            style={{
              left: `${i * 24}px`,
              top: `${absOffset * 4}px`,
              zIndex: isActive ? 20 : 10 - absOffset,
              transform: isActive ? 'scale(1.08)' : `scale(${1 - absOffset * 0.04})`,
              opacity: absOffset > 3 ? 0.3 : 1 - absOffset * 0.15,
              filter: isActive ? 'none' : `brightness(${1 - absOffset * 0.1})`,
            }}
            onMouseEnter={() => setActiveIdx(i)}
          >
            <PosterCard item={item} width="130px" display={display} showHoverIcon={isActive} />
          </div>
        );
      })}
    </div>
  );
};

/* Spotlight — single card with crossfade + nav */
const SpotlightVariant = ({ items, display }: { items: KnownForItem[]; display: Props['display'] }) => {
  const theme = usePortfolioTheme();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const displayItems = items.slice(0, 6);

  const goNext = useCallback(() => setActiveIdx(i => (i + 1) % displayItems.length), [displayItems.length]);
  const goPrev = useCallback(() => setActiveIdx(i => (i - 1 + displayItems.length) % displayItems.length), [displayItems.length]);

  // Auto-advance
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(goNext, 4000);
    return () => clearInterval(timer);
  }, [isHovered, goNext]);

  const item = displayItems[activeIdx];
  if (!item) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-6 items-start">
        {/* Large poster */}
        <div className="relative shrink-0" style={{ width: '180px' }}>
          {displayItems.map((it, i) => (
            <div
              key={it.id}
              className="absolute inset-0 transition-all duration-500"
              style={{
                opacity: i === activeIdx ? 1 : 0,
                transform: i === activeIdx ? 'translateX(0)' : 'translateX(12px)',
                pointerEvents: i === activeIdx ? 'auto' : 'none',
              }}
            >
              <MaybeLink href={it.imdb_link}>
                <div
                  className="overflow-hidden"
                  style={{
                    borderRadius: theme.cardRadius,
                    border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
                    boxShadow: theme.cardShadow,
                  }}
                >
                  <div className="aspect-[2/3] overflow-hidden" style={{ backgroundColor: theme.bgElevated }}>
                    {it.poster_url ? (
                      <img src={it.poster_url} alt={it.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl" style={{ color: theme.textTertiary }}>🎬</span>
                      </div>
                    )}
                  </div>
                </div>
              </MaybeLink>
            </div>
          ))}
          {/* Spacer to maintain height */}
          <div style={{ width: '180px' }} className="aspect-[2/3]" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 pt-2 space-y-2">
          <div className="transition-all duration-300" key={activeIdx}>
            <h4 className="text-lg font-bold" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>
              {item.title}
            </h4>
            {item.role_name && (
              <p className="text-xs uppercase tracking-wider mt-1" style={{ color: theme.accentPrimary }}>
                {item.role_name}
              </p>
            )}
            <div className="flex items-center gap-3 mt-1.5">
              {item.network_or_studio && (
                <span className="text-[11px] uppercase tracking-widest" style={{ color: theme.textSecondary }}>
                  {item.network_or_studio}
                </span>
              )}
              {item.year && (
                <span className="text-[11px] tabular-nums" style={{ color: theme.textTertiary }}>
                  {item.year}
                </span>
              )}
            </div>
            {item.imdb_link && (
              <a href={item.imdb_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] mt-2 transition-opacity hover:opacity-80" style={{ color: theme.accentPrimary }}>
                View on IMDb <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Dots */}
          <div className="flex items-center gap-1.5 pt-2">
            {displayItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeIdx ? '16px' : '6px',
                  height: '6px',
                  backgroundColor: i === activeIdx ? theme.accentPrimary : theme.borderDefault,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Nav arrows */}
      <button
        onClick={goPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity z-10"
        style={{ backgroundColor: `${theme.bgPrimary}dd`, border: `1px solid ${theme.borderDefault}`, color: theme.textPrimary }}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity z-10"
        style={{ backgroundColor: `${theme.bgPrimary}dd`, border: `1px solid ${theme.borderDefault}`, color: theme.textPrimary }}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

/* ════════════════════ MAIN COMPONENT ════════════════════ */

const SectionKnownFor = ({ items, variant = 'strip', display = 'both' }: Props) => {
  if (!items.length) return null;

  switch (variant) {
    case 'scroll': return <ScrollVariant items={items} display={display} />;
    case 'grid': return <GridVariant items={items} display={display} />;
    case 'stack': return <StackVariant items={items} display={display} />;
    case 'spotlight': return <SpotlightVariant items={items} display={display} />;
    case 'strip':
    default: return <StripVariant items={items} display={display} />;
  }
};

export default SectionKnownFor;
