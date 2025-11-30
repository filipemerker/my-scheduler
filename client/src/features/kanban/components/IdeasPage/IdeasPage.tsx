import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  type DropAnimation,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import * as Separator from "@radix-ui/react-separator";
import { Plus } from "lucide-react";
import { GET_KANBAN } from "../../api/queries";
import type { GetKanbanData } from "../../types";
import { useSwimlaneReorder } from "../../hooks/useSwimlaneReorder";
import { useLocalKanban } from "../../hooks/useLocalKanban";
import { useIdeaReorder } from "../../hooks/useIdeaReorder";
import { Swimlane } from "../Swimlane/Swimlane";
import { IdeaCardPreview } from "../IdeaCard/IdeaCard";
import { SwimlaneCreateModal } from "./SwimlaneCreate.modal";
import { KanbanSkeleton } from "../Skeleton";
import styles from "./IdeasPage.module.css";

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

export function IdeasPage() {
  const { data, loading, refetch } = useQuery<GetKanbanData>(GET_KANBAN);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Local state for synchronous sorting updates
  const { kanban, setKanban, startDragging, stopDragging } = useLocalKanban(
    data?.kanban
  );

  const { activeId, swimlaneDragStart, swimlaneDragEnd } = useSwimlaneReorder({
    kanban,
    setKanban,
    startDragging,
    stopDragging,
    refetch,
  });

  const { activeIdeaId, ideaDragStart, ideaDragOver, ideaDragEnd } =
    useIdeaReorder({
      kanban,
      setKanban,
      startDragging,
      stopDragging,
      refetch,
    });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const restrictToLaneAxis = (
    args: Parameters<typeof restrictToHorizontalAxis>[0]
  ) => {
    const type = args.active?.data.current?.type;
    // For lanes, keep the existing horizontal-only behavior
    if (type === "lane") {
      return restrictToHorizontalAxis(args);
    }
    // For ideas (and anything else), don't restrict movement
    return args.transform;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const type = event.active.data.current?.type;
    if (type === "lane") swimlaneDragStart(event);
    if (type === "idea") ideaDragStart(event);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const type = event.active.data.current?.type;
    if (type === "idea") ideaDragOver(event);
    // lanes don't need dragOver logic
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const type = event.active.data.current?.type;
    if (type === "lane") swimlaneDragEnd(event);
    if (type === "idea") ideaDragEnd(event);
  };

  if (loading || !kanban) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Ideas</h1>
        </header>

        <Separator.Root className={styles.separator} />

        <KanbanSkeleton />
      </div>
    );
  }

  const swimlanes = kanban.swimlanes;
  const swimlaneIds = swimlanes.map((s) => s.id);
  const activeSwimlane = activeId
    ? swimlanes.find((s) => s.id === activeId)
    : null;

  const activeIdea = activeIdeaId
    ? swimlanes.flatMap((s) => s.ideas).find((i) => i.id === activeIdeaId)
    : null;

  const isAnyDragging = activeId !== null || activeIdeaId !== null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ideas</h1>
      </header>

      <Separator.Root className={styles.separator} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToLaneAxis]}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={swimlaneIds}
          strategy={horizontalListSortingStrategy}
        >
          <div className={styles.board}>
            {swimlanes.map((swimlane) => (
              <Swimlane
                key={swimlane.id}
                swimlane={swimlane}
                isPlaceholder={swimlane.id === activeId}
                isAnyDragging={isAnyDragging}
              />
            ))}

            <button
              className={styles.addColumnButton}
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus size={18} />
              New Group
            </button>
          </div>
        </SortableContext>

        <DragOverlay
          dropAnimation={dropAnimation}
          modifiers={[restrictToLaneAxis]}
        >
          {activeSwimlane ? (
            <Swimlane swimlane={activeSwimlane} isDragOverlay />
          ) : null}

          {activeIdea ? <IdeaCardPreview idea={activeIdea} /> : null}
        </DragOverlay>
      </DndContext>

      <SwimlaneCreateModal
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
