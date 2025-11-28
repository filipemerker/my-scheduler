import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_DRAFT } from "../../api/mutations";
import type { CreateDraftVariables, CreateDraftData } from "../../types";
import { TextField } from "../../../../components/ui/TextField/TextField";
import { Button } from "../../../../components/ui/Button/Button";
import styles from "./DraftForm.module.css";

interface DraftFormProps {
  onDraftCreated: () => void;
  nextOrder: number;
}

export function DraftForm({ onDraftCreated, nextOrder }: DraftFormProps) {
  const [content, setContent] = useState("");

  const [createDraft] = useMutation<CreateDraftData, CreateDraftVariables>(CREATE_DRAFT, {
    onCompleted: () => {
      setContent("");
      onDraftCreated();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await createDraft({
      variables: {
        content,
        order: nextOrder,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <TextField
        value={content}
        onChange={setContent}
        placeholder="Write your draft content..."
        required
      />
      <Button type="submit" disabled={!content.trim()}>
        Create Draft
      </Button>
    </form>
  );
}
