import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { renderSimpleMarkdown } from "@/lib/simpleMarkdown";

interface Props {
  bio: string;
}

const SectionBio = ({ bio }: Props) => {
  const theme = usePortfolioTheme();

  if (!bio) return null;

  return (
    <div
      className="relative"
      style={{ maxWidth: "72ch" }}
    >
      {/* Decorative left accent rule */}
      <div
        className="absolute -left-5 top-1 bottom-1 w-px hidden sm:block"
        style={{ background: `linear-gradient(to bottom, ${theme.accentPrimary}50, transparent)` }}
      />

      <div
        className="prose prose-sm max-w-none leading-[1.8] text-[15px]"
        style={{
          color: theme.textSecondary,
          fontFamily: theme.fontLogline || theme.fontBody,
          fontStyle: theme.loglineStyle === "italic" ? "italic" : undefined,
          // Pull-quote style for short bios
          ...(bio.length < 160
            ? {
                fontSize: "clamp(16px, 2.2vw, 20px)",
                lineHeight: "1.6",
                fontWeight: 400,
                letterSpacing: "0.01em",
                color: theme.textPrimary,
              }
            : {}),
        }}
        dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(bio) }}
      />
    </div>
  );
};

export default SectionBio;
