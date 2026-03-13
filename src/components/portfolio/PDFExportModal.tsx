import { useState, useRef } from "react";
import { FileDown, X, Loader2, Crown } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface ProfileData {
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  headline?: string | null;
  tagline: string | null;
  bio: string | null;
  location: string | null;
  profile_photo_url: string | null;
  profile_type: string | null;
  slug?: string | null;
}

interface Props {
  profile: ProfileData;
  projects?: { title: string; project_type: string; role_name?: string | null; year?: number | null }[];
  awards?: { name: string; organization?: string | null; result?: string | null; year?: number | null }[];
  skills?: { name: string; category?: string | null }[];
  education?: { institution: string; degree_or_certificate?: string | null; year_start?: number | null; year_end?: number | null }[];
  isPro: boolean;
  onClose: () => void;
}

const PDFExportModal = ({ profile, projects = [], awards = [], skills = [], education = [], isPro, onClose }: Props) => {
  const theme = usePortfolioTheme();
  const [generating, setGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const name = profile.display_name || [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Portfolio";
  const profileUrl = `${window.location.origin}/p/${profile.slug}`;

  const handleExport = async () => {
    if (!isPro) return;
    setGenerating(true);

    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        setGenerating(false);
        return;
      }

      const html = generatePrintHTML();
      printWindow.document.write(html);
      printWindow.document.close();

      // Wait for content to render, then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          setGenerating(false);
        }, 500);
      };
    } catch {
      setGenerating(false);
    }
  };

  const generatePrintHTML = () => {
    const creditsHtml = projects.slice(0, 12).map(p => {
      const details = [p.role_name, p.year].filter(Boolean).join(" · ");
      return `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #eee;">
        <span style="font-weight:500;">${p.title}</span>
        <span style="color:#666;font-size:12px;">${details}</span>
      </div>`;
    }).join("");

    const awardsHtml = awards.slice(0, 8).map(a => 
      `<div style="padding:3px 0;"><span style="font-weight:500;">${a.name}</span>${a.organization ? ` — ${a.organization}` : ""}${a.result ? ` (${a.result})` : ""}${a.year ? `, ${a.year}` : ""}</div>`
    ).join("");

    const skillsHtml = skills.slice(0, 20).map(s => 
      `<span style="display:inline-block;background:#f3f4f6;padding:3px 10px;border-radius:12px;font-size:12px;margin:2px 4px 2px 0;">${s.name}</span>`
    ).join("");

    const eduHtml = education.slice(0, 4).map(e => {
      const years = [e.year_start, e.year_end].filter(Boolean).join("–");
      return `<div style="padding:3px 0;"><span style="font-weight:500;">${e.institution}</span>${e.degree_or_certificate ? ` — ${e.degree_or_certificate}` : ""}${years ? ` (${years})` : ""}</div>`;
    }).join("");

    return `<!DOCTYPE html>
<html>
<head>
  <title>${name} — Resume</title>
  <style>
    @page { size: A4; margin: 0.75in; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; font-size: 13px; line-height: 1.5; }
    .header { display: flex; align-items: flex-start; gap: 20px; padding-bottom: 16px; border-bottom: 2px solid #1a1a1a; margin-bottom: 20px; }
    .header img { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; }
    .header-text h1 { font-size: 24px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 2px; }
    .header-text .tagline { color: #555; font-size: 14px; }
    .header-text .meta { color: #888; font-size: 12px; margin-top: 4px; }
    .section { margin-bottom: 18px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #999; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #e5e5e5; }
    .bio { font-size: 13px; line-height: 1.6; color: #333; max-height: 5.5em; overflow: hidden; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e5e5; text-align: center; font-size: 11px; color: #999; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    ${profile.profile_photo_url ? `<img src="${profile.profile_photo_url}" alt="${name}" />` : ""}
    <div class="header-text">
      <h1>${name}</h1>
      ${profile.tagline ? `<div class="tagline">${profile.tagline}</div>` : ""}
      <div class="meta">${[profile.location, profile.profile_type?.replace(/_/g, " ")].filter(Boolean).join(" · ")} · ${profileUrl}</div>
    </div>
  </div>

  ${profile.bio ? `<div class="section"><div class="section-title">About</div><div class="bio">${profile.bio.slice(0, 400)}</div></div>` : ""}
  ${creditsHtml ? `<div class="section"><div class="section-title">Selected Credits</div>${creditsHtml}</div>` : ""}
  ${awardsHtml ? `<div class="section"><div class="section-title">Awards & Recognition</div>${awardsHtml}</div>` : ""}
  ${eduHtml ? `<div class="section"><div class="section-title">Education & Training</div>${eduHtml}</div>` : ""}
  ${skillsHtml ? `<div class="section"><div class="section-title">Skills</div><div>${skillsHtml}</div></div>` : ""}

  <div class="footer">${profileUrl}</div>
</body>
</html>`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="PDF Export Preview">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
        style={{ background: theme.bgPrimary, color: theme.textPrimary, border: `1px solid ${theme.borderDefault}` }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4" style={{ background: theme.bgPrimary, borderBottom: `1px solid ${theme.borderDefault}` }}>
          <h2 className="text-lg font-bold" style={{ fontFamily: theme.fontDisplay }}>Export Resume</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:opacity-70 transition-opacity" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preview */}
        <div className="px-6 py-4">
          <p className="text-xs mb-4" style={{ color: theme.textSecondary }}>
            Preview of your exported resume. The PDF will be formatted for A4 printing.
          </p>

          <div
            ref={previewRef}
            className="bg-white text-black rounded-lg p-8 shadow-inner mx-auto"
            style={{ maxWidth: "520px", fontSize: "11px", lineHeight: "1.5" }}
          >
            {/* Mini preview */}
            <div className="flex items-start gap-3 pb-3 mb-3" style={{ borderBottom: "2px solid #1a1a1a" }}>
              {profile.profile_photo_url && (
                <img src={profile.profile_photo_url} alt="" className="w-12 h-12 rounded-full object-cover" />
              )}
              <div>
                <h3 className="text-base font-bold text-black">{name}</h3>
                {profile.tagline && <p className="text-xs text-gray-600">{profile.tagline}</p>}
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {[profile.location, profile.profile_type?.replace(/_/g, " ")].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>

            {profile.bio && (
              <div className="mb-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">About</p>
                <p className="text-[11px] text-gray-700 line-clamp-3">{profile.bio.slice(0, 200)}...</p>
              </div>
            )}

            {projects.length > 0 && (
              <div className="mb-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Selected Credits</p>
                {projects.slice(0, 4).map((p, i) => (
                  <div key={i} className="flex justify-between py-0.5 text-[10px]" style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <span className="font-medium text-black">{p.title}</span>
                    <span className="text-gray-500">{p.year}</span>
                  </div>
                ))}
                {projects.length > 4 && <p className="text-[9px] text-gray-400 mt-1">+{projects.length - 4} more</p>}
              </div>
            )}

            {skills.length > 0 && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {skills.slice(0, 8).map((s, i) => (
                    <span key={i} className="text-[9px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full">{s.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between px-6 py-4" style={{ background: theme.bgPrimary, borderTop: `1px solid ${theme.borderDefault}` }}>
          {!isPro ? (
            <div className="flex items-center gap-2 text-sm" style={{ color: theme.textSecondary }}>
              <Crown className="h-4 w-4" style={{ color: theme.accentPrimary }} />
              <span>PDF Export is a Pro feature</span>
            </div>
          ) : (
            <span className="text-xs" style={{ color: theme.textTertiary }}>Opens print dialog for PDF save</span>
          )}
          <button
            onClick={handleExport}
            disabled={generating || !isPro}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            style={{
              background: isPro ? theme.accentPrimary : theme.bgSecondary,
              color: isPro ? "#fff" : theme.textSecondary,
            }}
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
            {generating ? "Generating..." : isPro ? "Export PDF" : "Upgrade to Export"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFExportModal;
