import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import * as Separator from "@radix-ui/react-separator";
import { Plus } from "lucide-react";
import { GET_KANBAN } from "../../api/queries";
import type { GetKanbanData } from "../../types";
import { useSwimlaneReorder } from "../../hooks/useSwimlaneReorder";
import { Swimlane } from "../Swimlane/Swimlane";
import { SwimlaneCreateModal } from "./SwimlaneCreate.modal";
import styles from "./IdeasPage.module.css";

export function IdeasPage() {
  const { data, loading } = useQuery<GetKanbanData>(GET_KANBAN);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { activeId, handleDragStart, handleDragEnd } = useSwimlaneReorder(
    data?.kanban ?? null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (loading) return <p className={styles.loading}>Loading...</p>;

  const swimlanes = data?.kanban?.swimlanes || [];
  const swimlaneIds = swimlanes.map((s) => s.id);
  const activeSwimlane = activeId
    ? swimlanes.find((s) => s.id === activeId)
    : null;
  const isAnyDragging = activeId !== null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ideas</h1>
      </header>

      <Separator.Root className={styles.separator} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragStart={handleDragStart}
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
          dropAnimation={null}
          modifiers={[restrictToHorizontalAxis]}
        >
          {activeSwimlane ? (
            <Swimlane swimlane={activeSwimlane} isDragOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      <SwimlaneCreateModal
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
