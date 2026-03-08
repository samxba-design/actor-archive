import { useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  items: any[];
}

const SectionGallery = ({ items }: Props) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prev = useCallback(() => setLightboxIdx(i => i !== null ? (i - 1 + items.length) % items.length : null), [items.length]);
  const next = useCallback(() => setLightboxIdx(i => i !== null ? (i + 1) % items.length : null), [items.length]);

  // Keyboard nav
  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  }, [closeLightbox, prev, next]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setLightboxIdx(i)}
            className="group relative overflow-hidden aspect-square cursor-pointer focus:outline-none"
            style={{ borderRadius: "var(--portfolio-radius)" }}
          >
            <img
              src={img.image_url}
              alt={img.caption || ""}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(transparent 50%, hsl(var(--portfolio-bg) / 0.85))" }}
            />
            {img.caption && (
              <div
                className="absolute inset-x-0 bottom-0 p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ color: "hsl(var(--portfolio-fg))" }}
              >
                {img.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
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

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/40">
            {lightboxIdx + 1} / {items.length}
          </div>
        </div>
      )}
    </>
  );
};

export default SectionGallery;
