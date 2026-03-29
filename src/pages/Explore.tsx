import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import SEOHead from "@/components/SEOHead";
import { Search, MapPin } from "lucide-react";

interface Profile {
  id: string;
  slug: string;
  display_name: string | null;
  tagline: string | null;
  location: string | null;
  profile_type: string | null;
  profile_photo_url: string | null;
}

const PROFILE_TYPE_COLORS: Record<string, string> = {
  actor: "#3b82f6",
  screenwriter: "#f59e0b",
  director_producer: "#a855f7",
  copywriter: "#22c55e",
  tv_writer: "#ef4444",
  playwright: "#f97316",
  multi_hyphenate: "#ec4899",
};

const PROFILE_TYPE_LABELS: Record<string, string> = {
  actor: "Actor",
  screenwriter: "Screenwriter",
  director_producer: "Director",
  copywriter: "Copywriter",
  tv_writer: "TV Writer",
  playwright: "Playwright",
  journalist: "Journalist",
  corporate_video: "Video Producer",
  multi_hyphenate: "Multi-Hyphenate",
};

const FILTER_CHIPS = [
  { value: "All", label: "All" },
  { value: "actor", label: "Actors" },
  { value: "screenwriter", label: "Screenwriters" },
  { value: "director_producer", label: "Directors" },
  { value: "copywriter", label: "Copywriters" },
  { value: "tv_writer", label: "TV Writers" },
  { value: "playwright", label: "Playwrights" },
  { value: "multi_hyphenate", label: "Multi-Hyphenates" },
];

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getBadgeColor(type: string | null): string {
  return type ? (PROFILE_TYPE_COLORS[type] || "#6b7280") : "#6b7280";
}

function getTypeLabel(type: string | null): string {
  return type ? (PROFILE_TYPE_LABELS[type] || type) : "Creative";
}

const SkeletonCard = () => (
  <div
    className="rounded-xl overflow-hidden animate-pulse"
    style={{
      background: "hsl(var(--landing-card))",
      border: "1px solid hsl(var(--landing-border))",
    }}
  >
    <div className="p-6 flex flex-col items-center gap-3">
      <div
        className="w-20 h-20 rounded-full"
        style={{ background: "hsl(var(--landing-border))" }}
      />
      <div
        className="h-4 w-32 rounded"
        style={{ background: "hsl(var(--landing-border))" }}
      />
      <div
        className="h-3 w-24 rounded"
        style={{ background: "hsl(var(--landing-border))" }}
      />
      <div
        className="h-3 w-20 rounded"
        style={{ background: "hsl(var(--landing-border))" }}
      />
      <div
        className="h-8 w-full rounded"
        style={{ background: "hsl(var(--landing-border))" }}
      />
    </div>
  </div>
);

const ProfileCard = ({ profile }: { profile: Profile }) => {
  const badgeColor = getBadgeColor(profile.profile_type);
  const initials = getInitials(profile.display_name);
  const typeLabel = getTypeLabel(profile.profile_type);

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col transition-all hover:scale-[1.02] hover:shadow-xl"
      style={{
        background: "hsl(var(--landing-card))",
        border: "1px solid hsl(var(--landing-border))",
      }}
    >
      <div className="p-6 flex flex-col items-center gap-3 flex-1">
        {/* Avatar */}
        {profile.profile_photo_url ? (
          <img
            src={profile.profile_photo_url}
            alt={profile.display_name || "Profile"}
            className="w-20 h-20 rounded-full object-cover"
            style={{ border: `2px solid ${badgeColor}40` }}
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: `${badgeColor}30`, border: `2px solid ${badgeColor}50` }}
          >
            {initials}
          </div>
        )}

        {/* Badge */}
        <span
          className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
          style={{ background: badgeColor }}
        >
          {typeLabel}
        </span>

        {/* Name */}
        <h3
          className="text-base font-bold text-center leading-tight"
          style={{ color: "hsl(var(--landing-fg))" }}
        >
          {profile.display_name || "Creative Professional"}
        </h3>

        {/* Tagline */}
        {profile.tagline && (
          <p
            className="text-sm text-center line-clamp-2"
            style={{ color: "hsl(var(--landing-fg) / 0.6)" }}
          >
            {profile.tagline}
          </p>
        )}

        {/* Location */}
        {profile.location && (
          <div
            className="flex items-center gap-1 text-xs"
            style={{ color: "hsl(var(--landing-fg) / 0.5)" }}
          >
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{profile.location}</span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <Link
          to={`/p/${profile.slug}`}
          className="block w-full text-center text-sm font-semibold py-2 px-4 rounded-lg transition-all hover:opacity-90"
          style={{
            background: "hsl(var(--landing-accent))",
            color: "#fff",
          }}
        >
          View Portfolio
        </Link>
      </div>
    </div>
  );
};

const Explore = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("id, slug, display_name, tagline, location, profile_type, profile_photo_url")
        .eq("is_published", true)
        .order("display_name");
      setProfiles((data as Profile[]) || []);
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  const filtered = profiles.filter((p) => {
    const matchesType = activeFilter === "All" || p.profile_type === activeFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      (p.display_name?.toLowerCase().includes(q) ?? false) ||
      (p.tagline?.toLowerCase().includes(q) ?? false) ||
      (p.location?.toLowerCase().includes(q) ?? false);
    return matchesType && matchesSearch;
  });

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "hsl(var(--landing-bg))",
        color: "hsl(var(--landing-fg))",
      }}
    >
      <SEOHead
        title="Explore Portfolios — CreativeSlate"
        description="Discover portfolios from actors, screenwriters, directors and creative professionals."
      />
      <MarketingNav />

      <main className="flex-1">
        {/* Hero header */}
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: "hsl(var(--landing-fg))" }}
          >
            Discover Creative Portfolios
          </h1>
          <p
            className="text-lg mb-10"
            style={{ color: "hsl(var(--landing-fg) / 0.65)" }}
          >
            Browse actors, screenwriters, directors, and more.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto mb-8">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: "hsl(var(--landing-fg) / 0.4)" }}
            />
            <input
              type="text"
              placeholder="Search by name, tagline, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "hsl(var(--landing-card))",
                border: "1px solid hsl(var(--landing-border))",
                color: "hsl(var(--landing-fg))",
              }}
            />
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip.value}
                onClick={() => setActiveFilter(chip.value)}
                className="text-sm px-4 py-1.5 rounded-full font-medium transition-all"
                style={
                  activeFilter === chip.value
                    ? {
                        background: "hsl(var(--landing-accent))",
                        color: "#fff",
                        border: "1px solid transparent",
                      }
                    : {
                        background: "transparent",
                        color: "hsl(var(--landing-fg) / 0.7)",
                        border: "1px solid hsl(var(--landing-border))",
                      }
                }
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-6xl mx-auto px-6 pb-20">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p
                className="text-xl font-semibold mb-2"
                style={{ color: "hsl(var(--landing-fg))" }}
              >
                No portfolios found
              </p>
              <p style={{ color: "hsl(var(--landing-fg) / 0.5)" }}>
                Try adjusting your search or filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default Explore;
