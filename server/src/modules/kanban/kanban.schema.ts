import gql from "graphql-tag";

export const kanbanTypeDefs = gql`
  type Idea {
    id: ID!
    name: String!
    description: String
    swimlaneId: ID!
    createdAt: String!
  }

  type Swimlane {
    id: ID!
    name: String!
    ideaItemOrder: [ID!]!
    ideas: [Idea!]!
    createdAt: String!
  }

  type Kanban {
    id: ID!
    swimlaneOrder: [ID!]!
    swimlanes: [Swimlane!]!
  }

  type Query {
    kanban: Kanban
    swimlanes: [Swimlane!]!
    swimlane(id: ID!): Swimlane
    ideas: [Idea!]!
    idea(id: ID!): Idea
  }

  type Mutation {
    createSwimlane(name: String!): Swimlane!
    updateSwimlane(id: ID!, name: String): Swimlane!
    deleteSwimlane(id: ID!): Boolean!

    createIdea(name: String!, description: String, swimlaneId: ID!): Idea!
    updateIdea(id: ID!, name: String, description: String): Idea!
    deleteIdea(id: ID!): Boolean!
    moveIdea(id: ID!, targetSwimlaneId: ID!, newIndex: Int!): Idea!

    updateSwimlaneOrder(swimlaneOrder: [ID!]!): Kanban!
    updateIdeaOrder(swimlaneId: ID!, ideaItemOrder: [ID!]!): Swimlane!
  }
`;
