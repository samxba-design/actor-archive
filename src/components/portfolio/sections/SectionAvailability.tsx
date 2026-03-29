import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { CheckCircle, Clock, Globe, MapPin } from "lucide-react";

interface ActorStats {
  casting_availability?: string | null;
  self_tape_turnaround?: string | null;
  willing_to_travel?: boolean | null;
  travel_regions?: string[] | null;
  based_in_primary?: string | null;
  availability_note?: string | null;
}

interface Props {
  stats: ActorStats;
}

const AVAILABILITY_COLORS: Record<string, string> = {
  available:           "#22c55e",
  "available now":     "#22c55e",
  "in production":     "#f59e0b",
  busy:                "#ef4444",
  limited:             "#f59e0b",
  selective:           "#6B9FD4",
};

const SectionAvailability = ({ stats }: Props) => {
  const theme = usePortfolioTheme();

  const items = [
    stats.casting_availability && {
      icon: CheckCircle,
      label: "Status",
      value: stats.casting_availability,
      color: AVAILABILITY_COLORS[stats.casting_availability.toLowerCase()] || theme.statusAvailable,
      isStatus: true,
    },
    stats.based_in_primary && {
      icon: MapPin,
      label: "Based In",
      value: stats.based_in_primary,
      color: theme.accentPrimary,
      isStatus: false,
    },
    stats.self_tape_turnaround && {
      icon: Clock,
      label: "Self-Tape",
      value: stats.self_tape_turnaround,
      color: theme.accentPrimary,
      isStatus: false,
    },
    stats.willing_to_travel && {
      icon: Globe,
      label: "Travel",
      value: stats.travel_regions?.length
        ? stats.travel_regions.join(", ")
        : "Open to travel",
      color: theme.accentPrimary,
      isStatus: false,
    },
  ].filter(Boolean) as {
    icon: any;
    label: string;
    value: string;
    color: string;
    isStatus: boolean;
  }[];

  if (items.length === 0 && !stats.availability_note) return null;

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{
                backgroundColor: `${item.color}12`,
                border: `1px solid ${item.color}30`,
              }}
            >
              {item.isStatus ? (
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 6px ${item.color}60`,
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
              ) : (
                <item.icon
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: item.color }}
                />
              )}
              <div>
                <p className="text-[9px] uppercase tracking-widest leading-none" style={{ color: item.color, opacity: 0.75 }}>
                  {item.label}
                </p>
                <p
                  className="text-[13px] font-semibold leading-tight mt-0.5"
                  style={{ color: theme.textPrimary, fontFamily: theme.fontBody }}
                >
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {stats.availability_note && (
        <p
          className="text-[13px] leading-relaxed"
          style={{ color: theme.textSecondary, fontFamily: theme.fontBody }}
        >
          {stats.availability_note}
        </p>
      )}
    </div>
  );
};

export default SectionAvailability;
