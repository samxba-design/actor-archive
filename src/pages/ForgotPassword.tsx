import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Film } from "lucide-react";

const quotes = [
  { text: "CreativeSlate finally gave my scripts the showcase they deserve.", author: "Maya Chen", role: "Screenwriter" },
  { text: "I booked two roles directly from agents who found my portfolio.", author: "Damon Brooks", role: "Actor" },
  { text: "The best portfolio platform I've seen for the entertainment industry.", author: "Sofia Ortiz", role: "Director" },
];

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const [quoteIdx] = useState(() => Math.floor(Math.random() * quotes.length));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  const q = quotes[quoteIdx];

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 auth-brand-panel items-center justify-center p-12">
        <div className="max-w-md space-y-8 relative z-10">
          <div className="flex items-center gap-2">
            <Film className="w-6 h-6" style={{ color: "hsl(35 30% 72%)" }} />
            <span className="text-xl font-bold text-white">CreativeSlate</span>
          </div>
          <blockquote className="space-y-4">
            <p className="text-lg leading-relaxed italic" style={{ color: "hsl(30 15% 70%)" }}>
              "{q.text}"
            </p>
            <footer>
              <p className="text-sm font-semibold text-white">{q.author}</p>
              <p className="text-xs" style={{ color: "hsl(30 12% 45%)" }}>{q.role}</p>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4" style={{ background: "hsl(345 22% 10%)" }}>
        <div className="w-full max-w-sm space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <Film className="w-5 h-5" style={{ color: "hsl(var(--landing-champagne))" }} />
              <span className="text-lg font-bold" style={{ color: "hsl(var(--landing-fg))" }}>CreativeSlate</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--landing-fg))" }}>Reset password</h1>
            <p className="text-sm" style={{ color: "hsl(var(--landing-muted))" }}>
              {sent ? "Check your email for a reset link." : "Enter your email and we'll send you a reset link."}
            </p>
          </div>

          {!sent && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: "hsl(var(--landing-fg) / 0.8)" }}>Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="border"
                  style={{ borderColor: "hsl(var(--landing-border))", background: "hsl(345 20% 14%)", color: "hsl(var(--landing-fg))" }}
                />
              </div>
              <Button type="submit" className="w-full font-semibold border-0 text-white" disabled={loading}
                style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }}>
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}

          {sent && (
            <div className="text-center">
              <p className="text-sm" style={{ color: "hsl(var(--landing-muted))" }}>
                Didn't receive it? Check your spam folder or{" "}
                <button onClick={() => setSent(false)} className="font-medium hover:underline" style={{ color: "hsl(var(--landing-champagne))" }}>try again</button>.
              </p>
            </div>
          )}

          <p className="text-center text-sm" style={{ color: "hsl(var(--landing-muted))" }}>
            <Link to="/login" className="font-medium hover:underline" style={{ color: "hsl(var(--landing-champagne))" }}>Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
