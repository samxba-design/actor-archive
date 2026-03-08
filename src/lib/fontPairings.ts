export interface FontPairing {
  key: string;
  label: string;
  headingFont: string;
  bodyFont: string;
  googleFamilies: string[]; // families to load from Google Fonts
}

export const fontPairings: Record<string, FontPairing> = {
  default: {
    key: "default",
    label: "Theme Default",
    headingFont: "",
    bodyFont: "",
    googleFamilies: [],
  },
  classic_serif: {
    key: "classic_serif",
    label: "Playfair Display / Source Sans 3",
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Source Sans 3', sans-serif",
    googleFamilies: ["Playfair Display", "Source Sans 3"],
  },
  modern_sans: {
    key: "modern_sans",
    label: "DM Serif Display / DM Sans",
    headingFont: "'DM Serif Display', serif",
    bodyFont: "'DM Sans', sans-serif",
    googleFamilies: ["DM Serif Display", "DM Sans"],
  },
  geometric: {
    key: "geometric",
    label: "Space Grotesk / Inter",
    headingFont: "'Space Grotesk', sans-serif",
    bodyFont: "'Inter', sans-serif",
    googleFamilies: ["Space Grotesk"],
  },
  editorial: {
    key: "editorial",
    label: "Cormorant Garamond / Lato",
    headingFont: "'Cormorant Garamond', serif",
    bodyFont: "'Lato', sans-serif",
    googleFamilies: ["Cormorant Garamond", "Lato"],
  },
  bold_modern: {
    key: "bold_modern",
    label: "Sora / Inter",
    headingFont: "'Sora', sans-serif",
    bodyFont: "'Inter', sans-serif",
    googleFamilies: ["Sora"],
  },
  literary: {
    key: "literary",
    label: "Libre Baskerville / Source Sans 3",
    headingFont: "'Libre Baskerville', serif",
    bodyFont: "'Source Sans 3', sans-serif",
    googleFamilies: ["Libre Baskerville", "Source Sans 3"],
  },
};

export function getFontPairing(key: string): FontPairing {
  return fontPairings[key] || fontPairings.default;
}

export function getFontGoogleUrl(pairing: FontPairing): string | null {
  if (pairing.googleFamilies.length === 0) return null;
  const params = pairing.googleFamilies
    .map((f) => `family=${f.replace(/ /g, "+")}:wght@400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}
