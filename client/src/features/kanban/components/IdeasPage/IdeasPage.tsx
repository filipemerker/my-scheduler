import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import * as Separator from "@radix-ui/react-separator";
import { Box, Text, Link, SegmentedControl } from "@radix-ui/themes";
import { ArrowUpRight, LayoutGrid, Kanban } from "lucide-react";
import { GET_KANBAN } from "../../api/queries";
import type { GetKanbanData } from "../../types";
import { useLocalKanban } from "../../hooks/useLocalKanban";
import { KanbanSkeleton } from "../Skeleton";
import { KanbanView } from "../KanbanView";
import { GalleryView } from "../GalleryView";
import styles from "./IdeasPage.module.css";

type ViewMode = "board" | "gallery";

export function IdeasPage() {
  const { data, loading, refetch } = useQuery<GetKanbanData>(GET_KANBAN);
  const [viewMode, setViewMode] = useState<ViewMode>("board");

  const { kanban, setKanban, startDragging, stopDragging } = useLocalKanban(
    data?.kanban
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ideas</h1>

        <div className={styles.segmentedControlContainer}>
          <SegmentedControl.Root
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
            radius="medium"
            className={styles.segmentedControl}
          >
            <SegmentedControl.Item value="board">
              <div className={styles.viewIconContainer}>
                <Kanban size={14} className={styles.viewIcon} />
                Board
              </div>
            </SegmentedControl.Item>
            <SegmentedControl.Item value="gallery">
              <div className={styles.viewIconContainer}>
                <LayoutGrid size={14} className={styles.viewIcon} />
                Gallery
              </div>
            </SegmentedControl.Item>
          </SegmentedControl.Root>
        </div>
      </header>

      <Separator.Root className={styles.separator} />

      {loading || !kanban ? (
        <KanbanSkeleton />
      ) : viewMode === "gallery" ? (
        <GalleryView swimlanes={kanban.swimlanes} />
      ) : (
        <KanbanView
          kanban={kanban}
          setKanban={setKanban}
          startDragging={startDragging}
          stopDragging={stopDragging}
          refetch={refetch}
        />
      )}

      <Box p="2" className={styles.demoNotice}>
        <Text as="p" size="2" color="gray">
          This temporary demo was created by{" "}
          <Link href="https://filipemerker.github.io/" target="_blank">
            Philip
            <ArrowUpRight size={13} className={styles.externalLink} />
          </Link>
        </Text>
        <Text as="p" size="1" color="gray" mt="2">
          Content present on the board is not mine and can be edited by anyone
          with access to this page without moderation. Feel free to respectfuly
          mess around ❤️.
        </Text>
      </Box>
    </div>
  );
}
