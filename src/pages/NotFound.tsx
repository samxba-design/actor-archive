import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Film } from "lucide-react";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: "hsl(var(--landing-bg))", color: "hsl(var(--landing-fg))" }}>
      <MarketingNav />

      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, hsl(var(--landing-accent) / 0.08) 0%, transparent 70%)" }} />

        <div className="relative text-center space-y-6 px-6">
          <h1 className="text-7xl sm:text-9xl font-bold tracking-tighter text-gradient-gold">404</h1>
          <p className="text-lg max-w-md mx-auto" style={{ color: "hsl(var(--landing-muted))" }}>
            This scene didn't make the final cut. The page you're looking for doesn't exist.
          </p>

          <Button size="lg" asChild className="font-semibold border-0 text-white"
            style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }}>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
};

export default NotFound;
