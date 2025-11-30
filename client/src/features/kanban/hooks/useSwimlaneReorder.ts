import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { UPDATE_SWIMLANE_ORDER } from "../api/mutations";
import type { Kanban } from "../types";

interface UseSwimlaneReorderProps {
  kanban: Kanban | null;
  setKanban: (kanban: Kanban) => void;
  startDragging: () => void;
  stopDragging: () => void;
  refetch: () => void;
}

export function useSwimlaneReorder({
  kanban,
  setKanban,
  startDragging,
  stopDragging,
  refetch,
}: UseSwimlaneReorderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [updateSwimlaneOrder] = useMutation(UPDATE_SWIMLANE_ORDER);

  const swimlaneDragStart = (event: DragStartEvent) => {
    startDragging();
    setActiveId(event.active.id as string);
  };

  const swimlaneDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !kanban) {
      setActiveId(null);
      stopDragging();
      return;
    }

    const oldIndex = kanban.swimlanes.findIndex((s) => s.id === active.id);
    const newIndex = kanban.swimlanes.findIndex((s) => s.id === over.id);
    const newOrder = arrayMove(kanban.swimlanes, oldIndex, newIndex);

    // Update local state synchronously - this makes drop animation work!
    setKanban({ ...kanban, swimlanes: newOrder });

    setActiveId(null);

    // Persist to server, only allow sync after mutation completes
    updateSwimlaneOrder({
      variables: { swimlaneOrder: newOrder.map((s) => s.id) },
    })
      .then(() => stopDragging())
      .catch(() => {
        stopDragging();
        refetch();
      });
  };

  return { activeId, swimlaneDragStart, swimlaneDragEnd };
}
