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
import { GET_KANBAN } from "../../api/queries";

interface IdeaEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ideaId: string;
  currentName: string;
}

export function IdeaEditModal({
  open,
  onOpenChange,
  ideaId,
  currentName,
}: IdeaEditModalProps) {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (open) setName(currentName);
  }, [open, currentName]);

  const [updateIdea, { loading }] = useMutation(UPDATE_IDEA, {
    refetchQueries: [{ query: GET_KANBAN }],
    onCompleted: () => onOpenChange(false),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === currentName || loading) return;
    updateIdea({ variables: { id: ideaId, name } });
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
