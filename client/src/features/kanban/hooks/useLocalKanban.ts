import { useState, useEffect, useRef, useCallback } from "react";
import type { Kanban } from "../types";

export function useLocalKanban(serverKanban: Kanban | null | undefined) {
  const [localKanban, setLocalKanban] = useState<Kanban | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (serverKanban && !isDraggingRef.current) {
      setLocalKanban(serverKanban);
    }
  }, [serverKanban]);

  const startDragging = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const stopDragging = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  return {
    kanban: localKanban,
    setKanban: setLocalKanban,
    startDragging,
    stopDragging,
  };
}
