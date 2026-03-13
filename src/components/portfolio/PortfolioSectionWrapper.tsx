import React, { useEffect, useRef, useState } from "react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  title: string;
  index: number;
  children: React.ReactNode;
}

const PortfolioSectionWrapper = React.forwardRef<HTMLElement, Props>(
  ({ title, index, children }, forwardedRef) => {
    const theme = usePortfolioTheme();
    const internalRef = useRef<HTMLElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLElement>) || internalRef;
    const [inView, setInView] = useState(false);

    useEffect(() => {
      const el = (ref as React.RefObject<HTMLElement>).current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(el); } },
        { threshold: 0.06 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    const showNumber = index >= 0 && theme.sectionNumberStyle !== 'hidden';
    const num = String(index + 1).padStart(2, "0");

    return (
      <section
        ref={ref as React.Ref<HTMLElement>}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : `translateY(${theme.scrollAnimationDistance})`,
          transition: `opacity ${theme.scrollAnimationDuration} ease-out ${Math.max(0, index) * 0.08}s, transform ${theme.scrollAnimationDuration} ease-out ${Math.max(0, index) * 0.08}s`,
        }}
      >
        {/* Heading */}
        <div className="flex items-baseline gap-2.5 mb-2">
          {showNumber && (
            <span
              className="text-[11px] tracking-widest font-mono"
              style={{ color: theme.sectionNumberColor, opacity: 0.6 }}
            >
              {num}
            </span>
          )}
          {showNumber && theme.sectionNumberStyle === 'editorial' && (
            <span
              className="hidden sm:inline-block w-8"
              style={{ borderBottom: `1px solid ${theme.borderDefault}`, marginBottom: '3px' }}
            />
          )}
          <h2
            className="text-xl sm:text-2xl tracking-tight"
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
          <div className="mb-5" style={{ height: '1px', backgroundColor: theme.borderDefault, maxWidth: '80px' }} />
        )}
        {theme.sectionDividerStyle === 'thick-line' && (
          <div className="mb-5" style={{ height: '2px', backgroundColor: theme.borderDefault, maxWidth: '50px' }} />
        )}
        {theme.sectionDividerStyle === 'gradient' && (
          <div className="mb-5" style={{ height: '1px', background: `linear-gradient(to right, ${theme.accentPrimary}60, transparent)`, maxWidth: '100px' }} />
        )}

        {children}
      </section>
    );
  }
);

PortfolioSectionWrapper.displayName = "PortfolioSectionWrapper";

export default PortfolioSectionWrapper;
