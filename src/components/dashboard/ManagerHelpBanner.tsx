import { useState } from "react";
import { Info, X, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ManagerHelpBannerProps {
  id: string;
  title: string;
  description: string;
  learnMoreRoute?: string;
  /** How this content appears on the public portfolio */
  previewText?: string;
  /** URL to a demo profile showing this section */
  demoUrl?: string;
  /** User's slug for "View on portfolio" link */
  portfolioSlug?: string;
}

const ManagerHelpBanner = ({ id, title, description, learnMoreRoute, previewText, demoUrl, portfolioSlug }: ManagerHelpBannerProps) => {
  const storageKey = `help_dismissed:${id}`;
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(storageKey) === "true");
  const navigate = useNavigate();

  if (dismissed) return null;

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 flex items-start gap-3 mb-4 animate-in fade-in duration-300">
      <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        {previewText && (
          <p className="text-xs text-primary/80 mt-1 italic">📐 {previewText}</p>
        )}
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {learnMoreRoute && (
            <button
              onClick={() => navigate(learnMoreRoute)}
              className="text-xs text-primary hover:underline inline-block"
            >
              Go to Settings →
            </button>
          )}
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              See example <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {portfolioSlug && (
            <a
              href={`/p/${portfolioSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              View on portfolio <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
      <button
        onClick={() => {
          localStorage.setItem(storageKey, "true");
          setDismissed(true);
        }}
        className="shrink-0 p-0.5 rounded hover:bg-muted transition-colors"
      >
        <X className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    </div>
  );
};

export default ManagerHelpBanner;
