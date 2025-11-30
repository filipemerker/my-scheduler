import { arrayMove } from "@dnd-kit/sortable";
import type { Active, Over } from "@dnd-kit/core";
import type { Kanban, Idea, Swimlane } from "../types";

export interface DragItemData {
  type?: string;
  swimlaneId?: string;
}

export function getDragData(item: Active | Over | null): DragItemData | null {
  return (item?.data.current as DragItemData) ?? null;
}

export function getTargetLaneId(
  overData: DragItemData | null,
  overId: string
): string | null {
  if (overData?.type === "idea" && overData.swimlaneId) {
    return overData.swimlaneId;
  }
  if (overData?.type === "lane") {
    return overData.swimlaneId ?? overId;
  }
  return null;
}

export function findLaneById(
  kanban: Kanban,
  laneId: string
): Swimlane | undefined {
  return kanban.swimlanes.find((s) => s.id === laneId);
}

export function findLaneContainingIdea(
  kanban: Kanban,
  ideaId: string
): Swimlane | undefined {
  return kanban.swimlanes.find((s) => s.ideas.some((i) => i.id === ideaId));
}

export function findIdeaIndex(lane: Swimlane, ideaId: string): number {
  return lane.ideas.findIndex((i) => i.id === ideaId);
}

export function updateLaneIdeas(
  kanban: Kanban,
  laneId: string,
  newIdeas: Idea[]
): Kanban {
  return {
    ...kanban,
    swimlanes: kanban.swimlanes.map((s) =>
      s.id === laneId ? { ...s, ideas: newIdeas } : s
    ),
  };
}

export function reorderIdeasInLane(
  kanban: Kanban,
  laneId: string,
  oldIndex: number,
  newIndex: number
): Kanban {
  const lane = findLaneById(kanban, laneId);
  if (!lane) return kanban;

  const newIdeas = arrayMove(lane.ideas, oldIndex, newIndex);
  return updateLaneIdeas(kanban, laneId, newIdeas);
}

export interface CrossLaneMoveResult {
  kanban: Kanban;
  movedIdea: Idea;
}

export function moveIdeaBetweenLanes(
  kanban: Kanban,
  ideaId: string,
  sourceLaneId: string,
  targetLaneId: string,
  insertIndex: number
): CrossLaneMoveResult | null {
  const sourceLane = findLaneById(kanban, sourceLaneId);
  const targetLane = findLaneById(kanban, targetLaneId);

  if (!sourceLane || !targetLane) return null;

  const ideaIndex = findIdeaIndex(sourceLane, ideaId);
  if (ideaIndex === -1) return null;

  const movedIdea = {
    ...sourceLane.ideas[ideaIndex],
    swimlaneId: targetLaneId,
  };
  const newSourceIdeas = sourceLane.ideas.filter((i) => i.id !== ideaId);
  const newTargetIdeas = [
    ...targetLane.ideas.slice(0, insertIndex),
    movedIdea,
    ...targetLane.ideas.slice(insertIndex),
  ];

  const newKanban: Kanban = {
    ...kanban,
    swimlanes: kanban.swimlanes.map((s) => {
      if (s.id === sourceLaneId) return { ...s, ideas: newSourceIdeas };
      if (s.id === targetLaneId) return { ...s, ideas: newTargetIdeas };
      return s;
    }),
  };

  return { kanban: newKanban, movedIdea };
}

export function isIdeaDrag(data: DragItemData | null): boolean {
  return data?.type === "idea" && !!data.swimlaneId;
}

export function isAlreadyInLane(lane: Swimlane, ideaId: string): boolean {
  return lane.ideas.some((i) => i.id === ideaId);
}

export function shouldSkipReorder(oldIndex: number, newIndex: number): boolean {
  return oldIndex === -1 || newIndex === -1 || oldIndex === newIndex;
}
