import { useQuery, useMutation } from "@apollo/client/react";
import { GET_DRAFTS } from "../../api/queries";
import { DELETE_DRAFT } from "../../api/mutations";
import type { GetDraftsData, DeleteDraftVariables, DeleteDraftData } from "../../types";
import { Button } from "../../../../components/ui/Button/Button";
import styles from "./DraftList.module.css";

export function DraftList() {
  const { loading, error, data, refetch } = useQuery<GetDraftsData>(GET_DRAFTS);
  const [deleteDraft] = useMutation<DeleteDraftData, DeleteDraftVariables>(DELETE_DRAFT, {
    onCompleted: () => refetch(),
  });

  const handleDelete = async (id: string) => {
    await deleteDraft({ variables: { id } });
  };

  if (loading) return <p>Loading drafts...</p>;
  if (error) return <p>Error loading drafts: {error.message}</p>;

  if (data?.drafts.length === 0) return null;

  return (
    <div className={styles.list}>
      {data?.drafts.map((draft) => (
        <div key={draft.id} className={styles.draft}>
          <span className={styles.content}>{draft.content}</span>
          <Button onClick={() => handleDelete(draft.id)}>Delete</Button>
        </div>
      ))}
    </div>
  );
}
