import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PortfolioTheme } from "./theme-types";
import { getPortfolioTheme, getThemeFontFamilies, buildGoogleFontsUrl } from "./themes";

const ThemeContext = createContext<PortfolioTheme>(getPortfolioTheme('cinematic-dark'));

function kebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
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
