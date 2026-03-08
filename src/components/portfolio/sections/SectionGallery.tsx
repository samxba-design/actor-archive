import { useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
  variant?: 'grid' | 'masonry' | 'carousel';
  imageAnimation?: string;
}

const SectionGallery = ({ items, variant = 'grid', imageAnimation = 'none' }: Props) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const theme = usePortfolioTheme();

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const imgAnimClass = imageAnimation !== 'none' ? `img-anim-${imageAnimation}` : '';
  const prev = useCallback(() => setLightboxIdx(i => i !== null ? (i - 1 + items.length) % items.length : null), [items.length]);
  const next = useCallback(() => setLightboxIdx(i => i !== null ? (i + 1) % items.length : null), [items.length]);

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  }, [closeLightbox, prev, next]);

  const lightbox = lightboxIdx !== null && (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ background: "hsl(0 0% 0% / 0.92)" }}
      onClick={closeLightbox}
      onKeyDown={handleKey}
      tabIndex={0}
      role="dialog"
      aria-label="Image lightbox"
    >
      <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
        className="absolute top-4 right-4 z-10 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
        <X className="w-6 h-6" />
      </button>
      {items.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}
      <div className="max-w-5xl max-h-[85vh] px-12" onClick={(e) => e.stopPropagation()}>
        <img
          src={items[lightboxIdx].image_url}
          alt={items[lightboxIdx].caption || ""}
          className="max-w-full max-h-[80vh] object-contain mx-auto rounded-lg"
          style={{ animation: "word-reveal 0.3s ease-out" }}
        />
        {items[lightboxIdx].caption && (
          <p className="text-center text-sm text-white/70 mt-3">{items[lightboxIdx].caption}</p>
        )}
        {items[lightboxIdx].photographer_credit && (
          <p className="text-center text-xs text-white/40 mt-1">📷 {items[lightboxIdx].photographer_credit}</p>
        )}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/40">
        {lightboxIdx + 1} / {items.length}
      </div>
    </div>
  );

  if (variant === 'masonry') {
    return (
      <>
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {items.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setLightboxIdx(i)}
              className="group relative overflow-hidden cursor-pointer focus:outline-none break-inside-avoid block w-full"
              style={{ borderRadius: theme.cardRadius }}
            >
              <img
                src={img.image_url}
                alt={img.caption || ""}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(transparent 50%, ${theme.bgPrimary}dd)` }}
              />
              {img.caption && (
                <div
                  className="absolute inset-x-0 bottom-0 p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: theme.textPrimary }}
                >
                  {img.caption}
                </div>
              )}
            </button>
          ))}
        </div>
        {lightbox}
      </>
    );
  }

  if (variant === 'carousel') {
    return (
      <>
        <div className="relative overflow-hidden" style={{ borderRadius: theme.cardRadius }}>
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {items.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightboxIdx(i)}
                className="group relative flex-shrink-0 overflow-hidden cursor-pointer focus:outline-none snap-start"
                style={{ borderRadius: theme.cardRadius, width: '280px', height: '200px' }}
              >
                <img
                  src={img.image_url}
                  alt={img.caption || ""}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {img.caption && (
                  <div
                    className="absolute inset-x-0 bottom-0 p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(transparent, ${theme.bgPrimary}cc)`, color: theme.textPrimary }}
                  >
                    {img.caption}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        {lightbox}
      </>
    );
  }

  // Default: grid
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setLightboxIdx(i)}
            className="group relative overflow-hidden aspect-square cursor-pointer focus:outline-none"
            style={{ borderRadius: theme.cardRadius }}
          >
            <img
              src={img.image_url}
              alt={img.caption || ""}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(transparent 50%, ${theme.bgPrimary}dd)` }}
            />
            {img.caption && (
              <div
                className="absolute inset-x-0 bottom-0 p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ color: theme.textPrimary }}
              >
                {img.caption}
              </div>
            )}
          </button>
        ))}
      </div>
      {lightbox}
    </>
  );
};

export default SectionGallery;
