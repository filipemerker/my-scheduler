import { useState } from "react";
import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconButton, Button } from "@radix-ui/themes";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  GripHorizontalIcon,
} from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from "../../../../components/ui/Dropdown";
import type { Swimlane as SwimlaneType } from "../../types";
import { IdeaCard } from "../IdeaCard/IdeaCard";
import { IdeaCreateModal } from "./IdeaCreate.modal";
import { SwimlaneEditModal } from "./SwimlaneEdit.modal";
import { SwimlaneDeleteModal } from "./SwimlaneDelete.modal";
import styles from "./Swimlane.module.css";

interface SwimlaneProps {
  swimlane: SwimlaneType;
  isPlaceholder?: boolean;
  isDragOverlay?: boolean;
  isAnyDragging?: boolean;
}

export function Swimlane({
  swimlane,
  isPlaceholder = false,
  isDragOverlay = false,
  isAnyDragging = false,
}: SwimlaneProps) {
  const [ideaDialogOpen, setIdeaDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: swimlane.id,
      disabled: isDragOverlay,
      data: { type: "lane" },
    });

  // Only apply transition while any drag is active, not after drop
  const style = isDragOverlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition: isAnyDragging ? transition : undefined,
      };

  if (isPlaceholder) {
    return (
      <div ref={setNodeRef} style={style} className={styles.placeholder} />
    );
  }

  const classNames = [styles.swimlane];
  if (isDragOverlay) classNames.push(styles.dragOverlay);

  return (
    <div ref={setNodeRef} style={style} className={classNames.join(" ")}>
      <div className={styles.header} {...attributes} {...listeners}>
        <div className={styles.dragHandle}>
          <GripHorizontalIcon size={16} />
        </div>

        <span className={styles.title}>{swimlane.name}</span>
        <span className={styles.count}>{swimlane.ideas.length}</span>

        <IconButton
          variant="ghost"
          color="gray"
          size="1"
          onClick={(e) => {
            e.stopPropagation();
            setIdeaDialogOpen(true);
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Plus size={18} />
        </IconButton>

        <Dropdown>
          <DropdownTrigger>
            <IconButton
              variant="ghost"
              color="gray"
              size="1"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <MoreHorizontal size={18} />
            </IconButton>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem onSelect={() => setRenameDialogOpen(true)}>
              <Pencil size={14} />
              Rename
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem
              color="red"
              onSelect={() => setDeleteDialogOpen(true)}
            >
              <Trash2 size={14} />
              Delete
            </DropdownItem>
          </DropdownContent>
        </Dropdown>

        <SwimlaneEditModal
          open={renameDialogOpen}
          onOpenChange={setRenameDialogOpen}
          swimlaneId={swimlane.id}
          currentName={swimlane.name}
        />

        <SwimlaneDeleteModal
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          swimlaneId={swimlane.id}
          swimlaneName={swimlane.name}
        />

        <IdeaCreateModal
          open={ideaDialogOpen}
          onOpenChange={setIdeaDialogOpen}
          swimlaneId={swimlane.id}
        />
      </div>

      <div className={styles.ideas}>
        <SortableContext
          items={swimlane.ideas.map((idea) => idea.id)}
          strategy={verticalListSortingStrategy}
        >
          {swimlane.ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} swimlaneId={swimlane.id} />
          ))}
        </SortableContext>

        <Button
          className={styles.newIdeaButton}
          variant="ghost"
          color="gray"
          onClick={() => setIdeaDialogOpen(true)}
        >
          <Plus size={16} />
          New Idea
        </Button>
      </div>
    </div>
  );
}
