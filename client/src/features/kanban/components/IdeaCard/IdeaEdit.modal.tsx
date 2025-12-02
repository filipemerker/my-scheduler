import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client/react";
import { TextField, Button, Flex, Text } from "@radix-ui/themes";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../../../components/ui/Dialog";
import { UPDATE_IDEA } from "../../api/mutations";
import { renameLocalIdea } from "../../hooks/useLocalKanban.utils";
import type { Kanban } from "../../types";

interface IdeaEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ideaId: string;
  currentName: string;
  kanban: Kanban;
  setKanban: (kanban: Kanban) => void;
}

export function IdeaEditModal({
  open,
  onOpenChange,
  ideaId,
  currentName,
  kanban,
  setKanban,
}: IdeaEditModalProps) {
  const [name, setName] = useState(currentName);
  const [updateIdea, { loading }] = useMutation(UPDATE_IDEA);

  useEffect(() => {
    if (open) setName(currentName);
  }, [open, currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === currentName || loading) return;

    setKanban(renameLocalIdea(kanban, ideaId, name));
    updateIdea({ variables: { id: ideaId, name } });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Rename Idea</DialogTitle>
        <DialogDescription>Update the name of this idea.</DialogDescription>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="2" mb="4">
            <Text as="label" size="2" weight="medium" htmlFor="idea-name">
              Name
            </Text>
            <TextField.Root
              id="idea-name"
              size="2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter idea name..."
              autoFocus
              disabled={loading}
              maxLength={500}
            />
          </Flex>

          <Flex gap="3" justify="end">
            <DialogClose asChild>
              <Button variant="soft" color="gray" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              color="indigo"
              type="submit"
              disabled={!name.trim() || name === currentName || loading}
              loading={loading}
            >
              Save
            </Button>
          </Flex>
        </form>
      </DialogContent>
    </Dialog>
  );
}
