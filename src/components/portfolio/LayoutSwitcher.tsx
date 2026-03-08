import { useState } from "react";
import { LayoutGrid, ChevronUp, ChevronDown } from "lucide-react";

export type LayoutPreset =
  | 'classic'
  | 'standard'
  | 'cinematic'
  | 'compact'
  | 'magazine'
  | 'spotlight'
  | 'timeline'
  | 'bento'
  | 'minimal'
  | 'dashboard';

interface LayoutDef {
  id: LayoutPreset;
  name: string;
  description: string;
}

const LAYOUT_PRESETS: LayoutDef[] = [
  { id: 'classic', name: 'Classic', description: 'Traditional vertical stack, full-width sections' },
  { id: 'standard', name: 'Standard', description: 'Dense grid with sidebar modules' },
  { id: 'cinematic', name: 'Cinematic', description: 'Full-width hero credits, poster gallery' },
  { id: 'compact', name: 'Compact', description: 'Maximum information density' },
  { id: 'magazine', name: 'Magazine', description: 'Editorial two-column with sidebar' },
  { id: 'spotlight', name: 'Spotlight', description: 'Accordion sections, one at a time' },
  { id: 'timeline', name: 'Timeline', description: 'Chronological vertical flow' },
  { id: 'bento', name: 'Bento', description: 'Asymmetric grid tiles' },
  { id: 'minimal', name: 'Minimal', description: 'Essential info only, lots of whitespace' },
  { id: 'dashboard', name: 'Dashboard', description: 'Stats-forward, data-rich cards' },
];

interface Props {
  currentLayout: LayoutPreset;
  onLayoutChange: (layout: LayoutPreset) => void;
}

const LayoutSwitcher = ({ currentLayout, onLayoutChange }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const current = LAYOUT_PRESETS.find(l => l.id === currentLayout);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {expanded && (
        <div
          className="mb-3 p-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{
            backgroundColor: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            minWidth: '260px',
          }}
        >
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3 font-medium">Page Layout</p>
          <div className="space-y-1 max-h-[360px] overflow-y-auto">
            {LAYOUT_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => { onLayoutChange(preset.id); setExpanded(false); }}
                className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-all text-left group"
                style={{ backgroundColor: preset.id === currentLayout ? 'rgba(255,255,255,0.1)' : 'transparent' }}
              >
                <LayoutMiniPreview layout={preset.id} isActive={preset.id === currentLayout} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-white/90">{preset.name}</p>
                  <p className="text-[10px] text-white/40 leading-tight">{preset.description}</p>
                </div>
                {preset.id === currentLayout && <div className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-xl transition-all hover:scale-105"
        style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        <LayoutGrid className="w-3.5 h-3.5 text-white/50" />
        <span className="text-[11px] font-medium text-white/70">{current?.name || 'Layout'}</span>
        {expanded ? <ChevronDown className="w-3 h-3 text-white/40" /> : <ChevronUp className="w-3 h-3 text-white/40" />}
      </button>
    </div>
  );
};

/* Mini grid previews */
const LayoutMiniPreview = ({ layout, isActive }: { layout: LayoutPreset; isActive?: boolean }) => {
  const a = isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)';
  const b = isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)';
  const w = 'w-10 h-7 shrink-0';

  const layouts: Record<LayoutPreset, React.ReactNode> = {
    classic: (
      <div className={`${w} flex flex-col gap-[2px]`}>
        <div className="h-2 rounded-[1px]" style={{ backgroundColor: a }} />
        <div className="flex-1 rounded-[1px]" style={{ backgroundColor: b }} />
        <div className="flex-1 rounded-[1px]" style={{ backgroundColor: b }} />
        <div className="h-1.5 rounded-[1px]" style={{ backgroundColor: b }} />
      </div>
    ),
    standard: (
      <div className={`${w} flex flex-col gap-[2px]`}>
        <div className="flex gap-[2px] flex-1">
          <div className="flex-1 rounded-[1px]" style={{ backgroundColor: a }} />
          <div className="w-2.5 rounded-[1px]" style={{ backgroundColor: b }} />
        </div>
        <div className="h-1.5 rounded-[1px]" style={{ backgroundColor: b }} />
        <div className="flex gap-[2px] flex-1">
          <div className="flex-1 rounded-[1px]" style={{ backgroundColor: b }} />
          <div className="w-3 rounded-[1px]" style={{ backgroundColor: b }} />
        </div>
      </div>
    ),
    cinematic: (
      <div className={`${w} flex flex-col gap-[2px]`}>
        <div className="h-2.5 rounded-[1px]" style={{ backgroundColor: a }} />
        <div className="flex gap-[2px] flex-1">
          {[0,1,2,3].map(i => <div key={i} className="flex-1 rounded-[1px]" style={{ backgroundColor: b }} />)}
        </div>
        <div className="h-1 rounded-[1px]" style={{ backgroundColor: b }} />
      </div>
    ),
    compact: (
      <div className={`${w} flex flex-col gap-[1px]`}>
        {[0,1,2,3,4].map(i => (
          <div key={i} className="flex gap-[1px] flex-1">
            <div className="flex-1 rounded-[1px]" style={{ backgroundColor: i === 0 ? a : b }} />
            <div className="flex-1 rounded-[1px]" style={{ backgroundColor: b }} />
          </div>
        ))}
      </div>
    ),
    magazine: (
      <div className={`${w} flex gap-[2px]`}>
        <div className="flex-1 flex flex-col gap-[2px]">
          <div className="flex-1 rounded-[1px]" style={{ backgroundColor: a }} />
          <div className="h-1.5 rounded-[1px]" style={{ backgroundColor: b }} />
          <div className="flex-1 rounded-[1px]" style={{ backgroundColor: b }} />
        </div>
        <div className="w-3 flex flex-col gap-[2px]">
          <div className="h-2 rounded-[1px]" style={{ backgroundColor: b }} />
          <div className="flex-1 rounded-[1px]" style={{ backgroundColor: b }} />
        </div>
      </div>
    ),
    spotlight: (
      <div className={`${w} flex flex-col gap-[2px]`}>
        <div className="h-3 rounded-[1px]" style={{ backgroundColor: a }} />
        <div className="h-1 rounded-[1px]" style={{ backgroundColor: b }} />
        <div className="h-1 rounded-[1px]" style={{ backgroundColor: b }} />
        <div className="h-1 rounded-[1px]" style={{ backgroundColor: b }} />
      </div>
    ),
    timeline: (
      <div className={`${w} flex gap-[2px]`}>
        <div className="w-[3px] rounded-[1px]" style={{ backgroundColor: a }} />
        <div className="flex-1 flex flex-col gap-[2px]">
          <div className="flex-1 rounded-[1px]" style={{ backgroundColor: b }} />
          <div className="flex-1 rounded-[1px]" style={{ backgroundColor: b }} />
          <div className="flex-1 rounded-[1px]" style={{ backgroundColor: b }} />
          <div className="flex-1 rounded-[1px]" style={{ backgroundColor: b }} />
        </div>
      </div>
    ),
    bento: (
      <div className={`${w} grid grid-cols-3 grid-rows-3 gap-[2px]`}>
        <div className="col-span-2 row-span-2 rounded-[1px]" style={{ backgroundColor: a }} />
        <div className="rounded-[1px]" style={{ backgroundColor: b }} />
        <div className="rounded-[1px]" style={{ backgroundColor: b }} />
        <div className="rounded-[1px]" style={{ backgroundColor: b }} />
        <div className="col-span-2 rounded-[1px]" style={{ backgroundColor: b }} />
      </div>
    ),
    minimal: (
      <div className={`${w} flex flex-col items-center justify-center gap-[3px]`}>
        <div className="w-5 h-1 rounded-[1px]" style={{ backgroundColor: a }} />
        <div className="w-7 h-1 rounded-[1px]" style={{ backgroundColor: b }} />
        <div className="w-4 h-1 rounded-[1px]" style={{ backgroundColor: b }} />
      </div>
    ),
    dashboard: (
      <div className={`${w} grid grid-cols-3 gap-[2px]`}>
        <div className="rounded-[1px]" style={{ backgroundColor: a }} />
        <div className="rounded-[1px]" style={{ backgroundColor: a }} />
        <div className="rounded-[1px]" style={{ backgroundColor: a }} />
        <div className="col-span-2 h-2 rounded-[1px]" style={{ backgroundColor: b }} />
        <div className="h-2 rounded-[1px]" style={{ backgroundColor: b }} />
        <div className="col-span-3 h-1.5 rounded-[1px]" style={{ backgroundColor: b }} />
      </div>
    ),
  };

  return <div className="shrink-0">{layouts[layout]}</div>;
};

export { LAYOUT_PRESETS };
export default LayoutSwitcher;
