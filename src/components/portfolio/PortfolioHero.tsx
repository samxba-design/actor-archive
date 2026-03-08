import { MapPin, Briefcase, Star } from "lucide-react";

interface Props {
  profile: {
    display_name: string | null;
    first_name: string | null;
    last_name: string | null;
    tagline: string | null;
    bio: string | null;
    location: string | null;
    profile_photo_url: string | null;
    banner_url: string | null;
    profile_type: string | null;
    available_for_hire: boolean | null;
    seeking_representation: boolean | null;
  };
}

const typeLabels: Record<string, string> = {
  screenwriter: "Screenwriter",
  tv_writer: "TV Writer",
  playwright: "Playwright",
  author: "Author",
  journalist: "Journalist",
  copywriter: "Copywriter",
  actor: "Actor",
  director_producer: "Director / Producer",
  corporate_video: "Corporate Video",
  multi_hyphenate: "Multi-Hyphenate",
};

const PortfolioHero = ({ profile }: Props) => {
  const name = profile.display_name || [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Untitled";

  return (
    <header className="relative">
      {/* Banner */}
      {profile.banner_url ? (
        <div className="h-56 sm:h-72 md:h-80 w-full overflow-hidden">
          <img
            src={profile.banner_url}
            alt=""
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 h-56 sm:h-72 md:h-80"
            style={{ background: "linear-gradient(to bottom, transparent 40%, hsl(var(--portfolio-bg)) 100%)" }}
          />
        </div>
      ) : (
        <div
          className="h-32 sm:h-40 w-full"
          style={{ backgroundColor: "hsl(var(--portfolio-muted))" }}
        />
      )}

      {/* Profile content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          {profile.profile_photo_url ? (
            <img
              src={profile.profile_photo_url}
              alt={name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 shadow-lg"
              style={{
                borderColor: "hsl(var(--portfolio-bg))",
              }}
            />
          ) : (
            <div
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg border-4"
              style={{
                backgroundColor: "hsl(var(--portfolio-accent))",
                color: "hsl(var(--portfolio-accent-fg))",
                borderColor: "hsl(var(--portfolio-bg))",
              }}
            >
              {name.charAt(0)}
            </div>
          )}

          {/* Info */}
          <div className="flex-1 pt-2 sm:pt-6 space-y-2">
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ fontFamily: "var(--portfolio-heading-font)" }}
            >
              {name}
            </h1>

            {profile.tagline && (
              <p
                className="text-lg"
                style={{ color: "hsl(var(--portfolio-muted-fg))" }}
              >
                {profile.tagline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
              {profile.profile_type && (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  {typeLabels[profile.profile_type] || profile.profile_type}
                </span>
              )}
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.location}
                </span>
              )}
              {profile.available_for_hire && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: "hsl(var(--portfolio-accent) / 0.15)",
                    color: "hsl(var(--portfolio-accent))",
                  }}
                >
                  <Star className="w-3 h-3" /> Available
                </span>
              )}
            </div>

            {profile.bio && (
              <p className="mt-4 max-w-2xl leading-relaxed whitespace-pre-line" style={{ color: "hsl(var(--portfolio-fg) / 0.85)" }}>
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PortfolioHero;
