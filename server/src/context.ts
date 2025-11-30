import type { PrismaClient } from "@prisma/client";
import { prisma } from "./db";

export type GraphQLContext = {
  prisma: PrismaClient;
};

export const createContext = async (): Promise<GraphQLContext> => ({
  prisma,
});

