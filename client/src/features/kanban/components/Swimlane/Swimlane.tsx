import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import * as Dialog from "@radix-ui/react-dialog";
import { IconButton, TextField, Button, Flex } from "@radix-ui/themes";
import { Plus } from "lucide-react";
import { CREATE_IDEA } from "../../api/mutations";
import { GET_KANBAN } from "../../api/queries";
import type { Swimlane as SwimlaneType, CreateIdeaData } from "../../types";
import { IdeaCard } from "../IdeaCard/IdeaCard";
import styles from "./Swimlane.module.css";

interface SwimlaneProps {
  swimlane: SwimlaneType;
}

export function Swimlane({ swimlane }: SwimlaneProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const [createIdea] = useMutation<CreateIdeaData>(CREATE_IDEA, {
    refetchQueries: [{ query: GET_KANBAN }],
    onCompleted: () => {
      setName("");
      setOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createIdea({ variables: { name, swimlaneId: swimlane.id } });
  };

  return (
    <div className={styles.swimlane}>
      <div className={styles.header}>
        <span className={styles.title}>{swimlane.name}</span>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <IconButton variant="ghost" color="gray" size="1">
              <Plus size={18} />
            </IconButton>
          </Dialog.Trigger>

          <Dialog.Overlay className={styles.overlay} />

          <Dialog.Content className={styles.dialog}>
            <Dialog.Title className={styles.dialogTitle}>New Idea</Dialog.Title>
            <form onSubmit={handleSubmit}>
              <Flex gap="2">
                <TextField.Root
                  style={{ flex: 1 }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Idea name..."
                  autoFocus
                />

                <Button type="submit" disabled={!name.trim()}>
                  Add
                </Button>
              </Flex>
            </form>
          </Dialog.Content>
        </Dialog.Root>
      </div>

      <div className={styles.ideas}>
        {swimlane.ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}

        <Button
          className={styles.newIdeaButton}
          variant="ghost"
          color="gray"
          onClick={() => setOpen(true)}
        >
          <Plus size={16} />
          New Idea
        </Button>
      </div>
    </div>
  );
}
