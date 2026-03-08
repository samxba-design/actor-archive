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

/* ── Credit-specific hero card ── */
const CreditHero = ({ project }: { project: any }) => {
  const image = project.backdrop_url || project.poster_url || project.custom_image_url;
  if (!image) return null;

  return (
    <div
      className="relative overflow-hidden group cursor-default"
      style={{
        borderRadius: "var(--portfolio-radius)",
        border: "1px solid hsl(var(--portfolio-border))",
      }}
    >
      <div className="aspect-[21/9] sm:aspect-[3/1] overflow-hidden">
        <img
          src={image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div
        className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8"
        style={{ background: "linear-gradient(to top, hsl(var(--portfolio-bg) / 0.95) 0%, hsl(var(--portfolio-bg) / 0.6) 40%, transparent 100%)" }}
      >
        {/* Network badge */}
        {project.network_or_studio && (
          <span
            className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded mb-3 self-start"
            style={{
              backgroundColor: "hsl(var(--portfolio-accent))",
              color: "hsl(var(--portfolio-accent-fg))",
              letterSpacing: "0.1em",
            }}
          >
            {project.network_or_studio}
          </span>
        )}

        {project.genre && project.genre.length > 0 && (
          <div className="flex gap-1.5 mb-2">
            {project.genre.slice(0, 3).map((g: string) => (
              <span key={g} className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "hsl(var(--portfolio-accent) / 0.2)", color: "hsl(var(--portfolio-accent))" }}>
                {g}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--portfolio-heading-font)", color: "hsl(var(--portfolio-fg))" }}>
          {project.title}
          {project.year && <span className="ml-2 text-sm font-normal" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>({project.year})</span>}
        </h3>

        {/* Role badge */}
        {project.role_name && (
          <p className="text-sm font-semibold mt-1.5" style={{ color: "hsl(var(--portfolio-accent))" }}>
            {project.role_name}
            {project.role_type && <span className="font-normal" style={{ color: "hsl(var(--portfolio-muted-fg))" }}> · {project.role_type}</span>}
          </p>
        )}

        {project.logline && (
          <p className="text-sm mt-1 max-w-xl" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{project.logline}</p>
        )}
      </div>
    </div>
  );
};

/* ── Credit card (horizontal layout) ── */
const CreditCard = ({ project, profileSlug }: { project: any; profileSlug?: string }) => {
  const image = project.poster_url || project.custom_image_url || project.backdrop_url;
  const Icon = typeIcons[project.project_type] || FileText;

  return (
    <div
      className="flex gap-0 overflow-hidden transition-all duration-300 hover:shadow-lg"
      style={{
        backgroundColor: "hsl(var(--portfolio-card))",
        border: "1px solid hsl(var(--portfolio-border))",
        borderRadius: "var(--portfolio-radius)",
      }}
    >
      {/* Left: image or icon placeholder */}
      <div className="relative w-28 sm:w-36 flex-shrink-0">
        {image ? (
          <img src={image} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "hsl(var(--portfolio-muted))" }}>
            <Icon className="w-8 h-8" style={{ color: "hsl(var(--portfolio-muted-fg))" }} />
          </div>
        )}
      </div>

      {/* Right: content */}
      <div className="flex-1 p-4 flex flex-col justify-center gap-1.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {/* Network badge */}
            {project.network_or_studio && (
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-1"
                style={{
                  backgroundColor: "hsl(var(--portfolio-accent) / 0.15)",
                  color: "hsl(var(--portfolio-accent))",
                  letterSpacing: "0.08em",
                }}
              >
                {project.network_or_studio}
              </span>
            )}
            <h3 className="font-semibold text-sm leading-tight" style={{ fontFamily: "var(--portfolio-heading-font)", color: "hsl(var(--portfolio-card-fg))" }}>
              {project.title}
            </h3>
          </div>
          {project.year && (
            <span className="text-lg font-bold flex-shrink-0 tabular-nums" style={{ color: "hsl(var(--portfolio-accent) / 0.3)", fontFamily: "var(--portfolio-heading-font)" }}>
              {project.year}
            </span>
          )}
        </div>

        {/* Role */}
        {project.role_name && (
          <span
            className="inline-block text-xs font-medium px-2 py-0.5 rounded-full self-start"
            style={{
              backgroundColor: "hsl(var(--portfolio-accent) / 0.12)",
              color: "hsl(var(--portfolio-accent))",
            }}
          >
            {project.role_name}
            {project.role_type && ` · ${project.role_type}`}
          </span>
        )}

        {/* Genre tags */}
        {project.genre && project.genre.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.genre.slice(0, 3).map((g: string) => (
              <span key={g} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "hsl(var(--portfolio-muted))", color: "hsl(var(--portfolio-muted-fg))" }}>
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 mt-1">
          {project.imdb_link && (
            <a href={project.imdb_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs hover:opacity-80" style={{ color: "hsl(var(--portfolio-accent))" }}>
              <ExternalLink className="w-3 h-3" /> IMDb
            </a>
          )}
          {project.project_slug && profileSlug && (
            <a href={`/p/${profileSlug}/${project.project_slug}`} className="inline-flex items-center gap-1 text-xs hover:opacity-80" style={{ color: "hsl(var(--portfolio-accent))" }}>
              <ExternalLink className="w-3 h-3" /> Details
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Standard project card (grid) ── */
const ProjectCard = ({ project, profileSlug, playingVideo, onPlay, onStop }: {
  project: any; profileSlug?: string; playingVideo: string | null; onPlay: (id: string) => void; onStop: () => void;
}) => {
  const Icon = typeIcons[project.project_type] || FileText;
  const image = project.poster_url || project.custom_image_url || project.backdrop_url;

  return (
    <div
      className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{
        backgroundColor: "hsl(var(--portfolio-card))",
        border: "1px solid hsl(var(--portfolio-border))",
        borderRadius: "var(--portfolio-radius)",
      }}
    >
      {/* Image / video area */}
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
            <button onClick={(e) => { e.stopPropagation(); onStop(); }} className="absolute top-2 right-2 p-1 rounded-full" style={{ backgroundColor: "hsl(var(--portfolio-bg) / 0.8)" }}>
              <X className="w-4 h-4" style={{ color: "hsl(var(--portfolio-fg))" }} />
            </button>
          </div>
        ) : image ? (
          <div className="aspect-[2/3] sm:aspect-video overflow-hidden relative">
            <img src={image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            {project.video_url && (
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onPlay(project.id); }} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "hsl(var(--portfolio-accent))" }}>
                  <Play className="w-5 h-5 ml-0.5" style={{ color: "hsl(var(--portfolio-accent-fg))" }} />
                </div>
              </button>
            )}
          </div>
        ) : (
          <div className="aspect-video flex items-center justify-center" style={{ backgroundColor: "hsl(var(--portfolio-muted))" }}>
            <Icon className="w-10 h-10" style={{ color: "hsl(var(--portfolio-muted-fg))" }} />
          </div>
        )}
        {project.logline && image && playingVideo !== project.id && (
          <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(transparent 30%, hsl(var(--portfolio-bg) / 0.85))" }}>
            <p className="text-xs line-clamp-3" style={{ color: "hsl(var(--portfolio-fg))" }}>{project.logline}</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight" style={{ fontFamily: "var(--portfolio-heading-font)", color: "hsl(var(--portfolio-card-fg))" }}>
            {project.title}
          </h3>
          {project.year && (
            <span className="text-xs flex-shrink-0" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{project.year}</span>
          )}
        </div>
        {!image && project.logline && (
          <p className="text-xs line-clamp-2" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{project.logline}</p>
        )}
        {project.genre && project.genre.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {project.genre.slice(0, 3).map((g: string) => (
              <span key={g} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "hsl(var(--portfolio-muted))", color: "hsl(var(--portfolio-muted-fg))" }}>
                {g}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3 mt-2">
          {project.imdb_link && (
            <a href={project.imdb_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs hover:opacity-80" style={{ color: "hsl(var(--portfolio-accent))" }}>
              <ExternalLink className="w-3 h-3" /> IMDb
            </a>
          )}
          {project.project_slug && profileSlug && (
            <a href={`/p/${profileSlug}/${project.project_slug}`} className="inline-flex items-center gap-1 text-xs hover:opacity-80" style={{ color: "hsl(var(--portfolio-accent))" }}>
              <ExternalLink className="w-3 h-3" /> Details
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Main component ── */
const SectionProjects = ({ items, profileType, profileSlug, isCredits }: Props) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const featured = items.filter((p) => p.is_featured);
  const rest = items.filter((p) => !p.is_featured);
  const sorted = [...featured, ...rest];

  const heroProject = featured.length > 0 ? featured[0] : null;
  const remainingProjects = heroProject ? sorted.filter(p => p.id !== heroProject.id) : sorted;

  /* Credits layout: hero + horizontal cards */
  if (isCredits) {
    return (
      <div className="space-y-4">
        {heroProject && <CreditHero project={heroProject} />}
        <div className="space-y-3">
          {remainingProjects.map((project) => (
            <CreditCard key={project.id} project={project} profileSlug={profileSlug} />
          ))}
        </div>
      </div>
    );
  }

  /* Standard projects: hero + grid */
  const heroImage = heroProject ? (heroProject.backdrop_url || heroProject.poster_url || heroProject.custom_image_url) : null;

  return (
    <div className="space-y-6">
      {heroProject && heroImage && <CreditHero project={heroProject} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {remainingProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            profileSlug={profileSlug}
            playingVideo={playingVideo}
            onPlay={setPlayingVideo}
            onStop={() => setPlayingVideo(null)}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionProjects;
