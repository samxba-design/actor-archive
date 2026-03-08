import { Film, Tv, BookOpen, FileText, ExternalLink } from "lucide-react";

interface Props {
  items: any[];
  profileType: string | null;
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

const SectionProjects = ({ items, profileType, isCredits }: Props) => {
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
              {/* Image with hover overlay */}
              <div className="relative">
                {image ? (
                  <div className="aspect-[2/3] sm:aspect-video overflow-hidden">
                    <img
                      src={image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
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
                {project.logline && image && (
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

                {project.imdb_link && (
                  <a
                    href={project.imdb_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs mt-2 hover:opacity-80"
                    style={{ color: "hsl(var(--portfolio-accent))" }}
                  >
                    <ExternalLink className="w-3 h-3" /> IMDb
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionProjects;
