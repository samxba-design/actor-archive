import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { ArrowUpRight } from "lucide-react";

// Map platform → background color for subtle tints
const PLATFORM_CONFIG: Record<string, { emoji: string; bg: string; fg: string }> = {
  imdb:      { emoji: "🎬", bg: "rgba(245,197,24,0.15)",  fg: "#F5C518" },
  instagram: { emoji: "📸", bg: "rgba(225,48,108,0.12)",  fg: "#E1306C" },
  twitter:   { emoji: "𝕏",  bg: "rgba(29,161,242,0.12)",  fg: "#1DA1F2" },
  x:         { emoji: "𝕏",  bg: "rgba(29,161,242,0.12)",  fg: "#1DA1F2" },
  linkedin:  { emoji: "in", bg: "rgba(10,102,194,0.12)",  fg: "#0A66C2" },
  youtube:   { emoji: "▶",  bg: "rgba(255,0,0,0.12)",     fg: "#FF0000" },
  vimeo:     { emoji: "▷",  bg: "rgba(26,183,234,0.12)",  fg: "#1AB7EA" },
  tiktok:    { emoji: "♪",  bg: "rgba(105,201,208,0.12)", fg: "#69C9D0" },
  website:   { emoji: "🌐", bg: "rgba(100,100,100,0.12)", fg: "#888"    },
  spotlight: { emoji: "★",  bg: "rgba(201,169,110,0.15)", fg: "#C9A96E" },
  threads:   { emoji: "🧵", bg: "rgba(0,0,0,0.1)",        fg: "#666"    },
  bluesky:   { emoji: "🦋", bg: "rgba(0,133,255,0.12)",   fg: "#0085FF" },
  substack:  { emoji: "📝", bg: "rgba(255,103,52,0.12)",  fg: "#FF6734" },
  medium:    { emoji: "📰", bg: "rgba(0,0,0,0.08)",       fg: "#444"    },
  behance:   { emoji: "🎨", bg: "rgba(5,114,206,0.12)",   fg: "#0572CE" },
  dribbble:  { emoji: "🏀", bg: "rgba(234,76,137,0.12)",  fg: "#EA4C89" },
};

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label?: string | null;
}

interface Props {
  items: SocialLink[];
}

const SectionSocialLinks = ({ items }: Props) => {
  const theme = usePortfolioTheme();

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((link) => {
        const key = link.platform.toLowerCase();
        const cfg = PLATFORM_CONFIG[key] || { emoji: "🔗", bg: `${theme.accentPrimary}15`, fg: theme.accentPrimary };
        const label = link.label || link.platform.charAt(0).toUpperCase() + link.platform.slice(1);

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: cfg.bg,
              borderColor: `${theme.borderDefault}`,
              color: theme.textPrimary,
            }}
          >
            <span className="text-base leading-none">{cfg.emoji}</span>
            <span className="text-[13px] font-medium" style={{ fontFamily: theme.fontBody }}>
              {label}
            </span>
            <ArrowUpRight
              className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity -ml-0.5"
              style={{ color: cfg.fg }}
            />
          </a>
        );
      })}
    </div>
  );
};

export default SectionSocialLinks;
