import { extractYouTubeId, extractVimeoId, isYouTube, isVimeo } from "@/lib/videoEmbed";

interface Props {
  items: any[];
}

const SectionDemoReels = ({ items }: Props) => {
  const reels = items.filter((p) => p.video_url);
  if (reels.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reels.map((reel) => {
        let embedUrl = "";
        if (isYouTube(reel.video_url)) {
          const id = extractYouTubeId(reel.video_url);
          if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
        } else if (isVimeo(reel.video_url)) {
          const id = extractVimeoId(reel.video_url);
          if (id) embedUrl = `https://player.vimeo.com/video/${id}`;
        }

        return (
          <div key={reel.id} className="space-y-2">
            <div
              className="relative overflow-hidden"
              style={{ 
                borderRadius: "var(--portfolio-radius)",
                border: "1px solid hsl(var(--portfolio-border))",
                aspectRatio: "16/9",
              }}
            >
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={reel.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <a href={reel.video_url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "hsl(var(--portfolio-muted))" }}>
                  <span style={{ color: "hsl(var(--portfolio-accent))" }}>▶ Watch</span>
                </a>
              )}
            </div>
            <p className="text-sm font-medium" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{reel.title}</p>
            {reel.description && (
              <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{reel.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SectionDemoReels;
