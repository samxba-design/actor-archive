import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const TestimonialRequest = () => {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<{ id: string; display_name: string | null; profile_photo_url: string | null } | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    author_name: "",
    author_role: "",
    author_company: "",
    quote: "",
  });

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("profiles")
      .select("id, display_name, profile_photo_url")
      .eq("slug", slug)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setProfile(data);
        setLoading(false);
      });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (form.author_name.trim() === "") return;
    if (form.quote.trim().length < 20) {
      setError("Please write at least 20 characters for your testimonial.");
      return;
    }
    setError(null);
    setSubmitting(true);
    const { error: insertError } = await supabase.from("testimonials").insert({
      profile_id: profile.id,
      author_name: form.author_name.trim(),
      author_role: form.author_role.trim() || null,
      author_company: form.author_company.trim() || null,
      quote: form.quote.trim(),
      status: "pending",
    } as any);
    if (insertError) {
      setError(insertError.message);
    } else {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "hsl(var(--landing-bg))" }}
      >
        <Loader2
          className="animate-spin h-8 w-8"
          style={{ color: "hsl(var(--landing-accent))" }}
        />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "hsl(var(--landing-bg))", color: "hsl(var(--landing-fg))" }}
      >
        <h1 className="text-3xl font-bold">Profile not found</h1>
        <p style={{ color: "hsl(var(--landing-fg) / 0.6)" }}>
          This testimonial link is invalid or has expired.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
        style={{ background: "hsl(var(--landing-bg))", color: "hsl(var(--landing-fg))" }}
      >
        <CheckCircle2
          className="h-20 w-20"
          style={{ color: "hsl(var(--landing-accent))" }}
        />
        <h1 className="text-3xl font-bold">Thank you!</h1>
        <p
          className="text-lg text-center"
          style={{ color: "hsl(var(--landing-fg) / 0.7)" }}
        >
          Your testimonial has been submitted for review.
        </p>
      </div>
    );
  }

  const initials = getInitials(profile.display_name);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ background: "hsl(var(--landing-bg))", color: "hsl(var(--landing-fg))" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-8 space-y-6"
        style={{
          background: "hsl(var(--landing-card))",
          border: "1px solid hsl(var(--landing-border))",
        }}
      >
        {/* Profile header */}
        <div className="flex flex-col items-center gap-3 text-center">
          {profile.profile_photo_url ? (
            <img
              src={profile.profile_photo_url}
              alt={profile.display_name || ""}
              className="w-20 h-20 rounded-full object-cover"
              style={{ border: "2px solid hsl(var(--landing-accent) / 0.4)" }}
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: "hsl(var(--landing-accent) / 0.3)" }}
            >
              {initials}
            </div>
          )}
          <h1 className="text-2xl font-bold" style={{ color: "hsl(var(--landing-fg))" }}>
            Write a testimonial for{" "}
            <span style={{ color: "hsl(var(--landing-accent))" }}>
              {profile.display_name || "this creative"}
            </span>
          </h1>
          <p className="text-sm" style={{ color: "hsl(var(--landing-fg) / 0.6)" }}>
            Your testimonial will be reviewed before it appears publicly.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quote */}
          <div className="space-y-1.5">
            <label
              className="text-sm font-medium"
              style={{ color: "hsl(var(--landing-fg) / 0.8)" }}
            >
              Your testimonial <span style={{ color: "hsl(var(--landing-accent))" }}>*</span>
            </label>
            <textarea
              required
              minLength={20}
              rows={4}
              placeholder="Share your experience working with them..."
              value={form.quote}
              onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
              className="w-full text-sm px-3 py-2.5 rounded-lg outline-none resize-none transition-all"
              style={{
                background: "hsl(var(--landing-bg))",
                border: "1px solid hsl(var(--landing-border))",
                color: "hsl(var(--landing-fg))",
              }}
            />
            <p
              className="text-xs"
              style={{ color: form.quote.length < 20 ? "hsl(var(--landing-fg) / 0.4)" : "hsl(var(--landing-accent))" }}
            >
              {form.quote.length}/20 minimum characters
            </p>
          </div>

          {/* Author name */}
          <div className="space-y-1.5">
            <label
              className="text-sm font-medium"
              style={{ color: "hsl(var(--landing-fg) / 0.8)" }}
            >
              Your name <span style={{ color: "hsl(var(--landing-accent))" }}>*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Jane Smith"
              value={form.author_name}
              onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
              className="w-full text-sm px-3 py-2.5 rounded-lg outline-none transition-all"
              style={{
                background: "hsl(var(--landing-bg))",
                border: "1px solid hsl(var(--landing-border))",
                color: "hsl(var(--landing-fg))",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Role */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium"
                style={{ color: "hsl(var(--landing-fg) / 0.8)" }}
              >
                Your role
              </label>
              <input
                type="text"
                placeholder="Your role or job title"
                value={form.author_role}
                onChange={(e) => setForm((f) => ({ ...f, author_role: e.target.value }))}
                className="w-full text-sm px-3 py-2.5 rounded-lg outline-none transition-all"
                style={{
                  background: "hsl(var(--landing-bg))",
                  border: "1px solid hsl(var(--landing-border))",
                  color: "hsl(var(--landing-fg))",
                }}
              />
            </div>

            {/* Company */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium"
                style={{ color: "hsl(var(--landing-fg) / 0.8)" }}
              >
                Company
              </label>
              <input
                type="text"
                placeholder="Company or production"
                value={form.author_company}
                onChange={(e) => setForm((f) => ({ ...f, author_company: e.target.value }))}
                className="w-full text-sm px-3 py-2.5 rounded-lg outline-none transition-all"
                style={{
                  background: "hsl(var(--landing-bg))",
                  border: "1px solid hsl(var(--landing-border))",
                  color: "hsl(var(--landing-fg))",
                }}
              />
            </div>
          </div>

          {error && (
            <p
              className="text-sm rounded-lg px-3 py-2"
              style={{
                color: "#ef4444",
                background: "#ef444420",
                border: "1px solid #ef444440",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || form.author_name.trim() === "" || form.quote.trim().length < 20}
            className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: "hsl(var(--landing-accent))" }}
          >
            {submitting && <Loader2 className="animate-spin h-4 w-4" />}
            {submitting ? "Submitting..." : "Submit Testimonial"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestimonialRequest;
