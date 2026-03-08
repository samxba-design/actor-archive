import { useState } from "react";
import { FileText, Clock, ArrowUpRight } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import GlassCard from "@/components/portfolio/GlassCard";
import PDFReaderModal, { type PublishedPiece } from "@/components/portfolio/PDFReaderModal";

interface Props {
  items: PublishedPiece[];
  variant?: "magazine" | "grid" | "list";
}

const SectionPublishedWork = ({ items, variant = "magazine" }: Props) => {
  const theme = usePortfolioTheme();
  const [activePiece, setActivePiece] = useState<PublishedPiece | null>(null);

  const featured = items.filter((i) => i.is_featured);
  const rest = items.filter((i) => !i.is_featured);

  const showOverlay = (item: PublishedPiece) => item.show_text_overlay !== false;

  const getPreviewImage = (item: PublishedPiece) =>
    item.cover_image_url || item.pdf_thumbnail_url;

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
            <img
              src={image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{
                background: showOverlay(item)
                  ? `linear-gradient(to top, ${theme.bgPrimary}ee 0%, ${theme.bgPrimary}80 40%, transparent 100%)`
                  : "none",
              }}
            />
            {showOverlay(item) && (
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <CategoryBadge category={item.category} />
                <h3
                  className="text-lg sm:text-xl font-bold mt-2 leading-tight group-hover:underline decoration-1 underline-offset-4"
                  style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}
                >
                  {item.title}
                </h3>
                {item.summary && (
                  <p
                    className="text-sm mt-1.5 line-clamp-2 leading-relaxed"
                    style={{ color: theme.textSecondary }}
                  >
                    {item.summary}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2.5">
                  {item.publication && (
                    <span className="text-xs font-medium" style={{ color: theme.accentPrimary }}>
                      {item.publication}
                    </span>
                  )}
                  {(item.date || item.read_time) && (
                    <span className="text-xs flex items-center gap-1" style={{ color: theme.textTertiary }}>
                      {item.read_time && <Clock className="w-3 h-3" />}
                      {[item.date, item.read_time].filter(Boolean).join(" · ")}
                    </span>
                  )}
                </div>
              </div>
            )}
            {/* Read indicator */}
            <div
              className="absolute top-3 right-3 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: theme.accentPrimary, color: theme.textOnAccent }}
            >
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        )}
        {!image && (
          <div className="p-5">
            <CategoryBadge category={item.category} />
            <h3
              className="text-lg font-bold mt-2 group-hover:underline decoration-1 underline-offset-4"
              style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}
            >
              {item.title}
            </h3>
            {item.summary && (
              <p className="text-sm mt-1.5 line-clamp-3" style={{ color: theme.textSecondary }}>
                {item.summary}
              </p>
            )}
          </div>
        )}
      </button>
    );
  };

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
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {showOverlay(item) && (
              <div
                className="absolute inset-0 flex flex-col justify-end p-4"
                style={{
                  background: `linear-gradient(to top, ${theme.bgPrimary}dd 0%, transparent 70%)`,
                }}
              >
                <CategoryBadge category={item.category} />
                <h4
                  className="text-sm font-bold mt-1.5 leading-snug group-hover:underline decoration-1"
                  style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}
                >
                  {item.title}
                </h4>
              </div>
            )}
            {!showOverlay(item) && (
              <div
                className="absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: theme.accentPrimary, color: theme.textOnAccent }}
              >
                <ArrowUpRight className="w-3 h-3" />
              </div>
            )}
          </div>
        )}
        <div className="p-4">
          {!image && <CategoryBadge category={item.category} />}
          {!image && (
            <h4
              className="text-sm font-bold mt-1 group-hover:underline decoration-1"
              style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}
            >
              {item.title}
            </h4>
          )}
          {showOverlay(item) && image && item.summary && (
            <p className="text-xs line-clamp-2 mt-1" style={{ color: theme.textSecondary }}>
              {item.summary}
            </p>
          )}
          {!image && item.summary && (
            <p className="text-xs line-clamp-2 mt-1" style={{ color: theme.textSecondary }}>
              {item.summary}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {item.publication && (
              <span className="text-[11px] font-medium" style={{ color: theme.accentPrimary }}>
                {item.publication}
              </span>
            )}
            {item.date && (
              <span className="text-[11px]" style={{ color: theme.textTertiary }}>
                {item.date}
              </span>
            )}
          </div>
        </div>
      </button>
    );
  };

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
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: theme.accentPrimary + "15" }}
          >
            <FileText className="w-6 h-6" style={{ color: theme.accentPrimary }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CategoryBadge category={item.category} />
              <h4
                className="text-sm font-semibold mt-0.5 group-hover:underline decoration-1"
                style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}
              >
                {item.title}
              </h4>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 mt-1" style={{ color: theme.textTertiary }} />
          </div>
          {item.summary && (
            <p className="text-xs line-clamp-1 mt-0.5" style={{ color: theme.textSecondary }}>
              {item.summary}
            </p>
          )}
          <p className="text-[11px] mt-1" style={{ color: theme.textTertiary }}>
            {[item.publication, item.date, item.read_time].filter(Boolean).join(" · ")}
          </p>
        </div>
      </button>
    );
  };

  // ── Render by variant ──

  if (variant === "list") {
    return (
      <>
        <div className="space-y-2">
          {items.map((item) => (
            <ListItem key={item.id} item={item} />
          ))}
        </div>
        <PDFReaderModal
          piece={activePiece}
          pieces={items}
          onClose={() => setActivePiece(null)}
          onNavigate={(p) => setActivePiece(p)}
        />
      </>
    );
  }

  if (variant === "grid") {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <StandardCard key={item.id} item={item} />
          ))}
        </div>
        <PDFReaderModal
          piece={activePiece}
          pieces={items}
          onClose={() => setActivePiece(null)}
          onNavigate={(p) => setActivePiece(p)}
        />
      </>
    );
  }

  // Default: magazine — featured items span full width, rest in grid
  return (
    <>
      {/* Featured pieces */}
      {featured.length > 0 && (
        <div className={`grid gap-4 mb-6 ${featured.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
          {featured.map((item) => (
            <FeaturedCard key={item.id} item={item} />
          ))}
        </div>
      )}
      {/* Rest */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((item) => (
            <StandardCard key={item.id} item={item} />
          ))}
        </div>
      )}
      <PDFReaderModal
        piece={activePiece}
        pieces={items}
        onClose={() => setActivePiece(null)}
        onNavigate={(p) => setActivePiece(p)}
      />
    </>
  );
};

export default SectionPublishedWork;
