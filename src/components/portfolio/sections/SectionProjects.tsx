import { useState } from "react";
import { Film, Tv, BookOpen, FileText, ExternalLink, Play, X } from "lucide-react";
import { extractYouTubeId, extractVimeoId } from "@/lib/videoEmbed";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import GlassCard from "@/components/portfolio/GlassCard";
import CompanyLogo from "@/components/CompanyLogo";

interface Props {
  items: any[];
  profileType: string | null;
  profileSlug?: string;
  isCredits?: boolean;
}

const typeIcons: Record<string, any> = {
  film: Film, tv_show: Tv, screenplay: FileText, pilot: Tv, novel: BookOpen, book: BookOpen,
};

/* ── Compact table-style credit row ── */
const CreditRow = ({ project }: { project: any }) => {
  const theme = usePortfolioTheme();
  const image = project.poster_url || project.custom_image_url || project.backdrop_url;
  const Icon = typeIcons[project.project_type] || FileText;

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 transition-all group"
      style={{
        borderLeft: project.is_featured ? `2px solid ${theme.accentPrimary}` : '2px solid transparent',
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${theme.bgElevated}80`)}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {/* Thumbnail */}
      <div className="w-10 h-10 rounded shrink-0 overflow-hidden" style={{ backgroundColor: theme.bgElevated }}>
        {image ? (
          <img src={image} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="w-4 h-4" style={{ color: theme.textTertiary }} />
          </div>
        )}
      </div>

      {/* Title + role */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[13px] font-semibold leading-tight truncate" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>
          {project.title}
        </h4>
        {project.role_name && (
          <span className="text-[11px]" style={{ color: theme.accentPrimary }}>
            {project.role_name}{project.role_type ? ` · ${project.role_type}` : ''}
          </span>
        )}
      </div>

      {/* Network badge */}
      {project.network_or_studio && (
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <CompanyLogo companyName={project.network_or_studio} size={16} grayscale />
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: theme.textSecondary }}>
            {project.network_or_studio}
          </span>
        </div>
      )}

      {/* Year */}
      {project.year && (
        <span className="text-[12px] tabular-nums font-medium shrink-0" style={{ color: theme.textTertiary }}>
          {project.year}
        </span>
      )}

      {/* IMDb */}
      {project.imdb_link && (
        <a href={project.imdb_link} target="_blank" rel="noopener noreferrer" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: theme.accentPrimary }}>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
};

/* ── Full project card (non-credits) ── */
const ProjectCard = ({ project, profileSlug, playingVideo, onPlay, onStop }: { project: any; profileSlug?: string; playingVideo: string | null; onPlay: (id: string) => void; onStop: () => void }) => {
  const theme = usePortfolioTheme();
  const Icon = typeIcons[project.project_type] || FileText;
  const image = project.poster_url || project.custom_image_url || project.backdrop_url;

  return (
    <GlassCard className="group overflow-hidden">
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
      </div>
    </GlassCard>
  );
};

const SectionProjects = ({ items, profileType, profileSlug, isCredits }: Props) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const theme = usePortfolioTheme();
  const featured = items.filter(p => p.is_featured);
  const rest = items.filter(p => !p.is_featured);
  const sorted = [...featured, ...rest];

  if (isCredits) {
    return (
      <GlassCard className="divide-y" style={{ borderColor: theme.borderDefault }}>
        {sorted.map(project => (
          <CreditRow key={project.id} project={project} />
        ))}
      </GlassCard>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sorted.map(project => (
        <ProjectCard key={project.id} project={project} profileSlug={profileSlug} playingVideo={playingVideo} onPlay={setPlayingVideo} onStop={() => setPlayingVideo(null)} />
      ))}
    </div>
  );
};

export default SectionProjects;
