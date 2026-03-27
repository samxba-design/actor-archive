import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PortfolioTheme } from "./theme-types";
import { getPortfolioTheme, getThemeFontFamilies, buildGoogleFontsUrl } from "./themes";
import { getFontPairing, getFontGoogleUrl } from "@/lib/fontPairings";

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
  accentColorOverride?: string;
  fontPairingOverride?: string;
}

export function PortfolioThemeProvider({
  themeId,
  children,
  className,
  ctaStyleOverride,
  accentColorOverride,
  fontPairingOverride,
}: Props) {
  const baseTheme = useMemo(() => getPortfolioTheme(themeId), [themeId]);
  const theme = useMemo(() => {
    let t = baseTheme;
    if (ctaStyleOverride && ctaStyleOverride !== t.ctaStyle) {
      t = { ...t, ctaStyle: ctaStyleOverride as typeof t.ctaStyle };
    }
    if (accentColorOverride && accentColorOverride !== t.accentPrimary) {
      // Derive hover and subtle from the override color
      t = {
        ...t,
        accentPrimary: accentColorOverride,
        accentHover: accentColorOverride,
        accentSubtle: `${accentColorOverride}20`,
        accentGlow: `${accentColorOverride}14`,
        borderHover: `${accentColorOverride}4D`,
        borderAccent: `${accentColorOverride}66`,
      };
    }
    return t;
  }, [baseTheme, ctaStyleOverride, accentColorOverride]);

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

  // Load custom font pairing
  useEffect(() => {
    if (!fontPairingOverride || fontPairingOverride === 'default') return;
    const pairing = getFontPairing(fontPairingOverride);
    const url = getFontGoogleUrl(pairing);
    if (!url) return;
    const id = 'portfolio-font-pairing';
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, [fontPairingOverride]);

  const cssVars = useMemo(() => {
    const vars = themeToCssVars(theme);
    // Apply font pairing overrides
    if (fontPairingOverride && fontPairingOverride !== 'default') {
      const pairing = getFontPairing(fontPairingOverride);
      if (pairing.headingFont) {
        vars['--portfolio-font-display'] = pairing.headingFont;
        vars['--portfolio-font-logline'] = pairing.headingFont;
      }
      if (pairing.bodyFont) {
        vars['--portfolio-font-body'] = pairing.bodyFont;
      }
    }
    return vars;
  }, [theme, fontPairingOverride]);

  // Effective font-family (possibly overridden by font pairing)
  const effectiveFontBody = useMemo(() => {
    if (fontPairingOverride && fontPairingOverride !== 'default') {
      const pairing = getFontPairing(fontPairingOverride);
      if (pairing.bodyFont) return pairing.bodyFont;
    }
    return theme.fontBody;
  }, [theme.fontBody, fontPairingOverride]);

  return (
    <ThemeContext.Provider value={theme}>
      <div
        className={className}
        style={{
          ...cssVars,
          backgroundColor: theme.bgPrimary,
          color: theme.textPrimary,
          fontFamily: effectiveFontBody,
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
