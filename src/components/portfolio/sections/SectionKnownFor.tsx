import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

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
  variant?: 'strip' | 'grid' | 'inline' | 'carousel';
  display?: 'both' | 'image' | 'text';
}

/* ── Shared link wrapper ── */
const MaybeLink = ({ href, children }: { href?: string | null; children: React.ReactNode }) =>
  href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="no-underline">
      {children}
    </a>
  ) : <>{children}</>;

const SectionKnownFor = ({ items, variant = 'strip', display = 'both' }: Props) => {
  const theme = usePortfolioTheme();

  if (!items.length) return null;

  /* ── Text-only card ── */
  const TextCard = ({ item }: { item: KnownForItem }) => (
    <MaybeLink href={item.imdb_link}>
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
    </MaybeLink>
  );

  /* ── Image-only card ── */
  const ImageCard = ({ item, width }: { item: KnownForItem; width: string }) => (
    <MaybeLink href={item.imdb_link}>
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
            <img src={item.poster_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/kf:scale-105" loading="lazy" />
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
        {/* Compact title below image */}
        <div className="px-2 py-1.5" style={{ backgroundColor: theme.bgSecondary }}>
          <p className="text-[10px] font-semibold leading-tight truncate" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{item.title}</p>
          {item.role_name && <p className="text-[8px] uppercase tracking-wider truncate" style={{ color: theme.accentPrimary }}>{item.role_name}</p>}
        </div>
      </div>
    </MaybeLink>
  );

  /* ── Full card (image + text) ── */
  const FullCard = ({ item, width }: { item: KnownForItem; width: string }) => (
    <MaybeLink href={item.imdb_link}>
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
        <div className="aspect-[2/3] overflow-hidden relative" style={{ backgroundColor: theme.bgElevated }}>
          {item.poster_url ? (
            <img src={item.poster_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/kf:scale-105" loading="lazy" />
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
    </MaybeLink>
  );

  const renderCard = (item: KnownForItem, width: string) => {
    if (display === 'text') return <TextCard key={item.id} item={item} />;
    if (display === 'image') return <ImageCard key={item.id} item={item} width={width} />;
    return <FullCard key={item.id} item={item} width={width} />;
  };

  /* ── Carousel variant ── */
  if (variant === 'carousel') {
    return <CarouselVariant items={items} display={display} renderCard={renderCard} />;
  }

  /* ── Inline variant ── */
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
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
        {items.slice(0, 6).map(item => renderCard(item, '100%'))}
      </div>
    );
  }

  /* ── Strip variant (default) — left-aligned horizontal scroll ── */
  const cardWidth = display === 'text' ? 'auto' : '120px';
  return (
    <div className="overflow-x-auto scrollbar-none -mx-1 px-1">
      <div className="flex gap-3">
        {items.slice(0, 6).map(item => renderCard(item, cardWidth))}
      </div>
    </div>
  );
};

/* ════════════════════ Carousel Component ════════════════════ */

const CarouselVariant = ({
  items,
  display,
  renderCard,
}: {
  items: KnownForItem[];
  display: 'both' | 'image' | 'text';
  renderCard: (item: KnownForItem, width: string) => React.ReactNode;
}) => {
  const theme = usePortfolioTheme();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    align: 'start',
    containScroll: false,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  // Auto-scroll: slow continuous drift, pause on hover
  useEffect(() => {
    if (!emblaApi) return;
    let raf: number;
    let lastTime = 0;
    const speed = 0.3; // px per frame

    const tick = (time: number) => {
      if (!isHovered && emblaApi.canScrollNext()) {
        const delta = lastTime ? (time - lastTime) : 16;
        lastTime = time;
        const engine = (emblaApi as any).internalEngine();
        if (engine?.scrollBody) {
          engine.location.add(-speed * (delta / 16));
          engine.target.set(engine.location);
          engine.scrollLooper.loop(engine.scrollBody.direction());
          engine.slideLooper.loop();
          engine.translate.to(engine.location);
        }
      } else {
        lastTime = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [emblaApi, isHovered]);

  const cardWidth = display === 'text' ? '160px' : '130px';

  return (
    <div
      className="relative group/carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Prev arrow */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 -translate-x-1 group-hover/carousel:translate-x-0"
        style={{
          backgroundColor: `${theme.bgPrimary}dd`,
          border: `1px solid ${theme.borderDefault}`,
          color: theme.textPrimary,
          backdropFilter: 'blur(8px)',
        }}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
        <div className="flex gap-3">
          {items.slice(0, 6).map(item => (
            <div key={item.id} className="flex-[0_0_auto]">
              {renderCard(item, cardWidth)}
            </div>
          ))}
        </div>
      </div>

      {/* Next arrow */}
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 translate-x-1 group-hover/carousel:translate-x-0"
        style={{
          backgroundColor: `${theme.bgPrimary}dd`,
          border: `1px solid ${theme.borderDefault}`,
          color: theme.textPrimary,
          backdropFilter: 'blur(8px)',
        }}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-8 pointer-events-none" style={{ background: `linear-gradient(to right, ${theme.bgPrimary}, transparent)` }} />
      <div className="absolute inset-y-0 right-0 w-8 pointer-events-none" style={{ background: `linear-gradient(to left, ${theme.bgPrimary}, transparent)` }} />
    </div>
  );
};

export default SectionKnownFor;
