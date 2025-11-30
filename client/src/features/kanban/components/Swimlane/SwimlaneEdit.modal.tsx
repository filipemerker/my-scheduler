import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client/react";
import { TextField, Button, Flex, Text } from "@radix-ui/themes";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../../../components/ui/Dialog";
import { UPDATE_SWIMLANE } from "../../api/mutations";
import { GET_KANBAN } from "../../api/queries";

interface SwimlaneEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  swimlaneId: string;
  currentName: string;
}

export function SwimlaneEditModal({
  open,
  onOpenChange,
  swimlaneId,
  currentName,
}: SwimlaneEditModalProps) {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (open) setName(currentName);
  }, [open, currentName]);

  const [updateSwimlane] = useMutation(UPDATE_SWIMLANE, {
    refetchQueries: [{ query: GET_KANBAN }],
    onCompleted: () => onOpenChange(false),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === currentName) return;
    updateSwimlane({ variables: { id: swimlaneId, name } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
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
            />
          </Flex>

          <Flex gap="3" justify="end">
            <DialogClose asChild>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!name.trim() || name === currentName}
            >
              Save
            </Button>
          </Flex>
        </form>
      </DialogContent>
    </Dialog>
  );
}
