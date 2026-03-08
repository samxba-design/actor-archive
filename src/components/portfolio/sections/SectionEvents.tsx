import { Calendar, MapPin, Ticket } from "lucide-react";

interface Props {
  items: any[];
}

const SectionEvents = ({ items }: Props) => (
  <div className="space-y-3">
    {items.map((e) => (
      <div
        key={e.id}
        className="flex items-start gap-4 p-4"
        style={{
          backgroundColor: "hsl(var(--portfolio-card))",
          border: "1px solid hsl(var(--portfolio-border))",
          borderRadius: "var(--portfolio-radius)",
        }}
      >
        {e.date && (
          <div className="text-center flex-shrink-0 w-12">
            <p className="text-lg font-bold leading-none" style={{ color: "hsl(var(--portfolio-accent))" }}>
              {new Date(e.date).getDate()}
            </p>
            <p className="text-[10px] uppercase" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
              {new Date(e.date).toLocaleString("en", { month: "short" })}
            </p>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{e.title}</p>
          <div className="flex flex-wrap gap-2 text-xs mt-1" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
            {e.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.venue}</span>}
            {e.city && <span>{e.city}{e.country ? `, ${e.country}` : ""}</span>}
          </div>
          {e.description && (
            <p className="text-xs mt-1" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{e.description}</p>
          )}
        </div>
        {e.ticket_url && (
          <a
            href={e.ticket_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs px-3 py-1.5 flex-shrink-0"
            style={{
              backgroundColor: "hsl(var(--portfolio-accent))",
              color: "hsl(var(--portfolio-accent-fg))",
              borderRadius: "var(--portfolio-radius)",
            }}
          >
            <Ticket className="w-3 h-3" /> Tickets
          </a>
        )}
      </div>
    ))}
  </div>
);

export default SectionEvents;
