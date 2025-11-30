import { useQuery, useMutation } from "@apollo/client/react";
import * as Separator from "@radix-ui/react-separator";
import { Plus } from "lucide-react";
import { GET_KANBAN } from "../../api/queries";
import { CREATE_SWIMLANE } from "../../api/mutations";
import type { GetKanbanData, CreateSwimlaneData } from "../../types";
import { Swimlane } from "../Swimlane/Swimlane";
import styles from "./IdeasPage.module.css";

export function IdeasPage() {
  const { data, loading } = useQuery<GetKanbanData>(GET_KANBAN);
  const [createSwimlane] = useMutation<CreateSwimlaneData>(CREATE_SWIMLANE, {
    refetchQueries: [{ query: GET_KANBAN }],
  });

  const handleNewGroup = () => {
    createSwimlane({ variables: { name: "New Group" } });
  };

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

        <button className={styles.addColumnButton} onClick={handleNewGroup}>
          <Plus size={18} />
          New Group
        </button>
      </div>
    </div>
  );
}
