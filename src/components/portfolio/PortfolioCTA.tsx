import { ArrowRight } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  label: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  icon?: React.ReactNode;
}

const PortfolioCTA = ({ label, onClick, href, className = "", icon }: Props) => {
  const theme = usePortfolioTheme();
  const style = theme.ctaStyle;

  const arrow = (
    <span className="portfolio-cta-arrow inline-block transition-transform" style={{ transitionDuration: theme.hoverTransitionDuration }}>
      <ArrowRight className="w-3.5 h-3.5" />
    </span>
  );

  const baseClass = `inline-flex items-center gap-2 cursor-pointer transition-all ${className}`;

  const baseFont: React.CSSProperties = {
    fontSize: '13px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    fontWeight: 500,
    fontFamily: theme.fontBody,
    transitionDuration: theme.hoverTransitionDuration,
  };

  const styles: Record<string, React.CSSProperties> = {
    'text-link': {
      background: 'none',
      border: 'none',
      color: theme.accentPrimary,
      ...baseFont,
    },
    'outlined': {
      background: 'transparent',
      border: `1px solid ${theme.accentPrimary}`,
      color: theme.accentPrimary,
      padding: '10px 24px',
      borderRadius: theme.ctaRadius,
      ...baseFont,
    },
    'underlined': {
      background: 'none',
      border: 'none',
      color: theme.accentPrimary,
      fontSize: '14px',
      letterSpacing: '0.04em',
      fontWeight: 500,
      fontFamily: theme.fontBody,
      transitionDuration: theme.hoverTransitionDuration,
    },
    'filled-subtle': {
      background: theme.accentSubtle,
      border: `1px solid ${theme.borderDefault}`,
      color: theme.accentPrimary,
      padding: '10px 24px',
      borderRadius: theme.ctaRadius,
      ...baseFont,
    },
    'glow-pulse': {
      background: theme.accentSubtle,
      border: `1px solid ${theme.accentPrimary}`,
      color: theme.accentPrimary,
      padding: '12px 28px',
      borderRadius: theme.ctaRadius,
      ...baseFont,
      fontWeight: 600,
    },
    'shine-sweep': {
      background: theme.accentSubtle,
      border: `1px solid ${theme.borderDefault}`,
      color: theme.accentPrimary,
      padding: '12px 28px',
      borderRadius: theme.ctaRadius,
      ...baseFont,
      fontWeight: 600,
    },
    'neon-border': {
      background: 'transparent',
      border: `2px solid ${theme.accentPrimary}`,
      color: theme.accentPrimary,
      padding: '12px 28px',
      borderRadius: theme.ctaRadius,
      ...baseFont,
      fontWeight: 600,
    },
    'filled-bold': {
      background: theme.accentPrimary,
      border: 'none',
      color: theme.textOnAccent,
      padding: '12px 28px',
      borderRadius: theme.ctaRadius,
      ...baseFont,
      fontWeight: 700,
    },
  };

  // Animated styles get a CSS class for their keyframe animations
  const animatedClassMap: Record<string, string> = {
    'glow-pulse': 'portfolio-cta-glow-pulse',
    'shine-sweep': 'portfolio-cta-shine-sweep',
    'neon-border': 'portfolio-cta-neon-border',
    'filled-bold': 'portfolio-cta-filled-bold',
  };

  const animClass = animatedClassMap[style] || '';
  const hoverClass = "group/cta hover:[&_.portfolio-cta-arrow]:translate-x-1";

  const content = (
    <>
      {icon}
      {label}
      {arrow}
    </>
  );

  const cssVars = {
    '--cta-accent': theme.accentPrimary,
    '--cta-accent-glow': theme.accentGlow,
    '--cta-accent-subtle': theme.accentSubtle,
    '--cta-text-on-accent': theme.textOnAccent,
  } as React.CSSProperties;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} ${hoverClass} ${animClass}`}
        style={{ ...styles[style], ...cssVars }}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${hoverClass} ${animClass}`}
      style={{ ...styles[style], ...cssVars }}
    >
      {content}
    </button>
  );
};

export default PortfolioCTA;
