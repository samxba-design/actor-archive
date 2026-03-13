import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Diamond, Menu, Pen, Mic2, PenTool, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MarketingNavProps {
  glassMode?: boolean;
  onToggleGlass?: () => void;
  showGlassToggle?: boolean;
}

export default function MarketingNav({ glassMode, onToggleGlass, showGlassToggle = false }: MarketingNavProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="relative z-50 border-b glass-nav" style={{ borderColor: "hsl(var(--landing-border))", background: "hsl(var(--landing-bg) / 0.85)", backdropFilter: "blur(12px)" }}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tight" style={{ color: "hsl(var(--landing-fg))" }}>CreativeSlate</Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hover:bg-white/10" style={{ color: "hsl(var(--landing-fg) / 0.7)" }}>
            <Link to="/how-it-works">How It Works</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="hover:bg-white/10" style={{ color: "hsl(var(--landing-fg) / 0.7)" }}>
            <Link to="/pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="hover:bg-white/10" style={{ color: "hsl(var(--landing-fg) / 0.7)" }}>
            <Link to="/faq">FAQ</Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-white/10 gap-1" style={{ color: "hsl(var(--landing-fg) / 0.7)" }}>
                Demos <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="min-w-[180px]" style={{ background: "hsl(var(--landing-bg))", borderColor: "hsl(var(--landing-border))" }}>
              <DropdownMenuItem asChild className="cursor-pointer gap-2" style={{ color: "hsl(var(--landing-fg))" }}>
                <Link to="/demo/screenwriter"><Pen className="h-3.5 w-3.5" /> Screenwriter</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer gap-2" style={{ color: "hsl(var(--landing-fg))" }}>
                <Link to="/demo/actor"><Mic2 className="h-3.5 w-3.5" /> Actor</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer gap-2" style={{ color: "hsl(var(--landing-fg))" }}>
                <Link to="/demo/copywriter"><PenTool className="h-3.5 w-3.5" /> Copywriter</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {showGlassToggle && onToggleGlass && (
            <button onClick={onToggleGlass}
              className="glass-toggle h-8 w-8 rounded-lg flex items-center justify-center transition-colors"
              style={{
                background: glassMode ? "hsl(var(--landing-accent) / 0.15)" : "transparent",
                color: glassMode ? "hsl(var(--landing-champagne))" : "hsl(var(--landing-muted))",
                border: "1px solid hsl(var(--landing-border))",
              }}
              title={glassMode ? "Switch to solid mode" : "Switch to glass mode"}>
              <Diamond className="h-3.5 w-3.5" />
            </button>
          )}
          {user ? (
            <Button size="sm" asChild className="font-semibold border-0 text-white"
              style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }}>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hover:bg-white/10" style={{ color: "hsl(var(--landing-fg) / 0.7)" }}>
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild className="font-semibold border-0 text-white"
                style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }}>
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          {showGlassToggle && onToggleGlass && (
            <button onClick={onToggleGlass}
              className="glass-toggle h-8 w-8 rounded-lg flex items-center justify-center transition-colors"
              style={{
                background: glassMode ? "hsl(var(--landing-accent) / 0.15)" : "transparent",
                color: glassMode ? "hsl(var(--landing-champagne))" : "hsl(var(--landing-muted))",
                border: "1px solid hsl(var(--landing-border))",
              }}>
              <Diamond className="h-3.5 w-3.5" />
            </button>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ color: "hsl(var(--landing-fg))", border: "1px solid hsl(var(--landing-border))" }}>
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-l" style={{ background: "hsl(var(--landing-bg))", borderColor: "hsl(var(--landing-border))" }}>
              <div className="flex flex-col gap-4 mt-8">
                <Link to="/how-it-works" onClick={() => setOpen(false)} className="text-base font-medium px-2 py-2 rounded-lg transition-colors" style={{ color: "hsl(var(--landing-fg) / 0.8)" }}>
                  How It Works
                </Link>
                <Link to="/pricing" onClick={() => setOpen(false)} className="text-base font-medium px-2 py-2 rounded-lg transition-colors" style={{ color: "hsl(var(--landing-fg) / 0.8)" }}>
                  Pricing
                </Link>
                <Link to="/demo/screenwriter" onClick={() => setOpen(false)} className="text-base font-medium px-2 py-2 rounded-lg transition-colors" style={{ color: "hsl(var(--landing-fg) / 0.8)" }}>
                  Demos
                </Link>
                <div className="pl-4 flex flex-col gap-1">
                  <Link to="/demo/screenwriter" onClick={() => setOpen(false)} className="text-sm px-2 py-1.5 rounded-lg transition-colors" style={{ color: "hsl(var(--landing-muted))" }}>Screenwriter</Link>
                  <Link to="/demo/actor" onClick={() => setOpen(false)} className="text-sm px-2 py-1.5 rounded-lg transition-colors" style={{ color: "hsl(var(--landing-muted))" }}>Actor</Link>
                  <Link to="/demo/copywriter" onClick={() => setOpen(false)} className="text-sm px-2 py-1.5 rounded-lg transition-colors" style={{ color: "hsl(var(--landing-muted))" }}>Copywriter</Link>
                </div>
                <div className="border-t my-2" style={{ borderColor: "hsl(var(--landing-border))" }} />
                <Link to="/login" onClick={() => setOpen(false)} className="text-base font-medium px-2 py-2 rounded-lg transition-colors" style={{ color: "hsl(var(--landing-fg) / 0.8)" }}>
                  Log in
                </Link>
                <Button asChild className="font-semibold border-0 text-white mt-2"
                  style={{ background: "linear-gradient(135deg, hsl(var(--landing-accent)), hsl(var(--landing-accent-warm)))" }}>
                  <Link to="/signup" onClick={() => setOpen(false)}>Get Started</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
