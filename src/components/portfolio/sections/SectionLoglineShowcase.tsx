import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { Sparkles } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface Props {
  items: any[];
}

const SectionLoglineShowcase = ({ items }: Props) => {
  const theme = usePortfolioTheme();
  const withLoglines = items.filter((p) => p.logline);
  if (withLoglines.length === 0) return null;

  return (
    <div className="max-w-[800px] mx-auto space-y-0">
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
        transition: `opacity ${theme.scrollAnimationDuration} ease-out ${index * 0.15}s, transform ${theme.scrollAnimationDuration} ease-out ${index * 0.15}s`,
        paddingTop: index === 0 ? '0' : '40px',
        paddingBottom: isLast ? '0' : '40px',
      }}
    >
      {/* Hover accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full transition-opacity duration-200"
        style={{
          backgroundColor: theme.accentPrimary,
          opacity: hovered ? 0.25 : 0,
        }}
      />

      <div className="pl-4">
        {/* Title + genre */}
        <div className="flex flex-wrap items-baseline gap-3 mb-2">
          <h3
            className="leading-tight transition-colors duration-200"
            style={{
              fontFamily: theme.fontDisplay,
              fontWeight: theme.headingWeight,
              fontSize: isFeatured ? '24px' : '22px',
              color: hovered ? theme.accentPrimary : theme.textPrimary,
            }}
          >
            {p.title}
          </h3>
          {p.genre?.length > 0 && (
            <div className="flex gap-1.5 ml-auto">
              {p.genre.slice(0, 3).map((g: string) => (
                <span
                  key={g}
                  className="text-[11px] uppercase tracking-wide px-2.5 py-0.5"
                  style={{
                    backgroundColor: theme.bgElevated,
                    border: `1px solid ${theme.borderDefault}`,
                    color: theme.textSecondary,
                    borderRadius: '4px',
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
            fontSize: isFeatured ? '18px' : '17px',
            lineHeight: '1.65',
            color: theme.textPrimary,
          }}
        >
          \u201C{p.logline}\u201D
        </p>

        {/* Metadata */}
        <p
          className="mt-2 uppercase tracking-widest"
          style={{
            fontSize: '13px',
            color: theme.textTertiary,
            letterSpacing: '0.06em',
          }}
        >
          {[p.format, p.page_count ? `${p.page_count} pages` : null, p.status].filter(Boolean).join(" · ")}
        </p>
      </div>

      {/* Divider */}
      {!isLast && (
        <div
          className="mt-10"
          style={{ height: '1px', backgroundColor: theme.borderDefault }}
        />
      )}
    </div>
  );
};

export default SectionLoglineShowcase;
