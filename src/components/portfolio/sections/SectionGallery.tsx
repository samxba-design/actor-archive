import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, Camera } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { useNavigate } from "react-router-dom";

interface Props {
  items: any[];
  variant?: "grid" | "masonry" | "carousel";
  imageAnimation?: string;
  isOwner?: boolean;
}

const SectionGallery = ({
  items,
  variant = "grid",
  imageAnimation = "none",
  isOwner = false,
}: Props) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const theme = usePortfolioTheme();
  const navigate = useNavigate();

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prev = useCallback(
    () => setLightboxIdx(i => (i !== null ? (i - 1 + items.length) % items.length : null)),
    [items.length]
  );
  const next = useCallback(
    () => setLightboxIdx(i => (i !== null ? (i + 1) % items.length : null)),
    [items.length]
  );

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     closeLightbox();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIdx, closeLightbox, prev, next]);

  const imgAnimClass = imageAnimation !== "none" ? `img-anim-${imageAnimation}` : "";

  // Empty state
  if (items.length === 0) {
    if (!isOwner) return null;
    return (
      <div
        className="flex flex-col items-center justify-center py-12 px-6 rounded-xl text-center space-y-4"
        style={{
          border: `2px dashed ${theme.borderDefault}`,
          backgroundColor: `${theme.accentPrimary}04`,
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${theme.accentPrimary}12` }}
        >
          <Camera className="h-7 w-7" style={{ color: theme.accentPrimary }} />
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: theme.textPrimary }}>
            No photos yet — add to your gallery
          </p>
          <p className="text-xs mt-1" style={{ color: theme.textTertiary }}>
            Headshots, stills, behind-the-scenes moments.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/gallery")}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: theme.accentPrimary, color: theme.textOnAccent }}
        >
          Add Photos
        </button>
      </div>
    );
  }

  // ── Lightbox ────────────────────────────────────────────────────────────────
  const lightbox = lightboxIdx !== null && (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.94)", backdropFilter: "blur(8px)" }}
      onClick={closeLightbox}
    >
      {/* Close */}
      <button
        onClick={e => { e.stopPropagation(); closeLightbox(); }}
        className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all hover:bg-white/10"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full transition-all hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); next(); }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full transition-all hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Image */}
      <div
        className="flex flex-col items-center max-w-5xl w-full px-16"
        onClick={e => e.stopPropagation()}
      >
        <img
          key={lightboxIdx}
          src={items[lightboxIdx].image_url}
          alt={items[lightboxIdx].caption || ""}
          className="max-h-[78vh] max-w-full object-contain rounded-lg"
          style={{ animation: "fade-in 0.2s ease-out" }}
        />
        {(items[lightboxIdx].caption || items[lightboxIdx].photographer_credit) && (
          <div className="mt-3 text-center space-y-0.5">
            {items[lightboxIdx].caption && (
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                {items[lightboxIdx].caption}
              </p>
            )}
            {items[lightboxIdx].photographer_credit && (
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                📷 {items[lightboxIdx].photographer_credit}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Counter */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full"
        style={{
          color: "rgba(255,255,255,0.5)",
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      >
        {(lightboxIdx as number) + 1} / {items.length}
      </div>
    </div>
  );

  // ── Masonry ──────────────────────────────────────────────────────────────────
  if (variant === "masonry") {
    return (
      <>
        <div className="columns-2 sm:columns-3 gap-2 space-y-2">
          {items.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setLightboxIdx(i)}
              className={`group relative overflow-hidden cursor-pointer focus:outline-none break-inside-avoid block w-full ${imgAnimClass}`}
              style={{ borderRadius: theme.cardRadius }}
            >
              <img
                src={img.image_url}
                alt={img.caption || ""}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.35)" }}
              >
                <ZoomIn className="w-6 h-6 text-white drop-shadow" />
              </div>
            </button>
          ))}
        </div>
        {lightbox}
      </>
    );
  }

  // ── Carousel ─────────────────────────────────────────────────────────────────
  if (variant === "carousel") {
    const [carouselIdx, setCarouselIdx] = useState(0);
    return (
      <div className="space-y-3">
        <div
          className="overflow-hidden relative cursor-pointer group"
          style={{ borderRadius: theme.cardRadius, aspectRatio: "16/9" }}
          onClick={() => setLightboxIdx(carouselIdx)}
        >
          <img
            key={carouselIdx}
            src={items[carouselIdx].image_url}
            alt={items[carouselIdx].caption || ""}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            loading="lazy"
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.25)" }}
          >
            <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>
        {/* Thumbnail strip */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {items.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setCarouselIdx(i)}
              className="shrink-0 overflow-hidden transition-all duration-200 relative"
              style={{
                width: "72px",
                height: "48px",
                borderRadius: "4px",
                border: i === carouselIdx
                  ? `2px solid ${theme.accentPrimary}`
                  : `2px solid transparent`,
                opacity: i === carouselIdx ? 1 : 0.55,
              }}
            >
              <img
                src={img.image_url}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
        {lightbox}
      </div>
    );
  }

  // ── Default grid ─────────────────────────────────────────────────────────────
  // Smart grid: 1-4 images = 2-col, 5+ = 3-col with featured first image
  const hasFeatured = items.length >= 3;
  const firstImg = items[0];
  const restImgs = hasFeatured ? items.slice(1) : items;

  return (
    <>
      <div className="space-y-2">
        {hasFeatured && (
          <div className="grid grid-cols-3 gap-2">
            {/* Featured: spans 2 cols, 2 rows */}
            <button
              key={firstImg.id}
              onClick={() => setLightboxIdx(0)}
              className={`col-span-2 row-span-2 group relative overflow-hidden cursor-pointer focus:outline-none ${imgAnimClass}`}
              style={{ borderRadius: theme.cardRadius, aspectRatio: "4/3" }}
            >
              <img
                src={firstImg.image_url}
                alt={firstImg.caption || ""}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.3)" }}
              >
                <ZoomIn className="w-7 h-7 text-white drop-shadow-lg" />
              </div>
              {firstImg.caption && (
                <div
                  className="absolute inset-x-0 bottom-0 px-3 pb-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}
                >
                  <p className="text-[11px] text-white/80 truncate">{firstImg.caption}</p>
                </div>
              )}
            </button>
            {/* Side small images */}
            {items.slice(1, 3).map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightboxIdx(i + 1)}
                className={`group relative overflow-hidden cursor-pointer focus:outline-none ${imgAnimClass}`}
                style={{ borderRadius: theme.cardRadius, aspectRatio: "1/1" }}
              >
                <img
                  src={img.image_url}
                  alt={img.caption || ""}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.35)" }}
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Remaining images in even grid */}
        {restImgs.length > 2 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {(hasFeatured ? items.slice(3) : items).map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightboxIdx(hasFeatured ? i + 3 : i)}
                className={`group relative overflow-hidden cursor-pointer focus:outline-none ${imgAnimClass}`}
                style={{ borderRadius: theme.cardRadius, aspectRatio: "1/1" }}
              >
                <img
                  src={img.image_url}
                  alt={img.caption || ""}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.35)" }}
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {lightbox}
    </>
  );
};

export default SectionGallery;
