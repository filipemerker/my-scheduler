import { ApolloServer } from "@apollo/server";
import { kanbanTypeDefs } from "./modules/kanban/kanban.schema";
import { kanbanResolvers } from "./modules/kanban/kanban.resolvers";

export const server = new ApolloServer({
  typeDefs: [kanbanTypeDefs],
  resolvers: [kanbanResolvers],
  introspection: true,
});
