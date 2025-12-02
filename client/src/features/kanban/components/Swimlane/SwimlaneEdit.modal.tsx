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
import { UPDATE_SWIMLANE } from "../../api/mutations";
import { renameLocalSwimlane } from "../../hooks/useLocalKanban.utils";
import type { Kanban } from "../../types";

interface SwimlaneEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  swimlaneId: string;
  currentName: string;
  kanban: Kanban;
  setKanban: (kanban: Kanban) => void;
}

export function SwimlaneEditModal({
  open,
  onOpenChange,
  swimlaneId,
  currentName,
  kanban,
  setKanban,
}: SwimlaneEditModalProps) {
  const [name, setName] = useState(currentName);
  const [updateSwimlane, { loading }] = useMutation(UPDATE_SWIMLANE);

  useEffect(() => {
    if (open) setName(currentName);
  }, [open, currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === currentName || loading) return;

    setKanban(renameLocalSwimlane(kanban, swimlaneId, name));
    updateSwimlane({ variables: { id: swimlaneId, name } });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Rename Group</DialogTitle>
        <DialogDescription>
          Change the name of this group to better organize your ideas.
        </DialogDescription>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="2" mb="4">
            <Text as="label" size="2" weight="medium" htmlFor="group-name">
              Name
            </Text>
            <TextField.Root
              id="group-name"
              size="2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name..."
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
