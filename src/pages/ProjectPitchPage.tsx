import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PortfolioThemeProvider } from "@/themes/ThemeProvider";
import { resolveThemeId } from "@/themes/themes";
import { Loader2, ArrowLeft, Calendar, Film, Clock, FileText, Users, Tag, ExternalLink } from "lucide-react";
import { extractYouTubeId, extractVimeoId, isYouTube, isVimeo } from "@/lib/videoEmbed";

const ProjectPitchPage = () => {
  const { slug, projectSlug } = useParams<{ slug: string; projectSlug: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [awards, setAwards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug || !projectSlug) return;
    const fetch = async () => {
      // Get profile by slug
      const { data: prof } = await supabase
        .from("profiles")
        .select("id, display_name, first_name, last_name, profile_photo_url, tagline, theme, accent_color, slug, headline")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (!prof) { setNotFound(true); setLoading(false); return; }
      setProfile(prof);

      // Get project by project_slug
      const { data: proj } = await supabase
        .from("projects")
        .select("*")
        .eq("profile_id", prof.id)
        .eq("project_slug", projectSlug)
        .eq("access_level", "public")
        .maybeSingle();

      if (!proj) { setNotFound(true); setLoading(false); return; }
      setProject(proj);

      // Get awards for this project
      const { data: aw } = await supabase
        .from("awards")
        .select("*")
        .eq("project_id", proj.id)
        .order("year", { ascending: false });
      setAwards(aw || []);

      // Log page view
      supabase.from("page_views").insert({
        profile_id: prof.id,
        project_id: proj.id,
        path: `/p/${slug}/${projectSlug}`,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        device_type: window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop",
      });

      setLoading(false);
    };
    fetch();
  }, [slug, projectSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !project || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-muted-foreground">This project doesn't exist or isn't available.</p>
        {slug && (
          <Link to={`/p/${slug}`} className="text-primary hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to portfolio
          </Link>
        )}
      </div>
    );
  }

  const writerName = profile.display_name || [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Unknown";
  const posterImage = project.poster_url || project.backdrop_url || project.custom_image_url;
  const comps = project.comparable_titles as any[] | null;

  // Video embed
  let embedUrl = "";
  if (project.video_url) {
    if (isYouTube(project.video_url)) {
      const id = extractYouTubeId(project.video_url);
      if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
    } else if (isVimeo(project.video_url)) {
      const id = extractVimeoId(project.video_url);
      if (id) embedUrl = `https://player.vimeo.com/video/${id}`;
    }
  }

  const typeLabels: Record<string, string> = {
    screenplay: "Screenplay", pilot: "TV Pilot", spec_script: "Spec Script", play: "Stage Play",
    novel: "Novel", short_story: "Short Story", article: "Article", case_study: "Case Study",
    campaign: "Campaign", video: "Video", film: "Film", tv_show: "TV Series", book: "Book",
    writing_sample: "Writing Sample", series_bible: "Series Bible", comedy_packet: "Comedy Packet", other: "Project",
  };

  const themeId = resolveThemeId(profile.theme);

  return (
    <PortfolioThemeProvider themeId={themeId} className="min-h-screen">
    <div
      id="pitch-container"
      className="min-h-screen"
    >
      {/* Top bar */}
      <nav className="border-b px-4 sm:px-6 py-3 flex items-center justify-between" style={{ borderColor: "hsl(var(--portfolio-border))" }}>
        <Link
          to={`/p/${slug}`}
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: "hsl(var(--portfolio-muted-fg))" }}
        >
          <ArrowLeft className="w-4 h-4" />
          {writerName}'s Portfolio
        </Link>
        {profile.profile_photo_url && (
          <img src={profile.profile_photo_url} alt="" className="w-7 h-7 rounded-full object-cover" />
        )}
      </nav>

      {/* Hero section */}
      <div className="relative">
        {posterImage && (
          <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden">
            <img src={posterImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, hsl(var(--portfolio-bg)) 100%)" }} />
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Title block */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: "hsl(var(--portfolio-accent) / 0.12)", color: "hsl(var(--portfolio-accent))" }}>
              {typeLabels[project.project_type] || project.project_type}
            </span>
            {project.format && <span>· {project.format}</span>}
            {project.year && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {project.year}</span>}
            {project.runtime_minutes && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {project.runtime_minutes} min</span>}
            {project.page_count && <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {project.page_count} pages</span>}
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight"
            style={{ fontFamily: "var(--portfolio-heading-font)" }}
          >
            {project.title}
          </h1>

          {project.role_name && (
            <p className="text-sm font-medium" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
              {project.role_name} — {writerName}
            </p>
          )}

          {project.status && (
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium" style={{
              backgroundColor: project.status === "Released" || project.status === "Completed"
                ? "hsl(142 71% 45% / 0.12)" : "hsl(var(--portfolio-accent) / 0.12)",
              color: project.status === "Released" || project.status === "Completed"
                ? "hsl(142 71% 45%)" : "hsl(var(--portfolio-accent))",
            }}>
              {project.status}
            </span>
          )}

          {project.rights_status && (
            <span className="inline-block ml-2 px-2.5 py-1 rounded-full text-xs font-medium" style={{
              backgroundColor: "hsl(var(--portfolio-muted))", color: "hsl(var(--portfolio-muted-fg))",
            }}>
              Rights: {project.rights_status}
            </span>
          )}
        </div>

        {/* Logline */}
        {project.logline && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>Logline</h2>
            <p className="text-lg leading-relaxed italic" style={{ color: "hsl(var(--portfolio-fg) / 0.9)" }}>
              "{project.logline}"
            </p>
          </div>
        )}

        {/* Video */}
        {embedUrl && (
          <div className="overflow-hidden" style={{ borderRadius: "var(--portfolio-radius)", border: "1px solid hsl(var(--portfolio-border))", aspectRatio: "16/9" }}>
            <iframe src={embedUrl} title={project.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        )}

        {/* Synopsis */}
        {(project.synopsis || project.description) && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
              {project.synopsis ? "Synopsis" : "Description"}
            </h2>
            <p className="leading-relaxed whitespace-pre-line" style={{ color: "hsl(var(--portfolio-fg) / 0.85)" }}>
              {project.synopsis || project.description}
            </p>
          </div>
        )}

        {/* Comparable Titles */}
        {comps && comps.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>Comparable Titles</h2>
            <div className="flex flex-wrap gap-2">
              {comps.map((c: any, i: number) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{
                  backgroundColor: "hsl(var(--portfolio-card))", border: "1px solid hsl(var(--portfolio-border))", color: "hsl(var(--portfolio-card-fg))",
                }}>
                  {typeof c === "string" ? c : c.title || c.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {project.genre?.length > 0 && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: "hsl(var(--portfolio-card))", border: "1px solid hsl(var(--portfolio-border))" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>Genre</p>
              <div className="flex flex-wrap gap-1.5">
                {project.genre.map((g: string) => (
                  <span key={g} className="flex items-center gap-1 text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>
                    <Tag className="w-3 h-3" /> {g}
                  </span>
                ))}
              </div>
            </div>
          )}
          {project.director && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: "hsl(var(--portfolio-card))", border: "1px solid hsl(var(--portfolio-border))" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>Director</p>
              <p className="text-sm font-medium" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{project.director}</p>
            </div>
          )}
          {project.production_company && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: "hsl(var(--portfolio-card))", border: "1px solid hsl(var(--portfolio-border))" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>Production</p>
              <p className="text-sm font-medium" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{project.production_company}</p>
            </div>
          )}
          {project.network_or_studio && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: "hsl(var(--portfolio-card))", border: "1px solid hsl(var(--portfolio-border))" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>Network / Studio</p>
              <p className="text-sm font-medium" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{project.network_or_studio}</p>
            </div>
          )}
          {project.notable_cast?.length > 0 && (
            <div className="p-4 rounded-lg sm:col-span-2" style={{ backgroundColor: "hsl(var(--portfolio-card))", border: "1px solid hsl(var(--portfolio-border))" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
                <Users className="w-3 h-3 inline mr-1" />Cast
              </p>
              <p className="text-sm" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{project.notable_cast.join(", ")}</p>
            </div>
          )}
          {project.cast_size_notation && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: "hsl(var(--portfolio-card))", border: "1px solid hsl(var(--portfolio-border))" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>Cast Size</p>
              <p className="text-sm font-medium" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{project.cast_size_notation}</p>
            </div>
          )}
        </div>

        {/* Awards */}
        {awards.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>Awards & Recognition</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {awards.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "hsl(var(--portfolio-card))", border: "1px solid hsl(var(--portfolio-border))" }}>
                  {a.laurel_image_url ? (
                    <img src={a.laurel_image_url} alt="" className="w-12 h-12 object-contain" />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: "hsl(var(--portfolio-accent) / 0.12)", color: "hsl(var(--portfolio-accent))" }}>🏆</div>
                  )}
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "hsl(var(--portfolio-card-fg))" }}>{a.name}</p>
                    <p className="text-xs" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
                      {[a.result, a.organization, a.year].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* External links */}
        <div className="flex flex-wrap gap-3">
          {project.imdb_link && (
            <a href={project.imdb_link} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "hsl(var(--portfolio-card))", border: "1px solid hsl(var(--portfolio-border))", color: "hsl(var(--portfolio-card-fg))" }}>
              <ExternalLink className="w-4 h-4" /> IMDb
            </a>
          )}
          {project.article_url && (
            <a href={project.article_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "hsl(var(--portfolio-card))", border: "1px solid hsl(var(--portfolio-border))", color: "hsl(var(--portfolio-card-fg))" }}>
              <ExternalLink className="w-4 h-4" /> Read Article
            </a>
          )}
        </div>

        {/* Writer credit footer */}
        <div className="pt-8 border-t flex items-center gap-4" style={{ borderColor: "hsl(var(--portfolio-border))" }}>
          {profile.profile_photo_url && (
            <img src={profile.profile_photo_url} alt="" className="w-12 h-12 rounded-full object-cover" />
          )}
          <div>
            <Link to={`/p/${slug}`} className="font-semibold hover:underline" style={{ color: "hsl(var(--portfolio-fg))" }}>
              {writerName}
            </Link>
            {(profile.headline || profile.tagline) && (
              <p className="text-sm" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>{profile.headline || profile.tagline}</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </PortfolioThemeProvider>
  );
};

export default ProjectPitchPage;
