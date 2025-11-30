import { useState } from "react";
import { IconButton, Button } from "@radix-ui/themes";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
}

export function Swimlane({ swimlane }: SwimlaneProps) {
  const [ideaDialogOpen, setIdeaDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <div className={styles.swimlane}>
      <div className={styles.header}>
        <span className={styles.title}>{swimlane.name}</span>

        <IconButton
          variant="ghost"
          color="gray"
          size="1"
          onClick={() => setIdeaDialogOpen(true)}
        >
          <Plus size={18} />
        </IconButton>

        <Dropdown>
          <DropdownTrigger>
            <IconButton variant="ghost" color="gray" size="1">
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
        {swimlane.ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}

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
