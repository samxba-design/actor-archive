import { Calendar, MapPin, Ticket } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
  variant?: 'list' | 'calendar' | 'cards';
}

const SectionEvents = ({ items, variant = 'list' }: Props) => {
  const theme = usePortfolioTheme();

  if (variant === 'calendar') {
    return (
      <div className="space-y-1">
        {items.map((e) => (
          <div
            key={e.id}
            className="flex items-center gap-3 px-3 py-2 transition-all group"
            style={{ borderLeft: `2px solid ${e.is_upcoming ? theme.accentPrimary : theme.borderDefault}` }}
            onMouseEnter={ev => (ev.currentTarget.style.backgroundColor = `${theme.bgElevated}80`)}
            onMouseLeave={ev => (ev.currentTarget.style.backgroundColor = 'transparent')}
          >
            {e.date && (
              <span className="text-xs font-mono tabular-nums shrink-0 w-20" style={{ color: theme.textTertiary }}>
                {new Date(e.date).toLocaleDateString("en", { month: "short", day: "numeric" })}
              </span>
            )}
            <span className="text-sm font-medium truncate" style={{ color: theme.textPrimary }}>{e.title}</span>
            {e.venue && <span className="text-xs hidden sm:inline shrink-0" style={{ color: theme.textTertiary }}>{e.venue}</span>}
            {e.ticket_url && (
              <a href={e.ticket_url} target="_blank" rel="noopener noreferrer" className="text-xs shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: theme.accentPrimary }}>
                Tickets →
              </a>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((e) => (
          <div
            key={e.id}
            className="p-4 space-y-2 transition-all"
            style={{
              backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
              backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
              border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
              borderRadius: theme.cardRadius,
            }}
          >
            {e.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" style={{ color: theme.accentPrimary }} />
                <span className="text-xs font-medium" style={{ color: theme.accentPrimary }}>
                  {new Date(e.date).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}
                </span>
                {e.is_upcoming && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ backgroundColor: theme.accentSubtle, color: theme.accentPrimary }}>Upcoming</span>
                )}
              </div>
            )}
            <p className="font-semibold text-sm" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{e.title}</p>
            <div className="flex flex-wrap gap-2 text-xs" style={{ color: theme.textTertiary }}>
              {e.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.venue}</span>}
              {e.city && <span>{e.city}{e.country ? `, ${e.country}` : ""}</span>}
            </div>
            {e.description && <p className="text-xs" style={{ color: theme.textSecondary }}>{e.description}</p>}
            {e.ticket_url && (
              <a href={e.ticket_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: theme.accentPrimary }}>
                <Ticket className="w-3 h-3" /> Get Tickets
              </a>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Default: list
  return (
    <div className="space-y-3">
      {items.map((e) => (
        <div
          key={e.id}
          className="flex items-start gap-4 p-4"
          style={{
            backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
            border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
            borderRadius: theme.cardRadius,
          }}
        >
          {e.date && (
            <div className="text-center flex-shrink-0 w-12">
              <p className="text-lg font-bold leading-none" style={{ color: theme.accentPrimary }}>
                {new Date(e.date).getDate()}
              </p>
              <p className="text-[10px] uppercase" style={{ color: theme.textTertiary }}>
                {new Date(e.date).toLocaleString("en", { month: "short" })}
              </p>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm" style={{ color: theme.textPrimary }}>{e.title}</p>
            <div className="flex flex-wrap gap-2 text-xs mt-1" style={{ color: theme.textTertiary }}>
              {e.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.venue}</span>}
              {e.city && <span>{e.city}{e.country ? `, ${e.country}` : ""}</span>}
            </div>
            {e.description && <p className="text-xs mt-1" style={{ color: theme.textTertiary }}>{e.description}</p>}
          </div>
          {e.ticket_url && (
            <a href={e.ticket_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs px-3 py-1.5 flex-shrink-0" style={{ backgroundColor: theme.accentPrimary, color: theme.textOnAccent, borderRadius: theme.cardRadius }}>
              <Ticket className="w-3 h-3" /> Tickets
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default SectionEvents;
