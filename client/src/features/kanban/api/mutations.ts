import { gql } from "@apollo/client";

export const CREATE_SWIMLANE = gql`
  mutation CreateSwimlane($name: String!) {
    createSwimlane(name: $name) {
      id
      name
      ideaItemOrder
    }
  }
`;

export const CREATE_IDEA = gql`
  mutation CreateIdea($name: String!, $description: String, $swimlaneId: ID!) {
    createIdea(
      name: $name
      description: $description
      swimlaneId: $swimlaneId
    ) {
      id
      name
      description
      swimlaneId
    }
  }
`;

export const DELETE_IDEA = gql`
  mutation DeleteIdea($id: ID!) {
    deleteIdea(id: $id)
  }
`;

export const DELETE_SWIMLANE = gql`
  mutation DeleteSwimlane($id: ID!) {
    deleteSwimlane(id: $id)
  }
`;

export const UPDATE_SWIMLANE = gql`
  mutation UpdateSwimlane($id: ID!, $name: String) {
    updateSwimlane(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_IDEA = gql`
  mutation UpdateIdea($id: ID!, $name: String, $description: String) {
    updateIdea(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const UPDATE_SWIMLANE_ORDER = gql`
  mutation UpdateSwimlaneOrder($swimlaneOrder: [ID!]!) {
    updateSwimlaneOrder(swimlaneOrder: $swimlaneOrder) {
      id
      swimlaneOrder
    }
  }
`;
