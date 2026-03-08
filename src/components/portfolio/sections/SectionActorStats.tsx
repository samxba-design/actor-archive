interface Props {
  stats: any;
}

const SectionActorStats = ({ stats }: Props) => {
  if (!stats) return null;

  const entries: { label: string; value: string }[] = [];

  if (stats.height_display) entries.push({ label: "Height", value: stats.height_display });
  if (stats.age_range_min && stats.age_range_max) entries.push({ label: "Age Range", value: `${stats.age_range_min}–${stats.age_range_max}` });
  if (stats.gender_identity) entries.push({ label: "Gender", value: stats.gender_identity });
  if (stats.hair_color) entries.push({ label: "Hair", value: stats.hair_color });
  if (stats.eye_color) entries.push({ label: "Eyes", value: stats.eye_color });
  if (stats.body_type) entries.push({ label: "Build", value: stats.body_type });
  if (stats.ethnicity?.length) entries.push({ label: "Ethnicity", value: stats.ethnicity.join(", ") });
  if (stats.union_status?.length) entries.push({ label: "Unions", value: stats.union_status.join(", ") });
  if (stats.accents?.length) entries.push({ label: "Accents", value: stats.accents.join(", ") });
  if (stats.vocal_range) entries.push({ label: "Vocal Range", value: stats.vocal_range });
  if (stats.based_in_primary) entries.push({ label: "Based In", value: stats.based_in_primary });

  if (entries.length === 0) return null;

  return (
    <div
      className="flex flex-wrap gap-x-6 gap-y-2 px-4 py-3"
      style={{
        backgroundColor: "hsl(var(--portfolio-card))",
        border: "1px solid hsl(var(--portfolio-border))",
        borderRadius: "var(--portfolio-radius)",
      }}
    >
      {entries.map((e) => (
        <div key={e.label} className="text-sm">
          <span style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{e.label}: </span>
          <span className="font-medium" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{e.value}</span>
        </div>
      ))}
    </div>
  );
};

export default SectionActorStats;
