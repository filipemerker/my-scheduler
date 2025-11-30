import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { GET_KANBAN } from "../api/queries";
import { UPDATE_SWIMLANE_ORDER } from "../api/mutations";
import type { GetKanbanData, Swimlane } from "../types";

export function useSwimlaneReorder(kanban: GetKanbanData["kanban"] | null) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [updateSwimlaneOrder] = useMutation(UPDATE_SWIMLANE_ORDER);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id || !kanban) return;

    const oldIndex = kanban.swimlanes.findIndex((s) => s.id === active.id);
    const newIndex = kanban.swimlanes.findIndex((s) => s.id === over.id);
    const newOrder = arrayMove(kanban.swimlanes, oldIndex, newIndex);

    // Optimistic cache update
    updateSwimlaneOrder({
      variables: { swimlaneOrder: newOrder.map((s) => s.id) },
      optimisticResponse: {
        updateSwimlaneOrder: {
          __typename: "Kanban",
          id: kanban.id,
          swimlaneOrder: newOrder.map((s) => s.id),
        },
      },
      update: (cache) => {
        cache.writeQuery<GetKanbanData>({
          query: GET_KANBAN,
          data: { kanban: { ...kanban, swimlanes: newOrder } },
        });
      },
    });
  };

  return { activeId, handleDragStart, handleDragEnd };
}
