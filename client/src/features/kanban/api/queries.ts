import { gql } from "@apollo/client";

export const GET_KANBAN = gql`
  query GetKanban {
    kanban {
      id
      swimlaneOrder
      swimlanes {
        id
        name
        ideaItemOrder
        ideas {
          id
          name
          description
          swimlaneId
        }
      }
    }
  }
`;

