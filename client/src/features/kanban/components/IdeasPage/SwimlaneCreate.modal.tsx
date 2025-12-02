import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { TextField, Button, Flex, Text } from "@radix-ui/themes";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../../../components/ui/Dialog";
import { CREATE_SWIMLANE } from "../../api/mutations";
import { createLocalSwimlane } from "../../hooks/useLocalKanban.utils";
import type { Kanban, Swimlane, CreateSwimlaneData } from "../../types";

interface SwimlaneCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kanban: Kanban;
  setKanban: (kanban: Kanban) => void;
}

export function SwimlaneCreateModal({
  open,
  onOpenChange,
  kanban,
  setKanban,
}: SwimlaneCreateModalProps) {
  const [name, setName] = useState("");
  const [createSwimlane, { loading }] =
    useMutation<CreateSwimlaneData>(CREATE_SWIMLANE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;

    createSwimlane({ variables: { name } }).then((response) => {
      if (!response.data) return;

      const newSwimlane: Swimlane = {
        id: response.data.createSwimlane.id,
        name: response.data.createSwimlane.name,
        ideaItemOrder: [],
        ideas: [],
        createdAt: new Date().toISOString(),
      };

      setKanban(createLocalSwimlane(kanban, newSwimlane));
      setName("");
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>New Group</DialogTitle>
        <DialogDescription>
          Create a new group to organize your ideas.
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
              color="indigo"
              type="submit"
              disabled={!name.trim() || loading}
              loading={loading}
            >
              Create
            </Button>
          </Flex>
        </form>
      </DialogContent>
    </Dialog>
  );
}
