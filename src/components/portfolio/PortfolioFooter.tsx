import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";

interface Props {
  profile: {
    id: string;
    display_name: string | null;
    show_contact_form: boolean | null;
    auto_responder_enabled?: boolean | null;
    auto_responder_message?: string | null;
  };
  showContact: boolean;
  socialLinks?: any[];
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
  imdb: "🎬",
  instagram: "📸",
  twitter: "𝕏",
  x: "𝕏",
  linkedin: "in",
  youtube: "▶",
  vimeo: "▷",
  tiktok: "♪",
  website: "🌐",
  spotlight: "★",
};

const PortfolioFooter = ({ profile, showContact, socialLinks: socialLinksProp }: Props) => {
  const [fetchedLinks, setFetchedLinks] = useState<any[]>([]);
  const [form, setForm] = useState({ sender_name: "", sender_email: "", subject_type: "general", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const socialLinks = socialLinksProp || fetchedLinks;

  useEffect(() => {
    if (socialLinksProp) return;
    supabase
      .from("social_links")
      .select("*")
      .eq("profile_id", profile.id)
      .order("display_order")
      .then(({ data }) => setFetchedLinks(data || []));
  }, [profile.id, socialLinksProp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sender_name || !form.sender_email || !form.message) return;
    setSending(true);
    await supabase.from("contact_submissions").insert({
      profile_id: profile.id,
      sender_name: form.sender_name,
      sender_email: form.sender_email,
      subject_type: form.subject_type as any,
      message: form.message,
    });
    setSending(false);
    setSent(true);
  };

  const inputStyle = {
    backgroundColor: "hsl(var(--portfolio-bg))",
    border: "1px solid hsl(var(--portfolio-border))",
    color: "hsl(var(--portfolio-fg))",
    borderRadius: "var(--portfolio-radius)",
  };

  return (
    <footer
      id="contact-section"
      className="mt-16 py-12 px-4"
      style={{
        backgroundColor: "hsl(var(--portfolio-muted))",
        borderTop: "1px solid hsl(var(--portfolio-border))",
      }}
    >
      <div className="max-w-5xl mx-auto">
        {showContact && !sent && (
          <div className="mb-12 max-w-lg mx-auto">
            <h3
              className="text-xl font-bold mb-4 text-center"
              style={{ fontFamily: "var(--portfolio-heading-font)" }}
            >
              Get in Touch
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={form.sender_name}
                onChange={(e) => setForm((f) => ({ ...f, sender_name: e.target.value }))}
                required
                className="w-full px-3 py-2 rounded text-sm"
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Your email"
                value={form.sender_email}
                onChange={(e) => setForm((f) => ({ ...f, sender_email: e.target.value }))}
                required
                className="w-full px-3 py-2 rounded text-sm"
                style={inputStyle}
              />
              <select
                value={form.subject_type}
                onChange={(e) => setForm((f) => ({ ...f, subject_type: e.target.value }))}
                className="w-full px-3 py-2 rounded text-sm"
                style={inputStyle}
              >
                {SUBJECT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <textarea
                placeholder="Your message"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
                rows={4}
                className="w-full px-3 py-2 rounded text-sm resize-none"
                style={inputStyle}
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-all hover:shadow-md"
                style={{
                  backgroundColor: "hsl(var(--portfolio-accent))",
                  color: "hsl(var(--portfolio-accent-fg))",
                  borderRadius: "var(--portfolio-radius)",
                  opacity: sending ? 0.6 : 1,
                }}
              >
                <Send className="w-4 h-4" />
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        )}

        {sent && (
          <div className="text-center mb-8">
            <p className="text-sm mb-2" style={{ color: "hsl(var(--portfolio-accent))" }}>
              Thank you! Your message has been sent.
            </p>
            {profile.auto_responder_enabled && profile.auto_responder_message && (
              <p className="text-sm max-w-md mx-auto" style={{ color: "hsl(var(--portfolio-muted-fg))" }}>
                {profile.auto_responder_message}
              </p>
            )}
          </div>
        )}

        {socialLinks.length > 0 && (
          <div className="flex justify-center flex-wrap gap-3 mb-6">
            {socialLinks.map((link) => {
              const icon = platformIcons[link.platform?.toLowerCase()] || "🔗";
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
                  style={{
                    backgroundColor: "hsl(var(--portfolio-card))",
                    color: "hsl(var(--portfolio-muted-fg))",
                    border: "1px solid hsl(var(--portfolio-border))",
                  }}
                >
                  <span>{icon}</span>
                  {link.label || link.platform}
                </a>
              );
            })}
          </div>
        )}

        <div className="text-center space-y-1">
          <p
            className="text-xs"
            style={{ color: "hsl(var(--portfolio-muted-fg) / 0.6)" }}
          >
            © {new Date().getFullYear()} {profile.display_name}
          </p>
          <p className="text-[10px]" style={{ color: "hsl(var(--portfolio-muted-fg) / 0.3)" }}>
            Powered by <a href="/" className="hover:underline">CreativeSlate</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
