import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
  style?: React.CSSProperties;
}

const GlassCard = ({ children, className = "", featured, style }: Props) => {
  const theme = usePortfolioTheme();

  const shineClass = "glass-shine-card";

  return (
    <div
      className={`transition-all ${shineClass} ${className}`}
      style={{
        backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
        backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
        WebkitBackdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
        border: featured
          ? `1px solid ${theme.accentPrimary}40`
          : `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
        borderRadius: theme.cardRadius,
        boxShadow: featured ? `0 0 20px ${theme.accentGlow}` : theme.cardShadow,
        transitionDuration: theme.hoverTransitionDuration,
        ...style,
      }}
    >
      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
