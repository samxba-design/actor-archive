import { useEffect, useState } from "react";
import { Loader2, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const DashboardPreview = () => {
  const { user } = useAuth();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("slug")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        const nextSlug = data?.slug || null;
        setSlug(nextSlug);
        if (nextSlug) {
          window.location.replace(`/p/${nextSlug}?edit=1`);
        }
      });
  }, [user]);

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Opening Live Edit Studio…</p>
      {slug && (
        <Button variant="outline" size="sm" onClick={() => window.location.assign(`/p/${slug}?edit=1`)}>
          <ExternalLink className="h-4 w-4 mr-1" /> Open manually
        </Button>
      )}
    </div>
  );
};

export default DashboardPreview;
