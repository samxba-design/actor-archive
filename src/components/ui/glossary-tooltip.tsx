import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { glossary } from "@/lib/glossary";

interface GlossaryTooltipProps {
  term: string;
}

export function GlossaryTooltip({ term }: GlossaryTooltipProps) {
  const definition = glossary[term];
  if (!definition) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="inline-block ml-1 h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help align-text-top" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-sm leading-relaxed">
          {definition}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
