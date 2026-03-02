"use client";

import type { Link } from "@/types";
import { LinkCard } from "./LinkCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

interface LinkListProps {
  links: Link[];
  onReorder: (orderedIds: number[]) => void;
  onEdit: (link: Link) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number, visible: boolean) => void;
}

export function LinkList({
  links,
  onReorder,
  onEdit,
  onDelete,
  onToggleVisibility,
}: LinkListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(links, oldIndex, newIndex);
    onReorder(reordered.map((l) => l.id));
  }

  if (links.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
        <p className="text-sm text-gray-500">No links yet. Add one above.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={links.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleVisibility={onToggleVisibility}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
