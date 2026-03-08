import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { useRef, useState, useEffect } from "react";

interface Props {
  items: any[];
}

const SectionLoglineShowcase = ({ items }: Props) => {
  const theme = usePortfolioTheme();
  const withLoglines = items.filter((p) => p.logline);
  if (withLoglines.length === 0) return null;

  return (
    <div className="space-y-0">
      {withLoglines.map((p, idx) => (
        <LoglineItem key={p.id} item={p} index={idx} isFeatured={idx === 0} isLast={idx === withLoglines.length - 1} theme={theme} />
      ))}
    </div>
  );
};

const LoglineItem = ({ item: p, index, isFeatured, isLast, theme }: { item: any; index: number; isFeatured: boolean; isLast: boolean; theme: any }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(el); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : `translateY(${theme.scrollAnimationDistance})`,
        transition: `opacity ${theme.scrollAnimationDuration} ease-out ${index * 0.1}s, transform ${theme.scrollAnimationDuration} ease-out ${index * 0.1}s`,
        paddingTop: index === 0 ? '0' : '20px',
        paddingBottom: isLast ? '0' : '20px',
      }}
    >
      {/* Hover accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full transition-all duration-300"
        style={{
          backgroundColor: theme.accentPrimary,
          opacity: hovered ? 0.4 : 0,
          transform: hovered ? 'scaleY(1)' : 'scaleY(0.6)',
        }}
      />

      <div className="pl-4">
        {/* Format tag + status */}
        <div className="flex items-center gap-2 mb-1.5">
          {p.format && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: theme.accentPrimary }}>
              {p.format}
            </span>
          )}
          {p.status && (
            <span className="text-[10px] uppercase tracking-wide" style={{ color: theme.textTertiary }}>
              · {p.status}
            </span>
          )}
        </div>

        {/* Title + genre */}
        <div className="flex flex-wrap items-baseline gap-3 mb-1">
          <h3
            className="leading-tight transition-colors duration-200"
            style={{
              fontFamily: theme.fontDisplay,
              fontWeight: theme.headingWeight,
              fontSize: isFeatured ? '22px' : '19px',
              color: hovered ? theme.accentPrimary : theme.textPrimary,
            }}
          >
            {p.title}
          </h3>
              {p.genre?.length > 0 && (
            <div className="flex gap-1">
              {p.genre.slice(0, 3).map((g: string) => (
                <span
                  key={g}
                  className="text-[10px] uppercase tracking-wide px-2 py-0.5"
                  style={{
                    backgroundColor: theme.accentSubtle,
                    color: theme.textSecondary,
                    borderRadius: '3px',
                  }}
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Logline */}
        <p
          className="leading-relaxed"
          style={{
            fontFamily: theme.fontLogline,
            fontStyle: theme.loglineStyle,
            fontSize: isFeatured ? '16px' : '15px',
            lineHeight: '1.6',
            color: theme.textPrimary,
            opacity: 0.9,
          }}
        >
          "{p.logline}"
        </p>

        {/* Metadata */}
        {p.page_count && (
          <p className="mt-1 uppercase tracking-widest" style={{ fontSize: '11px', color: theme.textTertiary }}>
            {p.page_count} pages
          </p>
        )}
      </div>

      {/* Divider */}
      {!isLast && (
        <div
          className="mt-5"
          style={{ height: '1px', background: `linear-gradient(to right, ${theme.borderDefault}, transparent 80%)` }}
        />
      )}
    </div>
  );
};

export default SectionLoglineShowcase;
