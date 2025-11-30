import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Text, IconButton } from "@radix-ui/themes";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from "../../../../components/ui/Dropdown";
import type { Idea } from "../../types";
import { IdeaEditModal } from "./IdeaEdit.modal";
import { IdeaDeleteModal } from "./IdeaDelete.modal";
import styles from "./IdeaCard.module.css";

interface IdeaCardPreviewProps {
  idea: Idea;
}

export function IdeaCardPreview({ idea }: IdeaCardPreviewProps) {
  return (
    <Box className={`${styles.card} ${styles.dragOverlay}`}>
      <Text as="p" size="3" weight="bold">
        {idea.name}
      </Text>

      {idea.description && (
        <Text as="p" size="1" color="gray" mt="1">
          {idea.description}
        </Text>
      )}

      <div className={styles.menuWrapper}>
        <IconButton variant="ghost" color="gray" size="1">
          <MoreHorizontal size={16} />
        </IconButton>
      </div>
    </Box>
  );
}

interface IdeaCardProps {
  idea: Idea;
  swimlaneId: string;
}

export function IdeaCard({ idea, swimlaneId }: IdeaCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: idea.id,
      data: {
        type: "idea",
        swimlaneId,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : undefined,
    zIndex: isDragging ? 1 : 0,
  };

  const cardClasses = isDragging
    ? `${styles.card} ${styles.placeholder}`
    : styles.card;

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cardClasses}
    >
      <Text as="p" size="3" weight="bold">
        {idea.name}
      </Text>

      {idea.description && (
        <Text as="p" size="1" color="gray" mt="1">
          {idea.description}
        </Text>
      )}

      <div
        className={`${styles.menuWrapper} ${menuOpen ? styles.menuOpen : ""}`}
      >
        <Dropdown open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownTrigger>
            <IconButton
              variant="ghost"
              color="gray"
              size="1"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <MoreHorizontal size={16} />
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
      </div>

      <IdeaEditModal
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        ideaId={idea.id}
        currentName={idea.name}
      />

      <IdeaDeleteModal
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        ideaId={idea.id}
        ideaName={idea.name}
      />
    </Box>
  );
}
