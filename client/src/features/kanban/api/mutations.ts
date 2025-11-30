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

export const UPDATE_IDEA_ORDER = gql`
  mutation UpdateIdeaOrder($swimlaneId: ID!, $ideaItemOrder: [ID!]!) {
    updateIdeaOrder(swimlaneId: $swimlaneId, ideaItemOrder: $ideaItemOrder) {
      id
      ideaItemOrder
    }
  }
`;

export const MOVE_IDEA = gql`
  mutation MoveIdea($id: ID!, $targetSwimlaneId: ID!, $newIndex: Int!) {
    moveIdea(
      id: $id
      targetSwimlaneId: $targetSwimlaneId
      newIndex: $newIndex
    ) {
      id
      swimlaneId
    }
  }
`;
