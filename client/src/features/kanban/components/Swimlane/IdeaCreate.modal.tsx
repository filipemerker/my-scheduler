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
import { CREATE_IDEA } from "../../api/mutations";
import { createLocalIdea } from "../../hooks/useLocalKanban.utils";
import type { Kanban, Idea, CreateIdeaData } from "../../types";

interface IdeaCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  swimlaneId: string;
  kanban: Kanban;
  setKanban: (kanban: Kanban) => void;
}

export function IdeaCreateModal({
  open,
  onOpenChange,
  swimlaneId,
  kanban,
  setKanban,
}: IdeaCreateModalProps) {
  const [name, setName] = useState("");
  const [createIdea, { loading }] = useMutation<CreateIdeaData>(CREATE_IDEA);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;

    createIdea({ variables: { name, swimlaneId } }).then((response) => {
      if (!response.data) return;

      const newIdea: Idea = {
        id: response.data.createIdea.id,
        name: response.data.createIdea.name,
        description: response.data.createIdea.description,
        swimlaneId: response.data.createIdea.swimlaneId,
        createdAt: new Date().toISOString(),
      };

      setKanban(createLocalIdea(kanban, swimlaneId, newIdea));
      setName("");
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
