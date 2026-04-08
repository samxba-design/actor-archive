import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/components/AuthLayout";
import SEOHead from "@/components/SEOHead";

const quotes = [
  { text: "Security matters — take a moment to set a strong password.", author: "CreativeSlate", role: "Platform" },
  { text: "Your portfolio deserves the best protection.", author: "CreativeSlate", role: "Platform" },
];

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      setReady(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated", description: "You can now sign in with your new password." });
      navigate("/login");
    }
  };

  if (!ready) {
    return (
      <>
        <SEOHead title="Reset Password" description="Set a new password for your CreativeSlate account." path="/reset-password" noIndex />
        <AuthLayout quotes={quotes}>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--landing-fg))" }}>Invalid link</h1>
            <p className="text-sm" style={{ color: "hsl(var(--landing-muted))" }}>This reset link is invalid or has expired.</p>
          </div>
        </AuthLayout>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Reset Password" description="Set a new password for your CreativeSlate account." path="/reset-password" noIndex />
      <AuthLayout quotes={quotes}>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--landing-fg))" }}>Set new password</h1>
          <p className="text-sm" style={{ color: "hsl(var(--landing-muted))" }}>Enter your new password below.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: "hsl(var(--landing-fg) / 0.8)" }}>New password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="border"
              style={{ borderColor: "hsl(var(--landing-border))", background: "hsl(345 20% 14%)", color: "hsl(var(--landing-fg))" }}
            />
          </div>
          <Button
            type="submit"
            className="w-full font-semibold border-0 text-white"
            disabled={loading}
            style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }}
          >
            {loading ? "Updating..." : "Update password"}
          </Button>
        </form>
      </AuthLayout>
    </>
  );
};

export default ResetPassword;
