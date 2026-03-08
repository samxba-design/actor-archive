import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";

interface Props {
  profile: {
    id: string;
    display_name: string | null;
    show_contact_form: boolean | null;
  };
  showContact: boolean;
}

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

const PortfolioFooter = ({ profile, showContact }: Props) => {
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [form, setForm] = useState({ sender_name: "", sender_email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase
      .from("social_links")
      .select("*")
      .eq("profile_id", profile.id)
      .order("display_order")
      .then(({ data }) => setSocialLinks(data || []));
  }, [profile.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sender_name || !form.sender_email || !form.message) return;
    setSending(true);
    await supabase.from("contact_submissions").insert({
      profile_id: profile.id,
      sender_name: form.sender_name,
      sender_email: form.sender_email,
      message: form.message,
    });
    setSending(false);
    setSent(true);
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
                style={{
                  backgroundColor: "hsl(var(--portfolio-bg))",
                  border: "1px solid hsl(var(--portfolio-border))",
                  color: "hsl(var(--portfolio-fg))",
                  borderRadius: "var(--portfolio-radius)",
                }}
              />
              <input
                type="email"
                placeholder="Your email"
                value={form.sender_email}
                onChange={(e) => setForm((f) => ({ ...f, sender_email: e.target.value }))}
                required
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: "hsl(var(--portfolio-bg))",
                  border: "1px solid hsl(var(--portfolio-border))",
                  color: "hsl(var(--portfolio-fg))",
                  borderRadius: "var(--portfolio-radius)",
                }}
              />
              <textarea
                placeholder="Your message"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
                rows={4}
                className="w-full px-3 py-2 rounded text-sm resize-none"
                style={{
                  backgroundColor: "hsl(var(--portfolio-bg))",
                  border: "1px solid hsl(var(--portfolio-border))",
                  color: "hsl(var(--portfolio-fg))",
                  borderRadius: "var(--portfolio-radius)",
                }}
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
          <p className="text-center mb-8 text-sm" style={{ color: "hsl(var(--portfolio-accent))" }}>
            Thank you! Your message has been sent.
          </p>
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
