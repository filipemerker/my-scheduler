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
import { GET_KANBAN } from "../../api/queries";

interface IdeaDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ideaId: string;
  ideaName: string;
}

export function IdeaDeleteModal({
  open,
  onOpenChange,
  ideaId,
  ideaName,
}: IdeaDeleteModalProps) {
  const [deleteIdea, { loading }] = useMutation(DELETE_IDEA, {
    refetchQueries: [{ query: GET_KANBAN }],
    onCompleted: () => onOpenChange(false),
  });

  const handleDelete = () => {
    if (loading) return;
    deleteIdea({ variables: { id: ideaId } });
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
