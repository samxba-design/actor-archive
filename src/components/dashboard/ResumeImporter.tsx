import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { parseResume, commitProfileData, type ParsedProfileData } from "@/lib/api/importers";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileUp, Check, AlertCircle, Briefcase, GraduationCap, Award, Link2, Lightbulb } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ResumeImporterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileType?: string;
  onComplete?: () => void;
}

export const ResumeImporter = ({ open, onOpenChange, profileType, onComplete }: ResumeImporterProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<"upload" | "parsing" | "review" | "saving" | "done">("upload");
  const [parsedData, setParsedData] = useState<ParsedProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const reset = () => {
    setStep("upload");
    setParsedData(null);
    setError(null);
    setProgress(0);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setStep("parsing");
    setProgress(30);

    try {
      const text = await file.text();
      if (!text.trim()) throw new Error("Could not extract text from file. Try a text-based PDF or paste your resume as text.");

      setProgress(60);
      const result = await parseResume(text, profileType);
      setProgress(100);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to parse resume");
      }

      setParsedData(result.data);
      setStep("review");
    } catch (err: any) {
      setError(err.message);
      setStep("upload");
    }
  };

  const handleConfirm = async () => {
    if (!user || !parsedData) return;
    setStep("saving");

    try {
      const results = await commitProfileData(user.id, parsedData);
      const totalInserted = results.reduce((sum, r) => sum + r.inserted, 0);
      const errors = results.filter(r => r.error);

      if (errors.length > 0) {
        toast({ title: "Partial import", description: `Imported ${totalInserted} items. Some items failed: ${errors.map(e => e.table).join(", ")}`, variant: "destructive" });
      } else {
        toast({ title: "Import complete!", description: `Successfully imported ${totalInserted} items across your profile.` });
      }

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

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FileUp className="h-5 w-5" /> Import from Resume</DialogTitle>
          <DialogDescription>Upload a PDF or text resume and we'll extract your profile data using AI.</DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <FileUp className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Click to upload your resume</p>
              <p className="text-xs text-muted-foreground mt-1">PDF or TXT file, max 5MB</p>
              <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" className="hidden" onChange={handleFile} />
            </div>
            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}
          </div>
        )}

        {step === "parsing" && (
          <div className="py-8 space-y-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Analyzing your resume with AI...</p>
            <Progress value={progress} className="max-w-xs mx-auto" />
          </div>
        )}

        {step === "review" && parsedData && counts && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">We found the following data. Review and click "Import" to add it to your profile.</p>

            <div className="grid grid-cols-2 gap-3">
              {counts.profile > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{counts.profile} profile fields</p>
                    <p className="text-xs text-muted-foreground">{[parsedData.display_name && "Name", parsedData.headline && "Headline", parsedData.bio && "Bio", parsedData.location && "Location"].filter(Boolean).join(", ")}</p>
                  </div>
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
                  <p className="text-sm font-medium">{counts.links} social links</p>
                </div>
              )}
            </div>

            {/* Show preview of key items */}
            {parsedData.work_history?.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">Projects Preview</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {parsedData.work_history.slice(0, 5).map((w, i) => (
                    <div key={i} className="text-sm flex justify-between items-center">
                      <span className="truncate">{w.title}</span>
                      {w.year && <span className="text-xs text-muted-foreground shrink-0 ml-2">{w.year}</span>}
                    </div>
                  ))}
                  {parsedData.work_history.length > 5 && (
                    <p className="text-xs text-muted-foreground">...and {parsedData.work_history.length - 5} more</p>
                  )}
                </div>
              </div>
            )}

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
            <Button variant="outline" onClick={() => { reset(); }}>Cancel</Button>
            <Button onClick={handleConfirm}>Import All</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
