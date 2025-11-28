export interface Draft {
  id: string;
  content: string;
  order: number;
  createdAt: string;
}

export interface GetDraftsData {
  drafts: Draft[];
}

export interface CreateDraftVariables {
  content: string;
  order: number;
}

export interface CreateDraftData {
  createDraft: Draft;
}

export interface DeleteDraftVariables {
  id: string;
}

export interface DeleteDraftData {
  deleteDraft: boolean;
}
