import type { Kanban, Swimlane, Idea } from "../types";

export function createLocalSwimlane(
  kanban: Kanban,
  swimlane: Swimlane
): Kanban {
  return {
    ...kanban,
    swimlanes: [...kanban.swimlanes, swimlane],
    swimlaneOrder: [...kanban.swimlaneOrder, swimlane.id],
  };
}

export function deleteLocalSwimlane(kanban: Kanban, swimlaneId: string): Kanban {
  return {
    ...kanban,
    swimlanes: kanban.swimlanes.filter((s) => s.id !== swimlaneId),
    swimlaneOrder: kanban.swimlaneOrder.filter((id) => id !== swimlaneId),
  };
}

export function renameLocalSwimlane(
  kanban: Kanban,
  swimlaneId: string,
  name: string
): Kanban {
  return {
    ...kanban,
    swimlanes: kanban.swimlanes.map((s) =>
      s.id === swimlaneId ? { ...s, name } : s
    ),
  };
}

export function createLocalIdea(
  kanban: Kanban,
  swimlaneId: string,
  idea: Idea
): Kanban {
  return {
    ...kanban,
    swimlanes: kanban.swimlanes.map((s) =>
      s.id === swimlaneId
        ? {
            ...s,
            ideas: [...s.ideas, idea],
            ideaItemOrder: [...s.ideaItemOrder, idea.id],
          }
        : s
    ),
  };
}

export function deleteLocalIdea(kanban: Kanban, ideaId: string): Kanban {
  return {
    ...kanban,
    swimlanes: kanban.swimlanes.map((s) => ({
      ...s,
      ideas: s.ideas.filter((i) => i.id !== ideaId),
      ideaItemOrder: s.ideaItemOrder.filter((id) => id !== ideaId),
    })),
  };
}

export function renameLocalIdea(
  kanban: Kanban,
  ideaId: string,
  name: string,
  description?: string
): Kanban {
  return {
    ...kanban,
    swimlanes: kanban.swimlanes.map((s) => ({
      ...s,
      ideas: s.ideas.map((i) =>
        i.id === ideaId
          ? { ...i, name, description: description ?? i.description }
          : i
      ),
    })),
  };
}

