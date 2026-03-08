import { useState } from "react";
import { X, Download, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

export interface PublishedPiece {
  id: string;
  title: string;
  summary?: string;
  cover_image_url?: string;
  pdf_thumbnail_url?: string;
  pdf_url?: string;
  article_url?: string;
  category?: string;
  publication?: string;
  date?: string;
  read_time?: string;
  is_featured?: boolean;
  show_text_overlay?: boolean; // default true
}

interface PDFReaderModalProps {
  piece: PublishedPiece | null;
  pieces?: PublishedPiece[];
  onClose: () => void;
  onNavigate?: (piece: PublishedPiece) => void;
}

const PDFReaderModal = ({ piece, pieces = [], onClose, onNavigate }: PDFReaderModalProps) => {
  const theme = usePortfolioTheme();
  if (!piece) return null;

  const currentIndex = pieces.findIndex((p) => p.id === piece.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < pieces.length - 1;

  const pdfSrc = piece.pdf_url || piece.article_url || "";

  return (
    <div
      className="fixed inset-0 z-[9999] flex"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      {/* Sidebar metadata */}
      <div
        className="hidden md:flex flex-col w-80 shrink-0 p-6 overflow-y-auto"
        style={{ backgroundColor: theme.bgPrimary, borderRight: `1px solid ${theme.borderDefault}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {piece.cover_image_url && (
          <img
            src={piece.cover_image_url}
            alt=""
            className="w-full aspect-[3/2] object-cover rounded-lg mb-5"
          />
        )}
        <h2
          className="text-xl font-bold mb-2"
          style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}
        >
          {piece.title}
        </h2>
        {piece.publication && (
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: theme.accentPrimary }}>
            {piece.publication}
          </p>
        )}
        {(piece.date || piece.read_time) && (
          <p className="text-xs mb-4" style={{ color: theme.textTertiary }}>
            {[piece.date, piece.read_time].filter(Boolean).join(" · ")}
          </p>
        )}
        {piece.summary && (
          <p className="text-sm leading-relaxed mb-6" style={{ color: theme.textSecondary }}>
            {piece.summary}
          </p>
        )}
        <div className="mt-auto space-y-2">
          {piece.pdf_url && (
            <a
              href={piece.pdf_url}
              download
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: theme.accentPrimary,
                color: theme.textOnAccent,
              }}
            >
              <Download className="w-4 h-4" /> Download PDF
            </a>
          )}
          {piece.article_url && (
            <a
              href={piece.article_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: theme.bgSecondary,
                color: theme.textPrimary,
                border: `1px solid ${theme.borderDefault}`,
              }}
            >
              <ExternalLink className="w-4 h-4" /> View Original
            </a>
          )}
        </div>
      </div>

      {/* PDF viewer area */}
      <div className="flex-1 relative flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ backgroundColor: theme.bgPrimary }}>
          <div className="md:hidden">
            <h3 className="text-sm font-semibold truncate" style={{ color: theme.textPrimary }}>{piece.title}</h3>
            {piece.publication && (
              <p className="text-xs" style={{ color: theme.textTertiary }}>{piece.publication}</p>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2">
            {hasPrev && onNavigate && (
              <button
                onClick={() => onNavigate(pieces[currentIndex - 1])}
                className="p-1.5 rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: theme.bgSecondary, color: theme.textSecondary }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {pieces.length > 1 && (
              <span className="text-xs tabular-nums" style={{ color: theme.textTertiary }}>
                {currentIndex + 1} of {pieces.length}
              </span>
            )}
            {hasNext && onNavigate && (
              <button
                onClick={() => onNavigate(pieces[currentIndex + 1])}
                className="p-1.5 rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: theme.bgSecondary, color: theme.textSecondary }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:opacity-80"
            style={{ backgroundColor: theme.bgSecondary, color: theme.textSecondary }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Embedded PDF / article */}
        <div className="flex-1 bg-black/20">
          {pdfSrc ? (
            <iframe
              src={pdfSrc}
              className="w-full h-full border-0"
              title={piece.title}
              allow="fullscreen"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm" style={{ color: theme.textTertiary }}>No document available</p>
            </div>
          )}
        </div>

        {/* Mobile bottom bar */}
        <div className="md:hidden flex items-center gap-2 p-3 shrink-0" style={{ backgroundColor: theme.bgPrimary }}>
          {piece.pdf_url && (
            <a
              href={piece.pdf_url}
              download
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: theme.accentPrimary, color: theme.textOnAccent }}
            >
              <Download className="w-4 h-4" /> Download
            </a>
          )}
          {piece.article_url && (
            <a
              href={piece.article_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary, border: `1px solid ${theme.borderDefault}` }}
            >
              <ExternalLink className="w-4 h-4" /> Original
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFReaderModal;
