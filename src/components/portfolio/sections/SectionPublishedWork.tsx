import { useState } from "react";
import { FileText, Clock, ArrowUpRight } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import GlassCard from "@/components/portfolio/GlassCard";
import PDFReaderModal, { type PublishedPiece } from "@/components/portfolio/PDFReaderModal";

export type PublishedWorkVariant = "magazine" | "grid" | "list" | "card" | "compact" | "text-only" | "visual" | "mosaic";

interface Props {
  items: PublishedPiece[];
  variant?: PublishedWorkVariant;
  columns?: 1 | 2 | 3 | 4 | 5;
  aspectRatio?: "square" | "landscape" | "portrait" | "wide";
}

const ASPECT_CLASSES: Record<string, string> = {
  square: "aspect-square",
  landscape: "aspect-[16/9]",
  portrait: "aspect-[3/4]",
  wide: "aspect-[2/1]",
};

const COL_CLASSES: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
};

const SectionPublishedWork = ({ items, variant = "magazine", columns, aspectRatio }: Props) => {
  const theme = usePortfolioTheme();
  const [activePiece, setActivePiece] = useState<PublishedPiece | null>(null);

  const featured = items.filter((i) => i.is_featured);
  const rest = items.filter((i) => !i.is_featured);

  const showOverlay = (item: PublishedPiece) => item.show_text_overlay !== false;

  const getPreviewImage = (item: PublishedPiece) =>
    item.cover_image_url || item.pdf_thumbnail_url;

  const aspect = aspectRatio || "landscape";
  const aspectClass = ASPECT_CLASSES[aspect];

  const getColumns = () => {
    if (columns) return columns;
    switch (variant) {
      case "visual": case "grid": case "mosaic": return 3;
      case "card": return 2;
      case "compact": case "text-only": case "list": return 1;
      default: return 3;
    }
  };

  const colClass = COL_CLASSES[getColumns()];

  const CategoryBadge = ({ category }: { category?: string }) => {
    if (!category) return null;
    return (
      <span
        className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
        style={{
          backgroundColor: theme.accentPrimary + "20",
          color: theme.accentPrimary,
        }}
      >
        {category}
      </span>
    );
  };

  const modal = (
    <PDFReaderModal
      piece={activePiece}
      pieces={items}
      onClose={() => setActivePiece(null)}
      onNavigate={(p) => setActivePiece(p)}
    />
  );

  // ── CARD variant: Rich cards with stats ──
  const CardItem = ({ item }: { item: PublishedPiece }) => {
    const image = getPreviewImage(item);
    return (
      <button
        onClick={() => setActivePiece(item)}
        className="group block w-full text-left overflow-hidden transition-all duration-300 hover:shadow-lg"
        style={{
          backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
          border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
          borderRadius: theme.cardRadius,
          boxShadow: theme.cardShadow,
        }}
      >
        {image && (
          <div className={`relative ${aspectClass} overflow-hidden`}>
            <img src={image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          </div>
        )}
        <div className="p-4 space-y-2">
          <CategoryBadge category={item.category} />
          <h4 className="text-sm font-bold leading-snug group-hover:underline decoration-1 underline-offset-4" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>
            {item.title}
          </h4>
          {item.summary && (
            <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: theme.textSecondary }}>{item.summary}</p>
          )}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {item.publication && (
              <span className="text-[11px] font-semibold" style={{ color: theme.accentPrimary }}>{item.publication}</span>
            )}
            {item.read_time && (
              <span className="text-[11px] flex items-center gap-0.5" style={{ color: theme.textTertiary }}>
                <Clock className="w-3 h-3" /> {item.read_time}
              </span>
            )}
            {item.date && (
              <span className="text-[11px]" style={{ color: theme.textTertiary }}>{item.date}</span>
            )}
          </div>
        </div>
      </button>
    );
  };

  // ── COMPACT variant: Dense horizontal rows ──
  const CompactItem = ({ item }: { item: PublishedPiece }) => {
    const image = getPreviewImage(item);
    return (
      <button
        onClick={() => setActivePiece(item)}
        className="group flex gap-3 items-center w-full text-left px-3 py-2.5 transition-all rounded-lg"
        style={{
          backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
          border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
          borderRadius: theme.cardRadius,
        }}
      >
        {image ? (
          <div className="w-10 h-10 rounded-md overflow-hidden shrink-0">
            <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: theme.accentPrimary + "15" }}>
            <FileText className="w-4 h-4" style={{ color: theme.accentPrimary }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate group-hover:underline decoration-1" style={{ color: theme.textPrimary }}>{item.title}</h4>
          <p className="text-[11px] truncate" style={{ color: theme.textTertiary }}>
            {[item.publication, item.date, item.read_time].filter(Boolean).join(" · ")}
          </p>
        </div>
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: theme.textTertiary }} />
      </button>
    );
  };

  // ── TEXT-ONLY variant: Clean typography list ──
  const TextOnlyItem = ({ item }: { item: PublishedPiece }) => (
    <button
      onClick={() => setActivePiece(item)}
      className="group flex items-baseline justify-between w-full text-left py-3 border-b transition-colors"
      style={{ borderColor: theme.borderDefault }}
    >
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-sm font-semibold group-hover:underline decoration-1 underline-offset-4" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>
            {item.title}
          </h4>
          <CategoryBadge category={item.category} />
        </div>
        <p className="text-[11px] mt-0.5" style={{ color: theme.textTertiary }}>
          {[item.publication, item.date].filter(Boolean).join(" · ")}
        </p>
      </div>
      <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100" style={{ color: theme.accentPrimary }} />
    </button>
  );

  // ── VISUAL variant: Large image tiles with overlay ──
  const VisualItem = ({ item }: { item: PublishedPiece }) => {
    const image = getPreviewImage(item);
    return (
      <button
        onClick={() => setActivePiece(item)}
        className="group relative block w-full overflow-hidden transition-all duration-300"
        style={{ borderRadius: theme.cardRadius }}
      >
        <div className={`relative ${aspectClass} overflow-hidden`} style={{ backgroundColor: theme.bgElevated }}>
          {image ? (
            <img src={image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:blur-[2px]" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: theme.accentPrimary + "15" }}>
              <FileText className="w-10 h-10" style={{ color: theme.accentPrimary + "40" }} />
            </div>
          )}
          <div
            className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(to top, ${theme.bgPrimary}ee 0%, ${theme.bgPrimary}80 50%, transparent 100%)` }}
          >
            <CategoryBadge category={item.category} />
            <h4 className="text-sm font-bold mt-1.5 leading-snug" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>
              {item.title}
            </h4>
            {item.publication && (
              <span className="text-[11px] mt-1" style={{ color: theme.accentPrimary }}>{item.publication}</span>
            )}
          </div>
          {/* Always-visible title bar at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 px-3 py-2 group-hover:opacity-0 transition-opacity duration-300"
            style={{ background: `linear-gradient(to top, ${theme.bgPrimary}cc, transparent)` }}
          >
            <h4 className="text-xs font-semibold truncate" style={{ color: theme.textPrimary }}>{item.title}</h4>
          </div>
        </div>
      </button>
    );
  };

  // ── MOSAIC variant: Masonry-like mixed sizes ──
  const MosaicItem = ({ item, index }: { item: PublishedPiece; index: number }) => {
    const image = getPreviewImage(item);
    const isTall = index % 5 === 0 || index % 5 === 3;
    return (
      <button
        onClick={() => setActivePiece(item)}
        className="group relative block w-full overflow-hidden transition-all duration-300"
        style={{ borderRadius: theme.cardRadius, gridRow: isTall ? "span 2" : "span 1" }}
      >
        <div className="relative w-full h-full min-h-[160px] overflow-hidden" style={{ backgroundColor: theme.bgElevated }}>
          {image ? (
            <img src={image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: theme.accentPrimary + "10" }}>
              <FileText className="w-8 h-8" style={{ color: theme.accentPrimary + "30" }} />
            </div>
          )}
          <div
            className="absolute inset-0 flex flex-col justify-end p-3 transition-opacity"
            style={{ background: `linear-gradient(to top, ${theme.bgPrimary}dd 0%, transparent 60%)` }}
          >
            <CategoryBadge category={item.category} />
            <h4 className="text-xs font-bold mt-1 leading-snug group-hover:underline" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>
              {item.title}
            </h4>
            {item.publication && (
              <span className="text-[10px] mt-0.5" style={{ color: theme.accentPrimary }}>{item.publication}</span>
            )}
          </div>
        </div>
      </button>
    );
  };

  // ── Featured card (shared by magazine) ──
  const FeaturedCard = ({ item }: { item: PublishedPiece }) => {
    const image = getPreviewImage(item);
    return (
      <button
        onClick={() => setActivePiece(item)}
        className="group block w-full text-left overflow-hidden transition-all duration-300 hover:shadow-lg"
        style={{
          backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
          border: `${theme.cardBorderWidth} solid ${theme.accentPrimary}30`,
          borderRadius: theme.cardRadius,
          boxShadow: theme.cardShadow,
        }}
      >
        {image && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <img src={image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0" style={{ background: showOverlay(item) ? `linear-gradient(to top, ${theme.bgPrimary}ee 0%, ${theme.bgPrimary}80 40%, transparent 100%)` : "none" }} />
            {showOverlay(item) && (
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <CategoryBadge category={item.category} />
                <h3 className="text-lg sm:text-xl font-bold mt-2 leading-tight group-hover:underline decoration-1 underline-offset-4" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{item.title}</h3>
                {item.summary && <p className="text-sm mt-1.5 line-clamp-2 leading-relaxed" style={{ color: theme.textSecondary }}>{item.summary}</p>}
                <div className="flex items-center gap-3 mt-2.5">
                  {item.publication && <span className="text-xs font-medium" style={{ color: theme.accentPrimary }}>{item.publication}</span>}
                  {(item.date || item.read_time) && (
                    <span className="text-xs flex items-center gap-1" style={{ color: theme.textTertiary }}>
                      {item.read_time && <Clock className="w-3 h-3" />}
                      {[item.date, item.read_time].filter(Boolean).join(" · ")}
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="absolute top-3 right-3 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: theme.accentPrimary, color: theme.textOnAccent }}>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        )}
        {!image && (
          <div className="p-5">
            <CategoryBadge category={item.category} />
            <h3 className="text-lg font-bold mt-2 group-hover:underline decoration-1 underline-offset-4" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{item.title}</h3>
            {item.summary && <p className="text-sm mt-1.5 line-clamp-3" style={{ color: theme.textSecondary }}>{item.summary}</p>}
          </div>
        )}
      </button>
    );
  };

  // ── Standard grid card ──
  const StandardCard = ({ item }: { item: PublishedPiece }) => {
    const image = getPreviewImage(item);
    return (
      <button
        onClick={() => setActivePiece(item)}
        className="group block w-full text-left overflow-hidden transition-all duration-300 hover:shadow-md"
        style={{
          backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
          border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
          borderRadius: theme.cardRadius,
          boxShadow: theme.cardShadow,
        }}
      >
        {image && (
          <div className={`relative ${aspectClass} overflow-hidden`}>
            <img src={image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            {showOverlay(item) && (
              <div className="absolute inset-0 flex flex-col justify-end p-4" style={{ background: `linear-gradient(to top, ${theme.bgPrimary}dd 0%, transparent 70%)` }}>
                <CategoryBadge category={item.category} />
                <h4 className="text-sm font-bold mt-1.5 leading-snug group-hover:underline decoration-1" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{item.title}</h4>
              </div>
            )}
          </div>
        )}
        <div className="p-4">
          {!image && <CategoryBadge category={item.category} />}
          {!image && (
            <h4 className="text-sm font-bold mt-1 group-hover:underline decoration-1" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{item.title}</h4>
          )}
          {item.summary && (
            <p className="text-xs line-clamp-2 mt-1" style={{ color: theme.textSecondary }}>{item.summary}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {item.publication && <span className="text-[11px] font-medium" style={{ color: theme.accentPrimary }}>{item.publication}</span>}
            {item.date && <span className="text-[11px]" style={{ color: theme.textTertiary }}>{item.date}</span>}
          </div>
        </div>
      </button>
    );
  };

  // ── List row ──
  const ListItem = ({ item }: { item: PublishedPiece }) => {
    const image = getPreviewImage(item);
    return (
      <button
        onClick={() => setActivePiece(item)}
        className="group flex gap-4 items-start w-full text-left p-3 transition-all rounded-lg hover:opacity-90"
        style={{
          backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
          border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
          borderRadius: theme.cardRadius,
        }}
      >
        {image ? (
          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: theme.bgElevated }}>
            <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: theme.accentPrimary + "15" }}>
            <FileText className="w-6 h-6" style={{ color: theme.accentPrimary }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CategoryBadge category={item.category} />
              <h4 className="text-sm font-semibold mt-0.5 group-hover:underline decoration-1" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{item.title}</h4>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 mt-1" style={{ color: theme.textTertiary }} />
          </div>
          {item.summary && <p className="text-xs line-clamp-1 mt-0.5" style={{ color: theme.textSecondary }}>{item.summary}</p>}
          <p className="text-[11px] mt-1" style={{ color: theme.textTertiary }}>
            {[item.publication, item.date, item.read_time].filter(Boolean).join(" · ")}
          </p>
        </div>
      </button>
    );
  };

  // ── Render by variant ──

  if (variant === "text-only") {
    return (
      <>
        <div className="divide-y" style={{ borderColor: "transparent" }}>
          {items.map((item) => <TextOnlyItem key={item.id} item={item} />)}
        </div>
        {modal}
      </>
    );
  }

  if (variant === "compact") {
    return (
      <>
        <div className="space-y-1.5">
          {items.map((item) => <CompactItem key={item.id} item={item} />)}
        </div>
        {modal}
      </>
    );
  }

  if (variant === "card") {
    return (
      <>
        <div className={`grid ${colClass} gap-4`}>
          {items.map((item) => <CardItem key={item.id} item={item} />)}
        </div>
        {modal}
      </>
    );
  }

  if (variant === "visual") {
    return (
      <>
        <div className={`grid ${colClass} gap-3`}>
          {items.map((item) => <VisualItem key={item.id} item={item} />)}
        </div>
        {modal}
      </>
    );
  }

  if (variant === "mosaic") {
    return (
      <>
        <div className={`grid ${colClass} gap-3 auto-rows-[180px]`}>
          {items.map((item, i) => <MosaicItem key={item.id} item={item} index={i} />)}
        </div>
        {modal}
      </>
    );
  }

  if (variant === "list") {
    return (
      <>
        <div className="space-y-2">
          {items.map((item) => <ListItem key={item.id} item={item} />)}
        </div>
        {modal}
      </>
    );
  }

  if (variant === "grid") {
    return (
      <>
        <div className={`grid ${colClass} gap-4`}>
          {items.map((item) => <StandardCard key={item.id} item={item} />)}
        </div>
        {modal}
      </>
    );
  }

  // Default: magazine — featured items span full width, rest in grid
  return (
    <>
      {featured.length > 0 && (
        <div className={`grid gap-4 mb-6 ${featured.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
          {featured.map((item) => <FeaturedCard key={item.id} item={item} />)}
        </div>
      )}
      {rest.length > 0 && (
        <div className={`grid ${colClass} gap-4`}>
          {rest.map((item) => <StandardCard key={item.id} item={item} />)}
        </div>
      )}
      {modal}
    </>
  );
};

export default SectionPublishedWork;
