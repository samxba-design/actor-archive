// Theme definitions: each theme maps to CSS custom properties
// Applied dynamically on the public portfolio page

export interface ThemeDefinition {
  key: string;
  label: string;
  description: string;
  variables: Record<string, string>;
}

export const themes: Record<string, ThemeDefinition> = {
  minimal: {
    key: "minimal",
    label: "Minimal",
    description: "Clean, spacious, typography-forward",
    variables: {
      "--portfolio-bg": "0 0% 100%",
      "--portfolio-fg": "0 0% 8%",
      "--portfolio-card": "0 0% 98%",
      "--portfolio-card-fg": "0 0% 8%",
      "--portfolio-muted": "0 0% 94%",
      "--portfolio-muted-fg": "0 0% 40%",
      "--portfolio-accent": "0 0% 8%",
      "--portfolio-accent-fg": "0 0% 100%",
      "--portfolio-border": "0 0% 90%",
      "--portfolio-heading-font": "'Inter', sans-serif",
      "--portfolio-body-font": "'Inter', sans-serif",
      "--portfolio-radius": "0.5rem",
    },
  },
  noir: {
    key: "noir",
    label: "Noir",
    description: "Dark, cinematic, high contrast",
    variables: {
      "--portfolio-bg": "0 0% 4%",
      "--portfolio-fg": "0 0% 92%",
      "--portfolio-card": "0 0% 8%",
      "--portfolio-card-fg": "0 0% 92%",
      "--portfolio-muted": "0 0% 14%",
      "--portfolio-muted-fg": "0 0% 60%",
      "--portfolio-accent": "0 72% 51%",
      "--portfolio-accent-fg": "0 0% 100%",
      "--portfolio-border": "0 0% 16%",
      "--portfolio-heading-font": "'Georgia', serif",
      "--portfolio-body-font": "'Inter', sans-serif",
      "--portfolio-radius": "0.25rem",
    },
  },
  editorial: {
    key: "editorial",
    label: "Editorial",
    description: "Magazine-inspired, serif headings, structured grid",
    variables: {
      "--portfolio-bg": "40 20% 97%",
      "--portfolio-fg": "20 10% 12%",
      "--portfolio-card": "40 20% 95%",
      "--portfolio-card-fg": "20 10% 12%",
      "--portfolio-muted": "40 15% 90%",
      "--portfolio-muted-fg": "20 8% 45%",
      "--portfolio-accent": "15 80% 50%",
      "--portfolio-accent-fg": "0 0% 100%",
      "--portfolio-border": "40 15% 85%",
      "--portfolio-heading-font": "'Georgia', serif",
      "--portfolio-body-font": "'Inter', sans-serif",
      "--portfolio-radius": "0rem",
    },
  },
  spotlight: {
    key: "spotlight",
    label: "Spotlight",
    description: "Bold headshot-forward, actor/performer focused",
    variables: {
      "--portfolio-bg": "240 10% 6%",
      "--portfolio-fg": "0 0% 95%",
      "--portfolio-card": "240 10% 10%",
      "--portfolio-card-fg": "0 0% 95%",
      "--portfolio-muted": "240 8% 16%",
      "--portfolio-muted-fg": "240 5% 60%",
      "--portfolio-accent": "45 100% 55%",
      "--portfolio-accent-fg": "0 0% 5%",
      "--portfolio-border": "240 8% 18%",
      "--portfolio-heading-font": "'Inter', sans-serif",
      "--portfolio-body-font": "'Inter', sans-serif",
      "--portfolio-radius": "0.75rem",
    },
  },
  ink: {
    key: "ink",
    label: "Ink",
    description: "Writer-focused, literary, warm cream tones",
    variables: {
      "--portfolio-bg": "40 30% 96%",
      "--portfolio-fg": "30 15% 15%",
      "--portfolio-card": "40 25% 93%",
      "--portfolio-card-fg": "30 15% 15%",
      "--portfolio-muted": "40 20% 88%",
      "--portfolio-muted-fg": "30 10% 45%",
      "--portfolio-accent": "30 60% 40%",
      "--portfolio-accent-fg": "40 30% 96%",
      "--portfolio-border": "40 18% 82%",
      "--portfolio-heading-font": "'Georgia', serif",
      "--portfolio-body-font": "'Georgia', serif",
      "--portfolio-radius": "0.25rem",
    },
  },
  brutalist: {
    key: "brutalist",
    label: "Brutalist",
    description: "Raw, bold, unconventional layout",
    variables: {
      "--portfolio-bg": "60 5% 95%",
      "--portfolio-fg": "0 0% 5%",
      "--portfolio-card": "0 0% 100%",
      "--portfolio-card-fg": "0 0% 5%",
      "--portfolio-muted": "60 3% 88%",
      "--portfolio-muted-fg": "0 0% 35%",
      "--portfolio-accent": "0 0% 5%",
      "--portfolio-accent-fg": "60 5% 95%",
      "--portfolio-border": "0 0% 5%",
      "--portfolio-heading-font": "'Courier New', monospace",
      "--portfolio-body-font": "'Inter', sans-serif",
      "--portfolio-radius": "0rem",
    },
  },
  modernist: {
    key: "modernist",
    label: "Modernist",
    description: "Swiss-style, geometric, precise grid",
    variables: {
      "--portfolio-bg": "0 0% 100%",
      "--portfolio-fg": "220 15% 15%",
      "--portfolio-card": "220 15% 97%",
      "--portfolio-card-fg": "220 15% 15%",
      "--portfolio-muted": "220 10% 92%",
      "--portfolio-muted-fg": "220 8% 50%",
      "--portfolio-accent": "220 80% 55%",
      "--portfolio-accent-fg": "0 0% 100%",
      "--portfolio-border": "220 10% 88%",
      "--portfolio-heading-font": "'Inter', sans-serif",
      "--portfolio-body-font": "'Inter', sans-serif",
      "--portfolio-radius": "0.375rem",
    },
  },
  warm: {
    key: "warm",
    label: "Warm",
    description: "Friendly, approachable, soft earth tones",
    variables: {
      "--portfolio-bg": "30 30% 97%",
      "--portfolio-fg": "20 15% 15%",
      "--portfolio-card": "30 25% 94%",
      "--portfolio-card-fg": "20 15% 15%",
      "--portfolio-muted": "30 18% 88%",
      "--portfolio-muted-fg": "20 10% 45%",
      "--portfolio-accent": "20 70% 50%",
      "--portfolio-accent-fg": "0 0% 100%",
      "--portfolio-border": "30 15% 84%",
      "--portfolio-heading-font": "'Georgia', serif",
      "--portfolio-body-font": "'Inter', sans-serif",
      "--portfolio-radius": "0.75rem",
    },
  },
  midnight: {
    key: "midnight",
    label: "Midnight",
    description: "Deep blue-black, sleek, premium feel",
    variables: {
      "--portfolio-bg": "225 30% 8%",
      "--portfolio-fg": "220 15% 90%",
      "--portfolio-card": "225 25% 12%",
      "--portfolio-card-fg": "220 15% 90%",
      "--portfolio-muted": "225 20% 18%",
      "--portfolio-muted-fg": "220 12% 55%",
      "--portfolio-accent": "200 80% 60%",
      "--portfolio-accent-fg": "225 30% 8%",
      "--portfolio-border": "225 18% 20%",
      "--portfolio-heading-font": "'Inter', sans-serif",
      "--portfolio-body-font": "'Inter', sans-serif",
      "--portfolio-radius": "0.5rem",
    },
  },
  gallery: {
    key: "gallery",
    label: "Gallery",
    description: "White-wall gallery feel, image-forward",
    variables: {
      "--portfolio-bg": "0 0% 100%",
      "--portfolio-fg": "0 0% 12%",
      "--portfolio-card": "0 0% 97%",
      "--portfolio-card-fg": "0 0% 12%",
      "--portfolio-muted": "0 0% 94%",
      "--portfolio-muted-fg": "0 0% 45%",
      "--portfolio-accent": "0 0% 25%",
      "--portfolio-accent-fg": "0 0% 100%",
      "--portfolio-border": "0 0% 92%",
      "--portfolio-heading-font": "'Inter', sans-serif",
      "--portfolio-body-font": "'Inter', sans-serif",
      "--portfolio-radius": "0rem",
    },
  },
};

export function getTheme(key: string): ThemeDefinition {
  return themes[key] || themes.minimal;
}

export function applyThemeToElement(el: HTMLElement, themeKey: string, accentColor?: string) {
  const theme = getTheme(themeKey);
  Object.entries(theme.variables).forEach(([prop, value]) => {
    el.style.setProperty(prop, value);
  });
  // Override accent if user set custom accent
  if (accentColor) {
    el.style.setProperty("--portfolio-accent", accentColor);
  }
}
