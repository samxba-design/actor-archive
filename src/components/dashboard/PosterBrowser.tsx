import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2, Film, Tv, Check, ArrowLeft, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TmdbResult {
  tmdb_id: number;
  title: string;
  year: string | null;
  poster_url: string | null;
  media_type: string;
  overview?: string | null;
}

interface PosterVariant {
  url_small: string;
  url_medium: string;
  url_large: string;
  aspect_ratio?: number;
  vote_average?: number;
  iso_639_1?: string | null;
}

interface BackdropVariant {
  url_small: string;
  url_large: string;
  aspect_ratio?: number;
}

interface TmdbDetailWithVariants {
  tmdb_id: number;
  media_type: string;
  title: string;
  year: number | null;
  poster_url: string | null;
  backdrop_url: string | null;
  genre: string[];
  director: string | null;
  notable_cast: string[];
  synopsis: string | null;
  runtime_minutes: number | null;
  network_or_studio: string | null;
  poster_variants: PosterVariant[];
  backdrop_variants: BackdropVariant[];
}

interface PosterBrowserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (data: { poster_url: string; backdrop_url?: string; title?: string; year?: number; genre?: string[]; director?: string; network_or_studio?: string }) => void;
  initialQuery?: string;
}

const PosterBrowser = ({ open, onOpenChange, onSelect, initialQuery = "" }: PosterBrowserProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");
  const [results, setResults] = useState<TmdbResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [manualUrl, setManualUrl] = useState("");

  // Step 2 state: selected title with variants
  const [selectedDetail, setSelectedDetail] = useState<TmdbDetailWithVariants | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<number | null>(null);

  useEffect(() => {
    if (open && initialQuery) {
      setQuery(initialQuery);
      setSelectedDetail(null);
      handleSearch(initialQuery, mediaType);
    }
    if (!open) {
      setSelectedDetail(null);
    }
  }, [open, initialQuery]);

  const handleSearch = async (q?: string, type?: "movie" | "tv") => {
    const searchQuery = q || query;
    const searchType = type || mediaType;
    if (searchQuery.length < 2) return;
    setLoading(true);
    setSelectedDetail(null);
    try {
      const session = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tmdb-search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`,
        {
          headers: {
            Authorization: `Bearer ${session.data.session?.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );
      const json = await response.json();
      setResults(json.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleClick = async (result: TmdbResult) => {
    setLoadingDetail(result.tmdb_id);
    try {
      const session = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tmdb-search?id=${result.tmdb_id}&type=${result.media_type}`,
        {
          headers: {
            Authorization: `Bearer ${session.data.session?.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );
      const detail: TmdbDetailWithVariants = await response.json();
      setSelectedDetail(detail);
    } catch {
      // Fallback: just select the single poster
      if (result.poster_url) {
        onSelect({ poster_url: result.poster_url });
        onOpenChange(false);
      }
    } finally {
      setLoadingDetail(null);
    }
  };

  const handleVariantSelect = (variant: PosterVariant, backdropUrl?: string) => {
    if (!selectedDetail) return;
    onSelect({
      poster_url: variant.url_medium,
      backdrop_url: backdropUrl || selectedDetail.backdrop_url || undefined,
      title: selectedDetail.title,
      year: selectedDetail.year || undefined,
      genre: selectedDetail.genre,
      director: selectedDetail.director || undefined,
      network_or_studio: selectedDetail.network_or_studio || undefined,
    });
    onOpenChange(false);
  };

  const handleBackdropSelect = (backdrop: BackdropVariant) => {
    if (!selectedDetail) return;
    // Select the default poster + this backdrop
    onSelect({
      poster_url: selectedDetail.poster_url || "",
      backdrop_url: backdrop.url_large,
      title: selectedDetail.title,
      year: selectedDetail.year || undefined,
      genre: selectedDetail.genre,
      director: selectedDetail.director || undefined,
      network_or_studio: selectedDetail.network_or_studio || undefined,
    });
    onOpenChange(false);
  };

  const handleManualUrl = () => {
    if (manualUrl.trim()) {
      onSelect({ poster_url: manualUrl.trim() });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Browse Posters</DialogTitle>
        </DialogHeader>

        {/* Step 2: Variant selection view */}
        {selectedDetail ? (
          <VariantView
            detail={selectedDetail}
            onBack={() => setSelectedDetail(null)}
            onSelectPoster={handleVariantSelect}
            onSelectBackdrop={handleBackdropSelect}
          />
        ) : (
          <>
            <div className="space-y-3">
              {/* Search */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search movies & TV shows..."
                    className="pl-9"
                  />
                </div>
                <Tabs value={mediaType} onValueChange={(v) => { setMediaType(v as "movie" | "tv"); if (query.length >= 2) handleSearch(query, v as "movie" | "tv"); }}>
                  <TabsList className="h-9">
                    <TabsTrigger value="movie" className="text-xs px-3"><Film className="h-3 w-3 mr-1" />Film</TabsTrigger>
                    <TabsTrigger value="tv" className="text-xs px-3"><Tv className="h-3 w-3 mr-1" />TV</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button onClick={() => handleSearch()} disabled={loading || query.length < 2} size="sm">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
              </div>

              {/* Manual URL */}
              <div className="flex items-center gap-2">
                <Input
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="Or paste a poster URL directly..."
                  className="flex-1 text-xs"
                />
                <Button variant="outline" size="sm" onClick={handleManualUrl} disabled={!manualUrl.trim()}>
                  Use URL
                </Button>
              </div>
            </div>

            {/* Results grid — Step 1: title cards */}
            <div className="flex-1 overflow-y-auto mt-3 min-h-0">
              {loading && (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
              {!loading && results.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {results.map((r) => (
                    <button
                      key={r.tmdb_id}
                      onClick={() => handleTitleClick(r)}
                      disabled={loadingDetail === r.tmdb_id}
                      className="group relative rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-200 bg-muted aspect-[2/3] focus:outline-none focus:ring-2 focus:ring-primary hover:scale-105 hover:shadow-lg hover:z-10"
                    >
                      {r.poster_url ? (
                        <img src={r.poster_url} alt={r.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-[10px] font-medium text-white truncate">{r.title}</p>
                        {r.year && <p className="text-[9px] text-white/60">{r.year}</p>}
                      </div>
                      {loadingDetail === r.tmdb_id && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-white" />
                        </div>
                      )}
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Image className="w-3 h-3 text-primary-foreground" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {!loading && results.length === 0 && query.length >= 2 && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No results found. Try a different search term.
                </div>
              )}
              {!loading && results.length === 0 && query.length < 2 && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  Search for a movie or TV show to browse posters.
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

/** Step 2: Shows all poster variants + backdrop variants for a selected title */
function VariantView({
  detail,
  onBack,
  onSelectPoster,
  onSelectBackdrop,
}: {
  detail: TmdbDetailWithVariants;
  onBack: () => void;
  onSelectPoster: (variant: PosterVariant, backdropUrl?: string) => void;
  onSelectBackdrop: (backdrop: BackdropVariant) => void;
}) {
  const hasPosterVariants = detail.poster_variants && detail.poster_variants.length > 0;
  const hasBackdropVariants = detail.backdrop_variants && detail.backdrop_variants.length > 0;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="shrink-0">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{detail.title}</p>
          <p className="text-xs text-muted-foreground">
            {detail.year}{detail.director ? ` · ${detail.director}` : ""}{detail.genre?.length ? ` · ${detail.genre.slice(0, 2).join(", ")}` : ""}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 space-y-4">
        {/* Poster variants */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Posters ({hasPosterVariants ? detail.poster_variants.length : 0})
          </p>
          {hasPosterVariants ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {detail.poster_variants.map((variant, i) => (
                <button
                  key={i}
                  onClick={() => onSelectPoster(variant)}
                  className="group relative rounded-md overflow-hidden border border-border hover:border-primary transition-all duration-200 bg-muted aspect-[2/3] focus:outline-none focus:ring-2 focus:ring-primary hover:scale-105 hover:shadow-lg hover:z-10"
                >
                  <img
                    src={variant.url_small}
                    alt={`${detail.title} poster ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                  {variant.iso_639_1 && (
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-[8px] px-1 rounded">
                      {variant.iso_639_1.toUpperCase()}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No poster variants available.</p>
          )}
        </div>

        {/* Backdrop variants */}
        {hasBackdropVariants && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Backdrops ({detail.backdrop_variants.length})
            </p>
            <div className="grid grid-cols-2 gap-2">
              {detail.backdrop_variants.map((backdrop, i) => (
                <button
                  key={i}
                  onClick={() => onSelectBackdrop(backdrop)}
                  className="group relative rounded-md overflow-hidden border border-border hover:border-primary transition-all duration-200 bg-muted aspect-video focus:outline-none focus:ring-2 focus:ring-primary hover:scale-[1.02] hover:shadow-lg hover:z-10"
                >
                  <img
                    src={backdrop.url_small}
                    alt={`${detail.title} backdrop ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="px-2 py-1 rounded bg-primary text-primary-foreground text-[10px] font-medium">
                        Use as backdrop
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PosterBrowser;
