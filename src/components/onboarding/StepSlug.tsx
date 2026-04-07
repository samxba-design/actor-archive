import { useState, useEffect } from "react";
import type { OnboardingData, StepMeta } from "@/pages/Onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  data: OnboardingData;
  updateData: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  stepMeta: StepMeta;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

const StepSlug = ({ data, updateData, onNext, onBack, stepMeta }: Props) => {
  const { user } = useAuth();
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Auto-generate slug from display name if slug is empty
  useEffect(() => {
    if (!data.slug && data.displayName) {
      updateData({ slug: slugify(data.displayName) });
    }
  }, []);

  // Debounced availability check — excludes current user
  useEffect(() => {
    if (!data.slug || data.slug.length < 3) {
      setAvailable(null);
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setChecking(true);
      let query = supabase
        .from("profiles")
        .select("id")
        .eq("slug", data.slug);

      // Exclude current user's own slug
      if (user?.id) {
        query = query.neq("id", user.id);
      }

      const { data: existing } = await query.maybeSingle();
      const isAvailable = !existing;
      setAvailable(isAvailable);
      if (!isAvailable) {
        const base = slugify(data.displayName || data.slug || "creative");
        const candidates = [base, `${base}-studio`, `${base}-portfolio`, `${base}-official`, `${base}-${new Date().getFullYear()}`]
          .map((s) => slugify(s))
          .filter((s, i, arr) => s.length >= 3 && s !== data.slug && arr.indexOf(s) === i)
          .slice(0, 3);
        setSuggestions(candidates);
      } else {
        setSuggestions([]);
      }
      setChecking(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [data.slug, user?.id]);

  const handleChange = (value: string) => {
    updateData({ slug: slugify(value) });
  };

  const canContinue = data.slug.length >= 3 && available === true;

  return (
    <div className="w-full max-w-lg space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Step {stepMeta.stepNumber} of {stepMeta.totalSteps}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Choose your URL</h1>
        <p className="text-muted-foreground">This is how people will find your portfolio.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="slug">Profile URL</Label>
          <div className="flex items-center gap-0">
            <span className="inline-flex items-center px-3 h-10 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground whitespace-nowrap">
              creativeslate.com/
            </span>
            <Input
              id="slug"
              value={data.slug}
              onChange={(e) => handleChange(e.target.value)}
              className="rounded-l-none"
              placeholder="samsmith"
            />
          </div>

          <div className="h-5 flex items-center gap-2">
            {checking && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Checking...
              </span>
            )}
            {!checking && available === true && data.slug.length >= 3 && (
              <span className="text-xs text-green-600 flex items-center gap-1 animate-slug-available">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Available!
              </span>
            )}
            {!checking && available === false && (
              <span className="text-xs text-destructive flex items-center gap-1 animate-slug-taken">
                <X className="w-3 h-3" /> Already taken
              </span>
            )}
            {data.slug.length > 0 && data.slug.length < 3 && (
              <span className="text-xs text-muted-foreground">Minimum 3 characters</span>
            )}
          </div>

          {available === false && suggestions.length > 0 && (
            <div className="rounded-md border border-border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground mb-2">Try one of these available-style options:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => updateData({ slug: suggestion })}
                    className="text-xs px-2.5 py-1 rounded-full border border-border hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={onNext} disabled={!canContinue} className="min-w-[120px]">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StepSlug;
