import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import * as Separator from "@radix-ui/react-separator";
import { Plus } from "lucide-react";
import { GET_KANBAN } from "../../api/queries";
import type { GetKanbanData } from "../../types";
import { Swimlane } from "../Swimlane/Swimlane";
import { SwimlaneCreateModal } from "./SwimlaneCreate.modal";
import styles from "./IdeasPage.module.css";

export function IdeasPage() {
  const { data, loading } = useQuery<GetKanbanData>(GET_KANBAN);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  if (loading) return <p className={styles.loading}>Loading...</p>;

  const swimlanes = data?.kanban?.swimlanes || [];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ideas</h1>
      </header>

      <Separator.Root className={styles.separator} />

      <div className={styles.board}>
        {swimlanes.map((swimlane) => (
          <Swimlane key={swimlane.id} swimlane={swimlane} />
        ))}

        <button
          className={styles.addColumnButton}
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus size={18} />
          New Group
        </button>
      </div>

      <SwimlaneCreateModal
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
