import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff } from "lucide-react";
import { useEditMode } from "./EditModeProvider";
import { ReactNode } from "react";

interface Props {
  id: string;
  label: string;
  children: ReactNode;
}

const DraggableSectionWrapper = ({ id, label, children }: Props) => {
  const { editMode, sectionsVisible, toggleVisibility } = useEditMode();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const isHidden = sectionsVisible[id] === false;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : isHidden && editMode ? 0.4 : 1,
  };

  if (!editMode) {
    return <>{children}</>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      {/* Edit overlay border */}
      <div
        className="absolute -inset-3 rounded-xl pointer-events-none transition-all"
        style={{
          border: isDragging
            ? "2px solid hsl(var(--portfolio-accent, var(--primary)))"
            : "1px dashed hsl(var(--portfolio-border, var(--border)) / 0.6)",
          boxShadow: isDragging ? "0 8px 32px -8px hsl(var(--portfolio-accent, var(--primary)) / 0.25)" : "none",
        }}
      />

      {/* Controls bar */}
      <div
        className="absolute -top-3 -left-3 flex items-center gap-1.5 z-10 rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: "hsl(var(--portfolio-card, var(--card)) / 0.95)",
          border: "1px solid hsl(var(--portfolio-border, var(--border)) / 0.5)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-current/10 transition-colors"
          style={{ color: "hsl(var(--portfolio-fg, var(--foreground)))" }}
          aria-label={`Drag ${label}`}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Section label */}
        <span
          className="text-[10px] font-medium tracking-wide uppercase"
          style={{ color: "hsl(var(--portfolio-fg, var(--foreground)) / 0.6)" }}
        >
          {label}
        </span>

        {/* Visibility toggle */}
        <button
          onClick={() => toggleVisibility(id)}
          className="p-0.5 rounded hover:bg-current/10 transition-colors"
          style={{ color: "hsl(var(--portfolio-fg, var(--foreground)))" }}
          aria-label={isHidden ? `Show ${label}` : `Hide ${label}`}
        >
          {isHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>

      {children}
    </div>
  );
};

export default DraggableSectionWrapper;
