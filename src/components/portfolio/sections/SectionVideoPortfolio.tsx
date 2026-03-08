import { useState } from "react";
import { Play, X } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { extractYouTubeId, extractVimeoId, isYouTube, isVimeo } from "@/lib/videoEmbed";

interface Props {
  items: any[]; // campaign projects with video_url
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

const SectionVideoPortfolio = ({ items }: Props) => {
  const theme = usePortfolioTheme();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const videos = items.filter(p => p.video_url);

  if (videos.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {videos.map(video => {
        const embedUrl = getEmbedUrl(video.video_url);
        const isPlaying = playingId === video.id;
        const thumb = video.video_thumbnail_url || video.poster_url || video.custom_image_url;

        return (
          <div
            key={video.id}
            className="group overflow-hidden"
            style={{
              backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
              border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
              borderRadius: theme.cardRadius,
              boxShadow: theme.cardShadow,
            }}
          >
            <div className="relative aspect-video overflow-hidden" style={{ backgroundColor: theme.bgElevated }}>
              {isPlaying && embedUrl ? (
                <>
                  <iframe
                    src={`${embedUrl}?autoplay=1`}
                    title={video.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <button
                    onClick={() => setPlayingId(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full z-10"
                    style={{ backgroundColor: `${theme.bgPrimary}dd` }}
                  >
                    <X className="w-3.5 h-3.5" style={{ color: theme.textPrimary }} />
                  </button>
                </>
              ) : (
                <>
                  {thumb ? (
                    <img src={thumb} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-8 h-8" style={{ color: theme.textTertiary }} />
                    </div>
                  )}
                  {embedUrl && (
                    <button
                      onClick={() => setPlayingId(video.id)}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: theme.accentPrimary }}>
                        <Play className="w-6 h-6 ml-0.5" style={{ color: theme.textOnAccent }} />
                      </div>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Info overlay */}
            <div className="p-4 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>
                  {video.title}
                </p>
                {video.year && (
                  <span className="text-xs shrink-0 tabular-nums" style={{ color: theme.textTertiary }}>{video.year}</span>
                )}
              </div>
              {video.client && (
                <p className="text-xs" style={{ color: theme.accentPrimary }}>{video.client}</p>
              )}
              {video.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {video.tags.slice(0, 3).map((t: string) => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: theme.bgElevated, color: theme.textTertiary }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SectionVideoPortfolio;
