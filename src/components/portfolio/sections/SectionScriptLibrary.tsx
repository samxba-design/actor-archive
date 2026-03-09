import { useState } from "react";
import { FileText, Lock, ArrowRight, Shield, Mail, Eye, X, Loader2 } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  items: any[];
  profileId?: string;
  variant?: 'detailed' | 'grid' | 'compact';
}

const FILTERS = ["All", "Feature", "Series", "Pilot"];

const ACCESS_CONFIG: Record<string, { icon: any; label: string }> = {
  public: { icon: Eye, label: 'Read Script' },
  gated: { icon: Mail, label: 'Request Access' },
  password_protected: { icon: Lock, label: 'Password Required' },
  private: { icon: Shield, label: 'By Request' },
  nda_required: { icon: Shield, label: 'NDA Required' },
};

const SectionScriptLibrary = ({ items, profileId, variant = 'detailed' }: Props) => {
  const theme = usePortfolioTheme();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? items : items.filter(p => {
    const format = (p.format || p.project_type || "").toLowerCase();
    return format.includes(activeFilter.toLowerCase());
  });

  const featured = filtered.find(p => p.is_featured || p.is_notable);
  const rest = filtered.filter(p => p !== featured);

  const filterBar = items.length > 2 ? (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {FILTERS.map(f => (
        <button key={f} onClick={() => setActiveFilter(f)}
          className="text-[10px] uppercase tracking-[0.1em] px-3 py-1 rounded-full transition-all duration-200"
          style={{
            backgroundColor: f === activeFilter ? theme.accentPrimary : 'transparent',
            color: f === activeFilter ? theme.textOnAccent : theme.textTertiary,
            border: `1px solid ${f === activeFilter ? theme.accentPrimary : theme.borderDefault}`,
            fontWeight: f === activeFilter ? 600 : 400,
          }}>
          {f}
        </button>
      ))}
    </div>
  ) : null;

  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        {filterBar}
        <CompactVariant items={featured ? [featured, ...rest] : rest} theme={theme} />
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className="space-y-4">
        {filterBar}
        <GridVariant items={featured ? [featured, ...rest] : rest} theme={theme} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filterBar}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {featured && <ScriptCard item={featured} theme={theme} isFeatured profileId={profileId} />}
        {rest.map(p => <ScriptCard key={p.id} item={p} theme={theme} profileId={profileId} />)}
      </div>
    </div>
  );
};

/* ── Grid variant: poster-style cards ── */
const GridVariant = ({ items, theme }: { items: any[]; theme: any }) => {
  const accessColor = (level: string) => level === 'public' ? '#4A9E6B' : level === 'gated' ? '#6B9FD4' : level === 'password_protected' ? '#C9A96E' : '#C41E1E';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map((p) => {
        const ac = accessColor(p.access_level || 'public');
        return (
          <div key={p.id} className="overflow-hidden" style={{
            backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
            border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
            borderRadius: theme.cardRadius,
          }}>
            {/* Color-coded top bar */}
            <div className="h-1 w-full" style={{ backgroundColor: ac }} />
            <div className="p-3 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" style={{ color: ac }} />
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: ac }}>
                  {p.format || p.project_type}
                </span>
              </div>
              <h4 className="text-[13px] font-semibold leading-tight" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{p.title}</h4>
              {p.genre?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {p.genre.slice(0, 2).map((g: string) => (
                    <span key={g} className="text-[8px] uppercase tracking-wide px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.accentSubtle, color: theme.textSecondary }}>{g}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between pt-1">
                {p.page_count && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.bgElevated, color: theme.textTertiary }}>{p.page_count}pp</span>}
                {p.status && <span className="text-[9px] uppercase tracking-wider" style={{ color: theme.textTertiary }}>{p.status}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── Compact variant: single-line rows ── */
const CompactVariant = ({ items, theme }: { items: any[]; theme: any }) => {
  const accessColor = (level: string) => level === 'public' ? '#4A9E6B' : level === 'gated' ? '#6B9FD4' : level === 'password_protected' ? '#C9A96E' : '#C41E1E';

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: `${theme.cardBorderWidth} solid ${theme.borderDefault}` }}>
      {items.map((p, i) => {
        const ac = accessColor(p.access_level || 'public');
        const accessInfo = ACCESS_CONFIG[p.access_level || 'public'] || ACCESS_CONFIG.public;
        return (
          <div key={p.id} className="flex items-center gap-3 px-4 py-2.5 transition-colors"
            style={{ borderBottom: i < items.length - 1 ? `1px solid ${theme.borderDefault}` : undefined }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${theme.bgElevated}60`)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
            <FileText className="w-3.5 h-3.5 shrink-0" style={{ color: ac }} />
            <span className="text-[13px] font-semibold flex-1 min-w-0 truncate" style={{ color: theme.textPrimary, fontFamily: theme.fontDisplay }}>{p.title}</span>
            <span className="text-[10px] uppercase tracking-wider shrink-0 hidden sm:block" style={{ color: theme.textTertiary }}>{p.format || p.project_type}</span>
            {p.page_count && <span className="text-[10px] shrink-0 hidden sm:block" style={{ color: theme.textTertiary }}>{p.page_count}pp</span>}
            <span className="text-[9px] uppercase tracking-wider font-medium shrink-0 px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ac}18`, color: ac }}>
              {accessInfo.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const ScriptCard = ({ item: p, theme, isFeatured, profileId }: { item: any; theme: any; isFeatured?: boolean; profileId?: string }) => {
  const [hovered, setHovered] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const accessLevel = p.access_level || 'public';
  const accessInfo = ACCESS_CONFIG[accessLevel] || ACCESS_CONFIG.public;
  const AccessIcon = accessInfo.icon;

  const accessColor = accessLevel === 'public' ? '#4A9E6B' 
    : accessLevel === 'gated' ? '#6B9FD4'
    : accessLevel === 'password_protected' ? '#C9A96E'
    : '#C41E1E';

  const handleAccessClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (accessLevel === 'public' && p.script_pdf_url) {
      if (!p.script_pdf_url.startsWith("http")) {
        const { data } = await supabase.storage.from("scripts").createSignedUrl(p.script_pdf_url, 3600);
        if (data?.signedUrl) window.open(data.signedUrl, "_blank");
      } else {
        window.open(p.script_pdf_url, "_blank");
      }
    } else if (accessLevel === 'password_protected') {
      setShowPasswordModal(true);
    } else if (accessLevel === 'gated') {
      setShowEmailModal(true);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) return;
    setVerifying(true);
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("verify-script-password", {
        body: { project_id: p.id, password },
      });
      if (fnError || data?.error) {
        setError(data?.error || "Verification failed");
      } else if (data?.download_url) {
        window.open(data.download_url, "_blank");
        setShowPasswordModal(false);
        setPassword("");
      }
    } catch {
      setError("Something went wrong");
    }
    setVerifying(false);
  };

  const handleEmailSubmit = async () => {
    if (!email.trim()) return;
    setVerifying(true);
    if (profileId) {
      await supabase.from("email_captures").insert({
        profile_id: profileId,
        project_id: p.id,
        email,
        name: name || null,
        source: "script_gated",
      });
    }
    if (p.script_pdf_url) {
      if (!p.script_pdf_url.startsWith("http")) {
        const { data } = await supabase.storage.from("scripts").createSignedUrl(p.script_pdf_url, 3600);
        if (data?.signedUrl) window.open(data.signedUrl, "_blank");
      } else {
        window.open(p.script_pdf_url, "_blank");
      }
    }
    setShowEmailModal(false);
    setEmail("");
    setName("");
    setVerifying(false);
  };

  return (
    <>
      <div
        className={`transition-all ${isFeatured ? 'sm:col-span-2' : ''}`}
        style={{
          backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
          backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
          WebkitBackdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
          border: `${theme.cardBorderWidth} solid ${hovered ? theme.borderHover : theme.borderDefault}`,
          borderRadius: theme.cardRadius,
          borderLeftWidth: isFeatured ? '3px' : undefined,
          borderLeftColor: isFeatured ? theme.accentPrimary : undefined,
          borderLeftStyle: isFeatured ? 'solid' : undefined,
          padding: isFeatured ? '20px 24px' : '16px 20px',
          boxShadow: hovered ? theme.cardHoverShadow : theme.cardShadow,
          transform: hovered ? theme.cardHoverTransform : 'none',
          transitionDuration: theme.hoverTransitionDuration,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${accessColor}18` }}>
              <FileText className="w-3.5 h-3.5" style={{ color: accessColor }} />
            </div>
            <h4 className="leading-tight transition-colors duration-200 flex-1"
              style={{ fontFamily: theme.fontDisplay, fontWeight: theme.headingWeight, fontSize: isFeatured ? '18px' : '14px', color: hovered ? theme.accentPrimary : theme.textPrimary }}>
              {p.title}
            </h4>
          </div>
          <p className="uppercase tracking-widest" style={{ fontSize: '10px', color: theme.textTertiary, letterSpacing: '0.08em' }}>
            {[p.format || p.project_type, p.page_count ? `${p.page_count}pp` : null, p.year].filter(Boolean).join(" · ")}
          </p>
          {isFeatured && p.logline && (
            <p className="leading-relaxed line-clamp-2 text-[13px]" style={{ fontFamily: theme.fontLogline, fontStyle: theme.loglineStyle, color: theme.textSecondary }}>"{p.logline}"</p>
          )}
          {isFeatured && p.coverage_excerpt && (
            <p className="text-[12px] italic" style={{ color: theme.textTertiary }}>{p.coverage_excerpt}</p>
          )}
          <div className="flex items-center justify-between gap-2 pt-1">
            {p.script_pdf_url ? (
              <button type="button" onClick={handleAccessClick}
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-medium transition-colors group cursor-pointer bg-transparent border-none"
                style={{ color: accessColor }}>
                <AccessIcon className="w-3 h-3" />
                {accessInfo.label}
                {accessLevel === 'public' && <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />}
              </button>
            ) : null}
            {p.status && (
              <span className="text-[9px] uppercase tracking-widest px-2 py-0.5" style={{ backgroundColor: theme.bgElevated, color: theme.textSecondary, borderRadius: '3px' }}>{p.status}</span>
            )}
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="w-full max-w-sm mx-4 p-6 rounded-xl" style={{ backgroundColor: theme.bgPrimary, border: `1px solid ${theme.borderDefault}` }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold" style={{ color: theme.textPrimary, fontFamily: theme.fontDisplay }}>
                <Lock className="inline w-4 h-4 mr-2" style={{ color: '#C9A96E' }} />Password Required
              </h3>
              <button type="button" onClick={() => { setShowPasswordModal(false); setPassword(""); setError(""); }} className="p-1"><X className="w-4 h-4" style={{ color: theme.textTertiary }} /></button>
            </div>
            <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>Enter the password to access "{p.title}"</p>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
              placeholder="Enter password" className="w-full px-3 py-2 rounded-lg text-sm mb-2 outline-none"
              style={{ backgroundColor: theme.bgSecondary, border: `1px solid ${theme.borderDefault}`, color: theme.textPrimary }} autoFocus />
            {error && <p className="text-xs mb-2" style={{ color: '#C41E1E' }}>{error}</p>}
            <button type="button" onClick={handlePasswordSubmit} disabled={verifying} className="w-full py-2 rounded-lg text-sm font-medium transition-opacity"
              style={{ backgroundColor: theme.accentPrimary, color: theme.textOnAccent, opacity: verifying ? 0.7 : 1 }}>
              {verifying ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Unlock Script"}
            </button>
          </div>
        </div>
      )}

      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="w-full max-w-sm mx-4 p-6 rounded-xl" style={{ backgroundColor: theme.bgPrimary, border: `1px solid ${theme.borderDefault}` }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold" style={{ color: theme.textPrimary, fontFamily: theme.fontDisplay }}>
                <Mail className="inline w-4 h-4 mr-2" style={{ color: '#6B9FD4' }} />Access Script
              </h3>
              <button type="button" onClick={() => { setShowEmailModal(false); setEmail(""); setName(""); }} className="p-1"><X className="w-4 h-4" style={{ color: theme.textTertiary }} /></button>
            </div>
            <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>Enter your details to access "{p.title}"</p>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
              className="w-full px-3 py-2 rounded-lg text-sm mb-2 outline-none"
              style={{ backgroundColor: theme.bgSecondary, border: `1px solid ${theme.borderDefault}`, color: theme.textPrimary }} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
              placeholder="your@email.com" className="w-full px-3 py-2 rounded-lg text-sm mb-3 outline-none"
              style={{ backgroundColor: theme.bgSecondary, border: `1px solid ${theme.borderDefault}`, color: theme.textPrimary }} autoFocus />
            <button type="button" onClick={handleEmailSubmit} disabled={verifying || !email.trim()} className="w-full py-2 rounded-lg text-sm font-medium transition-opacity"
              style={{ backgroundColor: theme.accentPrimary, color: theme.textOnAccent, opacity: verifying ? 0.7 : 1 }}>
              {verifying ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Get Access"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SectionScriptLibrary;
