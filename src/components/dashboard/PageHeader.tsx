import { GlossaryTooltip } from "@/components/ui/glossary-tooltip";

interface PageHeaderProps {
  title: string;
  description: string;
  glossaryTerms?: string[];
}

const PageHeader = ({ title, description, glossaryTerms }: PageHeaderProps) => (
  <div className="space-y-1 mb-6">
    <h1 className="text-2xl font-bold text-foreground flex items-center gap-1">
      {title}
      {glossaryTerms?.map((term) => (
        <GlossaryTooltip key={term} term={term} />
      ))}
    </h1>
    <p className="text-sm text-muted-foreground max-w-2xl">{description}</p>
  </div>
);

export default PageHeader;
