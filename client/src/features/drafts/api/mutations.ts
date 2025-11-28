import { gql } from "@apollo/client";

export const CREATE_DRAFT = gql`
  mutation CreateDraft($content: String!, $order: Int!) {
    createDraft(content: $content, order: $order) {
      id
      content
      order
      createdAt
    }
  }
`;

export const DELETE_DRAFT = gql`
  mutation DeleteDraft($id: ID!) {
    deleteDraft(id: $id)
  }
`;
