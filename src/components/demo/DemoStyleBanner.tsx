/**
 * DemoStyleBanner.tsx
 *
 * Sticky top-right pill shown on demo pages.
 * Captures the current theme + layout and sends the user to signup (or dashboard).
 */
import { Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { saveDemoStyle } from "@/lib/demoStyleCapture";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface Props {
  theme: string;
  layoutPreset: string;
}

const DemoStyleBanner = ({ theme, layoutPreset }: Props) => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);

  const handleClick = async () => {
    if (clicked) return;
    setClicked(true);

    // Persist style for after auth
    saveDemoStyle(theme, layoutPreset);

    // Check if already logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Apply immediately: update profile theme + layout_preset
      await supabase.from("profiles").update({ theme, layout_preset: layoutPreset } as any).eq("id", user.id);
      navigate("/dashboard?demo_style_applied=1");
    } else {
      navigate("/signup?from=demo");
    }
  };

  return (
    <div
      className="fixed top-[52px] right-4 z-[60] pointer-events-none"
      style={{ isolation: "isolate" }}
    >
      <button
        onClick={handleClick}
        disabled={clicked}
        className="pointer-events-auto demo-style-banner flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
        style={{
          background: "hsl(var(--portfolio-accent, var(--primary)))",
          color: "hsl(var(--portfolio-bg, var(--background)))",
          border: "1px solid hsl(var(--portfolio-accent, var(--primary)) / 0.3)",
        }}
      >
        <Wand2 className="h-3.5 w-3.5 shrink-0" />
        {clicked ? "Saving style…" : "Start with this style"}
      </button>
    </div>
  );
};

export default DemoStyleBanner;
