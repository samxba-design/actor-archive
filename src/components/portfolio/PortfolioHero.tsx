import { useState } from "react";
import { MapPin, Briefcase, Star, Calendar, Mail, ArrowRight } from "lucide-react";
import BookingModal from "./BookingModal";

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
    cta_label: string | null;
    cta_url: string | null;
    cta_type: string | null;
    booking_url: string | null;
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
  const [bookingOpen, setBookingOpen] = useState(false);

  const handleCta = () => {
    const type = profile.cta_type || "contact_form";
    if (type === "contact_form") {
      document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
    } else if (type === "calendar" && (profile.booking_url || profile.cta_url)) {
      const url = profile.booking_url || profile.cta_url!;
      if (url.includes("calendly.com") || url.includes("cal.com")) {
        setBookingOpen(true);
      } else {
        window.open(url, "_blank");
      }
    } else if (type === "email" && profile.cta_url) {
      window.location.href = profile.cta_url.startsWith("mailto:") ? profile.cta_url : `mailto:${profile.cta_url}`;
    } else if (type === "custom_url" && profile.cta_url) {
      window.open(profile.cta_url, "_blank");
    }
  };

  const ctaLabel = profile.cta_label || (profile.available_for_hire ? "Hire Me" : "Get in Touch");
  const showCta = profile.available_for_hire || profile.cta_label;

  const ctaIcon = () => {
    const type = profile.cta_type || "contact_form";
    if (type === "calendar") return <Calendar className="w-4 h-4" />;
    if (type === "email") return <Mail className="w-4 h-4" />;
    return <ArrowRight className="w-4 h-4" />;
  };

  return (
    <header className="relative">
      {/* Banner */}
      {profile.banner_url ? (
        <div className="h-56 sm:h-72 md:h-80 w-full overflow-hidden">
          <img src={profile.banner_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 h-56 sm:h-72 md:h-80" style={{ background: "linear-gradient(to bottom, transparent 40%, hsl(var(--portfolio-bg)) 100%)" }} />
        </div>
      ) : (
        <div className="h-32 sm:h-40 w-full" style={{ backgroundColor: "hsl(var(--portfolio-muted))" }} />
      )}

      {/* Profile content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          {profile.profile_photo_url ? (
            <img src={profile.profile_photo_url} alt={name} className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 shadow-lg" style={{ borderColor: "hsl(var(--portfolio-bg))" }} />
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg border-4" style={{ backgroundColor: "hsl(var(--portfolio-accent))", color: "hsl(var(--portfolio-accent-fg))", borderColor: "hsl(var(--portfolio-bg))" }}>
              {name.charAt(0)}
            </div>
          )}

          {/* Info */}
          <div className="flex-1 pt-2 sm:pt-6 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--portfolio-heading-font)" }}>
                {name}
              </h1>
              {showCta && (
                <button
                  onClick={handleCta}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 shadow-md shrink-0"
                  style={{
                    backgroundColor: "hsl(var(--portfolio-accent))",
                    color: "hsl(var(--portfolio-accent-fg))",
                  }}
                >
                  {ctaIcon()}
                  {ctaLabel}
                </button>
              )}
            </div>

            {profile.tagline && (
              <p className="text-lg" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
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
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: "hsl(var(--portfolio-accent) / 0.15)", color: "hsl(var(--portfolio-accent))" }}>
                  <Star className="w-3 h-3" /> Available
                </span>
              )}
              {profile.seeking_representation && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: "hsl(var(--portfolio-accent) / 0.10)", color: "hsl(var(--portfolio-accent))" }}>
                  Seeking Representation
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

      {/* Booking Modal */}
      {(profile.booking_url || profile.cta_url) && (
        <BookingModal
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          bookingUrl={profile.booking_url || profile.cta_url || ""}
          name={name}
        />
      )}
    </header>
  );
};

export default PortfolioHero;
