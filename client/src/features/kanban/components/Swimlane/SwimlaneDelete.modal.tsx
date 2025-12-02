import { useMutation } from "@apollo/client/react";
import { Button, Flex } from "@radix-ui/themes";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../../../components/ui/Dialog";
import { DELETE_SWIMLANE } from "../../api/mutations";
import { deleteLocalSwimlane } from "../../hooks/useLocalKanban.utils";
import type { Kanban } from "../../types";

interface SwimlaneDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  swimlaneId: string;
  swimlaneName: string;
  kanban: Kanban;
  setKanban: (kanban: Kanban) => void;
}

export function SwimlaneDeleteModal({
  open,
  onOpenChange,
  swimlaneId,
  swimlaneName,
  kanban,
  setKanban,
}: SwimlaneDeleteModalProps) {
  const [deleteSwimlane, { loading }] = useMutation(DELETE_SWIMLANE);

  const handleDelete = () => {
    if (loading) return;

    setKanban(deleteLocalSwimlane(kanban, swimlaneId));
    deleteSwimlane({ variables: { id: swimlaneId } });
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>Delete "{swimlaneName}" Group</AlertDialogTitle>
        <AlertDialogDescription>
          This group and its ideas will be permanently deleted. This action
          cannot be undone.
        </AlertDialogDescription>
        <Flex gap="3" justify="end">
          <AlertDialogCancel asChild>
            <Button variant="soft" color="gray" disabled={loading}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button color="red" onClick={handleDelete} loading={loading}>
              Delete
            </Button>
          </AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
}
