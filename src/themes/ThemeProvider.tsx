import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PortfolioTheme } from "./theme-types";
import { getPortfolioTheme, getThemeFontFamilies, buildGoogleFontsUrl } from "./themes";

const ThemeContext = createContext<PortfolioTheme>(getPortfolioTheme('cinematic-dark'));

function kebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert a hex color (#RRGGBB or #RGB) to HSL channel string "H S% L%"
 * needed for CSS `hsl(var(--token) / alpha)` syntax used by section components.
 * Returns null for non-hex values (rgba, named colors, etc.).
 */
function hexToHslChannels(hex: string): string | null {
  if (!hex || !hex.startsWith('#')) return null;
  const clean = hex.replace('#', '');
  let r: number, g: number, b: number;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16) / 255;
    g = parseInt(clean[1] + clean[1], 16) / 255;
    b = parseInt(clean[2] + clean[2], 16) / 255;
  } else if (clean.length === 6) {
    r = parseInt(clean.slice(0, 2), 16) / 255;
    g = parseInt(clean.slice(2, 4), 16) / 255;
    b = parseInt(clean.slice(4, 6), 16) / 255;
  } else {
    return null;
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function themeToCssVars(theme: PortfolioTheme): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme)) {
    if (typeof value === 'string' && key !== 'id' && key !== 'name' && key !== 'description') {
      vars[`--portfolio-${kebabCase(key)}`] = value;
    } else if (typeof value === 'number') {
      vars[`--portfolio-${kebabCase(key)}`] = String(value);
    } else if (typeof value === 'boolean') {
      vars[`--portfolio-${kebabCase(key)}`] = value ? '1' : '0';
    } else if (Array.isArray(value)) {
      // skip arrays like previewColors
    }
  }

  // Add legacy short-form HSL aliases used by section components via hsl(var(--portfolio-xxx)).
  // Section components (SectionActorStats, SectionArticleFeed, etc.) were written against the
  // old HSL-channel CSS variable convention. These aliases bridge the two systems.
  const set = (alias: string, hex: string) => {
    const hsl = hexToHslChannels(hex);
    if (hsl) vars[alias] = hsl;
  };
  set('--portfolio-bg',       theme.bgPrimary);
  set('--portfolio-fg',       theme.textPrimary);
  set('--portfolio-card',     theme.bgElevated);
  set('--portfolio-card-fg',  theme.textPrimary);
  set('--portfolio-muted',    theme.bgSecondary);
  set('--portfolio-muted-fg', theme.textSecondary);
  set('--portfolio-accent',   theme.accentPrimary);
  set('--portfolio-accent-fg', theme.textOnAccent);
  set('--portfolio-border',   theme.borderDefault);

  // Font and radius aliases (not HSL, used without hsl() wrapper)
  vars['--portfolio-heading-font'] = theme.fontDisplay;
  vars['--portfolio-body-font']    = theme.fontBody;
  vars['--portfolio-radius']       = theme.cardRadius;

  return vars;
}

interface Props {
  themeId: string;
  children: React.ReactNode;
  className?: string;
  ctaStyleOverride?: string;
}

export function PortfolioThemeProvider({ themeId, children, className, ctaStyleOverride }: Props) {
  const baseTheme = useMemo(() => getPortfolioTheme(themeId), [themeId]);
  const theme = useMemo(() => {
    if (ctaStyleOverride && ctaStyleOverride !== baseTheme.ctaStyle) {
      return { ...baseTheme, ctaStyle: ctaStyleOverride as typeof baseTheme.ctaStyle };
    }
    return baseTheme;
  }, [baseTheme, ctaStyleOverride]);

  // Load fonts for this theme
  useEffect(() => {
    const families = getThemeFontFamilies(theme);
    if (families.length === 0) return;
    const id = 'portfolio-theme-fonts';
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = buildGoogleFontsUrl(families);
    document.head.appendChild(link);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, [theme]);

  const cssVars = useMemo(() => themeToCssVars(theme), [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <div
        className={className}
        style={{
          ...cssVars,
          backgroundColor: theme.bgPrimary,
          color: theme.textPrimary,
          fontFamily: theme.fontBody,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function usePortfolioTheme() {
  return useContext(ThemeContext);
}
