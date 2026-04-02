import { useNavigate, useLocation } from "react-router-dom";
import { Pen, Mic2, PenTool } from "lucide-react";

const DEMO_PROFILES = [
  { id: 'screenwriter', label: 'Screenwriter', icon: Pen, path: '/demo/screenwriter' },
  { id: 'actor', label: 'Actor', icon: Mic2, path: '/demo/actor' },
  { id: 'copywriter', label: 'Copywriter', icon: PenTool, path: '/demo/copywriter' },
] as const;

const DemoProfileTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentType = DEMO_PROFILES.find(p => location.pathname.startsWith(p.path))?.id || 'screenwriter';

  return (
    <div
      className="py-2.5 px-4 relative z-20 border-b"
      style={{
        backgroundColor: 'rgba(0,0,0,0.28)',
        backdropFilter: 'blur(14px)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <div className="max-w-[1080px] mx-auto flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.72)' }}>
          Explore Demo Profiles
        </p>
        <div className="flex items-center gap-1.5 rounded-full p-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {DEMO_PROFILES.map(p => {
            const isActive = currentType === p.id;
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => navigate(p.path)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
                  color: 'rgba(255,255,255,0.95)',
                  border: isActive ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
                  boxShadow: isActive ? '0 6px 20px rgba(0,0,0,0.22)' : 'none',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-3 h-3" />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DemoProfileTabs;
