export interface PortfolioTheme {
  id: string;
  name: string;
  description: string;
  previewColors: string[];

  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgElevated: string;
  bgHero: string;
  heroOverlayGradient: string;
  heroOverlayBlend: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textOnAccent: string;

  // Accent
  accentPrimary: string;
  accentHover: string;
  accentSubtle: string;
  accentGlow: string;

  // Borders
  borderDefault: string;
  borderHover: string;
  borderAccent: string;

  // Status
  statusAvailable: string;
  statusDevelopment: string;

  // Typography
  fontDisplay: string;
  fontBody: string;
  fontLogline: string;
  loglineStyle: 'italic' | 'normal';
  nameWeight: number;
  headingWeight: number;

  // Card
  cardRadius: string;
  cardShadow: string;
  cardHoverShadow: string;
  cardHoverTransform: string;
  cardBorderWidth: string;

  // CTA
  ctaStyle: 'text-link' | 'outlined' | 'filled-subtle' | 'underlined';
  ctaRadius: string;

  // Hero
  heroHeight: string;
  heroContentPosition: string;
  profilePhotoSize: string;
  profilePhotoBorder: string;
  profilePhotoShadow: string;

  // Section Numbers
  sectionNumberStyle: 'editorial' | 'minimal' | 'hidden';
  sectionNumberColor: string;
  sectionDividerStyle: 'thin-line' | 'thick-line' | 'none' | 'gradient';

  // Animation
  scrollAnimationDistance: string;
  scrollAnimationDuration: string;
  hoverTransitionDuration: string;
  enableParallax: boolean;
  parallaxIntensity: number;

  // Glass
  glassEnabled: boolean;
  glassBackground: string;
  glassBlur: string;
  glassBorder: string;
}
