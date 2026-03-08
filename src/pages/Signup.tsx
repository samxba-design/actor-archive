import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const quotes = [
  { text: "I went from a blank page to a published portfolio in under 10 minutes.", author: "James Park", role: "TV Writer" },
  { text: "Casting directors have complimented how professional my page looks.", author: "Priya Sharma", role: "Actor" },
  { text: "Finally a platform that understands the entertainment industry.", author: "Luca Moretti", role: "Playwright" },
];

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/onboarding" replace />;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin + "/onboarding",
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      setEmailSent(true);
    }
  };

  const handleGoogleSignup = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/onboarding",
    });
    if (result.error) {
      toast({ title: "Signup failed", description: String(result.error), variant: "destructive" });
    }
  };

  return (
    <AuthLayout quotes={quotes}>
      {emailSent ? (
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--landing-accent) / 0.1)" }}>
            <MailCheck className="w-6 h-6" style={{ color: "hsl(var(--landing-champagne))" }} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--landing-fg))" }}>Check your email</h1>
          <p className="text-sm" style={{ color: "hsl(var(--landing-muted))" }}>
            We sent a confirmation link to <strong style={{ color: "hsl(var(--landing-fg))" }}>{email}</strong>. Click it to activate your account and start building your portfolio.
          </p>
          <p className="text-xs" style={{ color: "hsl(var(--landing-muted) / 0.7)" }}>
            Didn't receive it? Check your spam folder or{" "}
            <button onClick={async () => {
              const { error } = await supabase.auth.resend({ type: 'signup', email });
              if (!error) toast({ title: "Email resent", description: "Check your inbox again." });
              else toast({ title: "Error", description: error.message, variant: "destructive" });
            }} className="hover:underline" style={{ color: "hsl(var(--landing-champagne))" }}>resend email</button>
            {" "}or{" "}
            <button onClick={() => setEmailSent(false)} className="hover:underline" style={{ color: "hsl(var(--landing-champagne))" }}>try again</button>.
          </p>
        </div>
      ) : (
        <>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--landing-fg))" }}>Create your portfolio</h1>
            <p className="text-sm" style={{ color: "hsl(var(--landing-muted))" }}>Join CreativeSlate and showcase your work</p>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleSignup} style={{ borderColor: "hsl(var(--landing-border))", color: "hsl(var(--landing-fg))", background: "transparent" }}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" style={{ borderColor: "hsl(var(--landing-border))" }} /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="px-2" style={{ background: "hsl(345 22% 10%)", color: "hsl(var(--landing-muted))" }}>or</span></div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" style={{ color: "hsl(var(--landing-fg) / 0.8)" }}>Full name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Sam Smith" required className="border" style={{ borderColor: "hsl(var(--landing-border))", background: "hsl(345 20% 14%)", color: "hsl(var(--landing-fg))" }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "hsl(var(--landing-fg) / 0.8)" }}>Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="border" style={{ borderColor: "hsl(var(--landing-border))", background: "hsl(345 20% 14%)", color: "hsl(var(--landing-fg))" }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: "hsl(var(--landing-fg) / 0.8)" }}>Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="border" style={{ borderColor: "hsl(var(--landing-border))", background: "hsl(345 20% 14%)", color: "hsl(var(--landing-fg))" }} />
              {password.length > 0 && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => {
                      const strength = password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) ? 4
                        : password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 3
                        : password.length >= 6 ? 2 : 1;
                      const color = i <= strength
                        ? strength >= 4 ? "hsl(140 50% 45%)" : strength >= 3 ? "hsl(48 96% 53%)" : strength >= 2 ? "hsl(30 80% 55%)" : "hsl(0 84% 60%)"
                        : "hsl(var(--landing-border))";
                      return <div key={i} className="h-1 flex-1 rounded-full transition-colors" style={{ backgroundColor: color }} />;
                    })}
                  </div>
                  <p className="text-xs" style={{ color: "hsl(var(--landing-muted))" }}>
                    {password.length < 6 ? "At least 6 characters" : password.length < 8 ? "Try adding uppercase and numbers" : "Strong password ✓"}
                  </p>
                </div>
              )}
            </div>
            <Button type="submit" className="w-full font-semibold border-0 text-white" disabled={loading}
              style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm" style={{ color: "hsl(var(--landing-muted))" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-medium hover:underline" style={{ color: "hsl(var(--landing-champagne))" }}>Sign in</Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
};

export default Signup;
