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
import type { Idea } from "../../types";
import { IdeaEditModal } from "./IdeaEdit.modal";
import { IdeaDeleteModal } from "./IdeaDelete.modal";
import styles from "./IdeaCard.module.css";

interface IdeaCardProps {
  idea: Idea;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <Box className={styles.card}>
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
