import { PrismaClient } from '@prisma/client';

// Singleton pattern to avoid multiple Prisma Client instances in development
// This is especially important with hot-reload in ts-node-dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

