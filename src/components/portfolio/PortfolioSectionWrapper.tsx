import { useEffect, useRef, useState } from "react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  title: string;
  index: number;
  children: React.ReactNode;
}

const PortfolioSectionWrapper = ({ title, index, children }: Props) => {
  const theme = usePortfolioTheme();
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(el); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const num = String(index + 1).padStart(2, "0");

  return (
    <section
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : `translateY(${theme.scrollAnimationDistance})`,
        transition: `opacity ${theme.scrollAnimationDuration} ease-out, transform ${theme.scrollAnimationDuration} ease-out`,
      }}
    >
      {/* Heading */}
      <div className="flex items-baseline gap-3 mb-3">
        {theme.sectionNumberStyle !== 'hidden' && (
          <span
            className="text-xs tracking-widest font-mono"
            style={{ color: theme.sectionNumberColor }}
          >
            {num}
          </span>
        )}
        {theme.sectionNumberStyle === 'editorial' && (
          <span
            className="hidden sm:inline-block w-12"
            style={{ borderBottom: `1px solid ${theme.borderDefault}`, marginBottom: '4px' }}
          />
        )}
        <h2
          className="text-2xl sm:text-3xl tracking-tight"
          style={{
            fontFamily: theme.fontDisplay,
            fontWeight: theme.headingWeight,
            color: theme.textPrimary,
          }}
        >
          {title}
        </h2>
      </div>

      {/* Divider */}
      {theme.sectionDividerStyle === 'thin-line' && (
        <div className="mb-6" style={{ height: '1px', backgroundColor: theme.borderDefault, maxWidth: '100px' }} />
      )}
      {theme.sectionDividerStyle === 'thick-line' && (
        <div className="mb-6" style={{ height: '2px', backgroundColor: theme.borderDefault, maxWidth: '60px' }} />
      )}
      {theme.sectionDividerStyle === 'gradient' && (
        <div className="mb-6" style={{ height: '2px', background: `linear-gradient(to right, ${theme.accentPrimary}, transparent)`, maxWidth: '120px' }} />
      )}

      {children}
    </section>
  );
};

export default PortfolioSectionWrapper;
