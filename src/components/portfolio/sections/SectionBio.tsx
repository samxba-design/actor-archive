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
      className="prose prose-sm max-w-none leading-relaxed"
      style={{
        color: theme.textSecondary,
        fontFamily: theme.fontBody,
      }}
      dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(bio) }}
    />
  );
};

export default SectionBio;
