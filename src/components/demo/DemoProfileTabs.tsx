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
    <div className="flex justify-center gap-1.5 py-2 px-4 relative z-20"
      style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(12px)' }}>
      {DEMO_PROFILES.map(p => {
        const isActive = currentType === p.id;
        const Icon = p.icon;
        return (
          <button
            key={p.id}
            onClick={() => navigate(p.path)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
            style={{
              background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
              border: isActive ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
            }}
          >
            <Icon className="w-3 h-3" />
            {p.label}
          </button>
        );
      })}
    </div>
  );
};

export default DemoProfileTabs;
