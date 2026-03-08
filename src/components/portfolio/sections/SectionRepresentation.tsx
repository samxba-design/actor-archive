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
        className="p-5 space-y-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        style={{
          backgroundColor: "hsl(var(--portfolio-card))",
          border: "1px solid hsl(var(--portfolio-border))",
          borderRadius: "var(--portfolio-radius)",
        }}
      >
        <div className="flex items-center gap-3">
          {rep.logo_url ? (
            <img src={rep.logo_url} alt="" className="w-10 h-10 object-contain rounded" />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "hsl(var(--portfolio-accent) / 0.12)" }}
            >
              <Building2 className="w-5 h-5" style={{ color: "hsl(var(--portfolio-accent))" }} />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>
              {rep.company || rep.name}
            </p>
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5"
              style={{
                backgroundColor: "hsl(var(--portfolio-accent) / 0.12)",
                color: "hsl(var(--portfolio-accent))",
              }}
            >
              {repTypeLabels[rep.rep_type] || rep.rep_type}
              {rep.department ? ` · ${rep.department}` : ""}
            </span>
          </div>
        </div>
        {rep.name && rep.company && (
          <p className="text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{rep.name}</p>
        )}
        {rep.market && (
          <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{rep.market}</p>
        )}
        <div className="flex flex-wrap gap-3 text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
          {rep.email && (
            <a href={`mailto:${rep.email}`} className="flex items-center gap-1.5 hover:underline transition-colors" style={{ color: "hsl(var(--portfolio-accent))" }}>
              <Mail className="w-3.5 h-3.5" /> {rep.email}
            </a>
          )}
          {rep.phone && (
            <a href={`tel:${rep.phone}`} className="flex items-center gap-1.5 hover:underline">
              <Phone className="w-3.5 h-3.5" /> {rep.phone}
            </a>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default SectionRepresentation;
