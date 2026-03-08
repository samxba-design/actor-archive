import { GraduationCap } from "lucide-react";

interface Props {
  items: any[];
}

const SectionEducation = ({ items }: Props) => (
  <div className="space-y-3">
    {items.map((e) => (
      <div
        key={e.id}
        className="flex items-start gap-3 p-4"
        style={{
          backgroundColor: "hsl(var(--portfolio-card))",
          border: "1px solid hsl(var(--portfolio-border))",
          borderRadius: "var(--portfolio-radius)",
        }}
      >
        <GraduationCap className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--portfolio-accent))" }} />
        <div>
          <p className="font-semibold text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{e.institution}</p>
          {e.degree_or_certificate && (
            <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{e.degree_or_certificate}</p>
          )}
          {e.teacher_name && (
            <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>with {e.teacher_name}</p>
          )}
          <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
            {e.year_start}{e.year_end ? `–${e.year_end}` : e.is_ongoing ? "–Present" : ""}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default SectionEducation;
