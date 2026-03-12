import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { ExternalLink } from "lucide-react";

const platformIcons: Record<string, string> = {
  imdb: "🎬", instagram: "📸", twitter: "𝕏", x: "𝕏",
  linkedin: "in", youtube: "▶", vimeo: "▷", tiktok: "♪",
  website: "🌐", spotlight: "★", threads: "🧵", bluesky: "🦋",
  substack: "📝", medium: "📰", behance: "🎨", dribbble: "🏀",
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
    <div className="flex flex-wrap gap-3">
      {items.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all hover:scale-105"
          style={{
            borderColor: `${theme.accent}33`,
            color: theme.textPrimary,
            fontFamily: theme.fontBody,
          }}
        >
          <span className="text-lg">{platformIcons[link.platform.toLowerCase()] || "🔗"}</span>
          <span className="text-sm font-medium">
            {link.label || link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
          </span>
          <ExternalLink className="h-3 w-3 opacity-50" />
        </a>
      ))}
    </div>
  );
};

export default SectionSocialLinks;
