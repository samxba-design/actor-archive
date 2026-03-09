import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Optional profile type to customize copy */
  profileType?: string | null;
}

/** Type-specific flavor text overrides */
const TYPE_TIPS: Record<string, Record<string, string>> = {
  actor: {
    gallery: "Casting directors need multiple headshot looks — add at least 3.",
    projects: "Add your film, TV, and theatre credits to build your résumé.",
    awards: "Festival wins and nominations boost casting interest.",
    testimonials: "Directors' quotes carry weight with casting teams.",
    skills: "List special skills like combat, accents, instruments, etc.",
  },
  screenwriter: {
    projects: "Every script needs a logline and genre — start with your strongest spec.",
    awards: "Contest wins and fellowships validate your writing voice.",
    testimonials: "A quote from a showrunner or producer goes a long way.",
  },
  tv_writer: {
    projects: "Add your pilots and spec scripts with loglines.",
    awards: "Fellowships like Nicholl or Austin carry serious weight.",
  },
  playwright: {
    projects: "Document world premieres, revivals, and readings.",
    awards: "List residencies, commissions, and fellowships.",
  },
  author: {
    projects: "Import books from Google Books or add them manually.",
    awards: "Longlists, shortlists, and prize wins build authority.",
    press: "Add reviews from major publications.",
  },
  journalist: {
    projects: "Add your most impactful published articles.",
    press: "Cross-link interviews and features about your work.",
  },
  copywriter: {
    projects: "Case studies with metrics convert potential clients.",
    services: "Clearly list your services, deliverables, and pricing.",
    testimonials: "Client testimonials are your most powerful sales tool.",
  },
  corporate_video: {
    projects: "Showcase client work with before/after metrics.",
    services: "List your packages — brands want to see pricing clarity.",
    testimonials: "Client quotes with company names build trust fast.",
  },
  director_producer: {
    projects: "Import your filmography from TMDB with posters and metadata.",
    gallery: "Add behind-the-scenes photos and production stills.",
    awards: "Festival laurels are visual proof of your craft.",
  },
};

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction, profileType }: EmptyStateProps) => {
  // Try to find a type-specific description
  let displayDescription = description;
  if (profileType) {
    const sectionKey = title.toLowerCase().replace(/^no\s+/, "").replace(/\s+yet$/, "").trim();
    const typeOverrides = TYPE_TIPS[profileType];
    if (typeOverrides) {
      // Try matching against known keys
      for (const [key, tip] of Object.entries(typeOverrides)) {
        if (sectionKey.includes(key) || title.toLowerCase().includes(key)) {
          displayDescription = tip;
          break;
        }
      }
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="py-16 flex flex-col items-center text-center gap-4 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "24px 24px"
        }} />
        
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center relative animate-in fade-in zoom-in duration-500">
          <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />
          <Icon className="h-7 w-7 text-muted-foreground relative" />
        </div>
        
        <div className="space-y-2 max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
          <h3 className="font-semibold text-foreground text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{displayDescription}</p>
        </div>
        
        {actionLabel && onAction && (
          <Button 
            onClick={onAction} 
            className="mt-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200"
            data-shortcut="new"
          >
            <Plus className="mr-2 h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
