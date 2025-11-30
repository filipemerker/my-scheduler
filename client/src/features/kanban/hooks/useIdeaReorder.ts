import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { arrayMove } from "@dnd-kit/sortable";
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { UPDATE_IDEA_ORDER } from "../api/mutations";
import type { Kanban } from "../types";

interface UseIdeaReorderProps {
  kanban: Kanban | null;
  setKanban: (kanban: Kanban) => void;
  startDragging: () => void;
  stopDragging: () => void;
  refetch: () => void;
}

export function useIdeaReorder({
  kanban,
  setKanban,
  startDragging,
  stopDragging,
  refetch,
}: UseIdeaReorderProps) {
  const [updateIdeaOrder] = useMutation(UPDATE_IDEA_ORDER);
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(null);

  const ideaDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.type !== "idea") return;
    startDragging();
    setActiveIdeaId(event.active.id as string);
  };

  const ideaDragOver = (_event: DragOverEvent) => {
    // For this first step (within-lane only), keep this as a no-op.
    // Cross-lane movement will be implemented later here.
  };

  const ideaDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !kanban) {
      setActiveIdeaId(null);
      return;
    }

    const activeData = active.data.current as {
      type?: string;
      swimlaneId?: string;
    } | null;
    const overData = over.data.current as { swimlaneId?: string } | null;

    // Only handle ideas, and only when dropped within the same lane
    if (!activeData || activeData.type !== "idea") {
      setActiveIdeaId(null);
      return;
    }
    if (!overData || overData.swimlaneId !== activeData.swimlaneId) {
      setActiveIdeaId(null);
      return;
    }

    const laneId = activeData.swimlaneId;
    const lane = kanban.swimlanes.find((s) => s.id === laneId);
    if (!lane) {
      setActiveIdeaId(null);
      return;
    }

    const oldIndex = lane.ideas.findIndex((i) => i.id === active.id);
    const newIndex = lane.ideas.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
      setActiveIdeaId(null);
      return;
    }

    const newIdeas = arrayMove(lane.ideas, oldIndex, newIndex);
    const newIdeaItemOrder = newIdeas.map((i) => i.id);

    // Update local state synchronously - this makes drop animation work!
    setKanban({
      ...kanban,
      swimlanes: kanban.swimlanes.map((s) =>
        s.id === lane.id ? { ...s, ideas: newIdeas } : s
      ),
    });

    setActiveIdeaId(null);

    // Persist to server, only allow sync after mutation completes
    updateIdeaOrder({
      variables: { swimlaneId: lane.id, ideaItemOrder: newIdeaItemOrder },
    })
      .then(() => stopDragging())
      .catch(() => {
        stopDragging();
        refetch();
      });
  };

  return { activeIdeaId, ideaDragStart, ideaDragOver, ideaDragEnd };
}
