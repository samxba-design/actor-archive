import { useState } from "react";
import { Film, Tv, BookOpen, FileText, ExternalLink, Play, X } from "lucide-react";
import { extractYouTubeId, extractVimeoId } from "@/lib/videoEmbed";

interface Props {
  items: any[];
  profileType: string | null;
  profileSlug?: string;
  isCredits?: boolean;
}

const typeIcons: Record<string, any> = {
  film: Film,
  tv_show: Tv,
  screenplay: FileText,
  pilot: Tv,
  novel: BookOpen,
  book: BookOpen,
};

const SectionProjects = ({ items, profileType, profileSlug, isCredits }: Props) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const featured = items.filter((p) => p.is_featured);
  const rest = items.filter((p) => !p.is_featured);
  const sorted = [...featured, ...rest];

  // First featured project gets hero treatment
  const heroProject = featured.length > 0 ? featured[0] : null;
  const remainingProjects = heroProject ? sorted.filter(p => p.id !== heroProject.id) : sorted;
  const heroImage = heroProject ? (heroProject.backdrop_url || heroProject.poster_url || heroProject.custom_image_url) : null;

  return (
    <div className="space-y-6">
      {/* Featured project hero card */}
      {heroProject && heroImage && (
        <div
          className="relative overflow-hidden group cursor-default"
          style={{
            borderRadius: "var(--portfolio-radius)",
            border: "1px solid hsl(var(--portfolio-border))",
          }}
        >
          <div className="aspect-[21/9] sm:aspect-[3/1] overflow-hidden">
            <img
              src={heroImage}
              alt={heroProject.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div
            className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8"
            style={{ background: "linear-gradient(to top, hsl(var(--portfolio-bg) / 0.9) 0%, hsl(var(--portfolio-bg) / 0.4) 50%, transparent 100%)" }}
          >
            {heroProject.genre && heroProject.genre.length > 0 && (
              <div className="flex gap-1.5 mb-2">
                {heroProject.genre.slice(0, 3).map((g: string) => (
                  <span key={g} className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "hsl(var(--portfolio-accent) / 0.2)", color: "hsl(var(--portfolio-accent))" }}>
                    {g}
                  </span>
                ))}
              </div>
            )}
            <h3 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--portfolio-heading-font)", color: "hsl(var(--portfolio-fg))" }}>
              {heroProject.title}
              {heroProject.year && <span className="ml-2 text-sm font-normal" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>({heroProject.year})</span>}
            </h3>
            {heroProject.logline && (
              <p className="text-sm mt-1 max-w-xl" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{heroProject.logline}</p>
            )}
          </div>
        </div>
      )}

      {/* Remaining projects grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {remainingProjects.map((project) => {
          const Icon = typeIcons[project.project_type] || FileText;
          const image = project.poster_url || project.custom_image_url || project.backdrop_url;

          return (
            <div
              key={project.id}
              className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{
                backgroundColor: "hsl(var(--portfolio-card))",
                border: "1px solid hsl(var(--portfolio-border))",
                borderRadius: "var(--portfolio-radius)",
              }}
            >
              {/* Image with hover overlay + video */}
              <div className="relative">
                {playingVideo === project.id ? (
                  <div className="aspect-video">
                    {(() => {
                      const ytId = extractYouTubeId(project.video_url || "");
                      const vimeoId = extractVimeoId(project.video_url || "");
                      const embedUrl = ytId
                        ? `https://www.youtube.com/embed/${ytId}?autoplay=1`
                        : vimeoId
                        ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1`
                        : null;
                      return embedUrl ? (
                        <iframe src={embedUrl} className="w-full h-full" allowFullScreen allow="autoplay" />
                      ) : null;
                    })()}
                    <button
                      onClick={(e) => { e.stopPropagation(); setPlayingVideo(null); }}
                      className="absolute top-2 right-2 p-1 rounded-full"
                      style={{ backgroundColor: "hsl(var(--portfolio-bg) / 0.8)" }}
                    >
                      <X className="w-4 h-4" style={{ color: "hsl(var(--portfolio-fg))" }} />
                    </button>
                  </div>
                ) : image ? (
                  <div className="aspect-[2/3] sm:aspect-video overflow-hidden relative">
                    <img
                      src={image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {project.video_url && (
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPlayingVideo(project.id); }}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "hsl(var(--portfolio-accent))" }}>
                          <Play className="w-5 h-5 ml-0.5" style={{ color: "hsl(var(--portfolio-accent-fg))" }} />
                        </div>
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    className="aspect-video flex items-center justify-center"
                    style={{ backgroundColor: "hsl(var(--portfolio-muted))" }}
                  >
                    <Icon className="w-10 h-10" style={{ color: "hsl(var(--portfolio-muted-fg))" }} />
                  </div>
                )}
                {/* Hover overlay with logline */}
                {project.logline && image && playingVideo !== project.id && (
                  <div
                    className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(transparent 30%, hsl(var(--portfolio-bg) / 0.85))" }}
                  >
                    <p className="text-xs line-clamp-3" style={{ color: "hsl(var(--portfolio-fg))" }}>{project.logline}</p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="font-semibold text-sm leading-tight"
                    style={{ fontFamily: "var(--portfolio-heading-font)", color: "hsl(var(--portfolio-card-fg))" }}
                  >
                    {project.title}
                  </h3>
                  {project.year && (
                    <span className="text-xs flex-shrink-0" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
                      {project.year}
                    </span>
                  )}
                </div>

                {isCredits && project.role_name && (
                  <p className="text-xs font-medium" style={{ color: "hsl(var(--portfolio-accent))" }}>
                    {project.role_name}
                    {project.role_type && ` (${project.role_type})`}
                  </p>
                )}

                {!image && project.logline && (
                  <p className="text-xs line-clamp-2" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
                    {project.logline}
                  </p>
                )}

                {project.genre && project.genre.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.genre.slice(0, 3).map((g: string) => (
                      <span
                        key={g}
                        className="text-[10px] px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: "hsl(var(--portfolio-muted))",
                          color: "hsl(var(--portfolio-muted-fg))",
                        }}
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 mt-2">
                  {project.imdb_link && (
                    <a
                      href={project.imdb_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs hover:opacity-80"
                      style={{ color: "hsl(var(--portfolio-accent))" }}
                    >
                      <ExternalLink className="w-3 h-3" /> IMDb
                    </a>
                  )}
                  {project.project_slug && profileSlug && (
                    <a
                      href={`/p/${profileSlug}/${project.project_slug}`}
                      className="inline-flex items-center gap-1 text-xs hover:opacity-80"
                      style={{ color: "hsl(var(--portfolio-accent))" }}
                    >
                      <ExternalLink className="w-3 h-3" /> Details
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionProjects;
