export interface Idea {
  id: string;
  name: string;
  description?: string;
  swimlaneId: string;
  createdAt: string;
}

export interface Swimlane {
  id: string;
  name: string;
  ideaItemOrder: string[];
  ideas: Idea[];
  createdAt: string;
}

export interface Kanban {
  id: string;
  swimlaneOrder: string[];
  swimlanes: Swimlane[];
}

export interface GetKanbanData {
  kanban: Kanban | null;
}

export interface CreateSwimlaneData {
  createSwimlane: Swimlane;
}

export interface CreateIdeaData {
  createIdea: Idea;
}

export interface DeleteIdeaData {
  deleteIdea: boolean;
}
