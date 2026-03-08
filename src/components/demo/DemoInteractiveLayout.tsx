import { useState, ReactNode } from "react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff, RotateCcw } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import PortfolioSectionWrapper from "@/components/portfolio/PortfolioSectionWrapper";

interface DemoSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface SortableItemProps {
  id: string;
  title: string;
  isHidden: boolean;
  onToggle: () => void;
  children: ReactNode;
}

const SortableItem = ({ id, title, isHidden, onToggle, children }: SortableItemProps) => {
  const theme = usePortfolioTheme();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : isHidden ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group mb-10">
      {/* Dashed border overlay */}
      <div
        className="absolute -inset-3 rounded-xl pointer-events-none transition-all"
        style={{
          border: isDragging
            ? `2px solid ${theme.accentPrimary}`
            : `1px dashed ${theme.borderDefault}60`,
          boxShadow: isDragging ? `0 8px 32px -8px ${theme.accentGlow}` : "none",
        }}
      />
      {/* Controls */}
      <div
        className="absolute -top-3 -left-3 flex items-center gap-1.5 z-10 rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `${theme.bgElevated}f2`,
          border: `1px solid ${theme.borderDefault}80`,
          backdropFilter: "blur(8px)",
        }}
      >
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-0.5 rounded" style={{ color: theme.textPrimary }}>
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="text-[10px] font-medium tracking-wide uppercase" style={{ color: `${theme.textSecondary}99` }}>{title}</span>
        <button onClick={onToggle} className="p-0.5 rounded" style={{ color: theme.textPrimary }}>
          {isHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>
      {!isHidden && children}
      {isHidden && (
        <div className="py-8 text-center text-sm" style={{ color: theme.textTertiary }}>
          Section hidden — click the eye icon to show
        </div>
      )}
    </div>
  );
};

interface Props {
  sections: DemoSection[];
}

const DemoInteractiveLayout = ({ sections: initialSections }: Props) => {
  const theme = usePortfolioTheme();
  const [order, setOrder] = useState(initialSections.map(s => s.id));
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const sectionMap = Object.fromEntries(initialSections.map(s => [s.id, s]));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = order.indexOf(active.id as string);
    const newIdx = order.indexOf(over.id as string);
    if (oldIdx === -1 || newIdx === -1) return;
    const newOrder = [...order];
    newOrder.splice(oldIdx, 1);
    newOrder.splice(newIdx, 0, active.id as string);
    setOrder(newOrder);
    setHasChanges(true);
  };

  const toggleHidden = (id: string) => {
    setHidden(prev => ({ ...prev, [id]: !prev[id] }));
    setHasChanges(true);
  };

  const reset = () => {
    setOrder(initialSections.map(s => s.id));
    setHidden({});
    setHasChanges(false);
  };

  return (
    <>
      {/* Interactive banner */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-2.5 mb-6 rounded-xl"
        style={{
          background: `${theme.accentPrimary}12`,
          border: `1px solid ${theme.accentPrimary}30`,
        }}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4" style={{ color: theme.accentPrimary }} />
          <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
            <strong style={{ color: theme.accentPrimary }}>Try it:</strong> Drag sections to reorder, toggle visibility with the eye icon
          </span>
        </div>
        {hasChanges && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors"
            style={{ background: `${theme.accentPrimary}20`, color: theme.accentPrimary }}
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          {order.map((id, idx) => {
            const section = sectionMap[id];
            if (!section) return null;
            return (
              <SortableItem
                key={id}
                id={id}
                title={section.title}
                isHidden={!!hidden[id]}
                onToggle={() => toggleHidden(id)}
              >
                <PortfolioSectionWrapper title={section.title} index={idx}>
                  {section.content}
                </PortfolioSectionWrapper>
              </SortableItem>
            );
          })}
        </SortableContext>
      </DndContext>
    </>
  );
};

export default DemoInteractiveLayout;
