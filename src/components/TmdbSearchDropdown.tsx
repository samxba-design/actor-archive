import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Film, Tv, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface TmdbResult {
  tmdb_id: number;
  title: string;
  year: string | null;
  poster_url: string | null;
  media_type: string;
}

export interface TmdbDetail {
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

interface Props {
  label?: string;
  mediaType?: "movie" | "tv";
  onSelect: (detail: TmdbDetail) => void;
  placeholder?: string;
}

const TmdbSearchDropdown = ({
  label = "Search Film/TV",
  mediaType = "movie",
  onSelect,
  placeholder = "Start typing a title...",
}: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await supabase.functions.invoke("tmdb-search", {
          body: null,
          headers: {},
          method: "GET",
        });
        // Edge function uses query params, but invoke sends POST by default
        // Use fetch directly for GET with params
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tmdb-search?query=${encodeURIComponent(query)}&type=${mediaType}`,
          {
            headers: {
              Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          }
        );
        const json = await response.json();
        setResults(json.results || []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, mediaType]);

  const handleSelect = async (result: TmdbResult) => {
    setLoadingDetail(result.tmdb_id);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tmdb-search?id=${result.tmdb_id}&type=${result.media_type}`,
        {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );
      const detail: TmdbDetail = await response.json();
      onSelect(detail);
      setQuery(detail.title);
      setOpen(false);
    } catch {
      // fallback: use basic result data
      onSelect({
        tmdb_id: result.tmdb_id,
        media_type: result.media_type,
        title: result.title,
        year: result.year ? parseInt(result.year) : null,
        poster_url: result.poster_url,
        backdrop_url: null,
        genre: [],
        director: null,
        notable_cast: [],
        synopsis: null,
        runtime_minutes: null,
        network_or_studio: null,
      });
      setQuery(result.title);
      setOpen(false);
    } finally {
      setLoadingDetail(null);
    }
  };

  const Icon = mediaType === "tv" ? Tv : Film;

  return (
    <div ref={containerRef} className="relative">
      {label && <Label className="mb-2 block">{label}</Label>}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {results.map((r) => (
            <button
              key={r.tmdb_id}
              onClick={() => handleSelect(r)}
              disabled={loadingDetail === r.tmdb_id}
              className="w-full flex items-center gap-3 p-2.5 hover:bg-accent text-left transition-colors"
            >
              {r.poster_url ? (
                <img
                  src={r.poster_url}
                  alt={r.title}
                  className="w-8 h-12 object-cover rounded-sm bg-muted flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-12 bg-muted rounded-sm flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                {r.year && (
                  <p className="text-xs text-muted-foreground">{r.year}</p>
                )}
              </div>
              {loadingDetail === r.tmdb_id && (
                <Loader2 className="w-4 h-4 text-muted-foreground animate-spin flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {open && results.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-lg shadow-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">No results found</p>
        </div>
      )}
    </div>
  );
};

export default TmdbSearchDropdown;
