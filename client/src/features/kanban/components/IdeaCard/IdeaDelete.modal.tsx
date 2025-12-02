import { useMutation } from "@apollo/client/react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Button, Flex } from "@radix-ui/themes";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../../../../components/ui/Dialog";
import { DELETE_IDEA } from "../../api/mutations";
import { deleteLocalIdea } from "../../hooks/useLocalKanban.utils";
import type { Kanban } from "../../types";

interface IdeaDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ideaId: string;
  ideaName: string;
  kanban: Kanban;
  setKanban: (kanban: Kanban) => void;
}

export function IdeaDeleteModal({
  open,
  onOpenChange,
  ideaId,
  ideaName,
  kanban,
  setKanban,
}: IdeaDeleteModalProps) {
  const [deleteIdea, { loading }] = useMutation(DELETE_IDEA);

  const handleDelete = () => {
    if (loading) return;

    setKanban(deleteLocalIdea(kanban, ideaId));
    deleteIdea({ variables: { id: ideaId } });
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>Delete "{ideaName}"</AlertDialogTitle>
        <AlertDialogDescription>
          This idea will be permanently deleted. This action cannot be undone.
        </AlertDialogDescription>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialogPrimitive.Cancel asChild>
            <Button variant="soft" color="gray" disabled={loading}>
              Cancel
            </Button>
          </AlertDialogPrimitive.Cancel>
          <AlertDialogPrimitive.Action asChild>
            <Button color="red" onClick={handleDelete} loading={loading}>
              Delete
            </Button>
          </AlertDialogPrimitive.Action>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
}
