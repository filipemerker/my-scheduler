import { useState } from "react";
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
import { Plus } from "lucide-react";
import type { Kanban } from "../../types";
import { useSwimlaneReorder } from "../../hooks/useSwimlaneReorder";
import { useIdeaReorder } from "../../hooks/useIdeaReorder";
import { Swimlane } from "../Swimlane/Swimlane";
import { IdeaCardPreview } from "../IdeaCard/IdeaCard";
import { SwimlaneCreateModal } from "../IdeasPage/SwimlaneCreate.modal";
import styles from "./KanbanView.module.css";

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0.5" } },
  }),
};

interface KanbanViewProps {
  kanban: Kanban;
  setKanban: React.Dispatch<React.SetStateAction<Kanban | null>>;
}

export function KanbanView({ kanban, setKanban }: KanbanViewProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { activeId, swimlaneDragStart, swimlaneDragEnd } = useSwimlaneReorder({
    kanban,
    setKanban,
  });

  const { activeIdeaId, ideaDragStart, ideaDragOver, ideaDragEnd } =
    useIdeaReorder({
      kanban,
      setKanban,
    });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const restrictToLaneAxis = (
    args: Parameters<typeof restrictToHorizontalAxis>[0]
  ) => {
    if (args.active?.data.current?.type === "lane") {
      return restrictToHorizontalAxis(args);
    }
    return args.transform;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const type = event.active.data.current?.type;
    if (type === "lane") swimlaneDragStart(event);
    if (type === "idea") ideaDragStart(event);
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (event.active.data.current?.type === "idea") ideaDragOver(event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const type = event.active.data.current?.type;
    if (type === "lane") swimlaneDragEnd(event);
    if (type === "idea") ideaDragEnd(event);
  };

  const swimlanes = kanban.swimlanes;
  const swimlaneIds = swimlanes.map((s) => s.id);
  const activeSwimlane = activeId
    ? swimlanes.find((s) => s.id === activeId)
    : null;
  const activeIdea = activeIdeaId
    ? swimlanes.flatMap((s) => s.ideas).find((i) => i.id === activeIdeaId)
    : null;
  const isAnyDragging = activeId !== null || activeIdeaId !== null;
  const isLaneLimitReached = swimlanes.length >= 10;

  return (
    <>
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
                kanban={kanban}
                setKanban={setKanban}
              />
            ))}

            <button
              className={styles.addColumnButton}
              disabled={isLaneLimitReached}
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
          {activeSwimlane && (
            <Swimlane
              swimlane={activeSwimlane}
              isDragOverlay
              kanban={kanban}
              setKanban={setKanban}
            />
          )}
          {activeIdea && <IdeaCardPreview idea={activeIdea} />}
        </DragOverlay>
      </DndContext>

      <SwimlaneCreateModal
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        kanban={kanban}
        setKanban={setKanban}
      />
    </>
  );
}
