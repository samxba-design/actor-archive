import { useState } from "react";
import { Film, Tv, BookOpen, FileText, ExternalLink, Play, X } from "lucide-react";
import { extractYouTubeId, extractVimeoId } from "@/lib/videoEmbed";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  items: any[];
  profileType: string | null;
  profileSlug?: string;
  isCredits?: boolean;
}

const typeIcons: Record<string, any> = {
  film: Film, tv_show: Tv, screenplay: FileText, pilot: Tv, novel: BookOpen, book: BookOpen,
};

const CreditHero = ({ project }: { project: any }) => {
  const theme = usePortfolioTheme();
  const image = project.backdrop_url || project.poster_url || project.custom_image_url;
  if (!image) return null;

  return (
    <div className="relative overflow-hidden group cursor-default" style={{ borderRadius: theme.cardRadius, border: `${theme.cardBorderWidth} solid ${theme.borderDefault}` }}>
      <div className="aspect-[21/9] sm:aspect-[3/1] overflow-hidden">
        <img src={image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8" style={{ background: `linear-gradient(to top, ${theme.bgPrimary}f2 0%, ${theme.bgPrimary}99 40%, transparent 100%)` }}>
        {project.network_or_studio && (
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded mb-3 self-start" style={{ backgroundColor: theme.accentPrimary, color: theme.textOnAccent, letterSpacing: "0.1em" }}>
            {project.network_or_studio}
          </span>
        )}
        {project.genre?.length > 0 && (
          <div className="flex gap-1.5 mb-2">
            {project.genre.slice(0, 3).map((g: string) => (
              <span key={g} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.accentSubtle, color: theme.accentPrimary }}>{g}</span>
            ))}
          </div>
        )}
        <h3 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>
          {project.title}
          {project.year && <span className="ml-2 text-sm font-normal" style={{ color: theme.textSecondary }}>({project.year})</span>}
        </h3>
        {project.role_name && (
          <p className="text-sm font-semibold mt-1.5" style={{ color: theme.accentPrimary }}>
            {project.role_name}
            {project.role_type && <span className="font-normal" style={{ color: theme.textSecondary }}> · {project.role_type}</span>}
          </p>
        )}
        {project.logline && <p className="text-sm mt-1 max-w-xl" style={{ color: theme.textSecondary }}>{project.logline}</p>}
      </div>
    </div>
  );
};

const CreditCard = ({ project, profileSlug }: { project: any; profileSlug?: string }) => {
  const theme = usePortfolioTheme();
  const image = project.poster_url || project.custom_image_url || project.backdrop_url;
  const Icon = typeIcons[project.project_type] || FileText;

  return (
    <div className="flex gap-0 overflow-hidden transition-all" style={{ backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary, backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined, border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`, borderRadius: theme.cardRadius, transitionDuration: theme.hoverTransitionDuration }}>
      <div className="relative w-28 sm:w-36 shrink-0">
        {image ? <img src={image} alt={project.title} className="w-full h-full object-cover" loading="lazy" /> : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: theme.bgElevated }}>
            <Icon className="w-8 h-8" style={{ color: theme.textTertiary }} />
          </div>
        )}
      </div>
      <div className="flex-1 p-4 flex flex-col justify-center gap-1.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {project.network_or_studio && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-1" style={{ backgroundColor: theme.accentSubtle, color: theme.accentPrimary }}>{project.network_or_studio}</span>
            )}
            <h3 className="font-semibold text-sm leading-tight" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{project.title}</h3>
          </div>
          {project.year && <span className="text-lg font-bold shrink-0 tabular-nums" style={{ color: `${theme.accentPrimary}50`, fontFamily: theme.fontDisplay }}>{project.year}</span>}
        </div>
        {project.role_name && (
          <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full self-start" style={{ backgroundColor: theme.accentSubtle, color: theme.accentPrimary }}>
            {project.role_name}{project.role_type && ` · ${project.role_type}`}
          </span>
        )}
        {project.genre?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.genre.slice(0, 3).map((g: string) => (
              <span key={g} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: theme.bgElevated, color: theme.textSecondary }}>{g}</span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3 mt-1">
          {project.imdb_link && (
            <a href={project.imdb_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs" style={{ color: theme.accentPrimary }}>
              <ExternalLink className="w-3 h-3" /> IMDb
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, profileSlug, playingVideo, onPlay, onStop }: { project: any; profileSlug?: string; playingVideo: string | null; onPlay: (id: string) => void; onStop: () => void }) => {
  const theme = usePortfolioTheme();
  const Icon = typeIcons[project.project_type] || FileText;
  const image = project.poster_url || project.custom_image_url || project.backdrop_url;

  return (
    <div className="group overflow-hidden transition-all" style={{ backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary, backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined, border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`, borderRadius: theme.cardRadius, transitionDuration: theme.hoverTransitionDuration }}>
      <div className="relative">
        {playingVideo === project.id ? (
          <div className="aspect-video">
            {(() => {
              const ytId = extractYouTubeId(project.video_url || "");
              const vimeoId = extractVimeoId(project.video_url || "");
              const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}?autoplay=1` : vimeoId ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1` : null;
              return embedUrl ? <iframe src={embedUrl} className="w-full h-full" allowFullScreen allow="autoplay" /> : null;
            })()}
            <button onClick={e => { e.stopPropagation(); onStop(); }} className="absolute top-2 right-2 p-1 rounded-full" style={{ backgroundColor: `${theme.bgPrimary}cc` }}>
              <X className="w-4 h-4" style={{ color: theme.textPrimary }} />
            </button>
          </div>
        ) : image ? (
          <div className="aspect-[2/3] sm:aspect-video overflow-hidden relative">
            <img src={image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            {project.video_url && (
              <button onClick={e => { e.preventDefault(); e.stopPropagation(); onPlay(project.id); }} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accentPrimary }}>
                  <Play className="w-5 h-5 ml-0.5" style={{ color: theme.textOnAccent }} />
                </div>
              </button>
            )}
          </div>
        ) : (
          <div className="aspect-video flex items-center justify-center" style={{ backgroundColor: theme.bgElevated }}>
            <Icon className="w-10 h-10" style={{ color: theme.textTertiary }} />
          </div>
        )}
      </div>
      <div className="p-4 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{project.title}</h3>
          {project.year && <span className="text-xs shrink-0" style={{ color: theme.textSecondary }}>{project.year}</span>}
        </div>
        {project.genre?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {project.genre.slice(0, 3).map((g: string) => (
              <span key={g} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: theme.bgElevated, color: theme.textSecondary }}>{g}</span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3 mt-2">
          {project.imdb_link && (
            <a href={project.imdb_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs" style={{ color: theme.accentPrimary }}>
              <ExternalLink className="w-3 h-3" /> IMDb
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionProjects = ({ items, profileType, profileSlug, isCredits }: Props) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const featured = items.filter(p => p.is_featured);
  const rest = items.filter(p => !p.is_featured);
  const sorted = [...featured, ...rest];
  const heroProject = featured.length > 0 ? featured[0] : null;
  const remainingProjects = heroProject ? sorted.filter(p => p.id !== heroProject.id) : sorted;

  if (isCredits) {
    return (
      <div className="space-y-3">
        {heroProject && <CreditHero project={heroProject} />}
        <div className="space-y-3">
          {remainingProjects.map(project => <CreditCard key={project.id} project={project} profileSlug={profileSlug} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {heroProject && (heroProject.backdrop_url || heroProject.poster_url) && <CreditHero project={heroProject} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {remainingProjects.map(project => (
          <ProjectCard key={project.id} project={project} profileSlug={profileSlug} playingVideo={playingVideo} onPlay={setPlayingVideo} onStop={() => setPlayingVideo(null)} />
        ))}
      </div>
    </div>
  );
};

export default SectionProjects;
