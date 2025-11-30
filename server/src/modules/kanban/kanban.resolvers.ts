import type { GraphQLContext } from "../../context";
import { KanbanService } from "./kanban.service";

export const kanbanResolvers = {
  Query: {
    kanban: (_: unknown, __: unknown, ctx: GraphQLContext) =>
      KanbanService.getOrCreateKanban(ctx),

    swimlanes: (_: unknown, __: unknown, ctx: GraphQLContext) =>
      KanbanService.listSwimlanes(ctx),

    swimlane: (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      KanbanService.getSwimlane(ctx, id),

    ideas: (_: unknown, __: unknown, ctx: GraphQLContext) =>
      KanbanService.listIdeas(ctx),

    idea: (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      KanbanService.getIdea(ctx, id),
  },

  Kanban: {
    swimlanes: async (
      parent: { swimlaneOrder: string[] },
      _: unknown,
      ctx: GraphQLContext
    ) => {
      const swimlanes = await ctx.prisma.swimlane.findMany({
        where: { id: { in: parent.swimlaneOrder } },
      });

      return parent.swimlaneOrder
        .map((id) => swimlanes.find((s) => s?.id === id))
        .filter(Boolean);
    },
  },

  Swimlane: {
    ideas: async (
      parent: { id: string; ideaItemOrder: string[] },
      _: unknown,
      ctx: GraphQLContext
    ) => {
      const ideas = await ctx.prisma.idea.findMany({
        where: { swimlaneId: parent.id },
      });

      return parent.ideaItemOrder
        .map((id) => ideas.find((i) => i?.id === id))
        .filter(Boolean);
    },
  },

  Mutation: {
    createSwimlane: (_: unknown, { name }: { name: string }, ctx: GraphQLContext) =>
      KanbanService.createSwimlane(ctx, name),

    updateSwimlane: (
      _: unknown,
      { id, name }: { id: string; name?: string },
      ctx: GraphQLContext
    ) => KanbanService.updateSwimlane(ctx, id, name),

    deleteSwimlane: (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      KanbanService.deleteSwimlane(ctx, id),

    updateSwimlaneOrder: (
      _: unknown,
      { swimlaneOrder }: { swimlaneOrder: string[] },
      ctx: GraphQLContext
    ) => KanbanService.updateSwimlaneOrder(ctx, swimlaneOrder),

    createIdea: (
      _: unknown,
      { name, description, swimlaneId }: { name: string; description?: string; swimlaneId: string },
      ctx: GraphQLContext
    ) => KanbanService.createIdea(ctx, name, swimlaneId, description),

    updateIdea: (
      _: unknown,
      { id, name, description }: { id: string; name?: string; description?: string },
      ctx: GraphQLContext
    ) => KanbanService.updateIdea(ctx, id, name, description),

    deleteIdea: (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      KanbanService.deleteIdea(ctx, id),

    moveIdea: (
      _: unknown,
      { id, targetSwimlaneId, newIndex }: { id: string; targetSwimlaneId: string; newIndex: number },
      ctx: GraphQLContext
    ) => KanbanService.moveIdea(ctx, id, targetSwimlaneId, newIndex),

    updateIdeaOrder: (
      _: unknown,
      { swimlaneId, ideaItemOrder }: { swimlaneId: string; ideaItemOrder: string[] },
      ctx: GraphQLContext
    ) => KanbanService.updateIdeaOrder(ctx, swimlaneId, ideaItemOrder),
  },
};

