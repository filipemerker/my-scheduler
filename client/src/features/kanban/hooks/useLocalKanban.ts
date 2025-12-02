import { useState, useEffect, useRef } from "react";
import type { Kanban } from "../types";

export function useLocalKanban(serverKanban: Kanban | null | undefined) {
  const [kanban, setKanban] = useState<Kanban | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (serverKanban && !initialized.current) {
      setKanban(serverKanban);
      initialized.current = true;
    }
  }, [serverKanban]);

  return { kanban, setKanban };
}
