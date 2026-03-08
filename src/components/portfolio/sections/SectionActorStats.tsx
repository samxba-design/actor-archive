interface Props {
  stats: any;
  profilePhoto?: string | null;
  displayName?: string | null;
  representation?: any[];
}

const SectionActorStats = ({ stats, profilePhoto, displayName, representation }: Props) => {
  if (!stats) return null;

  const physicalStats: { label: string; value: string }[] = [];
  const performanceStats: { label: string; value: string }[] = [];

  // Physical
  if (stats.height_display) physicalStats.push({ label: "Height", value: stats.height_display });
  if (stats.weight_range) physicalStats.push({ label: "Weight", value: stats.weight_range });
  if (stats.age_range_min && stats.age_range_max) physicalStats.push({ label: "Playing Age", value: `${stats.age_range_min}–${stats.age_range_max}` });
  if (stats.gender_identity) physicalStats.push({ label: "Gender", value: stats.gender_identity });
  if (stats.hair_color) physicalStats.push({ label: "Hair", value: stats.hair_color });
  if (stats.eye_color) physicalStats.push({ label: "Eyes", value: stats.eye_color });
  if (stats.body_type) physicalStats.push({ label: "Build", value: stats.body_type });
  if (stats.ethnicity?.length) physicalStats.push({ label: "Ethnicity", value: stats.ethnicity.join(", ") });

  // Performance
  if (stats.union_status?.length) performanceStats.push({ label: "Unions", value: stats.union_status.join(" / ") });
  if (stats.accents?.length) performanceStats.push({ label: "Accents", value: stats.accents.join(", ") });
  if (stats.vocal_range) performanceStats.push({ label: "Vocal Range", value: stats.vocal_range });
  if (stats.dance_styles?.length) performanceStats.push({ label: "Dance", value: stats.dance_styles.join(", ") });
  if (stats.special_skills?.length) performanceStats.push({ label: "Skills", value: stats.special_skills.join(", ") });
  if (stats.languages) {
    const langs = Array.isArray(stats.languages)
      ? stats.languages.map((l: any) => typeof l === "string" ? l : l.language || l.name).join(", ")
      : typeof stats.languages === "object" ? Object.keys(stats.languages).join(", ") : "";
    if (langs) performanceStats.push({ label: "Languages", value: langs });
  }
  if (stats.based_in_primary) performanceStats.push({ label: "Based In", value: stats.based_in_primary });
  if (stats.passport_countries?.length) performanceStats.push({ label: "Passports", value: stats.passport_countries.join(", ") });
  if (stats.willing_to_travel) performanceStats.push({ label: "Travel", value: "Willing to travel" });

  const allStats = [...physicalStats, ...performanceStats];
  if (allStats.length === 0) return null;

  const hasCompCardData = physicalStats.length >= 3;

  // If enough data, render as a formatted comp card
  if (hasCompCardData) {
    return (
      <div
        className="overflow-hidden"
        style={{
          backgroundColor: "hsl(var(--portfolio-card))",
          border: "1px solid hsl(var(--portfolio-border))",
          borderRadius: "var(--portfolio-radius)",
        }}
      >
        <div className="p-5 space-y-4">
          {/* Physical stats grid */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
              Physical
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {physicalStats.map((e) => (
                <div key={e.label}>
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{e.label}</p>
                  <p className="text-sm font-semibold" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{e.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance stats */}
          {performanceStats.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
                Performance
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {performanceStats.map((e) => (
                  <div key={e.label}>
                    <p className="text-[10px] uppercase tracking-widest" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{e.label}</p>
                    <p className="text-sm font-medium" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{e.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {(stats.casting_availability || stats.self_tape_turnaround || stats.availability_note) && (
            <div className="pt-2 border-t" style={{ borderColor: "hsl(var(--portfolio-border))" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
                Availability
              </p>
              <div className="flex flex-wrap gap-2">
                {stats.casting_availability && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
                    backgroundColor: "hsl(var(--portfolio-accent) / 0.12)", color: "hsl(var(--portfolio-accent))",
                  }}>
                    {stats.casting_availability}
                  </span>
                )}
                {stats.self_tape_turnaround && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
                    backgroundColor: "hsl(var(--portfolio-muted))", color: "hsl(var(--portfolio-muted-fg))",
                  }}>
                    Self-tape: {stats.self_tape_turnaround}
                  </span>
                )}
              </div>
              {stats.availability_note && (
                <p className="text-xs mt-2" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{stats.availability_note}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Simple inline layout for minimal data
  return (
    <div
      className="flex flex-wrap gap-x-6 gap-y-2 px-4 py-3"
      style={{
        backgroundColor: "hsl(var(--portfolio-card))",
        border: "1px solid hsl(var(--portfolio-border))",
        borderRadius: "var(--portfolio-radius)",
      }}
    >
      {allStats.map((e) => (
        <div key={e.label} className="text-sm">
          <span style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{e.label}: </span>
          <span className="font-medium" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{e.value}</span>
        </div>
      ))}
    </div>
  );
};

export default SectionActorStats;
