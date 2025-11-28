import { useQuery } from "@apollo/client/react";
import { GET_DRAFTS } from "../../api/queries";
import type { GetDraftsData } from "../../types";
import { DraftForm } from "../DraftForm/DraftForm";
import { DraftList } from "../DraftList/DraftList";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const { data, refetch } = useQuery<GetDraftsData>(GET_DRAFTS);
  const nextOrder = data?.drafts.length || 0;

  return (
    <div className={styles.sidebar}>
      <DraftForm onDraftCreated={refetch} nextOrder={nextOrder} />
      <DraftList />
    </div>
  );
}
