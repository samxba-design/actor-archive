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

  const styles: Record<string, React.CSSProperties> = {
    'text-link': {
      background: 'none',
      border: 'none',
      color: theme.accentPrimary,
      fontSize: '13px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.06em',
      fontWeight: 500,
      fontFamily: theme.fontBody,
      transitionDuration: theme.hoverTransitionDuration,
    },
    'outlined': {
      background: 'transparent',
      border: `1px solid ${theme.accentPrimary}`,
      color: theme.accentPrimary,
      padding: '10px 24px',
      borderRadius: theme.ctaRadius,
      fontSize: '13px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.06em',
      fontWeight: 500,
      fontFamily: theme.fontBody,
      transitionDuration: theme.hoverTransitionDuration,
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
      fontSize: '13px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.06em',
      fontWeight: 500,
      fontFamily: theme.fontBody,
      transitionDuration: theme.hoverTransitionDuration,
    },
  };

  const hoverClass = "group/cta hover:[&_.portfolio-cta-arrow]:translate-x-1";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} ${hoverClass}`}
        style={styles[style]}
      >
        {icon}
        {label}
        {arrow}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${hoverClass}`}
      style={styles[style]}
    >
      {icon}
      {label}
      {arrow}
    </button>
  );
};

export default PortfolioCTA;
