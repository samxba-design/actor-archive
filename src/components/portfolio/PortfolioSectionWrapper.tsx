import React, { useEffect, useRef } from "react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { useInView } from "@/hooks/useInView";

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
    const { ref: inViewRef, inView } = useInView({ threshold: 0.05 });

    const showNumber = index >= 0 && theme.sectionNumberStyle !== "hidden";
    const num = String(index + 1).padStart(2, "0");
    const staggerDelay = `${Math.max(0, index) * 0.06}s`;

    return (
      <section
        ref={ref as React.Ref<HTMLElement>}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : `translateY(${theme.scrollAnimationDistance ?? "20px"})`,
          transition: `opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${staggerDelay}, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${staggerDelay}`,
        }}
      >
        {/* Sentinel for IntersectionObserver */}
        <div ref={inViewRef} aria-hidden="true" style={{ position: "absolute", pointerEvents: "none" }} />

        {/* Section heading */}
        <div className="flex items-baseline gap-3 mb-3" style={{ position: "relative" }}>
          {showNumber && theme.sectionNumberStyle === "editorial" && (
            <span
              className="hidden sm:inline-block text-[10px] tracking-[0.2em] font-mono shrink-0 select-none"
              style={{ color: theme.accentPrimary, opacity: 0.55 }}
            >
              {num}
            </span>
          )}
          {showNumber && theme.sectionNumberStyle === "editorial" && (
            <span
              className="hidden sm:inline-block w-6 shrink-0"
              style={{ borderBottom: `1px solid ${theme.accentPrimary}30`, marginBottom: "4px" }}
            />
          )}
          <h2
            className="text-2xl sm:text-3xl leading-tight"
            style={{
              fontFamily: theme.fontDisplay,
              fontWeight: theme.headingWeight,
              color: theme.textPrimary,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h2>
        </div>

        {/* Divider */}
        {theme.sectionDividerStyle === "thin-line" && (
          <div
            className="mb-6"
            style={{ height: "1px", backgroundColor: theme.borderDefault, maxWidth: "60px" }}
          />
        )}
        {theme.sectionDividerStyle === "thick-line" && (
          <div
            className="mb-6"
            style={{ height: "3px", backgroundColor: theme.accentPrimary, maxWidth: "40px", borderRadius: "2px" }}
          />
        )}
        {(theme.sectionDividerStyle === "gradient" || !theme.sectionDividerStyle) && (
          <div
            className="mb-6"
            style={{
              height: "1px",
              background: `linear-gradient(to right, ${theme.accentPrimary}80, ${theme.accentPrimary}20, transparent)`,
              maxWidth: "120px",
            }}
          />
        )}

        {children}
      </section>
    );
  }
);

PortfolioSectionWrapper.displayName = "PortfolioSectionWrapper";
export default PortfolioSectionWrapper;
