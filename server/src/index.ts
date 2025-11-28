import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import prisma from "./db";

// GraphQL schema definition
const typeDefs = `#graphql
  type Draft {
    id: ID!
    content: String!
    userId: String
    order: Int!
    createdAt: String!
  }

  type Query {
    drafts: [Draft!]!
    draft(id: ID!): Draft
  }

  type Mutation {
    createDraft(content: String!, userId: String, order: Int!): Draft!
    updateDraft(id: ID!, content: String, order: Int): Draft!
    deleteDraft(id: ID!): Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    drafts: async () => {
      return await prisma.draft.findMany({
        orderBy: { order: "asc" },
      });
    },
    draft: async (_parent: unknown, { id }: { id: string }) => {
      return await prisma.draft.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createDraft: async (
      _parent: unknown,
      {
        content,
        userId,
        order,
      }: {
        content: string;
        userId?: string;
        order: number;
      }
    ) => {
      return await prisma.draft.create({
        data: {
          content,
          userId,
          order,
        },
      });
    },
    updateDraft: async (
      _parent: unknown,
      {
        id,
        content,
        order,
      }: {
        id: string;
        content?: string;
        order?: number;
      }
    ) => {
      return await prisma.draft.update({
        where: { id },
        data: {
          ...(content !== undefined && { content }),
          ...(order !== undefined && { order }),
        },
      });
    },
    deleteDraft: async (_parent: unknown, { id }: { id: string }) => {
      await prisma.draft.delete({
        where: { id },
      });
      return true;
    },
  },
};

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at: ${url}`);
}

startServer();
