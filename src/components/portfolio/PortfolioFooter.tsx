import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Send, Loader2, CheckCircle, Phone, Mail, Building2 } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface RepInfo {
  id: string;
  rep_type: string;
  name: string | null;
  company: string | null;
  department: string | null;
  is_primary: boolean | null;
}

interface Props {
  profile: {
    id: string;
    display_name: string | null;
    show_contact_form: boolean | null;
    auto_responder_enabled?: boolean | null;
    auto_responder_message?: string | null;
    subscription_tier?: string | null;
    contact_mode?: string | null;
  };
  showContact: boolean;
  socialLinks?: any[];
  representation?: RepInfo[];
}

const SUBJECT_OPTIONS = [
  { value: "general", label: "General Inquiry" },
  { value: "script_request", label: "Script Request" },
  { value: "commission", label: "Commission" },
  { value: "meeting", label: "Meeting Request" },
  { value: "press", label: "Press / Interview" },
  { value: "representation", label: "Representation" },
  { value: "casting", label: "Casting" },
  { value: "rights_enquiry", label: "Rights Enquiry" },
  { value: "quote_request", label: "Quote Request" },
  { value: "booking", label: "Booking" },
];

const platformIcons: Record<string, string> = {
  imdb: "🎬", instagram: "📸", twitter: "𝕏", x: "𝕏",
  linkedin: "in", youtube: "▶", vimeo: "▷", tiktok: "♪",
  website: "🌐", spotlight: "★",
};

const PortfolioFooter = ({ profile, showContact, socialLinks: socialLinksProp, representation }: Props) => {
  const theme = usePortfolioTheme();
  const [fetchedLinks, setFetchedLinks] = useState<any[]>([]);
  const [fetchedReps, setFetchedReps] = useState<RepInfo[]>([]);
  const [form, setForm] = useState({ sender_name: "", sender_email: "", subject_type: "general", message: "", website: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  // Enhanced rate limiting: max 3 submissions per 5 minutes via sessionStorage
  const RATE_LIMIT_KEY = "cs_contact_timestamps";
  const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
  const RATE_LIMIT_MAX = 3;

  const isRateLimited = (): boolean => {
    try {
      const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
      const timestamps: number[] = raw ? JSON.parse(raw) : [];
      const now = Date.now();
      const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
      return recent.length >= RATE_LIMIT_MAX;
    } catch { return false; }
  };

  const recordSubmission = () => {
    try {
      const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
      const timestamps: number[] = raw ? JSON.parse(raw) : [];
      const now = Date.now();
      const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
      recent.push(now);
      sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
    } catch {}
  };

  const socialLinks = socialLinksProp || fetchedLinks;
  const contactMode = profile.contact_mode || "form";
  const showForm = contactMode === "form" || contactMode === "both";
  const showAgent = contactMode === "agent" || contactMode === "both";
  const reps = representation || fetchedReps;

  useEffect(() => {
    if (socialLinksProp) return;
    supabase.from("social_links").select("*").eq("profile_id", profile.id).order("display_order")
      .then(({ data }) => setFetchedLinks(data || []));
  }, [profile.id, socialLinksProp]);

  // Fetch representation if needed for agent routing
  useEffect(() => {
    if (representation || !showAgent) return;
    supabase.from("representation")
      .select("id,rep_type,name,company,department,is_primary")
      .eq("profile_id", profile.id)
      .order("display_order")
      .then(({ data }) => setFetchedReps((data as any) || []));
  }, [profile.id, representation, showAgent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sender_name || !form.sender_email || !form.message) return;
    // Honeypot check
    if (form.website) return;
    // Rate limit check
    if (isRateLimited()) {
      setRateLimited(true);
      setTimeout(() => setRateLimited(false), 5000);
      return;
    }
    recordSubmission();
    setSending(true);
    await supabase.from("contact_submissions").insert({
      profile_id: profile.id,
      sender_name: form.sender_name,
      sender_email: form.sender_email,
      subject_type: form.subject_type as Database["public"]["Enums"]["contact_subject_type"],
      message: form.message,
    });
    supabase.functions.invoke("contact-notify", {
      body: {
        profile_id: profile.id,
        sender_name: form.sender_name,
        sender_email: form.sender_email,
        subject_type: form.subject_type,
        message: form.message,
      },
    }).catch(() => {});
    setSending(false);
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.borderDefault}`,
    color: theme.textPrimary,
    borderRadius: theme.cardRadius,
  };

  const shouldShowContact = showContact && contactMode !== "none";

  return (
    <footer id="contact-section" className="mt-16 py-12 px-4" style={{ borderTop: `1px solid ${theme.borderDefault}` }} role="contentinfo" aria-label="Portfolio footer">
      <div className="max-w-[1080px] mx-auto">

        {/* Agent/Rep info */}
        {shouldShowContact && showAgent && reps.length > 0 && (
          <div className="mb-12 max-w-lg mx-auto">
            <h3 className="text-xl font-bold mb-4 text-center" style={{ fontFamily: theme.fontDisplay, fontWeight: theme.headingWeight, color: theme.textPrimary }}>
              {contactMode === "agent" ? "Contact via Representation" : "Representation"}
            </h3>
            <div className="space-y-3">
              {reps.map(rep => (
                <div key={rep.id} className="p-4 rounded-lg" style={{ backgroundColor: theme.bgSecondary, border: `1px solid ${theme.borderDefault}`, borderRadius: theme.cardRadius }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4" style={{ color: theme.accentPrimary }} />
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.accentPrimary }}>
                      {rep.rep_type}
                    </span>
                    {rep.is_primary && (
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ backgroundColor: theme.accentSubtle, color: theme.accentPrimary }}>
                        Primary
                      </span>
                    )}
                  </div>
                  {rep.company && (
                    <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{rep.company}</p>
                  )}
                  {rep.name && (
                    <p className="text-sm" style={{ color: theme.textSecondary }}>{rep.name}{rep.department ? ` · ${rep.department}` : ''}</p>
                  )}
                  <p className="text-xs mt-2" style={{ color: theme.textTertiary }}>
                    For all enquiries, please contact through representation.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact form */}
        {shouldShowContact && showForm && !sent && (
          <div className="mb-12 max-w-lg mx-auto">
            <h3 className="text-xl font-bold mb-4 text-center" style={{ fontFamily: theme.fontDisplay, fontWeight: theme.headingWeight, color: theme.textPrimary }}>
              Get in Touch
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3" aria-label="Contact form">
              <div className="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
                <label htmlFor="contact-website">Website</label>
                <input id="contact-website" type="text" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} tabIndex={-1} autoComplete="off" />
              </div>
              <label className="sr-only" htmlFor="contact-name">Your name</label>
              <input id="contact-name" type="text" placeholder="Your name" value={form.sender_name} onChange={e => setForm(f => ({ ...f, sender_name: e.target.value }))} required className="w-full px-3 py-2 text-sm" style={inputStyle} />
              <label className="sr-only" htmlFor="contact-email">Your email</label>
              <input id="contact-email" type="email" placeholder="Your email" value={form.sender_email} onChange={e => setForm(f => ({ ...f, sender_email: e.target.value }))} required className="w-full px-3 py-2 text-sm" style={inputStyle} />
              <label className="sr-only" htmlFor="contact-subject">Subject</label>
              <select id="contact-subject" value={form.subject_type} onChange={e => setForm(f => ({ ...f, subject_type: e.target.value }))} className="w-full px-3 py-2 text-sm" style={inputStyle}>
                {SUBJECT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <label className="sr-only" htmlFor="contact-message">Your message</label>
              <textarea id="contact-message" placeholder="Your message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={4} className="w-full px-3 py-2 text-sm resize-none" style={inputStyle} />
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-all"
                style={{
                  border: `1px solid ${theme.accentPrimary}`,
                  backgroundColor: 'transparent',
                  color: theme.accentPrimary,
                  borderRadius: theme.ctaRadius,
                  opacity: sending ? 0.6 : 1,
                }}
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {sending ? "Sending..." : "Send Message"}
              </button>
              {rateLimited && (
                <p className="text-xs text-center" style={{ color: theme.accentPrimary }}>
                  Too many submissions. Please wait a few minutes before trying again.
                </p>
              )}
            </form>
          </div>
        )}

        {sent && (
          <div className="text-center mb-8 py-8 space-y-3 animate-fade-in">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center animate-contact-success" style={{ backgroundColor: `${theme.accentPrimary}15` }}>
              <CheckCircle className="w-8 h-8" style={{ color: theme.accentPrimary }} />
            </div>
            <p className="text-lg font-semibold" style={{ color: theme.textPrimary, fontFamily: theme.fontDisplay }}>Message sent!</p>
            <p className="text-sm" style={{ color: theme.textSecondary }}>Thank you for reaching out. You'll hear back soon.</p>
            {profile.auto_responder_enabled && profile.auto_responder_message && (
              <p className="text-sm max-w-md mx-auto mt-2 px-4 py-3 rounded-xl" style={{ color: theme.textSecondary, backgroundColor: `${theme.accentPrimary}10`, border: `1px solid ${theme.accentPrimary}20` }}>{profile.auto_responder_message}</p>
            )}
            <button
              onClick={() => { setSent(false); setForm({ sender_name: "", sender_email: "", subject_type: "general", message: "", website: "" }); }}
              className="mt-4 text-xs font-medium transition-colors hover:underline"
              style={{ color: theme.accentPrimary }}
            >
              Send another message
            </button>
          </div>
        )}

        {/* Footer bottom */}
        <div className="pt-8" style={{ borderTop: `1px solid ${theme.borderDefault}` }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm" style={{ color: theme.textTertiary }}>{profile.display_name}</p>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map(link => {
                  const icon = platformIcons[link.platform?.toLowerCase()] || "🔗";
                  return (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                      className="text-sm transition-colors" style={{ color: theme.textTertiary }}
                      onMouseEnter={e => (e.currentTarget.style.color = theme.accentPrimary)}
                      onMouseLeave={e => (e.currentTarget.style.color = theme.textTertiary)}>
                      {icon}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-xs" style={{ color: theme.textTertiary }}>© {new Date().getFullYear()} {profile.display_name}. All rights reserved.</p>
            {(!profile.subscription_tier || profile.subscription_tier === "free") && (
              <p className="text-[10px]" style={{ color: `${theme.textTertiary}80` }}>
                Powered by <a href="/" className="hover:underline">CreativeSlate</a>
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
