import { BookOpen, ExternalLink } from "lucide-react";

interface Props {
  items: any[];
}

const SectionBookshelf = ({ items }: Props) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
    {items.map((book) => {
      const purchaseLinks = (book.purchase_links as any[]) || [];
      return (
        <div key={book.id} className="space-y-2 text-center">
          <div
            className="relative overflow-hidden mx-auto shadow-lg"
            style={{
              width: "100%",
              maxWidth: "160px",
              aspectRatio: "2/3",
              borderRadius: "var(--portfolio-radius)",
              backgroundColor: "hsl(var(--portfolio-muted))",
            }}
          >
            {(book.poster_url || book.custom_image_url) ? (
              <img src={book.poster_url || book.custom_image_url} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-3">
                <BookOpen className="w-8 h-8" style={{ color: "hsl(var(--portfolio-muted-fg))" }} />
              </div>
            )}
          </div>
          <p className="font-semibold text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{book.title}</p>
          {book.year && <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{book.year}</p>}
          {book.publisher && <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{book.publisher}</p>}
          {purchaseLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1">
              {purchaseLinks.map((link: any, i: number) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded" style={{ backgroundColor: "hsl(var(--portfolio-accent))", color: "hsl(var(--portfolio-accent-fg))" }}>
                  {link.label || "Buy"} <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export default SectionBookshelf;
