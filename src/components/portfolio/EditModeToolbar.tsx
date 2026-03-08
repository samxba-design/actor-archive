import { useEditMode } from "./EditModeProvider";
import { Pencil, Save, X, Loader2 } from "lucide-react";

const EditModeToolbar = () => {
  const { isOwner, editMode, setEditMode, saving, saveLayout, hasChanges } = useEditMode();

  if (!isOwner) return null;

  if (!editMode) {
    return (
      <button
        onClick={() => setEditMode(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium shadow-lg backdrop-blur-xl transition-all hover:scale-105"
        style={{
          background: "hsl(var(--portfolio-card, var(--card)) / 0.85)",
          color: "hsl(var(--portfolio-fg, var(--foreground)))",
          border: "1px solid hsl(var(--portfolio-border, var(--border)) / 0.5)",
        }}
      >
        <Pencil className="h-4 w-4" />
        Customize
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl px-5 py-3 shadow-2xl backdrop-blur-xl"
      style={{
        background: "hsl(var(--portfolio-card, var(--card)) / 0.9)",
        border: "1px solid hsl(var(--portfolio-border, var(--border)) / 0.5)",
        color: "hsl(var(--portfolio-fg, var(--foreground)))",
      }}
    >
      <span className="text-xs font-medium tracking-wide uppercase opacity-60 mr-1">
        Edit Mode
      </span>

      <div className="w-px h-5 bg-current opacity-20" />

      <button
        onClick={saveLayout}
        disabled={saving || !hasChanges}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-40"
        style={{
          background: hasChanges
            ? "hsl(var(--portfolio-accent, var(--primary)))"
            : "transparent",
          color: hasChanges
            ? "hsl(var(--portfolio-accent-fg, var(--primary-foreground)))"
            : "currentColor",
        }}
      >
        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
        Save
      </button>

      <button
        onClick={() => setEditMode(false)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-current/10"
      >
        <X className="h-3.5 w-3.5" />
        Done
      </button>
    </div>
  );
};

export default EditModeToolbar;
