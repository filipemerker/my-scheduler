import { useState, useRef } from "react";
import { useMutation } from "@apollo/client/react";
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { UPDATE_IDEA_ORDER, MOVE_IDEA } from "../api/mutations";
import type { Kanban } from "../types";
import {
  getDragData,
  getTargetLaneId,
  findLaneById,
  findLaneContainingIdea,
  findIdeaIndex,
  reorderIdeasInLane,
  moveIdeaBetweenLanes,
  isIdeaDrag,
  isAlreadyInLane,
  shouldSkipReorder,
} from "./useIdeaReorder.utils";

interface UseIdeaReorderProps {
  kanban: Kanban | null;
  setKanban: (
    kanban: Kanban | ((prev: Kanban | null) => Kanban | null)
  ) => void;
}

export function useIdeaReorder({ kanban, setKanban }: UseIdeaReorderProps) {
  const [updateIdeaOrder] = useMutation(UPDATE_IDEA_ORDER);
  const [moveIdea] = useMutation(MOVE_IDEA);
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(null);
  const sourceLaneIdRef = useRef<string | null>(null);

  const ideaDragStart = (event: DragStartEvent) => {
    const data = getDragData(event.active);
    if (!isIdeaDrag(data)) return;

    setActiveIdeaId(event.active.id as string);
    sourceLaneIdRef.current = data!.swimlaneId!;
  };

  const ideaDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !kanban) return;

    const activeData = getDragData(active);
    const overData = getDragData(over);

    if (!isIdeaDrag(activeData)) return;

    const activeId = active.id as string;
    const activeLaneId = activeData!.swimlaneId!;
    const targetLaneId = getTargetLaneId(overData, over.id as string);

    if (!targetLaneId || activeLaneId === targetLaneId) return;

    setKanban((prev) => {
      if (!prev) return prev;

      const targetLane = findLaneById(prev, targetLaneId);
      if (!targetLane || isAlreadyInLane(targetLane, activeId)) return prev;

      let insertIndex = targetLane.ideas.length;
      if (overData?.type === "idea") {
        const overIndex = findIdeaIndex(targetLane, over.id as string);
        if (overIndex !== -1) insertIndex = overIndex;
      }

      const result = moveIdeaBetweenLanes(
        prev,
        activeId,
        activeLaneId,
        targetLaneId,
        insertIndex
      );

      return result?.kanban ?? prev;
    });

    activeData!.swimlaneId = targetLaneId;
  };

  const ideaDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id as string;

    setActiveIdeaId(null);

    if (!kanban || !sourceLaneIdRef.current) return;

    const originalSourceLaneId = sourceLaneIdRef.current;
    sourceLaneIdRef.current = null;

    const currentLane = findLaneContainingIdea(kanban, activeId);
    if (!currentLane) return;

    const laneChanged = originalSourceLaneId !== currentLane.id;

    if (laneChanged) {
      handleCrossLaneEnd(activeId, currentLane.id, over);
    } else {
      handleSameLaneEnd(activeId, currentLane.id, over);
    }
  };

  const handleCrossLaneEnd = (
    activeId: string,
    currentLaneId: string,
    over: DragEndEvent["over"]
  ) => {
    if (over && over.id !== activeId) {
      const overData = getDragData(over);
      if (overData?.type === "idea" && kanban) {
        const lane = findLaneById(kanban, currentLaneId);
        if (lane) {
          const oldIndex = findIdeaIndex(lane, activeId);
          const newIndex = findIdeaIndex(lane, over.id as string);

          if (!shouldSkipReorder(oldIndex, newIndex)) {
            setKanban(
              reorderIdeasInLane(kanban, currentLaneId, oldIndex, newIndex)
            );
          }
        }
      }
    }

    const finalLane = kanban ? findLaneContainingIdea(kanban, activeId) : null;
    const newIndex = finalLane ? findIdeaIndex(finalLane, activeId) : 0;

    moveIdea({
      variables: {
        id: activeId,
        targetSwimlaneId: currentLaneId,
        newIndex,
      },
    });
  };

  const handleSameLaneEnd = (
    activeId: string,
    currentLaneId: string,
    over: DragEndEvent["over"]
  ) => {
    if (!over || over.id === activeId || !kanban) return;

    const lane = findLaneById(kanban, currentLaneId);
    if (!lane) return;

    const oldIndex = findIdeaIndex(lane, activeId);
    const newIndex = findIdeaIndex(lane, over.id as string);

    if (shouldSkipReorder(oldIndex, newIndex)) return;

    const updatedKanban = reorderIdeasInLane(
      kanban,
      currentLaneId,
      oldIndex,
      newIndex
    );
    const newIdeaItemOrder = findLaneById(
      updatedKanban,
      currentLaneId
    )!.ideas.map((i) => i.id);

    setKanban(updatedKanban);

    updateIdeaOrder({
      variables: {
        swimlaneId: currentLaneId,
        ideaItemOrder: newIdeaItemOrder,
      },
    });
  };

  return { activeIdeaId, ideaDragStart, ideaDragOver, ideaDragEnd };
}
