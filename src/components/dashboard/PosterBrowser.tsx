import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2, Film, Tv, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TmdbResult {
  tmdb_id: number;
  title: string;
  year: string | null;
  poster_url: string | null;
  media_type: string;
}

interface TmdbDetail {
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
  const [selecting, setSelecting] = useState<number | null>(null);
  const [manualUrl, setManualUrl] = useState("");

  useEffect(() => {
    if (open && initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery, mediaType);
    }
  }, [open, initialQuery]);

  const handleSearch = async (q?: string, type?: "movie" | "tv") => {
    const searchQuery = q || query;
    const searchType = type || mediaType;
    if (searchQuery.length < 2) return;
    setLoading(true);
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

  const handleSelect = async (result: TmdbResult) => {
    setSelecting(result.tmdb_id);
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
      const detail: TmdbDetail = await response.json();
      onSelect({
        poster_url: detail.poster_url || "",
        backdrop_url: detail.backdrop_url || undefined,
        title: detail.title,
        year: detail.year || undefined,
        genre: detail.genre,
        director: detail.director || undefined,
        network_or_studio: detail.network_or_studio || undefined,
      });
      onOpenChange(false);
    } catch {
      if (result.poster_url) {
        onSelect({ poster_url: result.poster_url });
        onOpenChange(false);
      }
    } finally {
      setSelecting(null);
    }
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

        {/* Results grid */}
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
                  onClick={() => handleSelect(r)}
                  disabled={selecting === r.tmdb_id}
                  className="group relative rounded-lg overflow-hidden border border-border hover:border-primary transition-colors bg-muted aspect-[2/3] focus:outline-none focus:ring-2 focus:ring-primary"
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
                  {selecting === r.tmdb_id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
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
      </DialogContent>
    </Dialog>
  );
};

export default PosterBrowser;
