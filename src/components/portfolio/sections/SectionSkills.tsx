interface Props {
  items: any[];
}

const SectionSkills = ({ items }: Props) => {
  // Group by category
  const grouped = items.reduce<Record<string, any[]>>((acc, s) => {
    const cat = s.category || "General";
    (acc[cat] = acc[cat] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([cat, skills]) => (
        <div key={cat}>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
            {cat}
          </h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((s: any) => (
              <span
                key={s.id}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: "hsl(var(--portfolio-accent) / 0.12)",
                  color: "hsl(var(--portfolio-accent))",
                }}
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionSkills;
