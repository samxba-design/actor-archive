import { extractYouTubeId, extractVimeoId, isYouTube, isVimeo } from "@/lib/videoEmbed";
import { useState } from "react";
import { Play } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Chapter {
  time: string;
  label: string;
}

interface Props {
  items: any[];
  variant?: 'grid' | 'featured' | 'list';
}

const getEmbedUrl = (videoUrl: string) => {
  if (isYouTube(videoUrl)) {
    const id = extractYouTubeId(videoUrl);
    if (id) return `https://www.youtube.com/embed/${id}`;
  } else if (isVimeo(videoUrl)) {
    const id = extractVimeoId(videoUrl);
    if (id) return `https://player.vimeo.com/video/${id}`;
  }
  return "";
};

const SectionDemoReels = ({ items, variant = 'grid' }: Props) => {
  const reels = items.filter((p) => p.video_url);
  const theme = usePortfolioTheme();
  if (reels.length === 0) return null;

  if (variant === 'featured') return <FeaturedReels reels={reels} theme={theme} />;
  if (variant === 'list') return <ListReels reels={reels} theme={theme} />;

  // Default: grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reels.map((reel) => (
        <ReelCard key={reel.id} reel={reel} theme={theme} />
      ))}
    </div>
  );
};

const FeaturedReels = ({ reels, theme }: { reels: any[]; theme: any }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = reels[activeIdx];
  const embedUrl = getEmbedUrl(active.video_url);

  return (
    <div className="space-y-3">
      <div
        className="relative overflow-hidden"
        style={{ borderRadius: theme.cardRadius, border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`, aspectRatio: "16/9" }}
      >
        {embedUrl ? (
          <iframe src={embedUrl} title={active.title} className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <a href={active.video_url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: theme.bgElevated }}>
            <span style={{ color: theme.accentPrimary }}>▶ Watch</span>
          </a>
        )}
      </div>
      <div>
        <p className="font-semibold text-sm" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{active.title}</p>
        {active.description && <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>{active.description}</p>}
      </div>
      {reels.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {reels.map((reel, i) => (
            <button
              key={reel.id}
              onClick={() => setActiveIdx(i)}
              className="flex-shrink-0 text-left p-2 rounded transition-all"
              style={{
                backgroundColor: i === activeIdx ? theme.accentSubtle : 'transparent',
                border: `1px solid ${i === activeIdx ? theme.accentPrimary : theme.borderDefault}`,
                borderRadius: theme.cardRadius,
                minWidth: '140px',
              }}
            >
              <p className="text-xs font-medium truncate" style={{ color: i === activeIdx ? theme.accentPrimary : theme.textSecondary }}>{reel.title}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ListReels = ({ reels, theme }: { reels: any[]; theme: any }) => (
  <div className="space-y-2">
    {reels.map((reel) => (
      <a
        key={reel.id}
        href={reel.video_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 group transition-all"
        style={{
          backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
          border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
          borderRadius: theme.cardRadius,
        }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: theme.accentSubtle }}>
          <Play className="w-4 h-4" style={{ color: theme.accentPrimary }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate group-hover:underline" style={{ color: theme.textPrimary }}>{reel.title}</p>
          {reel.description && <p className="text-xs truncate" style={{ color: theme.textTertiary }}>{reel.description}</p>}
        </div>
      </a>
    ))}
  </div>
);

export default SectionDemoReels;
