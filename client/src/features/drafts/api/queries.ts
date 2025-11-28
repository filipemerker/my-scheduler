import { gql } from "@apollo/client";

export const GET_DRAFTS = gql`
  query GetDrafts {
    drafts {
      id
      content
      order
      createdAt
    }
  }
`;
