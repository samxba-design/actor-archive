import { Building2, Mail, Phone } from "lucide-react";

interface Props {
  items: any[];
}

const repTypeLabels: Record<string, string> = {
  agent: "Agent",
  manager: "Manager",
  lawyer: "Entertainment Lawyer",
  publicist: "Publicist",
  other: "Representative",
};

const SectionRepresentation = ({ items }: Props) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {items.map((rep) => (
      <div
        key={rep.id}
        className="p-5 space-y-2"
        style={{
          backgroundColor: "hsl(var(--portfolio-card))",
          border: "1px solid hsl(var(--portfolio-border))",
          borderRadius: "var(--portfolio-radius)",
        }}
      >
        <div className="flex items-center gap-2">
          {rep.logo_url ? (
            <img src={rep.logo_url} alt="" className="w-8 h-8 object-contain rounded" />
          ) : (
            <Building2 className="w-5 h-5" style={{ color: "hsl(var(--portfolio-accent))" }} />
          )}
          <div>
            <p className="font-semibold text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>
              {rep.company || rep.name}
            </p>
            <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
              {repTypeLabels[rep.rep_type] || rep.rep_type}
              {rep.department ? ` · ${rep.department}` : ""}
              {rep.market ? ` · ${rep.market}` : ""}
            </p>
          </div>
        </div>
        {rep.name && rep.company && (
          <p className="text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{rep.name}</p>
        )}
        <div className="flex flex-wrap gap-3 text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
          {rep.email && (
            <a href={`mailto:${rep.email}`} className="flex items-center gap-1 hover:underline">
              <Mail className="w-3 h-3" /> {rep.email}
            </a>
          )}
          {rep.phone && (
            <a href={`tel:${rep.phone}`} className="flex items-center gap-1 hover:underline">
              <Phone className="w-3 h-3" /> {rep.phone}
            </a>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default SectionRepresentation;
