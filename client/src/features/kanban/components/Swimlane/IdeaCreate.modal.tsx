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
import { CREATE_IDEA } from "../../api/mutations";
import { GET_KANBAN } from "../../api/queries";

interface IdeaCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  swimlaneId: string;
}

export function IdeaCreateModal({
  open,
  onOpenChange,
  swimlaneId,
}: IdeaCreateModalProps) {
  const [name, setName] = useState("");

  const [createIdea, { loading }] = useMutation(CREATE_IDEA, {
    refetchQueries: [{ query: GET_KANBAN }],
    onCompleted: () => {
      setName("");
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;
    createIdea({ variables: { name, swimlaneId } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent>
        <DialogTitle>New Idea</DialogTitle>
        <DialogDescription>
          Add a new idea to this group. Give it a clear, descriptive name.
        </DialogDescription>

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
