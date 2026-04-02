import type { SectionVariants } from "./DemoShared";

export const QUICK_RECIPES: {
  label: string;
  description: string;
  apply: Partial<SectionVariants>;
}[] = [
  {
    label: "Polished",
    description: "Balanced layout + clean readability",
    apply: { heroLayout: "classic", heroRightContent: "featured", ctaStyle: "outlined", heroBgType: "preset", imageAnimation: "none", testimonials: "cards" },
  },
  {
    label: "Bold",
    description: "High-impact hero + strong CTA",
    apply: { heroLayout: "cinematic", heroRightContent: "showreel", ctaStyle: "glow-pulse", heroBgType: "gradient", imageAnimation: "shine", testimonials: "carousel" },
  },
  {
    label: "Editorial",
    description: "Magazine feel with refined hierarchy",
    apply: { heroLayout: "editorial", heroRightContent: "testimonial", ctaStyle: "underlined", heroBgType: "image", heroBgImage: "typewriter", testimonials: "single", publishedWork: "magazine" },
  },
];

export const GOAL_MODES: {
  label: string;
  description: string;
  apply: Partial<SectionVariants>;
  impact: string[];
}[] = [
  {
    label: "Book More Work",
    description: "Lead with offer clarity and a stronger CTA.",
    apply: { heroLayout: "classic", heroRightContent: "services", ctaPreset: "hire", ctaStyle: "filled-bold", services: "pricing", testimonials: "cards" },
    impact: ["Services and CTA become more prominent", "Trust signals shift toward conversion", "Layout emphasizes clarity over visual complexity"],
  },
  {
    label: "Find Representation",
    description: "Prioritize credits, reels, and industry polish.",
    apply: { heroLayout: "cinematic", heroRightContent: "showreel", ctaPreset: "contact", ctaStyle: "outlined", credits: "poster", knownForPosition: "hero_above_name" },
    impact: ["Hero reframed for industry review", "Credits and known-for content gain visual priority", "CTA tone shifts to professional outreach"],
  },
  {
    label: "Build Authority",
    description: "Show social proof and standout highlights first.",
    apply: { heroLayout: "editorial", heroRightContent: "testimonial", testimonials: "carousel", awards: "laurels", press: "cards", ctaStyle: "shine-sweep" },
    impact: ["Awards/testimonials gain stronger prominence", "Hero tone becomes more premium/editorial", "CTA gains visual emphasis for engagement"],
  },
];
