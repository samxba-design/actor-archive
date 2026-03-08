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
import { Film, MailCheck } from "lucide-react";

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
  const [quoteIdx] = useState(() => Math.floor(Math.random() * quotes.length));

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
      <div className="flex-1 flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-6 animate-fade-in">
          {emailSent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MailCheck className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Check your email</h1>
              <p className="text-sm text-muted-foreground">
                We sent a confirmation link to <strong className="text-foreground">{email}</strong>. Click it to activate your account and start building your portfolio.
              </p>
              <p className="text-xs text-muted-foreground">
                Didn't receive it? Check your spam folder or{" "}
                <button onClick={() => setEmailSent(false)} className="text-primary hover:underline">try again</button>.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center space-y-2">
                <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
                  <Film className="w-5 h-5 text-primary" />
                  <span className="text-lg font-bold text-foreground">CreativeSlate</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your portfolio</h1>
                <p className="text-sm text-muted-foreground">Join CreativeSlate and showcase your work</p>
              </div>

              <Button variant="outline" className="w-full" onClick={handleGoogleSignup}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">or</span></div>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Sam Smith" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-foreground hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
