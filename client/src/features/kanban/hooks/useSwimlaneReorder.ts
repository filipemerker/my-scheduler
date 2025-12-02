import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { UPDATE_SWIMLANE_ORDER } from "../api/mutations";
import type { Kanban } from "../types";

interface UseSwimlaneReorderProps {
  kanban: Kanban | null;
  setKanban: (kanban: Kanban) => void;
}

export function useSwimlaneReorder({
  kanban,
  setKanban,
}: UseSwimlaneReorderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [updateSwimlaneOrder] = useMutation(UPDATE_SWIMLANE_ORDER);

  const swimlaneDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const swimlaneDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || active.id === over.id || !kanban) return;

    const oldIndex = kanban.swimlanes.findIndex((s) => s.id === active.id);
    const newIndex = kanban.swimlanes.findIndex((s) => s.id === over.id);
    const newOrder = arrayMove(kanban.swimlanes, oldIndex, newIndex);

    setKanban({ ...kanban, swimlanes: newOrder });

    updateSwimlaneOrder({
      variables: { swimlaneOrder: newOrder.map((s) => s.id) },
    });
  };

  return { activeId, swimlaneDragStart, swimlaneDragEnd };
}
