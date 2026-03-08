import { extractYouTubeId, extractVimeoId, isYouTube, isVimeo } from "@/lib/videoEmbed";
import { useState } from "react";

interface Chapter {
  time: string;
  label: string;
}

interface Props {
  items: any[];
}

const SectionDemoReels = ({ items }: Props) => {
  const reels = items.filter((p) => p.video_url);
  if (reels.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reels.map((reel) => (
        <ReelCard key={reel.id} reel={reel} />
      ))}
    </div>
  );
};

const ReelCard = ({ reel }: { reel: any }) => {
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const chapters: Chapter[] = Array.isArray(reel.chapters) ? reel.chapters : [];

  let embedUrl = "";
  if (isYouTube(reel.video_url)) {
    const id = extractYouTubeId(reel.video_url);
    if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
  } else if (isVimeo(reel.video_url)) {
    const id = extractVimeoId(reel.video_url);
    if (id) embedUrl = `https://player.vimeo.com/video/${id}`;
  }

  // Build embed URL with timestamp for YouTube chapters
  const getChapterUrl = (time: string) => {
    if (!embedUrl) return "";
    const parts = time.split(":").map(Number);
    const seconds = parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + (parts[1] || 0);
    if (embedUrl.includes("youtube")) {
      return `${embedUrl}?start=${seconds}&autoplay=1`;
    }
    if (embedUrl.includes("vimeo")) {
      return `${embedUrl}#t=${seconds}s`;
    }
    return embedUrl;
  };

  const currentEmbedUrl = activeChapter ? getChapterUrl(activeChapter) : embedUrl;

  return (
    <div className="space-y-2">
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: "var(--portfolio-radius)",
          border: "1px solid hsl(var(--portfolio-border))",
          aspectRatio: "16/9",
        }}
      >
        {currentEmbedUrl ? (
          <iframe
            src={currentEmbedUrl}
            title={reel.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <a
            href={reel.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "hsl(var(--portfolio-muted))" }}
          >
            <span style={{ color: "hsl(var(--portfolio-accent))" }}>▶ Watch</span>
          </a>
        )}
      </div>

      <p className="text-sm font-medium" style={{ color: "hsl(var(--portfolio-card-fg))" }}>
        {reel.title}
      </p>

      {reel.description && (
        <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
          {reel.description}
        </p>
      )}

      {/* Chapter markers */}
      {chapters.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {chapters.map((ch, i) => (
            <button
              key={i}
              onClick={() => setActiveChapter(ch.time)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all hover:scale-105"
              style={{
                backgroundColor: activeChapter === ch.time
                  ? "hsl(var(--portfolio-accent) / 0.15)"
                  : "hsl(var(--portfolio-muted))",
                color: activeChapter === ch.time
                  ? "hsl(var(--portfolio-accent))"
                  : "hsl(var(--portfolio-muted-fg))",
                border: `1px solid ${activeChapter === ch.time ? "hsl(var(--portfolio-accent) / 0.3)" : "hsl(var(--portfolio-border))"}`,
              }}
            >
              <span className="font-mono text-[10px] opacity-70">{ch.time}</span>
              {ch.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionDemoReels;
