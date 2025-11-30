import type { GraphQLContext } from "../../context";

// Valid MongoDB ObjectId (24-char hex) for the singleton kanban board
const KANBAN_ID = "000000000000000000000001";

export const KanbanService = {
  // Queries
  getOrCreateKanban: ({ prisma }: GraphQLContext) =>
    prisma.kanban.upsert({
      where: { id: KANBAN_ID },
      create: { id: KANBAN_ID, swimlaneOrder: [] },
      update: {},
    }),

  listSwimlanes: ({ prisma }: GraphQLContext) => prisma.swimlane.findMany(),

  getSwimlane: ({ prisma }: GraphQLContext, id: string) =>
    prisma.swimlane.findUnique({ where: { id } }),

  listIdeas: ({ prisma }: GraphQLContext) => prisma.idea.findMany(),

  getIdea: ({ prisma }: GraphQLContext, id: string) =>
    prisma.idea.findUnique({ where: { id } }),

  // Swimlane mutations
  createSwimlane: ({ prisma }: GraphQLContext, name: string) =>
    prisma.$transaction(async (tx) => {
      const swimlane = await tx.swimlane.create({
        data: { name, ideaItemOrder: [] },
      });

      await tx.kanban.upsert({
        where: { id: KANBAN_ID },
        create: { id: KANBAN_ID, swimlaneOrder: [swimlane.id] },
        update: { swimlaneOrder: { push: swimlane.id } },
      });

      return swimlane;
    }),

  updateSwimlane: ({ prisma }: GraphQLContext, id: string, name?: string) =>
    prisma.swimlane.update({
      where: { id },
      data: { ...(name && { name }) },
    }),

  deleteSwimlane: ({ prisma }: GraphQLContext, id: string) =>
    prisma.$transaction(async (tx) => {
      await tx.idea.deleteMany({ where: { swimlaneId: id } });
      await tx.swimlane.delete({ where: { id } });

      const kanban = await tx.kanban.findUnique({ where: { id: KANBAN_ID } });
      if (kanban) {
        await tx.kanban.update({
          where: { id: KANBAN_ID },
          data: {
            swimlaneOrder: kanban.swimlaneOrder.filter((sid) => sid !== id),
          },
        });
      }

      return true;
    }),

  updateSwimlaneOrder: ({ prisma }: GraphQLContext, swimlaneOrder: string[]) =>
    prisma.kanban.upsert({
      where: { id: KANBAN_ID },
      create: { id: KANBAN_ID, swimlaneOrder },
      update: { swimlaneOrder },
    }),

  // Idea mutations
  createIdea: (
    { prisma }: GraphQLContext,
    name: string,
    swimlaneId: string,
    description?: string
  ) =>
    prisma.$transaction(async (tx) => {
      const idea = await tx.idea.create({
        data: { name, description, swimlaneId },
      });

      await tx.swimlane.update({
        where: { id: swimlaneId },
        data: { ideaItemOrder: { push: idea.id } },
      });

      return idea;
    }),

  updateIdea: (
    { prisma }: GraphQLContext,
    id: string,
    name?: string,
    description?: string
  ) =>
    prisma.idea.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    }),

  deleteIdea: ({ prisma }: GraphQLContext, id: string) =>
    prisma.$transaction(async (tx) => {
      const idea = await tx.idea.findUnique({
        where: { id },
        select: { swimlaneId: true },
      });

      if (!idea) throw new Error("Idea not found");

      const swimlane = await tx.swimlane.findUnique({
        where: { id: idea.swimlaneId },
        select: { ideaItemOrder: true },
      });

      if (swimlane) {
        await tx.swimlane.update({
          where: { id: idea.swimlaneId },
          data: {
            ideaItemOrder: swimlane.ideaItemOrder.filter((iid) => iid !== id),
          },
        });
      }

      await tx.idea.delete({ where: { id } });
      return true;
    }),

  moveIdea: (
    { prisma }: GraphQLContext,
    id: string,
    targetSwimlaneId: string,
    newIndex: number
  ) =>
    prisma.$transaction(async (tx) => {
      const idea = await tx.idea.findUnique({
        where: { id },
        select: { swimlaneId: true },
      });
      if (!idea) throw new Error("Idea not found");

      const oldLane = await tx.swimlane.findUnique({
        where: { id: idea.swimlaneId },
        select: { ideaItemOrder: true },
      });

      if (oldLane) {
        await tx.swimlane.update({
          where: { id: idea.swimlaneId },
          data: {
            ideaItemOrder: oldLane.ideaItemOrder.filter((iid) => iid !== id),
          },
        });
      }

      const targetLane = await tx.swimlane.findUnique({
        where: { id: targetSwimlaneId },
        select: { ideaItemOrder: true },
      });
      if (!targetLane) throw new Error("Target lane not found");

      const newOrder = [...targetLane.ideaItemOrder];
      newOrder.splice(newIndex, 0, id);

      await tx.swimlane.update({
        where: { id: targetSwimlaneId },
        data: { ideaItemOrder: newOrder },
      });

      return tx.idea.update({
        where: { id },
        data: { swimlaneId: targetSwimlaneId },
      });
    }),

  updateIdeaOrder: (
    { prisma }: GraphQLContext,
    swimlaneId: string,
    ideaItemOrder: string[]
  ) =>
    prisma.swimlane.update({
      where: { id: swimlaneId },
      data: { ideaItemOrder },
    }),
};
