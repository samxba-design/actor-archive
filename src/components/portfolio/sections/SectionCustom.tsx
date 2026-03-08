import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { renderSimpleMarkdown } from "@/lib/simpleMarkdown";

interface CustomSection {
  id: string;
  title: string;
  content: string | null;
  icon: string;
}

interface Props {
  sections: CustomSection[];
}

const SectionCustom = ({ sections }: Props) => {
  const theme = usePortfolioTheme();

  if (!sections.length) return null;

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.id}>
          <h3
            className="text-lg font-semibold mb-3"
            style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}
          >
            {section.title}
          </h3>
          {section.content && (
            <div
              className="text-sm leading-relaxed prose-sm max-w-none"
              style={{ color: theme.textSecondary, fontFamily: theme.fontBody }}
              dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(section.content) }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SectionCustom;
