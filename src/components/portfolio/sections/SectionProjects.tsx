import { useState, forwardRef } from "react";
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
  layout?: 'poster' | 'table' | 'grid';
  imageAnimation?: string;
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

/* ── Poster-style credit card (2:3 aspect, text below image) ── */
const PosterCard = ({ project, imageAnimation = 'none' }: { project: any; imageAnimation?: string }) => {
  const theme = usePortfolioTheme();
  const [hovered, setHovered] = useState(false);
  const image = project.poster_url || project.custom_image_url || project.backdrop_url;
  const Icon = typeIcons[project.project_type] || FileText;

  const card = (
    <div
      className="group overflow-hidden transition-all"
      style={{
        borderRadius: theme.cardRadius,
        boxShadow: hovered ? theme.cardHoverShadow : theme.cardShadow,
        transform: hovered ? theme.cardHoverTransform : 'none',
        transitionDuration: theme.hoverTransitionDuration,
        backgroundColor: theme.bgSecondary,
        border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster image — clean, no overlay text */}
      <div className={`aspect-[2/3] overflow-hidden relative ${imageAnimation !== 'none' ? `img-anim-${imageAnimation}` : ''}`} style={{ backgroundColor: theme.bgElevated }}>
        {image ? (
          <img
            src={image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="w-10 h-10" style={{ color: theme.textTertiary }} />
          </div>
        )}

        {/* External link on hover */}
        {project.imdb_link && (
          <div
            className="absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: `${theme.bgPrimary}cc`, color: theme.accentPrimary }}
          >
            <ExternalLink className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Info bar — solid background, always readable */}
      <div className="p-2.5 space-y-1">
        {/* Network badge */}
        {project.network_or_studio && (
          <div className="flex items-center gap-1.5">
            <CompanyLogo companyName={project.network_or_studio} size={12} grayscale={false} />
            <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: theme.accentPrimary }}>
              {project.network_or_studio}
            </span>
          </div>
        )}

        <h4
          className="font-semibold leading-tight truncate"
          style={{
            fontFamily: theme.fontDisplay,
            fontWeight: theme.headingWeight,
            fontSize: '13px',
            color: theme.textPrimary,
          }}
        >
          {project.title}
        </h4>

        {/* Role + year */}
        <div className="flex items-center justify-between gap-2">
          {project.role_name && (
            <span
              className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: `${theme.accentPrimary}20`,
                color: theme.accentPrimary,
              }}
            >
              {project.role_name}
            </span>
          )}
          {project.year && (
            <span className="text-[10px] tabular-nums" style={{ color: theme.textTertiary }}>
              {project.year}
            </span>
          )}
        </div>

        {/* Genre tags */}
        {project.genre?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.genre.slice(0, 2).map((g: string) => (
              <span
                key={g}
                className="text-[8px] uppercase tracking-wider px-1.5 py-0.5"
                style={{
                  backgroundColor: theme.accentSubtle,
                  color: theme.textSecondary,
                  borderRadius: '2px',
                }}
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return project.imdb_link ? (
    <a href={project.imdb_link} target="_blank" rel="noopener noreferrer" className="no-underline block">
      {card}
    </a>
  ) : card;
};

/* ── Full project card (non-credits) ── */
const ProjectCard = ({ project, profileSlug, playingVideo, onPlay, onStop }: { project: any; profileSlug?: string; playingVideo: string | null; onPlay: (id: string) => void; onStop: () => void }) => {
  const theme = usePortfolioTheme();
  const Icon = typeIcons[project.project_type] || FileText;
  const image = project.poster_url || project.custom_image_url || project.backdrop_url;

  const card = (
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
            <button onClick={e => { e.stopPropagation(); e.preventDefault(); onStop(); }} className="absolute top-2 right-2 p-1 rounded-full" style={{ backgroundColor: `${theme.bgPrimary}cc` }}>
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
            {project.imdb_link && !project.video_url && (
              <div className="absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: `${theme.bgPrimary}cc` }}>
                <ExternalLink className="w-3.5 h-3.5" style={{ color: theme.accentPrimary }} />
              </div>
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

  // Don't wrap in link if video is playing
  if (playingVideo === project.id) return card;

  return project.imdb_link ? (
    <a href={project.imdb_link} target="_blank" rel="noopener noreferrer" className="no-underline block">
      {card}
    </a>
  ) : card;
};

const SectionProjects = ({ items, profileType, profileSlug, isCredits, layout, imageAnimation }: Props) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const theme = usePortfolioTheme();
  const featured = items.filter(p => p.is_featured);
  const rest = items.filter(p => !p.is_featured);
  const sorted = [...featured, ...rest];

  // Determine effective layout
  const effectiveLayout = layout || (isCredits ? 'table' : 'grid');

  if (effectiveLayout === 'table') {
    return (
      <GlassCard className="divide-y" style={{ borderColor: theme.borderDefault }}>
        {sorted.map(project => (
          <CreditRow key={project.id} project={project} />
        ))}
      </GlassCard>
    );
  }

  if (effectiveLayout === 'poster') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {sorted.map(project => (
          <PosterCard key={project.id} project={project} imageAnimation={imageAnimation} />
        ))}
      </div>
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
