import { ReactNode, useState } from "react";
import { Film } from "lucide-react";

interface Quote {
  text: string;
  author: string;
  role: string;
}

interface AuthLayoutProps {
  quotes: Quote[];
  children: ReactNode;
}

const AuthLayout = ({ quotes, children }: AuthLayoutProps) => {
  const [quoteIdx] = useState(() => Math.floor(Math.random() * quotes.length));
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
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
            <Film className="w-5 h-5" style={{ color: "hsl(var(--landing-champagne))" }} />
            <span className="text-lg font-bold" style={{ color: "hsl(var(--landing-fg))" }}>CreativeSlate</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
