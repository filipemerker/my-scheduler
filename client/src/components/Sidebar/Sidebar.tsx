import { useQuery } from "@apollo/client/react";
import { GET_DRAFTS } from "../../features/drafts/api/queries";
import type { GetDraftsData } from "../../features/drafts/types";
import { DraftForm } from "../../features/drafts/components/DraftForm/DraftForm";
import { DraftList } from "../../features/drafts/components/DraftList/DraftList";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const { data, refetch } = useQuery<GetDraftsData>(GET_DRAFTS);
  const nextOrder = data?.drafts.length || 0;

  return (
    <div className={styles.sidebar}>
      <h1 className={styles.title}>Content Drafts</h1>
      <DraftForm onDraftCreated={refetch} nextOrder={nextOrder} />
      <DraftList />
    </div>
  );
}
