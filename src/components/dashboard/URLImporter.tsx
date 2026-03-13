import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { scrapeProfileUrl, commitProfileData, type ParsedProfileData } from "@/lib/api/importers";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Globe, Check, AlertCircle, Briefcase, GraduationCap, Award, Link2, Lightbulb } from "lucide-react";

interface URLImporterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileType?: string;
  onComplete?: () => void;
}

export const URLImporter = ({ open, onOpenChange, profileType, onComplete }: URLImporterProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<"input" | "scraping" | "review" | "saving" | "done">("input");
  const [parsedData, setParsedData] = useState<ParsedProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setStep("input");
    setUrl("");
    setParsedData(null);
    setError(null);
  };

  const handleScrape = async () => {
    if (!url.trim()) return;
    setError(null);
    setStep("scraping");

    try {
      const result = await scrapeProfileUrl(url, "profile", profileType);
      if (!result.success || !result.data) throw new Error(result.error || "Failed to extract data");
      setParsedData(result.data);
      setStep("review");
    } catch (err: any) {
      setError(err.message);
      setStep("input");
    }
  };

  const handleConfirm = async () => {
    if (!user || !parsedData) return;
    setStep("saving");

    try {
      const results = await commitProfileData(user.id, parsedData, { onlyEmpty: true });
      const totalInserted = results.reduce((sum, r) => sum + r.inserted, 0);
      toast({ title: "Import complete!", description: `Imported ${totalInserted} items from URL.` });
      setStep("done");
      onComplete?.();
      setTimeout(() => { onOpenChange(false); reset(); }, 1500);
    } catch (err: any) {
      setError(err.message);
      setStep("review");
    }
  };

  const counts = parsedData ? {
    profile: [parsedData.display_name, parsedData.headline, parsedData.bio, parsedData.location].filter(Boolean).length,
    skills: parsedData.skills?.length || 0,
    education: parsedData.education?.length || 0,
    projects: parsedData.work_history?.length || 0,
    awards: parsedData.awards?.length || 0,
    links: parsedData.social_links?.length || 0,
  } : null;

  const urlHint = url.includes("linkedin") ? "LinkedIn profile detected" : url.includes("imdb") ? "IMDb page detected" : url.includes(".") ? "Website detected" : "";

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Import from URL</DialogTitle>
          <DialogDescription>Paste a LinkedIn, IMDb, or personal website URL and we'll extract your profile data.</DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="https://linkedin.com/in/yourname"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScrape()}
              />
              {urlHint && <p className="text-xs text-muted-foreground">{urlHint}</p>}
            </div>
            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}
            <Button onClick={handleScrape} disabled={!url.trim()} className="w-full">
              <Globe className="mr-2 h-4 w-4" /> Scrape & Extract
            </Button>
          </div>
        )}

        {step === "scraping" && (
          <div className="py-8 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Scraping page and extracting data...</p>
            <p className="text-xs text-muted-foreground">This may take 10-20 seconds</p>
          </div>
        )}

        {step === "review" && parsedData && counts && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Extracted data from URL. Only empty fields will be filled (existing data won't be overwritten).</p>

            <div className="grid grid-cols-2 gap-3">
              {counts.profile > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">{counts.profile} profile fields</p>
                </div>
              )}
              {counts.projects > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">{counts.projects} projects</p>
                </div>
              )}
              {counts.skills > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                  <Badge variant="secondary" className="text-xs">{counts.skills} skills</Badge>
                </div>
              )}
              {counts.education > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">{counts.education} education</p>
                </div>
              )}
              {counts.awards > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                  <Award className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">{counts.awards} awards</p>
                </div>
              )}
              {counts.links > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                  <Link2 className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">{counts.links} links</p>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}
          </div>
        )}

        {step === "saving" && (
          <div className="py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground mt-3">Saving to your profile...</p>
          </div>
        )}

        {step === "done" && (
          <div className="py-8 text-center">
            <Check className="h-10 w-10 mx-auto text-primary" />
            <p className="text-sm font-medium mt-3">Import complete!</p>
          </div>
        )}

        {step === "review" && (
          <DialogFooter>
            <Button variant="outline" onClick={reset}>Cancel</Button>
            <Button onClick={handleConfirm}>Import All</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
