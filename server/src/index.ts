import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// GraphQL schema definition
const typeDefs = `#graphql
  type Query {
    hello: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello: () => "Hello from Apollo Server!",
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
