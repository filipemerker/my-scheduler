import { useState } from "react";
import { Box, Text, IconButton } from "@radix-ui/themes";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from "../../../../components/ui/Dropdown";
import type { Idea, Swimlane, Kanban } from "../../types";
import { IdeaEditModal } from "../IdeaCard/IdeaEdit.modal";
import { IdeaDeleteModal } from "../IdeaCard/IdeaDelete.modal";
import styles from "./GalleryView.module.css";

interface GalleryCardProps {
  idea: Idea;
  kanban: Kanban;
  setKanban: (kanban: Kanban) => void;
}

function GalleryCard({ idea, kanban, setKanban }: GalleryCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <Box className={styles.card}>
      <Text as="p" size="2" weight="bold">
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
            <IconButton variant="ghost" color="gray" size="1">
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
        kanban={kanban}
        setKanban={setKanban}
      />

      <IdeaDeleteModal
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        ideaId={idea.id}
        ideaName={idea.name}
        kanban={kanban}
        setKanban={setKanban}
      />
    </Box>
  );
}

interface GalleryViewProps {
  swimlanes: Swimlane[];
  kanban: Kanban;
  setKanban: (kanban: Kanban) => void;
}

export function GalleryView({
  swimlanes,
  kanban,
  setKanban,
}: GalleryViewProps) {
  // Flatten all ideas
  const allIdeas = swimlanes.flatMap((swimlane) => swimlane.ideas);

  if (allIdeas.length === 0) {
    return (
      <div className={styles.empty}>
        <Text size="3" color="gray">
          No ideas yet. Switch to Board view to create some!
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      {allIdeas.map((idea) => (
        <GalleryCard
          key={idea.id}
          idea={idea}
          kanban={kanban}
          setKanban={setKanban}
        />
      ))}
    </div>
  );
}
