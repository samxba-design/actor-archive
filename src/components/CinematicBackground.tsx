import { useMemo } from "react";

const BOKEH_COLORS = [
  "hsl(350 40% 55% / 0.07)",
  "hsl(35 40% 70% / 0.05)",
  "hsl(20 35% 55% / 0.06)",
  "hsl(345 30% 50% / 0.04)",
  "hsl(30 30% 65% / 0.05)",
];

function generateBokehParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 6 + Math.random() * 34,
    left: Math.random() * 100,
    top: 60 + Math.random() * 40,
    color: BOKEH_COLORS[i % BOKEH_COLORS.length],
    blur: 2 + Math.random() * 6,
    duration: 18 + Math.random() * 22,
    delay: Math.random() * 12,
    driftX: -30 + Math.random() * 60,
    endScale: 0.4 + Math.random() * 0.4,
  }));
}

const BokehField = ({ count = 14 }: { count?: number }) => {
  const particles = useMemo(() => generateBokehParticles(count), [count]);
  return (
    <div className="bokeh-field">
      {particles.map((p) => (
        <div
          key={p.id}
          className="bokeh-particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: p.color,
            filter: `blur(${p.blur}px)`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--drift-x": `${p.driftX}px`,
            "--drift-y": "-110vh",
            "--end-scale": `${p.endScale}`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

const CinematicBackground = ({ bokehCount = 14 }: { bokehCount?: number }) => (
  <>
    <div className="gradient-mesh">
      <div className="gradient-mesh-orb gradient-mesh-orb--1" />
      <div className="gradient-mesh-orb gradient-mesh-orb--2" />
      <div className="gradient-mesh-orb gradient-mesh-orb--3" />
    </div>
    <div className="light-rays">
      <div className="light-ray light-ray--1" />
      <div className="light-ray light-ray--2" />
      <div className="light-ray light-ray--3" />
    </div>
    <BokehField count={bokehCount} />
    <div className="cinema-vignette" />
  </>
);

export { BokehField, CinematicBackground };
export default CinematicBackground;
