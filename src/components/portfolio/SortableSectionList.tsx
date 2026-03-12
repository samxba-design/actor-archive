import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useEditMode } from "./EditModeProvider";
import DraggableSectionWrapper from "./DraggableSectionWrapper";
import PortfolioSection from "./PortfolioSection";
import { ReactNode } from "react";

interface SectionItem {
  key: string;
  label: string;
}

interface Props {
  allSections: SectionItem[];
  profileId: string;
  profileType: string | null;
  profileSlug?: string;
  bio?: string | null;
}

const SortableSectionList = ({ allSections, profileId, profileType, profileSlug }: Props) => {
  const { editMode, sectionOrder, setSectionOrder, sectionsVisible } = useEditMode();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sectionOrder.indexOf(active.id as string);
    const newIndex = sectionOrder.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = [...sectionOrder];
    newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, active.id as string);
    setSectionOrder(newOrder);
  };

  // In edit mode: show ALL sections (including hidden ones, dimmed)
  // In view mode: show only visible sections
  const displaySections = editMode
    ? sectionOrder
    : sectionOrder.filter((key) => sectionsVisible[key] !== false);

  const sectionLabelMap = Object.fromEntries(allSections.map((s) => [s.key, s.label]));

  if (!editMode) {
    return (
      <>
        {displaySections
          .filter((key) => key !== "hero" && key !== "contact")
          .map((sectionKey, idx) => (
            <PortfolioSection
              key={sectionKey}
              sectionKey={sectionKey}
              profileId={profileId}
              profileType={profileType}
              profileSlug={profileSlug}
              sectionIndex={idx}
            />
          ))}
      </>
    );
  }

  const editSections = displaySections.filter((key) => key !== "hero" && key !== "contact");

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={editSections} strategy={verticalListSortingStrategy}>
        {editSections.map((sectionKey, idx) => (
          <DraggableSectionWrapper
            key={sectionKey}
            id={sectionKey}
            label={sectionLabelMap[sectionKey] || sectionKey}
          >
            <PortfolioSection
              sectionKey={sectionKey}
              profileId={profileId}
              profileType={profileType}
              profileSlug={profileSlug}
              sectionIndex={idx}
            />
          </DraggableSectionWrapper>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default SortableSectionList;
