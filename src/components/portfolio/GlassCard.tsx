import { useState } from "react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
  style?: React.CSSProperties;
  interactive?: boolean;
}

const GlassCard = ({ children, className = "", featured, style, interactive = false }: Props) => {
  const theme = usePortfolioTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`transition-all ${className}`}
      style={{
        backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
        backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
        WebkitBackdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
        border: featured
          ? `1px solid ${theme.accentPrimary}45`
          : `${theme.cardBorderWidth} solid ${
              hovered && interactive ? theme.borderHover || theme.borderDefault : theme.borderDefault
            }`,
        borderRadius: theme.cardRadius,
        boxShadow: featured
          ? `0 0 0 1px ${theme.accentPrimary}15, 0 4px 24px ${theme.accentGlow || "transparent"}`
          : hovered && interactive
          ? theme.cardHoverShadow
          : theme.cardShadow,
        transform: interactive && hovered ? theme.cardHoverTransform || "translateY(-2px)" : "none",
        transitionDuration: theme.hoverTransitionDuration,
        ...style,
      }}
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
    >
      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
