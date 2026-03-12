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

const SectionAvailability = ({ stats }: Props) => {
  const theme = usePortfolioTheme();

  const items = [
    stats.casting_availability && {
      icon: CheckCircle,
      label: "Status",
      value: stats.casting_availability,
    },
    stats.self_tape_turnaround && {
      icon: Clock,
      label: "Self-Tape Turnaround",
      value: stats.self_tape_turnaround,
    },
    stats.based_in_primary && {
      icon: MapPin,
      label: "Based In",
      value: stats.based_in_primary,
    },
    stats.willing_to_travel && {
      icon: Globe,
      label: "Travel",
      value: stats.travel_regions?.length
        ? `Willing to travel: ${stats.travel_regions.join(", ")}`
        : "Willing to travel",
    },
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

  if (items.length === 0 && !stats.availability_note) return null;

  return (
    <div className="space-y-4">
      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg border"
              style={{ borderColor: `${theme.accent}22`, fontFamily: theme.fontBody }}
            >
              <item.icon className="h-4 w-4 shrink-0" style={{ color: theme.accent }} />
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: theme.textMuted }}>
                  {item.label}
                </p>
                <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {stats.availability_note && (
        <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary, fontFamily: theme.fontBody }}>
          {stats.availability_note}
        </p>
      )}
    </div>
  );
};

export default SectionAvailability;
