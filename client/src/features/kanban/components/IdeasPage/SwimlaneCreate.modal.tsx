import { useState } from "react";
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
import { CREATE_SWIMLANE } from "../../api/mutations";
import { GET_KANBAN } from "../../api/queries";

interface SwimlaneCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SwimlaneCreateModal({
  open,
  onOpenChange,
}: SwimlaneCreateModalProps) {
  const [name, setName] = useState("");

  const [createSwimlane, { loading }] = useMutation(CREATE_SWIMLANE, {
    refetchQueries: [{ query: GET_KANBAN }],
    onCompleted: () => {
      setName("");
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;
    createSwimlane({ variables: { name } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
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
